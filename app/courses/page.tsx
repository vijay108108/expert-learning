import { CourseCatalogPage } from "@/components/courses/course-catalog-page";
import { allCourses, type Course } from "@/data/courses";
import { getMergedCourses } from "@/lib/firebase";

const hiddenCourseSlugs = new Set(["azure-administrator", "azure-devops-engineer"]);

async function getInitialCourses(): Promise<Course[]> {
  try {
    const mergedCourses = await getMergedCourses();
    if (Array.isArray(mergedCourses) && mergedCourses.length > 0) {
      return mergedCourses.filter((course) => !hiddenCourseSlugs.has(course.slug));
    }
  } catch {
    // Keep the statically bundled course catalog as a safe fallback.
  }

  return allCourses.filter((course) => !hiddenCourseSlugs.has(course.slug));
}

export default async function CoursesPage() {
  const initialCourses = await getInitialCourses();
  return <CourseCatalogPage initialCourses={initialCourses} />;
}
