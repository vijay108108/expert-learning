import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { DemoModalTrigger } from "@/components/demo/demo-modal-trigger";
import { SummerTrainingForm } from "@/components/forms/summer-training-form";
import { buttonLinkClasses } from "@/components/ui/button-link";
import { IconCard } from "@/components/ui/icon-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  activeSummerTrainingProgram,
  summerTrainingBenefits,
  upcomingSummerTrainingTracks,
} from "@/data/summer-training";

const featureCards = [
  {
    title: "Live Classes",
    description: "Interactive instructor-led sessions designed around daily progress, concept clarity, and practical execution.",
    icon: "guidance" as const,
  },
  {
    title: "Internship Certificate",
    description: "Receive a structured completion and internship certificate aligned with your summer training outcomes.",
    icon: "awards" as const,
  },
  {
    title: "Real Projects",
    description: "Build practical cloud, DevOps, AI, and Python deliverables that improve portfolio depth and confidence.",
    icon: "code" as const,
  },
  {
    title: "Mentor Support",
    description: "Get help from industry practitioners through doubt clearing, feedback loops, and guided implementation.",
    icon: "community" as const,
  },
  {
    title: "AKTU Friendly",
    description: "Structured pacing for B.Tech students with practical sessions aligned to summer-learning expectations.",
    icon: "graduation" as const,
  },
  {
    title: "Career Guidance",
    description: "Get resume direction, internship positioning, and clearer guidance on where each track can take you.",
    icon: "briefcase" as const,
  },
].filter(Boolean);

export function SummerTrainingSection() {
  return (
    <section
      id="summer-training"
      className="section-shell bg-[linear-gradient(180deg,rgba(7,16,40,0.96),rgba(15,23,42,0.94))] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Summer Campaign"
            title="Summer Industrial Training Program"
            description="Hands-on cloud and AI training with internship support, projects, certification guidance, and industry mentorship."
            theme="dark"
          />
        </Reveal>

        <div className="mt-8 grid gap-4 rounded-[28px] border border-[#FB923C]/16 bg-[linear-gradient(135deg,rgba(7,16,40,0.88),rgba(15,23,42,0.84))] p-5 shadow-[0_18px_44px_rgba(2,8,28,0.28),0_0_28px_rgba(249,115,22,0.08)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <Reveal>
            <div className="rounded-[24px] border border-[#FB923C]/18 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.03))] p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FB923C]/28 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">
                <span className="pulse-border h-2 w-2 rounded-full bg-[#F97316]" />
                Admissions Open
              </div>
              <h3 className="mt-4 text-[26px] font-bold leading-[1.16] text-white">
                6 Weeks Summer Industrial Training Program on Cloud &amp; AI Technologies
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#E2E8F0]">
                This summer cycle is focused on one clear learning pathway: Azure administration with practical labs,
                identity workflows, internship support, and mentor-guided execution for student-ready outcomes.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/courses#azure-programs" className={buttonLinkClasses("primary", "justify-center")}>
                  Register Now
                </Link>
                <DemoModalTrigger
                  variant="outline"
                  className="justify-center"
                  course="Azure Administrator Training"
                  message="I would like free counseling for Azure Administrator Training."
                  source="Summer Training Counseling"
                >
                  Book Free Counseling
                </DemoModalTrigger>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Internship support",
                "Project-based learning",
                "Mentor-guided outcomes",
              ].map((item) => (
                <div
                  key={item}
                  className="surface-card rounded-[22px] px-4 py-5 text-center"
                >
                  <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F97316]/16 text-[#FDBA74]">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white">{item}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.05}>
              <IconCard icon={feature.icon} title={feature.title} description={feature.description} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <Reveal>
            <SectionHeading
              eyebrow="Active Program"
              title="Azure Administrator Training"
              description="Our current active summer batch is centered on Azure fundamentals, administration workflows, and internship-oriented hands-on practice."
              theme="dark"
            />
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <Reveal>
              <div className="overflow-hidden rounded-[28px] border border-[#FB923C]/24 bg-[linear-gradient(135deg,#7C2D12,#F97316_55%,#FDBA74)] p-[1px] shadow-[0_24px_54px_rgba(249,115,22,0.18)]">
                <div className="h-full rounded-[27px] bg-[linear-gradient(145deg,rgba(7,16,40,0.98),rgba(15,23,42,0.94))] p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-full border border-[#FB923C]/26 bg-[#F97316]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">
                      {activeSummerTrainingProgram.tag}
                    </div>
                    <div className="inline-flex rounded-full border border-[#FB923C]/26 bg-white/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#FDBA74]">
                      Azure Focused
                    </div>
                  </div>
                  <h3 className="mt-5 text-[24px] font-bold leading-[1.16] text-white sm:text-[28px]">
                    {activeSummerTrainingProgram.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E2E8F0]">
                    A practical 6-week internship-style training program for students learning Azure administration,
                    guided labs, identity operations, and real implementation workflows with mentor support.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[18px] border border-[#FB923C]/16 bg-white/8 px-4 py-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">Duration</div>
                      <div className="mt-1 text-sm font-semibold text-white">{activeSummerTrainingProgram.duration}</div>
                    </div>
                    <div className="rounded-[18px] border border-[#FB923C]/16 bg-white/8 px-4 py-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">Level</div>
                      <div className="mt-1 text-sm font-semibold text-white">{activeSummerTrainingProgram.level}</div>
                    </div>
                    <div className="rounded-[18px] border border-[#FB923C]/16 bg-white/8 px-4 py-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">Certificate</div>
                      <div className="mt-1 text-sm font-semibold text-white">{activeSummerTrainingProgram.certificate}</div>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {activeSummerTrainingProgram.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-[18px] border border-[#FB923C]/14 bg-white/6 px-4 py-3.5"
                      >
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FB923C]" />
                        <span className="text-sm leading-7 text-[#E2E8F0]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[#E2E8F0]">{activeSummerTrainingProgram.support}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/courses#azure-programs" className={buttonLinkClasses("primary", "justify-center")}>
                      Register Now
                    </Link>
                    <DemoModalTrigger
                      variant="outline"
                      className="justify-center"
                      course="Azure Administrator Training"
                      message="I would like free counseling for Azure Administrator Training."
                      source="Summer Training Counseling"
                    >
                      Book Free Counseling
                    </DemoModalTrigger>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="surface-card rounded-[28px] p-6">
                <div className="section-label text-[#FDBA74]">Why this batch</div>
                <h3 className="mt-3 text-[22px] font-bold leading-[1.2] text-white">
                  Azure administration with internship-ready structure
                </h3>
                <div className="mt-5 grid gap-3">
                  {[
                    "Hands-on Azure labs with guided practice",
                    "Identity, access, and admin workflow exposure",
                    "Internship support with mentor reviews",
                    "Certification preparation aligned to fundamentals",
                  ].map((point) => (
                    <div
                      key={point}
                      className="rounded-[18px] border border-[#FB923C]/14 bg-white/6 px-4 py-3.5 text-sm leading-7 text-[#E2E8F0]"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <Reveal>
            <div className="surface-card rounded-[28px] p-6">
              <div className="section-label text-[#FDBA74]">Student Benefits</div>
              <h3 className="mt-3 text-[24px] font-bold leading-[1.18] text-white">
                Practical summer learning designed for B.Tech and AKTU students
              </h3>
              <div className="mt-6 grid gap-3">
                {summerTrainingBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-[18px] border border-[#FB923C]/14 bg-white/6 px-4 py-3.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#FB923C]" />
                    <span className="text-sm leading-7 text-[#E2E8F0]">{benefit}</span>
                  </div>
                ))}
              </div>
              <DemoModalTrigger
                className={buttonLinkClasses("primary", "mt-6 w-full justify-center sm:w-auto")}
                unstyled
                course="Azure Administrator Training"
                message="I would like free counseling for Azure Administrator Training."
                source="Summer Training Counseling"
                title="Book your Azure summer training demo"
              >
                Book Free Counseling
                <ArrowRight className="h-4 w-4" />
              </DemoModalTrigger>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div id="summer-training-register">
              <SummerTrainingForm />
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <Reveal>
            <SectionHeading
              eyebrow="Coming Soon"
              title="Upcoming Summer Training Tracks"
              description="These specializations are planned for future batches and are shown here as upcoming options, not active admissions."
              theme="dark"
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {upcomingSummerTrainingTracks.map((track, index) => (
              <Reveal key={track.title} delay={index * 0.05}>
                <div className="rounded-[22px] border border-[#FB923C]/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04)),rgba(7,16,40,0.78)] p-4 shadow-[0_12px_28px_rgba(2,8,28,0.22)]">
                  <div className="inline-flex rounded-full border border-[#FB923C]/18 bg-[#F97316]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">
                    {track.tag}
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-white">{track.title}</h3>
                  <div className="mt-3 space-y-2 text-sm text-[#E2E8F0]">
                    <div>{track.duration}</div>
                    <div>{track.level}</div>
                    <div>{track.certificate}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#E2E8F0]">{track.support}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
