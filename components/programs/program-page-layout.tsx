import type { ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  FolderKanban,
  GraduationCap,
  Lock,
  Sparkles,
  Terminal,
  Users2,
} from "lucide-react";

/* ─────────────────────── Types ─────────────────────────── */

export type ProgramModule = {
  title: string;
  week?: string;
  topics: string[];
  tools?: string[];
  lab?: string;
  labOutcome?: string;
};

export type ProgramPhase = {
  label: string;             // "Phase 1" | "Module 1" etc.
  title: string;
  duration: string;
  cert?: string;
  color: string;             // tailwind classes for badge bg/text/border
  icon: ElementType;
  objective: string;
  modules: ProgramModule[];
  capstone?: { title: string; deliverables: string[] };
};

export type CareerTier = {
  level: string;
  roles: string[];
  color: string;
};

export type ProgramPageData = {
  badge: string;
  badgeColor: string;
  tag?: string;
  title: string;
  tagline: string;
  description: string;
  chips: string[];
  stats: { icon: ElementType; label: string }[];
  price: string;
  originalPrice: string;
  priceLabel: string;
  enrollSlug: string;
  enrollFeatures: { icon: ElementType; text: string }[];
  roadmap?: string[];
  phases: ProgramPhase[];
  bonusTracks?: { icon: ElementType; title: string; topics: string[] }[];
  certifications?: { code: string; title: string; emoji: string }[];
  careerTiers: CareerTier[];
  technologies: string[];
  projects: { title: string; desc: string }[];
  idealFor: { icon: ElementType; title: string; desc: string; color: string; bg: string }[];
  faqs?: { q: string; a: string }[];
};

/* ─────────────────────── Sub-components ────────────────── */

function PhaseCard({ phase }: { phase: ProgramPhase }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      {/* Phase header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] bg-[#FAFBFF] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${phase.color}`}>
            <phase.icon className="h-5 w-5" />
          </div>
          <div>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${phase.color}`}>
              {phase.label}
            </span>
            <h3 className="mt-1 text-lg font-bold text-[#0F172A]">{phase.title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-[12px] font-medium text-[#475569]">
            <Clock3 className="h-3.5 w-3.5 text-[#4F46E5]" />{phase.duration}
          </span>
          {phase.cert && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-[12px] font-medium text-[#475569]">
              <Award className="h-3.5 w-3.5 text-[#4F46E5]" />{phase.cert}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <p className="text-sm leading-6 text-[#475569]">{phase.objective}</p>

        <div className="mt-5 space-y-2.5">
          {phase.modules.map((mod) => (
            <details key={mod.title} className="group rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  {mod.week && (
                    <span className="shrink-0 rounded-lg bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4F46E5]">
                      {mod.week}
                    </span>
                  )}
                  <span className="text-[13px] font-semibold text-[#0F172A]">{mod.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-[11px] text-[#94A3B8] sm:block">{mod.topics.length} topics</span>
                  <ChevronDown className="h-4 w-4 text-[#94A3B8] transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <div className="border-t border-[#E2E8F0] px-4 pb-5 pt-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">Topics Covered</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {mod.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#374151]">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />{t}
                    </li>
                  ))}
                </ul>
                {mod.tools && mod.tools.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Tools Used</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.tools.map((tool) => (
                        <span key={tool} className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334155]">
                          <Terminal className="h-3 w-3 text-[#4F46E5]" />{tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {mod.lab && (
                  <div className="mt-4 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-3">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1E40AF]">
                      <FolderKanban className="h-3.5 w-3.5" /> Hands-On Lab
                    </p>
                    <p className="mt-1.5 text-[12.5px] font-medium text-[#1E40AF]">{mod.lab}</p>
                    {mod.labOutcome && (
                      <p className="mt-1 text-[11.5px] text-[#3B82F6]">✓ Outcome: {mod.labOutcome}</p>
                    )}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>

        {phase.capstone && (
          <div className="mt-5 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-[#4338CA]">
              <Award className="h-4 w-4" />{phase.capstone.title}
            </p>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {phase.capstone.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-[12px] text-[#334155]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4338CA]" />{d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── Main Export ───────────────────── */

export function ProgramPageLayout({ data }: { data: ProgramPageData }) {
  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-[linear-gradient(160deg,#FFFFFF_0%,#EEF2FF_55%,#F8FAFC_100%)] px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-start">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${data.badgeColor}`}>
                <Sparkles className="h-3.5 w-3.5" />{data.badge}
              </span>
              {data.tag && (
                <span className="inline-flex items-center rounded-full border-2 border-[#DC2626] bg-[#FEF2F2] px-3 py-1 text-[11px] font-bold text-[#DC2626]">
                  {data.tag}
                </span>
              )}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">{data.tagline}</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0F172A] sm:text-4xl lg:text-[40px]">
              {data.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#475569]">{data.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.chips.map((c) => (
                <span key={c} className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  c.startsWith("🚫") ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]" :
                  c.startsWith("✅") ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]" :
                  "border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]"
                }`}>{c}</span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data.stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                  <s.icon className="h-4 w-4 shrink-0 text-[#4F46E5]" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment card */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[22px] border border-[#E2E8F0] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.10)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">Program Fee</p>
              <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#111827]">{data.price}</p>
              <p className="mt-0.5 text-sm text-[#94A3B8] line-through">{data.originalPrice}</p>
              <p className="mt-1.5 text-sm font-semibold text-[#16A34A]">{data.priceLabel}</p>
              <div className="mt-5 space-y-2 text-sm text-[#475569]">
                {data.enrollFeatures.map(({ icon: Icon, text }) => (
                  <p key={text} className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#4F46E5]" />{text}</p>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.3)] transition hover:scale-[1.02]"
                >
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#475569] transition hover:border-[#C7D2FE] hover:text-[#4F46E5]"
                >
                  Talk to Admissions
                </Link>
              </div>
              <p className="mt-3 text-center text-[11px] text-[#94A3B8]">No-cost EMI · Batch starts every month</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Roadmap ── */}
      {data.roadmap && data.roadmap.length > 0 && (
        <section className="border-t border-[#E2E8F0] bg-[#0F172A] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#818CF8]">Learning Path</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {data.roadmap.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-white">{step}</div>
                  {i < data.roadmap!.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-[#4F46E5]" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Full Syllabus ── */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Full Syllabus</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Complete Curriculum</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[#64748B]">
              Click any module to expand topics. Every phase ends with a real-world project.
            </p>
          </div>
          <div className="mt-10 space-y-6">
            {data.phases.map((phase) => <PhaseCard key={phase.label} phase={phase} />)}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Hands-On</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Real-World Projects</h2>
              <p className="mt-2 text-sm text-[#64748B]">Portfolio-ready projects that employers recognise.</p>
              <div className="mt-6 space-y-3">
                {data.projects.map((p, i) => (
                  <div key={p.title} className="flex gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#4F46E5]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{p.title}</p>
                      <p className="mt-0.5 text-[12px] leading-5 text-[#64748B]">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              {/* Technologies */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Tech Stack</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">Tools & Technologies</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.technologies.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155] shadow-sm">
                      <Code2 className="h-3 w-3 text-[#4F46E5]" />{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {data.certifications && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">You Prepare For</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">Certifications</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {data.certifications.map((c) => (
                      <div key={c.code} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                        <span className="text-2xl">{c.emoji}</span>
                        <div>
                          <p className="text-[13px] font-bold text-[#0F172A]">{c.code}</p>
                          <p className="text-[11px] text-[#64748B]">{c.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bonus Tracks ── */}
      {data.bonusTracks && data.bonusTracks.length > 0 && (
        <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Bonus — Included Free</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Bonus Learning Tracks</h2>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {data.bonusTracks.map((b) => (
                <div key={b.title} className="rounded-[18px] border border-[#E2E8F0] bg-white p-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF]">
                    <b.icon className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[#0F172A]">{b.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {b.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[12px] text-[#64748B]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4F46E5]" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Career Outcomes ── */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">After This Program</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Career Outcomes</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {data.careerTiers.map((tier) => (
              <div key={tier.level} className={`rounded-[20px] border p-6 ${tier.color}`}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{tier.level}</p>
                <ul className="mt-4 space-y-2.5">
                  {tier.roles.map((role) => (
                    <li key={role} className="flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
                      <Briefcase className="h-4 w-4 shrink-0 text-[#4F46E5]" />{role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">Ideal For</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Who Should Enroll</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {data.idealFor.map((item) => (
              <div key={item.title} className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">FAQ</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
            </div>
            <div className="mt-8 space-y-3">
              {data.faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-[#E2E8F0] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
                    <span className="pr-4 text-[14px] font-semibold text-[#0F172A]">{faq.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-[#F1F5F9] px-5 pb-4 pt-3">
                    <p className="text-[13.5px] leading-6 text-[#475569]">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#3B0764,#4F46E5_50%,#0369A1)] px-8 py-12 text-center shadow-[0_24px_60px_rgba(79,70,229,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A5B4FC]">Join the Next Batch</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Ready to start your journey?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#C7D2FE]">
            Live batches start every month. Limited seats. Enroll early to secure your spot.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#4F46E5] shadow-lg transition hover:scale-[1.02]">
              Enroll Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.1)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[rgba(255,255,255,0.18)]">
              Talk to Admissions
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-5 text-[12px] text-[#A5B4FC]">
            {["No-cost EMI", "Live mentorship", "LMS access for life", "Placement support"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#6EE7B7]" />{item}
              </span>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
