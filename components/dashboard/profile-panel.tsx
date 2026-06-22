"use client";

import {
  BookOpenCheck, CalendarDays, CheckCircle2,
  Download, Edit2, LoaderCircle, Mail,
  Phone, Save, ShieldCheck, User, X,
  Building2, Receipt,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import {
  getFirebaseDb, getMyEnrollments, getUserProfile,
  logFirestoreIssue, type AppUserProfile,
} from "@/lib/firebase";
import { readEnrolledCourses } from "@/lib/my-learning";
import { getCanonicalCourseId } from "@/lib/offering-catalog";
import {
  formatCurrencyInrFromPaise, formatInvoiceDate,
  latestOrderStorageKey, type StoredOrderSuccess,
} from "@/lib/order-success";
import { getInitials } from "@/lib/utils";

function formatMemberSince(value: string | null) {
  if (!value) return "Recently joined";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

type ProfileRecord = AppUserProfile & {
  companyName?: string;
  gstNumber?: string;
};

/* ── Invoice download (print) ── */
function InvoiceCard({ invoice }: { invoice: StoredOrderSuccess }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold text-[#0F172A]">{invoice.invoiceNumber}</p>
          <p className="mt-0.5 text-[11px] text-[#64748B]">
            {invoice.courses.map(c => c.title).join(", ")}
          </p>
          <p className="mt-0.5 text-[11px] text-[#64748B]">
            {formatInvoiceDate(invoice.paidAtIso)} · {formatCurrencyInrFromPaise(invoice.totalPaidPaise)}
          </p>
        </div>
        <button
          onClick={() => {
            // Store invoice and open print window
            window.localStorage.setItem(latestOrderStorageKey, JSON.stringify(invoice));
            window.open(`/order-success?orderId=${invoice.orderId}`, "_blank");
          }}
          className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-[12px] font-semibold text-[#4F46E5] transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]"
        >
          <Download className="h-3.5 w-3.5" /> Invoice
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export function ProfilePanel() {
  const { isAuthReady, openAuthModal, user } = useAuth();
  const [profile, setProfile]           = useState<ProfileRecord | null>(null);
  const [courseCount, setCourseCount]   = useState(0);
  const [memberSince, setMemberSince]   = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [invoice]                       = useState<StoredOrderSuccess | null>(() => {
    try {
      if (typeof window === "undefined") {
        return null;
      }
      const raw = window.localStorage.getItem(latestOrderStorageKey);
      return raw ? (JSON.parse(raw) as StoredOrderSuccess) : null;
    } catch {
      return null;
    }
  });

  /* Edit state */
  const [editing, setEditing]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saveMsg, setSaveMsg]           = useState<string | null>(null);
  const [editName, setEditName]         = useState("");
  const [editEmail, setEditEmail]       = useState("");
  const [editPhone, setEditPhone]       = useState("");
  const [editCompany, setEditCompany]   = useState("");
  const [editGst, setEditGst]           = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    const frame = window.requestAnimationFrame(() => { if (active) setLoading(true); });

    void (async () => {
      try {
        const [nextProfile, enrollments] = await Promise.all([
          getUserProfile(user.uid),
          getMyEnrollments(user.uid),
        ]);
        if (!active) return;

        const deviceCourses = readEnrolledCourses();
        const uniqueIds = new Set([
          ...enrollments.map(e => getCanonicalCourseId(e.courseId)),
          ...deviceCourses.map(c => getCanonicalCourseId(c.courseSlug)),
        ]);
        const dates = [
          nextProfile?.createdAt,
          user.metadata.creationTime ? new Date(user.metadata.creationTime).toISOString() : null,
          ...enrollments.map(e => e.enrolledAt),
          ...deviceCourses.map(c => c.enrolledAt),
        ].filter((v): v is string => Boolean(v)).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        setProfile(nextProfile as ProfileRecord);
        setCourseCount(uniqueIds.size);
        setMemberSince(dates[0] || new Date().toISOString());
        /* Pre-fill edit fields */
        setEditName(user.displayName || nextProfile?.name || "");
        setEditEmail(nextProfile?.email || (user.email && !user.email.endsWith("@genznext.app") ? user.email : "") || "");
        setEditPhone(nextProfile?.phone || user.phoneNumber || "");
        const nextBillingProfile = nextProfile as ProfileRecord | null;
        setEditCompany(nextBillingProfile?.companyName || "");
        setEditGst(nextBillingProfile?.gstNumber || "");
      } catch (err) {
        if (!active) return;
        logFirestoreIssue("[Profile] Unable to load", err);
        const dc = readEnrolledCourses();
        const ids = new Set(dc.map(c => getCanonicalCourseId(c.courseSlug)));
        setCourseCount(ids.size);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; window.cancelAnimationFrame(frame); };
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
      if (db) {
        await setDoc(doc(db, "users", user.uid), {
          name:       editName.trim()  || undefined,
          email:      editEmail.trim() || undefined,
          phone:      editPhone.trim() || undefined,
          companyName:editCompany.trim() || undefined,
          gstNumber:  editGst.trim().toUpperCase() || undefined,
          updatedAt:  new Date().toISOString(),
        }, { merge: true });
      }
      setSaveMsg("✓ Profile updated successfully");
      setEditing(false);
    } catch {
      setSaveMsg("Unable to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Loading ── */
  if (!isAuthReady || (user && loading)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F8FAFC] px-4 py-10">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#475569] shadow-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#4F46E5]" />
          Loading your profile…
        </div>
      </div>
    );
  }

  /* ── Not signed in ── */
  if (!user) {
    return (
      <main className="min-h-full bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <User className="mx-auto h-10 w-10 text-[#CBD5E1]" />
          <h1 className="mt-4 text-xl font-bold !text-[#0F172A]">Sign in to view your profile</h1>
          <p className="mt-2 text-sm text-[#64748B]">Manage your details, download invoices and track your learning.</p>
          <button onClick={() => openAuthModal("login", "/dashboard/profile")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-5 py-2.5 text-sm font-semibold text-white">
            Sign In
          </button>
        </div>
      </main>
    );
  }

  const displayName    = profile?.name || user.displayName || "GenZNext Learner";
  const displayEmail   = profile?.email || (user.email && !user.email.endsWith("@genznext.app") ? user.email : "");
  const displayPhone   = profile?.phone || user.phoneNumber || "";
  const displayInitials = getInitials(displayName || displayEmail || displayPhone, "GZ");
  const learningStatus = courseCount > 0 ? "Active Learner" : "New Learner";

  return (
    <main className="min-h-full bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">

        {/* ── Profile header ── */}
        <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-[linear-gradient(90deg,#9333EA,#4F46E5,#0EA5E9)]" />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] text-lg font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.28)]">
                  {displayInitials}
                </div>
                <div>
                  <h1 className="text-[22px] font-extrabold !text-[#0F172A]">{displayName}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />{learningStatus}
                    </span>
                    <span className="text-[12px] text-[#64748B]">Member since {formatMemberSince(memberSince)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setEditing(!editing); setSaveMsg(null); }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-semibold transition ${
                  editing
                    ? "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412] hover:bg-[#FEF3C7]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
                }`}
              >
                {editing ? <><X className="h-3.5 w-3.5" />Cancel</> : <><Edit2 className="h-3.5 w-3.5" />Edit Profile</>}
              </button>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: BookOpenCheck, label: "Courses",      value: courseCount.toString(), color: "text-[#4F46E5]", bg: "bg-[#EEF2FF]" },
                { icon: ShieldCheck,   label: "Status",       value: learningStatus,          color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
                { icon: CalendarDays,  label: "Member Since", value: formatMemberSince(memberSince), color: "text-[#9333EA]", bg: "bg-[#F5F0FF]" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3 text-center">
                  <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <p className="text-[12px] font-bold !text-[#0F172A] line-clamp-1">{s.value}</p>
                  <p className="text-[10px] text-[#64748B]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Edit / View contact details ── */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#F1F5F9] px-5 py-4">
            <p className="text-[13px] font-bold !text-[#0F172A]">Contact & Billing Details</p>
            <p className="text-[12px] text-[#64748B]">Used for enrollment confirmation and GST invoices</p>
          </div>
          <div className="p-5">
            {editing ? (
              /* ── Edit form ── */
              <div className="space-y-4">
                {[
                  { label: "Full Name",    icon: User,      value: editName,    set: setEditName,    placeholder: "Your full name",       type: "text" },
                  { label: "Email",        icon: Mail,      value: editEmail,   set: setEditEmail,   placeholder: "your@email.com",       type: "email" },
                  { label: "Phone",        icon: Phone,     value: editPhone,   set: setEditPhone,   placeholder: "+91 9876543210",       type: "tel" },
                  { label: "Company Name", icon: Building2, value: editCompany, set: setEditCompany, placeholder: "For GST invoices (optional)", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{f.label}</label>
                    <div className="relative">
                      <f.icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type={f.type}
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        placeholder={f.placeholder}
                        className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-[13px] !text-[#0F172A] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
                      />
                    </div>
                  </div>
                ))}

                {/* GST field with validation */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    GST Number <span className="font-normal normal-case text-[#94A3B8]">(optional — for tax invoices)</span>
                  </label>
                  <div className="relative">
                    <Receipt className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={editGst}
                      onChange={e => setEditGst(e.target.value.toUpperCase())}
                      placeholder="27AAHCN4778J1ZU"
                      maxLength={15}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 font-mono text-[13px] uppercase !text-[#0F172A] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
                    />
                  </div>
                  {editGst && !gstPattern.test(editGst) && (
                    <p className="mt-1 text-[11px] text-rose-500">Enter a valid 15-character GSTIN</p>
                  )}
                </div>

                {saveMsg && (
                  <p className={`rounded-xl px-3 py-2 text-[12px] font-medium ${saveMsg.startsWith("✓") ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
                    {saveMsg}
                  </p>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] py-3 text-[13px] font-bold text-white disabled:opacity-60"
                >
                  {saving ? <><LoaderCircle className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save Changes</>}
                </button>
              </div>
            ) : (
              /* ── View mode ── */
              <div className="space-y-3">
                {[
                  { icon: User,      label: "Name",        value: displayName   || "—" },
                  { icon: Phone,     label: "Phone",       value: displayPhone  || "Not added" },
                  { icon: Mail,      label: "Email",       value: displayEmail  || "Not added" },
                  { icon: Building2, label: "Company",     value: profile?.companyName || "Not added" },
                  { icon: Receipt,   label: "GSTIN",       value: profile?.gstNumber   || "Not added" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3">
                    <r.icon className="h-4 w-4 shrink-0 text-[#4F46E5]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{r.label}</p>
                      <p className={`mt-0.5 text-[13px] font-medium ${r.value === "Not added" ? "text-[#94A3B8] italic" : "!text-[#0F172A]"}`}>
                        {r.value}
                      </p>
                    </div>
                  </div>
                ))}
                {saveMsg?.startsWith("✓") && (
                  <p className="flex items-center gap-1.5 rounded-xl bg-[#F0FDF4] px-3 py-2 text-[12px] font-medium text-[#16A34A]">
                    <CheckCircle2 className="h-3.5 w-3.5" />{saveMsg}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Invoice ── */}
        {invoice && (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#F1F5F9] px-5 py-4">
              <p className="text-[13px] font-bold !text-[#0F172A]">Payment Invoices</p>
              <p className="text-[12px] text-[#64748B]">Download your payment receipts</p>
            </div>
            <div className="p-5">
              <InvoiceCard invoice={invoice} />
              <p className="mt-3 text-[11px] text-[#94A3B8]">
                Invoice opens in a new tab — use browser Print → Save as PDF to download.
              </p>
            </div>
          </section>
        )}

        {/* ── Quick links ── */}
        <section className="grid gap-3 sm:grid-cols-2">
          <Link href="/dashboard/courses"
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]">
            <BookOpenCheck className="h-5 w-5 text-[#4F46E5]" />
            <div>
              <p className="text-[13px] font-bold !text-[#0F172A]">My Courses</p>
              <p className="text-[11px] text-[#64748B]">{courseCount} enrolled program{courseCount !== 1 ? "s" : ""}</p>
            </div>
          </Link>
          <Link href="/lms/my-learning"
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]">
            <ShieldCheck className="h-5 w-5 text-[#4F46E5]" />
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
