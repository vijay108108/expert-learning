import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export type FirestorePayment = {
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amountPaid: number;
  currency: "INR";
  status: "created" | "captured" | "failed" | "free";
  courseSlugs: string[];
  couponCode?: string;
  discountPercentage?: number;
  originalAmount?: number;
  discountAmount?: number;
  finalPaidAmount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function savePaymentRecord(input: FirestorePayment) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured for payments.");

  const payments = collection(db, "payments");
  const duplicateSnapshot = await getDocs(
    query(
      payments,
      where("razorpayPaymentId", "==", input.razorpayPaymentId),
      limit(1),
    ),
  );
  if (!duplicateSnapshot.empty) {
    return duplicateSnapshot.docs[0]?.id;
  }

  const ref = await addDoc(payments, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listPaymentsByUser(userId: string) {
  const db = getFirebaseDb();
  if (!db) return [];

  const snapshot = await getDocs(query(collection(db, "payments"), where("userId", "==", userId)));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as FirestorePayment) }));
}

