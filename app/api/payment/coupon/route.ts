import { NextResponse } from "next/server";
import { getCouponPricing } from "@/lib/coupons";
import { resolveCheckoutOfferings } from "@/lib/offering-catalog";
import { paymentCouponSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = paymentCouponSchema.parse(await request.json());
    const requestedSlugs = body.courseSlugs?.length ? body.courseSlugs : body.courseSlug ? [body.courseSlug] : [];
    const { offerings, missing } = resolveCheckoutOfferings(requestedSlugs);

    if (missing.length > 0 || offerings.length !== requestedSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    const subtotalPaise = offerings.reduce((sum, offering) => sum + (offering.priceValue * 100), 0);
    const pricing = getCouponPricing(subtotalPaise, body.couponCode);

    if (!pricing.isApplied) {
      return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully",
      pricing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to validate coupon code.",
      },
      { status: 400 },
    );
  }
}
