import { Building2, ChartColumnIncreasing, Handshake, Users } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/sections/shared/cta-band";

const corporateBenefits = [
  {
    icon: Building2,
    title: "Custom learning journeys",
    description: "Build role-specific cloud and AI pathways mapped to your internal delivery goals.",
  },
  {
    icon: Users,
    title: "Cohort-based upskilling",
    description: "Train teams together through live sessions, labs, and mentor support.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Progress visibility",
    description: "Track completion, project milestones, and skill development with reporting workflows.",
  },
  {
    icon: Handshake,
    title: "Partner-led execution",
    description: "Work with a team that can align curriculum design to enterprise expectations and business outcomes.",
  },
];

export const metadata = buildMetadata({
  title: "Corporate Training | Expert Learning",
  description:
    "Corporate cloud, AI, and DevOps training solutions for modern teams and enterprise capability building.",
  path: "/corporate-training",
});

export default function CorporateTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate Training"
        title="Upskill teams with premium cloud, AI, and DevOps learning experiences"
        description="Expert Learning delivers tailored workforce enablement for modern enterprises, delivery organizations, and academic institutions."
        primaryCta={{ label: "Book Strategy Call", href: "/contact" }}
        secondaryCta={{ label: "View Programs", href: "/courses" }}
      />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Enterprise Enablement"
              title="Flexible training architecture for growing teams"
              description="From cloud foundations to GenAI enablement, we help organizations create confident, certified, project-ready talent pipelines."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {corporateBenefits.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="glass-panel rounded-[28px] border border-border p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Planning team-wide capability building?"
        description="Let’s design a tailored training roadmap around your cloud, AI, data, or DevOps priorities."
      />
    </>
  );
}
