"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { allCourses } from "@/data/courses";

type LeadFormProps = {
  includeMessage?: boolean;
  className?: string;
  submitLabel?: string;
  source?: string;
  initialCourse?: string;
  initialMessage?: string;
  variant?: "default" | "compact";
  tone?: "dark" | "light";
};

const courseOptions = [
  "AI",
  "Generative AI",
  "Agentic AI",
  "DevSecOps",
  "AWS Certifications",
  "Azure Certifications",
  "Corporate Training",
  "LMS Access",
  ...allCourses.map((course) => course.title),
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  course: "",
  message: "",
};

export function LeadForm({
  includeMessage = false,
  className,
  submitLabel = "Get Free Career Consultation",
  source = "Course Inquiry Form",
  initialCourse = "",
  initialMessage = "",
  variant = "default",
  tone = "dark",
}: LeadFormProps) {
  const pathname = usePathname();
  const [form, setForm] = useState({
    ...initialState,
    course: initialCourse,
    message: initialMessage,
  });
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const compact = variant === "compact";
  const lightTone = tone === "light";
  const labelClass = lightTone
    ? "mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a6945]"
    : "form-label";
  const fieldClass = lightTone
    ? "w-full rounded-[14px] border border-[#ead8c2] bg-[#fffdfa] px-4 py-3 text-[14px] text-[#1f2937] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-[#b8a38d] focus:border-[#fb923c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
    : "form-field";
  const compactFieldClass = lightTone
    ? `${fieldClass} rounded-[16px] px-4 py-3.5 text-[13px]`
    : "rounded-xl px-4 py-3 text-[13px]";
  const buttonClass = lightTone
    ? "mt-5 inline-flex w-full items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#f97316,#fb923c)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(249,115,22,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(249,115,22,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
    : `inline-flex w-full items-center justify-center bg-[linear-gradient(135deg,#4F46E5,#2563EB)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(249,115,22,0.34),0_0_24px_rgba(251,146,60,0.16)] disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "mt-4 rounded-2xl px-5 py-3.5" : "mt-5 rounded-lg px-5 py-[13px]"}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);
    setIsSuccess(false);

    try {
      const matchedCourse = allCourses.find(
        (course) => course.title === form.course || course.title === initialCourse,
      );
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          course: form.course,
          message: form.message,
          source,
          pageUrl,
          courseSlug: matchedCourse?.slug || pathname.replace(/^\/+/, ""),
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit your inquiry right now.");
      }

      setIsSuccess(true);
      setFeedback(result.message || "Your request has been submitted successfully.");
      setForm({
        ...initialState,
        course: initialCourse,
        message: initialMessage,
      });
    } catch (error) {
      setIsSuccess(false);
      setFeedback(error instanceof Error ? error.message : "Unable to submit your inquiry right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className={`grid ${compact ? "gap-3 sm:grid-cols-2" : "gap-4 sm:grid-cols-2"}`}>
        <div>
          <label className={labelClass} htmlFor="lead-name">
            Name
          </label>
          <input
            id="lead-name"
            className={`${fieldClass} ${compact ? compactFieldClass : ""}`}
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lead-email">
            Email (Optional)
          </label>
          <input
            id="lead-email"
            className={`${fieldClass} ${compact ? compactFieldClass : ""}`}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </div>
      </div>
      <div className={`${compact ? "mt-3 grid gap-3 sm:grid-cols-2" : "mt-4 grid gap-4 sm:grid-cols-2"}`}>
        <div>
          <label className={labelClass} htmlFor="lead-phone">
            Phone
          </label>
          <input
            id="lead-phone"
            className={`${fieldClass} ${compact ? compactFieldClass : ""}`}
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lead-course">
            Interested Course
          </label>
          <select
            id="lead-course"
            className={`${fieldClass} ${compact ? compactFieldClass : ""}`}
            value={form.course}
            onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))}
            required
          >
            <option value="" disabled>
              Interested Course
            </option>
            {courseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {includeMessage && (
        <div className={compact ? "mt-3" : "mt-4"}>
          <label className={labelClass} htmlFor="lead-message">
            Message
          </label>
          <textarea
            id="lead-message"
            className={`${fieldClass} resize-y ${compact ? `${compactFieldClass} min-h-[140px]` : "min-h-32"}`}
            placeholder="Tell us about your goal"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className={buttonClass}
      >
        {pending ? "Submitting..." : submitLabel}
      </button>
      {feedback && (
        <p
          className={`mt-3 rounded-[14px] px-4 py-3 text-sm leading-6 ${
            isSuccess
              ? lightTone
                ? "border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                : "text-emerald-600"
              : lightTone
                ? "border border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"
                : "text-slate-600"
          }`}
        >
          {feedback}
        </p>
      )}
      {lightTone && (
        <p className="mt-3 text-[11px] leading-5 text-[#9a7c5d]">
          Submitted enquiries are delivered to <span className="font-semibold text-[#7c4a16]">info@genznext.com</span>.
        </p>
      )}
    </form>
  );
}
