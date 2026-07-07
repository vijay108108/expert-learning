"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, LoaderCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getInvoiceByNumberForUser, getMyEnrollments, type FirestoreEnrollment, type FirestoreInvoice } from "@/lib/firebase";
import { InvoiceDocument } from "@/components/invoice/invoice-document";
import { buildInvoiceRecordFromEnrollments, type PersistedInvoiceRecord } from "@/lib/invoices";

export function InvoiceViewer({ invoiceNumber }: { invoiceNumber: string }) {
  const { isAuthReady, openAuthModal, user } = useAuth();
  const [invoice, setInvoice] = useState<PersistedInvoiceRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthReady || !user) {
      return;
    }

    let active = true;
    const frame = window.requestAnimationFrame(() => {
      if (active) {
        setLoading(true);
      }
    });

    void (async () => {
      try {
        const [storedInvoice, enrollments] = await Promise.all([
          getInvoiceByNumberForUser(user.uid, invoiceNumber),
          getMyEnrollments(user.uid),
        ]);

        if (!active) {
          return;
        }

        const fallbackInvoice = buildInvoiceRecordFromEnrollments(
          invoiceNumber,
          (enrollments as Array<FirestoreEnrollment & { id: string }>).filter((item) => item.invoiceNumber === invoiceNumber),
        );

        setInvoice((storedInvoice as FirestoreInvoice | null) || fallbackInvoice);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [invoiceNumber, isAuthReady, user]);

  const invoiceTitle = useMemo(() => (invoice ? invoice.courses.map((item) => item.title).join(", ") : ""), [invoice]);

  if (!isAuthReady || loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#475569] shadow-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#4F46E5]" />
          Loading invoice...
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#0F172A]">Sign in to view your invoice</h1>
          <p className="mt-2 text-sm text-[#64748B]">Invoice access is available only for the learner who made the purchase.</p>
          <button
            type="button"
            onClick={() => openAuthModal("login", `/dashboard/invoices/${encodeURIComponent(invoiceNumber)}`)}
            className="mt-6 inline-flex rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Sign In
          </button>
        </div>
      </section>
    );
  }

  if (!invoice) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0F172A]">Invoice not found</h1>
          <p className="mt-2 text-sm text-[#64748B]">We could not find this invoice in your account.</p>
          <Link
            href="/dashboard/profile"
            className="mt-6 inline-flex rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-2.5 text-sm font-semibold text-[#475569]"
          >
            Back to Profile
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#060B14] px-4 py-10 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <p className="text-sm font-semibold text-white">{invoice.invoiceNumber}</p>
            <p className="mt-1 text-[12px] text-[#94A3B8]">{invoiceTitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4F46E5,#2563EB)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Download className="h-4 w-4" />
              Download / Print PDF
            </button>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:text-white"
            >
              Back to Profile
            </Link>
          </div>
        </div>

        <InvoiceDocument invoice={invoice} />

        <div className="mt-6 flex items-center gap-2 text-[12px] text-[#475569] print:hidden">
          <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
          Only invoices linked to your account are visible here.
        </div>
      </div>
    </section>
  );
}
