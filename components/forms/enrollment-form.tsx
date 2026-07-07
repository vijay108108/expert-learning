"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getCouponPricing, normalizeCouponCode } from "@/lib/coupons";
import {
  findExistingEnrollmentCourseIds,
  getFirebaseAuth,
  logFirestoreIssue,
  saveInvoiceEnrollments,
  saveUserWhatsappNumber,
  upsertUserProfileFromPurchase,
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

async function getPaymentAuthHeaders() {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Your session expired. Please sign in again.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function persistVerifiedInvoiceRecord(invoice: StoredOrderSuccess) {
  const response = await fetch("/api/payment/invoice", {
    method: "POST",
    headers: await getPaymentAuthHeaders(),
    body: JSON.stringify({ invoice }),
  });

  if (!response.ok) {
    throw new Error("Unable to persist invoice record.");
  }
}

type EnrollmentFormProps = {
  course: {
    slug: string;
    title: string;
    priceValue: number;
  };
  className?: string;
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  submitLabel?: string;
};

type CouponApplyResponse = {
  success?: boolean;
  message?: string;
  pricing?: {
    appliedCouponCode?: string;
  };
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponStatus, setCouponStatus] = useState<"success" | "error" | null>(null);
  const [couponPending, setCouponPending] = useState(false);
  const router = useRouter();
  const { openAuthModal, user } = useAuth();
  const pricing = useMemo(
    () => getCouponPricing(course.priceValue * 100, appliedCouponCode),
    [appliedCouponCode, course.priceValue],
  );

  async function syncVerifiedPurchase(invoice: StoredOrderSuccess, profilePhone: string, mustAwaitEnrollmentSync: boolean) {
    try {
      await upsertUserProfileFromPurchase(user!, {
        name: invoice.customer.name,
        email: invoice.customer.email,
        phone: profilePhone || invoice.customer.phone,
        createdAt: invoice.paidAtIso,
      });
    } catch (error) {
      logFirestoreIssue("[Enrollment] Unable to upsert user profile after payment", error);
    }

    if (mustAwaitEnrollmentSync) {
      try {
        await saveInvoiceEnrollments(user!, invoice);
      } catch (error) {
        logFirestoreIssue("[Enrollment] Enrollment recovery sync failed after verified payment", error);
      }

      try {
        await persistVerifiedInvoiceRecord(invoice);
      } catch (error) {
        logFirestoreIssue("[Enrollment] Invoice recovery sync failed after verified payment", error);
      }
      return;
    }

    void saveInvoiceEnrollments(user!, invoice).catch((error) => {
      logFirestoreIssue("[Enrollment] Client enrollment confirmation sync failed after verified payment", error);
    });

    void persistVerifiedInvoiceRecord(invoice).catch((error) => {
      logFirestoreIssue("[Enrollment] Client invoice confirmation sync failed after verified payment", error);
    });
  }

  async function handleApplyCoupon() {
    setMessage(null);

    if (couponPending || pending || isPaying) {
      return;
    }

    if (!couponCode.trim()) {
      setAppliedCouponCode("");
      setCouponStatus("error");
      setCouponMessage("Invalid coupon code");
      return;
    }

    setCouponPending(true);

    try {
      const response = await fetch("/api/payment/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSlug: course.slug,
          couponCode,
        }),
      });

      const payload = (await response.json()) as CouponApplyResponse;

      if (!response.ok || !payload.success || !payload.pricing?.appliedCouponCode) {
        setAppliedCouponCode("");
        setCouponStatus("error");
        setCouponMessage(payload.message || "Invalid coupon code");
        return;
      }

      setAppliedCouponCode(payload.pricing.appliedCouponCode);
      setCouponStatus("success");
      setCouponMessage(payload.message || "Coupon applied successfully");
    } catch {
      setAppliedCouponCode("");
      setCouponStatus("error");
      setCouponMessage("Invalid coupon code");
    } finally {
      setCouponPending(false);
    }
  }

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
    const profilePhone = formatPhoneForProfile(form.phone);

    try {
      const duplicateCourses = await findExistingEnrollmentCourseIds(user.uid, [course.slug]);

      if (duplicateCourses.length > 0) {
        setMessage("You are already enrolled in this course.");
        setIsPaying(false);
        return;
      }

      const createResponse = await fetch("/api/payment/create", {
        method: "POST",
        headers: await getPaymentAuthHeaders(),
        body: JSON.stringify({
          ...form,
          userId: user.uid,
          courseSlug: course.slug,
          couponCode: appliedCouponCode,
        }),
      });

      const createPayload = (await createResponse.json()) as {
        success?: boolean;
        message?: string;
        keyId?: string;
        order?: { id: string; amount: number; currency: string };
        freeEnrollment?: boolean;
        clientSyncRequired?: boolean;
        invoice?: StoredOrderSuccess;
      };

      if (!createResponse.ok) {
        throw new Error(createPayload.message || "Unable to start payment.");
      }

      if (createPayload.freeEnrollment && createPayload.invoice) {
        const dashboardPath = getInvoiceDashboardPath(createPayload.invoice, {
          paymentCompleted: true,
        });

        window.localStorage.setItem(latestOrderStorageKey, JSON.stringify(createPayload.invoice));
        syncMyLearningFromInvoice(createPayload.invoice);

        await syncVerifiedPurchase(
          createPayload.invoice,
          profilePhone,
          Boolean(createPayload.clientSyncRequired),
        );

        setIsPaying(false);
        router.replace(dashboardPath);

        void saveUserWhatsappNumber(user.uid, profilePhone).catch((error) => {
          logFirestoreIssue("[Enrollment] Unable to save phone number after payment", error);
        });
        return;
      }

      if (!createPayload.order || !createPayload.keyId) {
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
          color: "#4F46E5",
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: await getPaymentAuthHeaders(),
              body: JSON.stringify({
                ...response,
                userId: user.uid,
                ...form,
                courseSlug: course.slug,
                couponCode: appliedCouponCode,
              }),
            });

            const verifyPayload = (await verifyResponse.json()) as {
              success?: boolean;
              clientSyncRequired?: boolean;
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

            await syncVerifiedPurchase(
              verifyPayload.invoice,
              profilePhone,
              Boolean(verifyPayload.clientSyncRequired),
            );

            setIsPaying(false);
            router.replace(dashboardPath);

            void saveUserWhatsappNumber(user.uid, profilePhone).catch((error) => {
              logFirestoreIssue("[Enrollment] Unable to save phone number after payment", error);
            });
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
        <div className="mt-4 rounded-[22px] border border-[#C7D2FE] bg-[linear-gradient(135deg,rgba(239,246,255,0.98),rgba(245,243,255,0.96)_55%,rgba(248,250,252,0.95))] p-4 shadow-[0_14px_32px_rgba(79,70,229,0.10)] sm:p-5">
          <label className="form-label" htmlFor="enroll-coupon">
            🎁 Apply Coupon & Save More
          </label>
          <p className="mb-4 text-[12.5px] font-medium leading-5 text-[#4F46E5] sm:text-[13px]">
            Have a coupon code? Enter below to unlock your discount.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="enroll-coupon"
              className="form-field min-w-0 border-[#BFDBFE] bg-white/95 px-4 py-3 shadow-[0_8px_20px_rgba(37,99,235,0.08)] transition focus:border-[#6366F1] focus:ring-4 focus:ring-[#C7D2FE]/50"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(event) => {
                const nextValue = event.target.value;
                setCouponCode(nextValue);
                setMessage(null);
                if (appliedCouponCode && normalizeCouponCode(nextValue) !== appliedCouponCode) {
                  setAppliedCouponCode("");
                }
                if (couponMessage) {
                  setCouponMessage(null);
                  setCouponStatus(null);
                }
              }}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponPending || pending || isPaying}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7C3AED,#4F46E5,#2563EB)] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(79,70,229,0.30)] disabled:opacity-70 sm:min-w-[128px]"
            >
              {couponPending ? "Applying..." : "Apply"}
            </button>
          </div>
          {couponMessage ? (
            couponStatus === "success" ? (
              <div className="mt-4 rounded-[18px] border border-emerald-200 bg-[linear-gradient(135deg,#ECFDF5,#F0FDF4)] p-4 shadow-[0_10px_22px_rgba(16,185,129,0.10)]">
                <p className="text-sm font-bold text-emerald-700">✅ Coupon Applied Successfully</p>
                <p className="mt-1 text-sm font-semibold text-emerald-800">
                  {appliedCouponCode || couponCode.trim().toUpperCase()} Applied
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  You saved ₹{Math.round(pricing.discountPaise / 100).toLocaleString("en-IN")} 🎉
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {couponMessage}
              </div>
            )
          ) : null}
        </div>
        <div className="mt-4 rounded-[18px] border border-brand-blue/10 bg-brand-surface/70 p-4">
          <div className="flex items-center justify-between text-sm text-brand-muted">
            <span>Original Price</span>
            <span>{formatPrice(course.priceValue)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-brand-muted">
            <span>{appliedCouponCode ? `Discount (${appliedCouponCode})` : "Discount"}</span>
            <span>{pricing.discountPaise ? `-₹${Math.round(pricing.discountPaise / 100).toLocaleString("en-IN")}` : "₹0"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-brand-muted">
            <span>Coupon Code</span>
            <span>{appliedCouponCode || "—"}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-brand-blue/10 pt-3 text-sm font-semibold text-brand-text">
            <span>Final Payable</span>
            <span>₹{Math.round(pricing.finalAmountPaise / 100).toLocaleString("en-IN")}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={pending || isPaying}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#4F46E5,#2563EB)] px-5 py-[13px] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(249,115,22,0.34),0_0_24px_rgba(251,146,60,0.16)] disabled:opacity-70"
        >
          {pending || isPaying ? "Processing..." : submitLabel}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-brand-muted">{message}</p>}
    </div>
  );
}
