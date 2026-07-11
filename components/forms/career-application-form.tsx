"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

type CareerApplicationFormProps = {
  roleSlug: string;
  roleTitle: string;
};

const initialState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  currentStatus: "",
  experience: "",
  portfolioUrl: "",
  message: "",
};

export function CareerApplicationForm({
  roleSlug,
  roleTitle,
}: CareerApplicationFormProps) {
  const [form, setForm] = useState(initialState);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setFeedback(null);
    setIsSuccess(false);

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      const response = await fetch("/api/career/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleSlug,
          roleTitle,
          ...form,
          pageUrl,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit your application right now.");
      }

      setIsSuccess(true);
      setFeedback(result.message || "Your application has been submitted successfully.");
      setForm(initialState);
    } catch (error) {
      setIsSuccess(false);
      setFeedback(
        error instanceof Error ? error.message : "Unable to submit your application right now.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="surface-form rounded-[28px] p-5 sm:p-7">
      <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-blue-light/35 bg-brand-blue/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-blue-light">
          Career Application
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-[30px]">{roleTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D8E1F0]">
            Fill in your details below and we&apos;ll send your application directly to our support
            team at {siteConfig.supportEmail}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="career-name">
              Full Name
            </label>
            <input
              id="career-name"
              className="form-field"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="career-email">
              Email
            </label>
            <input
              id="career-email"
              className="form-field"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="career-phone">
              Phone
            </label>
            <input
              id="career-phone"
              className="form-field"
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="career-location">
              Current Location
            </label>
            <input
              id="career-location"
              className="form-field"
              type="text"
              placeholder="City, State"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="career-status">
              Current Role / Education
            </label>
            <input
              id="career-status"
              className="form-field"
              type="text"
              placeholder="Current role or latest qualification"
              value={form.currentStatus}
              onChange={(event) =>
                setForm((current) => ({ ...current, currentStatus: event.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="career-experience">
              Experience
            </label>
            <input
              id="career-experience"
              className="form-field"
              type="text"
              placeholder="e.g. 3 years"
              value={form.experience}
              onChange={(event) =>
                setForm((current) => ({ ...current, experience: event.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label" htmlFor="career-portfolio">
            LinkedIn / Portfolio URL (Optional)
          </label>
          <input
            id="career-portfolio"
            className="form-field"
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            value={form.portfolioUrl}
            onChange={(event) =>
              setForm((current) => ({ ...current, portfolioUrl: event.target.value }))
            }
          />
        </div>

        <div className="mt-4">
          <label className="form-label" htmlFor="career-message">
            Why are you applying?
          </label>
          <textarea
            id="career-message"
            className="form-field min-h-36 resize-y"
            placeholder="Share a short summary about your background, interest, and why you are a good fit."
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            required
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(249,115,22,0.34),0_0_24px_rgba(251,146,60,0.16)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Submitting..." : "Submit Application"}
          </button>
          <Link
            href="/career"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-[#E2E8F0] transition hover:border-brand-blue/40 hover:text-white"
          >
            Back to Careers
          </Link>
        </div>

        {feedback ? (
          <p
            className={`mt-4 text-sm leading-6 ${
              isSuccess ? "text-emerald-400" : "text-rose-300"
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </div>
  );
}
