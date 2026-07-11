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
    bar: "from-[#0B2E6B] via-[#15407E] to-[#E56F12]",
    icon: "bg-[#0B2E6B]/18 text-[#E56F12]",
  },
  azure: {
    bar: "from-[#0B2E6B] via-[#15407E] to-[#E56F12]",
    icon: "bg-[#0B2E6B]/18 text-[#E56F12]",
  },
  ai: {
    bar: "from-[#0B2E6B] via-[#15407E] to-[#E56F12]",
    icon: "bg-[#0B2E6B]/18 text-[#E56F12]",
  },
  devops: {
    bar: "from-[#0B2E6B] via-[#15407E] to-[#E56F12]",
    icon: "bg-[#0B2E6B]/18 text-[#E56F12]",
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
        "surface-card group relative flex h-full flex-col overflow-hidden rounded-[16px] p-5 transition-all duration-300",
        "border border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.96)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:border-[#0B2E6B]/30 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]",
        featured && "pulse-border",
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r", style.bar)} />
      {isEnrolled ? (
        <span className="absolute top-4 left-4 z-[1] rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.12)] px-[10px] py-[3px] text-[10px] font-medium text-[#34d399]">
          Enrolled
        </span>
      ) : null}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", style.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] font-semibold",
            popular ? "border-[#0B2E6B]/30 bg-[#EAF0FA] text-[#0B2E6B]" : "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]",
          )}
        >
          {course.highlight}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#475569]">
        <span className="mono-meta inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-[#0B2E6B] text-[#0B2E6B]" />
          {course.rating}
        </span>
        <span className="mono-meta inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5 text-[#0B2E6B]" />
          {course.duration}
        </span>
        <span className="mono-meta">{course.level}</span>
      </div>
      <h3 className="mt-4 text-[15px] font-bold leading-6 text-[#0F172A]">{course.title}</h3>
      <p className="mt-3 min-h-[68px] text-[13px] leading-[1.75] text-[#475569]">{course.subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span
            key={tag}
            className="mono-tag rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] text-[#475569]"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#E2E8F0] pt-4">
        <div>
          <div className="inline-flex items-center rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] px-2 py-[2px] text-[10px] text-[#34d399]">
            🏷 Launch Offer
          </div>
          <div className="mono-meta mt-2 text-[12px] text-[#94A3B8] line-through">{course.originalPrice}</div>
          <div className="mono-meta mt-1 text-[18px] font-bold text-[#0B2E6B]">{course.price}</div>
        </div>
        <div className="mono-meta text-[11px] text-[#475569]">{course.duration}</div>
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
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#0B2E6B] shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B2E6B] hover:bg-[#EAF0FA] hover:text-[#092552] sm:flex-initial"
          >
            View Syllabus
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <ArrowUpRight className="hidden h-[18px] w-[18px] text-[#0B2E6B] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
        </div>
      </div>
    </article>
  );
}
