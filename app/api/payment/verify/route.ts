import { NextResponse } from "next/server";
import { formatPaiseToPrice, getCoursesBySlugs, parsePriceToPaise } from "@/lib/course-catalog";
import { createInvoiceNumber, getInclusiveGstBreakup, type StoredOrderSuccess } from "@/lib/order-success";
import { getMyEnrollments, saveEnrollmentRecord } from "@/lib/firebase";
import { captureServerEvent } from "@/lib/services/analytics";
import { sendEnrollmentEmail } from "@/lib/services/email";
import { getRazorpayPaymentDetails, verifyRazorpaySignature } from "@/lib/services/payments";
import { sendWhatsAppNotification } from "@/lib/services/whatsapp";
import { paymentVerifySchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = paymentVerifySchema.parse(await request.json());
    const courseSlugs = body.courseSlugs?.length ? body.courseSlugs : body.courseSlug ? [body.courseSlug] : [];
    const courses = getCoursesBySlugs(courseSlugs);

    if (courses.length !== courseSlugs.length) {
      return NextResponse.json({ success: false, message: "One or more selected courses were not found." }, { status: 404 });
    }

    const enrolledCourseIds = new Set((await getMyEnrollments(body.userId)).map((enrollment) => enrollment.courseId));
    const duplicateCourses = courses.filter((course) => enrolledCourseIds.has(course.slug));

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

    const signatureValid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!signatureValid) {
      return NextResponse.json({ success: false, message: "Invalid payment signature." }, { status: 400 });
    }

    const subtotalPaise = courses.reduce((sum, course) => {
      const amount = parsePriceToPaise(course.price);
      return sum + (amount || 0);
    }, 0);
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

    await Promise.all(
      courses.map((course) =>
        saveEnrollmentRecord({
          userId: body.userId,
          userName: body.name,
          userPhone: body.phone,
          userEmail: body.email || "",
          courseId: course.slug,
          courseName: course.title,
          amountPaid: Math.round((parsePriceToPaise(course.price) || 0) / 100),
          razorpayOrderId: body.razorpay_order_id,
          razorpayPaymentId: body.razorpay_payment_id,
          invoiceNumber,
          enrolledAt,
          status: "active",
          duration: course.duration,
          level: course.level,
          companyName: body.companyName?.trim() || "",
          gstNumber: body.gstNumber?.trim() || "",
        }),
      ),
    );

    await Promise.allSettled([
      sendEnrollmentEmail({
        name: body.name,
        email: body.email,
        phone: body.phone,
        courseTitles: courses.map((course) => course.title),
        paymentId: body.razorpay_payment_id,
        amountLabel: formatPaiseToPrice(totalPaidPaise),
        enrolledAt: paidAtIso,
      }),
      sendWhatsAppNotification({
        phone: body.phone,
        body: `Hi ${body.name}, your enrollment for ${courses.length > 1 ? `${courses.length} programs` : courses[0]?.title} is confirmed. Payment ID: ${body.razorpay_payment_id}`,
      }),
      captureServerEvent(body.email, "payment_verified", {
        courseSlugs,
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
      courses: courses.map((course) => ({
        slug: course.slug,
        title: course.title,
        duration: course.duration,
        level: course.level,
        amountPaise: parsePriceToPaise(course.price) || 0,
      })),
    };

    return NextResponse.json({ success: true, invoice });
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
