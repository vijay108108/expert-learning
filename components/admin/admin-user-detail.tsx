"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CreditCard, FileText, GraduationCap, Phone, RefreshCw, UserRound } from "lucide-react";
import { listAllEnrollments, listUserProfiles, type AppUserProfile, type FirestoreEnrollment } from "@/lib/firebase";
import { formatAdminCurrency, formatAdminDate } from "@/lib/admin/reporting";

type UserRecord = AppUserProfile & { id: string };
type EnrollmentRecord = FirestoreEnrollment & { id: string };

export function AdminUserDetail({ uid }: { uid: string }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [users, allEnrollments] = await Promise.all([listUserProfiles(), listAllEnrollments()]);
      const userEnrollments = (allEnrollments as EnrollmentRecord[])
        .filter((item) => item.userId === uid)
        .sort((left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime());
      const matchedUser = (users as UserRecord[]).find((item) => (item.uid || item.id) === uid) || null;
      const fallbackUser = userEnrollments[0]
        ? {
            id: uid,
            uid,
            name: userEnrollments[0].userName || "",
            phone: userEnrollments[0].userPhone || "",
            email: userEnrollments[0].userEmail || "",
            createdAt: userEnrollments.at(-1)?.enrolledAt || userEnrollments[0].enrolledAt || "",
            authMethod: "otp" as const,
            role: "student" as const,
          }
        : null;
      const mergedUser = matchedUser
        ? {
            ...matchedUser,
            name: matchedUser.name || fallbackUser?.name || "",
            phone: matchedUser.phone || fallbackUser?.phone || "",
            email: matchedUser.email || fallbackUser?.email || "",
            createdAt: matchedUser.createdAt || fallbackUser?.createdAt || "",
          }
        : fallbackUser;

      setUser(mergedUser);
      setEnrollments(userEnrollments);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const summary = useMemo(() => {
    const totalPaid = enrollments.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
    const invoices = new Set(enrollments.map((item) => item.invoiceNumber).filter(Boolean));
    return {
      totalPaid,
      invoiceCount: invoices.size,
      enrollmentCount: enrollments.length,
    };
  }, [enrollments]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-white/8 bg-[#0D1117]" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="text-lg font-semibold text-white">User not found</p>
        <p className="mt-2 text-sm text-[#94A3B8]">This learner profile is not available in Firestore.</p>
        <Link href="/admin/users" className="mt-4 inline-flex items-center gap-2 text-sm text-[#818CF8] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to users
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

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F46E5]/15 text-[#818CF8]">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-bold text-white">{user.name || "Unnamed learner"}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">{user.role || "student"}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">{user.authMethod || "unknown auth"}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Phone</p>
              <p className="mt-2 text-sm text-white">{user.phone || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Email</p>
              <p className="mt-2 text-sm text-white">{user.email || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Joined</p>
              <p className="mt-2 text-sm text-white">{formatAdminDate(user.createdAt)}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">User ID</p>
              <p className="mt-2 break-all text-sm text-white">{user.uid || user.id}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Total paid</p>
            <p className="mt-2 text-3xl font-bold text-[#34D399]">{formatAdminCurrency(summary.totalPaid)}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Enrollments</p>
            <p className="mt-2 text-3xl font-bold text-white">{summary.enrollmentCount}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Invoices</p>
            <p className="mt-2 text-3xl font-bold text-white">{summary.invoiceCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-white">Payment and enrollment history</p>
          <p className="text-sm text-[#64748B]">{enrollments.length} records</p>
        </div>

        {enrollments.length === 0 ? (
          <p className="mt-4 text-sm text-[#94A3B8]">No enrollments or payments found for this learner yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/4 text-left text-xs uppercase tracking-[0.18em] text-[#64748B]">
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((item) => (
                  <tr key={item.id} className="border-b border-white/6 bg-[#0D1117]">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="mt-0.5 h-4 w-4 text-[#818CF8]" />
                        <div>
                          <p className="font-medium text-white">{item.courseName || item.courseId}</p>
                          <p className="text-xs text-[#64748B]">{item.enrollmentType || "course"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#34D399]">{formatAdminCurrency(item.amountPaid)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/payments/${item.id}`} className="inline-flex items-center gap-2 text-[#818CF8] hover:underline">
                        <CreditCard className="h-4 w-4" />
                        View payment
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {item.invoiceNumber ? (
                        <Link href={`/admin/invoices/${encodeURIComponent(item.invoiceNumber)}`} className="inline-flex items-center gap-2 text-[#818CF8] hover:underline">
                          <FileText className="h-4 w-4" />
                          {item.invoiceNumber}
                        </Link>
                      ) : (
                        <span className="text-[#64748B]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#94A3B8]">{formatAdminDate(item.enrolledAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <p className="text-lg font-semibold text-white">Contact summary</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Phone className="h-4 w-4 text-[#818CF8]" />
              {user.phone || "No phone saved"}
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <UserRound className="h-4 w-4 text-[#818CF8]" />
              {user.email || "No email saved"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <p className="text-lg font-semibold text-white">Finance shortcuts</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/payments" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8] transition hover:text-white">
              Open payments
            </Link>
            <Link href="/admin/invoices" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8] transition hover:text-white">
              Open invoices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
