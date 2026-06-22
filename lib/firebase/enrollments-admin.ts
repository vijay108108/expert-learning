import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "./admin";
import { buildEnrollmentDocId, dedupeEnrollmentRecords } from "@/lib/enrollment-utils";
import { getCanonicalCourseId, getCourseSlugByCourseId } from "@/lib/offering-catalog";
import type { FirestoreEnrollment } from "./enrollments";

type EnrollmentWriteInput = Omit<FirestoreEnrollment, "status"> & {
  status?: FirestoreEnrollment["status"];
};

async function listActiveEnrollmentRecordsAdmin(userId: string) {
  const db = getAdminDb();

  if (!db) {
    throw new Error("Firebase Admin Firestore is not configured for enrollments.");
  }

  const snapshot = await db
    .collection("enrollments")
    .where("userId", "==", userId)
    .where("status", "==", "active")
    .get();

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as FirestoreEnrollment),
  }));
}

/**
 * Server-only enrollment writer used by payment verification and the
 * Razorpay webhook. Unlike lib/firebase/enrollments.ts (client SDK), this
 * runs with Admin SDK credentials so the write succeeds even though the API
 * route has no signed-in request.auth context for Firestore security rules.
 */
export async function saveEnrollmentRecordAdmin(input: EnrollmentWriteInput) {
  const db = getAdminDb();

  if (!db) {
    throw new Error("Firebase Admin Firestore is not configured for enrollments.");
  }

  const canonicalCourseId = getCanonicalCourseId(input.canonicalCourseId || input.courseId);
  const normalizedCourseId = getCourseSlugByCourseId(canonicalCourseId || input.courseId);
  const enrollmentDocId = buildEnrollmentDocId(input.userId, normalizedCourseId, canonicalCourseId);
  const enrollmentRef = db.collection("enrollments").doc(enrollmentDocId);
  const activeEnrollments = dedupeEnrollmentRecords(
    await listActiveEnrollmentRecordsAdmin(input.userId),
    `Duplicate enrollment records found before write for ${input.userId}.`,
  );
  const existingEnrollment = activeEnrollments.find((record) => record.canonicalCourseId === canonicalCourseId);

  if (existingEnrollment) {
    return existingEnrollment.id;
  }

  await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(enrollmentRef);

    if (existing.exists) {
      return;
    }

    transaction.set(enrollmentRef, {
      ...input,
      courseId: normalizedCourseId,
      canonicalCourseId,
      status: input.status || "active",
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return enrollmentDocId;
}
