"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export type LessonProgressState = "completed";

export type LessonQuestion = {
  id: string;
  userId: string;
  question: string;
  answer?: string;
  createdAt?: string;
  answeredAt?: string;
};

export type LmsNotification = {
  id: string;
  userId: string;
  type: "live" | "resource" | "assignment" | "unlock";
  title: string;
  read?: boolean;
  target?: string;
  createdAt?: string;
};

export type LastVisitedLesson = {
  courseId: string;
  lessonId: string;
  moduleId: string;
  updatedAt?: string;
};

export async function getCompletedLessons(userId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return new Set<string>();
  }

  const snapshot = await getDocs(collection(db, "enrollments", userId, "progress"));
  return new Set(
    snapshot.docs
      .filter((item) => item.data().status === "completed")
      .map((item) => item.id),
  );
}

export async function markLessonCompleted(userId: string, lessonId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  await setDoc(
    doc(db, "enrollments", userId, "progress", lessonId),
    {
      status: "completed" satisfies LessonProgressState,
      completedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getLastVisitedLesson(userId: string, courseId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "lastVisited", userId, "courses", courseId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    courseId,
    ...(snapshot.data() as Omit<LastVisitedLesson, "courseId">),
  } satisfies LastVisitedLesson;
}

export async function getLastVisitedLessons(userId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return [] as LastVisitedLesson[];
  }

  const snapshot = await getDocs(collection(db, "lastVisited", userId, "courses"));
  return snapshot.docs.map((item) => ({
    courseId: item.id,
    ...(item.data() as Omit<LastVisitedLesson, "courseId">),
  }));
}

export async function saveLastVisitedLesson(
  userId: string,
  courseId: string,
  lesson: Pick<LastVisitedLesson, "lessonId" | "moduleId">,
) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  await setDoc(
    doc(db, "lastVisited", userId, "courses", courseId),
    {
      ...lesson,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getLessonNote(userId: string, lessonId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return "";
  }

  const snapshot = await getDocs(collection(db, "enrollments", userId, "notes"));
  const noteDoc = snapshot.docs.find((item) => item.id === lessonId);
  return String(noteDoc?.data().text || "");
}

export async function saveLessonNote(userId: string, lessonId: string, text: string) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  await setDoc(
    doc(db, "enrollments", userId, "notes", lessonId),
    {
      text,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveLessonBookmark(userId: string, lessonId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  await setDoc(
    doc(db, "enrollments", userId, "bookmarks", lessonId),
    {
      lessonId,
      bookmarkedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getCourseQuestions(courseId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return [] as LessonQuestion[];
  }

  const snapshot = await getDocs(collection(db, "qa", courseId, "questions"));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<LessonQuestion, "id">),
  }));
}

export async function addCourseQuestion(courseId: string, userId: string, question: string) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const createdAt = new Date().toISOString();
  const ref = await addDoc(collection(db, "qa", courseId, "questions"), {
    userId,
    question,
    createdAt,
  });

  return {
    id: ref.id,
    userId,
    question,
    createdAt,
  } satisfies LessonQuestion;
}

export async function getUserNotifications(userId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return [] as LmsNotification[];
  }

  const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", userId));
  const snapshot = await getDocs(notificationsQuery);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<LmsNotification, "id">),
  }));
}

export async function markNotificationRead(notificationId: string) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
    readAt: serverTimestamp(),
  });
}
