import { ShieldCheck } from "lucide-react";
import { CourseEnrollmentAction } from "@/components/enroll/course-enrollment-action";
import { Reveal } from "@/components/ui/reveal";
import type { Course } from "@/data/courses";

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export function AzureSummerTrainingPage({ course }: { course: Course }) {
  const savings = course.originalPriceValue - course.priceValue;

  return (
    <>
      <section className="hero-home relative overflow-hidden px-4 pt-10 pb-7 sm:px-6 sm:pt-12 sm:pb-9 lg:px-8 lg:pt-14 lg:pb-10">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),rgba(15,23,42,0)_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),rgba(15,23,42,0)_30%)]" />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.04fr)_330px] lg:items-start">
            <Reveal>
              <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(30,41,59,0.72))] px-5 py-5 shadow-[0_18px_42px_rgba(2,8,23,0.18)] backdrop-blur-[18px] sm:px-6 sm:py-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FB923C]/22 bg-[#F97316]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">
                  <span className="h-2 w-2 rounded-full bg-[#F97316]" />
                  AZ-104 Summer Training 2026
                </div>

                <h1 className="mt-4 max-w-[12ch] text-[28px] font-bold leading-[1] tracking-[-0.04em] text-white sm:text-[36px] lg:text-[48px]">
                  Azure Administrator
                  <br />
                  Industrial Training
                </h1>

                <p className="mt-4 max-w-[42ch] text-[14px] leading-6 text-[#CBD5E1] sm:text-[15px]">
                  6-week Azure admin training with live labs, internship support, guided projects, and certification preparation.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Live Labs",
                    "Internship Support",
                    "Project Based",
                    "Certification Ready",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-[#D7E0EF]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                  <div className="flex h-full flex-col rounded-[16px] border border-white/10 bg-white/5 px-3.5 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Focused Track</div>
                    <div className="mt-1.5 text-[13px] font-medium leading-5 text-white">Azure Administrator (AZ-104)</div>
                  </div>
                  <div className="flex h-full flex-col rounded-[16px] border border-white/10 bg-white/5 px-3.5 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Certificate</div>
                    <div className="mt-1.5 text-[13px] font-medium leading-5 text-white">{course.certificate}</div>
                  </div>
                  <div className="flex h-full flex-col rounded-[16px] border border-white/10 bg-white/5 px-3.5 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Lab Stack</div>
                    <div className="mt-1.5 text-[13px] font-medium leading-5 text-white">Portal, Entra ID, VMs, Storage, Monitor</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <aside className="rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(30,41,59,0.72))] p-4.5 shadow-[0_16px_36px_rgba(2,8,23,0.16)] backdrop-blur-[18px] lg:sticky lg:top-24">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Pricing</div>
                    <h2 className="mt-2 text-[20px] font-semibold text-white">Summer training offer</h2>
                  </div>
                  <ShieldCheck className="h-5.5 w-5.5 text-[#FB923C]" />
                </div>

                <div className="mt-4 rounded-[20px] border border-[#FB923C]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Current price</div>
                  <div className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.04em] text-white">
                    {formatPrice(course.priceValue)}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[12px] text-[#B8C4DA]">
                    <span className="line-through">{formatPrice(course.originalPriceValue)}</span>
                    <span className="rounded-full border border-emerald-400/16 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-300">
                      Save {formatPrice(savings)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Duration</div>
                    <div className="mt-1.5 text-[13px] font-medium text-white">{course.duration}</div>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Level</div>
                    <div className="mt-1.5 text-[13px] font-medium text-white">{course.level}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-stretch gap-2">
                  <CourseEnrollmentAction
                    courseSlug={course.slug}
                    checkoutButtonClassName="rounded-[14px]"
                    enrolledButtonClassName="rounded-[14px]"
                    helperClassName="text-[#B8C4DA]"
                    checkoutHelperText="Proceed to dedicated checkout to complete your enrollment securely."
                    enrolledHelperText="This course is already active in your dashboard. Continue learning from there."
                  />
                  <a
                    href={course.officialSyllabusUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-center text-[13px] font-medium text-[#FDBA74] transition hover:text-[#FED7AA] hover:underline hover:underline-offset-4"
                  >
                    View Syllabus
                  </a>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
