import { NextResponse } from "next/server";
import { getMergedCourses } from "@/lib/firebase";

export async function GET() {
  try {
    const courses = await getMergedCourses();
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load courses." },
      { status: 500 },
    );
  }
}
