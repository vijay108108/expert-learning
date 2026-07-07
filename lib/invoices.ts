import type { FirestoreEnrollment } from "@/lib/firebase/enrollments";
import { createInvoiceNumber, getInclusiveGstBreakup, type InvoiceCourseLine, type StoredOrderSuccess } from "@/lib/order-success";

export type InvoicePaymentStatus = "captured" | "failed" | "pending" | "free";

export type PersistedInvoiceRecord = StoredOrderSuccess & {
  userId: string;
  paymentStatus: InvoicePaymentStatus;
};

function resolveInvoicePaymentStatus(enrollments: FirestoreEnrollment[]): InvoicePaymentStatus {
  if (enrollments.some((item) => item.paymentStatus === "captured")) {
    return "captured";
  }

  if (enrollments.some((item) => item.paymentStatus === "free")) {
    return "free";
  }

  if (enrollments.some((item) => item.paymentStatus === "failed")) {
    return "failed";
  }

  return "pending";
}

function buildInvoiceLineItems(enrollments: FirestoreEnrollment[]): InvoiceCourseLine[] {
  return enrollments.map((item) => ({
    slug: item.primaryCourseSlug || item.courseId,
    title: item.courseName,
    duration: item.duration,
    level: item.level,
    amountPaise: Math.round((item.amountPaid || 0) * 100),
    originalAmountPaise: Math.round((item.originalAmount ?? item.amountPaid ?? 0) * 100),
    discountAmountPaise: Math.round((item.discountAmount ?? 0) * 100),
    finalPaidAmountPaise: Math.round((item.finalPaidAmount ?? item.amountPaid ?? 0) * 100),
    couponCode: item.couponCode || undefined,
    discountPercentage: item.discountPercentage || undefined,
    paymentStatus: item.paymentStatus === "free" ? "free" : "captured",
    enrollmentType: item.enrollmentType || "course",
    purchasedOfferingSlug: item.purchasedOfferingSlug || undefined,
    programSlug: item.programSlug || undefined,
    programName: item.programName || undefined,
    programCourseSlugs: item.programCourseSlugs || [],
    primaryCourseSlug: item.primaryCourseSlug || item.courseId,
  }));
}

export function buildInvoiceRecordFromEnrollments(
  invoiceNumber: string,
  enrollments: FirestoreEnrollment[],
): PersistedInvoiceRecord | null {
  if (!enrollments.length) {
    return null;
  }

  const sorted = [...enrollments].sort(
    (left, right) => new Date(right.enrolledAt || 0).getTime() - new Date(left.enrolledAt || 0).getTime(),
  );
  const primary = sorted[0];
  const subtotalPaise = sorted.reduce(
    (sum, item) => sum + Math.round((item.originalAmount ?? item.amountPaid ?? 0) * 100),
    0,
  );
  const discountPaise = sorted.reduce(
    (sum, item) => sum + Math.round((item.discountAmount ?? 0) * 100),
    0,
  );
  const totalPaidPaise = sorted.reduce(
    (sum, item) => sum + Math.round((item.finalPaidAmount ?? item.amountPaid ?? 0) * 100),
    0,
  );
  const gstInvoiceEnabled = Boolean(primary.gstNumber);
  const { baseAmountPaise, gstPaise } = getInclusiveGstBreakup(totalPaidPaise, gstInvoiceEnabled);
  const paidAtIso = primary.enrolledAt || new Date().toISOString();

  return {
    userId: primary.userId,
    paymentStatus: resolveInvoicePaymentStatus(sorted),
    invoiceNumber: invoiceNumber || createInvoiceNumber(primary.razorpayOrderId || `legacy-${Date.now()}`, paidAtIso),
    orderId: primary.razorpayOrderId || "",
    paymentId: primary.razorpayPaymentId || "",
    paymentMethod: primary.paymentStatus === "free" ? "Coupon" : "Razorpay",
    paidAtIso,
    subtotalPaise,
    discountPaise,
    discountPercentage: primary.discountPercentage || undefined,
    appliedCouponCode: primary.couponCode || undefined,
    baseAmountPaise,
    gstPaise,
    totalPaidPaise,
    platformFeeLabel: "Included",
    gstInvoiceEnabled,
    customer: {
      name: primary.userName || "GenZNext Learner",
      phone: primary.userPhone || "",
      email: primary.userEmail || undefined,
      companyName: primary.companyName || undefined,
      gstNumber: primary.gstNumber || undefined,
    },
    courses: buildInvoiceLineItems(sorted),
  };
}

export function buildFallbackInvoicesFromEnrollments(enrollments: FirestoreEnrollment[]) {
  const grouped = new Map<string, FirestoreEnrollment[]>();

  for (const enrollment of enrollments) {
    const invoiceNumber = enrollment.invoiceNumber || "";
    if (!invoiceNumber) {
      continue;
    }

    const current = grouped.get(invoiceNumber) || [];
    current.push(enrollment);
    grouped.set(invoiceNumber, current);
  }

  return Array.from(grouped.entries())
    .map(([invoiceNumber, lineItems]) => buildInvoiceRecordFromEnrollments(invoiceNumber, lineItems))
    .filter((item): item is PersistedInvoiceRecord => Boolean(item))
    .sort((left, right) => new Date(right.paidAtIso).getTime() - new Date(left.paidAtIso).getTime());
}

export function mergeInvoiceRecords(
  persisted: PersistedInvoiceRecord[],
  fallback: PersistedInvoiceRecord[],
) {
  const merged = new Map<string, PersistedInvoiceRecord>();

  for (const invoice of fallback) {
    merged.set(invoice.invoiceNumber, invoice);
  }

  for (const invoice of persisted) {
    merged.set(invoice.invoiceNumber, invoice);
  }

  return Array.from(merged.values()).sort(
    (left, right) => new Date(right.paidAtIso).getTime() - new Date(left.paidAtIso).getTime(),
  );
}
