import { pricingPlans } from "@/data/site";
import { PricingCard } from "@/components/ui/pricing-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function PricingSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Flexible plans for individual learners and enterprise teams"
            description="Choose a path that matches your pace, budget, and career goals. EMI options and guided consultation are available across plans."
            align="center"
            theme="light"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.05}>
              <PricingCard {...plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
