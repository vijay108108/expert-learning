"use client";

import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { getCouponPricing, normalizeCouponCode } from "@/lib/coupons";
import { formatPaiseToPrice } from "@/lib/course-catalog";
import {
  findExistingEnrollmentCourseIds,
  getFirebaseAuth,
  getUserProfile,
  logFirestoreIssue,
  saveInvoiceEnrollments,
  saveUserWhatsappNumber,
  type AppUserProfile,
} from "@/lib/firebase";
import {
  formatCurrencyInrFromPaise,
  getInvoiceDashboardPath,
  getInclusiveGstBreakup,
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";
import { syncMyLearningFromInvoice } from "@/lib/my-learning";
import { ensureRazorpayScript } from "@/lib/razorpay-browser";

const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

type CheckoutFormState = {
  phone: string;
  email: string;
  addGstDetails: boolean;
  gstNumber: string;
  companyName: string;
};

type CheckoutProfile = AppUserProfile & {
  companyName?: string;
  gstNumber?: string;
};

type CouponApplyResponse = {
  success?: boolean;
  message?: string;
  pricing?: {
    appliedCouponCode?: string;
  };
};

const initialState: CheckoutFormState = {
  phone: "",
  email: "",
  addGstDetails: false,
  gstNumber: "",
  companyName: "",
};

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

/* Payment Processing Overlay */
function PaymentProcessingOverlay() {
  const steps = [
    { label: "Verifying payment signature",    done: true  },
    { label: "Confirming order with Razorpay", done: true  },
    { label: "Creating your enrollment record",done: false },
    { label: "Sending confirmation on WhatsApp",done: false },
    { label: "Unlocking LMS access",           done: false },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(15,23,42,0.7)] backdrop-blur-sm px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-[24px] border border-[#1E293B] bg-[#0D1117] p-7 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        {/* Spinner */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#1E293B] border-t-[#9333EA]" />
            <div className="absolute inset-3 animate-spin rounded-full border-4 border-[#1E293B] border-t-[#4F46E5]" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
            <ShieldCheck className="h-7 w-7 text-[#34D399]" />
          </div>
          <p className="mt-5 text-[17px] font-bold text-white">Processing Payment</p>
          <p className="mt-1 text-[12px] text-[#64748B]">Please don&apos;t close this window</p>
        </div>

        {/* Timeline */}
        <div className="mt-7 space-y-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              {/* Icon */}
              <div className="shrink-0">
                {step.done ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#34D399]/20">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                  </div>
                ) : i === steps.findIndex(s => !s.done) ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4F46E5]/20">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#818CF8]" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1E293B]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#334155]" />
                  </div>
                )}
              </div>
              {/* Label */}
              <span className={`text-[12.5px] ${
                step.done
                  ? "text-[#34D399]"
                  : i === steps.findIndex(s => !s.done)
                    ? "font-semibold text-white"
                    : "text-[#334155]"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#334155]">
          <LockKeyhole className="h-3.5 w-3.5" />
          Secured by Razorpay · 256-bit SSL
        </div>
      </div>
    </div>
  );
}

export function CartCheckoutForm() {
  const checkoutFormId = "cart-checkout-form";
  const router = useRouter();
  const { user, isAuthReady, openAuthModal } = useAuth();
  const { clearCart, courses, hydrated, totalPaise } = useCart();
  const [form, setForm] = useState<CheckoutFormState>(initialState);
  const [profile, setProfile] = useState<CheckoutProfile | null>(null);
  const [pending, setPending] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponStatus, setCouponStatus] = useState<"success" | "error" | null>(null);
  const [couponPending, setCouponPending] = useState(false);
  const accountName = profile?.name?.trim() || user?.displayName?.trim() || "GenZNext Learner";
  const accountPhone = form.phone.trim();
  const normalizedGstNumber = form.gstNumber.trim().toUpperCase();
  const gstNumberEntered = normalizedGstNumber.length > 0;
  const isGstNumberValid = gstPattern.test(normalizedGstNumber);
  const gstInvoiceEnabled = form.addGstDetails && isGstNumberValid;
  const pricing = useMemo(() => getCouponPricing(totalPaise, appliedCouponCode), [appliedCouponCode, totalPaise]);
  const { baseAmountPaise, gstPaise, totalPaidPaise } = useMemo(
    () => getInclusiveGstBreakup(pricing.finalAmountPaise, gstInvoiceEnabled),
    [gstInvoiceEnabled, pricing.finalAmountPaise],
  );
  const showGstInvoiceNote = gstInvoiceEnabled && Boolean(form.companyName.trim());

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;
    const authPhone = user.phoneNumber?.trim() || "";
    const authEmail = user.email?.trim() || "";
    const frame = window.requestAnimationFrame(() => {
      if (!active) {
        return;
      }

      setForm((current) => ({
        ...current,
        phone: current.phone || authPhone,
        email: current.email || authEmail,
      }));
    });

    void (async () => {
      try {
        const nextProfile = await getUserProfile(user.uid) as CheckoutProfile;

        if (!active) {
          return;
        }

        setProfile(nextProfile);
        const profileGst     = nextProfile?.gstNumber?.trim()     || "";
        const profileCompany = nextProfile?.companyName?.trim()   || "";
        setForm((current) => ({
          ...current,
          phone:       current.phone       || nextProfile?.phone?.trim()  || authPhone,
          email:       current.email       || nextProfile?.email?.trim()  || authEmail,
          /* Pre-fill billing from profile if available */
          gstNumber:   current.gstNumber   || profileGst,
          companyName: current.companyName || profileCompany,
          addGstDetails: current.addGstDetails || Boolean(profileGst && profileCompany),
        }));
      } catch (error) {
        if (active) {
          logFirestoreIssue("[Checkout] Unable to load user profile", error);
        }
      }
    })();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [user]);

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
          courseSlugs: courses.map((course) => course.slug),
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

    if (!hydrated || courses.length === 0) {
      setMessage("Your cart is empty. Add a course before checkout.");
      return;
    }

    if (!isAuthReady) {
      setMessage("We are still verifying your account session. Please try again in a moment.");
      return;
    }

    if (!user) {
      openAuthModal("login", "/checkout");
      return;
    }

    const paymentPhone = normalizePhone(accountPhone);
    const profilePhone = formatPhoneForProfile(accountPhone);

    if (!accountName.trim()) {
      setMessage("Your account name is missing. Please sign in again and retry.");
      return;
    }

    if (paymentPhone.length < 8 || paymentPhone.length > 14) {
      setMessage("Enter a valid mobile number to continue.");
      return;
    }

    if (form.addGstDetails) {
      if (!isGstNumberValid) {
        setMessage("Invalid GST number format");
        return;
      }

      if (!form.companyName.trim()) {
        setMessage("Enter your company name to include GST details.");
        return;
      }
    }

    setPending(true);
    setIsPaying(true);

    try {
      const duplicateCourses = await findExistingEnrollmentCourseIds(
        user.uid,
        courses.map((course) => course.slug),
      );

      if (duplicateCourses.length > 0) {
        setMessage(
          duplicateCourses.length === 1
            ? "You are already enrolled in this course."
            : "One or more selected courses are already enrolled in your account.",
        );
        setIsPaying(false);
        return;
      }

      const payload = {
        userId: user.uid,
        name: accountName.trim(),
        email: form.email.trim(),
        phone: paymentPhone,
        courseSlugs: courses.map((course) => course.slug),
        gstNumber: form.addGstDetails ? normalizedGstNumber : "",
        companyName: form.addGstDetails ? form.companyName.trim() : "",
        couponCode: appliedCouponCode,
      };

      const createResponse = await fetch("/api/payment/create", {
        method: "POST",
        headers: await getPaymentAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const createPayload = (await createResponse.json()) as {
        success?: boolean;
        message?: string;
        keyId?: string;
        order?: { id: string; amount: number; currency: string };
      };

      if (!createResponse.ok || !createPayload.order || !createPayload.keyId) {
        throw new Error(createPayload.message || "Unable to start checkout.");
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
        description: `${courses.length} course${courses.length > 1 ? "s" : ""} in cart`,
        order_id: createPayload.order.id,
        prefill: {
          name: payload.name,
          email: payload.email,
          contact: payload.phone,
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
                ...payload,
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

            const dashboardPath = getInvoiceDashboardPath(verifyPayload.invoice, {
              paymentCompleted: true,
            });

            window.localStorage.setItem(latestOrderStorageKey, JSON.stringify(verifyPayload.invoice));
            syncMyLearningFromInvoice(verifyPayload.invoice);

            clearCart();
            window.localStorage.removeItem("cart");
            window.localStorage.setItem("cart", JSON.stringify([]));
            setIsPaying(false);
            router.replace(dashboardPath);

            void saveInvoiceEnrollments(user, verifyPayload.invoice).catch((error) => {
              logFirestoreIssue(
                verifyPayload.clientSyncRequired
                  ? "[Checkout] Client enrollment recovery failed after verified payment"
                  : "[Checkout] Client enrollment confirmation sync failed after verified payment",
                error,
              );
            });

            void saveUserWhatsappNumber(user.uid, profilePhone).catch((error) => {
              logFirestoreIssue("[Checkout] Unable to save phone number after payment", error);
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
      setMessage(error instanceof Error ? error.message : "Unable to create checkout.");
      setIsPaying(false);
    } finally {
      setPending(false);
    }
  }

  /* Payment processing overlay */
  if (isPaying) {
    return <PaymentProcessingOverlay />;
  }

  if (!hydrated) {
    return (
      <div className="rounded-[18px] border border-[#1E2D42] bg-[#111827] p-6 text-sm text-[#94A3B8]">
        Loading your checkout...
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="rounded-[18px] border border-[#1E2D42] bg-[#111827] p-6 text-center">
        <div className="text-[18px] font-semibold text-[#F1F5F9]">Your cart is empty</div>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          Add at least one certification program before starting checkout.
        </p>
        <Link
          href="/courses"
          className="mt-5 inline-flex rounded-[8px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.08)] px-4 py-2 text-sm font-medium text-[#4F46E5] transition hover:bg-[rgba(249,115,22,0.12)]"
        >
          Explore Courses
        </Link>
      </div>
    );
  }

  if (!isAuthReady || !user) {
    return (
      <div className="rounded-[18px] border border-[#1E2D42] bg-[#111827] p-6">
        <div className="text-[18px] font-semibold text-[#F1F5F9]">Sign in to complete checkout</div>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          Your account is required so we can attach enrollment access and payment records correctly.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal("login", "/checkout")}
          className="mt-5 inline-flex rounded-[8px] bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
        >
          Continue with Login
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-[18px] border border-[#1E2D42] bg-[#111827] p-5 sm:p-6">
        <div className="mb-5 rounded-[8px] border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.06)] px-[14px] py-[10px] text-sm text-[#34D399]">
          ✓ Details auto-filled from your account — verify and confirm
        </div>

        <form id={checkoutFormId} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
              Full Name
            </label>
              <input
              value={accountName}
              readOnly
              className="w-full rounded-[10px] border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.03)] px-4 py-3 text-[14px] text-[#94A3B8] outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
              Phone
            </label>
            <input
              value={accountPhone}
              onChange={(event) => {
                setForm((current) => ({ ...current, phone: event.target.value }));
                setMessage(null);
              }}
              placeholder="+91 mobile number"
              autoComplete="tel"
              inputMode="tel"
              className="w-full rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[14px] text-[#F1F5F9] outline-none transition placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.35)] focus:bg-[rgba(249,115,22,0.03)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
              Email (Optional)
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="your@email.com"
              className="w-full rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[14px] text-[#F1F5F9] outline-none transition placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.35)] focus:bg-[rgba(249,115,22,0.03)]"
            />
          </div>

          <div className="rounded-[14px] border border-[#1E2D42] bg-[rgba(255,255,255,0.02)] p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.addGstDetails}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    addGstDetails: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border border-[#2D3F55] bg-transparent accent-[#4F46E5]"
              />
              <span>
                <span className="block text-sm font-medium text-[#F1F5F9]">
                  Add GST details for business invoice (optional)
                </span>
                <span className="mt-1 block text-[12px] leading-5 text-[#64748B]">
                  Enable this only if you need a GST-ready invoice for company reimbursement or finance records.
                </span>
              </span>
            </label>

            {form.addGstDetails ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="block text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
                      GST Number
                    </label>
                    {gstInvoiceEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#34D399]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Valid GST
                      </span>
                    ) : null}
                  </div>
                  <input
                    value={form.gstNumber}
                    onChange={(event) => setForm((current) => ({ ...current, gstNumber: event.target.value.toUpperCase() }))}
                    placeholder="27ABCDE1234F1Z5"
                    maxLength={15}
                    className="w-full rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[14px] text-[#F1F5F9] outline-none transition placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.35)] focus:bg-[rgba(249,115,22,0.03)]"
                  />
                  {gstNumberEntered && !isGstNumberValid ? (
                    <div className="mt-2 text-[11px] text-[#EF4444]">Invalid GST number format</div>
                  ) : null}
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
                    Company Name
                  </label>
                  <input
                    value={form.companyName}
                    onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                    placeholder="Your company name"
                    className="w-full rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[14px] text-[#F1F5F9] outline-none transition placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.35)] focus:bg-[rgba(249,115,22,0.03)]"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[14px] border border-[#1E2D42] bg-[rgba(255,255,255,0.02)] p-4">
            <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
              Coupon Code
            </label>
            <p className="mb-2 text-sm text-[#94A3B8]">
              Have a coupon code? Use <span className="font-bold text-[#F1F5F9]">GENZNEXT99</span>
            </p>
            <div className="flex gap-3">
              <input
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
                placeholder="Enter coupon code"
                className="w-full rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[14px] text-[#F1F5F9] outline-none transition placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.35)] focus:bg-[rgba(249,115,22,0.03)]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponPending || pending || isPaying}
                className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-[rgba(79,70,229,0.24)] px-4 py-3 text-sm font-semibold text-[#818CF8] transition hover:bg-[rgba(79,70,229,0.08)] disabled:opacity-70"
              >
                {couponPending ? "Applying..." : "Apply"}
              </button>
            </div>
            {couponMessage ? (
              <div className={`mt-2 text-sm ${couponStatus === "success" ? "text-[#34D399]" : "text-[#FCA5A5]"}`}>
                {couponMessage}
              </div>
            ) : null}
          </div>

          {message ? (
            <div className="rounded-[10px] border border-[rgba(248,113,113,0.18)] bg-[rgba(127,29,29,0.16)] px-4 py-3 text-sm text-[#FCA5A5]">
              {message}
            </div>
          ) : null}
        </form>
      </div>

      <aside className="rounded-[18px] border border-[#1E2D42] bg-[#111827] p-5 sm:p-6">
        <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Order Summary</div>

        <div className="mt-5 space-y-4">
          {courses.map((course) => (
            <div key={course.slug} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#F1F5F9]">{course.title}</div>
                <div className="mt-1 text-[12px] text-[#475569]">
                  {course.duration} · {course.level}
                </div>
              </div>
              <div className="shrink-0 text-sm font-medium text-[#CBD5E1]">{course.price}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-[#1A2537] pt-4 text-sm">
          {gstInvoiceEnabled ? (
            <>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Original Price</span>
                <span>{formatPaiseToPrice(pricing.subtotalPaise)}</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Discount</span>
                <span>{pricing.discountPaise ? `-${formatCurrencyInrFromPaise(pricing.discountPaise)}` : "₹0"}</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Base Amount (excl. GST)</span>
                <span>{formatCurrencyInrFromPaise(baseAmountPaise)}</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>GST @ 18%</span>
                <span>{formatCurrencyInrFromPaise(gstPaise)}</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Platform Fee</span>
                <span className="font-medium text-[#34D399]">Included</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Original Price</span>
                <span>{formatPaiseToPrice(pricing.subtotalPaise)}</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Discount</span>
                <span>{pricing.discountPaise ? `-${formatCurrencyInrFromPaise(pricing.discountPaise)}` : "₹0"}</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>Platform Fee</span>
                <span className="font-medium text-[#34D399]">Included</span>
              </div>
              <div className="flex items-center justify-between text-[#CBD5E1]">
                <span>GST</span>
                <span>Included in price</span>
              </div>
            </>
          )}
          <div className="flex items-center justify-between border-t border-[#1A2537] pt-3">
            <span className="text-[15px] font-semibold text-[#F1F5F9]">Total Payable</span>
            <span className="text-[18px] font-semibold text-[#4F46E5]">{formatCurrencyInrFromPaise(totalPaidPaise)}</span>
          </div>
        </div>

        {showGstInvoiceNote ? (
          <div className="mt-4 rounded-[8px] border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.06)] px-3 py-2.5 text-[11px] text-[#34D399]">
            GST invoice will be generated for {form.companyName.trim()} · {normalizedGstNumber}
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-2 text-[11px] text-[#334155]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
          Secured by Razorpay · 256-bit SSL
        </div>

        <button
          type="submit"
          form={checkoutFormId}
          disabled={pending || isPaying}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#4F46E5] px-4 py-[13px] text-[15px] font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending || isPaying ? (
            "Processing..."
          ) : (
            <>
              <CreditCard className="h-4.5 w-4.5" />
              Pay {formatCurrencyInrFromPaise(totalPaidPaise)} via Razorpay
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#475569]">
          <LockKeyhole className="h-3.5 w-3.5" />
          Your payment details stay encrypted throughout checkout
        </div>
      </aside>
    </div>
  );
}

