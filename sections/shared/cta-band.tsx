import { AuthActionButton } from "@/components/auth/auth-action-button";
import { ButtonLink } from "@/components/ui/button-link";
import { DemoModalTrigger } from "@/components/demo/demo-modal-trigger";
import { Reveal } from "@/components/ui/reveal";

export function CtaBand({
  title,
  description,
  primaryHref = "/courses",
  secondaryHref = "/courses",
  secondaryDemoCourse,
  secondaryDemoMessage,
}: {
  title: string;
  description: string;
  primaryHref?: string;
  secondaryHref?: string;
  secondaryDemoCourse?: string;
  secondaryDemoMessage?: string;
}) {
  return (
    <Reveal className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-6 py-8 text-[#0F172A] shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="section-label">Admissions Support</div>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.2]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#475569]">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AuthActionButton className="inline-flex touch-manipulation items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.34)]" href={primaryHref}>
              Apply Now
            </AuthActionButton>
            {secondaryDemoCourse || secondaryDemoMessage ? (
              <DemoModalTrigger
                variant="secondary"
                course={secondaryDemoCourse}
                message={secondaryDemoMessage}
                source="CTA Band Demo Request"
              >
                Book Free Demo
              </DemoModalTrigger>
            ) : (
              <ButtonLink href={secondaryHref} variant="secondary">
                Explore Courses
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
