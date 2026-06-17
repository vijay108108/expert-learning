"use client";

import Link from "next/link";
import {
  ArrowRight, Award, Bot, CheckCircle2, Clock3,
  Download, Eye, GraduationCap, Loader2,
  Phone, ShieldCheck, Users2, X, Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  getFirebaseAuth,
  getFirebaseAuthErrorMessage,
  normalizePhoneForAuth,
  preparePhoneAuth,
} from "@/lib/firebase";
import {
  RecaptchaVerifier, signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseDb } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SLUG = "cloud-devops-ai-summer-2026";
const phoneOtpRequestTimeoutMs = 30000;

/* ── Batch options ─────────────────────────────────────────── */
const batches = [
  {
    id: "weekday",
    label: "Weekday Batch",
    emoji: "⚡",
    schedule: "Tuesday – Friday",
    time: "6:00 PM – 9:00 PM IST",
    note: "3 hrs/day · 4 days/week · Perfect for working professionals",
    color: "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]",
    activeBg: "bg-[#EEF2FF]",
  },
  {
    id: "weekend",
    label: "Weekend Batch",
    emoji: "🗓",
    schedule: "Saturday – Sunday",
    time: "10:00 AM – 1:00 PM IST",
    note: "3 hrs/day · 2 days/week · Ideal for students & weekday workers",
    color: "border-[#9333EA] bg-[#F5F0FF] text-[#9333EA]",
    activeBg: "bg-[#F5F0FF]",
  },
];

/* ── Value props ────────────────────────────────────────────── */
const valueProps = [
  { emoji: "🏗️", title: "IaaS-First Approach", desc: "You build real Azure infrastructure using code — not GUI clicks. Terraform from Day 1, the way enterprises actually work." },
  { emoji: "🤖", title: "AI-Powered Learning", desc: "Use GitHub Copilot, Azure AI Studio and Prompt Engineering to write Terraform, debug cloud issues and generate runbooks 5× faster." },
  { emoji: "⚡", title: "Practice from Day One", desc: "No death-by-slides. Every session = 60% hands-on lab. You deploy real Azure resources on your own account from the very first class." },
  { emoji: "📜", title: "Certificate That Matters", desc: "GenZNext Professional Certificate — accepted for internship applications, job interviews, LinkedIn and engineering portfolios." },
];

/* ── Syllabus Lead Capture Modal ──────────────────────────── */
function SyllabusModal({ onClose }: { onClose: () => void }) {
  const [step, setStep]           = useState<"form" | "otp" | "done">("form");
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState("");
  const [pending, setPending]     = useState(false);
  const [error, setError]         = useState("");
  const confirmRef                = useRef<ConfirmationResult | null>(null);
  const recaptchaRef              = useRef<RecaptchaVerifier | null>(null);
  const containerRef              = useRef<HTMLDivElement>(null);

  async function sendOtp() {
    if (!name.trim() || !email.trim() || phone.length < 10) {
      setError("Please fill all fields correctly.");
      return;
    }
    confirmRef.current = null;
    setOtp("");
    setPending(true);
    setError("");
    try {
      for (let attempt = 0; attempt < 1; attempt += 1) {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase not configured.");

        /* Clean up previous */
        if (recaptchaRef.current) {
          try {
            recaptchaRef.current.clear();
          } catch {
            /* ignore */
          }
          recaptchaRef.current = null;
        }
        if (containerRef.current) containerRef.current.innerHTML = "";

        const div = document.createElement("div");
        div.id = `recap-syllabus-${Date.now()}`;
        containerRef.current?.appendChild(div);

        preparePhoneAuth(auth);

        const verifier = new RecaptchaVerifier(auth, div, { size: "invisible" });
        recaptchaRef.current = verifier;

        const formatted = phone.startsWith("+") ? phone : `+91${normalizePhoneForAuth(phone).slice(-10)}`;

        try {
          confirmRef.current = await Promise.race([
            signInWithPhoneNumber(auth, formatted, verifier),
            new Promise<never>((_, reject) => {
              window.setTimeout(() => reject(new Error("OTP request timed out. Please try again.")), phoneOtpRequestTimeoutMs);
            }),
          ]);
          setStep("otp");
          return;
        } catch (error: unknown) {
          const code = error && typeof error === "object" && "code" in error
            ? String((error as { code?: unknown }).code)
            : error instanceof Error && error.message === "OTP request timed out. Please try again."
              ? "auth/network-request-failed"
              : "";

          if (code === "auth/captcha-check-failed" || code === "auth/unauthorized-domain" || code === "auth/invalid-app-credential") {
            setError(getFirebaseAuthErrorMessage(error));
          } else {
            setError(error instanceof Error ? error.message : "Failed to send OTP. Try again.");
          }
          return;
        }
      }
    } catch (error: unknown) {
      setError(getFirebaseAuthErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function verifyOtp() {
    if (otp.length !== 6) { setError("Enter the 6-digit OTP sent to your phone."); return; }
    if (!confirmRef.current) {
      setError("Your OTP session expired. Please request a new OTP.");
      setStep("form");
      setOtp("");
      return;
    }
    setPending(true);
    setError("");
    try {
      await confirmRef.current.confirm(otp);

      /* Save lead to Firestore */
      const db = getFirebaseDb();
      if (db) {
        await addDoc(collection(db, "leads"), {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          course: "Cloud, DevOps & AI Engineering — Summer 2026",
          source: "syllabus-download",
          status: "new",
          createdAt: serverTimestamp(),
        });
      }

      setStep("done");
    } catch (nextError: unknown) {
      const message = getFirebaseAuthErrorMessage(nextError);
      setError(message);

      const code = nextError && typeof nextError === "object" && "code" in nextError
        ? String((nextError as { code?: unknown }).code)
        : "";

      if (code === "auth/invalid-verification-code" || code === "auth/code-expired" || code === "auth/session-expired") {
        setOtp("");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="h-1.5 w-full bg-[linear-gradient(90deg,#9333EA,#4F46E5,#0EA5E9)]" />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9333EA]">
                {step === "done" ? "✅ Verified" : "📄 Download Syllabus"}
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold !text-[#0F172A]">
                {step === "form" ? "Enter your details to get the full syllabus" :
                 step === "otp"  ? "Enter OTP sent to your phone" :
                 "Syllabus Ready!"}
              </h2>
            </div>
            <button onClick={onClose} className="mt-1 text-[#94A3B8] hover:text-[#0F172A]">
              <X className="h-5 w-5" />
            </button>
          </div>

          {step === "form" && (
            <div className="mt-5 space-y-3">
              {[
                { label: "Full Name", value: name, set: setName, placeholder: "Jay Vishwakarma", type: "text" },
                { label: "Email", value: email, set: setEmail, placeholder: "jay@example.com", type: "email" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={e => { f.set(e.target.value); setError(""); }}
                    placeholder={f.placeholder}
                    className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] !text-[#0F172A] outline-none focus:border-[#4F46E5]" />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Phone (for OTP)</label>
                <div className="flex gap-2">
                  <span className="flex h-10 items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#475569]">+91</span>
                  <input type="tel" value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                    placeholder="9876543210" maxLength={10}
                    className="h-10 flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] !text-[#0F172A] outline-none focus:border-[#4F46E5]" />
                </div>
              </div>
              {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
              <div ref={containerRef} />
              <button onClick={sendOtp} disabled={pending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] py-3 text-[14px] font-bold text-white disabled:opacity-60">
                {pending ? <><Loader2 className="h-4 w-4 animate-spin" />Sending OTP…</> : <><Phone className="h-4 w-4" />Get OTP & Download Syllabus</>}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="mt-5 space-y-3">
              <p className="text-[13px] text-[#64748B]">OTP sent to <strong className="text-[#0F172A]">+91 {phone}</strong></p>
              <input type="tel" value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="Enter 6-digit OTP" maxLength={6}
                className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-center text-[20px] font-bold tracking-[0.3em] !text-[#0F172A] outline-none focus:border-[#4F46E5]" />
              {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
              <button onClick={verifyOtp} disabled={pending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] py-3 text-[14px] font-bold text-white disabled:opacity-60">
                {pending ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying…</> : "Verify & Get Syllabus"}
              </button>
              <button
                onClick={sendOtp}
                disabled={pending}
                className="w-full text-center text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] disabled:opacity-50"
              >
                Resend OTP
              </button>
              <button onClick={() => { setStep("form"); setOtp(""); setError(""); }} className="w-full text-center text-[12px] text-[#64748B] hover:text-[#4F46E5]">
                ← Change phone number
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="mt-5 space-y-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FDF4]">
                <CheckCircle2 className="h-8 w-8 text-[#16A34A]" />
              </div>
              <p className="text-[13px] text-[#475569]">
                Hi <strong className="text-[#0F172A]">{name}</strong>! Your details are saved. View or download the full syllabus below.
              </p>
              <div className="grid gap-2">
                <a href="/syllabus/cloud-devops-ai-summer-2026" target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] py-3 text-[14px] font-bold text-white">
                  <Eye className="h-4 w-4" /> View Full Syllabus
                </a>
                <button onClick={() => {
                  const w = window.open("/syllabus/cloud-devops-ai-summer-2026", "_blank");
                  setTimeout(() => w?.print(), 1500);
                }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-3 text-[14px] font-semibold text-[#475569] hover:border-[#4F46E5]/30 hover:text-[#4F46E5]">
                  <Download className="h-4 w-4" /> Download as PDF
                </button>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Our team will reach out to {email} with more details about the 15 June batch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function SummerEnrollPage() {
  const { user, openAuthModal } = useAuth();
  const router                  = useRouter();
  const [batch, setBatch]       = useState<"weekday" | "weekend">("weekday");
  const [showSyllabus, setShowSyllabus] = useState(false);

  function handleRegister() {
    if (!user) {
      openAuthModal("signup", `/checkout/${SLUG}?batch=${batch}`);
    } else {
      router.push(`/checkout/${SLUG}?batch=${batch}`);
    }
  }

  const selected = batches.find(b => b.id === batch)!;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {showSyllabus && <SyllabusModal onClose={() => setShowSyllabus(false)} />}

      {/* ── Hero ── */}
      <section className="bg-[linear-gradient(135deg,#3B0764_0%,#4F46E5_55%,#0369A1_100%)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#FED7AA]/50 bg-[#FFF7ED]/10 px-3 py-1 text-[11px] font-bold text-[#FED7AA]">🔥 Summer Training 2026</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-[#86EFAC]"><Award className="mr-1 inline h-3 w-3" />Certificate Included</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-white"><GraduationCap className="mr-1 inline h-3 w-3" />Valid for Engineering Students</span>
          </div>
          <h1 className="mt-5 text-[28px] font-extrabold leading-tight text-white sm:text-[36px]">
            Cloud, DevOps &amp; AI Engineering<br className="hidden sm:block" /> Professional Program
          </h1>
          <p className="mt-2 text-[14px] text-[#C7D2FE]">Azure · Terraform · GitHub · Azure DevOps · AI Tools — Build real cloud infrastructure from Day 1</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-xl bg-[#DC2626]/20 px-3 py-2 text-[12px] font-semibold text-[#FCA5A5]"><Clock3 className="h-3.5 w-3.5" />Batch: 15 June 2026</span>
            <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[12px] font-semibold text-white"><Zap className="h-3.5 w-3.5" />8 Weeks Fast-Track</span>
            <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[12px] font-semibold text-white"><Users2 className="h-3.5 w-3.5" />Beginner to Advanced</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_340px] lg:items-start">

          {/* ── Left ── */}
          <div className="space-y-6">

            {/* Urgency */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-[14px] font-bold !text-[#DC2626]">Hurry — Only a few seats remaining!</p>
                <p className="text-[13px] text-[#EF4444]">Batch: <strong>15 June 2026</strong> · Registrations close when seats fill</p>
              </div>
            </div>

            {/* ── Batch selector ── */}
            <div>
              <p className="mb-3 text-[13px] font-bold uppercase tracking-wider text-[#4F46E5]">Choose Your Batch</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {batches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBatch(b.id as typeof batch)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      batch === b.id
                        ? `${b.color} shadow-md`
                        : "border-[#E2E8F0] bg-white hover:border-[#C7D2FE]"
                    }`}
                  >
                    <p className="text-[15px] font-extrabold !text-[#0F172A]">{b.emoji} {b.label}</p>
                    <p className="mt-1 text-[13px] font-bold !text-[#0F172A]">{b.schedule}</p>
                    <p className="text-[13px] font-semibold text-[#4F46E5]">{b.time}</p>
                    <p className="mt-1.5 text-[11.5px] text-[#64748B]">{b.note}</p>
                    {batch === b.id && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#4F46E5] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        <CheckCircle2 className="h-3 w-3" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Why this program ── */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[#4F46E5]">Why This Program?</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {valueProps.map((v) => (
                  <div key={v.title} className="flex items-start gap-3">
                    <span className="mt-0.5 text-2xl">{v.emoji}</span>
                    <div>
                      <p className="text-[13px] font-bold !text-[#0F172A]">{v.title}</p>
                      <p className="mt-0.5 text-[12px] leading-5 text-[#64748B]">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you build */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[#4F46E5]">Capstone: What You&apos;ll Build</p>
              <p className="mt-2 text-[13px] text-[#475569]">
                In Week 8, you deploy a <strong className="text-[#0F172A]">production-ready Azure environment</strong> — 100% using Terraform and Azure DevOps CI/CD:
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["VNet + Subnets", "Azure VMs", "NSG + Firewall", "Storage Account", "App Service", "Azure Monitor", "VM Backup", "RBAC Policies", "DevOps Pipeline"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-[#EEF2FF] bg-[#F8FAFF] px-3 py-2 text-[12px] font-semibold !text-[#0F172A]">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />{item}
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-5">
                <Award className="h-6 w-6 text-[#16A34A]" />
                <p className="mt-3 text-[14px] font-bold !text-[#0F172A]">Professional Certificate</p>
                <p className="mt-1 text-[12px] text-[#64748B]">Industry-recognized · Valid for engineering students · LinkedIn & resume ready · Internship & job applications</p>
              </div>
              <div className="rounded-2xl border border-[#DDD6FE] bg-[#F5F0FF] p-5">
                <Bot className="h-6 w-6 text-[#9333EA]" />
                <p className="mt-3 text-[14px] font-bold !text-[#0F172A]">AI-Powered Engineering</p>
                <p className="mt-1 text-[12px] text-[#64748B]">GitHub Copilot for Terraform · AI diagnostics for Azure · Prompt engineering for cloud engineers</p>
              </div>
            </div>
          </div>

          {/* ── Right: Sticky pricing ── */}
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.1)]">
              <div className="h-1.5 w-full bg-[linear-gradient(90deg,#9333EA,#4F46E5,#0EA5E9)]" />
              <div className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#9333EA]">Summer Scholarship 2026</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-[36px] font-extrabold tracking-tight !text-[#0F172A]">₹25,000</span>
                  <span className="mb-1.5 text-[16px] text-[#94A3B8] line-through">₹75,000</span>
                </div>
                <p className="text-[12px] font-bold text-[#16A34A]">Save ₹50,000 · 67% scholarship</p>

                {/* Selected batch badge */}
                <div className="mt-4 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-3">
                  <p className="text-[11px] font-bold text-[#4F46E5]">Selected Batch</p>
                  <p className="text-[14px] font-extrabold !text-[#0F172A]">{selected.emoji} {selected.label}</p>
                  <p className="text-[12px] text-[#475569]">{selected.schedule} · {selected.time}</p>
                </div>

                <div className="mt-4 space-y-2.5 text-[13px]">
                  {[
                    ["Starts",       "15 June 2026",         true],
                    ["Duration",     "8 Weeks",              false],
                    ["Certificate",  "Included",             false],
                    ["Seats",        "Limited — Hurry!",     true],
                  ].map(([label, value, red]) => (
                    <div key={label as string} className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
                      <span className="text-[#94A3B8]">{label}</span>
                      <span className={`font-bold ${red ? "text-[#DC2626]" : "!text-[#0F172A]"}`}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-center">
                  <p className="text-[12px] font-bold text-[#DC2626]">🚨 Seats filling fast!</p>
                  <p className="text-[11px] text-[#EF4444]">Register now to lock your spot</p>
                </div>

                <button type="button" onClick={handleRegister}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(147,51,234,0.3)] transition hover:scale-[1.02]">
                  Register &amp; Pay Now <ArrowRight className="h-4 w-4" />
                </button>

                <button type="button" onClick={() => setShowSyllabus(true)}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#4F46E5] bg-white py-3 text-[13px] font-bold text-[#4F46E5] transition hover:bg-[#EEF2FF]">
                  <Download className="h-4 w-4" /> Download Syllabus (Free)
                </button>

                <Link href="/contact"
                  className="mt-2 flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 text-[13px] font-medium text-[#475569] transition hover:text-[#4F46E5]">
                  Have questions? Talk to us
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                  Razorpay · No-cost EMI · Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
