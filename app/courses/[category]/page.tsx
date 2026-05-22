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
  const featuredSlug =
    category === "azure"
      ? "azure-solutions-architect"
      : category === "ai"
        ? "generative-ai"
      : refinedCategories.has(category)
        ? courses.find((course) => course.highlight.toLowerCase().includes("popular"))?.slug || courses[0]?.slug
        : courses[0]?.slug;
  const badgeOverridesByCategory: Record<string, Record<string, { label: string; tone: "green" | "orange" | "blue" | "purple" }>> = {
    aws: {
      "aws-cloud-practitioner": { label: "Best for beginners", tone: "green" },
      "aws-solutions-architect": { label: "Most popular", tone: "orange" },
      "aws-devops-engineer": { label: "For professionals", tone: "blue" },
      "aws-sysops-administrator": { label: "Ops focused", tone: "purple" },
    },
    azure: {
      "azure-administrator": { label: "Best for beginners", tone: "green" },
      "azure-security-engineer": { label: "Microsoft focused", tone: "blue" },
      "azure-devops-engineer": { label: "For professionals", tone: "purple" },
      "azure-solutions-architect": { label: "Most popular", tone: "orange" },
    },
    ai: {
      "ai-machine-learning-fundamentals": { label: "Best for beginners", tone: "green" },
      "generative-ai": { label: "Most popular", tone: "orange" },
      "mlops-ai-deployment": { label: "For professionals", tone: "blue" },
      "ai-data-science-analytics": { label: "Data focused", tone: "purple" },
    },
    devops: {
      "devops-fundamentals": { label: "Best for beginners", tone: "green" },
      "docker-kubernetes": { label: "Most popular", tone: "orange" },
      "ci-cd-pipeline-engineering": { label: "For professionals", tone: "blue" },
      "devops-monitoring-security": { label: "Monitoring focused", tone: "purple" },
    },
  };

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
              badgeOverrides={badgeOverridesByCategory[category]}
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
