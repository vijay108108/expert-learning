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
    let clientSyncRequired = false;

    if (missing.length > 0 || offerings.length !== requestedSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    const enrolledCourseSlugs = offerings.flatMap((offering) => offering.courseSlugs);
    const uniqueEnrolledCourseSlugs = Array.from(new Set(enrolledCourseSlugs));

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
          const catalogCourse = offerings
            .flatMap((offering) => offering.kind === "course" && offering.slug === slug ? [offering] : [])
            .at(0);
          const fallback = resolveCheckoutOfferings([slug]).offerings[0];
          const selected = catalogCourse || fallback;
          if (!selected) {
            return Promise.resolve(null);
          }
          return saveEnrollmentRecord({
            userId: body.userId,
            userName: body.name,
            userPhone: body.phone,
            userEmail: body.email || "",
            courseId: getCourseSlugByCourseId(slug),
            canonicalCourseId: getCanonicalCourseIdBySlug(slug),
            purchasedOfferingSlug: requestedSlugs[0] || slug,
            courseName: selected.title,
            amountPaid: Math.round(selected.priceValue),
            razorpayOrderId: body.razorpay_order_id,
            razorpayPaymentId: body.razorpay_payment_id,
            invoiceNumber,
            enrolledAt,
            status: "active",
            duration: selected.duration,
            level: selected.level,
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
        courseTitles: uniqueEnrolledCourseSlugs.map((slug) => resolveCheckoutOfferings([slug]).offerings[0]?.title || slug),
        paymentId: body.razorpay_payment_id,
        amountLabel: formatPaiseToPrice(totalPaidPaise),
        enrolledAt: paidAtIso,
      }),
      sendWhatsAppNotification({
        phone: body.phone,
        body: `Hi ${body.name}, your enrollment for ${uniqueEnrolledCourseSlugs.length > 1 ? `${uniqueEnrolledCourseSlugs.length} programs` : resolveCheckoutOfferings([uniqueEnrolledCourseSlugs[0] || ""]).offerings[0]?.title} is confirmed. Payment ID: ${body.razorpay_payment_id}`,
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
        const selected = resolveCheckoutOfferings([slug]).offerings[0];
        return {
          slug,
          title: selected?.title || slug,
          duration: selected?.duration || "",
          level: selected?.level || "",
          amountPaise: (selected?.priceValue || 0) * 100,
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
