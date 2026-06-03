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
    title: "Practical AI Tools Master Program",
    href: "/programs/ai-tools-master",
    slug: "ai-tools-master",
    badge: "AI Tools Mastery",
    badgeColor: "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
    stripColor: "from-[#9333EA] via-[#4F46E5] to-[#0EA5E9]",
    hot: true,
    tagline: "25+ AI Tools · 8 Weeks · No Coding · No Tech Background Needed",
    description: "Master ChatGPT, Claude, Gemini, Midjourney, GitHub Copilot, ElevenLabs, Runway and 18+ more. Zero coding. Zero technical background. Anyone can join.",
    duration: "8 Weeks",
    level: "🟢 Zero Technical Background Required",
    projects: "12+ Real Use-Case Projects",
    certification: "AI Tools Mastery Certificate",
    price: "Rs. 9,999",
    originalPrice: "Rs. 59,000",
    highlights: [
      "🚫 No Coding Required — ever",
      "🚫 No Technical Background Needed",
      "✅ Works for students, professionals, business owners",
    ],
    outcomes: ["10× Productivity", "Freelance ₹2–8L/yr", "Roles ₹5–15L"],
  },
  {
    title: "Microsoft Cloud & AI DevOps Master",
    href: "/programs/microsoft-cloud-ai-devops-master",
    slug: "microsoft-cloud-ai-devops-master",
    badge: "Azure + DevOps + AI",
    badgeColor: "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]",
    stripColor: "from-[#0078D4] via-[#4F46E5] to-[#9333EA]",
    hot: true,
    tagline: "AZ-104 → AZ-400 → AI DevSecOps — 24 Weeks",
    description: "Azure Administration → Azure DevOps Engineering → AI-Powered DevSecOps with Kubernetes, Terraform, GitHub Copilot & Microsoft Sentinel.",
    duration: "24 Weeks",
    level: "Beginner to Advanced",
    projects: "15+ Real-World Projects",
    certification: "AZ-104 + AZ-400 + AI DevSecOps",
    price: "Rs. 34,999",
    originalPrice: "Rs. 66,999",
    highlights: [
      "3-phase path: Cloud Admin → DevOps → AI Security",
      "AKS, Terraform, GitHub Copilot & Sentinel included",
      "Mock interviews, LMS for life, placement support",
    ],
    outcomes: ["₹4–7L Entry", "₹8–16L Mid", "₹18–35L Senior"],
  },
  {
    title: "Master AI & Generative AI Program",
    href: "/programs/ai-generative-ai-master",
    slug: "ai-generative-ai-master",
    badge: "AI & GenAI Engineering",
    badgeColor: "border-[#C7D2FE] bg-[#EEF2FF] text-[#4338CA]",
    stripColor: "from-[#10A37F] via-[#4F46E5] to-[#9333EA]",
    tagline: "Python → LLMs → RAG → AI Agents — 20 Weeks",
    description: "Build production AI applications: RAG pipelines, AI agents, LLM APIs, vector databases and cloud deployment — GPT-5.5, Claude Opus 4.8 & latest models.",
    duration: "20 Weeks",
    level: "Beginner to Advanced",
    projects: "12+ Real-World AI Projects",
    certification: "AI Engineer Career Track",
    price: "Rs. 24,999",
    originalPrice: "Rs. 85,000",
    highlights: [
      "Latest models: GPT-5.5, Claude Opus 4.8, Gemini 3 Pro",
      "Production RAG + multi-agent AI system projects",
      "AI portfolio on GitHub + mock interview prep",
    ],
    outcomes: ["₹4–8L Entry", "₹10–18L Mid", "₹20–40L Senior"],
  },
  {
    title: "AWS Cloud Master Program",
    href: "/programs/aws-cloud-master",
    slug: "aws-cloud-master",
    badge: "AWS Cloud Track",
    badgeColor: "border-[#FEF08A] bg-[#FEFCE8] text-[#854D0E]",
    stripColor: "from-[#FF9900] via-[#FF6600] to-[#FF9900]",
    tagline: "CLF → SAA → DVA → SOA — All 4 AWS Certs",
    description: "All 4 associate AWS certifications in one 20-week program: Cloud Practitioner, Solutions Architect, Developer Associate and SysOps Administrator.",
    duration: "20 Weeks",
    level: "Beginner to Advanced",
    projects: "12+ Real-World AWS Projects",
    certification: "CLF-C02 + SAA-C03 + DVA-C02 + SOA-C03",
    price: "Rs. 21,999",
    originalPrice: "Rs. 55,674",
    highlights: [
      "4 AWS certifications in a single 5-month program",
      "EC2, VPC, Lambda, RDS, EKS, S3 hands-on labs",
      "Real-world architecture projects + mock exams",
    ],
    outcomes: ["₹4–7L Entry", "₹8–15L Mid", "₹16–30L Senior"],
  },
  {
    title: "Microsoft Cloud Master Program",
    href: "/programs/microsoft-cloud-master",
    slug: "microsoft-cloud-master",
    badge: "Microsoft Azure Track",
    badgeColor: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1E40AF]",
    stripColor: "from-[#0078D4] via-[#3B82F6] to-[#0078D4]",
    tagline: "AZ-900 → AZ-104 → AZ-204 → AZ-305",
    description: "Complete Microsoft Azure path: Fundamentals, Administrator, Developer (→ AI-200) and Solutions Architect Expert — four certifications in 20 weeks.",
    duration: "20 Weeks",
    level: "Beginner to Advanced",
    projects: "10+ Real-World Azure Projects",
    certification: "AZ-900 + AZ-104 + AZ-204/AI-200 + AZ-305",
    price: "Rs. 21,999",
    originalPrice: "Rs. 49,999",
    highlights: [
      "4 Microsoft certs — AZ-204 retiring Jul 2026, updated to AI-200",
      "Entra ID, AKS, Key Vault, Sentinel real labs",
      "Architecture case studies + placement support",
    ],
    outcomes: ["₹4–7L Entry", "₹8–15L Mid", "₹16–30L Senior"],
  },
  {
    title: "DevOps Master Program",
    href: "/programs/devops-master",
    slug: "devops-master",
    badge: "DevOps & SRE Track",
    badgeColor: "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]",
    stripColor: "from-[#F05032] via-[#326CE5] to-[#E6522C]",
    tagline: "Linux → Docker → K8s → CI/CD → Terraform → SRE",
    description: "Full DevOps engineering stack: Linux, Docker v29, Kubernetes 1.36, Jenkins, GitHub Actions, Terraform / OpenTofu, Prometheus & SRE practices.",
    duration: "20 Weeks",
    level: "Beginner to Advanced",
    projects: "15+ Real-World Projects",
    certification: "CKA + Terraform + AZ-400 Prep",
    price: "Rs. 24,999",
    originalPrice: "Rs. 66,302",
    highlights: [
      "Latest versions: K8s 1.36, Docker v29, OpenTofu 1.12",
      "Argo CD GitOps, Prometheus + Grafana + Loki stack",
      "15 production-grade GitHub portfolio projects",
    ],
    outcomes: ["₹4–7L Entry", "₹8–16L Mid", "₹18–35L Senior"],
  },
];

export const metadata = buildMetadata({
  title: "Career Programs | GenZNext Research & Training",
  description: "Cloud, AI, DevOps & AI Tools programs with real tool logos, certifications, live mentorship and placement support.",
  path: "/programs",
});

/* ── Program card ────────────────────────────────────────── */
function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={program.href}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border bg-white shadow-[0_6px_20px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.13)] ${
        program.hot ? "border-[#DDD6FE]" : "border-[#E2E8F0]"
      }`}
    >
      {/* Hot badge */}
      {program.hot && (
        <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-xl border border-t-0 border-[#FED7AA] bg-[#FFF7ED] px-3 py-0.5 text-[10px] font-bold text-[#C2410C]">
          🔥 Most In-Demand
        </span>
      )}

      {/* Top gradient strip — unique per program */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${program.stripColor}`} />

      <div className="flex flex-1 flex-col p-5 pt-6">

        {/* Badge + tagline */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${program.badgeColor}`}>
            {program.badge}
          </span>
        </div>
        <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#4F46E5]">
          {program.tagline}
        </p>

        {/* Title */}
        <h2 className="mt-2 text-[15px] font-extrabold leading-snug !text-[#0F172A]">
          {program.title}
        </h2>

        {/* Description */}
        <p className="mt-1.5 text-[12px] leading-[1.6] text-[#64748B]">
          {program.description}
        </p>

        {/* ── Tech Stack Logos ── */}
        <div className="mt-4">
          <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#9333EA]">
            Tools & Technologies
          </p>
          <TechStackGrid slug={program.slug} max={14} />
        </div>

        {/* Highlights */}
        <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <ul className="space-y-1.5">
            {program.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[11.5px] font-medium !text-[#334155]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />{h}
              </li>
            ))}
          </ul>
        </div>

        {/* Career outcomes */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {program.outcomes.map((o) => (
            <span key={o} className="rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[10px] font-bold !text-[#166534]">
              {o}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        {/* Meta + Price + CTA */}
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
              View <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ProgramsPage() {
  return (
    <main className="bg-white">

      {/* ── Header ── */}
      <section className="bg-[linear-gradient(160deg,#FFFFFF_0%,#F5F0FF_50%,#E0F2FE_100%)] px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <span className="inline-flex items-center rounded-full border border-[#DDD6FE] bg-[#F5F0FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7C3AED]">
            GenZNext Career Tracks
          </span>
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em] !text-[#0F172A] sm:text-[42px]">
            Career Programs
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#64748B]">
            Industry-ready Cloud, AI, DevOps &amp; AI Tools programs — with the actual tools
            employers use, live mentorship and placement support.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#475569]">
            {[
              { icon: GraduationCap, label: "6 Programs" },
              { icon: Clock3,        label: "8–24 Week Tracks" },
              { icon: FolderKanban,  label: "12–15 Projects Each" },
              { icon: Award,         label: "Certification Prep Included" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-[#4F46E5]" />{label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards grid ── */}
      <section className="border-t border-[#E2E8F0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[24px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9333EA]">Not Sure Which to Pick?</p>
          <h2 className="mt-2 text-2xl font-bold !text-[#0F172A]">Talk to our admissions team</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64748B]">
            We'll match you to the right program based on your background, goals and timeline.
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
