import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Clock3, Download, FolderKanban, GraduationCap, Layers, Users2 } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { TechStackGrid } from "@/components/ui/tech-logo";

type Program = {
  title: string;
  credentialTitle: string;
  credentialDuration: string;
  href: string;
  syllabusHref: string;
  syllabusButtonClassName: string;
  slug: string;
  badge: string;
  badgeColor: string;
  stripColor: string;
  hot?: boolean;
  tagline: string;
  description: string;
  duration: string;
  level: string;
  projects: string;
  certification: string;
  price: string;
  originalPrice: string;
  highlights: string[];
  outcomes: string[];
};

const programs: Program[] = [
  {
    title: "AZ-104 – Microsoft Azure Administrator",
    href: "/checkout/azure-administrator",
    credentialTitle: "Microsoft Certified: Azure Administrator Associate AZ-104",
    credentialDuration: "2 Months",
    syllabusHref: "/syllabus/az-104-official-syllabus.pdf",
    syllabusButtonClassName:
      "border-[#BFDBFE] bg-[linear-gradient(135deg,#EFF6FF,#DBEAFE)] text-[#1D4ED8] shadow-[0_10px_24px_rgba(59,130,246,0.10)] hover:border-[#60A5FA] hover:text-[#1E40AF]",
    slug: "azure-administrator",
    badge: "Microsoft Azure Admin",
    badgeColor: "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]",
    stripColor: "from-[#0078D4] via-[#3B82F6] to-[#0EA5E9]",
    hot: true,
    tagline: "Azure identity, compute, networking, storage, and monitoring administration",
    description:
      "Build job-ready Azure administration capability aligned to AZ-104 with hands-on governance, infrastructure, backup, and monitoring practice for real enterprise environments.",
    duration: "8 Weeks",
    level: "Intermediate",
    projects: "8-Module Admin Curriculum",
    certification: "AZ-104 Certification Prep",
    price: "₹20,000",
    originalPrice: "",
    highlights: [
      "Covers Entra ID, RBAC, virtual networking, storage, backup and recovery",
      "Hands-on Azure Monitor and Log Analytics operations labs",
      "Built for cloud admins, support engineers, and infrastructure teams",
    ],
    outcomes: ["Azure Ops Ready", "AZ-104 Ready", "Admin Lab Portfolio"],
  },
  {
    title: "AZ-400 – Microsoft DevOps Engineer",
    href: "/checkout/azure-devops-engineer",
    credentialTitle: "Microsoft Certified DevOps Engineer Expert AZ-400",
    credentialDuration: "1 Month",
    syllabusHref: "/syllabus/az-400-official-syllabus.pdf",
    syllabusButtonClassName:
      "border-[#DDD6FE] bg-[linear-gradient(135deg,#F5F3FF,#EDE9FE)] text-[#6D28D9] shadow-[0_10px_24px_rgba(124,58,237,0.10)] hover:border-[#A78BFA] hover:text-[#5B21B6]",
    slug: "azure-devops-engineer",
    badge: "Microsoft DevOps",
    badgeColor: "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]",
    stripColor: "from-[#2563EB] via-[#4F46E5] to-[#7C3AED]",
    hot: true,
    tagline: "CI/CD, release governance, IaC, DevSecOps, and observability on Azure",
    description:
      "Advance into Microsoft DevOps engineering with delivery pipelines, release controls, infrastructure as code, feedback loops, and secure platform automation aligned to AZ-400.",
    duration: "8 Weeks",
    level: "Advanced",
    projects: "8-Module DevOps Curriculum",
    certification: "AZ-400 Certification Prep",
    price: "₹30,000",
    originalPrice: "",
    highlights: [
      "Covers Azure Pipelines, GitHub Actions, Boards, Repos, and release governance",
      "Includes Terraform, Bicep, policy automation, and security integration",
      "Designed for DevOps engineers, platform teams, and release owners",
    ],
    outcomes: ["Pipeline Delivery", "AZ-400 Ready", "DevOps Case Study"],
  },
  {
    title: "AIOps Engineering",
    href: "/checkout/aiops-engineering",
    credentialTitle: "Microsoft Azure AIOps Engineering Specialist",
    credentialDuration: "2 Months",
    syllabusHref: "/syllabus/aiops-engineer-official-syllabus.pdf",
    syllabusButtonClassName:
      "border-[#99F6E4] bg-[linear-gradient(135deg,#ECFEFF,#CCFBF1)] text-[#0F766E] shadow-[0_10px_24px_rgba(20,184,166,0.10)] hover:border-[#2DD4BF] hover:text-[#115E59]",
    slug: "aiops-engineering",
    badge: "Cloud Operations AI",
    badgeColor: "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]",
    stripColor: "from-[#0EA5E9] via-[#4F46E5] to-[#9333EA]",
    hot: true,
    tagline: "Observability, incident intelligence, automation, and reliability engineering",
    description:
      "Learn production-focused AIOps engineering with telemetry correlation, KQL analysis, alert design, incident automation, and reliability workflows for modern cloud operations teams.",
    duration: "8 Weeks",
    level: "Advanced",
    projects: "10-Module AIOps Curriculum",
    certification: "AIOps Capstone Portfolio",
    price: "\u20B940,000",
    originalPrice: "",
    highlights: [
      "Build observability workflows across Azure Monitor, Log Analytics, and dashboards",
      "Practice incident triage, runbook automation, and service reliability response",
      "Industry-focused for SRE, platform operations, and cloud support teams",
    ],
    outcomes: ["AIOps Portfolio", "Incident Automation", "Reliability Ops"],
  },
];

const combinedMasterProgram = {
  title: "Microsoft Cloud & AI DevOps Master Program",
  href: "/programs/microsoft-cloud-ai-devops-master",
  enrollHref: "/checkout/microsoft-cloud-ai-devops-master-program",
  syllabusHref: "/syllabus/master-program-az104-az400-aiops-syllabus.pdf",
  badge: "AZ-104 + AZ-400 + AIOps",
  tag: "Focused Master Track",
  tagline: "AZ-104 → AZ-400 → AIOps Engineering",
  description:
    "This master program is built around one clear journey: Azure administration, DevOps delivery, and AIOps-led operations. You first learn to run Microsoft Azure environments through AZ-104, then build modern CI/CD and platform workflows through AZ-400, and finally move into AIOps Engineering with observability, incident response, automation and reliability practices.",
  chips: [
    "Live Instructor-Led Sessions",
    "AZ-104 Azure Administrator",
    "AZ-400 DevOps Engineer",
    "AIOps Engineering",
    "Azure Monitor + KQL",
    "Automation Playbooks",
    "LMS Access",
    "Placement Support",
  ],
  stats: [
    { icon: Clock3, label: "24 Weeks" },
    { icon: Layers, label: "3 Phases" },
    { icon: FolderKanban, label: "3 Capstones" },
    { icon: Award, label: "AZ-104 + AZ-400" },
  ],
  price: "\u20B979,000",
  originalPrice: "\u20B990,000",
  priceLabel: "Bundle offer: join all 3 tracks together and save \u20B911,000",
  features: [
    { icon: Clock3, text: "24 Weeks (3 focused phases)" },
    { icon: GraduationCap, text: "Beginner to Advanced" },
    { icon: Award, text: "AZ-104 + AZ-400 exam-aligned prep" },
    { icon: Layers, text: "Azure Admin → DevOps → AIOps journey" },
    { icon: FolderKanban, text: "3 capstones + guided labs" },
    { icon: Users2, text: "Live sessions + LMS access for life" },
  ],
};

export const metadata = buildMetadata({
  title: "Career Programs | GenZNext Research & Training",
  description: "Cloud, AI, DevOps & AI Tools programs with real tool logos, certifications, live mentorship and placement support.",
  path: "/programs",
});

function ProgramCard({ program }: { program: Program }) {
  return (
    <article
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border bg-white shadow-[0_6px_20px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.13)] ${
        program.hot ? "border-[#DDD6FE]" : "border-[#E2E8F0]"
      }`}
    >
      {program.hot && (
        <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-xl border border-t-0 border-[#FED7AA] bg-[#FFF7ED] px-3 py-0.5 text-[10px] font-bold text-[#C2410C]">
          Most In-Demand
        </span>
      )}

      <div className={`h-1.5 w-full bg-gradient-to-r ${program.stripColor}`} />

      <div className="flex flex-1 flex-col p-5 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${program.badgeColor}`}>
            {program.badge}
          </span>
        </div>
        <div className="mt-3 rounded-[18px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid shrink-0 grid-cols-2 gap-[2px] rounded-[8px] bg-white p-1.5 shadow-sm">
                <span className="h-4 w-4 rounded-[2px] bg-[#F25022]" />
                <span className="h-4 w-4 rounded-[2px] bg-[#7FBA00]" />
                <span className="h-4 w-4 rounded-[2px] bg-[#00A4EF]" />
                <span className="h-4 w-4 rounded-[2px] bg-[#FFB900]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-none text-[#737373]">Microsoft</p>
                <p className="mt-0.5 text-[15px] font-semibold leading-none tracking-[-0.03em] text-[#8C8C8C]">Azure</p>
                <p className="mt-2 text-[11px] font-medium leading-snug text-[#334155]">
                  {program.credentialTitle}
                </p>
              </div>
            </div>
            <span className="shrink-0 pt-1 text-[10.5px] font-medium text-[#94A3B8]">
              {program.credentialDuration}
            </span>
          </div>
        </div>

        <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-wider text-[#4F46E5]">
          {program.tagline}
        </p>

        <p className="mt-1.5 text-[12px] leading-[1.6] text-[#64748B]">
          {program.description}
        </p>

        <div className="mt-4">
          <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#9333EA]">
            Tools & Technologies
          </p>
          <TechStackGrid slug={program.slug} max={14} />
        </div>

        <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <ul className="space-y-1.5">
            {program.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-[11.5px] font-medium !text-[#334155]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {program.outcomes.map((outcome) => (
            <span key={outcome} className="rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[10px] font-bold !text-[#166534]">
              {outcome}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        <div className="mt-4 border-t border-[#F1F5F9] pt-4">
          <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-[#4F46E5]" />{program.duration}</span>
            <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3 text-[#4F46E5]" />{program.projects}</span>
            <span className="flex items-center gap-1"><Award className="h-3 w-3 text-[#4F46E5]" />{program.certification}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[17px] font-extrabold !text-[#0F172A]">{program.price}</p>
              <p className="text-[10px] text-[#94A3B8] line-through">{program.originalPrice}</p>
            </div>
            <Link
              href={program.href}
              className="inline-flex items-center gap-1.5 rounded-[12px] bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_6px_16px_rgba(79,70,229,0.22)] transition group-hover:scale-[1.02] group-hover:shadow-[0_12px_28px_rgba(79,70,229,0.32)]"
            >
              Enroll Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <a
            href={program.syllabusHref}
            target="_blank"
            rel="noreferrer"
            className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[12px] border px-4 py-2.5 text-[12.5px] font-semibold transition ${program.syllabusButtonClassName}`}
          >
            <Download className="h-3.5 w-3.5" />
            Download Syllabus
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProgramsPage() {
  return (
    <main className="bg-white">
      <section className="bg-[linear-gradient(160deg,#FFFFFF_0%,#F5F0FF_50%,#E0F2FE_100%)] px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <span className="inline-flex items-center rounded-full border border-[#DDD6FE] bg-[#F5F0FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7C3AED]">
            GenZNext Career Tracks
          </span>
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em] !text-[#0F172A] sm:text-[42px]">
            Career Programs
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#64748B]">
            Industry-ready Cloud, AI, DevOps &amp; AI Tools programs — with the actual tools employers use, live mentorship and placement support.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#475569]">
            {[
              { icon: GraduationCap, label: "3 Programs" },
              { icon: Clock3, label: "8 Week Tracks" },
              { icon: FolderKanban, label: "Job-Ready Projects" },
              { icon: Award, label: "Certification Prep Included" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-[#4F46E5]" />{label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>

          <div className="mt-10 rounded-[28px] bg-[linear-gradient(160deg,#FFFFFF_0%,#EEF2FF_55%,#F8FAFC_100%)] p-4 sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center rounded-full border border-[#DDD6FE] bg-[#F5F0FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7C3AED]">
                  Combined Master Program
                </span>
                <p className="mt-2 text-sm font-medium text-[#64748B]">
                  Want all three tracks in one guided roadmap? This bundle keeps the same premium master-program layout.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-start">
              <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9A3412]">
                    {combinedMasterProgram.badge}
                  </span>
                  <span className="inline-flex items-center rounded-full border-2 border-[#DC2626] bg-[#FEF2F2] px-3 py-1 text-[11px] font-bold text-[#DC2626]">
                    {combinedMasterProgram.tag}
                  </span>
                </div>

                <div className="mt-4 rounded-[20px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="grid shrink-0 grid-cols-2 gap-[3px] rounded-[10px] bg-white p-1.5 shadow-sm">
                        <span className="h-5 w-5 rounded-[3px] bg-[#F25022]" />
                        <span className="h-5 w-5 rounded-[3px] bg-[#7FBA00]" />
                        <span className="h-5 w-5 rounded-[3px] bg-[#00A4EF]" />
                        <span className="h-5 w-5 rounded-[3px] bg-[#FFB900]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold leading-none text-[#737373]">Microsoft</p>
                        <p className="mt-0.5 text-[20px] font-semibold leading-none tracking-[-0.03em] text-[#8C8C8C]">Azure</p>
                        <p className="mt-3 text-[13px] font-medium leading-snug text-[#334155]">
                          Microsoft Certified Azure Administrator, DevOps Engineer Expert and Azure AIOps Engineering Specialist
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 pt-1 text-[12px] font-medium text-[#94A3B8]">24 Weeks</span>
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">
                  {combinedMasterProgram.tagline}
                </p>
                <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0F172A] sm:text-4xl lg:text-[40px]">
                  {combinedMasterProgram.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#475569]">
                  {combinedMasterProgram.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {combinedMasterProgram.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#334155]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {combinedMasterProgram.stats.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#4F46E5]" />
                      <span className="text-[13px] font-semibold text-[#0F172A]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[22px] border border-[#E2E8F0] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.10)]">
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                  </span>
                  <p className="text-[13px] font-semibold text-[#9A3412]">Only 20 seats per batch — Limited enrollment</p>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">Program Fee</p>
                <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#111827]">{combinedMasterProgram.price}</p>
                <p className="mt-0.5 text-sm text-[#94A3B8] line-through">{combinedMasterProgram.originalPrice}</p>
                <p className="mt-1.5 text-sm font-semibold text-[#16A34A]">{combinedMasterProgram.priceLabel}</p>

                <div className="mt-5 space-y-2 text-sm text-[#475569]">
                  {combinedMasterProgram.features.map(({ icon: Icon, text }) => (
                    <p key={text} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#4F46E5]" />
                      {text}
                    </p>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10-4H9a2 2 0 00-2 2v0a2 2 0 002 2h6a2 2 0 002-2v0a2 2 0 00-2-2z" />
                  </svg>
                  <p className="text-[12px] font-medium leading-5 text-[#3730A3]">1-on-1 support available after every live class session</p>
                </div>

                <div className="mt-5 space-y-3">
                  <Link
                    href={combinedMasterProgram.enrollHref}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.3)] transition hover:scale-[1.02]"
                  >
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={combinedMasterProgram.syllabusHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDD6FE] bg-[linear-gradient(135deg,#F5F3FF,#EDE9FE)] px-4 py-2.5 text-sm font-semibold text-[#6D28D9] shadow-[0_10px_24px_rgba(124,58,237,0.12)] transition hover:-translate-y-0.5 hover:border-[#A78BFA] hover:bg-[linear-gradient(135deg,#EDE9FE,#DDD6FE)] hover:text-[#5B21B6]"
                  >
                    <Download className="h-4 w-4" />
                    Download Syllabus
                  </Link>
                </div>

                <p className="mt-3 text-center text-[11px] text-[#94A3B8]">No-cost EMI · Batch starts every month</p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9333EA]">Not Sure Which to Pick?</p>
          <h2 className="mt-2 text-2xl font-bold !text-[#0F172A]">Talk to our admissions team</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64748B]">
            We&apos;ll match you to the right program based on your background, goals and timeline.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-[1.02]">
              Talk to Admissions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/courses" className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold !text-[#0F172A] transition hover:border-[#C7D2FE]">
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


