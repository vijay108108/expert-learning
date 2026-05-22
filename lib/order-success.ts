export const latestOrderStorageKey = "genznext-latest-order";

export type InvoiceCourseLine = {
  slug: string;
  title: string;
  duration: string;
  level: string;
  amountPaise: number;
};

export type StoredOrderSuccess = {
  invoiceNumber: string;
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paidAtIso: string;
  subtotalPaise: number;
  baseAmountPaise: number;
  gstPaise: number;
  totalPaidPaise: number;
  platformFeeLabel: string;
  gstInvoiceEnabled: boolean;
  customer: {
    name: string;
    phone: string;
    email?: string;
    companyName?: string;
    gstNumber?: string;
  };
  courses: InvoiceCourseLine[];
};

export function formatCurrencyInrFromPaise(amountPaise: number) {
  return `Rs. ${Math.round(amountPaise / 100).toLocaleString("en-IN")}`;
}

export function getInclusiveGstBreakup(totalPaise: number, gstInvoiceEnabled: boolean) {
  if (!gstInvoiceEnabled) {
    return {
      baseAmountPaise: totalPaise,
      gstPaise: 0,
      totalPaidPaise: totalPaise,
    };
  }

  const baseAmountPaise = Math.round(totalPaise / 1.18);
  const gstPaise = totalPaise - baseAmountPaise;

  return {
    baseAmountPaise,
    gstPaise,
    totalPaidPaise: totalPaise,
  };
}

export function createInvoiceNumber(orderId: string, paidAtIso?: string) {
  const paidAt = paidAtIso ? new Date(paidAtIso) : new Date();
  const year = Number.isNaN(paidAt.getTime()) ? new Date().getFullYear() : paidAt.getFullYear();
  const digits = (orderId.match(/\d/g) || []).join("");
  const suffix = (digits.slice(-5) || `${Date.now()}`.slice(-5)).padStart(5, "0");
  return `GZN-${year}-${suffix}`;
}

export function formatInvoiceDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
