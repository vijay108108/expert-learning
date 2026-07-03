import type { FirestoreEnrollment } from "@/lib/firebase";
import type { AppUserProfile } from "@/lib/firebase/user-profiles";

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
