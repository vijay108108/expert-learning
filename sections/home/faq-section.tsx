import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/data/site";

export function FaqSection() {
  return (
    <section className="section-shell px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeading
            eyebrow="FAQs"
            title="Questions learners ask before they commit"
            description="A premium learning experience should feel transparent. Here are the details people usually want before they choose a program."
            theme="light"
          />
        </Reveal>
        <Reveal delay={0.08}>
          <FaqAccordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
