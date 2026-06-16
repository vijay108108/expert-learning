import { NextResponse } from "next/server";
import { formatPaiseToPrice, getCourseBySlug, parsePriceToPaise } from "@/lib/course-catalog";
import { captureServerEvent } from "@/lib/services/analytics";
import { sendEnrollmentEmail } from "@/lib/services/email";
import { upsertStudent } from "@/lib/services/students";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { enrollmentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key") || "";
    const expectedKey = process.env.ADMIN_SETUP_KEY || "";
    if (!expectedKey || adminKey !== expectedKey) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = enrollmentSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Supabase is not configured for enrollments." },
        { status: 503 },
      );
    }

    const course = getCourseBySlug(body.courseSlug);
    const amount = body.amount ?? (course ? parsePriceToPaise(course.price) : null);

    const studentId = await upsertStudent({
      name: body.name,
      email: body.email,
      phone: body.phone,
    });

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        student_id: studentId,
        course_slug: body.courseSlug,
        amount: amount ? Math.round(amount / 100) : null,
        payment_id: body.paymentId || null,
        status: body.status,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error("Unable to create enrollment.");
    }

    await Promise.allSettled([
      sendEnrollmentEmail({
        name: body.name,
        email: body.email,
        phone: body.phone,
        courseTitle: course?.title || body.courseSlug,
        paymentId: body.paymentId || "-",
        amountLabel: amount ? formatPaiseToPrice(amount) : "-",
      }),
      captureServerEvent(body.email, "manual_enrollment_created", {
        courseSlug: body.courseSlug,
      }),
    ]);

    return NextResponse.json({ success: true, enrollment: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Enrollment failed." },
      { status: 400 },
    );
  }
}
