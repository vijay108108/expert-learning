import { LeadForm } from "@/components/forms/lead-form";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export function LeadCaptureSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="surface-form relative overflow-hidden rounded-[30px] p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.1),transparent_32%)] lg:block" />
            <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <div className="section-label text-[#FDBA74]">Free Consultation</div>
                <h2 className="mt-2 text-[26px] font-bold leading-[1.2] text-white">
                  Talk to our advisors and find the right cloud or AI pathway
                </h2>
                <p className="mt-4 max-w-[560px] text-sm leading-[1.75] text-[#E2E8F0]">
                  Share your goals and we will help you choose the right program, cohort timing, and career pathway based on your current experience.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/courses">Explore Programs</ButtonLink>
                  <ButtonLink href="/corporate-training" variant="outline">
                    Corporate Training
                  </ButtonLink>
                </div>
              </div>
              <div className="surface-card rounded-[24px] p-5 sm:p-6">
                <LeadForm source="Homepage Career Consultation" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
