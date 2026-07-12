"use client";

import { CheckCircle2, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { InvoiceDocument } from "@/components/invoice/invoice-document";
import { useAuth } from "@/hooks/use-auth";
import { trackJoinWhatsapp, trackLmsOpen } from "@/lib/client-analytics";
import { getFirebaseAuth, logFirestoreIssue, saveInvoiceEnrollments, upsertUserProfileFromPurchase } from "@/lib/firebase";
import {
  getInvoiceDashboardPath,
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";

async function getPaymentAuthHeaders() {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Please complete registration to continue.");
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

export function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthReady } = useAuth();
  const orderId = searchParams.get("orderId");
  const requireRegistration = searchParams.get("register") === "1";
  const [invoice, setInvoice] = useState<StoredOrderSuccess | null>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(12);
  const [syncingEnrollment, setSyncingEnrollment] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registrationSynced, setRegistrationSynced] = useState(false);

  const dashboardPath = useMemo(() => getInvoiceDashboardPath(invoice, { paymentCompleted: true }), [invoice]);
  const isWorkshopEnrollment = Boolean(invoice?.courses.some((course) => course.slug === "ai-developer-launch-lab"));
  const workshopWhatsappUrl = process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP_URL || "";
  const workshopMeetingUrl = process.env.NEXT_PUBLIC_WORKSHOP_MEETING_URL || "";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(latestOrderStorageKey);
        if (!raw) {
          setInvoice(null);
          return;
        }

        const parsed = JSON.parse(raw) as StoredOrderSuccess;
        if (orderId && parsed.orderId !== orderId) {
          setInvoice(null);
          return;
        }

        setInvoice(parsed);
      } catch {
        setInvoice(null);
      } finally {
        setReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [orderId]);

  useEffect(() => {
    if (!invoice || (requireRegistration && (!user || !registrationSynced))) {
      return;
    }

    const timeout = window.setTimeout(() => router.replace(dashboardPath), 12000);
    const interval = window.setInterval(() => setCountdown((current) => (current > 0 ? current - 1 : 0)), 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [dashboardPath, invoice, registrationSynced, requireRegistration, router, user]);

  useEffect(() => {
    async function syncGuestPaymentAfterRegistration() {
      if (!requireRegistration || !invoice || !user || !isAuthReady) {
        return;
      }

      setSyncingEnrollment(true);
      setRegistrationMessage("Finalizing your seat and LMS access...");

      if (registrationSynced) {
        return;
      }

      try {
        await upsertUserProfileFromPurchase(user, {
          name: invoice.customer.name,
          email: invoice.customer.email,
          phone: invoice.customer.phone,
          createdAt: invoice.paidAtIso,
        });

        await saveInvoiceEnrollments(user, invoice);
        await persistVerifiedInvoiceRecord(invoice);
        setRegistrationSynced(true);
        setRegistrationMessage("Your seat is reserved. You will receive the meeting link shortly.");
      } catch (error) {
        logFirestoreIssue("[Order Success] Unable to sync enrollment after guest payment", error);
        setRegistrationMessage("Registration completed, but LMS sync is taking longer. Please refresh in a few seconds.");
      } finally {
        setSyncingEnrollment(false);
      }
    }

    void syncGuestPaymentAfterRegistration();
  }, [invoice, isAuthReady, registrationSynced, requireRegistration, user]);

  if (!ready) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-[#64748B]">Loading invoice...</p>
      </section>
    );
  }

  if (!invoice) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#1E2D42] bg-[#111827] p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Invoice not found</h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Payment was completed but invoice could not be loaded. Your enrollment is safe.
          </p>
          <Link
            href={dashboardPath}
            className="mt-6 inline-flex rounded-xl bg-[#0B2E6B] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#060B14] px-4 py-10 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/15 text-[#34D399]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white">Payment Successful</p>
              <p className="text-[12px] text-[#64748B]">
                {requireRegistration && !user ? "Complete registration to unlock LMS access" : `Redirecting to dashboard in ${countdown}s`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-[#94A3B8] hover:text-white"
            >
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        <InvoiceDocument invoice={invoice} />

        {requireRegistration && !user ? (
          <div className="mt-5 rounded-2xl border border-[#1D7CFF]/30 bg-[#1D7CFF]/10 p-5 print:hidden">
            <p className="text-base font-semibold text-white">One last step: complete registration with OTP</p>
            <p className="mt-2 text-sm text-[#BFDBFE]">
              Seat payment is successful. Complete Name, Email, and Mobile OTP registration to unlock your LMS portal.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/signup?redirect=${encodeURIComponent(`/payment/success?orderId=${encodeURIComponent(invoice.orderId)}&register=1`)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B2E6B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#092552]"
              >
                Complete Registration
              </Link>
            </div>
          </div>
        ) : null}

        {requireRegistration && user ? (
          <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 print:hidden">
            <p className="text-base font-semibold text-[#DCFCE7]">Registration completed</p>
            <p className="mt-2 text-sm text-[#BBF7D0]">
              {registrationMessage || "Your seat is reserved. You will receive the meeting link shortly."}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap gap-3">
            {requireRegistration && (!user || syncingEnrollment || !registrationSynced) ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-[#0B2E6B]/60 px-5 py-2.5 text-sm font-semibold text-white/70">
                Open LMS Portal
              </span>
            ) : (
              <Link
                href={dashboardPath}
                onClick={() => {
                  const slug = invoice.courses[0]?.slug || "dashboard";
                  trackLmsOpen(slug);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B2E6B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#092552]"
              >
                Open LMS Portal
              </Link>
            )}
            {isWorkshopEnrollment && workshopWhatsappUrl ? (
              <a
                href={workshopWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackJoinWhatsapp()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#16A34A]/50 bg-[#16A34A]/15 px-5 py-2.5 text-sm font-semibold text-[#DCFCE7] transition hover:bg-[#16A34A]/25"
              >
                Join WhatsApp Group
              </a>
            ) : null}
            {isWorkshopEnrollment && workshopMeetingUrl ? (
              <a
                href={workshopMeetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1D7CFF]/50 bg-[#1D7CFF]/15 px-5 py-2.5 text-sm font-semibold text-[#BFDBFE] transition hover:bg-[#1D7CFF]/25"
              >
                Open Workshop Meeting
              </a>
            ) : null}
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:text-white"
            >
              Browse More Courses
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#475569]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
            {requireRegistration && !user
              ? "Payment verified · complete OTP registration"
              : `Payment verified · ${countdown}s to dashboard`}
          </div>
        </div>
      </div>
    </section>
  );
}
