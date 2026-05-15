import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <span className="inline-flex rounded-full border border-brand-cyan/18 bg-orange-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-cyan sm:px-4 sm:text-xs sm:tracking-[0.28em]">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted sm:text-lg">{description}</p>
    </div>
  );
}
