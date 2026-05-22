import { iconMap } from "@/lib/icon-map";
import type { IconKey } from "@/lib/icon-map";

export function IconCard({
  icon,
  title,
  description,
}: {
  icon: IconKey;
  title: string;
  description: string;
}) {
  const Icon = iconMap[icon];

  return (
    <div className="surface-card rounded-[24px] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FB923C]/40 hover:bg-white/[0.09] hover:shadow-[0_24px_50px_rgba(2,8,28,0.46)]">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#F97316]/18 text-[#FB923C]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-white">{title}</h3>
      <p className="mt-3 text-[13px] leading-[1.75] text-[#E2E8F0]">{description}</p>
    </div>
  );
}
