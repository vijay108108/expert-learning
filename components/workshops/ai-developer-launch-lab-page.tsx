"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cloud,
  Code2,
  Compass,
  Cpu,
  FileCode2,
  Globe,
  Layers3,
  Rocket,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseEnrollmentAction } from "@/components/enroll/course-enrollment-action";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackWorkshopViewContent } from "@/lib/client-analytics";
import { getWorkshopConfigBySlug, type WorkshopConfig } from "@/lib/firebase";

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

const defaultWorkshopStartIso = "2026-07-19T18:00:00+05:30";
const defaultWorkshopEndIso = "2026-07-19T20:00:00+05:30";
const defaultWorkshopTitle = "Build, Launch & Host Your First AI-Generated Website on Microsoft Azure";
const defaultWorkshopFeeLabel = "Rs. 999";

const attendReasons = [
  "Build a production-style website using AI prompts",
  "Provision your first Azure Virtual Machine confidently",
  "Deploy and publish a live URL during the session",
  "Follow a real AI-assisted developer workflow",
  "Understand cloud deployment decisions that matter in interviews",
  "Leave with a repeatable builder launch framework you can reuse",
];

const journeySteps = [
  "Outcome-first kickoff",
  "AI-powered website build",
  "Azure fundamentals in plain English",
  "Create and secure your cloud VM",
  "Deploy your site end-to-end",
  "Go live with your public URL",
  "Career and next-project roadmap",
];

const workshopPerks = [
  "2-hour live builder implementation sprint",
  "Full recording access",
  "Participation certificate",
  "Starter source code pack",
  "Step-by-step Azure setup guide",
  "Community Q&A access",
  "90-day builder roadmap",
];

const audience = [
  "Engineering students",
  "B.Tech / M.Tech",
  "BCA / MCA",
  "MBA / BBA",
  "Freshers",
  "Software developers",
  "Working professionals",
  "Transitioning professionals",
  "Founders and freelancers",
];

const stack = [
  { label: "ChatGPT", icon: Bot },
  { label: "GitHub Copilot", icon: Sparkles },
  { label: "VS Code", icon: Code2 },
  { label: "Microsoft Azure", icon: Cloud },
  { label: "GitHub", icon: Workflow },
  { label: "HTML", icon: FileCode2 },
  { label: "CSS", icon: Layers3 },
  { label: "AI", icon: Cpu },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Cloud Architect",
    quote:
      "Hands-on format was excellent. I finally understood how AI coding and Azure hosting connect in a real developer workflow.",
  },
  {
    name: "Arjun Kapoor",
    role: "Software Engineer",
    quote:
      "The workshop gave me a full launch pipeline in just two hours. I deployed my first live Azure project the same day.",
  },
  {
    name: "Sneha Patel",
    role: "Solutions Architect",
    quote:
      "Clear, practical, and modern. This felt more like a product engineering launch lab than a generic webinar.",
  },
];

const faqs = [
  {
    question: "Can beginners join?",
    answer:
      "Yes. The workshop starts from a beginner-friendly foundation and moves to a production-style deployment workflow step by step.",
  },
  {
    question: "Do I need an Azure account?",
    answer:
      "You can attend without one, but creating a Microsoft Azure account in advance helps you follow the live deployment demo end-to-end.",
  },
  {
    question: "Will recording be available?",
    answer:
      "Yes. Every paid participant gets workshop recording access after the live session.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Yes. Every paid participant receives a participation certificate after the session.",
  },
];

const learningOutcomesGraph = [
  {
    label: "AI Website Build",
    score: 92,
    detail: "Create a complete starter website with AI-assisted workflow and production-style structure.",
  },
  {
    label: "Azure Deployment",
    score: 89,
    detail: "Provision and configure Azure VM basics and push a live deployment from a guided flow.",
  },
  {
    label: "Builder Confidence",
    score: 95,
    detail: "Leave with a repeatable launch framework and a roadmap for your next shipping milestone.",
  },
];

const twoHourFeasibility = [
  { slot: "0-25 mins", focus: "Kickoff + AI-assisted website build setup" },
  { slot: "25-65 mins", focus: "Azure VM creation and core configuration" },
  { slot: "65-105 mins", focus: "Deployment, validation, and live URL checks" },
  { slot: "105-120 mins", focus: "Outcome review and next 90-day builder roadmap" },
];

const sectionNavItems = [
  { id: "outcome-graph", label: "Outcome Graph" },
  { id: "workshop-journey", label: "Agenda" },
  { id: "workshop-faqs", label: "FAQs" },
] as const;

function buildCountdown(nowMs: number, targetMs: number): CountdownState {
  const diff = Math.max(0, targetMs - nowMs);
  const ended = diff === 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, ended };
}

function CountdownTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center backdrop-blur-xl sm:px-4 sm:py-3">
      <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">{String(value).padStart(2, "0")}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/65">{label}</p>
    </div>
  );
}

function OutcomeBar({ label, score, detail }: { label: string; score: number; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/7 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{label}</p>
        <span className="text-xs font-bold text-[#A7D0FF]">{score}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-[linear-gradient(90deg,#FF7A00,#1D7CFF)]"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 text-[12px] leading-6 text-[#C8D7EE]">{detail}</p>
    </div>
  );
}

export function AiDeveloperLaunchLabPage({
  initialWorkshopConfig = null,
}: {
  initialWorkshopConfig?: WorkshopConfig | null;
}) {
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthReady } = useAuth();
  const trackedViewRef = useRef(false);
  const [now, setNow] = useState<number | null>(null);
  const [workshopConfig, setWorkshopConfig] = useState<WorkshopConfig | null>(initialWorkshopConfig);
  const [activeSection, setActiveSection] = useState<(typeof sectionNavItems)[number]["id"]>(() => {
    if (typeof window === "undefined") {
      return "outcome-graph";
    }

    const sectionIds = sectionNavItems.map((item) => item.id);
    const hashId = window.location.hash.replace("#", "");

    if (sectionIds.includes(hashId)) {
      return hashId as (typeof sectionNavItems)[number]["id"];
    }

    return "outcome-graph";
  });

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const config = await getWorkshopConfigBySlug("ai-developer-launch-lab");
        setWorkshopConfig(config);
      } catch {
        setWorkshopConfig(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialWorkshopConfig]);

  useEffect(() => {
    if (trackedViewRef.current) {
      return;
    }

    trackedViewRef.current = true;
    trackWorkshopViewContent();
  }, []);

  useEffect(() => {
    const shouldAutoCheckout = searchParams.get("autocheckout") === "1";

    if (!shouldAutoCheckout || !isAuthReady || !user) {
      return;
    }

    router.replace("/checkout/ai-developer-launch-lab");
  }, [isAuthReady, router, searchParams, user]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const kickoff = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const sectionIds = sectionNavItems.map((item) => item.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id && sectionIds.includes(visible.target.id)) {
          setActiveSection(visible.target.id as (typeof sectionNavItems)[number]["id"]);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.5, 0.8],
      },
    );

    sectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const workshopTitle = workshopConfig?.title?.trim() || defaultWorkshopTitle;
  const workshopStatus = workshopConfig?.status || "published";
  const workshopCapacity = workshopConfig?.capacity || 500;
  const workshopStartIso = workshopConfig?.startAtIso || defaultWorkshopStartIso;
  const workshopEndIso = workshopConfig?.endAtIso || defaultWorkshopEndIso;
  const workshopStartDate = new Date(workshopStartIso);
  const workshopEndDate = new Date(workshopEndIso);
  const workshopDateLabel = Number.isNaN(workshopStartDate.getTime())
    ? "19 July"
    : new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      timeZone: "Asia/Kolkata",
    }).format(workshopStartDate);
  const workshopTimeLabel = Number.isNaN(workshopStartDate.getTime()) || Number.isNaN(workshopEndDate.getTime())
    ? "6 PM - 8 PM"
    : `${new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(workshopStartDate)} - ${new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(workshopEndDate)} IST`;
  const countdownTarget = Number.isNaN(workshopStartDate.getTime()) ? new Date(defaultWorkshopStartIso).getTime() : workshopStartDate.getTime();
  const isWorkshopPublished = workshopStatus === "published";

  const countdown = useMemo(() => (now === null ? null : buildCountdown(now, countdownTarget)), [countdownTarget, now]);

  return (
    <div className="relative overflow-x-clip bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(29,124,255,0.26),transparent_35%),radial-gradient(circle_at_82%_9%,rgba(255,122,0,0.22),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(29,124,255,0.17),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      </div>

      <section className="relative px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#1D7CFF]/40 bg-[#1D7CFF]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8CC3FF]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              {workshopStatus === "published" ? "Live Workshop" : `Status: ${workshopStatus}`}
            </motion.div>

            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[44px] lg:text-[56px]"
            >
              {workshopTitle}
            </motion.h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-5 max-w-2xl text-[15px] leading-7 text-[#CED7F0] sm:text-[17px]"
            >
              In just 2 hours, you will build a real AI-powered website, deploy it on Microsoft Azure, and walk away with a live URL.
              This is a builder-first execution sprint, designed for real outcomes over passive watching.
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-2.5 text-[12px] text-[#A9B6DA]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5" />{workshopDateLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><Clock3 className="h-3.5 w-3.5" />{workshopTimeLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><Globe className="h-3.5 w-3.5" />Live Online</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF7A00]/40 bg-[#FF7A00]/15 px-3 py-1.5 font-semibold text-[#FFC48C]">Limited-time offer: {defaultWorkshopFeeLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/35 bg-[#22C55E]/15 px-3 py-1.5 font-semibold text-[#BBF7D0]">Seats: {workshopCapacity}</span>
            </div>

            <div className="mt-7 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9CB4E8]">Workshop Starts In</p>
              <AnimatePresence mode="wait">
                {countdown?.ended ? (
                  <motion.p
                    key="live"
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={reducedMotion ? undefined : { opacity: 1 }}
                    className="mt-3 text-sm font-semibold text-[#7DF5A4]"
                  >
                    We are live now. Secure your seat and join instantly.
                  </motion.p>
                ) : (
                  <motion.div
                    key="countdown"
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={reducedMotion ? undefined : { opacity: 1 }}
                    className="mt-3 grid grid-cols-4 gap-2"
                  >
                    <CountdownTile label="Days" value={countdown?.days ?? 0} />
                    <CountdownTile label="Hours" value={countdown?.hours ?? 0} />
                    <CountdownTile label="Mins" value={countdown?.minutes ?? 0} />
                    <CountdownTile label="Secs" value={countdown?.seconds ?? 0} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              {isWorkshopPublished ? (
                <CourseEnrollmentAction
                  courseSlug="ai-developer-launch-lab"
                  checkoutLabel={`Reserve Builder Seat - ${defaultWorkshopFeeLabel}`}
                  checkoutButtonClassName="h-12 px-7 text-[14px] rounded-xl border border-[#FF7A00]/40 bg-[linear-gradient(135deg,#FF7A00,#FF9A3C)] text-[#1E1408] shadow-[0_16px_34px_rgba(255,122,0,0.32)]"
                  helperClassName="hidden"
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-7 text-[14px] font-semibold text-[#94A3B8]"
                >
                  Registrations Paused ({workshopStatus})
                </button>
              )}
              <a
                href="#workshop-journey"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#1D7CFF]/45 bg-[#1D7CFF]/10 px-6 text-sm font-semibold text-[#A7D0FF] transition hover:bg-[#1D7CFF]/16"
              >
                Workshop Agenda
              </a>
            </div>
          </div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-[26px] border border-white/15 bg-[linear-gradient(165deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-5 shadow-[0_24px_60px_rgba(5,8,22,0.6)] backdrop-blur-2xl sm:p-6">
              <div className="rounded-2xl border border-[#1D7CFF]/30 bg-[#07122F]/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#A7D0FF]">Launch Lab</p>
                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em]">AI Builder Workshop</h3>
                  </div>
                  <span className="rounded-full border border-[#FF7A00]/40 bg-[#FF7A00]/15 px-3 py-1 text-xs font-semibold text-[#FFC48C]">
                    LIVE
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#CED7F0]">
                  <p className="flex items-center gap-2"><Rocket className="h-4 w-4 text-[#1D7CFF]" />Build faster with AI-assisted coding</p>
                  <p className="flex items-center gap-2"><Server className="h-4 w-4 text-[#1D7CFF]" />Set up Azure infrastructure like a real project</p>
                  <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-[#1D7CFF]" />Deploy and verify your live URL</p>
                  <p className="flex items-center gap-2"><Compass className="h-4 w-4 text-[#1D7CFF]" />Know what to build next for your builder portfolio</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#9CB4E8]">Workshop Fee</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{defaultWorkshopFeeLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#9CB4E8]">Outcome</p>
                  <p className="mt-1 text-xl font-semibold text-white">Deploy Live in 2 Hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-20 border-y border-white/12 bg-[#050816]/92 px-4 py-3 backdrop-blur-md sm:top-[74px] sm:px-6 lg:top-[82px] lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9CB4E8]">Jump To</p>
          <div className="flex flex-wrap gap-2">
            {sectionNavItems.map((item) => {
              const active = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                    active
                      ? "border-[#FF7A00]/50 bg-[#FF7A00]/18 text-[#FFD4AA]"
                      : "border-[#1D7CFF]/45 bg-[#1D7CFF]/12 text-[#B6D6FF] hover:bg-[#1D7CFF]/20"
                  }`}
                  aria-current={active ? "location" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Why This Workshop Turns Learning Into Builder Outcomes</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {attendReasons.map((reason) => (
              <div key={reason} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-4 backdrop-blur-xl">
                <p className="flex items-center gap-2 text-sm font-medium text-[#DDE6FF]"><CheckCircle2 className="h-4 w-4 text-[#22C55E]" />{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="outcome-graph" className="scroll-mt-36 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/14 bg-[linear-gradient(135deg,rgba(255,122,0,0.12),rgba(29,124,255,0.16))] p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A7D0FF]">
            <BarChart3 className="h-4 w-4" />
            Outcome Graph
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Can You Really Learn This in 2 Hours?</h2>
          <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[#D6E4FF]">
            Yes, because this is not theory-heavy training. It is a mission-led execution sprint where you build, deploy, and validate a live outcome in one guided flow.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {learningOutcomesGraph.map((metric) => (
              <OutcomeBar key={metric.label} label={metric.label} score={metric.score} detail={metric.detail} />
            ))}
          </div>

          <div className="mt-7">
            <h3 className="text-lg font-semibold text-white">2-Hour Feasibility Timeline</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {twoHourFeasibility.map((item) => (
                <div key={item.slot} className="rounded-2xl border border-white/12 bg-[#08142E]/75 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7EAFFF]">{item.slot}</p>
                  <p className="mt-2 text-sm leading-6 text-[#DDE6FF]">{item.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workshop-journey" className="scroll-mt-36 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Your 2-Hour Execution Plan</h2>
          <div className="mt-7 rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur-xl sm:p-7">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {journeySteps.map((step, index) => (
                <div key={step} className="relative rounded-2xl border border-white/10 bg-[#08142E]/70 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#7EAFFF]">Step {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">What You Unlock After Enrolling</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {workshopPerks.map((perk) => (
                <div key={perk} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-4 text-sm text-[#DEE7FF] backdrop-blur-xl">
                  {perk}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Who This Is Perfect For</h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {audience.map((item) => (
                <span key={item} className="rounded-full border border-[#1D7CFF]/35 bg-[#1D7CFF]/12 px-3 py-1.5 text-xs font-semibold text-[#B6D6FF]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/14 bg-[linear-gradient(135deg,rgba(29,124,255,0.18),rgba(255,122,0,0.15))] p-6 backdrop-blur-2xl sm:p-8">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Mentor</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
            <div className="flex h-[112px] w-[112px] items-center justify-center rounded-3xl border border-white/25 bg-[#08142E] text-3xl font-bold text-[#FFB366]">
              VV
            </div>
            <div>
              <p className="text-xl font-semibold text-white">Vijay Vishwakarma</p>
              <p className="mt-1 text-sm text-[#DBE7FF]">Founder, GenZNext | Enterprise Cloud Architect | 10+ years of experience</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Enterprise Cloud Architect",
                  "Microsoft Azure Expert",
                  "AI Specialist",
                  "Builder execution mentor",
                ].map((badge) => (
                  <span key={badge} className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] text-[#D8E3FF]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Technology Stack</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {stack.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/12 bg-white/8 px-3 py-4 text-center backdrop-blur-xl">
                <item.icon className="mx-auto h-5 w-5 text-[#5FA8FF]" />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D7E6FF]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Testimonials</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
                <p className="text-sm leading-7 text-[#D6E4FF]">{item.quote}</p>
                <p className="mt-4 text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-[#9DB6E5]">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workshop-faqs" className="scroll-mt-36 px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">FAQs</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-white/14 bg-white/8 px-5 py-4 backdrop-blur-xl">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">{item.question}</summary>
                <p className="mt-3 text-sm leading-7 text-[#CEDCFB]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
