"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, RefreshCw, Search } from "lucide-react";
import { listAllEnrollments, type FirestoreEnrollment } from "@/lib/firebase";
import { buildInvoiceRecords, downloadCsv, formatAdminCurrency, formatAdminDate } from "@/lib/admin/reporting";

type EnrollmentRecord = FirestoreEnrollment & { id: string };

export function AdminInvoicesTable() {
  const [rows, setRows] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const allEnrollments = await listAllEnrollments();
      const paid = (allEnrollments as EnrollmentRecord[]).filter((item) => item.amountPaid || item.invoiceNumber);
      setRows(paid);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const invoices = useMemo(() => buildInvoiceRecords(rows), [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return invoices.filter((item) => {
      if (!query) {
        return true;
      }

      return [
        item.invoiceNumber,
        item.userName,
        item.userPhone,
        item.userEmail,
        item.razorpayPaymentId,
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [invoices, search]);

  function exportCsv() {
    downloadCsv(
      "genznext-invoices.csv",
      ["Invoice Number", "Learner", "Phone", "Email", "Payment ID", "Order ID", "Amount", "Line Items", "Paid At"],
      filtered.map((item) => [
        item.invoiceNumber,
        item.userName,
        item.userPhone,
        item.userEmail || "",
        item.razorpayPaymentId,
        item.razorpayOrderId,
        item.totalAmount,
        item.lineItems.map((line) => line.courseName || line.courseId).join(" | "),
        item.paidAt,
      ]),
    );
  }

  const totalAmount = filtered.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Invoices</p>
          <p className="mt-2 text-3xl font-bold text-white">{filtered.length}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Total billed</p>
          <p className="mt-2 text-3xl font-bold text-[#34D399]">{formatAdminCurrency(totalAmount)}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Average invoice</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {filtered.length ? formatAdminCurrency(Math.round(totalAmount / filtered.length)) : "INR 0"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by invoice, learner or payment ID..."
            className="h-9 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
          />
        </div>
        <button onClick={() => void load()} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] hover:text-white">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <button onClick={exportCsv} className="flex h-9 items-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-3 text-[12px] font-semibold text-white">
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/4 text-left text-[11px] uppercase tracking-[0.18em] text-[#475569]">
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Paid on</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-white/6">
                  {[...Array(5)].map((__, cell) => (
                    <td key={cell} className="px-4 py-3">
                      <div className="h-3.5 animate-pulse rounded bg-white/8 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#334155]">No invoices found.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.invoiceNumber} className="border-b border-white/6 bg-[#0D1117]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/invoices/${encodeURIComponent(item.invoiceNumber)}`} className="inline-flex items-center gap-2 font-medium text-[#818CF8] hover:underline">
                      <FileText className="h-4 w-4" />
                      {item.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{item.userName}</p>
                    <p className="text-xs text-[#64748B]">{item.userPhone || item.userEmail || "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-[#34D399]">{formatAdminCurrency(item.totalAmount)}</td>
                  <td className="px-4 py-3 text-[#94A3B8]">{item.lineItems.length}</td>
                  <td className="px-4 py-3 text-[#94A3B8]">{formatAdminDate(item.paidAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
