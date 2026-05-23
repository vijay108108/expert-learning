"use client";

import type { Course } from "@/data/courses";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";

export function CourseGrid({
  courses,
  featuredSlug,
  variant = "default",
  badgeOverrides,
}: {
  courses: Course[];
  featuredSlug?: string;
  variant?: "default" | "refined";
  badgeOverrides?: Record<string, { label: string; tone: "green" | "orange" | "blue" | "purple" }>;
}) {
  const { enrolledCourseIds } = useEnrolledCourseIds();

  return (
    <div className={variant === "refined" ? "grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-4" : "grid gap-6 md:grid-cols-2 xl:grid-cols-4"}>
      {courses.map((course, index) => (
        <Reveal key={course.slug} delay={index * 0.04} className="h-full">
          <CourseCard
            course={course}
            featured={course.slug === featuredSlug}
            variant={variant}
            badgeOverride={badgeOverrides?.[course.slug]}
            isEnrolled={enrolledCourseIds.includes(course.slug)}
          />
        </Reveal>
      ))}
    </div>
  );
}
