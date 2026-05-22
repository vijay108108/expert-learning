import { certificationPaths } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function CertificationSection() {
  return (
    <section className="section-shell px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Certification Paths"
            title="Roadmaps that make progression feel visible and achievable"
            description="Move through AWS, Azure, and AI skill ladders with curated pathways that connect foundational knowledge to advanced practitioner outcomes."
            theme="light"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {certificationPaths.map((path, index) => (
            <Reveal key={path.title} delay={index * 0.06}>
              <div className="surface-card rounded-[24px] p-6">
                <h3 className="text-[15px] font-semibold text-white">{path.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.75] text-[#E2E8F0]">{path.subtitle}</p>
                <div className="mt-8 space-y-4">
                  {path.steps.map((step, stepIndex) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-[12px] font-semibold text-white">
                        {stepIndex + 1}
                      </div>
                      <div className="relative flex-1 rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-3 text-[13px] font-medium text-white">
                        {stepIndex < path.steps.length - 1 && (
                          <div className="absolute -bottom-4 left-0 hidden h-[2px] w-8 bg-[#FB923C]/40 md:block" />
                        )}
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
