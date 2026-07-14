"use client";

import { EmailAuthProvider, linkWithCredential, updatePassword, updateProfile } from "firebase/auth";
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit2,
  ExternalLink,
  LoaderCircle,
  Mail,
  Phone,
  Receipt,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import {
  getFirebaseAuth,
  getFirebaseDb,
  getMyEnrollments,
  getUserProfile,
  listInvoicesByUser,
  getFirebaseAuthErrorMessage,
  logFirestoreIssue,
  type AppUserProfile,
  type FirestoreEnrollment,
} from "@/lib/firebase";
import {
  buildFallbackInvoicesFromEnrollments,
  buildPersistedInvoiceRecordFromStoredOrder,
  mergeInvoiceRecords,
  type PersistedInvoiceRecord,
} from "@/lib/invoices";
import { readEnrolledCourses } from "@/lib/my-learning";
import { getCanonicalCourseId } from "@/lib/offering-catalog";
import { formatCurrencyInrFromPaise, formatInvoiceDate, latestOrderStorageKey, type StoredOrderSuccess } from "@/lib/order-success";
import { getInitials } from "@/lib/utils";
import { normalizePhoneForAuth } from "@/lib/firebase/phone-utils";

function getPhoneAuthEmail(rawPhone: string) {
  const normalized = normalizePhoneForAuth(rawPhone);
  return normalized ? `${normalized}@genznext.app` : "";
}

function formatMemberSince(value: string | null) {
  if (!value) return "Recently joined";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function getFirstName(value?: string | null) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] || "";
}

const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

type ProfileRecord = AppUserProfile & {
  companyName?: string;
  gstNumber?: string;
};

function formatPaymentStatus(value: PersistedInvoiceRecord["paymentStatus"]) {
  switch (value) {
    case "captured":
      return "Paid Successfully";
    case "failed":
      return "Failed";
    case "free":
      return "Enrolled Successfully";
    default:
      return "Pending";
  }
}

function formatPaymentMethod(invoice: PersistedInvoiceRecord) {
  if (invoice.paymentStatus === "free" || invoice.totalPaidPaise <= 0) {
    return "Free Coupon";
  }

  if (invoice.appliedCouponCode && invoice.discountPaise) {
    return "Razorpay + Coupon";
  }

  return "Razorpay";
}

async function persistRecoveredInvoice(invoice: PersistedInvoiceRecord) {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();

  if (!token) {
    return;
  }

  await fetch("/api/payment/invoice", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ invoice }),
  });
}

function normalizePhoneNumber(value?: string | null) {
  const digits = (value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function readLatestRecoveredInvoice(userUid: string, userPhone?: string | null) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(latestOrderStorageKey);

    if (!raw) {
      return null;
    }

    const storedInvoice = JSON.parse(raw) as StoredOrderSuccess;
    const invoicePhone = normalizePhoneNumber(storedInvoice.customer.phone);
    const currentUserPhone = normalizePhoneNumber(userPhone);

    if (invoicePhone && currentUserPhone && invoicePhone !== currentUserPhone) {
      return null;
    }

    return buildPersistedInvoiceRecordFromStoredOrder(userUid, storedInvoice);
  } catch (error) {
    logFirestoreIssue("[Profile] Unable to restore latest recovered invoice", error);
    return null;
  }
}

function InvoiceSummaryCard({ invoice }: { invoice: PersistedInvoiceRecord }) {
  const courseLabel = invoice.courses.map((item) => item.title).join(", ");
  const paymentStatusLabel = formatPaymentStatus(invoice.paymentStatus);
  const paymentMethodLabel = formatPaymentMethod(invoice);
  const amountPaidLabel = formatCurrencyInrFromPaise(invoice.totalPaidPaise);
  const discountAppliedLabel = formatCurrencyInrFromPaise(invoice.discountPaise || 0);
  const originalAmountLabel = formatCurrencyInrFromPaise(invoice.subtotalPaise);
  const purchaseDateLabel = formatInvoiceDate(invoice.paidAtIso);
  const paymentStatusClass =
    invoice.paymentStatus === "captured" || invoice.paymentStatus === "free"
      ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
      : invoice.paymentStatus === "failed"
        ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
        : "border-[#E5E7EB] bg-[#F8FAFC] text-[#475569]";

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-bold text-[#0F172A]">{invoice.invoiceNumber}</p>
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${paymentStatusClass}`}>
              {paymentStatusLabel}
            </span>
            {invoice.appliedCouponCode ? (
              <span className="inline-flex rounded-full border border-[#C8D7EE] bg-[#EAF0FA] px-2.5 py-0.5 text-[10px] font-semibold text-[#092552]">
                {invoice.appliedCouponCode}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[12px] font-medium text-[#334155]">{courseLabel}</p>
          <p className="mt-1 text-[11px] text-[#64748B]">
            Purchased on {purchaseDateLabel}
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex min-h-[78px] flex-col justify-center rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Amount Paid</p>
              <p className="mt-1 text-[14px] font-semibold leading-none text-[#0F172A]">{amountPaidLabel}</p>
            </div>
            <div className="flex min-h-[78px] flex-col justify-center rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Original Price</p>
              <p className="mt-1 text-[14px] font-semibold leading-none text-[#0F172A]">{originalAmountLabel}</p>
            </div>
            <div className="flex min-h-[78px] flex-col justify-center rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Discount</p>
              <p className="mt-1 text-[14px] font-semibold leading-none text-[#0F172A]">{discountAppliedLabel}</p>
            </div>
            <div className="flex min-h-[78px] flex-col justify-center rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Payment Method</p>
              <p className="mt-1 truncate text-[14px] font-semibold leading-none text-[#0F172A]">{paymentMethodLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <Link
            href={`/dashboard/invoices/${encodeURIComponent(invoice.invoiceNumber)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C8D7EE] bg-white px-3 py-2 text-[12px] font-semibold text-[#0B2E6B] transition hover:bg-[#EAF0FA]"
          >
            <Download className="h-3.5 w-3.5" />
            View / Download Invoice
          </Link>
        </div>
      </div>

      <details className="mt-3 group rounded-xl border border-[#E2E8F0] bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-[12px] font-semibold text-[#334155]">
          <span>View Details</span>
          <ChevronDown className="h-4 w-4 text-[#64748B] transition group-open:rotate-180" />
        </summary>
        <div className="border-t border-[#E2E8F0] px-3 py-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Order ID", value: invoice.orderId || "-" },
              { label: "Razorpay Payment ID", value: invoice.paymentId || "-" },
              { label: "Billing Name", value: invoice.customer.name || "-" },
              { label: "Phone Number", value: invoice.customer.phone || "-" },
              { label: "Email", value: invoice.customer.email || "-" },
              { label: "Company Name", value: invoice.customer.companyName || "-" },
              { label: "GSTIN", value: invoice.customer.gstNumber || "-" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{item.label}</p>
                <p className="mt-1 break-words text-[12px] font-medium text-[#0F172A]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#64748B]">
            <ExternalLink className="h-3.5 w-3.5 text-[#0B2E6B]" />
            Open invoice page, then use browser Print to Save as PDF for download.
          </div>
        </div>
      </details>
    </div>
  );
}

export function ProfilePanel() {
  const { isAuthReady, openAuthModal, user } = useAuth();
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [courseCount, setCourseCount] = useState(0);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<PersistedInvoiceRecord[]>([]);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editGst, setEditGst] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      if (active) {
        setLoading(true);
      }
    });

    void (async () => {
      try {
        const [nextProfile, enrollments, savedInvoices] = await Promise.all([
          getUserProfile(user.uid),
          getMyEnrollments(user.uid),
          listInvoicesByUser(user.uid),
        ]);

        if (!active) return;

        const typedEnrollments = enrollments as Array<FirestoreEnrollment & { id: string }>;
        const deviceCourses = readEnrolledCourses();
        const recoveredLocalInvoice = readLatestRecoveredInvoice(user.uid, user.phoneNumber);
        const uniqueIds = new Set([
          ...typedEnrollments.map((item) => getCanonicalCourseId(item.courseId)),
          ...deviceCourses.map((item) => getCanonicalCourseId(item.courseSlug)),
        ]);
        const dates = [
          nextProfile?.createdAt,
          user.metadata.creationTime ? new Date(user.metadata.creationTime).toISOString() : null,
          ...typedEnrollments.map((item) => item.enrolledAt),
          ...deviceCourses.map((item) => item.enrolledAt),
        ]
          .filter((value): value is string => Boolean(value))
          .sort((left, right) => new Date(left).getTime() - new Date(right).getTime());

        const fallbackInvoices = buildFallbackInvoicesFromEnrollments(typedEnrollments);
        const localFallbackInvoices = recoveredLocalInvoice ? [recoveredLocalInvoice] : [];
        const mergedRecoveredInvoices = mergeInvoiceRecords(fallbackInvoices, localFallbackInvoices);
        const persistedInvoiceNumbers = new Set(
          (savedInvoices as PersistedInvoiceRecord[]).map((item) => item.invoiceNumber),
        );
        const missingRecoveredInvoices = mergedRecoveredInvoices.filter(
          (item) => !persistedInvoiceNumbers.has(item.invoiceNumber),
        );

        console.info("[Profile Invoice Debug] current uid", user.uid);
        console.info("[Profile Invoice Debug] enrollments count", typedEnrollments.length);
        console.info("[Profile Invoice Debug] invoices count", (savedInvoices as PersistedInvoiceRecord[]).length);
        console.info("[Profile Invoice Debug] fallback invoices count", fallbackInvoices.length + localFallbackInvoices.length);
        console.info(
          "[Profile Invoice Debug] final invoice count",
          mergeInvoiceRecords(savedInvoices as PersistedInvoiceRecord[], mergedRecoveredInvoices).length,
        );
        console.info("[Profile Invoice Debug] enrollment userIds", Array.from(new Set(typedEnrollments.map((item) => item.userId))).slice(0, 5));
        console.info(
          "[Profile Invoice Debug] invoice userIds",
          Array.from(new Set((savedInvoices as PersistedInvoiceRecord[]).map((item) => item.userId))).slice(0, 5),
        );

        setProfile(nextProfile as ProfileRecord);
        setCourseCount(uniqueIds.size);
        setMemberSince(dates[0] || new Date().toISOString());
        setInvoices(mergeInvoiceRecords(savedInvoices as PersistedInvoiceRecord[], mergedRecoveredInvoices));
        setEditName(nextProfile?.name || user.displayName || "");
        setEditEmail(nextProfile?.email || (user.email && !user.email.endsWith("@genznext.app") ? user.email : "") || "");
        setEditPhone(nextProfile?.phone || user.phoneNumber || "");
        const nextBillingProfile = nextProfile as ProfileRecord | null;
        setEditCompany(nextBillingProfile?.companyName || "");
        setEditGst(nextBillingProfile?.gstNumber || "");

        if (missingRecoveredInvoices.length) {
          void Promise.allSettled(missingRecoveredInvoices.map((invoice) => persistRecoveredInvoice(invoice)));
        }
      } catch (error) {
        if (!active) return;
        logFirestoreIssue("[Profile] Unable to load", error);
        const deviceCourses = readEnrolledCourses();
        const ids = new Set(deviceCourses.map((item) => getCanonicalCourseId(item.courseSlug)));
        setCourseCount(ids.size);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [user]);

  async function handleSave() {
    if (!user) return;
    if (editGst && !gstPattern.test(editGst.toUpperCase())) {
      setSaveMsg("Invalid GSTIN format. Check and retry.");
      return;
    }

    setSaving(true);
    setSaveMsg(null);
    const db = getFirebaseDb();

    try {
      const trimmedName = editName.trim();
      const trimmedEmail = editEmail.trim();
      const trimmedPhone = (editPhone || displayPhone).trim();
      const trimmedCompany = editCompany.trim();
      const trimmedGst = editGst.trim().toUpperCase();

      if (db) {
        const profilePayload: Record<string, string> = {
          updatedAt: new Date().toISOString(),
        };

        if (trimmedName) profilePayload.name = trimmedName;
        if (trimmedEmail) profilePayload.email = trimmedEmail;
        if (trimmedPhone) profilePayload.phone = trimmedPhone;
        if (trimmedCompany) profilePayload.companyName = trimmedCompany;
        if (trimmedGst) profilePayload.gstNumber = trimmedGst;

        await setDoc(
          doc(db, "users", user.uid),
          profilePayload,
          { merge: true },
        );
      }

      try {
        await updateProfile(user, {
          displayName: trimmedName || user.displayName || null,
        });
      } catch {
        // Keep save success when auth profile sync is unavailable.
      }

      setSaveMsg("Profile updated successfully");
      setEditing(false);
      setProfile((current) => ({
        ...(current || { uid: user.uid }),
        name: trimmedName || undefined,
        email: trimmedEmail || undefined,
        phone: trimmedPhone || undefined,
        companyName: trimmedCompany || undefined,
        gstNumber: trimmedGst || undefined,
      }));
    } catch {
      setSaveMsg("Unable to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordResetWhileLoggedIn() {
    const auth = getFirebaseAuth();
    const activeUser = auth?.currentUser;

    if (!activeUser) {
      setPasswordMsg("Please sign in again to reset password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    setPasswordMsg(null);

    try {
      const currentPhone = activeUser.phoneNumber || profile?.phone || "";
      const passwordProviderLinked = activeUser.providerData.some((provider) => provider.providerId === "password");

      if (!passwordProviderLinked) {
        const phoneAuthEmail = getPhoneAuthEmail(currentPhone);
        if (!phoneAuthEmail) {
          setPasswordMsg("Phone number is missing on your account. Contact support to reset password.");
          return;
        }

        const credential = EmailAuthProvider.credential(phoneAuthEmail, newPassword);
        await linkWithCredential(activeUser, credential);
      } else {
        await updatePassword(activeUser, newPassword);
      }

      const db = getFirebaseDb();
      if (db) {
        await setDoc(
          doc(db, "users", activeUser.uid),
          {
            authMethod: "password",
            ...(currentPhone ? { phone: normalizePhoneForAuth(currentPhone) } : {}),
            ...(activeUser.email ? { email: activeUser.email } : {}),
            passwordUpdatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg("Password updated successfully.");
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
      if (code === "auth/requires-recent-login") {
        setPasswordMsg("For security, please use Forgot Password from login if your session is old.");
      } else {
        setPasswordMsg(getFirebaseAuthErrorMessage(error));
      }
    } finally {
      setPasswordSaving(false);
    }
  }

  if (!isAuthReady || (user && loading)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F8FAFC] px-4 py-10">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#475569] shadow-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#0B2E6B]" />
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-full bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <User className="mx-auto h-10 w-10 text-[#CBD5E1]" />
          <h1 className="mt-4 text-xl font-bold !text-[#0F172A]">Sign in to view your profile</h1>
          <p className="mt-2 text-sm text-[#64748B]">Manage your details, download invoices and track your learning.</p>
          <button
            type="button"
            onClick={() => openAuthModal("login", "/dashboard/profile")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  const fullDisplayName = profile?.name || user.displayName || "GenZNext Learner";
  const displayName = fullDisplayName;
  const shortDisplayName = getFirstName(fullDisplayName) || "Learner";
  const displayEmail = profile?.email || (user.email && !user.email.endsWith("@genznext.app") ? user.email : "");
  const displayPhone = profile?.phone || user.phoneNumber || "";
  const displayInitials = getInitials(displayName || displayEmail || displayPhone, "GZ");
  const learningStatus = courseCount > 0 ? "Active Learner" : "New Learner";

  return (
    <main className="min-h-full bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="h-1.5 w-full bg-[linear-gradient(90deg,#F58220,#0B2E6B,#1E5AA8)]" />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] text-lg font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.28)]">
                  {displayInitials}
                </div>
                <div>
                  <h1 className="text-[22px] font-extrabold !text-[#0F172A]">{shortDisplayName}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                      {learningStatus}
                    </span>
                    <span className="text-[12px] text-[#64748B]">Member since {formatMemberSince(memberSince)}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(!editing);
                  setSaveMsg(null);
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-semibold transition ${
                  editing
                    ? "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412] hover:bg-[#FEF3C7]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#0B2E6B]/30 hover:text-[#0B2E6B]"
                }`}
              >
                {editing ? <><X className="h-3.5 w-3.5" />Cancel</> : <><Edit2 className="h-3.5 w-3.5" />Edit Profile</>}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: BookOpenCheck, label: "Courses", value: courseCount.toString(), color: "text-[#0B2E6B]", bg: "bg-[#EAF0FA]" },
                { icon: ShieldCheck, label: "Status", value: learningStatus, color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
                { icon: CalendarDays, label: "Member Since", value: formatMemberSince(memberSince), color: "text-[#F58220]", bg: "bg-[#FFF3E8]" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3 text-center">
                  <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <p className="text-[12px] font-bold !text-[#0F172A] line-clamp-1">{item.value}</p>
                  <p className="text-[10px] text-[#64748B]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#F1F5F9] px-5 py-4">
            <p className="text-[13px] font-bold !text-[#0F172A]">Contact & Billing Details</p>
            <p className="text-[12px] text-[#64748B]">Used for enrollment confirmation and GST invoices</p>
          </div>
          <div className="p-5">
            {editing ? (
              <div className="space-y-4">
                {[
                  { label: "Full Name", icon: User, value: editName, set: setEditName, placeholder: "Your full name", type: "text" },
                  { label: "Email", icon: Mail, value: editEmail, set: setEditEmail, placeholder: "your@email.com", type: "email" },
                  { label: "Company Name", icon: Building2, value: editCompany, set: setEditCompany, placeholder: "For GST invoices (optional)", type: "text" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{field.label}</label>
                    <div className="relative">
                      <field.icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(event) => field.set(event.target.value)}
                        placeholder={field.placeholder}
                        className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-[13px] !text-[#0F172A] outline-none focus:border-[#0B2E6B] focus:ring-2 focus:ring-[#0B2E6B]/10"
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Phone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="tel"
                      value={editPhone || displayPhone}
                      disabled
                      className="h-11 w-full cursor-not-allowed rounded-xl border border-[#E2E8F0] bg-[#EEF2F7] pl-9 pr-3 text-[13px] text-[#475569]"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#B45309]">
                    Mobile number cannot be changed here. Please contact admin at +91 88673 59208.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    GST Number <span className="font-normal normal-case text-[#94A3B8]">(optional - for tax invoices)</span>
                  </label>
                  <div className="relative">
                    <Receipt className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={editGst}
                      onChange={(event) => setEditGst(event.target.value.toUpperCase())}
                      placeholder="27AAHCN4778J1ZU"
                      maxLength={15}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 font-mono text-[13px] uppercase !text-[#0F172A] outline-none focus:border-[#0B2E6B] focus:ring-2 focus:ring-[#0B2E6B]/10"
                    />
                  </div>
                  {editGst && !gstPattern.test(editGst) ? (
                    <p className="mt-1 text-[11px] text-rose-500">Enter a valid 15-character GSTIN</p>
                  ) : null}
                </div>

                {saveMsg ? (
                  <p className={`rounded-xl px-3 py-2 text-[12px] font-medium ${saveMsg === "Profile updated successfully" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
                    {saveMsg}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] py-3 text-[13px] font-bold text-white disabled:opacity-60"
                >
                  {saving ? <><LoaderCircle className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Changes</>}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: User, label: "Name", value: displayName || "-" },
                  { icon: Phone, label: "Phone", value: displayPhone || "Not added" },
                  { icon: Mail, label: "Email", value: displayEmail || "Not added" },
                  { icon: Building2, label: "Company", value: profile?.companyName || "Not added" },
                  { icon: Receipt, label: "GSTIN", value: profile?.gstNumber || "Not added" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3">
                    <item.icon className="h-4 w-4 shrink-0 text-[#0B2E6B]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{item.label}</p>
                      <p className={`mt-0.5 text-[13px] font-medium ${item.value === "Not added" ? "text-[#94A3B8] italic" : "!text-[#0F172A]"}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
                {saveMsg === "Profile updated successfully" ? (
                  <p className="flex items-center gap-1.5 rounded-xl bg-[#F0FDF4] px-3 py-2 text-[12px] font-medium text-[#16A34A]">
                    <CheckCircle2 className="h-3.5 w-3.5" />{saveMsg}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#F1F5F9] px-5 py-4">
            <p className="text-[13px] font-bold !text-[#0F172A]">Security</p>
            <p className="text-[12px] text-[#64748B]">Reset your password while logged in.</p>
          </div>
          <div className="space-y-3 p-5">
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password (min 8 characters)"
              className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] !text-[#0F172A] outline-none focus:border-[#0B2E6B] focus:ring-2 focus:ring-[#0B2E6B]/10"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] !text-[#0F172A] outline-none focus:border-[#0B2E6B] focus:ring-2 focus:ring-[#0B2E6B]/10"
            />

            {passwordMsg ? (
              <p className={`rounded-xl px-3 py-2 text-[12px] font-medium ${passwordMsg === "Password updated successfully." ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
                {passwordMsg}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void handlePasswordResetWhileLoggedIn()}
              disabled={passwordSaving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] py-3 text-[13px] font-bold text-white disabled:opacity-60"
            >
              {passwordSaving ? <><LoaderCircle className="h-4 w-4 animate-spin" />Updating...</> : "Update Password"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#F1F5F9] px-5 py-4">
            <p className="text-[13px] font-bold !text-[#0F172A]">Invoices</p>
            <p className="text-[12px] text-[#64748B]">Your course purchase history and downloadable invoice records.</p>
          </div>
          <div className="p-5">
            {invoices.length ? (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <InvoiceSummaryCard key={invoice.invoiceNumber} invoice={invoice} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-8 text-center">
                <Receipt className="mx-auto h-8 w-8 text-[#94A3B8]" />
                <p className="mt-3 text-[14px] font-semibold text-[#0F172A]">No invoices available yet</p>
                <p className="mt-1 text-[12px] text-[#64748B]">
                  Once you purchase a course, your invoice details will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard/courses"
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#0B2E6B]/30 hover:bg-[#EAF0FA]"
          >
            <BookOpenCheck className="h-5 w-5 text-[#0B2E6B]" />
            <div>
              <p className="text-[13px] font-bold !text-[#0F172A]">My Courses</p>
              <p className="text-[11px] text-[#64748B]">{courseCount} enrolled program{courseCount !== 1 ? "s" : ""}</p>
            </div>
          </Link>
          <Link
            href="/lms/my-learning"
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#0B2E6B]/30 hover:bg-[#EAF0FA]"
          >
            <ShieldCheck className="h-5 w-5 text-[#0B2E6B]" />
            <div>
              <p className="text-[13px] font-bold !text-[#0F172A]">LMS Portal</p>
              <p className="text-[11px] text-[#64748B]">Continue your learning</p>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
