import { NextResponse } from "next/server";
import type { FirestoreEnrollment } from "@/lib/firebase/enrollments";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/firebase-auth";
import {
  buildFallbackInvoicesFromEnrollments,
  mergeInvoiceRecords,
  type PersistedInvoiceRecord,
} from "@/lib/invoices";

export async function GET(request: Request) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const db = getAdminDb();

  if (!db) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  try {
    const [invoiceSnapshot, enrollmentSnapshot] = await Promise.all([
      db.collection("invoices").get(),
      db.collection("enrollments").get(),
    ]);

    const persistedInvoices = invoiceSnapshot.docs.map((item) => ({
      ...(item.data() as PersistedInvoiceRecord),
      invoiceNumber: item.id,
    }));

    const fallbackInvoices = buildFallbackInvoicesFromEnrollments(
      enrollmentSnapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as FirestoreEnrollment),
      })),
    );

    const invoices = mergeInvoiceRecords(persistedInvoices, fallbackInvoices);

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load invoices.",
      },
      { status: 500 },
    );
  }
}
