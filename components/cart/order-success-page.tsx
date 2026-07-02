"use client";

import { CheckCircle2, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  formatCurrencyInrFromPaise,
  formatInvoiceDate,
  getInvoiceDashboardPath,
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";

/* ── Seller block ── */
const SELLER = {
  legalName:  "NETSEEMS VENTURES PRIVATE LIMITED",
  brand:      "GenZNext Research & Training",
  address:    "A19, Om Bungalow, Sai Jyot Park",
  city:       "Rahatani, Pune, Maharashtra – 411017",
  phone:      "+91 8421056291",
  email:      "genznextofficial@gmail.com",
  gstin:      "27AAHCN4778J1ZU",
  pan:        "AAHCN4778J",
  state:      "Maharashtra (27)",
  website:    "expertlearning.in",
};

/* ── Helpers ── */
function InvoiceLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#64748B]">{children}</p>
  );
}
function InvoiceVal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-0.5 text-[12.5px] text-[#E2E8F0] ${className}`}>{children}</p>;
}

export function OrderSuccessPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const orderId     = searchParams.get("orderId");
  const [invoice, setInvoice] = useState<StoredOrderSuccess | null>(null);
  const [ready, setReady]     = useState(false);
  const [countdown, setCountdown] = useState(12);

  const dashboardPath = useMemo(() => getInvoiceDashboardPath(invoice, { paymentCompleted: true }), [invoice]);
  const showTaxInvoice = Boolean(invoice?.gstInvoiceEnabled && invoice?.customer.gstNumber);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(latestOrderStorageKey);
        if (!raw) { setInvoice(null); return; }
        const parsed = JSON.parse(raw) as StoredOrderSuccess;
        if (orderId && parsed.orderId !== orderId) { setInvoice(null); return; }
        setInvoice(parsed);
      } catch { setInvoice(null); } finally { setReady(true); }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [orderId]);

  useEffect(() => {
    if (!invoice) return;
    const timeout  = window.setTimeout(() => router.replace(dashboardPath), 12000);
    const interval = window.setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => { window.clearTimeout(timeout); window.clearInterval(interval); };
  }, [dashboardPath, invoice, router]);

  if (!ready) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-[#64748B]">Loading invoice…</p>
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
          <Link href={dashboardPath} className="mt-6 inline-flex rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white">
            Go to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#060B14] px-4 py-10 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-4xl">

        {/* ── Success banner (hidden on print) ── */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/15 text-[#34D399]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white">Payment Successful 🎉</p>
              <p className="text-[12px] text-[#64748B]">Redirecting to dashboard in {countdown}s</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-[#94A3B8] hover:text-white">
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            INVOICE DOCUMENT
        ══════════════════════════════════════════ */}
        <div
          id="invoice"
          className="rounded-[20px] border border-[#1E2D42] bg-[#0D1117] shadow-[0_24px_60px_rgba(0,0,0,0.4)] print:rounded-none print:border-none print:shadow-none print:bg-white"
        >
          {/* ── Header ── */}
          <div className="border-b border-[#1E2D42] px-7 py-6 print:border-[#E2E8F0]">
            <div className="flex items-start justify-between gap-6">
              {/* Seller */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] print:text-[#4F46E5]">
                  {SELLER.brand}
                </p>
                <p className="mt-1 text-[15px] font-bold text-white print:text-[#0F172A]">{SELLER.legalName}</p>
                <p className="mt-1 text-[12px] text-[#64748B] print:text-[#475569]">{SELLER.address}</p>
                <p className="text-[12px] text-[#64748B] print:text-[#475569]">{SELLER.city}</p>
                <p className="text-[12px] text-[#64748B] print:text-[#475569]">
                  GSTIN: <span className="font-mono font-semibold text-[#94A3B8] print:text-[#334155]">{SELLER.gstin}</span>
                  {" | "}PAN: <span className="font-mono font-semibold text-[#94A3B8] print:text-[#334155]">{SELLER.pan}</span>
                </p>
                <p className="text-[12px] text-[#64748B] print:text-[#475569]">State: {SELLER.state}</p>
              </div>

              {/* Invoice meta */}
              <div className="shrink-0 text-right">
                <p className="text-[22px] font-extrabold tracking-tight text-white print:text-[#0F172A]">
                  {showTaxInvoice ? "TAX INVOICE" : "INVOICE"}
                </p>
                <p className="mt-1 font-mono text-[15px] font-semibold text-[#818CF8] print:text-[#4F46E5]">
                  {invoice.invoiceNumber}
                </p>
                <p className="mt-1 text-[12px] text-[#64748B] print:text-[#475569]">
                  {formatInvoiceDate(invoice.paidAtIso)}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#34D399]/10 px-3 py-1 text-[11px] font-bold text-[#34D399] print:bg-[#F0FDF4] print:text-[#16A34A]">
                  <CheckCircle2 className="h-3 w-3" /> PAID
                </div>
              </div>
            </div>
          </div>

          {/* ── Billed To + Payment ── */}
          <div className="grid gap-5 border-b border-[#1E2D42] px-7 py-5 sm:grid-cols-2 print:border-[#E2E8F0]">
            {/* Billed to */}
            <div>
              <InvoiceLabel>Billed To</InvoiceLabel>
              <InvoiceVal className="font-semibold text-white print:text-[#0F172A]">
                {invoice.customer.name}
              </InvoiceVal>
              <InvoiceVal>{invoice.customer.phone}</InvoiceVal>
              {invoice.customer.email   && <InvoiceVal>{invoice.customer.email}</InvoiceVal>}
              {invoice.customer.companyName && (
                <InvoiceVal className="font-semibold print:text-[#334155]">
                  {invoice.customer.companyName}
                </InvoiceVal>
              )}
              {invoice.customer.gstNumber && (
                <InvoiceVal>
                  GSTIN: <span className="font-mono text-[#818CF8] print:text-[#4F46E5]">{invoice.customer.gstNumber}</span>
                </InvoiceVal>
              )}
            </div>

            {/* Payment details */}
            <div>
              <InvoiceLabel>Payment Details</InvoiceLabel>
              <div className="mt-1 space-y-1">
                {[
                  ["Razorpay Order", invoice.orderId],
                  ["Payment ID",     invoice.paymentId],
                  ["Method",         invoice.paymentMethod],
                  ["Date",           formatInvoiceDate(invoice.paidAtIso)],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap justify-between gap-2">
                    <span className="text-[11px] text-[#475569] print:text-[#64748B]">{k}</span>
                    <span className="font-mono text-[11px] text-[#94A3B8] print:text-[#334155]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Line items ── */}
          <div className="px-7 py-5">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#1E2D42] print:border-[#E2E8F0]">
                  <th className="pb-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#475569]">Description</th>
                  <th className="pb-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#475569]">Duration</th>
                  <th className="pb-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#475569]">Level</th>
                  <th className="pb-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#475569]">SAC</th>
                  <th className="pb-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-[#475569]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.courses.map((course, i) => {
                  const base = showTaxInvoice
                    ? Math.round(course.amountPaise / 1.18)
                    : course.amountPaise;
                  return (
                    <tr key={course.slug} className={`border-b border-[#0F172A]/60 print:border-[#F1F5F9] ${i % 2 === 0 ? "" : "bg-white/[0.01] print:bg-[#F8FAFC]"}`}>
                      <td className="py-3 text-[#E2E8F0] print:text-[#0F172A]">
                        <p className="font-semibold">{course.title}</p>
                        <p className="text-[11px] text-[#475569]">{SELLER.brand} — Online Training Program</p>
                      </td>
                      <td className="py-3 text-center text-[#94A3B8] print:text-[#475569]">{course.duration}</td>
                      <td className="py-3 text-center text-[#94A3B8] print:text-[#475569]">{course.level}</td>
                      <td className="py-3 text-center font-mono text-[11px] text-[#475569]">998313</td>
                      <td className="py-3 text-right font-semibold text-[#E2E8F0] print:text-[#0F172A]">
                        {formatCurrencyInrFromPaise(base)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-end border-t border-[#1E2D42] px-7 py-5 print:border-[#E2E8F0]">
            <div className="w-full max-w-[280px] space-y-2">
              {showTaxInvoice ? (
                <>
                  {invoice.discountPaise ? (
                    <>
                      <div className="flex justify-between text-[13px] text-[#94A3B8] print:text-[#475569]">
                        <span>Original Price</span>
                        <span>{formatCurrencyInrFromPaise(invoice.subtotalPaise)}</span>
                      </div>
                      <div className="flex justify-between text-[13px] text-[#34D399] print:text-[#16A34A]">
                        <span>Coupon Discount</span>
                        <span>-{formatCurrencyInrFromPaise(invoice.discountPaise)}</span>
                      </div>
                    </>
                  ) : null}
                  <div className="flex justify-between text-[13px] text-[#94A3B8] print:text-[#475569]">
                    <span>Subtotal (excl. GST)</span>
                    <span>{formatCurrencyInrFromPaise(invoice.baseAmountPaise)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#94A3B8] print:text-[#475569]">
                    <span>CGST @ 9%</span>
                    <span>{formatCurrencyInrFromPaise(Math.round(invoice.gstPaise / 2))}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#94A3B8] print:text-[#475569]">
                    <span>SGST @ 9%</span>
                    <span>{formatCurrencyInrFromPaise(Math.round(invoice.gstPaise / 2))}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-[13px] text-[#94A3B8] print:text-[#475569]">
                    <span>Original Price</span>
                    <span>{formatCurrencyInrFromPaise(invoice.subtotalPaise)}</span>
                  </div>
                  {invoice.discountPaise ? (
                    <div className="flex justify-between text-[13px] text-[#34D399] print:text-[#16A34A]">
                      <span>Coupon Discount</span>
                      <span>-{formatCurrencyInrFromPaise(invoice.discountPaise)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-[13px] text-[#94A3B8] print:text-[#475569]">
                    <span>GST (18% incl.)</span>
                    <span>{formatCurrencyInrFromPaise(Math.round(invoice.totalPaidPaise - invoice.totalPaidPaise / 1.18))}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-[13px] text-[#34D399] print:text-[#16A34A]">
                <span>Platform Fee</span>
                <span>₹0 (Included)</span>
              </div>
              <div className="border-t border-[#1E2D42] pt-3 print:border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-white print:text-[#0F172A]">Total Paid</span>
                  <span className="text-[18px] font-extrabold text-[#818CF8] print:text-[#4F46E5]">
                    {formatCurrencyInrFromPaise(invoice.totalPaidPaise)}
                  </span>
                </div>
                {showTaxInvoice && (
                  <p className="mt-1 text-right text-[10px] text-[#475569]">
                    Inclusive of GST — SAC Code 998313
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Declaration / Footer ── */}
          <div className="border-t border-[#1E2D42] px-7 py-5 print:border-[#E2E8F0]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-sm text-[11px] leading-5 text-[#475569]">
                <p className="font-semibold text-[#64748B] print:text-[#334155]">Terms & Declaration</p>
                <p className="mt-1">This is a computer-generated invoice and does not require a signature. Subject to Pune jurisdiction. All disputes subject to Pune courts only.</p>
                <p className="mt-1">SAC Code 998313 — Online educational support services.</p>
                {showTaxInvoice && (
                  <p className="mt-1">We declare that this invoice shows the actual price of the services described and all particulars are true and correct.</p>
                )}
              </div>
              <div className="text-right text-[11px] text-[#475569]">
                <p className="font-semibold text-[#64748B] print:text-[#334155]">For {SELLER.legalName}</p>
                <p className="mt-4 text-[10px]">Authorised Signatory</p>
                <p className="mt-1 font-semibold text-[#94A3B8] print:text-[#334155]">{SELLER.brand}</p>
                <p className="mt-2 text-[#475569]">{SELLER.phone} · {SELLER.email}</p>
                <p className="text-[#475569]">{SELLER.website}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions (print hidden) ── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap gap-3">
            <Link href={dashboardPath}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]">
              Open LMS Portal
            </Link>
            <Link href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:text-white">
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
