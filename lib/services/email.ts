import { Resend } from "resend";
import { env, hasResendEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";

let resendClient: Resend | null = null;

type LeadEmailPayload = {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  source?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatSubmissionTimestamp() {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function getResendClient() {
  if (!hasResendEnv) {
    throw new Error("Resend is not configured. Add RESEND_API_KEY to enable form email delivery.");
  }

  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }

  return resendClient;
}

async function sendEmailOrThrow(
  client: Resend,
  payload: Parameters<Resend["emails"]["send"]>[0],
  context: string,
) {
  console.info("[Resend] attempting email send", {
    context,
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
  });

  const { data, error } = await client.emails.send(payload);

  if (error) {
    console.error("[Resend] email delivery failed", {
      context,
      error,
      to: payload.to,
      subject: payload.subject,
    });
    throw new Error(error.message || `Unable to deliver ${context} email.`);
  }

  if (!data?.id) {
    console.error("[Resend] email send returned no id", {
      context,
      data,
      to: payload.to,
      subject: payload.subject,
    });
    throw new Error(`Resend did not confirm the ${context} email send.`);
  }

  console.info("[Resend] email delivered", {
    context,
    emailId: data?.id,
    to: payload.to,
    subject: payload.subject,
  });

  return data;
}

export async function sendLeadEmails(payload: LeadEmailPayload) {
  const client = getResendClient();
  const submittedAt = formatSubmissionTimestamp();
  const source = payload.source || "Website Inquiry";
  const course = payload.course || "General Inquiry";
  const message = payload.message || "-";
  const replyTo = payload.email || siteConfig.email;
  const recipient = siteConfig.email;

  const internalHtml = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
      <h2 style="margin:0 0 16px">New ${escapeHtml(source)} submission</h2>
      <table style="border-collapse:collapse;width:100%">
        <tbody>
          <tr><td style="padding:8px 0;font-weight:700;width:180px">Name</td><td style="padding:8px 0">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Email</td><td style="padding:8px 0">${escapeHtml(payload.email || "-")}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Phone</td><td style="padding:8px 0">${escapeHtml(payload.phone)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Course</td><td style="padding:8px 0">${escapeHtml(course)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Message</td><td style="padding:8px 0">${escapeHtml(message)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Submitted</td><td style="padding:8px 0">${escapeHtml(submittedAt)}</td></tr>
        </tbody>
      </table>
    </div>
  `;

  const internalText = [
    `New ${source} submission`,
    `Name: ${payload.name}`,
    `Email: ${payload.email || "-"}`,
    `Phone: ${payload.phone}`,
    `Course: ${course}`,
    `Message: ${message}`,
    `Submitted: ${submittedAt}`,
  ].join("\n");

  await sendEmailOrThrow(
    client,
    {
      from: env.resendFromEmail,
      to: recipient,
      replyTo,
      subject: `${source}: ${course}`,
      html: internalHtml,
      text: internalText,
    },
    "lead notification",
  );

  if (!payload.email) {
    return { success: true };
  }

  try {
    await sendEmailOrThrow(
      client,
      {
        from: env.resendFromEmail,
        to: payload.email,
        replyTo: recipient,
        subject: `We received your ${source.toLowerCase()} request`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
            <p>Hi ${escapeHtml(payload.name)},</p>
            <p>We have received your request for <strong>${escapeHtml(course)}</strong>.</p>
            <p>Our team will contact you shortly on ${escapeHtml(payload.phone)}.</p>
            <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
            <p>Regards,<br />GenZNext Research &amp; Training</p>
          </div>
        `,
        text: [
          `Hi ${payload.name},`,
          `We have received your request for ${course}.`,
          `Our team will contact you shortly on ${payload.phone}.`,
          `Submitted: ${submittedAt}`,
          "Regards,",
          "GenZNext Research & Training",
        ].join("\n"),
      },
      "lead acknowledgement",
    );
  } catch (error) {
    console.error("[Resend] acknowledgement email failed", {
      error,
      to: payload.email,
      source,
    });
  }

  return { success: true };
}

export async function sendEnrollmentEmail(payload: {
  name: string;
  email: string;
  courseTitle?: string;
  courseTitles?: string[];
  paymentId: string;
  amountLabel: string;
}) {
  if (!payload.email.trim()) {
    return { success: true };
  }

  const client = getResendClient();
  const courseTitles = payload.courseTitles?.length ? payload.courseTitles : payload.courseTitle ? [payload.courseTitle] : [];
  const courseLine = courseTitles.join(", ");
  const courseLabel = courseTitles.length > 1 ? `${courseTitles.length} selected programs` : courseTitles[0] || "your selected course";
  const courseListHtml = courseTitles.map((course) => `<li>${escapeHtml(course)}</li>`).join("");

  await sendEmailOrThrow(
    client,
    {
      from: env.resendFromEmail,
      to: payload.email,
      replyTo: siteConfig.email,
      subject: `Enrollment confirmed for ${courseLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7">
          <p>Hi ${escapeHtml(payload.name)},</p>
          <p>Your enrollment for <strong>${escapeHtml(courseLabel)}</strong> is confirmed.</p>
          ${courseTitles.length > 1 ? `<p><strong>Programs included:</strong></p><ul>${courseListHtml}</ul>` : ""}
          <p><strong>Amount:</strong> ${escapeHtml(payload.amountLabel)}</p>
          <p><strong>Payment ID:</strong> ${escapeHtml(payload.paymentId)}</p>
          <p>Our team will share your onboarding instructions shortly.</p>
        </div>
      `,
      text: [
        `Hi ${payload.name},`,
        `Your enrollment for ${courseLabel} is confirmed.`,
        courseLine ? `Programs: ${courseLine}` : "",
        `Amount: ${payload.amountLabel}`,
        `Payment ID: ${payload.paymentId}`,
        "Our team will share your onboarding instructions shortly.",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    "enrollment confirmation",
  );
}
