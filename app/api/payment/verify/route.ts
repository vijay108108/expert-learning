import { NextResponse } from "next/server";
import { formatPaiseToPrice } from "@/lib/course-catalog";
import { getCanonicalCourseIdBySlug, getCourseSlugByCourseId, resolveCheckoutOfferings } from "@/lib/offering-catalog";
import { createInvoiceNumber, getInclusiveGstBreakup, type StoredOrderSuccess } from "@/lib/order-success";
import {
  logFirestoreIssue,
  saveEnrollmentRecord,
} from "@/lib/firebase";
import { captureServerEvent } from "@/lib/services/analytics";
import { sendEnrollmentEmail } from "@/lib/services/email";
import { getRazorpayPaymentDetails, verifyRazorpaySignature } from "@/lib/services/payments";
import { sendWhatsAppNotification } from "@/lib/services/whatsapp";
import { paymentVerifySchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = paymentVerifySchema.parse(await request.json());
    const requestedSlugs = body.courseSlugs?.length ? body.courseSlugs : body.courseSlug ? [body.courseSlug] : [];
    const { offerings, missing } = resolveCheckoutOfferings(requestedSlugs);
    const purchasedOffering = offerings.length === 1 ? offerings[0] : null;
    const singleCourseBundleSlug =
      purchasedOffering?.kind === "bundle" && purchasedOffering.courseSlugs.length === 1
        ? purchasedOffering.courseSlugs[0]
        : "";
    let clientSyncRequired = false;

    if (missing.length > 0 || offerings.length !== requestedSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    const enrolledCourseSlugs = offerings.flatMap((offering) => offering.courseSlugs);
    const uniqueEnrolledCourseSlugs = Array.from(new Set(enrolledCourseSlugs));

    function resolveDisplayValuesForSlug(slug: string) {
      const fallback = resolveCheckoutOfferings([slug]).offerings[0];

      if (singleCourseBundleSlug && slug === singleCourseBundleSlug && purchasedOffering) {
        return {
          title: purchasedOffering.title,
          duration: purchasedOffering.duration,
          level: purchasedOffering.level,
          amountPaise: purchasedOffering.priceValue * 100,
        };
      }

      return {
        title: fallback?.title || slug,
        duration: fallback?.duration || "",
        level: fallback?.level || "",
        amountPaise: (fallback?.priceValue || 0) * 100,
      };
    }

    const signatureValid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!signatureValid) {
      return NextResponse.json({ success: false, message: "Invalid payment signature." }, { status: 400 });
    }

    const subtotalPaise = offerings.reduce((sum, offering) => sum + (offering.priceValue * 100), 0);
    const gstInvoiceEnabled = Boolean(body.gstNumber?.trim());
    const { baseAmountPaise, gstPaise, totalPaidPaise } = getInclusiveGstBreakup(subtotalPaise, gstInvoiceEnabled);

    const paymentDetails = await getRazorpayPaymentDetails(body.razorpay_payment_id);
    const paidAtIso = paymentDetails?.created_at
      ? new Date(paymentDetails.created_at * 1000).toISOString()
      : new Date().toISOString();
    const invoiceNumber = createInvoiceNumber(body.razorpay_order_id, paidAtIso);
    const paymentMethod =
      paymentDetails?.method
        ? `${String(paymentDetails.method).charAt(0).toUpperCase()}${String(paymentDetails.method).slice(1)}`
        : "Razorpay";
    const enrolledAt = new Date().toISOString();

    try {
      await Promise.all(
        uniqueEnrolledCourseSlugs.map((slug) => {
          const display = resolveDisplayValuesForSlug(slug);
          return saveEnrollmentRecord({
            userId: body.userId,
            userName: body.name,
            userPhone: body.phone,
            userEmail: body.email || "",
            courseId: getCourseSlugByCourseId(slug),
            canonicalCourseId: getCanonicalCourseIdBySlug(slug),
            purchasedOfferingSlug: requestedSlugs[0] || slug,
            courseName: display.title,
            amountPaid: Math.round(display.amountPaise / 100),
            razorpayOrderId: body.razorpay_order_id,
            razorpayPaymentId: body.razorpay_payment_id,
            invoiceNumber,
            enrolledAt,
            status: "active",
            duration: display.duration,
            level: display.level,
            companyName: body.companyName?.trim() || "",
            gstNumber: body.gstNumber?.trim() || "",
          });
        }),
      );
    } catch (error) {
      clientSyncRequired = true;
      logFirestoreIssue("[Payment Verify] Server enrollment save failed after verified payment; client sync required", error);
    }

    await Promise.allSettled([
      sendEnrollmentEmail({
        name: body.name,
        email: body.email,
        phone: body.phone,
        courseTitles: uniqueEnrolledCourseSlugs.map((slug) => resolveDisplayValuesForSlug(slug).title),
        paymentId: body.razorpay_payment_id,
        amountLabel: formatPaiseToPrice(totalPaidPaise),
        enrolledAt: paidAtIso,
      }),
      sendWhatsAppNotification({
        phone: body.phone,
        body: `Hi ${body.name}, your enrollment for ${uniqueEnrolledCourseSlugs.length > 1 ? `${uniqueEnrolledCourseSlugs.length} programs` : resolveDisplayValuesForSlug(uniqueEnrolledCourseSlugs[0] || "").title} is confirmed. Payment ID: ${body.razorpay_payment_id}`,
      }),
      captureServerEvent(body.email, "payment_verified", {
        courseSlugs: uniqueEnrolledCourseSlugs,
        paymentId: body.razorpay_payment_id,
      }),
    ]);

    const invoice: StoredOrderSuccess = {
      invoiceNumber,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      paymentMethod,
      paidAtIso,
      subtotalPaise,
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
      courses: uniqueEnrolledCourseSlugs.map((slug) => {
        const display = resolveDisplayValuesForSlug(slug);
        return {
          slug,
          title: display.title,
          duration: display.duration,
          level: display.level,
          amountPaise: display.amountPaise,
        };
      }),
    };

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
