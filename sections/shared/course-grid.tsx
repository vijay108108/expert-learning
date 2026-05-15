import type { Course } from "@/data/courses";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";

export function CourseGrid({
  courses,
  featuredSlug,
}: {
  courses: Course[];
  featuredSlug?: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {courses.map((course, index) => (
        <Reveal key={course.slug} delay={index * 0.04}>
          <CourseCard course={course} featured={course.slug === featuredSlug} />
        </Reveal>
      ))}
    </div>
  );
}
