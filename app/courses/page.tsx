import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { courseCategories, coursesByCategory } from "@/data/courses";
import { getCategorySectionHref, getCategorySectionId } from "@/lib/course-catalog";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CourseGrid } from "@/sections/shared/course-grid";
import { CtaBand } from "@/sections/shared/cta-band";

export const metadata = buildMetadata({
  title: "All Courses | GenZNext Research & Training",
  description:
    "Browse all GenZNext Research & Training programs across AWS, Azure, AI, GenAI, cloud, DevOps, and data engineering.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="All Courses"
        title="Certification and career programs across cloud, AI, and DevOps"
        description="Browse our full catalog of premium programs built for students, professionals, developers, and enterprise teams."
      />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Categories"
              title="Choose the pathway that matches your next role"
              description="Each track is designed around role readiness, hands-on learning, and structured career support."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {courseCategories.map((category, index) => (
              <Reveal key={category.key} delay={index * 0.05}>
                <Link
                  href={getCategorySectionHref(category.key)}
                  className="surface-card block p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-blue/30"
                >
                  <div className={`h-[3px] w-full rounded-t-[12px] bg-gradient-to-r ${category.gradient}`} />
                  <div className="mt-4 text-[14px] font-semibold text-brand-text">{category.title}</div>
                  <p className="mt-3 text-[12px] leading-[1.65] text-brand-muted">{category.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Catalog"
              title="Browse every training track by specialization"
              description="Explore each category section below and compare the course cards, pricing, duration, and official syllabus links without leaving the main catalog flow."
            />
          </Reveal>
          <div className="mt-12 space-y-16">
            {courseCategories.map((category, index) => (
              <section key={category.key} id={getCategorySectionId(category.key)} className="scroll-mt-28">
                <Reveal delay={index * 0.04}>
                  <SectionHeading
                    eyebrow={category.title}
                    title={`Explore ${category.title.toLowerCase()} tracks`}
                    description={category.description}
                  />
                </Reveal>
                <div className="mt-10">
                  <CourseGrid
                    courses={coursesByCategory[category.key]}
                    featuredSlug={coursesByCategory[category.key][0]?.slug}
                  />
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Not sure which course fits your profile?"
        description="Talk to our team for a role-based recommendation and personalized learning roadmap."
      />
    </>
  );
}
