import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Download,
  GitBranch,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

const phases = [
  {
    id: "01",
    phase: "Phase 1",
    code: "AZ-104",
    title: "Azure Administrator Foundation",
    story:
      "Start by mastering real Azure operations: identity, compute, networking, storage, governance, and monitoring. This phase builds operational confidence from day one.",
    duration: "8 Weeks",
    outcomeTitle: "You become Azure operations-ready",
    outcomes: [
      "Manage identity, access, and governance using enterprise patterns",
      "Operate Azure compute, networking, storage, and backup workflows",
      "Build an admin portfolio with practical cloud operations labs",
    ],
    ratings: [
      { label: "Role Readiness", value: 92 },
      { label: "Hands-on Depth", value: 95 },
      { label: "Interview Relevance", value: 90 },
    ],
    checkoutHref: "/checkout/azure-administrator",
    price: "INR 23,600",
  },
  {
    id: "02",
    phase: "Phase 2",
    code: "AZ-400",
    title: "DevOps Engineering and Delivery",
    story:
      "After admin foundations, move into engineering velocity: CI/CD, infrastructure as code, release governance, policy gates, and secure platform delivery.",
    duration: "8 Weeks",
    outcomeTitle: "You become DevOps delivery-ready",
    outcomes: [
      "Design and run secure CI/CD pipelines with release governance",
      "Implement IaC and automation for repeatable cloud delivery",
      "Ship a DevOps case study mapped to real production workflows",
    ],
    ratings: [
      { label: "Delivery Confidence", value: 94 },
      { label: "Automation Strength", value: 93 },
      { label: "Enterprise Fit", value: 91 },
    ],
    checkoutHref: "/checkout/azure-devops-engineer",
    price: "INR 30,000",
  },
  {
    id: "03",
    phase: "Phase 3",
    code: "AIOps",
    title: "AIOps and Reliability Execution",
    story:
      "Finally, upgrade into modern operations intelligence: observability, incident response, automation playbooks, and reliability engineering at scale.",
    duration: "8 Weeks",
    outcomeTitle: "You become reliability and AIOps-ready",
    outcomes: [
      "Build telemetry, KQL, dashboard, and alert intelligence workflows",
      "Design incident triage, runbook automation, and SRE operations loops",
      "Deliver an AIOps capstone with measurable reliability outcomes",
    ],
    ratings: [
      { label: "Ops Intelligence", value: 95 },
      { label: "Automation Impact", value: 92 },
      { label: "Leadership Visibility", value: 90 },
    ],
    checkoutHref: "/checkout/aiops-engineering",
    price: "INR 40,000",
  },
] as const;

const masterProgram = {
  title: "Microsoft Cloud and AI DevOps Master Journey",
  tagline: "Azure Admin -> DevOps -> AIOps",
  description:
    "This is one integrated builder journey. Each phase compounds into the next so you do not just collect certifications, you build real execution capability across administration, delivery, and intelligent operations.",
  totalDuration: "24 Weeks",
  oneTimePrice: "INR 79,000",
  crossedPrice: "INR 90,000",
  savingsLabel: "Save INR 11,000 with one-time enrollment",
  fullCheckoutHref: "/checkout/microsoft-cloud-ai-devops-master-program",
  syllabusHref: "/syllabus/master-program-az104-az400-aiops-syllabus.pdf",
};

export const metadata = buildMetadata({
  title: "Builder Programs | Azure Admin -> DevOps -> AIOps",
  description:
    "One mission-led builder journey: AZ-104 to AZ-400 to AIOps, with flexible phase-wise or one-time payment options and clear outcomes for every phase.",
  path: "/programs",
});

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-[#334155]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#E2E8F0]">
        <div
          className="h-2 rounded-full bg-[linear-gradient(90deg,#F58220,#0B2E6B)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <main className="bg-white">
      <section className="bg-[linear-gradient(160deg,#FFFFFF_0%,#FFF3E8_50%,#E0F2FE_100%)] px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <span className="inline-flex items-center rounded-full border border-[#E8DCCF] bg-[#FFF3E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#E56F12]">
            One Builder Journey
          </span>
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0F172A] sm:text-[44px]">
            Azure Admin -&gt; DevOps -&gt; AIOps
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#64748B]">
            We are intentionally building this as one story, not disconnected programs. Phase 1 gives cloud administration strength,
            Phase 2 builds delivery engineering power, and Phase 3 upgrades you into intelligent, reliability-first operations.
          </p>

          <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Quote className="mt-1 h-5 w-5 shrink-0 text-[#0B2E6B]" />
              <p className="text-[15px] font-semibold leading-7 text-[#0F172A]">
                Don&apos;t find a job. Find a dream worth building, and become the engineer who can ship it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F58220]">Journey Graph</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">How Capability Compounds Across 3 Phases</h2>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {phases.map((phase, index) => (
              <article key={phase.id} className="relative rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#F58220]">{phase.phase}</p>
                <h3 className="mt-2 text-xl font-bold text-[#0F172A]">{phase.code}</h3>
                <p className="mt-1 text-sm font-semibold text-[#0B2E6B]">{phase.title}</p>
                <p className="mt-3 text-[13px] leading-6 text-[#64748B]">{phase.story}</p>
                {index < phases.length - 1 ? (
                  <div className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 lg:block">
                    <GitBranch className="h-5 w-5 text-[#94A3B8]" />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {phases.map((phase) => (
            <article key={phase.id} className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9A3412]">
                      {phase.phase}
                    </span>
                    <span className="rounded-full border border-[#C8D7EE] bg-[#EAF0FA] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0B2E6B]">
                      {phase.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-[#0F172A]">{phase.code} - {phase.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-[#166534]">{phase.outcomeTitle}</p>

                  <ul className="mt-4 space-y-2.5">
                    {phase.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-[13px] text-[#334155]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0B2E6B]" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#0B2E6B]">Rating Points</p>
                  <div className="mt-3 space-y-3">
                    {phase.ratings.map((rating) => (
                      <RatingBar key={rating.label} label={rating.label} value={rating.value} />
                    ))}
                  </div>
                  <div className="mt-5 border-t border-[#E2E8F0] pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748B]">Phase Fee</p>
                    <p className="mt-1 text-2xl font-bold text-[#0F172A]">{phase.price}</p>
                    <Link
                      href={phase.checkoutHref}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Pay for {phase.code} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </aside>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F58220]">Payment Flexibility</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Choose How You Want to Build</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#64748B]">
            You can enroll phase-by-phase as you progress, or join the full 24-week journey in one go.
            Both paths lead to the same capability story: Azure Admin -&gt; DevOps -&gt; AIOps.
          </p>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0B2E6B]">Option A</p>
              <h3 className="mt-2 text-xl font-bold text-[#0F172A]">Pay Phase-by-Phase</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#64748B]">
                Start with AZ-104, then unlock AZ-400, then AIOps as your readiness grows.
              </p>
              <div className="mt-4 space-y-2.5 text-sm text-[#334155]">
                <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#0B2E6B]" />Financially flexible progression</p>
                <p className="flex items-center gap-2"><Target className="h-4 w-4 text-[#0B2E6B]" />Phase outcome clarity</p>
                <p className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#0B2E6B]" />Milestone-based confidence growth</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#FED7AA] bg-[linear-gradient(135deg,#FFF7ED,#EEF4FB)] p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9A3412]">Option B</p>
              <h3 className="mt-2 text-xl font-bold text-[#0F172A]">Pay Once for Full Journey</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#64748B]">Best for builders who want one committed, end-to-end transformation plan.</p>
              <p className="mt-4 text-3xl font-extrabold text-[#0F172A]">{masterProgram.oneTimePrice}</p>
              <p className="text-sm text-[#94A3B8] line-through">{masterProgram.crossedPrice}</p>
              <p className="mt-1 text-sm font-semibold text-[#166534]">{masterProgram.savingsLabel}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={masterProgram.fullCheckoutHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Enroll Full Journey <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={masterProgram.syllabusHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A]"
                >
                  <Download className="h-4 w-4" /> Download Syllabus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#F58220]">Builder Story</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">Why We Built This Program This Way</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#64748B]">
            Teams do not hire for isolated certificates. They hire for people who can run cloud foundations,
            ship delivery pipelines, and improve reliability in production. That is why this program is structured as one progression in three phases.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5 text-xs font-semibold">
            <span className="rounded-full bg-[#EAF0FA] px-3 py-1 text-[#0B2E6B]">Phase 1: Admin Strength</span>
            <span className="rounded-full bg-[#EEF6FF] px-3 py-1 text-[#1D4ED8]">Phase 2: Delivery Velocity</span>
            <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[#166534]">Phase 3: Reliability Intelligence</span>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1 text-[12px] font-semibold text-[#9A3412]">
            <Sparkles className="h-3.5 w-3.5" /> Build capability first. Credentials follow.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-5 py-2.5 text-sm font-bold text-white">
              Talk to Builder Team <Award className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
