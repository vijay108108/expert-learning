"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getMyEnrollments, logFirestoreIssue } from "@/lib/firebase";
import { readEnrolledCourses } from "@/lib/my-learning";
import { getCourseSlugByCourseId } from "@/lib/offering-catalog";

function extractCourseSlug(pathname: string, selectedCourse: string | null) {
  if (pathname.startsWith("/lms/course/")) {
    const parts = pathname.split("/");
    return decodeURIComponent(parts[3] || "");
  }

  if (pathname === "/lms/player" && selectedCourse) {
    return selectedCourse;
  }

  return "";
}

function hasLocalVerifiedPurchase(targetCourseSlug: string) {
  const localCourseSlugs = readEnrolledCourses().map((course) => getCourseSlugByCourseId(course.courseSlug));
  const normalizedTargetCourseSlug = getCourseSlugByCourseId(targetCourseSlug);

  return normalizedTargetCourseSlug
    ? localCourseSlugs.includes(normalizedTargetCourseSlug)
    : localCourseSlugs.length > 0;
}

export function LmsRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();
  const { user, isAuthReady } = useAuth();
  const [result, setResult] = useState<{ key: string; allowed: boolean } | null>(null);

  const selectedCourse = search.get("course");
  const targetCourseSlug = extractCourseSlug(pathname, selectedCourse);
  const premiumRoute = pathname.startsWith("/lms/course/") || pathname === "/lms/player";
  const guardKey = useMemo(() => `${pathname}::${targetCourseSlug}::${user?.uid || "guest"}`, [pathname, targetCourseSlug, user?.uid]);

  useEffect(() => {
    let active = true;

    if (!isAuthReady) {
      return () => undefined;
    }

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return () => undefined;
    }

    if (!premiumRoute) {
      queueMicrotask(() => {
        if (!active) {
          return;
        }
        setResult({ key: guardKey, allowed: true });
      });
      return () => undefined;
    }

    void (async () => {
      try {
        const enrollments = await getMyEnrollments(user.uid);
        if (!active) {
          return;
        }

        const allowed = targetCourseSlug
          ? enrollments.some((item) => getCourseSlugByCourseId(item.courseId) === getCourseSlugByCourseId(targetCourseSlug))
          : enrollments.length > 0;
        const allowedWithLocalFallback = allowed || hasLocalVerifiedPurchase(targetCourseSlug);

        setResult({ key: guardKey, allowed: allowedWithLocalFallback });
        if (!allowedWithLocalFallback) {
          router.replace("/dashboard/courses");
        }
      } catch (error) {
        if (!active) {
          return;
        }

        logFirestoreIssue("[LMS Guard] Enrollment verification failed", error);
        const allowedWithLocalFallback = hasLocalVerifiedPurchase(targetCourseSlug);
        setResult({ key: guardKey, allowed: allowedWithLocalFallback });
        if (!allowedWithLocalFallback) {
          router.replace("/dashboard/courses");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [guardKey, isAuthReady, pathname, premiumRoute, router, targetCourseSlug, user]);

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (!result || result.key !== guardKey) {
    return null;
  }

  if (!result.allowed) {
    return null;
  }

  return <>{children}</>;
}
