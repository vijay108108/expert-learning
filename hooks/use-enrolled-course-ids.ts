"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getMyEnrollments, logFirestoreIssue } from "@/lib/firebase";
import { getCourseSlugByCourseId } from "@/lib/offering-catalog";
import { enrollmentsUpdatedEventName, readEnrolledCourses } from "@/lib/my-learning";

type EnrolledMeta = {
  enrolledAt?: string;
  status?: string;
};

export function useEnrolledCourseIds() {
  const { user } = useAuth();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrolledMetaByCourseId, setEnrolledMetaByCourseId] = useState<Record<string, EnrolledMeta>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const buildLocalState = () => {
      const localCourses = readEnrolledCourses();
      return {
        enrolledCourseIds: localCourses.map((course) => course.courseSlug),
        enrolledMetaByCourseId: Object.fromEntries(
          localCourses.map((course) => [
            course.courseSlug,
            {
              enrolledAt: course.enrolledAt,
              status: course.status || "active",
            } satisfies EnrolledMeta,
          ]),
        ),
      };
    };

    const syncFromLocal = () => {
      if (!active) {
        return;
      }

      const nextLocalState = buildLocalState();
      setEnrolledCourseIds(nextLocalState.enrolledCourseIds);
      setEnrolledMetaByCourseId(nextLocalState.enrolledMetaByCourseId);
    };

    void (async () => {
      if (!user) {
        if (active) {
          setEnrolledCourseIds([]);
          setEnrolledMetaByCourseId({});
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const enrollments = await getMyEnrollments(user.uid);
        const nextLocalState = buildLocalState();

        if (!active) {
          return;
        }

        const firestoreIds = enrollments.map((enrollment) => getCourseSlugByCourseId(enrollment.courseId));
        const mergedIds = Array.from(new Set([...firestoreIds, ...nextLocalState.enrolledCourseIds]));
        const mergedMeta = Object.fromEntries(
          mergedIds.map((courseId) => {
            const firestoreMatch = enrollments.find(
              (enrollment) => getCourseSlugByCourseId(enrollment.courseId) === courseId,
            );
            const localMatch = nextLocalState.enrolledMetaByCourseId[courseId];
            return [
              courseId,
              {
                enrolledAt: firestoreMatch?.enrolledAt || localMatch?.enrolledAt,
                status: firestoreMatch?.status || localMatch?.status || "active",
              } satisfies EnrolledMeta,
            ];
          }),
        );

        setEnrolledCourseIds(mergedIds);
        setEnrolledMetaByCourseId(mergedMeta);
      } catch (error) {
        if (!active) {
          return;
        }

        logFirestoreIssue("[Courses] Unable to load enrolled course ids", error);
        const nextLocalState = buildLocalState();
        setEnrolledCourseIds(nextLocalState.enrolledCourseIds);
        setEnrolledMetaByCourseId(nextLocalState.enrolledMetaByCourseId);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    window.addEventListener("storage", syncFromLocal);
    window.addEventListener(enrollmentsUpdatedEventName, syncFromLocal);
    syncFromLocal();

    return () => {
      active = false;
      window.removeEventListener("storage", syncFromLocal);
      window.removeEventListener(enrollmentsUpdatedEventName, syncFromLocal);
    };
  }, [user]);

  return {
    enrolledCourseIds,
    enrolledMetaByCourseId,
    loading,
  };
}
