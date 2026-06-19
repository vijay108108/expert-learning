"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Award, CheckCircle2,
  GraduationCap, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const POPUP_DELAY_MS = 1200;
const SEEN_KEY       = "gz_popup_seen_v3";

const weeks = [
  { week: "Week 1", title: "Cloud Fundamentals, Azure & GitHub",     icon: "☁️" },
  { week: "Week 2", title: "Azure VMs & Terraform Labs",             icon: "🖥️" },
  { week: "Week 3", title: "Azure Networking & Connectivity",        icon: "🔗" },
  { week: "Week 4", title: "Azure Security Engineering",             icon: "🔒" },
  { week: "Week 5", title: "Storage, App Hosting & App Services",    icon: "📦" },
  { week: "Week 6", title: "Monitoring, Backup & Governance",        icon: "📊" },
  { week: "Week 7", title: "Advanced Terraform & Azure DevOps",      icon: "⚙️" },
  { week: "Week 8", title: "AI for Cloud Engineers + Capstone",      icon: "🤖" },
];

const tools = [
  "Microsoft Azure", "Terraform", "GitHub", "Azure DevOps",
  "Entra ID", "Azure Monitor", "Azure Backup", "AI Tools",
];

const idealFor = [
  "B.Tech / BCA / MCA Students",
  "Freshers & IT Professionals",
  "System & Support Engineers",
];

export function SummerTrainingPopup() {
  const [open, setOpen]       = useState(false);
  const reducedMotion         = useReducedMotion();
  const router                = useRouter();
  const { isAuthReady }       = useAuth();

  function handleClose() {
    setOpen(false);
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  }

  function handleEnrollClick() {
    if (!isAuthReady) return;
    handleClose();
    router.push("/enroll/cloud-devops-ai-summer-2026");
  }

  useEffect(() => {
    try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch { /* ignore */ }
    const t = window.setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
          className="fixed inset-0 z-[180] flex items-end justify-center bg-[rgba(15,23,42,0.55)] px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.24, ease: "easeOut" }}
            className="relative w-full max-w-[1020px] overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_32px_80px_rgba(15,23,42,0.22)]"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="summer-popup-title"
          >
            {/* Top gradient strip */}
            <div className="h-1.5 w-full bg-[linear-gradient(90deg,#9333EA,#4F46E5,#0EA5E9)]" />

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">

              {/* ── LEFT ── */}
              <div className="p-6 sm:p-7">

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1 text-[11px] font-bold text-[#C2410C]">
                    🔥 Summer Training 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1 text-[11px] font-bold text-[#166534]">
                    <Award className="h-3 w-3" /> Certificate Included
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-[#4338CA]">
                    <GraduationCap className="h-3 w-3" /> Valid for Engineering Students
                  </span>
                </div>

                {/* Title */}
                <h2
                  id="summer-popup-title"
                  className="mt-4 text-[22px] font-extrabold leading-[1.18] tracking-[-0.03em] !text-[#0F172A] sm:text-[26px]"
                >
                  Cloud, DevOps &amp; AI Engineering<br className="hidden sm:block" />
                  <span className="bg-[linear-gradient(135deg,#9333EA,#4F46E5)] bg-clip-text text-transparent">
                    {" "}Professional Program
                  </span>
                </h2>

                <p className="mt-2 text-[12.5px] leading-5 text-[#64748B]">
                  Azure (AZ-104) · Terraform · GitHub · Azure DevOps · AI-Powered Cloud Operations
                </p>

                {/* Week-by-week grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {weeks.map((w) => (
                    <div key={w.week} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#9333EA]">{w.week}</p>
                      <p className="mt-0.5 text-[10.5px] font-semibold leading-[1.4] !text-[#0F172A]">
                        {w.icon} {w.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tools */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <span key={t} className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#475569]">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Ideal for + certificate note */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#EDE9FE] bg-[#F5F0FF] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9333EA]">Ideal For</p>
                    <ul className="mt-1.5 space-y-1">
                      {idealFor.map((item) => (
                        <li key={item} className="flex items-center gap-1.5 text-[11.5px] font-medium !text-[#0F172A]">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#9333EA]" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A]">Certificate</p>
                    <p className="mt-1.5 text-[11.5px] font-semibold !text-[#0F172A]">
                      GenZNext Professional Certificate
                    </p>
                    <p className="mt-1 text-[11px] text-[#64748B]">
                      Recognized by industry · Valid for internship &amp; job applications · Can be listed on LinkedIn &amp; resume
                    </p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div className="flex flex-col justify-between border-t border-[#F1F5F9] bg-[#FAFBFF] p-6 sm:border-t-0 sm:border-l lg:rounded-r-[28px]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9333EA]">Summer Scholarship</p>

                  {/* Price */}
                  <div className="mt-3 flex items-end gap-2.5">
                    <span className="text-[36px] font-extrabold tracking-tight !text-[#0F172A]">₹25,000</span>
                    <span className="mb-1.5 text-[15px] text-[#94A3B8] line-through">₹75,000</span>
                  </div>
                  <p className="text-[12px] font-bold text-[#16A34A]">Save ₹50,000 · 67% scholarship</p>

                  {/* Details */}
                  <div className="mt-5 space-y-2.5 text-[13px]">
                    {[
                      ["Batch Starts",   "1 July 2026",          true],
                      ["Duration",       "8 Weeks (Fast-Track)",  false],
                      ["Mode",           "Weekend / Live Online",  false],
                      ["Certificate",    "Included (Recognized)", false],
                      ["Seats",          "Limited — Filling Fast", false],
                    ].map(([label, value, urgent]) => (
                      <div key={label as string} className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
                        <span className="text-[#94A3B8]">{label}</span>
                        <span className={`font-bold ${urgent ? "text-[#DC2626]" : "!text-[#0F172A]"}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Urgency */}
                  <div className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5">
                    <p className="text-[12px] font-bold text-[#DC2626]">
                      🚨 Hurry! Batch closes soon
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#EF4444]">
                      1 July 2026 · Only a few seats remaining · Register today to lock your spot
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-5 py-3 text-[14px] font-bold text-white shadow-[0_8px_24px_rgba(147,51,234,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(147,51,234,0.4)]"
                  >
                    Register Now — 1 Jul Batch <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-[13px] font-medium text-[#64748B] transition hover:border-[#9333EA]/30 hover:text-[#9333EA]"
                  >
                    Maybe later
                  </button>
                </div>

                <p className="mt-3 text-center text-[10.5px] text-[#94A3B8]">
                  No-cost EMI available · WhatsApp us for details
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
