import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const inputClassName =
  "h-12 rounded-2xl border border-border bg-white/80 px-4 text-sm text-foreground outline-none ring-0 transition placeholder:text-muted focus:border-brand-blue/40";

export function LeadCaptureSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-[36px] border border-border p-8 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.12),transparent_26%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-brand-blue/15 bg-brand-blue/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">
                  Free Consultation
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Talk to our advisors and find the right cloud or AI pathway
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                  Share your goals and we will help you choose the right program, cohort timing, and career pathway based on your current experience.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/courses">Explore Programs</ButtonLink>
                  <ButtonLink href="/corporate-training" variant="secondary">
                    Corporate Training
                  </ButtonLink>
                </div>
              </div>
              <form className="grid gap-4 rounded-[30px] border border-border bg-card/80 p-6 shadow-soft">
                <input className={inputClassName} type="text" placeholder="Name" />
                <input className={inputClassName} type="email" placeholder="Email" />
                <input className={inputClassName} type="tel" placeholder="Phone" />
                <select className={inputClassName} defaultValue="">
                  <option value="" disabled>
                    Interested Course
                  </option>
                  <option>AWS Certification Programs</option>
                  <option>Azure Certification Programs</option>
                  <option>AI & GenAI Programs</option>
                  <option>DevOps Programs</option>
                  <option>Corporate Training</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-blue to-brand-cyan text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
                >
                  Get Free Career Consultation
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
