"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Course } from "@/data/courses";
import { useAuth } from "@/hooks/use-auth";
import {
  logFirestoreIssue,
  saveUserWhatsappNumber,
} from "@/lib/firebase";
import { syncMyLearningFromInvoice } from "@/lib/my-learning";
import {
  getInvoiceDashboardPath,
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";
import { ensureRazorpayScript } from "@/lib/razorpay-browser";
import { cn } from "@/lib/utils";

const initialState = {
  name: "",
  email: "",
  phone: "",
};

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhoneForProfile(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const digits = normalizePhone(trimmed);

  if (!digits) {
    return "";
  }

  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

type EnrollmentFormProps = {
  course: Course;
  className?: string;
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  submitLabel?: string;
};

export function EnrollmentForm({
  course,
  className,
  sectionId,
  eyebrow = "Enrollment",
  heading,
  submitLabel = "Enroll Now",
}: EnrollmentFormProps) {
  const [form, setForm] = useState(initialState);
  const [pending, setPending] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { openAuthModal, user } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (pending || isPaying) {
      return;
    }

    if (!user) {
      openAuthModal("login", `/checkout/${encodeURIComponent(course.slug)}`);
      return;
    }

    setPending(true);
    setIsPaying(true);

    try {
      const createResponse = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          userId: user.uid,
          courseSlug: course.slug,
        }),
      });

      const createPayload = (await createResponse.json()) as {
        success?: boolean;
        message?: string;
        keyId?: string;
        order?: { id: string; amount: number; currency: string };
      };

      if (!createResponse.ok || !createPayload.order || !createPayload.keyId) {
        throw new Error(createPayload.message || "Unable to start payment.");
      }

      const scriptLoaded = await ensureRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const razorpay = new window.Razorpay({
        key: createPayload.keyId,
        amount: createPayload.order.amount,
        currency: createPayload.order.currency,
        name: "GenZNext Research & Training",
        description: course.title,
        order_id: createPayload.order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#F97316",
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                userId: user.uid,
                ...form,
                courseSlug: course.slug,
              }),
            });

            const verifyPayload = (await verifyResponse.json()) as {
              success?: boolean;
              message?: string;
              invoice?: StoredOrderSuccess;
            };

            if (!verifyResponse.ok || !verifyPayload.invoice) {
              setMessage(verifyPayload.message || "Payment verification failed.");
              setIsPaying(false);
              return;
            }

            const profilePhone = formatPhoneForProfile(form.phone);
            const dashboardPath = getInvoiceDashboardPath(verifyPayload.invoice, {
              paymentCompleted: true,
            });

            window.localStorage.setItem(latestOrderStorageKey, JSON.stringify(verifyPayload.invoice));
            syncMyLearningFromInvoice(verifyPayload.invoice);

            void saveUserWhatsappNumber(user.uid, profilePhone).catch((error) => {
              logFirestoreIssue("[Enrollment] Unable to save phone number after payment", error);
            });

            setIsPaying(false);
            router.replace(dashboardPath);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to complete enrollment after payment.");
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create enrollment.");
      setIsPaying(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div id={sectionId} className={cn("surface-form p-5 sm:p-7", className)}>
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-brand-blue/10 pb-5">
        <div>
          <div className="section-label">{eyebrow}</div>
          <h3 className="mt-2 text-[22px] font-bold text-brand-text">{heading || course.title}</h3>
        </div>
        <div className="mono-meta text-[13px] font-bold text-brand-blue-light">{formatPrice(course.priceValue)}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="enroll-name">
            Name
          </label>
          <input
            id="enroll-name"
            className="form-field"
            placeholder="Your full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </div>
        <div className="mt-4">
          <label className="form-label" htmlFor="enroll-email">
            Email
          </label>
          <input
            id="enroll-email"
            type="email"
            className="form-field"
            placeholder="your@email.com"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </div>
        <div className="mt-4">
          <label className="form-label" htmlFor="enroll-phone">
            Phone
          </label>
          <input
            id="enroll-phone"
            type="tel"
            className="form-field"
            placeholder="+91"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            required
          />
        </div>
        <button
          type="submit"
          disabled={pending || isPaying}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#F97316,#FB923C)] px-5 py-[13px] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(249,115,22,0.34),0_0_24px_rgba(251,146,60,0.16)] disabled:opacity-70"
        >
          {pending || isPaying ? "Processing..." : submitLabel}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-brand-muted">{message}</p>}
    </div>
  );
}
