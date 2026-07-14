"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Printer, RefreshCw, UserRound } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { buildInvoiceRecordsFromPersistedInvoices, downloadCsv, formatAdminCurrency, formatAdminDate } from "@/lib/admin/reporting";
import type { PersistedInvoiceRecord } from "@/lib/invoices";

async function getAdminAuthHeader() {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();
  if (!token) {
    throw new Error("Not signed in.");
  }
  return { Authorization: `Bearer ${token}` };
}

export function AdminInvoiceDetail({ invoiceNumber }: { invoiceNumber: string }) {
  const [invoicesRaw, setInvoicesRaw] = useState<PersistedInvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await getAdminAuthHeader();
      const response = await fetch("/api/admin/invoices", {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; invoices?: PersistedInvoiceRecord[]; message?: string }
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to load invoice details.");
      }

      setInvoicesRaw(payload.invoices || []);
    } catch {
      setInvoicesRaw([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [invoiceNumber, load]);

  const invoice = useMemo(
    () => buildInvoiceRecordsFromPersistedInvoices(invoicesRaw).find((item) => item.invoiceNumber === invoiceNumber) || null,
    [invoiceNumber, invoicesRaw],
  );

  function exportCsv() {
    if (!invoice) {
      return;
    }

    downloadCsv(
      `${invoice.invoiceNumber}.csv`,
      ["Invoice Number", "Course", "Amount", "Payment ID", "Order ID", "Learner", "Phone", "Paid At"],
      invoice.lineItems.map((item) => [
        invoice.invoiceNumber,
        item.courseName || item.courseId,
        item.amountPaid || 0,
        item.razorpayPaymentId || "",
        item.razorpayOrderId || "",
        item.userName || "",
        item.userPhone || "",
        item.enrolledAt || "",
      ]),
    );
  }

  if (loading) {
    return <div className="h-48 animate-pulse rounded-2xl border border-white/8 bg-[#0D1117]" />;
  }

  if (!invoice) {
    return (
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="text-lg font-semibold text-white">Invoice not found</p>
        <Link href="/admin/invoices" className="mt-4 inline-flex items-center gap-2 text-sm text-[#818CF8] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </Link>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => void load()} className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-[#94A3B8] transition hover:text-white">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button onClick={exportCsv} className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-[#94A3B8] transition hover:text-white">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-3 text-xs font-semibold text-white">
            <Printer className="h-3.5 w-3.5" />
            Print invoice
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Invoice number</p>
          <p className="mt-2 text-3xl font-bold text-white">{invoice.invoiceNumber}</p>
          <p className="mt-2 text-sm text-[#94A3B8]">Paid on {formatAdminDate(invoice.paidAt)}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Payment ID</p>
              <p className="mt-2 break-all text-sm text-white">{invoice.razorpayPaymentId || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Order ID</p>
              <p className="mt-2 break-all text-sm text-white">{invoice.razorpayOrderId || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Courses</p>
              <p className="mt-2 text-sm text-white">{invoice.lineItems.length}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Total amount</p>
              <p className="mt-2 text-sm font-semibold text-[#34D399]">{formatAdminCurrency(invoice.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B2E6B]/15 text-[#818CF8]">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{invoice.userName}</p>
              <p className="text-sm text-[#94A3B8]">{invoice.userPhone || invoice.userEmail || "-"}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#94A3B8]">
            <p>Company: <span className="text-white">{invoice.companyName || "-"}</span></p>
            <p>GST Number: <span className="text-white">{invoice.gstNumber || "-"}</span></p>
          </div>

          <div className="mt-5">
            <Link href={`/admin/users/${invoice.userId}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8] transition hover:text-white">
              View learner
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
        <p className="text-lg font-semibold text-white">Line items</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/4 text-left text-xs uppercase tracking-[0.18em] text-[#64748B]">
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment detail</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-white/6 bg-[#0D1117]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{item.courseName || item.courseId}</p>
                    <p className="text-xs text-[#64748B]">{formatAdminDate(item.enrolledAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8]">{item.enrollmentType || "course"}</td>
                  <td className="px-4 py-3 text-[#34D399]">{formatAdminCurrency(item.amountPaid)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/payments/${item.id}`} className="text-[#818CF8] hover:underline">
                      Open payment
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
