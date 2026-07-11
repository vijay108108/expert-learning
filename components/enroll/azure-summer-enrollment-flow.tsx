"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Course } from "@/data/courses";
import { useAuth } from "@/hooks/use-auth";

type AzureSummerEnrollmentFlowProps = {
  course: Course;
  savingsLabel: string;
};

type Step = "details" | "payment";

export function AzureSummerEnrollmentFlow({ course, savingsLabel }: AzureSummerEnrollmentFlowProps) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function validateForm() {
    const mobile = form.mobile.replace(/\D/g, "");
    return (
      form.fullName.trim().length >= 2
      && mobile.length === 10
      && form.email.includes("@")
    );
  }

  function handleProceedToPayment() {
    if (!validateForm()) {
      setError("Please complete all fields with valid details.");
      return;
    }
    setStep("payment");
  }

  function handleMakePayment() {
    if (!user) {
      openAuthModal("signup", `/checkout/${course.slug}`);
      return;
    }
    router.push(`/checkout/${course.slug}`);
  }

  return (
    <aside className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-6 lg:sticky lg:top-24 lg:max-w-[360px] lg:justify-self-end">
      {step === "details" ? (
        <>
          <h2 className="text-[24px] font-bold text-[#111827]">Enrollment Details</h2>
          <p className="mt-2 text-sm text-[#6B7280]">Fill your details to continue to payment.</p>

          <div className="mt-4 grid gap-3">
            {[
              { key: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
              { key: "mobile", label: "Mobile Number", type: "tel", placeholder: "9876543210" },
              { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            ].map((field) => (
              <label key={field.key} className="space-y-1.5">
                <span className="text-[12px] font-medium text-[#374151]">{field.label}</span>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(event) => updateField(field.key as keyof typeof form, event.target.value)}
                  className="h-[50px] w-full rounded-[12px] border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#1B4C92] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]"
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </div>

          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

          <button
            type="button"
            onClick={handleProceedToPayment}
            className="mt-5 inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(79,70,229,0.3)]"
          >
            Proceed to Payment
          </button>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B2E6B]">Payment Summary</p>
          <h2 className="mt-2 text-[24px] font-bold text-[#111827]">Confirm and Pay</h2>
          <div className="mt-4 rounded-[16px] border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <p className="text-sm text-[#374151]">{course.title}</p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[#111827]">{course.price}</p>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="text-[#6B7280] line-through">{course.originalPrice}</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                Save {savingsLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleMakePayment}
            className="mt-5 inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(79,70,229,0.3)]"
          >
            Make Payment
          </button>
          <button
            type="button"
            onClick={() => setStep("details")}
            className="mt-3 inline-flex h-[50px] w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC]"
          >
            Back to Details
          </button>
        </>
      )}
    </aside>
  );
}
