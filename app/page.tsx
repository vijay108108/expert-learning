import Link from "next/link";
import {
  Award,
  BookOpenCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  GraduationCap,
  Layers,
  Quote,
  Sparkles,
  Star,
  TrendingUp,
  Users2,
  Zap,
} from "lucide-react";
import { getOrganizationSchema } from "@/lib/schema";

const stats = [
  { value: "21,000+", label: "Learning Hours Delivered", icon: BookOpenCheck },
  { value: "6,000+", label: "Learners Trained", icon: GraduationCap },
  { value: "167+", label: "Live Sessions Conducted", icon: Layers },
  { value: "96%", label: "Placement Satisfaction", icon: TrendingUp },
  { value: "48+", label: "Live Batches", icon: Users2 },
  { value: "12+", label: "Industry Certifications", icon: Award },
];

const reviews = [
  {
    name: "Rohan Mehta",
    role: "DevOps Engineer",
    company: "Infosys",
    avatar: "RM",
    rating: 5,
    text: "The DevSecOps track completely transformed how I approach CI/CD pipelines. The mentor sessions were practical and directly applicable to my day job. Got promoted within 3 months.",
  },
  {
    name: "Priya Sharma",
    role: "Cloud Architect",
    company: "TCS",
    avatar: "PS",
    rating: 5,
    text: "Cleared my AZ-104 in the first attempt thanks to GenZNext's structured roadmap and mock exams. The Azure content is the best I've seen — better than official Microsoft courses.",
  },
  {
    name: "Arjun Kapoor",
    role: "Software Engineer → Cloud Engineer",
    company: "Wipro",
    avatar: "AK",
    rating: 5,
    text: "Transitioned from a pure software background to cloud. The AWS Solutions Architect track gave me a portfolio of real projects that I could show in interviews. Landed a 40% hike.",
  },
  {
    name: "Neha Gupta",
    role: "Data Engineer",
    company: "Persistent Systems",
    avatar: "NG",
    rating: 5,
    text: "The AI & Data Engineering program is incredibly well-structured. Covered everything from ETL pipelines to LLMs. The LMS lets me revisit sessions anytime which is a game-changer.",
  },
  {
    name: "Vikram Singh",
    role: "CEO",
    company: "Stackify Solutions (Startup)",
    avatar: "VS",
    rating: 5,
    b2b: true,
    text: "We enrolled our entire engineering team in the GenZNext DevOps corporate batch. ROI was immediate — deployment frequency doubled in 60 days. Highly recommend for B2B teams.",
  },
  {
    name: "Anjali Rao",
    role: "Cloud Infrastructure Lead",
    company: "HCL Technologies",
    avatar: "AR",
    rating: 5,
    text: "I've done multiple cloud courses online, but GenZNext's live mentorship model is different. Real problems, real solutions, and a community of professionals who help each other.",
  },
  {
    name: "Deepak Joshi",
    role: "Entrepreneur",
    company: "CloudNative Labs",
    avatar: "DJ",
    rating: 5,
    b2b: true,
    text: "As a founder building cloud-native products, this program helped me understand the full stack — from infrastructure to GenAI. Worth every rupee. My technical decisions improved overnight.",
  },
  {
    name: "Sneha Patel",
    role: "Solutions Architect",
    company: "Capgemini",
    avatar: "SP",
    rating: 5,
    text: "The Generative AI & Agentic AI track was exactly what I needed to stay relevant. The curriculum is ahead of what most companies are teaching internally. Highly practical.",
  },
  {
    name: "Aakash Verma",
    role: "B.Tech Student → Intern at AWS Partner",
    company: "Amity University",
    avatar: "AV",
    rating: 5,
    text: "As a student with no prior cloud experience, GenZNext gave me the structure I needed. Within 4 months I landed a cloud internship. The projects on my resume spoke for themselves.",
  },
  {
    name: "Manish Tiwari",
    role: "Site Reliability Engineer",
    company: "Mindtree",
    avatar: "MT",
    rating: 5,
    text: "The SRE-aligned content in the DevOps track is brilliant. Kubernetes, Helm, observability — all covered end-to-end with real cluster exercises. Nothing theoretical here.",
  },
  {
    name: "Kritika Bhatt",
    role: "HR Tech Entrepreneur",
    company: "PeopleFirst Tech",
    avatar: "KB",
    rating: 5,
    b2b: true,
    text: "I'm non-technical and enrolled to understand cloud for my startup's decisions. The mentors simplified complex concepts beautifully. Now I can actually speak the same language as my engineers.",
  },
  {
    name: "Rahul Dubey",
    role: "Platform Engineer",
    company: "L&T Infotech",
    avatar: "RD",
    rating: 5,
    text: "From Terraform to Azure Policy to DevSecOps pipelines — GenZNext covered it all with depth. The weekly live sessions kept me accountable and the batch community is very active.",
  },
  {
    name: "Pooja Nair",
    role: "AI/ML Engineer",
    company: "Mphasis",
    avatar: "PN",
    rating: 5,
    text: "The Generative AI course content is up-to-date with GPT-4, Claude, LangChain and vector DBs. I've been recommending it to everyone in my team. Practical over theoretical — love it.",
  },
  {
    name: "Suresh Babu",
    role: "IT Director",
    company: "Mid-size BFSI Firm",
    avatar: "SB",
    rating: 5,
    b2b: true,
    text: "We ran a corporate GenAI workshop for 30 employees. The customization GenZNext offered for our domain-specific use cases was outstanding. Professionalism top-notch throughout.",
  },
  {
    name: "Tanvi Mishra",
    role: "Final Year Student",
    company: "IET Lucknow",
    avatar: "TM",
    rating: 5,
    text: "Got placed at a cloud startup 2 months before graduating because of the portfolio projects from GenZNext. The mentors genuinely care about your growth, not just course completion.",
  },
  {
    name: "Gaurav Chaudhary",
    role: "Cloud Operations Engineer",
    company: "Tech Mahindra",
    avatar: "GC",
    rating: 5,
    text: "Cleared AWS SAA-C03 in 6 weeks following the GenZNext roadmap. The practice question bank is excellent and the doubt-clearing sessions are priceless. Best investment of 2024.",
  },
  {
    name: "Swati Agrawal",
    role: "Product Manager → Tech PM",
    company: "Razorpay",
    avatar: "SA",
    rating: 5,
    text: "Wanted to go deep on cloud architecture to better collaborate with my engineering team. GenZNext's program gave me that technical fluency. My PMs should all do this.",
  },
  {
    name: "Nikhil Sharma",
    role: "DevOps Lead",
    company: "Nagarro",
    avatar: "NS",
    rating: 5,
    text: "The DevSecOps content is not watered down. Real-world pipelines, security scanning, container hardening — everything I use daily. My team now follows the same frameworks.",
  },
  {
    name: "Divya Srivastava",
    role: "B.Sc. IT Student",
    company: "BBDU Lucknow",
    avatar: "DS",
    rating: 5,
    text: "Summer training at GenZNext was the best decision of my academic career. Got AWS Certified Cloud Practitioner and three projects in my portfolio. Every student should do this.",
  },
  {
    name: "Aman Khanna",
    role: "Founder & CTO",
    company: "InfraEdge (SaaS)",
    avatar: "AK2",
    rating: 5,
    b2b: true,
    text: "Building infra-heavy products means I need my team sharp on cloud-native patterns. GenZNext is now our go-to upskilling partner. The corporate batches are flexible and high-quality.",
  },
  {
    name: "Reema Jain",
    role: "Data Analytics Consultant",
    company: "Deloitte",
    avatar: "RJ",
    rating: 5,
    text: "The Data Engineering track gave me skills that directly transferred to my consulting work. Clients were impressed when I started architecting proper lakehouse solutions. 10/10.",
  },
];

type Review = (typeof reviews)[number];

function ReviewCard({ review }: { review: Review }) {
  const isB2B = review.b2b === true;
  return (
    <div className="mx-2 w-[320px] shrink-0 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm transition hover:border-[#C7D2FE] hover:shadow-[0_8px_24px_rgba(79,70,229,0.1)]">
      <Quote className="h-4 w-4 text-[#C7D2FE]" />
      <p className="mt-3 line-clamp-4 text-[13px] leading-[1.65] text-[#374151]">{review.text}</p>
      <div className="mt-3 flex items-center gap-0.5">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#9333EA,#4F46E5)] text-[11px] font-bold text-white"
          style={isB2B ? { filter: "blur(4px)", userSelect: "none" } : undefined}
        >
          {review.avatar.slice(0, 2)}
        </div>
        <div>
          <p
            className="text-[13px] font-semibold text-[#0F172A]"
            style={isB2B ? { filter: "blur(5px)", userSelect: "none" } : undefined}
          >
            {review.name}
          </p>
          <p className="text-[11px] text-[#64748B]">{review.role}</p>
          <p
            className="text-[11px] font-medium text-[#4F46E5]"
            style={isB2B ? { filter: "blur(5px)", userSelect: "none" } : undefined}
          >
            {review.company}
          </p>
        </div>
      </div>
    </div>
  );
}

const tracks = [
  { icon: Cloud, label: "Cloud (AWS & Azure)", color: "text-[#2563EB]", bg: "bg-[#EFF6FF]" },
  { icon: Zap, label: "DevSecOps & SRE", color: "text-[#7C3AED]", bg: "bg-[#F5F3FF]" },
  { icon: Sparkles, label: "Generative & Agentic AI", color: "text-[#D97706]", bg: "bg-[#FFFBEB]" },
  { icon: Code2, label: "Data Engineering", color: "text-[#059669]", bg: "bg-[#ECFDF5]" },
  { icon: Briefcase, label: "Corporate Training (B2B)", color: "text-[#DC2626]", bg: "bg-[#FEF2F2]" },
  { icon: Building2, label: "Summer / Internship", color: "text-[#0891B2]", bg: "bg-[#ECFEFF]" },
];

export default function Home() {
  const schemas = [getOrganizationSchema()];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#FFFFFF_0%,#F5F0FF_45%,#E0F2FE_100%)] px-4 pb-16 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.1)_0%,transparent_65%)]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.09)_0%,transparent_65%)]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1 text-xs font-semibold tracking-wide text-[#4F46E5]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4F46E5]" />
              #1 Cloud, DevOps &amp; AI Training — India
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-5xl lg:text-[52px]">
              Master AI, Cloud &amp; DevOps —<br className="hidden sm:block" />
              <span className="bg-[linear-gradient(135deg,#9333EA,#4F46E5,#0EA5E9)] bg-clip-text text-transparent">
                {" "}Build a Career That Scales
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-7 text-[#475569]">
              Structured learning paths, live mentorship, real-world projects and LMS access for students, working professionals and enterprise teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5,#0EA5E9)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.34)]">
                Explore Courses <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:border-[#A5B4FC] hover:bg-[#F8FAFC]">
                Talk to Admissions
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-[#64748B]">
              {["AWS & Azure Certified Mentors", "Live Batches Every Month", "LMS Access for Life"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#4F46E5]" />{item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">

            {/* Summer Training Notification */}            <Link
              href="/courses/azure/az-104"
              className="group flex items-start justify-between gap-4 rounded-2xl border border-[#BFDBFE] bg-[linear-gradient(135deg,#F8FBFF_0%,#F2F8FF_42%,#EEF4FF_100%)] p-4 shadow-[0_8px_22px_rgba(37,99,235,0.10)] transition hover:shadow-[0_14px_30px_rgba(37,99,235,0.16)]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-2 gap-[2px] rounded-[6px] bg-white p-1 shadow-sm">
                      <span className="h-3 w-3 bg-[#F25022]" />
                      <span className="h-3 w-3 bg-[#7FBA00]" />
                      <span className="h-3 w-3 bg-[#00A4EF]" />
                      <span className="h-3 w-3 bg-[#FFB900]" />
                    </div>
                    <div className="leading-none">
                      <p className="text-[11px] font-semibold text-[#5B5B5B]">Microsoft</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[#0078D4]">Azure</p>
                    </div>
                  </div>
                  <span className="inline-flex animate-pulse items-center rounded-full bg-[#E11D48] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
                    Live
                  </span>
                </div>
                <p className="mt-2 text-[12px] font-medium leading-snug text-[#64748B]">
                  Microsoft Certified: Azure Administrator Associate AZ-104
                </p>
                <p className="mt-1 text-[11.5px] text-[#5B6B84]">
                  Identity · Compute · Networking · Storage · Monitoring · 8 Weeks
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="font-bold text-[#DC2626]">Batch: 15 July 2026</span>
                  <span className="text-[#94A3B8]">·</span>
                  <span className="font-semibold text-[#16A34A]">
                    ₹23,600 <span className="font-normal text-[#94A3B8] line-through">₹30,000</span>
                  </span>
                  <span className="rounded-full bg-[#FFE4E6] px-2 py-0.5 font-bold text-[#E11D48]">33% off</span>
                </div>
              </div>
              <span className="mt-0.5 shrink-0 rounded-xl bg-[linear-gradient(135deg,#0078D4,#2563EB)] px-3 py-2 text-[11px] font-bold text-white transition group-hover:brightness-95">
                Register →
              </span>
            </Link>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.07)] backdrop-blur">
              <p className="text-sm font-semibold text-[#2563EB]">What you get with every program</p>
              <div className="mt-4 space-y-2.5">
                {[
                  "Structured roadmap with mentor checkpoints",
                  "Official Microsoft Learn, AWS & Azure references",
                  "Projects, assignments, notes & certification prep",
                  "LMS-based learning continuity after enrollment",
                  "Career guidance & mock interview sessions",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-lg border border-[#EEF2FF] bg-[#F8FAFC] p-2.5 text-[13px] text-[#475569]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-[#0F172A]">6,000+</p>
                <p className="text-[11px] text-[#64748B]">Learners Trained</p>
              </div>
              <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-3 text-center shadow-sm">
                <div className="flex items-center justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />)}
                </div>
                <p className="mt-0.5 text-[11px] text-[#64748B]">4.9 / 5 Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#1E1040] bg-[linear-gradient(135deg,#1A0535_0%,#0F172A_50%,#0C1A2E_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <stat.icon className="h-5 w-5 text-[#C084FC]" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[11px] leading-4 text-[#94A3B8]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Programs</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">6 High-Demand Learning Tracks</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#64748B]">
              From students entering the industry to enterprises upskilling teams — we have a track for every ambition.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <Link key={track.label} href="/courses" className="group flex items-center gap-4 rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C7D2FE] hover:shadow-[0_12px_24px_rgba(79,70,229,0.1)]">
                <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${track.bg}`}>
                  <track.icon className={`h-5 w-5 ${track.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{track.label}</p>
                  <p className="mt-0.5 text-[12px] text-[#64748B] group-hover:text-[#4F46E5]">View curriculum →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why GenZNext */}
      <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Why Us</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Built for Real Careers, Not Just Certificates</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Industry-ready curriculum", icon: BookOpenCheck, desc: "Role-aligned tracks for modern cloud, DevOps, and AI careers. Updated every quarter." },
              { title: "Live mentorship", icon: Users2, desc: "Weekly mentor guidance with practical implementation on real infrastructure." },
              { title: "Certification support", icon: Award, desc: "Exam-focused prep with official resource mapping for AWS, Azure & Google Cloud." },
              { title: "Portfolio projects", icon: Sparkles, desc: "Enterprise-grade projects that get you noticed in interviews and LinkedIn." },
            ].map((item) => (
              <article key={item.title} className="rounded-[18px] border border-[#E2E8F0] bg-white p-7 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF]">
                  <item.icon className="h-5 w-5 text-[#4F46E5]" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Student Reviews (floating marquee) */}
      <section className="overflow-hidden bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Student Reviews</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Loved by 6,000+ Learners Across India</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#64748B]">
              Students, working professionals, entrepreneurs and enterprise teams share their GenZNext experience.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />)}
              </div>
              <span className="text-sm font-semibold text-[#0F172A]">4.9 / 5</span>
              <span className="text-sm text-[#64748B]">from 500+ verified reviews</span>
            </div>
          </div>
        </div>

        <div className="relative mt-12 space-y-4">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(to_right,white,transparent)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(to_left,white,transparent)]" />

          {/* Row 1 — scrolls left */}
          <div className="overflow-hidden">
            <div className="marquee-track marquee-left">
              {[...reviews.slice(0, 11), ...reviews.slice(0, 11)].map((review, i) => (
                <ReviewCard key={`r1-${i}`} review={review} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="overflow-hidden">
            <div className="marquee-track marquee-right">
              {[...reviews.slice(10), ...reviews.slice(10)].map((review, i) => (
                <ReviewCard key={`r2-${i}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Who It&apos;s For</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Learning Designed For You</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Students & Freshers",
                color: "text-[#4F46E5]",
                bg: "bg-[#EEF2FF]",
                desc: "Build a cloud or AI career from scratch. Land your first job with real projects and certification-backed skills that employers actually look for.",
                cta: "Start Learning",
                href: "/courses",
              },
              {
                icon: Briefcase,
                title: "Working Professionals",
                color: "text-[#059669]",
                bg: "bg-[#ECFDF5]",
                desc: "Upskill, switch roles, or get promoted. Our flex learning model fits around your job. Clear AWS, Azure or DevOps certifications in 6–8 weeks.",
                cta: "Explore Tracks",
                href: "/programs",
              },
              {
                icon: Building2,
                title: "Enterprises & B2B",
                color: "text-[#D97706]",
                bg: "bg-[#FFFBEB]",
                desc: "Upskill your entire engineering, DevOps or cloud team with custom corporate batches. Measurable ROI with tailored curriculum and reporting.",
                cta: "Get a Quote",
                href: "/corporate-training",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[22px] border border-[#E2E8F0] bg-white p-7 shadow-sm">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#0F172A]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{item.desc}</p>
                <Link href={item.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#4F46E5] hover:underline">
                  {item.cta} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#3B0764_0%,#4F46E5_50%,#0369A1_100%)] px-8 py-14 text-center shadow-[0_24px_60px_rgba(147,51,234,0.35)] sm:px-14">
          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C084FC]">Start Today</p>

          {/* Heading forced white */}
          <h2 className="mt-4 text-[30px] font-extrabold leading-tight tracking-tight !text-white sm:text-[42px]">
            Join <span className="text-[#6EE7B7]">6,000+</span> learners<br className="hidden sm:block" /> building cloud careers
          </h2>

          {/* Subtitle high contrast white */}
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 !text-white/80">
            Pick your specialization and start with structured mentorship, real projects,
            and certification-focused learning — all in one platform.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/programs"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#4F46E5] shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(255,255,255,0.28)]">
              Explore Programs <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/20">
              Talk to Admissions
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/70">
            {["No-cost EMI options", "Live batches every month", "Placement assistance"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#6EE7B7]" />{item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

