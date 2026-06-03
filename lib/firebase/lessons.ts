import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export type FirestoreLesson = {
  courseSlug: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  lessonType: "youtube" | "live" | "pdf" | "lab" | "quiz" | "notes" | "assignment" | "official-doc" | "certification-guide";
  url?: string;
  duration?: string;
  locked: boolean;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
};

function mapLesson(id: string, data: DocumentData) {
  return { id, ...(data as FirestoreLesson) };
}

export async function listLessonsByModule(moduleId: string) {
  const db = getFirebaseDb();
  if (!db) return [];

  const snapshot = await getDocs(query(collection(db, "lessons"), where("moduleId", "==", moduleId)));
  return snapshot.docs.map((item) => mapLesson(item.id, item.data())).sort((a, b) => a.order - b.order);
}

export async function listLessonsByCourse(courseSlug: string) {
  const db = getFirebaseDb();
  if (!db) return [];

  const snapshot = await getDocs(query(collection(db, "lessons"), where("courseSlug", "==", courseSlug)));
  return snapshot.docs.map((item) => mapLesson(item.id, item.data()));
}

export async function createLesson(input: FirestoreLesson) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured for lessons.");

  const ref = await addDoc(collection(db, "lessons"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLesson(lessonId: string, input: Partial<FirestoreLesson>) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured for lessons.");

  await updateDoc(doc(db, "lessons", lessonId), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLesson(lessonId: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured for lessons.");
  await deleteDoc(doc(db, "lessons", lessonId));
}
