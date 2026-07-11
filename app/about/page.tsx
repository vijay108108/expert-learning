import Link from "next/link";
import {
  Award,
  BookOpenCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Users2,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About Us | GenZNext Research & Training",
  description:
    "GenZNext Research & Training — founded by an IIT Jodhpur alumna and enterprise practitioners with 8+ years in Cloud, AI and modern platform engineering. Building industry-ready careers for students and professionals across India.",
  path: "/about",
});

const stats = [
  { value: 6000, suffix: "+", label: "Learners Trained" },
  { value: 48,   suffix: "+", label: "Live Batches Delivered" },
  { value: 8,    suffix: "+", label: "Years of Experience" },
  { value: 4.9,  suffix: "/5", label: "Average Learner Rating" },
];

const founders = [
  {
    name: "Preeti Vishwakarma",
    role: "Co-Founder & Academic Director",
    qualification: "M.Tech — IIT Jodhpur",
    badge: "IIT Jodhpur Alumni",
    badgeColor: "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]",
    avatar: "PV",
    avatarGrad: "from-[#F58220] to-[#0B2E6B]",
    about:
      "Preeti brings deep academic rigour to GenZNext's curriculum design. With a Master's degree from IIT Jodhpur — one of India's premier IITs — she has spent 8+ years bridging the gap between academic knowledge and industry requirements in Cloud, AI and data technologies.",
    highlights: [
      "M.Tech from IIT Jodhpur in AI & Data Engineering",
      "8+ years in tech education and curriculum design",
      "Specialisation in AI, Cloud Architecture & Data Engineering",
      "Mentored 3,000+ learners across enterprise and student cohorts",
    ],
    quote: "Real learning happens when you build something that works — not when you just read about it.",
  },
  {
    name: "Vijay Vishwakarma",
    role: "Founder & CEO",
    qualification: "B.Tech — KIT Varanasi",
    badge: "Founder, NetSeems Ventures",
    badgeColor: "bg-[#EEF4FB] text-[#1D4ED8] border-[#C8D7EE]",
    avatar: "VV",
    avatarGrad: "from-[#1E5AA8] to-[#0B2E6B]",
    about:
      "Vijay founded NetSeems Ventures Pvt. Ltd. — the parent company behind GenZNext — after 8+ years working across enterprise cloud infrastructure, DevOps automation and platform engineering. His vision was simple: give every ambitious student and professional in India access to the same quality of technical education that MNC professionals get.",
    highlights: [
      "B.Tech from KIT Varanasi",
      "Founder of NetSeems Ventures Pvt. Ltd.",
      "8+ years in Cloud, DevOps & Enterprise Platform Engineering",
      "Built and scaled GenZNext to 6,000+ learners across India",
    ],
    quote: "We don't teach to pass exams. We teach to get hired, promoted, and to build things that matter.",
  },
];

const values = [
  {
    icon: BookOpenCheck,
    title: "Industry-First Curriculum",
    desc: "Every module is designed around what employers are actually hiring for — not what textbooks say. Updated every quarter to reflect the latest tools, certifications and job market shifts.",
    color: "text-[#F58220]",
    bg: "bg-[#FFF3E8]",
  },
  {
    icon: Users2,
    title: "Live Mentorship",
    desc: "Weekly live sessions with practising cloud architects, DevOps engineers and AI practitioners. Not recorded lectures — real-time guidance on real problems.",
    color: "text-[#1E5AA8]",
    bg: "bg-[#E0F2FE]",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    desc: "Resume reviews, mock interviews, LinkedIn optimisation and placement referrals. We measure our success by your job offers, salary hikes and promotions.",
    color: "text-[#16A34A]",
    bg: "bg-[#F0FDF4]",
  },
  {
    icon: Award,
    title: "Certification Support",
    desc: "Structured exam prep for AWS, Azure, Kubernetes and AI certifications — with practice tests, study guides and mentor Q&A sessions before every exam attempt.",
    color: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
  },
];

const milestones = [
  { year: "2018", event: "Vijay Vishwakarma begins career in enterprise cloud & DevOps infrastructure" },
  { year: "2018-2019", event: "Preeti Vishwakarma completes B.Tech, pursues M.Tech at IIT Jodhpur, and contributes to enterprise AI research" },
  { year: "2020", event: "NetSeems Ventures Pvt. Ltd. incorporated in Pune, Maharashtra" },
  { year: "2021", event: "GenZNext brand launched — first batch of 40 Azure and AWS learners" },
  { year: "2022", event: "Expanded to DevOps, AI & GenAI tracks; 500+ learners trained" },
  { year: "2023", event: "Corporate training division launched; partnered with 15+ companies" },
  { year: "2024", event: "2,000+ learners milestone; LMS portal and full program suite launched" },
  { year: "2025", event: "AI Tools & Generative AI programs launched; 4,000+ learners" },
  { year: "2026", event: "6,000+ learners trained across India; multiple flagship career programs and guided tracks" },
];

export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="bg-[linear-gradient(160deg,#FFFFFF_0%,#FFF3E8_50%,#E0F2FE_100%)] px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#E8DCCF] bg-[#FFF3E8] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#E56F12]">
            About GenZNext Research &amp; Training
          </span>
          <h1 className="mt-5 text-[34px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0F172A] sm:text-[46px]">
            Built by Engineers,<br className="hidden sm:block" />
            <span className="bg-[linear-gradient(135deg,#F58220,#0B2E6B,#1E5AA8)] bg-clip-text text-transparent">
              {" "}For the Next Generation
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-7 text-[#475569]">
            GenZNext was founded by an IIT Jodhpur alumna and industry practitioners with 8+ years of enterprise experience — on a mission to give every ambitious learner in India access to world-class Cloud, AI and DevOps education.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/courses" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(147,51,234,0.28)] transition hover:scale-[1.02]">
              Explore Courses
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#F58220]/30">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1E1040] bg-[linear-gradient(135deg,#1A0535_0%,#0F172A_50%,#0C1A2E_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[34px] font-extrabold tracking-tight text-white">
                {s.value.toLocaleString("en-IN")}{s.suffix}
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#94A3B8]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founders */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F58220]">Leadership</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">Meet the Founders</h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-7 text-[#475569]">
              GenZNext is built by people who&apos;ve worked in real delivery environments. Every course, lab and mentor session reflects practical enterprise experience.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {founders.map((f) => (
              <Reveal key={f.name}>
                <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.07)]">
                  {/* Top gradient band */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${f.avatarGrad}`} />

                  <div className="p-7">
                    {/* Header row */}
                    <div className="flex items-start gap-4">
                      <div className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${f.avatarGrad} text-[18px] font-extrabold text-white`}>
                        {f.avatar}
                      </div>
                      <div>
                        <h3 className="text-[20px] font-bold text-[#0F172A]">{f.name}</h3>
                        <p className="text-[13px] font-semibold text-[#0B2E6B]">{f.role}</p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${f.badgeColor}`}>
                            🎓 {f.badge}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-medium text-[#475569]">
                            {f.qualification}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="mt-5 text-[14px] leading-6 text-[#475569]">{f.about}</p>

                    {/* Highlights */}
                    <ul className="mt-5 space-y-2">
                      {f.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-[13px] text-[#374151]">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F58220]" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Quote */}
                    <blockquote className="mt-5 rounded-xl border-l-4 border-[#F58220] bg-[#FFF3E8] py-3 pl-4 pr-3">
                      <p className="text-[13px] italic leading-6 text-[#C65A0D]">&quot;{f.quote}&quot;</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#F58220]">— {f.name}</p>
                    </blockquote>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#F58220]">Our Story</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">Why We Built GenZNext</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#475569]">
                After years working in enterprise cloud and AI environments, our founders noticed a persistent gap — talented students and professionals who had the drive to build careers in tech, but lacked access to the kind of practical, mentored, project-based learning that actually gets people hired.
              </p>
              <p className="mt-4 text-[15px] leading-7 text-[#475569]">
                Generic YouTube courses and overpriced bootcamps weren&apos;t solving it. So in 2021, under <strong className="text-[#0F172A]">NetSeems Ventures Pvt. Ltd.</strong>, we launched GenZNext — combining Preeti&apos;s IIT-grade curriculum design with Vijay&apos;s 8+ years of enterprise engineering experience into a single, cohesive platform.
              </p>
              <p className="mt-4 text-[15px] leading-7 text-[#475569]">
                Today, 6,000+ learners across India trust GenZNext for their cloud and AI careers — from fresh graduates landing their first job to senior professionals earning 40–60% salary hikes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5">
                  <Building2 className="h-4 w-4 text-[#F58220]" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">NetSeems Ventures Pvt. Ltd.</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5">
                  <MapPin className="h-4 w-4 text-[#F58220]" />
                  <span className="text-[13px] text-[#475569]">Pune, Maharashtra</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5">
                  <Briefcase className="h-4 w-4 text-[#F58220]" />
                  <span className="text-[13px] text-[#475569]">Est. 2021</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Journey</p>
              <div className="relative space-y-0">
                {milestones.map((m, i) => (
                  <div key={`${m.year}-${i}`} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        i === milestones.length - 1
                          ? "bg-[linear-gradient(135deg,#F58220,#0B2E6B)] text-white"
                          : "border border-[#E2E8F0] bg-white text-[#475569]"
                      }`}>
                        {m.year.slice(2)}
                      </div>
                      {i < milestones.length - 1 && (
                        <div className="mt-0.5 h-full w-px bg-[#E2E8F0]" style={{ minHeight: "28px" }} />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="text-[11px] font-bold text-[#F58220]">{m.year}</p>
                      <p className="mt-0.5 text-[13px] leading-5 text-[#374151]">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F58220]">What Sets Us Apart</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">The GenZNext Difference</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${v.bg}`}>
                  <v.icon className={`h-5 w-5 ${v.color}`} />
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-[#0F172A]">{v.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#3B0764_0%,#0B2E6B_50%,#0369A1_100%)] px-8 py-12 text-center shadow-[0_24px_60px_rgba(147,51,234,0.3)]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C084FC]">Join the Community</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white">
            Learn from those who&apos;ve done it
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-[#C8D7EE]">
            Get mentored by IIT alumni and enterprise practitioners. Join 6,000+ learners already building the next generation of cloud careers.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/programs" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0B2E6B] transition hover:scale-[1.02]">
              Explore Programs
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18">
              Talk to Admissions
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

