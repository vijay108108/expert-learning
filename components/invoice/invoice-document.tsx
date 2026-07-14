"use client";

import { CheckCircle2 } from "lucide-react";
import { formatCurrencyInrFromPaise, formatInvoiceDate, type StoredOrderSuccess } from "@/lib/order-success";
import type { PersistedInvoiceRecord } from "@/lib/invoices";

const SELLER = {
  legalName: "NETSEEMS VENTURES PRIVATE LIMITED",
  brand: "GenZNext Research & Training",
  address: "A19, Om Bungalow, Sai Jyot Park",
  city: "Rahatani, Pune, Maharashtra - 411017",
  phone: "+91 8867359208",
  email: "info@genznext.com",
  gstin: "27AAHCN4778J1ZU",
  pan: "AAHCN4778J",
  state: "Maharashtra (27)",
  website: "expertlearning.in",
};

const INVOICE_TERMS = [
  "This is a computer-generated invoice and does not require a physical signature.",
  "Registration, course enrollment, workshop booking, subscription, or service activation is confirmed only after successful payment.",
  "All payments made towards workshops, training programs, online courses, certifications, subscriptions, LMS access, memberships, digital products, consulting, or any other services offered by NetSeems Ventures Private Limited (GenZNext Research & Training) are non-refundable and non-transferable, unless otherwise specified in writing by the Company.",
  "GenZNext reserves the right to modify course content, curriculum, trainers, schedules, workshop dates, delivery mode (online/offline), learning resources, or platform features at any time to improve the learning experience or due to operational requirements.",
  "Access to courses, LMS, workshops, live sessions, recordings, certificates, study materials, digital resources, software, assessments, and community platforms is granted exclusively to the registered participant and must not be shared, transferred, resold, or sublicensed.",
  "All training materials, videos, recordings, presentations, source code, templates, documents, assignments, assessments, AI prompts, datasets, software, and other intellectual property remain the exclusive property of NetSeems Ventures Private Limited. Unauthorized copying, recording, downloading, redistribution, publishing, AI model training, reverse engineering, commercial use, or resale is strictly prohibited.",
  "The Company reserves the right to suspend or permanently terminate access to any service without refund in cases of account sharing, piracy, copyright infringement, abusive behavior, policy violations, fraudulent activities, payment disputes, chargebacks, or misuse of any platform or service.",
  "LMS access duration, subscription validity, course availability, recordings, certificates, mentorship sessions, bonus content, and other benefits shall be provided only as applicable to the purchased plan and may vary between programs.",
  "Completion of any course, workshop, certification, or training program does not guarantee employment, internships, promotions, salary increases, business success, certification success, client acquisition, or any specific professional outcome. Individual results depend on the participant's knowledge, effort, skills, and practical application.",
  "Participants are responsible for arranging a compatible device, internet connection, software, and technical requirements necessary to access online services.",
  "Workshop sessions, mentoring sessions, webinars, and online classes may be recorded for educational, quality assurance, compliance, and internal business purposes. By participating, the participant grants consent for such recordings.",
  "GenZNext shall not be liable for any indirect, incidental, consequential, special, business, financial, or data losses arising from the use of its services, training programs, software, LMS, digital content, or educational materials.",
  "The Company shall not be responsible for delays or failure to perform its obligations due to events beyond its reasonable control, including but not limited to natural disasters, pandemics, government actions, internet failures, cloud service outages, cyber-attacks, power failures, or other force majeure events.",
  "The Company reserves the right to revise pricing, subscription plans, policies, platform features, and service offerings without prior notice. Such changes shall not affect completed purchases unless otherwise communicated.",
  "By making payment or using any GenZNext service, the participant confirms that they have read, understood, and agreed to these Terms & Conditions and consent to receive service-related communications through Email, SMS, WhatsApp, phone calls, and other official communication channels.",
  "All disputes shall be governed by the laws of India and subject to the exclusive jurisdiction of the competent courts at Pune, Maharashtra, India.",
] as const;

function InvoiceLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#64748B]">{children}</p>
  );
}

function InvoiceVal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-0.5 text-[12.5px] text-[#E2E8F0] ${className}`}>{children}</p>;
}

function resolveInvoicePaymentStatus(invoice: StoredOrderSuccess | PersistedInvoiceRecord) {
  const persistedInvoice = invoice as PersistedInvoiceRecord;

  if (persistedInvoice.paymentStatus === "free" || invoice.totalPaidPaise <= 0) {
    return "ENROLLED";
  }

  if (persistedInvoice.paymentStatus === "failed") {
    return "FAILED";
  }

  if (persistedInvoice.paymentStatus === "pending") {
    return "PENDING";
  }

  return "PAID";
}

function resolveInvoiceMethod(invoice: StoredOrderSuccess | PersistedInvoiceRecord) {
  if (invoice.totalPaidPaise <= 0) {
    return "Free Coupon";
  }

  if (invoice.appliedCouponCode && invoice.discountPaise) {
    return "Razorpay + Coupon";
  }

  return invoice.paymentMethod || "Razorpay";
}

export function InvoiceDocument({ invoice }: { invoice: StoredOrderSuccess | PersistedInvoiceRecord }) {
  const showTaxInvoice = Boolean(invoice.gstInvoiceEnabled && invoice.customer.gstNumber);
  const statusLabel = resolveInvoicePaymentStatus(invoice);
  const paymentMethodLabel = resolveInvoiceMethod(invoice);

  return (
    <div
      id="invoice"
      className="rounded-[20px] border border-[#1E2D42] bg-[#0D1117] shadow-[0_24px_60px_rgba(0,0,0,0.4)] print:rounded-none print:border-none print:shadow-none print:bg-white"
    >
      <div className="border-b border-[#1E2D42] px-7 py-6 print:border-[#E2E8F0]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0B2E6B] print:text-[#0B2E6B]">
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

          <div className="shrink-0 text-right">
            <p className="text-[22px] font-extrabold tracking-tight text-white print:text-[#0F172A]">
              {showTaxInvoice ? "TAX INVOICE" : "INVOICE"}
            </p>
            <p className="mt-1 font-mono text-[15px] font-semibold text-[#818CF8] print:text-[#0B2E6B]">
              {invoice.invoiceNumber}
            </p>
            <p className="mt-1 text-[12px] text-[#64748B] print:text-[#475569]">
              {formatInvoiceDate(invoice.paidAtIso)}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#34D399]/10 px-3 py-1 text-[11px] font-bold text-[#34D399] print:bg-[#F0FDF4] print:text-[#16A34A]">
              <CheckCircle2 className="h-3 w-3" /> {statusLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-b border-[#1E2D42] px-7 py-5 sm:grid-cols-2 print:border-[#E2E8F0]">
        <div>
          <InvoiceLabel>Billed To</InvoiceLabel>
          <InvoiceVal className="font-semibold text-white print:text-[#0F172A]">
            {invoice.customer.name}
          </InvoiceVal>
          <InvoiceVal>{invoice.customer.phone}</InvoiceVal>
          {invoice.customer.email && <InvoiceVal>{invoice.customer.email}</InvoiceVal>}
          {invoice.customer.companyName && (
            <InvoiceVal className="font-semibold print:text-[#334155]">
              {invoice.customer.companyName}
            </InvoiceVal>
          )}
          {invoice.customer.gstNumber && (
            <InvoiceVal>
              GSTIN: <span className="font-mono text-[#818CF8] print:text-[#0B2E6B]">{invoice.customer.gstNumber}</span>
            </InvoiceVal>
          )}
        </div>

        <div>
          <InvoiceLabel>Payment Details</InvoiceLabel>
          <div className="mt-1 space-y-1">
            {[
              ["Razorpay Order", invoice.orderId || "-"],
              ["Payment ID", invoice.paymentId || "-"],
              ["Method", paymentMethodLabel],
              ["Status", statusLabel],
              ["Coupon", invoice.appliedCouponCode || "-"],
              ["Date", formatInvoiceDate(invoice.paidAtIso)],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-2">
                <span className="text-[11px] text-[#475569] print:text-[#64748B]">{label}</span>
                <span className="font-mono text-[11px] text-[#94A3B8] print:text-[#334155]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
            {invoice.courses.map((course, index) => {
              const baseAmount = showTaxInvoice ? Math.round(course.amountPaise / 1.18) : course.amountPaise;

              return (
                <tr
                  key={`${course.slug}-${index}`}
                  className={`border-b border-[#0F172A]/60 print:border-[#F1F5F9] ${index % 2 === 0 ? "" : "bg-white/[0.01] print:bg-[#F8FAFC]"}`}
                >
                  <td className="py-3 text-[#E2E8F0] print:text-[#0F172A]">
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-[11px] text-[#475569]">{SELLER.brand} - Online Training Program</p>
                  </td>
                  <td className="py-3 text-center text-[#94A3B8] print:text-[#475569]">{course.duration}</td>
                  <td className="py-3 text-center text-[#94A3B8] print:text-[#475569]">{course.level}</td>
                  <td className="py-3 text-center font-mono text-[11px] text-[#475569]">998313</td>
                  <td className="py-3 text-right font-semibold text-[#E2E8F0] print:text-[#0F172A]">
                    {formatCurrencyInrFromPaise(baseAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
            <span>Rs.0 (Included)</span>
          </div>
          <div className="border-t border-[#1E2D42] pt-3 print:border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-white print:text-[#0F172A]">Total Paid</span>
              <span className="text-[18px] font-extrabold text-[#818CF8] print:text-[#0B2E6B]">
                {formatCurrencyInrFromPaise(invoice.totalPaidPaise)}
              </span>
            </div>
            {showTaxInvoice ? (
              <p className="mt-1 text-right text-[10px] text-[#475569]">
                Inclusive of GST - SAC Code 998313
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-[#1E2D42] px-7 py-5 print:border-[#E2E8F0]">
        <div className="text-[11px] leading-5 text-[#475569]">
          <p className="font-semibold text-[#64748B] print:text-[#334155]">TERMS & CONDITIONS</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            {INVOICE_TERMS.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ol>

          <div className="mt-4 rounded-xl border border-[#1E2D42] bg-[#0F172A]/30 p-3 print:border-[#E2E8F0] print:bg-[#F8FAFC]">
            <p className="font-semibold text-[#94A3B8] print:text-[#334155]">Customer Support</p>
            <p className="mt-1 font-semibold text-[#E2E8F0] print:text-[#0F172A]">GenZNext Research & Training</p>
            <p className="text-[#94A3B8] print:text-[#475569]">A Division of NetSeems Ventures Private Limited</p>
            <p className="mt-1">Email: support@netseems.com</p>
            <p>Phone: +91 88673 59208</p>
            <p>Website: https://genznext.com</p>
          </div>

          {showTaxInvoice ? (
            <p className="mt-3">SAC Code 998313 - Online educational support services.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
