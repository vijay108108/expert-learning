import Link from "next/link";
import { allCourses, courseCategories } from "@/data/courses";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";

const featuredCourses = allCourses.slice(0, 8);

export function FeaturedCoursesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Featured Programs"
            title="Premium certification tracks built for modern cloud and AI careers"
            description="Structured pathways across AWS, Azure, AI, GenAI, DevOps, and data engineering with mentor-led delivery, guided labs, and career support."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courseCategories.map((category, index) => (
            <Reveal key={category.key} delay={index * 0.05}>
              <Link
                href={category.href}
                className="group flex h-full flex-col rounded-[28px] border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-cyan/30 hover:shadow-[0_22px_54px_rgba(11,31,58,0.08)]"
              >
                <div className={`inline-flex rounded-full bg-gradient-to-r ${category.gradient} px-4 py-1 text-xs font-semibold text-white`}>
                  {category.title}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{category.description}</p>
                <span className="mt-6 text-sm font-semibold text-brand-cyan">View track</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.map((course, index) => (
            <Reveal key={course.slug} delay={0.05 * index}>
              <CourseCard course={course} featured={index === 1} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <ButtonLink href="/courses" variant="secondary">
            View All Courses
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
