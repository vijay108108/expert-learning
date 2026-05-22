"use client";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirebaseDb } from "@/lib/firebase";
import type { StoredOrderSuccess } from "@/lib/order-success";

export type FirestoreEnrollment = {
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  courseId: string;
  courseName: string;
  amountPaid: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  invoiceNumber: string;
  enrolledAt: string;
  status: "active";
  duration: string;
  level: string;
  companyName?: string;
  gstNumber?: string;
};

export async function saveInvoiceEnrollments(user: User, invoice: StoredOrderSuccess) {
  const db = getFirebaseDb();

  if (!db) {
    throw new Error("Firebase Firestore is not configured for enrollments.");
  }

  const enrollmentCollection = collection(db, "enrollments");
  const createdAt = invoice.paidAtIso || new Date().toISOString();

  await Promise.all(
    invoice.courses.map((course) =>
      addDoc(enrollmentCollection, {
        userId: user.uid,
        userName: user.displayName || invoice.customer.name || "GenZNext Learner",
        userPhone: user.phoneNumber || invoice.customer.phone || "",
        userEmail: invoice.customer.email || "",
        courseId: course.slug,
        courseName: course.title,
        amountPaid: Math.round(course.amountPaise / 100),
        razorpayOrderId: invoice.orderId,
        razorpayPaymentId: invoice.paymentId,
        invoiceNumber: invoice.invoiceNumber,
        enrolledAt: createdAt,
        status: "active",
        duration: course.duration,
        level: course.level,
        companyName: invoice.customer.companyName || "",
        gstNumber: invoice.customer.gstNumber || "",
        createdAt: serverTimestamp(),
      } satisfies FirestoreEnrollment & { createdAt: unknown }),
    ),
  );
}

export async function getMyEnrollments(userId: string) {
  const db = getFirebaseDb();

  if (!db) {
    throw new Error("Firebase Firestore is not configured for enrollments.");
  }

  const enrollmentQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
    where("status", "==", "active"),
  );

  const snapshot = await getDocs(enrollmentQuery);
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as FirestoreEnrollment),
    }))
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
}
