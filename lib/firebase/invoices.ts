import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { PersistedInvoiceRecord } from "@/lib/invoices";

export type FirestoreInvoice = PersistedInvoiceRecord & {
  createdAt?: string;
  updatedAt?: string;
};

export async function listInvoicesByUser(userId: string) {
  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  const snapshot = await getDocs(query(collection(db, "invoices"), where("userId", "==", userId)));
  return snapshot.docs
    .map((item) => item.data() as FirestoreInvoice)
    .sort((left, right) => new Date(right.paidAtIso).getTime() - new Date(left.paidAtIso).getTime());
}

export async function getInvoiceByNumberForUser(userId: string, invoiceNumber: string) {
  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "invoices", invoiceNumber));
  if (!snapshot.exists()) {
    return null;
  }

  const invoice = snapshot.data() as FirestoreInvoice;
  return invoice.userId === userId ? invoice : null;
}
