import { NextResponse } from "next/server";
import { getMergedCourses } from "@/lib/firebase";

const hiddenCourseSlugs = new Set(["azure-administrator", "azure-devops-engineer"]);

function toPublicCourse(course: Awaited<ReturnType<typeof getMergedCourses>>[number]) {
  const publicFields = { ...course };
  delete (publicFields as { youtubeLessons?: unknown }).youtubeLessons;
  delete (publicFields as { lmsResources?: unknown }).lmsResources;
  delete (publicFields as { officialResources?: unknown }).officialResources;
  return publicFields;
}

export async function GET() {
  try {
    const courses = (await getMergedCourses())
      .filter((course) => !hiddenCourseSlugs.has(course.slug))
      .map(toPublicCourse);
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load courses." },
      { status: 500 },
    );
  }
}
