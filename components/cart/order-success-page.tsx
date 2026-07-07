"use client";

import { CheckCircle2, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { InvoiceDocument } from "@/components/invoice/invoice-document";
import {
  getInvoiceDashboardPath,
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";

export function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [invoice, setInvoice] = useState<StoredOrderSuccess | null>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(12);

  const dashboardPath = useMemo(() => getInvoiceDashboardPath(invoice, { paymentCompleted: true }), [invoice]);

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
    if (!invoice) {
      return;
    }

    const timeout = window.setTimeout(() => router.replace(dashboardPath), 12000);
    const interval = window.setInterval(() => setCountdown((current) => (current > 0 ? current - 1 : 0)), 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [dashboardPath, invoice, router]);

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
            className="mt-6 inline-flex rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white"
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
              <p className="text-[12px] text-[#64748B]">Redirecting to dashboard in {countdown}s</p>
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap gap-3">
            <Link
              href={dashboardPath}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Open LMS Portal
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:text-white"
            >
              Browse More Courses
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#475569]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
            Payment verified · {countdown}s to dashboard
          </div>
        </div>
      </div>
    </section>
  );
}
