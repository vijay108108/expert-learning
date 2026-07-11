import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Layers3 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const trackChips = ["AI", "GenAI", "Agentic AI", "DevSecOps", "AWS", "Azure"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent_35%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[length:56px_56px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_18%,rgba(79,70,229,0.1),transparent_44%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <Reveal>
          <div className="rounded-2xl bg-[rgba(255,255,255,0.58)] p-1 backdrop-blur-[2px]">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
              <span className="h-2 w-2 rounded-full bg-[#0B2E6B]" />
              GenZNext Research & Training
            </p>
            <h1 className="mt-5 max-w-[18ch] text-[36px] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0F172A] sm:text-5xl lg:text-[64px]">
              Master AI, Generative AI, Agentic AI, DevSecOps, AWS & Azure Certifications
            </h1>
            <p className="mt-4 max-w-[650px] text-[15px] leading-[1.8] text-[#475569] sm:text-[18px]">
              Build job-ready skills through mentor-led programs, certification-focused learning paths, prerecorded lessons, and official cloud learning resources.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {trackChips.map((chip) => (
                <span key={chip} className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <ButtonLink
                href="/courses"
                className="min-h-12 w-full rounded-xl bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition duration-200 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.36)] sm:w-auto"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/lms"
                variant="navGhost"
                className="min-h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] sm:w-auto"
              >
                Open LMS Portal
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-[rgba(226,232,240,0.9)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[12px] sm:p-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-5">
              <h2 className="text-lg font-semibold text-[#0F172A]">Learning Experience Stack</h2>
              <div className="mt-4 space-y-3">
                {[
                  { icon: GraduationCap, label: "Certification Tracks", tone: "text-[#0B2E6B]" },
                  { icon: Layers3, label: "LMS Portal", tone: "text-[#15407E]" },
                  { icon: BookOpen, label: "YouTube Lessons", tone: "text-[#E56F12]" },
                  { icon: CheckCircle2, label: "Official Microsoft/AWS Resources", tone: "text-[#16A34A]" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 transition duration-200 hover:bg-[#F8FAFC] hover:shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                    <item.icon className={`h-4 w-4 ${item.tone}`} />
                    <span className="text-sm text-[#475569]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
