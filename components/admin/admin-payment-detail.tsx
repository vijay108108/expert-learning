"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, FileText, RefreshCw, UserRound } from "lucide-react";
import { listAllEnrollments, type FirestoreEnrollment } from "@/lib/firebase";
import { formatAdminCurrency, formatAdminDate } from "@/lib/admin/reporting";

type PaymentRecord = FirestoreEnrollment & { id: string };

export function AdminPaymentDetail({ id }: { id: string }) {
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const allEnrollments = await listAllEnrollments();
      const matched = (allEnrollments as PaymentRecord[]).find((item) => item.id === id) || null;
      setPayment(matched);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  if (loading) {
    return <div className="h-48 animate-pulse rounded-2xl border border-white/8 bg-[#0D1117]" />;
  }

  if (!payment) {
    return (
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="text-lg font-semibold text-white">Payment not found</p>
        <Link href="/admin/payments" className="mt-4 inline-flex items-center gap-2 text-sm text-[#818CF8] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/payments" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-[#94A3B8] transition hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Payment record</p>
          <p className="mt-2 text-3xl font-bold text-white">{formatAdminCurrency(payment.amountPaid)}</p>
          <p className="mt-2 text-sm text-[#94A3B8]">{payment.courseName || payment.courseId}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Payment ID</p>
              <p className="mt-2 break-all text-sm text-white">{payment.razorpayPaymentId || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Order ID</p>
              <p className="mt-2 break-all text-sm text-white">{payment.razorpayOrderId || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Invoice number</p>
              <p className="mt-2 text-sm text-white">{payment.invoiceNumber || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Paid on</p>
              <p className="mt-2 text-sm text-white">{formatAdminDate(payment.enrolledAt)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4F46E5]/15 text-[#818CF8]">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{payment.userName || "Learner"}</p>
              <p className="text-sm text-[#94A3B8]">{payment.userPhone || payment.userEmail || "-"}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#94A3B8]">
            <p>Enrollment type: <span className="text-white">{payment.enrollmentType || "course"}</span></p>
            <p>Status: <span className="text-white">{payment.status || "active"}</span></p>
            <p>Duration: <span className="text-white">{payment.duration || "-"}</span></p>
            <p>Level: <span className="text-white">{payment.level || "-"}</span></p>
            <p>Company: <span className="text-white">{payment.companyName || "-"}</span></p>
            <p>GST: <span className="text-white">{payment.gstNumber || "-"}</span></p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/admin/users/${payment.userId}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8] transition hover:text-white">
              View learner
            </Link>
            {payment.invoiceNumber ? (
              <Link href={`/admin/invoices/${encodeURIComponent(payment.invoiceNumber)}`} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8] transition hover:text-white">
                <FileText className="h-4 w-4" />
                Open invoice
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
