import { journeySteps } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function JourneySection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Learning Journey"
            title="A clear, guided path from first enrollment to final job offer"
            description="We keep the process simple and outcomes-focused so learners can build confidence, credibility, and momentum at every step."
            theme="light"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-6">
          {journeySteps.map((step, index) => (
            <Reveal key={step} delay={index * 0.06}>
              <div className="surface-card relative rounded-[22px] p-5">
                {index !== journeySteps.length - 1 && (
                  <div className="absolute -right-4 top-4 hidden h-[2px] w-8 bg-[#FB923C]/40 lg:block" />
                )}
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-[12px] font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-[13px] font-semibold text-white">{step}</h3>
                <p className="mt-3 text-[13px] leading-[1.75] text-[#E2E8F0]">
                  {index === 0 && "Choose the right program with guidance from our admissions and career team."}
                  {index === 1 && "Attend live sessions, complete guided labs, and build strong conceptual depth."}
                  {index === 2 && "Create portfolio-ready cloud or AI projects that reflect real production scenarios."}
                  {index === 3 && "Prepare for certification milestones with mock tests and mentor reviews."}
                  {index === 4 && "Sharpen your resume, storytelling, and technical confidence for interviews."}
                  {index === 5 && "Transition into a stronger role with placement support and career momentum."}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
