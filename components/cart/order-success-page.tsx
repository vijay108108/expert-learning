"use client";

import { CheckCircle2, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/layout/brand";
import {
  formatCurrencyInrFromPaise,
  formatInvoiceDate,
  getInvoiceDashboardPath,
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";
import { siteConfig } from "@/lib/site-config";

export function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [invoice, setInvoice] = useState<StoredOrderSuccess | null>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const dashboardPath = useMemo(() => getInvoiceDashboardPath(invoice), [invoice]);

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
      } catch (error) {
        console.error("[Order Success] Unable to load invoice", error);
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

    const timeout = window.setTimeout(() => {
      router.replace(dashboardPath);
    }, 10000);

    const interval = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [dashboardPath, invoice, router]);

  const totalLines = useMemo(() => invoice?.courses.length || 0, [invoice]);
  const purchasedCourseLabel = useMemo(() => {
    if (!invoice) {
      return "";
    }

    return invoice.courses.length === 1
      ? invoice.courses[0]?.title || "Selected course"
      : `${invoice.courses.length} purchased courses`;
  }, [invoice]);
  const showTaxInvoice = Boolean(invoice?.gstInvoiceEnabled && invoice?.customer.gstNumber);

  if (!ready) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[18px] border border-[#1E2D42] bg-[#111827] p-6 text-sm text-[#94A3B8]">
          Loading your invoice...
        </div>
      </section>
    );
  }

  if (!invoice) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[18px] border border-[#1E2D42] bg-[#111827] p-6 sm:p-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#F97316]">Order Success</div>
          <h1 className="mt-2 text-[28px] font-bold text-white">Invoice not available</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#CBD5E1]">
            We could not load the latest invoice details on this device. If your payment was completed, your enrollment is still safe.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={dashboardPath}
              className="inline-flex rounded-[8px] bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Open LMS Portal
            </Link>
            <Link
              href="/courses"
              className="inline-flex rounded-[8px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.08)] px-4 py-2.5 text-sm font-medium text-[#F97316] transition hover:bg-[rgba(249,115,22,0.12)]"
            >
              Explore More Courses
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[22px] border border-[#1E2D42] bg-[#111827] p-5 shadow-[0_24px_60px_rgba(2,8,28,0.3)] sm:p-7 print:shadow-none">
        <div className="flex flex-col gap-4 border-b border-[#1A2537] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Brand />
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(16,185,129,0.18)] bg-[rgba(16,185,129,0.08)] text-[#34D399] shadow-[0_0_24px_rgba(52,211,153,0.12)]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-[28px] font-bold text-white">Payment Successful! 🎉</h1>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                {purchasedCourseLabel} · {formatCurrencyInrFromPaise(invoice.totalPaidPaise)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] px-[14px] py-2 text-sm font-medium text-[#F97316] transition hover:bg-[rgba(249,115,22,0.14)] print:hidden"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <div className="text-left sm:text-right">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
                {showTaxInvoice ? "Tax Invoice" : "Invoice"}
              </div>
              <div className="mt-1 text-[20px] font-semibold text-[#F1F5F9]">{invoice.invoiceNumber}</div>
              <div className="mt-1 text-[12px] text-[#475569]">{formatInvoiceDate(invoice.paidAtIso)}</div>
              {showTaxInvoice ? (
                <div className="mt-2 text-[11px] text-[#475569]">
                  {siteConfig.company} GST: {siteConfig.gstNumber}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[16px] border border-[rgba(16,185,129,0.12)] bg-[rgba(16,185,129,0.04)] p-5">
          <div className="text-[13px] font-semibold text-[#F1F5F9]">What happens next:</div>
          <div className="mt-3 space-y-2 text-sm text-[#CBD5E1]">
            <div>✓ You&apos;ll receive WhatsApp/SMS confirmation</div>
            <div>✓ Batch joining link sent within 24 hours</div>
            <div>✓ Classes start as per batch schedule</div>
            <div>✓ Access materials from your Dashboard</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#1E2D42] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Billed To</div>
            <div className="mt-3 space-y-1.5 text-sm text-[#CBD5E1]">
              <div>{invoice.customer.name}</div>
              <div>{invoice.customer.phone}</div>
              {invoice.customer.email ? <div>{invoice.customer.email}</div> : null}
              {invoice.customer.companyName ? <div>{invoice.customer.companyName}</div> : null}
              {invoice.customer.gstNumber ? <div>GST Number: {invoice.customer.gstNumber}</div> : null}
            </div>
          </div>

          <div className="rounded-[16px] border border-[#1E2D42] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Payment</div>
            <div className="mt-3 space-y-1.5 text-sm text-[#CBD5E1]">
              <div>Razorpay Order ID: {invoice.orderId}</div>
              <div>Payment ID: {invoice.paymentId}</div>
              <div>Method: {invoice.paymentMethod}</div>
              <div>Date &amp; Time: {formatInvoiceDate(invoice.paidAtIso)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[16px] border border-[#1E2D42]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.03)] text-left">
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Course</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Duration</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Level</th>
                <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748B]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.courses.map((course) => (
                <tr key={course.slug} className="border-t border-[#1A2537]">
                  <td className="px-4 py-3 text-sm text-[#F1F5F9]">{course.title}</td>
                  <td className="px-4 py-3 text-sm text-[#CBD5E1]">{course.duration}</td>
                  <td className="px-4 py-3 text-sm text-[#CBD5E1]">{course.level}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-[#CBD5E1]">
                    {formatCurrencyInrFromPaise(course.amountPaise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-[320px] space-y-2 rounded-[16px] border border-[#1E2D42] bg-[rgba(255,255,255,0.02)] p-4">
            {invoice.gstInvoiceEnabled ? (
              <>
                <div className="flex items-center justify-between text-sm text-[#CBD5E1]">
                  <span>Base Amount</span>
                  <span>{formatCurrencyInrFromPaise(invoice.baseAmountPaise)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#CBD5E1]">
                  <span>GST (18%)</span>
                  <span>{formatCurrencyInrFromPaise(invoice.gstPaise)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm text-[#CBD5E1]">
                  <span>Course Amount</span>
                  <span>{formatCurrencyInrFromPaise(invoice.subtotalPaise)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#CBD5E1]">
                  <span>GST</span>
                  <span>Included</span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between text-sm text-[#CBD5E1]">
              <span>Platform Fee</span>
              <span className="text-[#34D399]">{invoice.platformFeeLabel}</span>
            </div>
            <div className="border-t border-[#1A2537] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#F1F5F9]">Total Paid</span>
                <span className="text-[18px] font-semibold text-[#F97316]">
                  {formatCurrencyInrFromPaise(invoice.totalPaidPaise)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {showTaxInvoice && invoice.customer.companyName && invoice.customer.gstNumber ? (
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-[320px] rounded-[8px] border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.06)] px-3 py-2.5 text-[11px] text-[#34D399]">
              GST invoice generated for {invoice.customer.companyName} · {invoice.customer.gstNumber}
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-[10px] border border-[rgba(249,115,22,0.1)] bg-[rgba(249,115,22,0.04)] p-4 text-sm leading-6 text-[#CBD5E1]">
          <div className="font-medium text-[#F1F5F9]">🎓 You&apos;re enrolled!</div>
          <p className="mt-2">
            Check WhatsApp/SMS for batch joining link · Classes start within 48 hours · Access your course from Dashboard
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Link
              href={dashboardPath}
              className="inline-flex rounded-[8px] bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Open LMS Portal
            </Link>
            <Link
              href="/courses"
              className="inline-flex rounded-[8px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.08)] px-4 py-2.5 text-sm font-medium text-[#F97316] transition hover:bg-[rgba(249,115,22,0.12)]"
            >
              Explore More Courses
            </Link>
          </div>
          <div className="text-[12px] text-[#475569]">Redirecting to LMS Portal in {countdown}s...</div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#475569]">
          <div>{totalLines} enrollment line{totalLines === 1 ? "" : "s"} confirmed</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
            Payment verified and stored successfully
          </div>
        </div>
      </div>
    </section>
  );
}
