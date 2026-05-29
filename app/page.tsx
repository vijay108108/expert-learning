import Link from "next/link";
import { Award, BookOpenCheck, CheckCircle2, Sparkles, Users2 } from "lucide-react";
import { SummerTrainingPopup } from "@/components/home/summer-training-popup";
import { getOrganizationSchema } from "@/lib/schema";

export default function Home() {
  const schemas = [getOrganizationSchema()];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SummerTrainingPopup />

      <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-4 py-16 text-[#0F172A] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#64748B]">
              GenZNext Research &amp; Training
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Master AI, Generative AI, Agentic AI, DevSecOps, AWS &amp; Azure Certifications
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[#475569]">
              Guided learning paths, mentor support, curated official resources, and LMS access to help you become industry-ready.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/courses" className="rounded-lg bg-[linear-gradient(135deg,#4F46E5,#2563EB)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.34)]">
                Explore Courses
              </Link>
              <Link href="/contact" className="rounded-lg border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Get Started
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold text-[#2563EB]">What you get</p>
            <div className="mt-4 space-y-3">
              {[
                "Structured roadmap with mentor checkpoints",
                "Official Microsoft Learn, AWS and Azure references",
                "Projects, assignments, notes and certification prep",
                "LMS-based learning continuity after enrollment",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3 text-sm text-[#475569]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#2563EB]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "1500+", label: "Learners" },
            { value: "40+", label: "Live Batches" },
            { value: "10+", label: "Industry Projects" },
            { value: "AWS + Azure + AI", label: "Tracks" },
          ].map((item) => (
            <div key={item.label} className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <p className="text-lg font-bold text-[#0F172A]">{item.value}</p>
              <p className="text-xs text-[#64748B]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-[#0F172A]">Why GenZNext</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Industry-ready curriculum", icon: BookOpenCheck, desc: "Role-aligned tracks for modern cloud and AI careers." },
              { title: "Live mentorship", icon: Users2, desc: "Weekly mentor guidance with practical implementation support." },
              { title: "Certification support", icon: Award, desc: "Exam-focused preparation with official resource mapping." },
              { title: "Real-world projects", icon: Sparkles, desc: "Portfolio-ready projects aligned to enterprise workflows." },
            ].map((item) => (
              <article key={item.title} className="rounded-[18px] border border-[#E2E8F0] bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <item.icon className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="mt-4 text-base font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#475569]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] px-6 py-10 text-center sm:px-10">
          <h2 className="text-3xl font-semibold text-[#0F172A]">Ready to become industry-ready in AI &amp; Cloud?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#475569]">
            Pick your specialization and start with structured mentorship, projects, and certification-focused learning.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/programs" className="rounded-xl bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition hover:scale-[1.02]">
              Explore Programs
            </Link>
            <Link href="/contact" className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#EEF2FF]">
              Talk to Admissions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
