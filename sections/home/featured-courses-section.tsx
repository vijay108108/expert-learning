import Link from "next/link";
import { allCourses, courseCategories } from "@/data/courses";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";

const featuredCourses = allCourses.slice(0, 8);

export function FeaturedCoursesSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.16),transparent_68%)]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14),transparent_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-12 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.14),transparent_72%)] blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel relative rounded-[32px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="Featured Programs"
              title="Premium certification tracks built for modern cloud and AI careers"
              description="Structured pathways across AWS, Azure, AI, GenAI, DevOps, and data engineering with mentor-led delivery, guided labs, and career support."
              theme="light"
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {courseCategories.map((category, index) => (
              <Reveal key={category.key} delay={index * 0.05}>
                <Link
                  href={category.href}
                  className="group surface-card flex h-full flex-col overflow-hidden rounded-[22px] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FB923C]/42 hover:bg-white/[0.09] hover:shadow-[0_24px_52px_rgba(2,8,28,0.46)]"
                >
                  <div className={`h-[3px] w-full rounded-t-[12px] bg-gradient-to-r ${category.gradient}`} />
                  <div className="mt-4 text-[15px] font-semibold text-white">{category.title}</div>
                  <p className="mt-3 text-[13px] leading-[1.75] text-[#E2E8F0]">{category.description}</p>
                  <span className="mt-5 inline-flex items-center text-[12px] font-semibold text-[#FDBA74] transition-transform duration-300 group-hover:translate-x-1">
                    View track
                  </span>
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
            <ButtonLink href="/courses" variant="outline" className="px-6 py-3">
              View All Courses
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
