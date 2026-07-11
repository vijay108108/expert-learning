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
  orange: "border-[rgba(79,70,229,0.2)] bg-[rgba(79,70,229,0.1)] text-[#0B2E6B]",
  blue: "border-[rgba(37,99,235,0.2)] bg-[rgba(37,99,235,0.1)] text-[#15407E]",
  purple: "border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.1)] text-[#0891B2]",
};

const courseIconMap = {
  "aws-cloud-practitioner": IconCloud,
  "aws-data-engineer": IconChartDots,
  "aws-solutions-architect": IconTopologyStar,
  "aws-devops-engineer": IconSettingsAutomation,
  "aws-sysops-administrator": IconServer2,
  "azure-administrator": IconServer,
  "azure-fundamentals": IconCloud,
  "azure-ai-engineer": IconBrain,
  "azure-security-engineer": IconShieldLock,
  "azure-devops-engineer": IconGitMerge,
  "azure-solutions-architect": IconTopologyStar,
  "devops-fundamentals": IconGitBranch,
  "docker-kubernetes": IconContainer,
  terraform: IconTopologyStar,
  "ci-cd-pipeline-engineering": IconArrowsShuffle,
  "jenkins-github-actions": IconGitBranch,
  "devops-monitoring-security": IconActivity,
  "ai-machine-learning-fundamentals": IconBrain,
  "generative-ai": IconSparkles,
  "prompt-engineering": IconSparkles,
  "ai-for-business": IconChartDots,
  "mlops-ai-deployment": IconSettingsAutomation,
  "openai-llm-engineering": IconSparkles,
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
  originalPrice?: string;
  tags: string[];
  badgeLabel: string;
  badgeTone: BadgeTone;
  primaryHref?: string;
  secondaryHref: string;
  secondaryLabel?: string;
  secondaryExternal?: boolean;
  featured?: boolean;
  className?: string;
  isEnrolled?: boolean;
};

export function RefinedProgramCard({
  courseSlug,
  icon,
  title,
  description,
  duration,
  level,
  price,
  originalPrice,
  tags,
  badgeLabel,
  badgeTone,
  primaryHref,
  secondaryHref,
  secondaryLabel = "Syllabus",
  secondaryExternal = true,
  featured = false,
  className,
  isEnrolled = false,
}: RefinedProgramCardProps) {
  const CourseIcon = courseSlug ? courseIconMap[courseSlug] : null;
  const FallbackIcon = icon ? iconMap[icon] : null;
  const Icon = (CourseIcon || FallbackIcon) as ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  const purchasedCourseHref = courseSlug ? `/dashboard/courses?course=${encodeURIComponent(courseSlug)}` : "/dashboard/courses";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-3 rounded-[16px] border border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.96)] p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0B2E6B]/30 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]",
        featured && "border-[rgba(79,70,229,0.4)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-h-[24px]">
          {isEnrolled ? (
            <span className="inline-flex rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.12)] px-[10px] py-[3px] text-[10px] font-medium text-[#34d399]">
              Enrolled
            </span>
          ) : null}
        </div>
        <span className={cn("whitespace-nowrap rounded-full border px-[10px] py-[3px] text-[10px] font-medium", badgeToneClasses[badgeTone])}>
          {badgeLabel}
        </span>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(79,70,229,0.2)] bg-[rgba(79,70,229,0.08)] text-[#0B2E6B]">
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#475569]">{duration}</span>
        <span className="h-[3px] w-[3px] rounded-full bg-[#94A3B8]" />
        <span className="text-[11px] text-[#475569]">{level}</span>
      </div>

      <h3 className="text-[14px] font-bold leading-[1.4] text-[#0F172A]">{title}</h3>
      <p className="flex-1 text-[12px] leading-[1.6] text-[#475569]">{description}</p>

      <div className="flex flex-wrap gap-[5px]">
        {tags.map((tag) => (
          <span key={tag} className="rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-[2px] text-[10px] text-[#475569]">
            {tag}
          </span>
        ))}
      </div>

      <div className="h-px bg-[#E2E8F0]" />

      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] px-2 py-[2px] text-[10px] text-[#34D399]">
            🏷 Launch Offer
          </div>
          {originalPrice ? <div className="mono-meta mt-2 text-[12px] text-[#94A3B8] line-through">{originalPrice}</div> : null}
          <div className="mono-meta mt-1 text-[18px] font-semibold text-[#0B2E6B]">{price}</div>
        </div>
        <div className="text-[11px] text-[#475569]">{duration}</div>
      </div>

      <div className="flex gap-2">
        {courseSlug ? (
          <AddToCartButton
            courseSlug={courseSlug}
            label="Purchase"
            isEnrolled={isEnrolled}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[10px] border-0 px-0 py-[10px] text-[13px] font-medium text-white transition-all duration-200",
              isEnrolled ? "bg-[#16a34a] hover:bg-[#15803d]" : "bg-[#0B2E6B] hover:bg-[#092552]",
            )}
          />
        ) : (
          <Link
            href={isEnrolled ? purchasedCourseHref : primaryHref || "/courses"}
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[10px] border-0 bg-[#0B2E6B] px-0 py-[10px] text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#092552]"
          >
            {isEnrolled ? "View Course" : "Purchase"}
          </Link>
        )}
        {secondaryExternal ? (
          <a
            href={secondaryHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[10px] border border-[#E2E8F0] bg-white px-0 py-[10px] text-[13px] text-[#475569] transition-all duration-200 hover:border-[#0B2E6B] hover:text-[#0B2E6B]"
          >
            <IconExternalLink size={13} />
            {secondaryLabel}
          </a>
        ) : (
          <a
            href={secondaryHref}
            className="inline-flex flex-1 items-center justify-center gap-[6px] whitespace-nowrap rounded-[10px] border border-[#E2E8F0] bg-white px-0 py-[10px] text-[13px] text-[#475569] transition-all duration-200 hover:border-[#0B2E6B] hover:text-[#0B2E6B]"
          >
            <IconExternalLink size={13} />
            {secondaryLabel}
          </a>
        )}
      </div>
    </article>
  );
}
