import { NextResponse } from "next/server";
import { getCoursesBySlugs, parsePriceToPaise } from "@/lib/course-catalog";
import { env } from "@/lib/env";
import { getRazorpayClient } from "@/lib/services/payments";
import { paymentCreateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = paymentCreateSchema.parse(await request.json());
    const razorpay = getRazorpayClient();
    const courseSlugs = body.courseSlugs?.length ? body.courseSlugs : body.courseSlug ? [body.courseSlug] : [];
    const courses = getCoursesBySlugs(courseSlugs);

    if (courses.length !== courseSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    const subtotalPaise = courses.reduce((sum, course) => {
      const price = parsePriceToPaise(course.price);
      return sum + (price || 0);
    }, 0);
    const amount = subtotalPaise;

    if (!amount || !razorpay) {
      return NextResponse.json(
        { success: false, message: "Razorpay is not configured for this environment." },
        { status: 503 },
      );
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `${courseSlugs[0]?.slice(0, 18) || "cart"}-${courseSlugs.length}-${Date.now()}`.slice(0, 40),
      notes: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        courseSlug: courseSlugs[0],
        courseSlugs: courseSlugs.join(","),
        gstNumber: body.gstNumber?.trim() || "",
        companyName: body.companyName?.trim() || "",
      },
    });

    return NextResponse.json({
      success: true,
      keyId: env.nextPublicRazorpayKeyId,
      order,
      courses,
    });
  } catch (error) {
    const statusCode =
      error && typeof error === "object" && "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : 400;
    const razorpayDescription =
      error &&
      typeof error === "object" &&
      "error" in error &&
      error.error &&
      typeof error.error === "object" &&
      "description" in error.error &&
      typeof error.error.description === "string"
        ? error.error.description
        : "";
    const message =
      statusCode === 401
        ? "Razorpay authentication failed. Check NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
        : razorpayDescription || (error instanceof Error ? error.message : "Unable to create payment order.");

    console.error("[Payment Create] order creation failed", {
      statusCode,
      razorpayDescription,
      error,
    });

    return NextResponse.json(
      { success: false, message },
      { status: statusCode >= 400 && statusCode < 600 ? statusCode : 400 },
    );
  }
}
