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
    <div className="glass-panel rounded-[28px] border border-border p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-blue/30">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue/12 to-brand-cyan/12 text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
