import type { FirestoreEnrollment } from "@/lib/firebase";
import type { AppUserProfile } from "@/lib/firebase/user-profiles";
import type { PersistedInvoiceRecord } from "@/lib/invoices";

export type AdminUserRecord = AppUserProfile & {
  id: string;
  companyName?: string;
  gstNumber?: string;
};

export type AdminEnrollmentRecord = FirestoreEnrollment & {
  id: string;
};

export type AdminInvoiceRecord = {
  invoiceNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  companyName?: string;
  gstNumber?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paidAt: string;
  lineItems: AdminEnrollmentRecord[];
  totalAmount: number;
};

export function formatAdminCurrency(amount?: number) {
  if (!amount) {
    return "INR 0";
  }

  return `INR ${amount.toLocaleString("en-IN")}`;
}

export function formatAdminDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  });
}

export function buildInvoiceRecords(enrollments: AdminEnrollmentRecord[]) {
  const grouped = new Map<string, AdminInvoiceRecord>();

  for (const enrollment of enrollments) {
    const invoiceNumber = enrollment.invoiceNumber || `NO-INVOICE-${enrollment.id}`;
    const existing = grouped.get(invoiceNumber);

    if (existing) {
      existing.lineItems.push(enrollment);
      existing.totalAmount += enrollment.amountPaid || 0;
      continue;
    }

    grouped.set(invoiceNumber, {
      invoiceNumber,
      userId: enrollment.userId,
      userName: enrollment.userName || "-",
      userPhone: enrollment.userPhone || "",
      userEmail: enrollment.userEmail || "",
      companyName: enrollment.companyName || "",
      gstNumber: enrollment.gstNumber || "",
      razorpayOrderId: enrollment.razorpayOrderId || "",
      razorpayPaymentId: enrollment.razorpayPaymentId || "",
      paidAt: enrollment.enrolledAt || "",
      lineItems: [enrollment],
      totalAmount: enrollment.amountPaid || 0,
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => new Date(right.paidAt).getTime() - new Date(left.paidAt).getTime(),
  );
}

export function buildInvoiceRecordsFromPersistedInvoices(invoices: PersistedInvoiceRecord[]) {
  const mapped = invoices.map<AdminInvoiceRecord>((invoice) => {
    const lineItems: AdminEnrollmentRecord[] = invoice.courses.map((course, index) => {
      const lineAmountPaise =
        typeof course.finalPaidAmountPaise === "number"
          ? course.finalPaidAmountPaise
          : typeof course.amountPaise === "number"
            ? course.amountPaise
            : 0;

      return {
        id: `${invoice.invoiceNumber}-${course.slug}-${index}`,
        userId: invoice.userId,
        userName: invoice.customer.name || "-",
        userPhone: invoice.customer.phone || "",
        userEmail: invoice.customer.email || "",
        courseId: course.primaryCourseSlug || course.slug,
        courseName: course.title,
        amountPaid: Math.round(lineAmountPaise / 100),
        razorpayOrderId: invoice.orderId || "",
        razorpayPaymentId: invoice.paymentId || "",
        invoiceNumber: invoice.invoiceNumber,
        enrolledAt: invoice.paidAtIso,
        status: "active",
        duration: course.duration,
        level: course.level,
        enrollmentType: course.enrollmentType,
        purchasedOfferingSlug: course.purchasedOfferingSlug,
        programSlug: course.programSlug,
        programName: course.programName,
        programCourseSlugs: course.programCourseSlugs,
        primaryCourseSlug: course.primaryCourseSlug,
        couponCode: course.couponCode,
        discountPercentage: course.discountPercentage,
        originalAmount: typeof course.originalAmountPaise === "number" ? Math.round(course.originalAmountPaise / 100) : undefined,
        discountAmount: typeof course.discountAmountPaise === "number" ? Math.round(course.discountAmountPaise / 100) : undefined,
        finalPaidAmount: typeof course.finalPaidAmountPaise === "number" ? Math.round(course.finalPaidAmountPaise / 100) : undefined,
        paymentStatus: course.paymentStatus,
      };
    });

    return {
      invoiceNumber: invoice.invoiceNumber,
      userId: invoice.userId,
      userName: invoice.customer.name || "-",
      userPhone: invoice.customer.phone || "",
      userEmail: invoice.customer.email || "",
      companyName: invoice.customer.companyName || "",
      gstNumber: invoice.customer.gstNumber || "",
      razorpayOrderId: invoice.orderId || "",
      razorpayPaymentId: invoice.paymentId || "",
      paidAt: invoice.paidAtIso,
      lineItems,
      totalAmount: Math.round((invoice.totalPaidPaise || 0) / 100),
    };
  });

  return mapped.sort(
    (left, right) => new Date(right.paidAt).getTime() - new Date(left.paidAt).getTime(),
  );
}

function escapeCsvValue(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  const normalized = stringValue.replace(/\r?\n/g, " ");
  return `"${normalized.replace(/"/g, "\"\"")}"`;
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<unknown>>) {
  const csv = [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
