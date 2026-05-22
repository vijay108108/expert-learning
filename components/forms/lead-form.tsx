"use client";

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
};

const courseOptions = Array.from(
  new Set([
    "AWS Certification Programs",
    "Azure Certification Programs",
    "AI & GenAI Programs",
    "DevOps Programs",
    "Corporate Training",
    ...allCourses.map((course) => course.title),
  ]),
);

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
}: LeadFormProps) {
  const [form, setForm] = useState({
    ...initialState,
    course: initialCourse,
    message: initialMessage,
  });
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const compact = variant === "compact";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);
    setIsSuccess(false);

    try {
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
          <label className="form-label" htmlFor="lead-name">
            Name
          </label>
          <input
            id="lead-name"
            className={`form-field ${compact ? "rounded-xl px-4 py-3 text-[13px]" : ""}`}
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="lead-email">
            Email
          </label>
          <input
            id="lead-email"
            className={`form-field ${compact ? "rounded-xl px-4 py-3 text-[13px]" : ""}`}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </div>
      </div>
      <div className={`${compact ? "mt-3 grid gap-3 sm:grid-cols-2" : "mt-4 grid gap-4 sm:grid-cols-2"}`}>
        <div>
          <label className="form-label" htmlFor="lead-phone">
            Phone
          </label>
          <input
            id="lead-phone"
            className={`form-field ${compact ? "rounded-xl px-4 py-3 text-[13px]" : ""}`}
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="lead-course">
            Interested Course
          </label>
          <select
            id="lead-course"
            className={`form-field ${compact ? "rounded-xl px-4 py-3 text-[13px]" : ""}`}
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
          <label className="form-label" htmlFor="lead-message">
            Message
          </label>
          <textarea
            id="lead-message"
            className={`form-field resize-y ${compact ? "min-h-24 rounded-xl px-4 py-3 text-[13px]" : "min-h-32"}`}
            placeholder="Tell us about your goal"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex w-full items-center justify-center bg-[linear-gradient(135deg,#F97316,#FB923C)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(249,115,22,0.34),0_0_24px_rgba(251,146,60,0.16)] disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "mt-4 rounded-2xl px-5 py-3.5" : "mt-5 rounded-lg px-5 py-[13px]"}`}
      >
        {pending ? "Submitting..." : submitLabel}
      </button>
      {feedback && (
        <p className={`mt-3 text-sm leading-6 ${isSuccess ? "text-emerald-600" : "text-slate-600"}`}>{feedback}</p>
      )}
    </form>
  );
}
