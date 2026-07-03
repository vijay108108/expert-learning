"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";
import { listAllEnrollments, type FirestoreEnrollment } from "@/lib/firebase";
import { downloadCsv, formatAdminCurrency, formatAdminDate } from "@/lib/admin/reporting";

type Payment = FirestoreEnrollment & { id: string };

export function AdminPaymentsTable() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const all = await listAllEnrollments();
      const paid = (all as Payment[])
        .filter((r) => r.razorpayPaymentId || r.amountPaid)
        .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
      setRows(paid);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.userName?.toLowerCase().includes(q) || r.courseName?.toLowerCase().includes(q) || r.razorpayPaymentId?.includes(q);
  });

  const totalRevenue = filtered.reduce((sum, r) => sum + (r.amountPaid || 0), 0);

  function exportCsv() {
    downloadCsv(
      "genznext-payments.csv",
      ["Learner", "Phone", "Email", "Course", "Amount", "Payment ID", "Order ID", "Invoice Number", "Paid At"],
      filtered.map((item) => [
        item.userName || "",
        item.userPhone || "",
        item.userEmail || "",
        item.courseName || item.courseId || "",
        item.amountPaid || 0,
        item.razorpayPaymentId || "",
        item.razorpayOrderId || "",
        item.invoiceNumber || "",
        item.enrolledAt || "",
      ]),
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Revenue", value: formatAdminCurrency(totalRevenue), color: "text-[#34D399]" },
          { label: "Total Payments", value: filtered.length, color: "text-[#818CF8]" },
          {
            label: "Avg. Order Value",
            value: filtered.length ? formatAdminCurrency(Math.round(totalRevenue / filtered.length)) : "-",
            color: "text-[#60A5FA]",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-[#0D1117] p-4">
            <p className="text-[11px] text-[#475569]">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, course or payment ID..."
            className="h-9 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#4F46E5]/50"
          />
        </div>
        <button onClick={load} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] hover:text-white">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <button onClick={exportCsv} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] hover:text-white">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/4 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment ID</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-white/6">
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3.5 animate-pulse rounded bg-white/8 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#334155]">No payments found.</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/6 bg-[#0D1117] transition hover:bg-white/3">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${r.userId}`} className="font-medium text-white hover:text-[#818CF8]">
                      {r.userName || "-"}
                    </Link>
                    <p className="text-[11px] text-[#475569]">{r.userPhone || r.userEmail || "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8]">{r.courseName || r.courseId || "-"}</td>
                  <td className="px-4 py-3 font-semibold text-[#34D399]">{formatAdminCurrency(r.amountPaid)}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#475569]">
                    <Link href={`/admin/payments/${r.id}`} className="hover:text-[#818CF8]">
                      {r.razorpayPaymentId || "-"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#475569]">
                    {r.invoiceNumber ? (
                      <Link href={`/admin/invoices/${encodeURIComponent(r.invoiceNumber)}`} className="hover:text-[#818CF8]">
                        {r.invoiceNumber}
                      </Link>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 text-[#475569]">{formatAdminDate(r.enrolledAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
