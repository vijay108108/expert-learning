import { buildMetadata } from "@/lib/metadata";
import { allCourses, courseCategories } from "@/data/courses";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CourseGrid } from "@/sections/shared/course-grid";
import { CtaBand } from "@/sections/shared/cta-band";

export const metadata = buildMetadata({
  title: "All Courses | Expert Learning",
  description:
    "Browse all Expert Learning programs across AWS, Azure, AI, GenAI, cloud, DevOps, and data engineering.",
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
                <div className="rounded-[28px] border border-border bg-card p-6 shadow-soft">
                  <div className={`inline-flex rounded-full bg-gradient-to-r ${category.gradient} px-4 py-1 text-xs font-semibold text-white`}>
                    {category.title}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">{category.description}</p>
                </div>
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
              title="High-conviction programs for serious career acceleration"
              description="Every course includes practical curriculum design, mentor guidance, and a modern learner experience."
            />
          </Reveal>
          <div className="mt-12">
            <CourseGrid courses={allCourses} featuredSlug="aws-solutions-architect" />
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
