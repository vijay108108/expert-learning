"use client";

import { ArrowUpRight, Clock3, ExternalLink, Star } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { iconMap } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { Course } from "@/data/courses";
import { buttonLinkClasses } from "@/components/ui/button-link";
import { RefinedProgramCard } from "@/components/ui/refined-program-card";

const categoryStyles = {
  aws: {
    bar: "from-[#F97316] via-[#FB923C] to-[#FDBA74]",
    icon: "bg-[#F97316]/18 text-[#FDBA74]",
  },
  azure: {
    bar: "from-[#F97316] via-[#FB923C] to-[#FDBA74]",
    icon: "bg-[#F97316]/18 text-[#FDBA74]",
  },
  ai: {
    bar: "from-[#F97316] via-[#FB923C] to-[#FDBA74]",
    icon: "bg-[#F97316]/18 text-[#FDBA74]",
  },
  devops: {
    bar: "from-[#F97316] via-[#FB923C] to-[#FDBA74]",
    icon: "bg-[#F97316]/18 text-[#FDBA74]",
  },
} as const;

export function CourseCard({
  course,
  featured = false,
  variant = "default",
  badgeOverride,
  isEnrolled = false,
}: {
  course: Course;
  featured?: boolean;
  variant?: "default" | "refined";
  badgeOverride?: { label: string; tone: "green" | "orange" | "blue" | "purple" };
  isEnrolled?: boolean;
}) {
  const Icon = iconMap[course.icon];
  const style = categoryStyles[course.category];
  const popular = course.tagTone === "orange";
  const isRefined = variant === "refined";

  const badgeConfig = (() => {
    if (course.tagLabel) {
      return {
        label: course.tagLabel,
        tone: course.tagTone,
      };
    }

    const highlight = course.highlight.toLowerCase();

    if (highlight.includes("beginner") || highlight.includes("it beginners")) {
      return {
        label: "Beginner",
        tone: "green" as const,
      };
    }

    if (highlight.includes("popular")) {
      return {
        label: "Most Popular",
        tone: "orange" as const,
      };
    }

    if (highlight.includes("professional")) {
      return {
        label: "For Professionals",
        tone: "blue" as const,
      };
    }

    if (highlight.includes("operations-focused") || highlight.includes("ops")) {
      return {
        label: "Ops-focused",
        tone: "purple" as const,
      };
    }

    return {
      label: course.highlight,
      tone: "orange" as const,
    };
  })();

  if (isRefined) {
    return (
      <RefinedProgramCard
        courseSlug={course.slug as Parameters<typeof RefinedProgramCard>[0]["courseSlug"]}
        title={course.title}
        description={course.subtitle}
        rating={course.rating}
        duration={course.duration}
        level={course.level}
        price={course.price}
        originalPrice={course.originalPrice}
        tags={course.tags}
        icon={course.icon}
        badgeLabel={badgeOverride?.label || badgeConfig.label}
        badgeTone={badgeOverride?.tone || badgeConfig.tone}
        secondaryHref={course.officialSyllabusUrl}
        featured={featured}
        isEnrolled={isEnrolled}
      />
    );
  }

  return (
    <article
      className={cn(
        "surface-card group relative flex h-full flex-col overflow-hidden rounded-[24px] p-5 transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#FB923C]/46 hover:bg-white/[0.09] hover:shadow-[0_24px_52px_rgba(2,8,28,0.46)]",
        featured && "pulse-border",
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r", style.bar)} />
      {isEnrolled ? (
        <span className="absolute top-4 left-4 z-[1] rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.12)] px-[10px] py-[3px] text-[10px] font-medium text-[#34d399]">
          ✓ Enrolled
        </span>
      ) : null}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", style.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] font-semibold",
            popular ? "border-[#FB923C]/30 bg-[#F97316]/12 text-[#FDBA74]" : "border-white/14 bg-white/6 text-[#E2E8F0]",
          )}
        >
          {course.highlight}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#E2E8F0]">
        <span className="mono-meta inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-[#F97316] text-[#F97316]" />
          {course.rating}
        </span>
        <span className="mono-meta inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5 text-[#F97316]" />
          {course.duration}
        </span>
        <span className="mono-meta">{course.level}</span>
      </div>
      <h3 className="mt-4 text-[15px] font-semibold leading-6 text-white">{course.title}</h3>
      <p className="mt-3 min-h-[68px] text-[13px] leading-[1.75] text-[#E2E8F0]">{course.subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span
            key={tag}
            className="mono-tag rounded-full border border-[#FB923C]/26 bg-[#F97316]/12 px-2.5 py-1 text-[11px] text-[#FDBA74]"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
        <div>
          <div className="inline-flex items-center rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] px-2 py-[2px] text-[10px] text-[#34d399]">
            🏷 Launch Offer
          </div>
          <div className="mono-meta mt-2 text-[12px] text-[#475569] line-through">{course.originalPrice}</div>
          <div className="mono-meta mt-1 text-[18px] font-semibold text-[#f97316]">{course.price}</div>
        </div>
        <div className="mono-meta text-[11px] text-[#E2E8F0]">{course.duration}</div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AddToCartButton
          courseSlug={course.slug}
          isEnrolled={isEnrolled}
          className={buttonLinkClasses(
            isEnrolled ? "secondary" : "primary",
            cn(
              "w-full px-4 py-2.5 text-[12px] sm:w-auto",
              isEnrolled && "border-[#16a34a]/40 bg-[#16a34a] text-white hover:border-[#15803d] hover:bg-[#15803d] hover:text-white",
            ),
          )}
        />
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <a
            href={course.officialSyllabusUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#FB923C]/34 bg-white/6 px-4 py-2.5 text-[12px] font-semibold text-[#FDBA74] shadow-[0_10px_24px_rgba(249,115,22,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F97316] hover:bg-[#F97316] hover:text-white hover:shadow-[0_16px_32px_rgba(249,115,22,0.18)] sm:flex-initial"
          >
            View Syllabus
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <ArrowUpRight className="hidden h-[18px] w-[18px] text-[#FDBA74] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
        </div>
      </div>
    </article>
  );
}
