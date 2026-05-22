import {
  IconActivity,
  IconArrowsShuffle,
  IconBrain,
  IconChartDots,
  IconCloud,
  IconContainer,
  IconExternalLink,
  IconGitBranch,
  IconGitMerge,
  IconSettingsAutomation,
  IconServer,
  IconServer2,
  IconShieldLock,
  IconSparkles,
  IconTopologyStar,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { iconMap, type IconKey } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "orange" | "blue" | "purple";

const badgeToneClasses: Record<BadgeTone, string> = {
  green: "border-[rgba(52,211,153,0.2)] bg-[rgba(16,185,129,0.12)] text-[#34D399]",
  orange: "border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] text-[#FB923C]",
  blue: "border-[rgba(96,165,250,0.2)] bg-[rgba(59,130,246,0.12)] text-[#60A5FA]",
  purple: "border-[rgba(167,139,250,0.2)] bg-[rgba(139,92,246,0.12)] text-[#A78BFA]",
};

const courseIconMap = {
  "aws-cloud-practitioner": IconCloud,
  "aws-solutions-architect": IconTopologyStar,
  "aws-devops-engineer": IconSettingsAutomation,
  "aws-sysops-administrator": IconServer2,
  "azure-administrator": IconServer,
  "azure-security-engineer": IconShieldLock,
  "azure-devops-engineer": IconGitMerge,
  "azure-solutions-architect": IconTopologyStar,
  "devops-fundamentals": IconGitBranch,
  "docker-kubernetes": IconContainer,
  "ci-cd-pipeline-engineering": IconArrowsShuffle,
  "devops-monitoring-security": IconActivity,
  "ai-machine-learning-fundamentals": IconBrain,
  "generative-ai": IconSparkles,
  "mlops-ai-deployment": IconSettingsAutomation,
  "ai-data-science-analytics": IconChartDots,
} as const;

export type RefinedProgramCardProps = {
  courseSlug?: keyof typeof courseIconMap;
  icon?: IconKey;
  title: string;
  description: string;
  rating?: number;
  duration: string;
  level: string;
  price: string;
  tags: string[];
  badgeLabel: string;
  badgeTone: BadgeTone;
  primaryHref?: string;
  secondaryHref: string;
  secondaryLabel?: string;
  secondaryExternal?: boolean;
  featured?: boolean;
  className?: string;
};

export function RefinedProgramCard({
  courseSlug,
  icon,
  title,
  description,
  rating,
  duration,
  level,
  price,
  tags,
  badgeLabel,
  badgeTone,
  primaryHref,
  secondaryHref,
  secondaryLabel = "Syllabus",
  secondaryExternal = true,
  featured = false,
  className,
}: RefinedProgramCardProps) {
  const CourseIcon = courseSlug ? courseIconMap[courseSlug] : null;
  const FallbackIcon = icon ? iconMap[icon] : null;
  const Icon = (CourseIcon || FallbackIcon) as ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-[14px] border border-[#1E2D42] bg-[#111827] p-[18px] transition-[border-color] duration-200 hover:border-[#F97316]",
        featured && "border-[rgba(249,115,22,0.5)]",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(249,115,22,0.25)] bg-[rgba(249,115,22,0.1)] text-[#F97316]">
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <span className={cn("whitespace-nowrap rounded-full border px-[10px] py-[3px] text-[10px] font-medium", badgeToneClasses[badgeTone])}>
          {badgeLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {typeof rating === "number" ? <span className="text-[12px] font-medium text-[#F59E0B]">{rating}</span> : null}
        <span className="h-[3px] w-[3px] rounded-full bg-[#334155]" />
        <span className="text-[11px] text-[#475569]">{duration}</span>
        <span className="h-[3px] w-[3px] rounded-full bg-[#334155]" />
        <span className="text-[11px] text-[#475569]">{level}</span>
      </div>

      <h3 className="text-[14px] font-semibold leading-[1.4] text-[#F1F5F9]">{title}</h3>
      <p className="flex-1 text-[12px] leading-[1.6] text-[#64748B]">{description}</p>

      <div className="flex flex-wrap gap-[5px]">
        {tags.map((tag) => (
          <span key={tag} className="rounded-[6px] border border-[#2D3F55] bg-[#1E293B] px-2 py-[2px] text-[10px] text-[#475569]">
            {tag}
          </span>
        ))}
      </div>

      <div className="h-px bg-[#1A2537]" />

      <div className="flex items-center justify-between">
        <div>
          <div className="mb-[3px] text-[10px] uppercase tracking-[0.06em] text-[#475569]">Program Fee</div>
          <div className="mono-meta text-[18px] font-semibold text-[#F97316]">{price}</div>
        </div>
        <div className="text-[11px] text-[#334155]">{duration}</div>
      </div>

      <div className="flex gap-2">
        {courseSlug ? (
          <AddToCartButton
            courseSlug={courseSlug}
            label="Purchase"
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[8px] border-0 bg-[#F97316] px-0 py-[10px] text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#EA580C]"
          />
        ) : (
          <Link
            href={primaryHref || "/courses"}
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[8px] border-0 bg-[#F97316] px-0 py-[10px] text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#EA580C]"
          >
            Purchase
          </Link>
        )}
        {secondaryExternal ? (
          <a
            href={secondaryHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[8px] border border-[#2D3F55] bg-transparent px-0 py-[10px] text-[13px] text-[#94A3B8] transition-all duration-200 hover:border-[#F97316] hover:text-[#F97316]"
          >
            <IconExternalLink size={13} />
            {secondaryLabel}
          </a>
        ) : (
          <a
            href={secondaryHref}
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[8px] border border-[#2D3F55] bg-transparent px-0 py-[10px] text-[13px] text-[#94A3B8] transition-all duration-200 hover:border-[#F97316] hover:text-[#F97316]"
          >
            <IconExternalLink size={13} />
            {secondaryLabel}
          </a>
        )}
      </div>
    </article>
  );
}
