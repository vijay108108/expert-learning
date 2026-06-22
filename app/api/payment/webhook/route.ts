import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { CheckoutOffering } from "@/lib/offering-catalog";
import { getCanonicalCourseIdBySlug, getCourseSlugByCourseId, resolveCheckoutOfferings } from "@/lib/offering-catalog";
import { saveEnrollmentRecordAdmin } from "@/lib/firebase/enrollments-admin";
import { env } from "@/lib/env";

function verifyWebhookSignature(rawBody: string, signature: string) {
  if (!env.razorpayWebhookSecret) {
    return false;
  }

  const generated = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(generated, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-razorpay-signature") || "";
    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ success: false, message: "Invalid webhook signature." }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            notes?: Record<string, string | undefined>;
          };
        };
      };
    };

    if (payload.event !== "payment.captured") {
      return NextResponse.json({ success: true, ignored: true });
    }

    const entity = payload.payload?.payment?.entity;
    const notes = entity?.notes || {};
    const userId = notes.userId?.trim() || "";
    const name = notes.name?.trim() || "";
    const phone = notes.phone?.trim() || "";
    const email = notes.email?.trim() || "";
    const courseSlugs = (notes.courseSlugs || notes.courseSlug || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!userId || !entity?.id || !entity.order_id || !courseSlugs.length) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const { offerings } = resolveCheckoutOfferings(courseSlugs);

    function resolveEnrollmentMetaForOffering(offering: CheckoutOffering): {
      enrollmentType: "course" | "program";
      purchasedOfferingSlug: string;
      programSlug: string;
      programName: string;
      programCourseSlugs: string[];
      primaryCourseSlug: string;
    } {
      const isProgramPurchase = offering.kind === "bundle";

      return {
        enrollmentType: isProgramPurchase ? "program" : "course",
        purchasedOfferingSlug: offering.slug,
        programSlug: isProgramPurchase ? offering.slug : "",
        programName: isProgramPurchase ? offering.title : "",
        programCourseSlugs: isProgramPurchase ? offering.courseSlugs : [],
        primaryCourseSlug: offering.courseSlugs[0] || offering.slug,
      };
    }
    const enrolledAt = new Date().toISOString();

    await Promise.all(
      offerings.map((offering) => {
        const enrollmentMeta = resolveEnrollmentMetaForOffering(offering);
        const selected = offering;
        return saveEnrollmentRecordAdmin({
          userId,
          userName: name || "GenZNext Learner",
          userPhone: phone,
          userEmail: email,
          courseId: getCourseSlugByCourseId(enrollmentMeta.primaryCourseSlug),
          canonicalCourseId: getCanonicalCourseIdBySlug(enrollmentMeta.primaryCourseSlug),
          enrollmentType: enrollmentMeta.enrollmentType,
          purchasedOfferingSlug: enrollmentMeta.purchasedOfferingSlug,
          programSlug: enrollmentMeta.programSlug,
          programName: enrollmentMeta.programName,
          programCourseSlugs: enrollmentMeta.programCourseSlugs,
          primaryCourseSlug: enrollmentMeta.primaryCourseSlug,
          courseName: selected.title,
          amountPaid: Math.round(selected.priceValue),
          razorpayOrderId: entity.order_id || "",
          razorpayPaymentId: entity.id || "",
          invoiceNumber: `WEBHOOK-${entity.order_id?.slice(-8) || "NA"}`,
          enrolledAt,
          status: "active",
          duration: selected.duration,
          level: selected.level,
          companyName: notes.companyName?.trim() || "",
          gstNumber: notes.gstNumber?.trim() || "",
        });
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Webhook processing failed.",
      },
      { status: 400 },
    );
  }
}
