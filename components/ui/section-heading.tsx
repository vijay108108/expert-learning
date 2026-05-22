import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "dark",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "dark" | "light";
}) {
  return (
    <div className={cn("max-w-[560px]", align === "center" && "mx-auto text-center")}>
      <div className={cn("section-label", theme === "light" && "text-[#FDBA74]")}>{eyebrow}</div>
      <h2
        className={cn(
          "mt-1.5 text-[26px] font-bold leading-[1.2]",
          theme === "light" ? "text-white" : "text-brand-text",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-4 text-sm leading-7",
          theme === "light" ? "text-[#E2E8F0]" : "text-brand-muted",
        )}
      >
        {description}
      </p>
    </div>
  );
}
