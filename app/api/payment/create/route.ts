import { NextResponse } from "next/server";
import { getCouponPricing } from "@/lib/coupons";
import { resolveCheckoutOfferings } from "@/lib/offering-catalog";
import { findExistingEnrollmentCourseIds, isFirestorePermissionError, logFirestoreIssue } from "@/lib/firebase";
import { env } from "@/lib/env";
import { verifyFirebaseBearerToken } from "@/lib/server/firebase-auth";
import { getRazorpayClient } from "@/lib/services/payments";
import { paymentCreateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const authUser = await verifyFirebaseBearerToken(request);

    if (!authUser) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const body = paymentCreateSchema.parse(await request.json());
    const razorpay = getRazorpayClient();
    const requestedSlugs = body.courseSlugs?.length ? body.courseSlugs : body.courseSlug ? [body.courseSlug] : [];
    const { offerings, missing } = resolveCheckoutOfferings(requestedSlugs);

    if (missing.length > 0 || offerings.length !== requestedSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    if (authUser.uid) {
      try {
        const duplicateCourses = await findExistingEnrollmentCourseIds(
          authUser.uid,
          offerings.flatMap((offering) => offering.courseSlugs),
        );

        if (duplicateCourses.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message:
                duplicateCourses.length === 1
                  ? "You are already enrolled in this course."
                  : "One or more selected courses are already enrolled in your account.",
            },
            { status: 409 },
          );
        }
      } catch (error) {
        if (!isFirestorePermissionError(error)) {
          throw error;
        }

        logFirestoreIssue("[Payment Create] Skipping server enrollment lookup", error);
      }
    }

    const subtotalPaise = offerings.reduce((sum, offering) => sum + (offering.priceValue * 100), 0);
    const pricing = getCouponPricing(subtotalPaise, body.couponCode);

    if (body.couponCode.trim() && !pricing.isApplied) {
      return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 400 });
    }

    const amount = pricing.finalAmountPaise;

    if (!amount || !razorpay) {
      return NextResponse.json(
        { success: false, message: "Razorpay is not configured for this environment." },
        { status: 503 },
      );
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `${requestedSlugs[0]?.slice(0, 18) || "cart"}-${requestedSlugs.length}-${Date.now()}`.slice(0, 40),
      notes: {
        userId: authUser.uid,
        name: body.name,
        email: body.email,
        phone: body.phone,
        courseSlug: requestedSlugs[0],
        courseSlugs: requestedSlugs.join(","),
        gstNumber: body.gstNumber?.trim() || "",
        companyName: body.companyName?.trim() || "",
        couponCode: pricing.appliedCouponCode,
        subtotalPaise: String(pricing.subtotalPaise),
        discountPaise: String(pricing.discountPaise),
        finalAmountPaise: String(pricing.finalAmountPaise),
      },
    });

    return NextResponse.json({
      success: true,
      keyId: env.nextPublicRazorpayKeyId,
      order,
      courses: offerings,
      pricing,
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
