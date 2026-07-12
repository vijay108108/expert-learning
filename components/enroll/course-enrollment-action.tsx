"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";
import { trackRegisterClick } from "@/lib/client-analytics";
import { expandRequestedCourseSlugs } from "@/lib/offering-catalog";
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
  "bg-[linear-gradient(135deg,#0B2E6B,#092552)] text-white shadow-[0_16px_34px_rgba(249,115,22,0.22),0_0_20px_rgba(249,115,22,0.12)] hover:shadow-[0_20px_42px_rgba(249,115,22,0.28),0_0_24px_rgba(249,115,22,0.16)]";

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
  const router = useRouter();
  const { openAuthModal, user, isAuthReady } = useAuth();
  const { enrolledCourseIds, enrolledMetaByCourseId, loading } = useEnrolledCourseIds();
  const requiredCourseSlugs = expandRequestedCourseSlugs([courseSlug]);
  const isBundle = requiredCourseSlugs.length > 1;
  const isEnrolled = Boolean(
    user
    && requiredCourseSlugs.length > 0
    && requiredCourseSlugs.every((slug) => enrolledCourseIds.includes(slug)),
  );
  const primaryCourseSlug = requiredCourseSlugs[0] || courseSlug;
  const enrolledMeta = enrolledMetaByCourseId[primaryCourseSlug];
  const enrolledDate = enrolledMeta?.enrolledAt
    ? new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date(enrolledMeta.enrolledAt))
    : null;
  const targetHref = isEnrolled
    ? (isBundle ? `/dashboard/courses?course=${encodeURIComponent(primaryCourseSlug)}` : `/dashboard/${encodeURIComponent(primaryCourseSlug)}`)
    : checkoutHref || `/checkout/${encodeURIComponent(courseSlug)}`;
  const buttonLabel = !isAuthReady
    ? "Checking Access..."
    : user && loading
      ? "Checking Enrollment..."
      : isEnrolled
        ? enrolledLabel
        : checkoutLabel;
  const enrollmentTarget = checkoutHref || `/checkout/${encodeURIComponent(courseSlug)}`;
  const shouldPromptAuthChoice = !isEnrolled && !user;
  const isWorkshopLaunchLab = courseSlug === "ai-developer-launch-lab";
  const workshopSignupHref = `/signup?redirect=${encodeURIComponent(enrollmentTarget)}`;

  function handleRegisterClick() {
    if (!isWorkshopLaunchLab) {
      return;
    }

    trackRegisterClick();
  }

  function handleUnauthedAction() {
    handleRegisterClick();

    if (isWorkshopLaunchLab) {
      router.push(workshopSignupHref);
      return;
    }

    openAuthModal("choice", enrollmentTarget);
  }

  return (
    <div>
      {isEnrolled ? (
        <div className="mb-2 flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
            Enrolled
          </span>
          <span className="text-[#6B7280]">
            {enrolledMeta?.status ? `Status: ${enrolledMeta.status}` : "Status: Active"}
            {enrolledDate ? ` • ${enrolledDate}` : ""}
          </span>
        </div>
      ) : null}
      {shouldPromptAuthChoice ? (
        <button
          type="button"
          onClick={handleUnauthedAction}
          disabled={!isAuthReady}
          className={cn(
            baseButtonClasses,
            checkoutButtonClasses,
            !isAuthReady && "pointer-events-none opacity-70",
            checkoutButtonClassName,
          )}
        >
          {buttonLabel}
        </button>
      ) : (
        <Link
          href={targetHref}
          onClick={() => {
            if (!isEnrolled) {
              handleRegisterClick();
            }
          }}
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
      )}
      <p className={cn("mt-3 text-center text-[12px] leading-5 text-brand-muted", helperClassName)}>
        {isEnrolled ? enrolledHelperText : checkoutHelperText}
      </p>
    </div>
  );
}
