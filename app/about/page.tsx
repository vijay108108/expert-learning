import { buildMetadata } from "@/lib/metadata";
import { heroStats, whyChooseUs } from "@/data/site";
import { PageHero } from "@/components/ui/page-hero";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { IconCard } from "@/components/ui/icon-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/sections/shared/cta-band";

export const metadata = buildMetadata({
  title: "About Us | GenZNext Research & Training",
  description:
    "Learn about GenZNext Research & Training, our mission, and how we help students and professionals build cloud and AI careers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About GenZNext Research & Training"
        title="An ed-tech brand built to turn ambition into technical career momentum"
        description="GenZNext Research & Training is powered by Netseems Ventures Pvt Ltd and focused on premium, enterprise-grade learning experiences across cloud, AI, DevOps, and professional certifications."
      />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Mission"
              title="Close the gap between learning and employability"
              description="We combine mentor-led training, guided projects, certification planning, and career support so learners can build both confidence and credibility in competitive markets."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="surface-card p-6 sm:p-8">
              <p className="text-base leading-8 text-brand-text">
                Our approach is simple: make high-growth technology careers feel less overwhelming and more achievable. We care about clarity, quality, and trust because those three things compound into better learner outcomes.
              </p>
              <p className="mt-5 text-sm leading-7 text-brand-muted">
                From first-time IT learners to working professionals and corporate teams, we build programs that feel modern, structured, and deeply relevant to real-world delivery expectations.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((item) => (
            <AnimatedCounter key={item.label} value={item.value} suffix={item.suffix} label={item.label} />
          ))}
        </div>
      </section>
      <section className="section-shell px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our Difference"
              title="Professional polish in design, delivery, and learner support"
              description="We believe a premium experience should be visible in both the curriculum and the way learners feel while progressing through it."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseUs.slice(0, 4).map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <IconCard {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Ready to learn with a team that cares about outcomes?"
        description="Explore our programs or talk to admissions for a pathway recommendation."
      />
    </>
  );
}
