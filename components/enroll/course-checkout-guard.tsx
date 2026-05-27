"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";
import { cn } from "@/lib/utils";

type CourseCheckoutGuardProps = {
  courseSlug: string;
  children: ReactNode;
  className?: string;
};

export function CourseCheckoutGuard({ courseSlug, children, className }: CourseCheckoutGuardProps) {
  const { user, isAuthReady } = useAuth();
  const { enrolledCourseIds, loading } = useEnrolledCourseIds();
  const isEnrolled = Boolean(user && enrolledCourseIds.includes(courseSlug));

  if (!isAuthReady || (user && loading)) {
    return (
      <div className={cn("surface-form p-5 sm:p-7", className)}>
        <div className="section-label">Enrollment Status</div>
        <h3 className="mt-2 text-[22px] font-bold text-brand-text">Checking your access</h3>
        <p className="mt-4 text-sm leading-7 text-brand-muted">
          We&apos;re confirming whether this course is already active in your dashboard.
        </p>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div className={cn("surface-form p-5 sm:p-7", className)}>
        <div className="section-label">Already Enrolled</div>
        <h3 className="mt-2 text-[22px] font-bold text-brand-text">You are already enrolled in this course.</h3>
        <p className="mt-4 text-sm leading-7 text-brand-muted">
          Your payment and enrollment are already active. Continue learning from your dashboard instead of starting checkout again.
        </p>
        <Link
          href={`/dashboard/courses?course=${encodeURIComponent(courseSlug)}`}
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-[14px] border border-[rgba(96,165,250,0.38)] bg-[linear-gradient(135deg,rgba(37,99,235,0.92),rgba(59,130,246,0.88))] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(37,99,235,0.2),0_0_20px_rgba(96,165,250,0.12)] transition-all duration-200 hover:shadow-[0_20px_42px_rgba(37,99,235,0.26),0_0_24px_rgba(96,165,250,0.16)]"
        >
          Continue Learning
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
