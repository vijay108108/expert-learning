"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";
import { expandRequestedCourseSlugs } from "@/lib/offering-catalog";
import { cn } from "@/lib/utils";

type ProgramEnrollmentCtaProps = {
  courseSlug: string;
  checkoutLabel?: string;
  showAdvisorWhenNotEnrolled?: boolean;
  advisorHref?: string;
  className?: string;
};

export function ProgramEnrollmentCta({
  courseSlug,
  checkoutLabel = "Enroll Now",
  showAdvisorWhenNotEnrolled = true,
  advisorHref = "/contact",
  className,
}: ProgramEnrollmentCtaProps) {
  const { user } = useAuth();
  const { enrolledCourseIds, loading } = useEnrolledCourseIds();
  const requiredCourseSlugs = expandRequestedCourseSlugs([courseSlug]);
  const isEnrolled = Boolean(
    user
    && requiredCourseSlugs.length > 0
    && requiredCourseSlugs.every((slug) => enrolledCourseIds.includes(slug)),
  );
  const isBundle = requiredCourseSlugs.length > 1;
  const primaryCourseSlug = requiredCourseSlugs[0] || courseSlug;
  const continueHref = isBundle
    ? `/dashboard/courses?course=${encodeURIComponent(primaryCourseSlug)}`
    : `/dashboard/${encodeURIComponent(primaryCourseSlug)}`;

  if (isEnrolled) {
    return (
      <Link
        href={continueHref}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(79,70,229,0.30)]",
          className,
        )}
      >
        Continue Learning
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Link
        href={`/checkout/${courseSlug}`}
        aria-disabled={loading}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(79,70,229,0.30)]",
          loading && "pointer-events-none opacity-70",
        )}
      >
        {checkoutLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
      {showAdvisorWhenNotEnrolled ? (
        <Link
          href={advisorHref}
          className="inline-flex w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
        >
          Talk to Advisor
        </Link>
      ) : null}
    </div>
  );
}

