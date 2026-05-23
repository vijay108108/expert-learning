import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import {
  courseCategories,
  coursesByCategory,
  getCategoryData,
  type CourseCategoryKey,
} from "@/data/courses";
import { getCategorySectionHref } from "@/lib/course-catalog";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CourseGrid } from "@/sections/shared/course-grid";
import { CtaBand } from "@/sections/shared/cta-band";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return courseCategories.map((category) => ({ category: category.key }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryData = getCategoryData(category);

  if (!categoryData) {
    return buildMetadata({
      title: "Courses | GenZNext Research & Training",
      description: "GenZNext Research & Training professional courses.",
      path: "/courses",
    });
  }

  return buildMetadata({
    title: `${categoryData.title} | GenZNext Research & Training`,
    description: categoryData.description,
    path: `/courses/${category}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = getCategoryData(category);

  if (!categoryData) {
    notFound();
  }

  const courses = coursesByCategory[category as CourseCategoryKey];
  const refinedCategories = new Set(["aws", "azure", "ai", "devops"]);
  const featuredSlug = refinedCategories.has(category)
    ? courses.find((course) => course.tagLabel.toLowerCase().includes("popular"))?.slug || courses[0]?.slug
    : courses[0]?.slug;

  return (
    <>
      <PageHero
        eyebrow={
          category === "ai"
            ? "AI Courses — Summer Training 2026"
            : category === "devops"
              ? "DevOps Courses — Summer Training 2026"
              : categoryData.title
        }
        title={`Build momentum with ${categoryData.title.toLowerCase()}`}
        description={categoryData.description}
        primaryCta={{ label: "Apply Now", href: "#course-listing" }}
        secondaryCta={{
          label: "Book Free Demo",
          modalCourse: categoryData.title,
          modalMessage: `I would like a free demo for ${categoryData.title}.`,
          modalSource: `${categoryData.title} Demo Request`,
        }}
      />
      <section id="course-listing" className="scroll-mt-28 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow={
                category === "aws"
                  ? "AWS Courses - Summer Training 2026"
                  : category === "azure"
                    ? "Azure Courses - Summer Training 2026"
                    : category === "devops"
                      ? "DevOps Courses - Summer Training 2026"
                      : "AI Courses - Summer Training 2026"
              }
              title="Industry-relevant curriculum with certification clarity"
              description="Learn through live classes, practical assignments, and mentor-led feedback loops tailored to this track."
            />
          </Reveal>
          <div className="mt-12">
            <CourseGrid
              courses={courses}
              featuredSlug={featuredSlug}
              variant={refinedCategories.has(category) ? "refined" : "default"}
            />
          </div>
        </div>
      </section>
      <CtaBand
        title={`Want to compare ${categoryData.title} tracks before you enroll?`}
        description="We will help you choose the right course based on your experience level, timeline, and career goals."
        primaryHref={getCategorySectionHref(category)}
        secondaryDemoCourse={categoryData.title}
        secondaryDemoMessage={`I would like a demo and comparison for ${categoryData.title}.`}
      />
    </>
  );
}
