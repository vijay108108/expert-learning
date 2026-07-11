"use client";

import Link from "next/link";
import {
  ArrowRight, Award, Bot, CheckCircle2, Clock3,
  GraduationCap, ShieldCheck, Users2, Zap,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const SLUG = "cloud-devops-ai-summer-2026";

/* ── Batch options ─────────────────────────────────────────── */
const batches = [
  {
    id: "weekday",
    label: "Weekday Batch",
    emoji: "⚡",
    schedule: "Tuesday – Friday",
    time: "6:00 PM – 9:00 PM IST",
    note: "3 hrs/day · 4 days/week · Perfect for working professionals",
    color: "border-[#0B2E6B] bg-[#EAF0FA] text-[#0B2E6B]",
    activeBg: "bg-[#EAF0FA]",
  },
  {
    id: "weekend",
    label: "Weekend Batch",
    emoji: "🗓",
    schedule: "Saturday – Sunday",
    time: "10:00 AM – 1:00 PM IST",
    note: "3 hrs/day · 2 days/week · Ideal for students & weekday workers",
    color: "border-[#F58220] bg-[#FFF3E8] text-[#F58220]",
    activeBg: "bg-[#FFF3E8]",
  },
];

/* ── Value props ────────────────────────────────────────────── */
const valueProps = [
  { emoji: "🏗️", title: "IaaS-First Approach", desc: "You build real Azure infrastructure using code — not GUI clicks. Terraform from Day 1, the way enterprises actually work." },
  { emoji: "🤖", title: "AI-Powered Learning", desc: "Use GitHub Copilot, Azure AI Studio and Prompt Engineering to write Terraform, debug cloud issues and generate runbooks 5× faster." },
  { emoji: "⚡", title: "Practice from Day One", desc: "No death-by-slides. Every session = 60% hands-on lab. You deploy real Azure resources on your own account from the very first class." },
  { emoji: "📜", title: "Certificate That Matters", desc: "GenZNext Professional Certificate — accepted for internship applications, job interviews, LinkedIn and engineering portfolios." },
];

/* ── Main page ─────────────────────────────────────────────── */
export default function SummerEnrollPage() {
  const { user, openAuthModal } = useAuth();
  const router                  = useRouter();
  const [batch, setBatch]       = useState<"weekday" | "weekend">("weekday");

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
      {/* ── Hero ── */}
      <section className="bg-[linear-gradient(135deg,#3B0764_0%,#0B2E6B_55%,#0369A1_100%)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#FED7AA]/50 bg-[#FFF7ED]/10 px-3 py-1 text-[11px] font-bold text-[#FED7AA]">🔥 Summer Training 2026</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-[#86EFAC]"><Award className="mr-1 inline h-3 w-3" />Certificate Included</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-white"><GraduationCap className="mr-1 inline h-3 w-3" />Valid for Engineering Students</span>
          </div>
          <h1 className="mt-5 text-[28px] font-extrabold leading-tight text-white sm:text-[36px]">
            Cloud, DevOps &amp; AI Engineering<br className="hidden sm:block" /> Professional Program
          </h1>
          <p className="mt-2 text-[14px] text-[#C8D7EE]">Azure · Terraform · GitHub · Azure DevOps · AI Tools — Build real cloud infrastructure from Day 1</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-xl bg-[#DC2626]/20 px-3 py-2 text-[12px] font-semibold text-[#FCA5A5]"><Clock3 className="h-3.5 w-3.5" />Batch: 1 July 2026</span>
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
                <p className="text-[13px] text-[#EF4444]">Batch: <strong>1 July 2026</strong> · Registrations close when seats fill</p>
              </div>
            </div>

            {/* ── Batch selector ── */}
            <div>
              <p className="mb-3 text-[13px] font-bold uppercase tracking-wider text-[#0B2E6B]">Choose Your Batch</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {batches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBatch(b.id as typeof batch)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      batch === b.id
                        ? `${b.color} shadow-md`
                        : "border-[#E2E8F0] bg-white hover:border-[#C8D7EE]"
                    }`}
                  >
                    <p className="text-[15px] font-extrabold !text-[#0F172A]">{b.emoji} {b.label}</p>
                    <p className="mt-1 text-[13px] font-bold !text-[#0F172A]">{b.schedule}</p>
                    <p className="text-[13px] font-semibold text-[#0B2E6B]">{b.time}</p>
                    <p className="mt-1.5 text-[11.5px] text-[#64748B]">{b.note}</p>
                    {batch === b.id && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#0B2E6B] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        <CheckCircle2 className="h-3 w-3" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Why this program ── */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[#0B2E6B]">Why This Program?</p>
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
              <p className="text-[13px] font-bold uppercase tracking-wider text-[#0B2E6B]">Capstone: What You&apos;ll Build</p>
              <p className="mt-2 text-[13px] text-[#475569]">
                In Week 8, you deploy a <strong className="text-[#0F172A]">production-ready Azure environment</strong> — 100% using Terraform and Azure DevOps CI/CD:
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["VNet + Subnets", "Azure VMs", "NSG + Firewall", "Storage Account", "App Service", "Azure Monitor", "VM Backup", "RBAC Policies", "DevOps Pipeline"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-[#EAF0FA] bg-[#F8FAFF] px-3 py-2 text-[12px] font-semibold !text-[#0F172A]">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#0B2E6B]" />{item}
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
              <div className="rounded-2xl border border-[#E8DCCF] bg-[#FFF3E8] p-5">
                <Bot className="h-6 w-6 text-[#F58220]" />
                <p className="mt-3 text-[14px] font-bold !text-[#0F172A]">AI-Powered Engineering</p>
                <p className="mt-1 text-[12px] text-[#64748B]">GitHub Copilot for Terraform · AI diagnostics for Azure · Prompt engineering for cloud engineers</p>
              </div>
            </div>
          </div>

          {/* ── Right: Sticky pricing ── */}
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.1)]">
              <div className="h-1.5 w-full bg-[linear-gradient(90deg,#F58220,#0B2E6B,#1E5AA8)]" />
              <div className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#F58220]">Summer Scholarship 2026</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-[36px] font-extrabold tracking-tight !text-[#0F172A]">₹25,000</span>
                  <span className="mb-1.5 text-[16px] text-[#94A3B8] line-through">₹75,000</span>
                </div>
                <p className="text-[12px] font-bold text-[#16A34A]">Save ₹50,000 · 67% scholarship</p>

                {/* Selected batch badge */}
                <div className="mt-4 rounded-xl border border-[#C8D7EE] bg-[#EAF0FA] px-4 py-3">
                  <p className="text-[11px] font-bold text-[#0B2E6B]">Selected Batch</p>
                  <p className="text-[14px] font-extrabold !text-[#0F172A]">{selected.emoji} {selected.label}</p>
                  <p className="text-[12px] text-[#475569]">{selected.schedule} · {selected.time}</p>
                </div>

                <div className="mt-4 space-y-2.5 text-[13px]">
                  {[
                    ["Starts",       "1 July 2026",         true],
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
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(147,51,234,0.3)] transition hover:scale-[1.02]">
                  Register &amp; Pay Now <ArrowRight className="h-4 w-4" />
                </button>

                <Link href="/contact"
                  className="mt-2 flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 text-[13px] font-medium text-[#475569] transition hover:text-[#0B2E6B]">
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
