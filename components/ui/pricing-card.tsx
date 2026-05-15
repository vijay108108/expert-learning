import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export function PricingCard({
  name,
  price,
  description,
  recommended,
  features,
}: {
  name: string;
  price: string;
  description: string;
  recommended: boolean;
  features: readonly string[];
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-[26px] border border-border bg-card p-6 shadow-soft sm:rounded-[30px] sm:p-8",
        recommended && "border-brand-cyan/35 ring-4 ring-brand-cyan/8",
      )}
    >
      {recommended && (
        <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-brand-cyan to-orange-500 px-3 py-1 text-xs font-semibold text-white sm:right-6 sm:top-6">
          Recommended
        </span>
      )}
      <div className="text-sm uppercase tracking-[0.25em] text-brand-blue">{name}</div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{price}</div>
      <p className="mt-4 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-8 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <ButtonLink href="/contact" className="mt-auto pt-8">
        Talk to Admissions
      </ButtonLink>
    </div>
  );
}
