import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import {
  courseCategories,
  coursesByCategory,
  getCategoryData,
  type CourseCategoryKey,
} from "@/data/courses";
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
      title: "Courses | Expert Learning",
      description: "Expert Learning professional courses.",
      path: "/courses",
    });
  }

  return buildMetadata({
    title: `${categoryData.title} | Expert Learning`,
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

  return (
    <>
      <PageHero
        eyebrow={categoryData.title}
        title={`Build momentum with ${categoryData.title.toLowerCase()}`}
        description={categoryData.description}
        primaryCta={{ label: "Apply Now", href: "/contact" }}
        secondaryCta={{ label: "Book Free Demo", href: "/contact" }}
      />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Programs"
              title="Industry-relevant curriculum with certification clarity"
              description="Learn through live classes, practical assignments, and mentor-led feedback loops tailored to this track."
            />
          </Reveal>
          <div className="mt-12">
            <CourseGrid courses={courses} featuredSlug={courses[0]?.slug} />
          </div>
        </div>
      </section>
      <CtaBand
        title={`Want to compare ${categoryData.title} tracks before you enroll?`}
        description="We will help you choose the right course based on your experience level, timeline, and career goals."
      />
    </>
  );
}
