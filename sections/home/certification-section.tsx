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
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {certificationPaths.map((path, index) => (
            <Reveal key={path.title} delay={index * 0.06}>
              <div className="rounded-[30px] border border-border bg-card p-7 shadow-soft">
                <h3 className="text-2xl font-semibold text-foreground">{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{path.subtitle}</p>
                <div className="mt-8 space-y-4">
                  {path.steps.map((step, stepIndex) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-sm font-semibold text-white">
                        {stepIndex + 1}
                      </div>
                      <div className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm font-medium text-foreground">
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
