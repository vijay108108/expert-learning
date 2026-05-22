import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { RefinedProgramCard } from "@/components/ui/refined-program-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/sections/shared/cta-band";

const corporateBenefits = [
  {
    icon: "building" as const,
    title: "Custom learning journeys",
    description: "Build role-specific cloud and AI pathways mapped to your internal delivery goals.",
    duration: "Flexible Cohort",
    level: "Team Enablement",
    price: "Custom Quote",
    badgeLabel: "Team training",
    badgeTone: "green" as const,
    tags: ["Role Mapping", "Cloud", "AI"],
  },
  {
    icon: "community" as const,
    title: "Cohort-based upskilling",
    description: "Train teams together through live sessions, labs, and mentor support.",
    duration: "6-12 Weeks",
    level: "Team Delivery",
    price: "Per Team Plan",
    badgeLabel: "Most popular",
    badgeTone: "orange" as const,
    tags: ["Live Cohorts", "Labs", "Mentors"],
  },
  {
    icon: "database" as const,
    title: "Progress visibility",
    description: "Track completion, project milestones, and skill development with reporting workflows.",
    duration: "Enterprise Rollout",
    level: "Reporting Ready",
    price: "Enterprise Quote",
    badgeLabel: "Enterprise plan",
    badgeTone: "blue" as const,
    tags: ["Dashboards", "Milestones", "Reporting"],
  },
  {
    icon: "guidance" as const,
    title: "Partner-led execution",
    description: "Work with a team that can align curriculum design to enterprise expectations and business outcomes.",
    duration: "Custom Delivery",
    level: "Advisory Support",
    price: "Tailored Scope",
    badgeLabel: "Custom training",
    badgeTone: "purple" as const,
    tags: ["Consulting", "Roadmaps", "Execution"],
  },
];

export const metadata = buildMetadata({
  title: "Corporate Training | GenZNext Research & Training",
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
        description="GenZNext Research & Training delivers tailored workforce enablement for modern enterprises, delivery organizations, and academic institutions."
        primaryCta={{ label: "Book Strategy Call", href: "/contact" }}
        secondaryCta={{ label: "View Programs", href: "/courses" }}
      />
      <section id="enterprise-programs" className="scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Enterprise Enablement"
              title="Flexible training architecture for growing teams"
              description="From cloud foundations to GenAI enablement, we help organizations create confident, certified, project-ready talent pipelines."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
            {corporateBenefits.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} className="h-full">
                <RefinedProgramCard
                  title={item.title}
                  description={item.description}
                  duration={item.duration}
                  level={item.level}
                  price={item.price}
                  tags={item.tags}
                  badgeLabel={item.badgeLabel}
                  badgeTone={item.badgeTone}
                  icon={item.icon}
                  primaryHref="/corporate-training#enterprise-programs"
                  secondaryHref="/contact"
                  secondaryExternal={false}
                  secondaryLabel="Talk to Us"
                  featured={item.badgeTone === "orange"}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Planning team-wide capability building?"
        description="Let's design a tailored training roadmap around your cloud, AI, data, or DevOps priorities."
      />
    </>
  );
}
