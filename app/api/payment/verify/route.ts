import { after, NextResponse } from "next/server";
import { allocatePaiseProportionally, getCouponPricing } from "@/lib/coupons";
import { formatPaiseToPrice } from "@/lib/course-catalog";
import type { CheckoutOffering } from "@/lib/offering-catalog";
import { getCanonicalCourseIdBySlug, getCourseSlugByCourseId, resolveCheckoutOfferings } from "@/lib/offering-catalog";
import { logFirestoreIssue } from "@/lib/firebase";
import { saveEnrollmentRecordAdmin } from "@/lib/firebase/enrollments-admin";
import { saveInvoiceRecordAdmin } from "@/lib/firebase/invoices-admin";
import { upsertUserProfileAdminFromPayment } from "@/lib/firebase/user-profiles-admin";
import type { PersistedInvoiceRecord } from "@/lib/invoices";
import { createInvoiceNumber, getInclusiveGstBreakup, type StoredOrderSuccess } from "@/lib/order-success";
import { verifyFirebaseBearerToken } from "@/lib/server/firebase-auth";
import { captureServerEvent } from "@/lib/services/analytics";
import { sendEnrollmentEmail } from "@/lib/services/email";
import { getRazorpayOrderDetails, getRazorpayPaymentDetails, verifyRazorpaySignature } from "@/lib/services/payments";
import { sendWhatsAppNotification } from "@/lib/services/whatsapp";
import { paymentVerifySchema } from "@/lib/validations";

function readOrderNoteValue(notes: Record<string, unknown> | undefined, key: string) {
  const value = notes?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function readOrderNoteInteger(notes: Record<string, unknown> | undefined, key: string) {
  const value = Number.parseInt(readOrderNoteValue(notes, key), 10);
  return Number.isFinite(value) ? value : 0;
}

export async function POST(request: Request) {
  try {
    const body = paymentVerifySchema.parse(await request.json());
    let clientSyncRequired = false;

    const authUser = await verifyFirebaseBearerToken(request);

    if (!authUser) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const signatureValid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!signatureValid) {
      return NextResponse.json({ success: false, message: "Invalid payment signature." }, { status: 400 });
    }

    const [paymentDetails, orderDetails] = await Promise.all([
      getRazorpayPaymentDetails(body.razorpay_payment_id),
      getRazorpayOrderDetails(body.razorpay_order_id),
    ]);

    if (!paymentDetails || !orderDetails) {
      return NextResponse.json({ success: false, message: "Unable to confirm payment with Razorpay." }, { status: 502 });
    }

    if (paymentDetails.order_id !== body.razorpay_order_id || orderDetails.id !== body.razorpay_order_id) {
      return NextResponse.json({ success: false, message: "Payment order mismatch." }, { status: 400 });
    }

    if (paymentDetails.status !== "captured") {
      return NextResponse.json({ success: false, message: "Payment has not been captured." }, { status: 400 });
    }

    if (orderDetails.status !== "paid") {
      return NextResponse.json({ success: false, message: "Order is not marked as paid." }, { status: 400 });
    }

    const trustedUserId = readOrderNoteValue(orderDetails.notes, "userId");
    const trustedName = readOrderNoteValue(orderDetails.notes, "name");
    const trustedEmail = readOrderNoteValue(orderDetails.notes, "email");
    const trustedPhone = readOrderNoteValue(orderDetails.notes, "phone");
    const trustedGstNumber = readOrderNoteValue(orderDetails.notes, "gstNumber").toUpperCase();
    const trustedCompanyName = readOrderNoteValue(orderDetails.notes, "companyName");
    const trustedCouponCode = readOrderNoteValue(orderDetails.notes, "couponCode");
    const trustedRequestedSlugs = readOrderNoteValue(orderDetails.notes, "courseSlugs")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);
    const trustedCourseSlugs =
      trustedRequestedSlugs.length > 0
        ? trustedRequestedSlugs
        : [readOrderNoteValue(orderDetails.notes, "courseSlug")].filter(Boolean);

    if (!trustedUserId || trustedUserId !== authUser.uid) {
      return NextResponse.json({ success: false, message: "Payment user mismatch." }, { status: 403 });
    }

    if (!trustedName || !trustedPhone || trustedCourseSlugs.length === 0) {
      return NextResponse.json({ success: false, message: "Payment order details are incomplete." }, { status: 400 });
    }

    const { offerings, missing } = resolveCheckoutOfferings(trustedCourseSlugs);

    if (missing.length > 0 || offerings.length !== trustedCourseSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    const purchasedOffering = offerings.length === 1 ? offerings[0] : null;
    const singleCourseBundleSlug =
      purchasedOffering?.kind === "bundle" && purchasedOffering.courseSlugs.length === 1
        ? purchasedOffering.courseSlugs[0]
        : "";

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

    function resolveDisplayValuesForOffering(offering: CheckoutOffering) {
      if (offering.kind === "bundle") {
        return {
          title: offering.title,
          duration: offering.duration,
          level: offering.level,
          amountPaise: offering.priceValue * 100,
        };
      }

      if (singleCourseBundleSlug && offering.slug === singleCourseBundleSlug && purchasedOffering) {
        return {
          title: purchasedOffering.title,
          duration: purchasedOffering.duration,
          level: purchasedOffering.level,
          amountPaise: purchasedOffering.priceValue * 100,
        };
      }

      return {
        title: offering.title,
        duration: offering.duration,
        level: offering.level,
        amountPaise: offering.priceValue * 100,
      };
    }

    const subtotalPaise = offerings.reduce((sum, offering) => sum + (offering.priceValue * 100), 0);
    const pricing = getCouponPricing(subtotalPaise, trustedCouponCode);
    const trustedSubtotalPaise = readOrderNoteInteger(orderDetails.notes, "subtotalPaise");
    const trustedDiscountPaise = readOrderNoteInteger(orderDetails.notes, "discountPaise");
    const trustedFinalAmountPaise = readOrderNoteInteger(orderDetails.notes, "finalAmountPaise");
    const lineItemPaise = allocatePaiseProportionally(
      pricing.finalAmountPaise,
      offerings.map((offering) => offering.priceValue * 100),
    );

    if (
      trustedSubtotalPaise !== pricing.subtotalPaise ||
      trustedDiscountPaise !== pricing.discountPaise ||
      trustedFinalAmountPaise !== pricing.finalAmountPaise ||
      paymentDetails.amount !== pricing.finalAmountPaise ||
      orderDetails.amount !== pricing.finalAmountPaise ||
      orderDetails.amount_paid !== pricing.finalAmountPaise ||
      paymentDetails.currency !== "INR" ||
      orderDetails.currency !== "INR"
    ) {
      return NextResponse.json({ success: false, message: "Payment amount verification failed." }, { status: 400 });
    }

    const gstInvoiceEnabled = Boolean(trustedGstNumber);
    const { baseAmountPaise, gstPaise, totalPaidPaise } = getInclusiveGstBreakup(pricing.finalAmountPaise, gstInvoiceEnabled);
    const paidAtIso = paymentDetails.created_at
      ? new Date(paymentDetails.created_at * 1000).toISOString()
      : new Date().toISOString();
    const invoiceNumber = createInvoiceNumber(body.razorpay_order_id, paidAtIso);
    const paymentMethod =
      paymentDetails.method
        ? `${String(paymentDetails.method).charAt(0).toUpperCase()}${String(paymentDetails.method).slice(1)}`
        : "Razorpay";
    const enrolledAt = new Date().toISOString();

    const invoice: StoredOrderSuccess = {
      invoiceNumber,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
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
        name: trustedName,
        phone: trustedPhone,
        email: trustedEmail || undefined,
        companyName: trustedCompanyName || undefined,
        gstNumber: trustedGstNumber || undefined,
      },
      courses: offerings.map((offering, index) => {
        const display = resolveDisplayValuesForOffering(offering);
        const enrollmentMeta = resolveEnrollmentMetaForOffering(offering);
        return {
          slug: enrollmentMeta.primaryCourseSlug,
          title: display.title,
          duration: display.duration,
          level: display.level,
          amountPaise: lineItemPaise[index] || 0,
          originalAmountPaise: offering.priceValue * 100,
          discountAmountPaise: (offering.priceValue * 100) - (lineItemPaise[index] || 0),
          finalPaidAmountPaise: lineItemPaise[index] || 0,
          couponCode: pricing.appliedCouponCode || undefined,
          discountPercentage: pricing.discountPercent,
          paymentStatus: "captured",
          enrollmentType: enrollmentMeta.enrollmentType,
          purchasedOfferingSlug: enrollmentMeta.purchasedOfferingSlug,
          programSlug: enrollmentMeta.programSlug,
          programName: enrollmentMeta.programName,
          programCourseSlugs: enrollmentMeta.programCourseSlugs,
          primaryCourseSlug: enrollmentMeta.primaryCourseSlug,
        };
      }),
    };

    let enrollmentSaved = false;

    try {
      await Promise.all(
        offerings.map((offering, index) => {
          const display = resolveDisplayValuesForOffering(offering);
          const enrollmentMeta = resolveEnrollmentMetaForOffering(offering);
          const primaryCourseSlug = enrollmentMeta.primaryCourseSlug;
          const allocatedAmountPaise = lineItemPaise[index] || 0;

          return saveEnrollmentRecordAdmin({
            userId: trustedUserId,
            userName: trustedName,
            userPhone: trustedPhone,
            userEmail: trustedEmail,
            courseId: getCourseSlugByCourseId(primaryCourseSlug),
            canonicalCourseId: getCanonicalCourseIdBySlug(primaryCourseSlug),
            enrollmentType: enrollmentMeta.enrollmentType,
            purchasedOfferingSlug: enrollmentMeta.purchasedOfferingSlug,
            programSlug: enrollmentMeta.programSlug,
            programName: enrollmentMeta.programName,
            programCourseSlugs: enrollmentMeta.programCourseSlugs,
            primaryCourseSlug: enrollmentMeta.primaryCourseSlug,
            courseName: display.title,
            amountPaid: Math.round(allocatedAmountPaise / 100),
            couponCode: pricing.appliedCouponCode,
            discountPercentage: pricing.discountPercent,
            originalAmount: Math.round((offering.priceValue * 100) / 100),
            discountAmount: Math.round(((offering.priceValue * 100) - allocatedAmountPaise) / 100),
            finalPaidAmount: Math.round(allocatedAmountPaise / 100),
            paymentStatus: "captured",
            razorpayOrderId: body.razorpay_order_id,
            razorpayPaymentId: body.razorpay_payment_id,
            invoiceNumber,
            enrolledAt,
            status: "active",
            duration: display.duration,
            level: display.level,
            companyName: trustedCompanyName,
            gstNumber: trustedGstNumber,
          });
        }),
      );
      enrollmentSaved = true;
    } catch (error) {
      clientSyncRequired = true;
      logFirestoreIssue("[Payment Verify] Server enrollment save failed after verified payment; client sync required", error);
    }

    try {
      await upsertUserProfileAdminFromPayment({
        uid: trustedUserId,
        name: trustedName,
        email: trustedEmail,
        phone: trustedPhone,
        createdAt: paidAtIso,
      });
    } catch (error) {
      logFirestoreIssue("[Payment Verify] User profile sync failed after verified payment", error);
    }

    try {
      await saveInvoiceRecordAdmin({
        ...invoice,
        userId: trustedUserId,
        paymentStatus: "captured",
      } satisfies PersistedInvoiceRecord);
    } catch (error) {
      if (enrollmentSaved) {
        logFirestoreIssue("[Payment Verify] Invoice persistence failed after verified payment", error);
      } else {
        logFirestoreIssue("[Payment Verify] Invoice persistence skipped because enrollment save failed", error);
      }
    }

    after(async () => {
      await Promise.allSettled([
        sendEnrollmentEmail({
          name: trustedName,
          email: trustedEmail,
          phone: trustedPhone,
          courseTitles: offerings.map((offering) => resolveDisplayValuesForOffering(offering).title),
          paymentId: body.razorpay_payment_id,
          amountLabel: formatPaiseToPrice(totalPaidPaise),
          enrolledAt: paidAtIso,
        }),
        sendWhatsAppNotification({
          phone: trustedPhone,
          body: `Hi ${trustedName}, your enrollment for ${offerings.length > 1 ? `${offerings.length} programs` : resolveDisplayValuesForOffering(offerings[0]).title} is confirmed. Payment ID: ${body.razorpay_payment_id}`,
        }),
        captureServerEvent(trustedEmail, "payment_verified", {
          courseSlugs: offerings.map((offering) => offering.slug),
          paymentId: body.razorpay_payment_id,
        }),
      ]);
    });

    return NextResponse.json({ success: true, invoice, clientSyncRequired });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to verify payment.",
      },
      { status: 400 },
    );
  }
}
