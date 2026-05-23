import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env, hasGmailEmailEnv, hasResendEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";

let resendClient: Resend | null = null;
let gmailTransporter: nodemailer.Transporter | null = null;
const EM_DASH = "\u2014";

type LeadEmailPayload = {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  source?: string;
};

type EnrollmentEmailPayload = {
  name: string;
  email: string;
  phone: string;
  courseTitle?: string;
  courseTitles?: string[];
  paymentId: string;
  amountLabel: string;
  enrolledAt?: string;
};

type EmailDispatchPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  context: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatSubmissionTimestamp(value?: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(value ? new Date(value) : new Date());
}

function getSupportRecipient() {
  return env.admissionsEmail || siteConfig.admissionsEmail;
}

function getResendClient() {
  if (!hasResendEnv) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }

  return resendClient;
}

function getGmailTransporter() {
  if (!hasGmailEmailEnv) {
    return null;
  }

  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.gmailUser,
        pass: env.gmailAppPassword,
      },
    });
  }

  return gmailTransporter;
}

async function sendEmailOrThrow(payload: EmailDispatchPayload) {
  const resend = getResendClient();

  console.info("[Email] attempting email send", {
    context: payload.context,
    to: payload.to,
    subject: payload.subject,
    provider: resend ? "resend" : hasGmailEmailEnv ? "gmail" : "none",
  });

  if (resend) {
    const { data, error } = await resend.emails.send({
      from: env.resendFromEmail,
      to: payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    if (error || !data?.id) {
      console.error("[Email] Resend delivery failed", {
        context: payload.context,
        error,
        data,
      });
      throw new Error(error?.message || `Unable to deliver ${payload.context} email via Resend.`);
    }

    return data;
  }

  const transporter = getGmailTransporter();

  if (!transporter) {
    throw new Error(
      "Email delivery is not configured. Add RESEND_API_KEY or set GMAIL_USER and GMAIL_APP_PASSWORD.",
    );
  }

  const info = await transporter.sendMail({
    from: env.gmailUser,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  if (!info.messageId) {
    throw new Error(`Unable to deliver ${payload.context} email via Gmail.`);
  }

  return info;
}

function resolveLeadSubject(source: string, name: string) {
  if (/admissions/i.test(source)) {
    return `New Admissions Inquiry ${EM_DASH} ${name}`;
  }

  return `New Demo Request ${EM_DASH} ${name}`;
}

export async function sendLeadEmails(payload: LeadEmailPayload) {
  const submittedAt = formatSubmissionTimestamp();
  const source = payload.source || "Website Inquiry";
  const course = payload.course || "";
  const message = payload.message || "";
  const replyTo = payload.email || undefined;
  const recipient = getSupportRecipient();
  const subject = resolveLeadSubject(source, payload.name);

  const internalHtml = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
      <h2 style="margin:0 0 16px">${escapeHtml(subject)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email || "-")}</p>
      <p><strong>Course Interest:</strong> ${escapeHtml(course || "-")}</p>
      <p><strong>Message:</strong> ${escapeHtml(message || "-")}</p>
      <p><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
      <p><strong>Source:</strong> ${escapeHtml(source)}</p>
    </div>
  `;

  const internalText = [
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email || "-"}`,
    `Course Interest: ${course || "-"}`,
    `Message: ${message || "-"}`,
    `Submitted at: ${submittedAt}`,
    `Source: ${source}`,
  ].join("\n");

  await sendEmailOrThrow({
    to: recipient,
    replyTo,
    subject,
    html: internalHtml,
    text: internalText,
    context: "lead notification",
  });

  if (!payload.email.trim()) {
    return { success: true };
  }

  try {
    await sendEmailOrThrow({
      to: payload.email,
      replyTo: recipient,
      subject: "We received your request",
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
          <p>Hi ${escapeHtml(payload.name)},</p>
          <p>We have received your request and our team will contact you shortly.</p>
          <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
          <p><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
          <p>Regards,<br />GenZNext Research &amp; Training</p>
        </div>
      `,
      text: [
        `Hi ${payload.name},`,
        "We have received your request and our team will contact you shortly.",
        `Phone: ${payload.phone}`,
        `Submitted at: ${submittedAt}`,
        "Regards,",
        "GenZNext Research & Training",
      ].join("\n"),
      context: "lead acknowledgement",
    });
  } catch (error) {
    console.error("[Email] acknowledgement email failed", {
      error,
      to: payload.email,
      source,
    });
  }

  return { success: true };
}

export async function sendEnrollmentEmail(payload: EnrollmentEmailPayload) {
  const recipient = getSupportRecipient();
  const courseTitles = payload.courseTitles?.length
    ? payload.courseTitles
    : payload.courseTitle
      ? [payload.courseTitle]
      : [];
  const primaryCourse = courseTitles[0] || "Course Enrollment";
  const courseLabel =
    courseTitles.length > 1 ? `${primaryCourse} + ${courseTitles.length - 1} more` : primaryCourse;
  const courseLine = courseTitles.length ? courseTitles.join(", ") : primaryCourse;
  const enrolledAt = formatSubmissionTimestamp(payload.enrolledAt);

  await sendEmailOrThrow({
    to: recipient,
    replyTo: payload.email || undefined,
    subject: `New Enrollment ${EM_DASH} ${courseLabel}`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
        <h2 style="margin:0 0 16px">New Enrollment ${EM_DASH} ${escapeHtml(courseLabel)}</h2>
        <p><strong>Student:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Course:</strong> ${escapeHtml(courseLine)}</p>
        <p><strong>Amount Paid:</strong> ${escapeHtml(payload.amountLabel)}</p>
        <p><strong>Razorpay ID:</strong> ${escapeHtml(payload.paymentId || "-")}</p>
        <p><strong>Enrolled at:</strong> ${escapeHtml(enrolledAt)}</p>
      </div>
    `,
    text: [
      `Student: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Course: ${courseLine}`,
      `Amount Paid: ${payload.amountLabel}`,
      `Razorpay ID: ${payload.paymentId || "-"}`,
      `Enrolled at: ${enrolledAt}`,
    ].join("\n"),
    context: "enrollment notification",
  });

  if (!payload.email.trim()) {
    return { success: true };
  }

  try {
    await sendEmailOrThrow({
      to: payload.email,
      replyTo: recipient,
      subject: `Enrollment confirmed for ${courseLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
          <p>Hi ${escapeHtml(payload.name)},</p>
          <p>Your enrollment for <strong>${escapeHtml(courseLabel)}</strong> is confirmed.</p>
          <p><strong>Amount:</strong> ${escapeHtml(payload.amountLabel)}</p>
          <p><strong>Payment ID:</strong> ${escapeHtml(payload.paymentId || "-")}</p>
          <p>Our team will share your onboarding instructions shortly.</p>
        </div>
      `,
      text: [
        `Hi ${payload.name},`,
        `Your enrollment for ${courseLabel} is confirmed.`,
        `Amount: ${payload.amountLabel}`,
        `Payment ID: ${payload.paymentId || "-"}`,
        "Our team will share your onboarding instructions shortly.",
      ].join("\n"),
      context: "enrollment confirmation",
    });
  } catch (error) {
    console.error("[Email] enrollment confirmation email failed", {
      error,
      to: payload.email,
      courseLabel,
    });
  }

  return { success: true };
}
