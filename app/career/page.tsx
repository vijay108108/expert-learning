import { MapPin, BriefcaseBusiness } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { careerOpenings } from "@/data/site";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/sections/shared/cta-band";

export const metadata = buildMetadata({
  title: "Career | GenZNext Research & Training",
  description:
    "Explore open roles and join the team building premium cloud and AI education experiences.",
  path: "/career",
});

export default function CareerPage() {
  return (
    <>
      <PageHero
        eyebrow="Career"
        title="Help build the next generation of premium technology learning"
        description="Join a team that cares about learner trust, ambitious design, and practical career transformation."
      />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-5">
          {careerOpenings.map((role, index) => (
            <Reveal key={role.title} delay={index * 0.06}>
              <div className="glass-panel flex flex-col gap-5 rounded-[30px] border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{role.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-blue" />
                      {role.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-brand-blue" />
                      {role.type}
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:careers@expertlearning.in"
                  className="inline-flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#F97316,#FB923C)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28),0_0_18px_rgba(251,146,60,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(249,115,22,0.34),0_0_24px_rgba(251,146,60,0.16)]"
                >
                  Apply
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand
        title="Don't see your role yet?"
        description="Share your profile with us. We are always looking for mentors, operators, and growth-minded teammates."
      />
    </>
  );
}
