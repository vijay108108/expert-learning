import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirebaseDb } from "@/lib/firebase";
import { buildEnrollmentDocId, dedupeEnrollmentRecords } from "@/lib/enrollment-utils";
import { getCanonicalCourseId, getCanonicalCourseIdBySlug, getCourseSlugByCourseId } from "@/lib/offering-catalog";
import type { StoredOrderSuccess } from "@/lib/order-success";

export type FirestoreEnrollment = {
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  courseId: string;
  canonicalCourseId?: string;
  enrollmentType?: "course" | "program";
  purchasedOfferingSlug?: string;
  programSlug?: string;
  programName?: string;
  programCourseSlugs?: string[];
  primaryCourseSlug?: string;
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

type EnrollmentWriteInput = Omit<FirestoreEnrollment, "status"> & {
  status?: FirestoreEnrollment["status"];
};

async function listActiveEnrollmentRecords(userId: string) {
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
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as FirestoreEnrollment),
  }));
}

export async function saveEnrollmentRecord(input: EnrollmentWriteInput) {
  const db = getFirebaseDb();

  if (!db) {
    throw new Error("Firebase Firestore is not configured for enrollments.");
  }

  const enrollmentCollection = collection(db, "enrollments");
  const canonicalCourseId = getCanonicalCourseId(input.canonicalCourseId || input.courseId);
  const normalizedCourseId = getCourseSlugByCourseId(canonicalCourseId || input.courseId);
  const enrollmentDocId = buildEnrollmentDocId(input.userId, normalizedCourseId, canonicalCourseId);
  const enrollmentRef = doc(enrollmentCollection, enrollmentDocId);
  const activeEnrollments = dedupeEnrollmentRecords(
    await listActiveEnrollmentRecords(input.userId),
    `Duplicate enrollment records found before write for ${input.userId}.`,
  );
  const existingEnrollment = activeEnrollments.find((record) => record.canonicalCourseId === canonicalCourseId);

  if (existingEnrollment) {
    console.warn("[Enrollment Debug] Duplicate enrollment write blocked.", {
      userId: input.userId,
      courseId: normalizedCourseId,
      canonicalCourseId,
      duplicateUserCourseKey: `${input.userId}::${canonicalCourseId}`,
      existingEnrollmentId: existingEnrollment.id,
      incomingEnrollmentId: enrollmentDocId,
      incomingPaymentId: input.razorpayPaymentId,
      existingPaymentId: existingEnrollment.razorpayPaymentId,
    });
    return existingEnrollment.id;
  }

  let blockedByTransaction = false;
  let existingTransactionData: FirestoreEnrollment | undefined;

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(enrollmentRef);

    if (existing.exists()) {
      blockedByTransaction = true;
      existingTransactionData = existing.data() as FirestoreEnrollment;
      return;
    }

    transaction.set(
      enrollmentRef,
      {
        ...input,
        courseId: normalizedCourseId,
        canonicalCourseId,
        status: input.status || "active",
        createdAt: serverTimestamp(),
      } satisfies FirestoreEnrollment & { createdAt: unknown },
      { merge: false },
    );
  });

  if (blockedByTransaction) {
    console.warn("[Enrollment Debug] Duplicate enrollment write blocked during transaction.", {
      userId: input.userId,
      courseId: normalizedCourseId,
      canonicalCourseId,
      duplicateUserCourseKey: `${input.userId}::${canonicalCourseId}`,
      existingEnrollmentId: enrollmentDocId,
      incomingEnrollmentId: enrollmentDocId,
      incomingPaymentId: input.razorpayPaymentId,
      existingPaymentId: existingTransactionData ? existingTransactionData.razorpayPaymentId : null,
    });
  }

  return enrollmentDocId;
}

export async function saveInvoiceEnrollments(user: User, invoice: StoredOrderSuccess) {
  const createdAt = invoice.paidAtIso || new Date().toISOString();

  await Promise.all(
    invoice.courses.map((course) =>
      saveEnrollmentRecord({
        userId: user.uid,
        userName: user.displayName || invoice.customer.name || "GenZNext Learner",
        userPhone: user.phoneNumber || invoice.customer.phone || "",
        userEmail: invoice.customer.email || "",
        courseId: getCourseSlugByCourseId(course.slug),
        canonicalCourseId: getCanonicalCourseIdBySlug(course.slug),
        enrollmentType: course.enrollmentType || "course",
        purchasedOfferingSlug: course.purchasedOfferingSlug || course.slug,
        programSlug: course.programSlug || "",
        programName: course.programName || "",
        programCourseSlugs: course.programCourseSlugs || [],
        primaryCourseSlug: course.primaryCourseSlug || getCourseSlugByCourseId(course.slug),
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
      }),
    ),
  );
}

export async function getMyEnrollments(userId: string) {
  const records = await listActiveEnrollmentRecords(userId);
  return dedupeEnrollmentRecords(
    records,
    `Duplicate enrollments detected and deduped by canonical course for ${userId}.`,
  );
}

export async function findExistingEnrollmentCourseIds(userId: string, requestedCourseIds: string[]) {
  if (!requestedCourseIds.length) {
    return [];
  }

  const requestedCanonicalIds = new Set(requestedCourseIds.map((courseId) => getCanonicalCourseId(courseId)));
  const activeEnrollments = await getMyEnrollments(userId);

  return activeEnrollments
    .filter((enrollment) => requestedCanonicalIds.has(getCanonicalCourseId(enrollment.canonicalCourseId || enrollment.courseId)))
    .map((enrollment) => enrollment.courseId);
}

export async function listAllEnrollments() {
  const db = getFirebaseDb();

  if (!db) {
    throw new Error("Firebase Firestore is not configured for enrollments.");
  }

  const snapshot = await getDocs(collection(db, "enrollments"));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as FirestoreEnrollment),
  }));
}
