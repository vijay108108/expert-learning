import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Cloud,
  DatabaseZap,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal } from "@/components/ui/reveal";
import { companyLogos, heroStats, trustHighlights } from "@/data/site";

export function HeroSection() {
  return (
    <section className="section-shell relative overflow-hidden px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-14 lg:px-8 lg:pt-14">
      <div className="hero-glow left-[-8rem] top-20 h-64 w-64 bg-brand-blue/20" />
      <div className="hero-glow right-[-8rem] top-8 h-72 w-72 bg-brand-cyan/20" />
      <div className="hero-glow left-[42%] bottom-16 h-80 w-80 bg-brand-purple/14" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10">
        <Reveal>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/18 bg-orange-50 px-4 py-2 text-sm font-medium text-brand-primary shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              Trusted cloud and AI career accelerator
            </div>
            <h1 className="mt-6 max-w-3xl text-[2.45rem] font-semibold tracking-tight text-balance text-foreground sm:text-[3.7rem] sm:leading-[1.04]">
              Master AWS, Azure & AI Skills with Industry Experts
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:mt-6 sm:text-xl sm:leading-8">
              Get hands-on cloud and AI training programs designed for real-world careers and certifications.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {["AWS", "Azure", "AI", "DevOps"].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-[0_12px_28px_rgba(11,31,58,0.05)]"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/courses">
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Book Free Demo
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-border bg-white px-5 py-4 shadow-[0_18px_40px_rgba(11,31,58,0.06)]">
                <div className="text-2xl font-semibold text-foreground">10K+</div>
                <div className="mt-1 text-sm text-muted">learners transformed</div>
              </div>
              <div className="rounded-[24px] border border-border bg-white px-5 py-4 shadow-[0_18px_40px_rgba(11,31,58,0.06)]">
                <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                  4.8
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="mt-1 text-sm text-muted">average learner rating</div>
              </div>
              <div className="rounded-[24px] border border-border bg-white px-5 py-4 shadow-[0_18px_40px_rgba(11,31,58,0.06)]">
                <div className="text-2xl font-semibold text-foreground">Placement</div>
                <div className="mt-1 text-sm text-muted">support with interview prep</div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {trustHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm text-muted shadow-[0_12px_30px_rgba(11,31,58,0.04)]"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[26px] border border-border bg-white px-5 py-4 shadow-[0_18px_44px_rgba(11,31,58,0.06)]">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                Hiring partners and aspirational employers
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                {companyLogos.slice(0, 6).map((company) => (
                  <div
                    key={company}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative">
            <div className="absolute -left-6 top-14 hidden rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_20px_50px_rgba(11,31,58,0.12)] lg:block">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 rounded-2xl bg-emerald-500/10 p-2 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold text-foreground">Placement support</div>
                  <div className="text-xs text-muted">Career coaching with interview prep</div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-2 hidden rounded-[24px] border border-white/80 bg-white p-4 shadow-[0_20px_50px_rgba(11,31,58,0.12)] lg:block float-delayed">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-10 w-10 rounded-2xl bg-brand-cyan/10 p-2 text-brand-cyan" />
                <div>
                  <div className="text-sm font-semibold text-foreground">Certification focus</div>
                  <div className="text-xs text-muted">Exam-aligned roadmaps and labs</div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white p-4 shadow-[0_30px_80px_rgba(11,31,58,0.12)] sm:rounded-[38px] sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.10),transparent_24%)]" />
              <div className="hero-mesh relative rounded-[26px] p-5 text-white shadow-[0_32px_90px_rgba(11,31,58,0.34)] sm:rounded-[30px] sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-blue-100">Expert Learning Studio</div>
                    <div className="mt-2 text-2xl font-semibold">Enterprise-ready training dashboard</div>
                  </div>
                  <div className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-xs text-blue-100">
                    Cohort admissions open
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["AWS", "Azure", "GenAI", "DevOps"].map((badge) => (
                    <div
                      key={badge}
                      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[24px] border border-white/12 bg-white/7 p-5 float-slow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-100">Cloud lab completion</span>
                      <span className="text-sm font-semibold text-orange-300">84%</span>
                    </div>
                    <div className="mt-5 h-3 rounded-full bg-white/10">
                      <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-blue-100">
                      Guided workloads across AWS, Azure, infrastructure as code, CI/CD, and AI implementation projects.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-[20px] border border-white/10 bg-white/7 p-4">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-blue-200" />
                          <span>AWS Architect</span>
                        </div>
                        <div className="mt-2 text-2xl font-semibold">12 Weeks</div>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-white/7 p-4">
                        <div className="flex items-center gap-2">
                          <DatabaseZap className="h-5 w-5 text-orange-200" />
                          <span>AI Projects</span>
                        </div>
                        <div className="mt-2 text-2xl font-semibold">8 Modules</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-white/12 bg-white/7 p-5">
                      <div className="flex items-center gap-3">
                        <BriefcaseBusiness className="h-10 w-10 rounded-2xl bg-white/10 p-2 text-orange-300" />
                        <div>
                          <div className="text-sm text-blue-100">Hiring readiness</div>
                          <div className="text-xl font-semibold">24 mock interviews</div>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          "Certification roadmap review",
                          "Resume and LinkedIn positioning",
                          "Mock interview feedback",
                        ].map((item) => (
                          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-100">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-white/12 bg-white/7 p-5">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-10 w-10 rounded-2xl bg-white/10 p-2 text-blue-200" />
                        <div>
                          <div className="text-sm text-blue-100">Partner pipeline</div>
                          <div className="text-xl font-semibold">Amazon | Microsoft | IBM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-[24px] border border-white/12 bg-white/7 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-blue-100">Certification readiness score</div>
                      <div className="mt-2 text-3xl font-semibold">96.2</div>
                    </div>
                    <div className="rounded-full bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-200">
                      Mentor evaluation active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
        {heroStats.map((item) => (
          <AnimatedCounter key={item.label} value={item.value} suffix={item.suffix} label={item.label} />
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-7xl rounded-[30px] border border-border bg-white px-6 py-5 shadow-[0_18px_44px_rgba(11,31,58,0.05)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-muted-soft">Trusted by aspiring talent targeting</div>
            <div className="mt-2 text-lg font-semibold text-foreground">Top cloud, consulting, and AI-driven employers</div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {companyLogos.map((company) => (
              <div
                key={company}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
