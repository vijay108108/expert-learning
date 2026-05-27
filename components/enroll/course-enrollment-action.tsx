"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";
import { cn } from "@/lib/utils";

type CourseEnrollmentActionProps = {
  courseSlug: string;
  checkoutHref?: string;
  checkoutLabel?: string;
  enrolledLabel?: string;
  checkoutButtonClassName?: string;
  enrolledButtonClassName?: string;
  helperClassName?: string;
  checkoutHelperText?: string;
  enrolledHelperText?: string;
};

const baseButtonClasses =
  "inline-flex min-h-[48px] w-full items-center justify-center rounded-[14px] px-5 py-3 text-sm font-semibold transition-all duration-200";

const checkoutButtonClasses =
  "bg-[linear-gradient(135deg,#F97316,#EA580C)] text-white shadow-[0_16px_34px_rgba(249,115,22,0.22),0_0_20px_rgba(249,115,22,0.12)] hover:shadow-[0_20px_42px_rgba(249,115,22,0.28),0_0_24px_rgba(249,115,22,0.16)]";

const enrolledButtonClasses =
  "border border-[rgba(96,165,250,0.38)] bg-[linear-gradient(135deg,rgba(37,99,235,0.92),rgba(59,130,246,0.88))] text-white shadow-[0_16px_34px_rgba(37,99,235,0.2),0_0_20px_rgba(96,165,250,0.12)] hover:shadow-[0_20px_42px_rgba(37,99,235,0.26),0_0_24px_rgba(96,165,250,0.16)]";

export function CourseEnrollmentAction({
  courseSlug,
  checkoutHref,
  checkoutLabel = "Enroll Now",
  enrolledLabel = "Continue Learning",
  checkoutButtonClassName,
  enrolledButtonClassName,
  helperClassName,
  checkoutHelperText = "You'll complete your details and payment on a dedicated secure checkout page.",
  enrolledHelperText = "You are already enrolled in this program. Continue from your learning dashboard.",
}: CourseEnrollmentActionProps) {
  const { user, isAuthReady } = useAuth();
  const { enrolledCourseIds, loading } = useEnrolledCourseIds();
  const isEnrolled = Boolean(user && enrolledCourseIds.includes(courseSlug));
  const targetHref = isEnrolled
    ? `/dashboard/courses?course=${encodeURIComponent(courseSlug)}`
    : checkoutHref || `/checkout/${encodeURIComponent(courseSlug)}`;
  const buttonLabel = !isAuthReady
    ? "Checking Access..."
    : user && loading
      ? "Checking Enrollment..."
      : isEnrolled
        ? enrolledLabel
        : checkoutLabel;

  return (
    <>
      <Link
        href={targetHref}
        aria-disabled={Boolean(user && (!isAuthReady || loading && !isEnrolled))}
        className={cn(
          baseButtonClasses,
          isEnrolled ? enrolledButtonClasses : checkoutButtonClasses,
          (!isAuthReady || (user && loading)) && "pointer-events-none opacity-70",
          isEnrolled ? enrolledButtonClassName : checkoutButtonClassName,
        )}
      >
        {buttonLabel}
      </Link>
      <p className={cn("mt-3 text-center text-[12px] leading-5 text-brand-muted", helperClassName)}>
        {isEnrolled ? enrolledHelperText : checkoutHelperText}
      </p>
    </>
  );
}
