import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/data/site";

export function SuccessSection() {
  return (
    <section className="section-shell px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Student Success"
            title="Career outcomes that feel tangible, not aspirational"
            description="Learners join Expert Learning to move faster into cloud and AI roles, and they stay because the support system feels practical, personal, and high-trust."
          />
        </Reveal>
        <Reveal className="mt-12" delay={0.08}>
          <TestimonialsCarousel items={testimonials} />
        </Reveal>
      </div>
    </section>
  );
}
