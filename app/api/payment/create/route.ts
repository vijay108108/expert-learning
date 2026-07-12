import { after, NextResponse } from "next/server";
import { allocatePaiseProportionally, GENZ100_COUPON_CODE, getCouponPricing } from "@/lib/coupons";
import { formatPaiseToPrice } from "@/lib/course-catalog";
import { createInvoiceNumber, getInclusiveGstBreakup, type StoredOrderSuccess } from "@/lib/order-success";
import { getCanonicalCourseIdBySlug, getCourseSlugByCourseId, resolveCheckoutOfferings, type CheckoutOffering } from "@/lib/offering-catalog";
import { findExistingEnrollmentCourseIds, isFirestorePermissionError, logFirestoreIssue } from "@/lib/firebase";
import { env } from "@/lib/env";
import { saveEnrollmentRecordAdmin } from "@/lib/firebase/enrollments-admin";
import { saveInvoiceRecordAdmin } from "@/lib/firebase/invoices-admin";
import { upsertUserProfileAdminFromPayment } from "@/lib/firebase/user-profiles-admin";
import type { PersistedInvoiceRecord } from "@/lib/invoices";
import { verifyFirebaseBearerToken } from "@/lib/server/firebase-auth";
import { captureServerEvent } from "@/lib/services/analytics";
import { sendEnrollmentEmail } from "@/lib/services/email";
import { getRazorpayClient } from "@/lib/services/payments";
import { sendWhatsAppNotification } from "@/lib/services/whatsapp";
import { paymentCreateSchema } from "@/lib/validations";

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

export async function POST(request: Request) {
  try {
    const authUser = await verifyFirebaseBearerToken(request);
    const isGuestCheckout = !authUser;

    const body = paymentCreateSchema.parse(await request.json());
    const razorpay = getRazorpayClient();
    const requestedSlugs = body.courseSlugs?.length ? body.courseSlugs : body.courseSlug ? [body.courseSlug] : [];
    const { offerings, missing } = resolveCheckoutOfferings(requestedSlugs);

    if (missing.length > 0 || offerings.length !== requestedSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    if (authUser?.uid) {
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

    if (amount === 0) {
      if (pricing.appliedCouponCode !== GENZ100_COUPON_CODE) {
        return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 400 });
      }

      const lineItemPaise = allocatePaiseProportionally(
        pricing.finalAmountPaise,
        offerings.map((offering) => offering.priceValue * 100),
      );
      const paidAtIso = new Date().toISOString();
      const invoiceOrderId = `FREE-${Date.now()}-${(authUser?.uid || body.phone).slice(-6)}`;
      const invoiceNumber = createInvoiceNumber(invoiceOrderId, paidAtIso);
      const paymentMethod = "Coupon";
      const enrolledAt = paidAtIso;
      const gstInvoiceEnabled = Boolean(body.gstNumber?.trim());
      const { baseAmountPaise, gstPaise, totalPaidPaise } = getInclusiveGstBreakup(pricing.finalAmountPaise, gstInvoiceEnabled);
      const invoice: StoredOrderSuccess = {
        invoiceNumber,
        orderId: invoiceOrderId,
        paymentId: "",
        paymentMethod,
        paidAtIso,
        subtotalPaise,
        discountPaise: pricing.discountPaise,
        discountPercentage: pricing.discountPercent,
        appliedCouponCode: pricing.appliedCouponCode || undefined,
        baseAmountPaise,
        gstPaise,
        totalPaidPaise,
        platformFeeLabel: "Included",
        gstInvoiceEnabled,
        customer: {
          name: body.name,
          phone: body.phone,
          email: body.email || undefined,
          companyName: body.companyName?.trim() || undefined,
          gstNumber: body.gstNumber?.trim() || undefined,
        },
        courses: offerings.map((offering, index) => {
          const enrollmentMeta = resolveEnrollmentMetaForOffering(offering);
          return {
            slug: enrollmentMeta.primaryCourseSlug,
            title: offering.title,
            duration: offering.duration,
            level: offering.level,
            amountPaise: lineItemPaise[index] || 0,
            originalAmountPaise: offering.priceValue * 100,
            discountAmountPaise: (offering.priceValue * 100) - (lineItemPaise[index] || 0),
            finalPaidAmountPaise: lineItemPaise[index] || 0,
            couponCode: pricing.appliedCouponCode || undefined,
            discountPercentage: pricing.discountPercent,
            paymentStatus: "free",
            enrollmentType: enrollmentMeta.enrollmentType,
            purchasedOfferingSlug: enrollmentMeta.purchasedOfferingSlug,
            programSlug: enrollmentMeta.programSlug,
            programName: enrollmentMeta.programName,
            programCourseSlugs: enrollmentMeta.programCourseSlugs,
            primaryCourseSlug: enrollmentMeta.primaryCourseSlug,
          };
        }),
      };

      let clientSyncRequired = false;

      if (!isGuestCheckout && authUser) {
        let enrollmentSaved = false;

        try {
          await Promise.all(
            offerings.map((offering, index) => {
              const enrollmentMeta = resolveEnrollmentMetaForOffering(offering);
              const allocatedAmountPaise = lineItemPaise[index] || 0;

              return saveEnrollmentRecordAdmin({
                userId: authUser.uid,
                userName: body.name,
                userPhone: body.phone,
                userEmail: body.email,
                courseId: getCourseSlugByCourseId(enrollmentMeta.primaryCourseSlug),
                canonicalCourseId: getCanonicalCourseIdBySlug(enrollmentMeta.primaryCourseSlug),
                enrollmentType: enrollmentMeta.enrollmentType,
                purchasedOfferingSlug: enrollmentMeta.purchasedOfferingSlug,
                programSlug: enrollmentMeta.programSlug,
                programName: enrollmentMeta.programName,
                programCourseSlugs: enrollmentMeta.programCourseSlugs,
                primaryCourseSlug: enrollmentMeta.primaryCourseSlug,
                courseName: offering.title,
                amountPaid: Math.round(allocatedAmountPaise / 100),
                couponCode: pricing.appliedCouponCode,
                discountPercentage: pricing.discountPercent,
                originalAmount: Math.round((offering.priceValue * 100) / 100),
                discountAmount: Math.round(((offering.priceValue * 100) - allocatedAmountPaise) / 100),
                finalPaidAmount: Math.round(allocatedAmountPaise / 100),
                paymentStatus: "free",
                razorpayOrderId: invoiceOrderId,
                razorpayPaymentId: "",
                invoiceNumber,
                enrolledAt,
                status: "active",
                duration: offering.duration,
                level: offering.level,
                companyName: body.companyName?.trim() || "",
                gstNumber: body.gstNumber?.trim() || "",
              });
            }),
          );
          enrollmentSaved = true;
        } catch (error) {
          clientSyncRequired = true;
          logFirestoreIssue("[Payment Create] Free coupon enrollment save failed; client sync required", error);
        }

        try {
          await upsertUserProfileAdminFromPayment({
            uid: authUser.uid,
            name: body.name,
            email: body.email,
            phone: body.phone,
            createdAt: paidAtIso,
          });
        } catch (error) {
          logFirestoreIssue("[Payment Create] Free coupon profile sync failed", error);
        }

        try {
          await saveInvoiceRecordAdmin({
            ...invoice,
            userId: authUser.uid,
            paymentStatus: "free",
          } satisfies PersistedInvoiceRecord);
        } catch (error) {
          if (enrollmentSaved) {
            logFirestoreIssue("[Payment Create] Free coupon invoice persistence failed", error);
          } else {
            logFirestoreIssue("[Payment Create] Free coupon invoice persistence skipped because enrollment save failed", error);
          }
        }
      }

      const hasWorkshop = offerings.some((offering) => offering.slug === "ai-developer-launch-lab");
      const workshopDate = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeZone: "Asia/Kolkata",
      }).format(new Date("2026-07-19T18:00:00+05:30"));
      const workshopTime = "6:00 PM - 8:00 PM IST";

      after(async () => {
        await Promise.allSettled([
          sendEnrollmentEmail({
            name: body.name,
            email: body.email,
            phone: body.phone,
            courseTitles: offerings.map((offering) => offering.title),
            paymentId: "free-coupon",
            amountLabel: formatPaiseToPrice(totalPaidPaise),
            enrolledAt: paidAtIso,
            workshop: hasWorkshop
              ? {
                name: "AI Developer Launch Lab",
                date: workshopDate,
                time: workshopTime,
                meetingUrl: env.nextPublicWorkshopMeetingUrl || undefined,
                lmsUrl: `${env.nextPublicSiteUrl}/dashboard/courses?payment=success`,
                invoiceUrl: `${env.nextPublicSiteUrl}/payment/success?orderId=${encodeURIComponent(invoice.orderId)}`,
                whatsappUrl: env.nextPublicWorkshopWhatsappUrl || undefined,
                supportEmail: env.admissionsEmail,
              }
              : undefined,
          }),
          sendWhatsAppNotification({
            phone: body.phone,
            body: `Hi ${body.name}, your enrollment for ${offerings.length > 1 ? `${offerings.length} programs` : offerings[0]?.title || "your program"} is confirmed. Payment ID: FREE-COUPON`,
          }),
          captureServerEvent(body.email, "payment_success", {
            courseSlugs: offerings.map((offering) => offering.slug),
            paymentId: "free-coupon",
            orderId: invoice.orderId,
            amountPaise: totalPaidPaise,
          }),
        ]);
      });

      return NextResponse.json({
        success: true,
        freeEnrollment: true,
        message: `Coupon ${pricing.appliedCouponCode} applied successfully`,
        invoice,
        pricing,
        clientSyncRequired,
        needsRegistration: isGuestCheckout,
        amountLabel: formatPaiseToPrice(totalPaidPaise),
      });
    }

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
        userId: authUser?.uid || "",
        guestCheckout: isGuestCheckout ? "1" : "0",
        name: body.name,
        email: body.email,
        phone: body.phone,
        courseSlug: requestedSlugs[0],
        courseSlugs: requestedSlugs.join(","),
        gstNumber: body.gstNumber?.trim() || "",
        companyName: body.companyName?.trim() || "",
        couponCode: pricing.appliedCouponCode,
        discountPercent: String(pricing.discountPercent),
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
