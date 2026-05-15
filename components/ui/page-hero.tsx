import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta = { label: "Explore Courses", href: "/courses" },
  secondaryCta = { label: "Talk to Admissions", href: "/contact" },
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="section-shell overflow-hidden px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
      <div className="hero-glow left-[-10rem] top-24 h-72 w-72 bg-brand-cyan/30" />
      <div className="hero-glow right-[-8rem] top-28 h-72 w-72 bg-brand-purple/25" />
      <div className="mx-auto max-w-7xl">
        <Reveal className="glass-panel relative overflow-hidden rounded-[32px] border border-border px-5 py-10 sm:rounded-[36px] sm:px-12 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_30%)]" />
          <div className="relative max-w-3xl">
            <span className="inline-flex rounded-full border border-brand-blue/15 bg-brand-blue/8 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-blue sm:px-4 sm:text-xs sm:tracking-[0.28em]">
              {eyebrow}
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
