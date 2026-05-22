import { IconCard } from "@/components/ui/icon-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyChooseUs } from "@/data/site";

export function WhyChooseSection() {
  return (
    <section className="section-shell px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Why GenZNext Research & Training"
            title="Designed to feel enterprise-grade because your next role should too"
            description="Every element of the learning experience is built to reduce friction and improve outcomes, from live labs and projects to mentor feedback and placement support."
            align="center"
            theme="light"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {whyChooseUs.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.04}>
              <IconCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
