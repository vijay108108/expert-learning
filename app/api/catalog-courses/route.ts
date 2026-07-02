import { NextResponse } from "next/server";
import { getMergedCourses } from "@/lib/firebase";

const hiddenCourseSlugs = new Set(["azure-administrator", "azure-devops-engineer"]);

export async function GET() {
  try {
    const courses = (await getMergedCourses()).filter((course) => !hiddenCourseSlugs.has(course.slug));
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load courses." },
      { status: 500 },
    );
  }
}
