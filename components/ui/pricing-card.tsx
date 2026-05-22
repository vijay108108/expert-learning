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
        "surface-card relative flex h-full flex-col rounded-[24px] px-6 py-7",
        recommended &&
          "border-2 border-[#FB923C]/60 shadow-[0_22px_48px_rgba(249,115,22,0.2),0_0_0_1px_rgba(251,146,60,0.14)]",
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-[linear-gradient(135deg,#F97316,#FB923C)] px-3 py-1 text-[11px] font-semibold text-white">
          Recommended
        </span>
      )}
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDBA74]">{name}</div>
      <div className="mono-meta mt-4 text-[32px] font-bold leading-none text-white">{price}</div>
      <p className="mt-4 text-sm leading-6 text-[#E2E8F0]">{description}</p>
      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-[#E2E8F0]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FB923C]" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <ButtonLink href="/contact" className="w-full">
          Talk to Admissions
        </ButtonLink>
      </div>
    </div>
  );
}
