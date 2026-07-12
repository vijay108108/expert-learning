import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

const COLLECTION = "workshopConfigs";

export type WorkshopConfig = {
  slug: string;
  title: string;
  posterUrl: string;
  status: "draft" | "published" | "archived";
  capacity: number;
  startAtIso: string;
  endAtIso: string;
  instructorName: string;
  meetingUrl: string;
  whatsappUrl: string;
  certificateTemplate: string;
  updatedAt?: unknown;
};

function defaultWorkshopConfig(slug: string): WorkshopConfig {
  return {
    slug,
    title: "AI Developer Launch Lab",
    posterUrl: "",
    status: "published",
    capacity: 500,
    startAtIso: "2026-07-19T18:00:00+05:30",
    endAtIso: "2026-07-19T20:00:00+05:30",
    instructorName: "GenZNext Faculty",
    meetingUrl: "",
    whatsappUrl: "",
    certificateTemplate: "AI Developer Launch Lab Workshop Completion",
  };
}

export async function getWorkshopConfigBySlug(slug: string): Promise<WorkshopConfig> {
  const db = getFirebaseDb();
  if (!db) {
    return defaultWorkshopConfig(slug);
  }

  const snapshot = await getDoc(doc(db, COLLECTION, slug));
  if (!snapshot.exists()) {
    return defaultWorkshopConfig(slug);
  }

  return {
    ...defaultWorkshopConfig(slug),
    ...(snapshot.data() as Partial<WorkshopConfig>),
    slug,
  };
}

export async function upsertWorkshopConfig(slug: string, data: Partial<WorkshopConfig>) {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  await setDoc(
    doc(db, COLLECTION, slug),
    {
      ...data,
      slug,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
