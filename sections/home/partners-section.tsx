import { companyLogos } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function PartnersSection() {
  const logos = [...companyLogos, ...companyLogos];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Hiring Partners"
            title="Aligned with the skills modern employers actively hire for"
            description="Our programs are structured around role readiness, certification depth, and workflow confidence so learners can transition into real delivery environments."
            align="center"
          />
        </Reveal>
        <div className="mt-10 overflow-hidden rounded-[30px] border border-border bg-card py-6 shadow-soft">
          <div className="logo-marquee flex min-w-max gap-4 px-4">
            {logos.map((company, index) => (
              <div
                key={`${company}-${index}`}
                className="min-w-[170px] rounded-full border border-border bg-background/70 px-6 py-4 text-center text-sm font-semibold text-foreground"
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
