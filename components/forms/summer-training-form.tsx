"use client";

import { useState } from "react";
import { summerTrainingCourseOptions } from "@/data/summer-training";

const initialState = {
  name: "",
  college: "",
  branch: "",
  year: "",
  phone: "",
  course: "",
};

export function SummerTrainingForm() {
  const [form, setForm] = useState(initialState);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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
          email: "",
          phone: form.phone,
          course: form.course,
          source: "Summer Training Registration",
          message: [
            "Summer Industrial Training Registration",
            `College: ${form.college}`,
            `Branch: ${form.branch}`,
            `Year: ${form.year}`,
          ].join(" | "),
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit your summer training request right now.");
      }

      setIsSuccess(true);
      setFeedback(result.message || "Your summer training request has been submitted successfully.");
      setForm(initialState);
    } catch (error) {
      setIsSuccess(false);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to submit your summer training request right now.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="surface-form rounded-[28px] p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label" htmlFor="summer-name">
            Name
          </label>
          <input
            id="summer-name"
            className="form-field"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="summer-college">
            College
          </label>
          <input
            id="summer-college"
            className="form-field"
            value={form.college}
            onChange={(event) => setForm((current) => ({ ...current, college: event.target.value }))}
            placeholder="Enter your college name"
            required
          />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="form-label" htmlFor="summer-branch">
            Branch
          </label>
          <input
            id="summer-branch"
            className="form-field"
            value={form.branch}
            onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value }))}
            placeholder="CSE / IT / ECE"
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor="summer-year">
            Year
          </label>
          <select
            id="summer-year"
            className="form-field"
            value={form.year}
            onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
            required
          >
            <option value="" disabled>
              Select year
            </option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="summer-phone">
            Mobile Number
          </label>
          <input
            id="summer-phone"
            className="form-field"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Enter mobile number"
            inputMode="tel"
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="form-label" htmlFor="summer-course">
          Interested Course
        </label>
        <select
          id="summer-course"
          className="form-field"
          value={form.course}
          onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))}
          required
        >
          <option value="" disabled>
            Select your preferred program
          </option>
          {summerTrainingCourseOptions.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#F97316,#FB923C)] px-5 py-[14px] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(249,115,22,0.34),0_0_22px_rgba(251,146,60,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Submitting..." : "Apply for Summer Training"}
      </button>
      {feedback && (
        <p className={`mt-3 text-sm ${isSuccess ? "text-emerald-300" : "text-[#E2E8F0]"}`}>{feedback}</p>
      )}
    </form>
  );
}
