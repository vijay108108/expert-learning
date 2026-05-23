"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getMyEnrollments, logFirestoreIssue } from "@/lib/firebase";

export function useEnrolledCourseIds() {
  const { user } = useAuth();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    void (async () => {
      if (!user) {
        if (active) {
          setEnrolledCourseIds([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const enrollments = await getMyEnrollments(user.uid);

        if (!active) {
          return;
        }

        setEnrolledCourseIds(
          Array.from(new Set(enrollments.map((enrollment) => enrollment.courseId))),
        );
      } catch (error) {
        if (!active) {
          return;
        }

        logFirestoreIssue("[Courses] Unable to load enrolled course ids", error);
        setEnrolledCourseIds([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  return {
    enrolledCourseIds,
    loading,
  };
}
