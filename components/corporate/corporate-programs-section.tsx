"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonLinkClasses } from "@/components/ui/button-link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { iconMap, type IconKey } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "orange" | "blue" | "purple";

type CorporateProgram = {
  icon: IconKey;
  title: string;
  description: string;
  duration: string;
  level: string;
  badgeLabel: string;
  badgeTone: BadgeTone;
  tags: string[];
  overview: string;
  idealFor: string[];
  outcomes: string[];
  deliveryModel: string[];
  tools: string[];
  supportFeatures: string[];
  consultationLabel: string;
  overviewLabel: string;
  supportLabel: string;
};

const badgeToneClasses: Record<BadgeTone, string> = {
  green: "border-[rgba(52,211,153,0.2)] bg-[rgba(16,185,129,0.12)] text-[#34D399]",
  orange: "border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] text-[#15407E]",
  blue: "border-[rgba(96,165,250,0.2)] bg-[rgba(59,130,246,0.12)] text-[#60A5FA]",
  purple: "border-[rgba(167,139,250,0.2)] bg-[rgba(139,92,246,0.12)] text-[#A78BFA]",
};

const corporatePrograms: CorporateProgram[] = [
  {
    icon: "building",
    title: "Custom Builder Journeys",
    description: "Customized cloud and AI training roadmaps aligned to internal business goals, roles, and transformation priorities.",
    duration: "Flexible Cohort",
    level: "Team Enablement",
    badgeLabel: "Team training",
    badgeTone: "green",
    tags: ["Role Mapping", "Cloud", "AI"],
    overview:
      "Customized cloud and AI training roadmap aligned to internal business goals, delivery workflows, and role-specific expectations.",
    idealFor: ["Capability academies", "Business-unit enablement", "Leadership-sponsored transformation teams"],
    outcomes: ["Role-based skill progression", "Aligned training roadmap", "Hands-on practice coverage", "Structured knowledge checkpoints"],
    deliveryModel: ["Discovery workshop", "Role mapping", "Internal training roadmap", "Hands-on labs", "Business alignment reviews"],
    tools: ["Azure", "AWS", "GitHub", "Terraform", "Power BI", "GenAI workflows"],
    supportFeatures: ["Internal roadmap alignment", "Team enablement planning", "Hands-on labs", "Assessment checkpoints", "Business alignment cadence"],
    consultationLabel: "Book Builder Advisory",
    overviewLabel: "Program Overview",
    supportLabel: "Business Alignment",
  },
  {
    icon: "community",
    title: "Cohort-based Upskilling",
    description: "Live mentor-led cloud and AI upskilling for teams with labs, certification guidance, and progress visibility.",
    duration: "6-12 Weeks",
    level: "Team Delivery",
    badgeLabel: "Most popular",
    badgeTone: "orange",
    tags: ["Live Cohorts", "Labs", "Mentors"],
    overview:
      "Live mentor-led cloud and AI upskilling program designed for cross-functional teams that need shared capability growth and delivery readiness.",
    idealFor: ["Engineering teams", "Fresh hires", "Cloud migration squads", "Delivery and support teams"],
    outcomes: ["Live sessions", "Team labs", "Progress tracking", "Certification guidance", "Reporting dashboard"],
    deliveryModel: ["Live mentor sessions", "Batch-based learning", "Team labs", "Weekly assignments", "Office hours"],
    tools: ["Azure", "AWS", "Docker", "Kubernetes", "GitHub Actions", "Monitoring stacks"],
    supportFeatures: ["Certification support", "Progress tracking", "Batch reporting", "Manager visibility", "Enablement reviews"],
    consultationLabel: "Talk to Builder Team",
    overviewLabel: "Program Overview",
    supportLabel: "Cohort Support",
  },
  {
    icon: "database",
    title: "Progress Visibility",
    description: "Give managers and enablement teams clear reporting on completion, milestones, assessments, and skill adoption.",
    duration: "Enterprise Rollout",
    level: "Reporting Ready",
    badgeLabel: "Enterprise plan",
    badgeTone: "blue",
    tags: ["Dashboards", "Milestones", "Reporting"],
    overview:
      "Structured learning analytics and milestone reporting for organizations that need visibility into team progress, adoption, and readiness.",
    idealFor: ["L&D teams", "Program managers", "Capability leaders", "Enterprise delivery units"],
    outcomes: ["Completion tracking", "Milestone visibility", "Skills reporting", "Manager-ready snapshots"],
    deliveryModel: ["Assessment baselines", "Completion tracking", "Checkpoint reporting", "Team analytics reviews", "Leadership summary updates"],
    tools: ["Reporting dashboards", "Completion tracking", "Assessment metrics", "Team analytics", "Leadership reporting"],
    supportFeatures: ["Program dashboards", "Builder milestone tracking", "Leadership-ready summaries", "Stakeholder review inputs", "Assessment metrics"],
    consultationLabel: "Talk to Builder Team",
    overviewLabel: "Program Overview",
    supportLabel: "Reporting Model",
  },
  {
    icon: "guidance",
    title: "Partner-led Execution",
    description: "Work with a training partner who can shape curriculum, delivery, and governance around enterprise outcomes.",
    duration: "Custom Delivery",
    level: "Advisory Support",
    badgeLabel: "Custom training",
    badgeTone: "purple",
    tags: ["Consulting", "Roadmaps", "Execution"],
    overview:
      "Partner with our team to design and execute enterprise learning programs aligned to capability goals, delivery expectations, and workforce readiness outcomes.",
    idealFor: ["Enterprise transformation programs", "Consulting teams", "Academic alliances", "Scaling organizations"],
    outcomes: ["Curriculum alignment", "Delivery planning", "Execution support", "Stakeholder reporting"],
    deliveryModel: ["Advisory workshops", "Curriculum planning", "Enterprise rollout mapping", "Consulting engagement cadence", "Governance reviews"],
    tools: ["Cloud labs", "AI workflows", "Delivery playbooks", "Assessment templates", "Reporting dashboards"],
    supportFeatures: ["Advisory support", "Curriculum planning", "Transformation assistance", "Review checkpoints", "Custom delivery governance"],
    consultationLabel: "Book Builder Advisory",
    overviewLabel: "Program Overview",
    supportLabel: "Execution Support",
  },
] as const;

const fieldClass =
  "w-full rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[14px] text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[rgba(249,115,22,0.34)] focus:bg-[rgba(255,255,255,0.06)]";
const selectClass =
  `${fieldClass} appearance-none bg-[#0F172A] text-white [color-scheme:dark] [&_option]:bg-[#0F172A] [&_option]:text-white`;

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E56F12]">{title}</div>
      <div className="mt-3 space-y-2.5">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-[13px] leading-6 text-[#CBD5E1]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B2E6B]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CorporateProgramsSection() {
  const reducedMotion = useReducedMotion();
  const [activeProgram, setActiveProgram] = useState<CorporateProgram | null>(null);
  const [inquiryProgram, setInquiryProgram] = useState("");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    workEmail: "",
    phoneNumber: "",
    interestedProgram: "",
    message: "",
  });

  const anyModalOpen = Boolean(activeProgram) || inquiryOpen;

  useEffect(() => {
    if (!anyModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveProgram(null);
        setInquiryOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [anyModalOpen]);

  useEffect(() => {
    if (!toastOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastOpen(false);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [toastOpen]);

  const programOptions = useMemo(() => corporatePrograms.map((program) => program.title), []);

  function openInquiry(programTitle?: string) {
    setActiveProgram(null);
    setFormError(null);
    setInquiryProgram(programTitle || "");
    setForm((current) => ({
      ...current,
      interestedProgram: programTitle || current.interestedProgram,
    }));
    setInquiryOpen(true);
  }

  async function handleInquirySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError(null);

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.workEmail,
          phone: form.phoneNumber,
          course: form.interestedProgram,
          source: "Corporate Training Inquiry",
          pageUrl,
          courseSlug: "corporate-training",
          message: [
            `Company Name: ${form.companyName}`,
            `Interested Program: ${form.interestedProgram}`,
            `Message: ${form.message || "No additional message provided."}`,
          ].join("\n"),
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit your inquiry right now.");
      }

      setInquiryOpen(false);
      setToastOpen(true);
      setInquiryProgram("");
      setForm({
        fullName: "",
        companyName: "",
        workEmail: "",
        phoneNumber: "",
        interestedProgram: "",
        message: "",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to submit your inquiry right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <section id="enterprise-programs" className="scroll-mt-28 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Enterprise Enablement"
              title="Builder capability architecture for modern enterprise teams"
              description="From cloud foundations to GenAI execution, we help organizations build confident, certified, project-ready builder pipelines."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
            {corporatePrograms.map((program, index) => {
              const Icon = iconMap[program.icon] as ComponentType<{ className?: string }>;

              return (
                <Reveal key={program.title} delay={index * 0.06} className="h-full">
                  <article className="relative flex h-full flex-col gap-3 rounded-[18px] border border-[#1E2D42] bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(15,23,42,0.92))] p-[18px] shadow-[0_20px_44px_rgba(2,8,28,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0B2E6B] hover:shadow-[0_28px_54px_rgba(2,8,28,0.38),0_0_24px_rgba(249,115,22,0.12)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(249,115,22,0.25)] bg-[rgba(249,115,22,0.1)] text-[#F59E0B]">
                        <Icon className="h-[18px] w-[18px]" />
                      </div>
                      <span className={cn("whitespace-nowrap rounded-full border px-[10px] py-[3px] text-[10px] font-medium", badgeToneClasses[program.badgeTone])}>
                        {program.badgeLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#CBD5E1]">{program.duration}</span>
                      <span className="h-[3px] w-[3px] rounded-full bg-[#334155]" />
                      <span className="text-[11px] text-[#CBD5E1]">{program.level}</span>
                    </div>

                    <h3 className="text-[14px] font-semibold leading-[1.4] text-[#F1F5F9]">{program.title}</h3>
                    <p className="flex-1 text-[12px] leading-[1.6] text-[#CBD5E1]">{program.description}</p>

                    <div className="flex flex-wrap gap-[5px]">
                      {program.tags.map((tag) => (
                        <span key={tag} className="rounded-[6px] border border-[#475569] bg-[#0F172A] px-2 py-[2px] text-[10px] text-[#E2E8F0]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="h-px bg-[#1A2537]" />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveProgram(program)}
                        className={buttonLinkClasses(
                          "navPrimary",
                          "flex-1 justify-center rounded-[10px] px-4 py-[10px] text-[13px]",
                        )}
                      >
                        View Program
                      </button>
                      <button
                        type="button"
                        onClick={() => openInquiry(program.title)}
                        className={buttonLinkClasses(
                          "navGhost",
                          "flex-1 justify-center rounded-[10px] px-4 py-[10px] text-[13px]",
                        )}
                      >
                        Talk to Team
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProgram ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
            className="fixed inset-0 z-[190] flex items-center justify-center bg-[rgba(2,6,23,0.76)] px-4 py-6 backdrop-blur-[5px]"
            onClick={() => setActiveProgram(null)}
          >
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
              className="relative w-full max-w-[920px] overflow-y-auto overscroll-contain rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96))] shadow-[0_28px_80px_rgba(2,8,28,0.4)] [max-height:90vh] [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-20 flex justify-end border-b border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] px-5 py-4 backdrop-blur-xl sm:px-6">
                <button
                  type="button"
                  onClick={() => setActiveProgram(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[#94A3B8] transition hover:border-[rgba(255,255,255,0.18)] hover:text-white"
                  aria-label="Close program details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E56F12]">Enterprise Program</div>
                <h2 className="mt-3 text-[28px] font-bold leading-[1.08] text-white sm:text-[34px]">{activeProgram.title}</h2>
                <p className="mt-3 max-w-[56ch] text-[14px] leading-7 text-[#CBD5E1]">{activeProgram.overview}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E56F12]">Training Delivery</div>
                    <div className="mt-2 text-[13px] font-medium leading-6 text-white">{activeProgram.level}</div>
                  </div>
                  <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E56F12]">Duration</div>
                    <div className="mt-2 text-[13px] font-medium leading-6 text-white">{activeProgram.duration}</div>
                  </div>
                  <div className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E56F12]">{activeProgram.supportLabel}</div>
                    <div className="mt-2 text-[13px] font-medium leading-6 text-white">{activeProgram.badgeLabel}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  <SectionList title={activeProgram.overviewLabel} items={[activeProgram.overview]} />
                  <SectionList title="Who It Is For" items={activeProgram.idealFor} />
                  <SectionList title="Key Outcomes" items={activeProgram.outcomes} />
                  <SectionList title="Training Delivery Model" items={activeProgram.deliveryModel} />
                  <SectionList title="Tools & Technologies Covered" items={activeProgram.tools} />
                </div>

                <div className="mt-3">
                  <SectionList title="Enterprise Support Features" items={activeProgram.supportFeatures} />
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[13px] leading-6 text-[#94A3B8]">
                    Need a tailored advisory around this program? Our enterprise builder team can help scope the right delivery model.
                  </div>
                  <button
                    type="button"
                    onClick={() => openInquiry(activeProgram.title)}
                    className={buttonLinkClasses("navPrimary", "justify-center rounded-[12px] px-5 py-3 text-[13px]")}
                  >
                    {activeProgram.consultationLabel}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {inquiryOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
            className="fixed inset-0 z-[195] flex items-center justify-center bg-[rgba(2,6,23,0.78)] px-4 py-6 backdrop-blur-[6px]"
            onClick={() => {
              setFormError(null);
              setInquiryOpen(false);
            }}
          >
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
              className="relative w-full max-w-[760px] overflow-y-auto overscroll-contain rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96))] shadow-[0_28px_80px_rgba(2,8,28,0.42)] [max-height:90vh] [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-20 flex justify-end border-b border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] px-5 py-4 backdrop-blur-xl sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setInquiryOpen(false);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[#94A3B8] transition hover:border-[rgba(255,255,255,0.18)] hover:text-white"
                  aria-label="Close enterprise inquiry form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E56F12]">Enterprise Builder Advisory</div>
                <h2 className="mt-3 text-[28px] font-bold leading-[1.08] text-white sm:text-[32px]">Talk to our enterprise builder team</h2>
                <p className="mt-3 max-w-[48ch] text-[14px] leading-7 text-[#CBD5E1]">
                  Share a few details about your team, program interest, and goals. We will follow up with a tailored builder advisory plan.
                </p>

                <form className="mt-5" onSubmit={handleInquirySubmit}>
                  <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">Full Name</label>
                    <input
                      className={fieldClass}
                      value={form.fullName}
                      onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">Company Name</label>
                    <input
                      className={fieldClass}
                      value={form.companyName}
                      onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">Work Email</label>
                    <input
                      type="email"
                      className={fieldClass}
                      value={form.workEmail}
                      onChange={(event) => setForm((current) => ({ ...current, workEmail: event.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">Phone Number</label>
                    <input
                      type="tel"
                      className={fieldClass}
                      value={form.phoneNumber}
                      onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">Interested Program</label>
                    <select
                      className={selectClass}
                      value={form.interestedProgram || inquiryProgram}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          interestedProgram: event.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" disabled>
                        Select program
                      </option>
                      {programOptions.map((option) => (
                        <option key={option} value={option} className="bg-[#0F172A] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>

                  <div className="mt-3">
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">Message</label>
                    <textarea
                      className={`${fieldClass} min-h-[128px] resize-y`}
                      value={form.message}
                      onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                      placeholder="Tell us about your goals, internal timeline, or delivery expectations."
                      required
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[12px] leading-6 text-[#94A3B8]">
                      Your inquiry will be routed to our enterprise builder team for follow-up.
                    </div>
                    <button
                      type="submit"
                      disabled={pending}
                      className={buttonLinkClasses(
                        "navPrimary",
                        "justify-center rounded-[12px] px-5 py-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-70",
                      )}
                    >
                      {pending ? "Submitting..." : "Request Builder Advisory"}
                    </button>
                  </div>
                  {formError ? (
                    <p className="mt-3 rounded-[14px] border border-[rgba(248,113,113,0.22)] bg-[rgba(127,29,29,0.18)] px-4 py-3 text-[13px] leading-6 text-[#FECACA]">
                      {formError}
                    </p>
                  ) : null}
                </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toastOpen ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
            className="fixed top-5 right-5 z-[205] w-[min(92vw,380px)] rounded-[18px] border border-[rgba(59,130,246,0.18)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-4 py-3.5 shadow-[0_22px_44px_rgba(2,8,28,0.34)]"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#60A5FA]">Inquiry Submitted</div>
            <p className="mt-2 text-[13px] leading-6 text-[#E2E8F0]">
              Your inquiry has been submitted successfully. Our enterprise builder team will contact you shortly.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
