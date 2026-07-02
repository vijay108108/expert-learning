import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Clock3, FolderKanban, GraduationCap } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { TechStackGrid } from "@/components/ui/tech-logo";

type Program = {
  title: string;
  href: string;
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
    price: "₹30,000",
    originalPrice: "",
    highlights: [
      "Build observability workflows across Azure Monitor, Log Analytics, and dashboards",
      "Practice incident triage, runbook automation, and service reliability response",
      "Industry-focused for SRE, platform operations, and cloud support teams",
    ],
    outcomes: ["AIOps Portfolio", "Incident Automation", "Reliability Ops"],
  },
];

export const metadata = buildMetadata({
  title: "Career Programs | GenZNext Research & Training",
  description: "Cloud, AI, DevOps & AI Tools programs with real tool logos, certifications, live mentorship and placement support.",
  path: "/programs",
});

function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={program.href}
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
        <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#4F46E5]">
          {program.tagline}
        </p>

        <h2 className="mt-2 text-[15px] font-extrabold leading-snug !text-[#0F172A]">
          {program.title}
        </h2>

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
            <span className="inline-flex items-center gap-1.5 rounded-[12px] bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_6px_16px_rgba(79,70,229,0.22)] transition group-hover:scale-[1.02] group-hover:shadow-[0_12px_28px_rgba(79,70,229,0.32)]">
              Enroll Now <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
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
