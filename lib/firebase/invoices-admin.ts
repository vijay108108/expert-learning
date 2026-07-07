import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "./admin";
import type { PersistedInvoiceRecord } from "@/lib/invoices";

export async function saveInvoiceRecordAdmin(invoice: PersistedInvoiceRecord) {
  const db = getAdminDb();

  if (!db) {
    throw new Error("Firebase Admin Firestore is not configured for invoices.");
  }

  const invoiceRef = db.collection("invoices").doc(invoice.invoiceNumber);

  await invoiceRef.set(
    {
      ...invoice,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return invoice.invoiceNumber;
}
