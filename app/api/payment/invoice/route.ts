import { NextResponse } from "next/server";
import { saveInvoiceRecordAdmin } from "@/lib/firebase/invoices-admin";
import { verifyFirebaseBearerToken } from "@/lib/server/firebase-auth";
import type { PersistedInvoiceRecord } from "@/lib/invoices";
import type { InvoiceCourseLine, StoredOrderSuccess } from "@/lib/order-success";

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidCourseLine(value: unknown): value is InvoiceCourseLine {
  if (!value || typeof value !== "object") {
    return false;
  }

  const course = value as Record<string, unknown>;
  return (
    isNonEmptyString(course.slug) &&
    isNonEmptyString(course.title) &&
    isNonEmptyString(course.duration) &&
    isNonEmptyString(course.level) &&
    isFiniteNumber(course.amountPaise)
  );
}

function isValidStoredInvoice(value: unknown): value is StoredOrderSuccess {
  if (!value || typeof value !== "object") {
    return false;
  }

  const invoice = value as Record<string, unknown>;
  const customer = invoice.customer as Record<string, unknown> | undefined;
  const courses = invoice.courses;

  return (
    isNonEmptyString(invoice.invoiceNumber) &&
    typeof invoice.orderId === "string" &&
    typeof invoice.paymentId === "string" &&
    isNonEmptyString(invoice.paymentMethod) &&
    isNonEmptyString(invoice.paidAtIso) &&
    isFiniteNumber(invoice.subtotalPaise) &&
    isFiniteNumber(invoice.baseAmountPaise) &&
    isFiniteNumber(invoice.gstPaise) &&
    isFiniteNumber(invoice.totalPaidPaise) &&
    isNonEmptyString(invoice.platformFeeLabel) &&
    typeof invoice.gstInvoiceEnabled === "boolean" &&
    !!customer &&
    isNonEmptyString(customer.name) &&
    typeof customer.phone === "string" &&
    Array.isArray(courses) &&
    courses.length > 0 &&
    courses.every(isValidCourseLine)
  );
}

function resolveInvoicePaymentStatus(invoice: StoredOrderSuccess): PersistedInvoiceRecord["paymentStatus"] {
  if (invoice.courses.some((course) => course.paymentStatus === "captured")) {
    return "captured";
  }

  if (invoice.courses.some((course) => course.paymentStatus === "free") || invoice.totalPaidPaise <= 0) {
    return "free";
  }

  return "pending";
}

export async function POST(request: Request) {
  try {
    const authUser = await verifyFirebaseBearerToken(request);

    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      invoice?: unknown;
    };

    if (!isValidStoredInvoice(body.invoice)) {
      return NextResponse.json({ success: false, message: "Invalid invoice payload." }, { status: 400 });
    }

    const invoice = body.invoice;

    console.info("[Invoice Persist Debug]", {
      authUid: authUser.uid,
      invoiceNumber: invoice.invoiceNumber,
      orderId: invoice.orderId,
      paymentId: invoice.paymentId,
      paymentMethod: invoice.paymentMethod,
      totalPaidPaise: invoice.totalPaidPaise,
      couponCode: invoice.appliedCouponCode || "",
    });

    await saveInvoiceRecordAdmin({
      ...invoice,
      userId: authUser.uid,
      paymentStatus: resolveInvoicePaymentStatus(invoice),
    } satisfies PersistedInvoiceRecord);

    return NextResponse.json({ success: true, invoiceNumber: invoice.invoiceNumber });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to save invoice.",
      },
      { status: 500 },
    );
  }
}
