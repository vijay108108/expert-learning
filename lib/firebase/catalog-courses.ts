import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { allCourses, type Course } from "@/data/courses";

const COLLECTION = "catalogCourses";

export type CatalogCourseOverride = Partial<Course> & {
  slug: string;
  isNew?: boolean;
  hidden?: boolean;
  updatedAt?: unknown;
};

function recomputeDerived(course: Course): Course {
  return {
    ...course,
    subtitle: course.shortDescription,
    overview: course.longDescription,
    roadmap: course.syllabusModules,
    outcomes: course.learningOutcomes,
    price: `INR ${course.priceValue.toLocaleString("en-IN")}`,
    originalPrice: `INR ${course.originalPriceValue.toLocaleString("en-IN")}`,
  };
}

function mergeOverride(base: Course | undefined, override: CatalogCourseOverride): Course | null {
  if (!base && !override.isNew) {
    return null;
  }

  const merged = {
    ...(base ?? defaultsForNewCourse(override.slug)),
    ...override,
  } as Course;

  return recomputeDerived(merged);
}

function defaultsForNewCourse(slug: string): Course {
  return {
    title: slug,
    slug,
    track: "ai",
    category: "ai",
    shortDescription: "",
    longDescription: "",
    level: "Beginner",
    duration: "",
    mode: "self-paced",
    priceType: "one-time",
    certification: "",
    toolsCovered: [],
    skillsYouWillLearn: [],
    learningOutcomes: [],
    targetAudience: [],
    prerequisites: [],
    syllabusModules: [],
    projects: [],
    officialResources: [],
    youtubeLessons: [],
    lmsResources: [],
    faqs: [],
    subtitle: "",
    overview: "",
    rating: 4.7,
    priceValue: 8999,
    originalPriceValue: 12999,
    price: "INR 8,999",
    originalPrice: "INR 12,999",
    highlight: "",
    tagLabel: "",
    tagTone: "blue",
    certificate: "",
    icon: "sparkles",
    tags: [],
    officialSyllabusUrl: "",
    roadmap: [],
    outcomes: [],
  };
}

async function fetchOverrides(): Promise<Record<string, CatalogCourseOverride>> {
  const db = getFirebaseDb();
  if (!db) return {};

  const snapshot = await getDocs(collection(db, COLLECTION));
  const map: Record<string, CatalogCourseOverride> = {};
  snapshot.docs.forEach((item) => {
    const data = item.data() as CatalogCourseOverride;
    map[item.id] = { ...data, slug: item.id };
  });
  return map;
}

export async function getMergedCourses(): Promise<Course[]> {
  const overrides = await fetchOverrides();
  const baseBySlug = new Map(allCourses.map((c) => [c.slug, c]));

  const result: Course[] = [];

  for (const course of allCourses) {
    const override = overrides[course.slug];
    if (override?.hidden) continue;
    result.push(override ? (mergeOverride(course, override) ?? course) : course);
  }

  for (const [slug, override] of Object.entries(overrides)) {
    if (baseBySlug.has(slug) || override.hidden) continue;
    const created = mergeOverride(undefined, override);
    if (created) result.push(created);
  }

  return result;
}

export async function getMergedCourseBySlug(slug: string): Promise<Course | undefined> {
  const merged = await getMergedCourses();
  return merged.find((c) => c.slug === slug);
}

export async function listCatalogOverrides() {
  return fetchOverrides();
}

export async function getCatalogOverrideBySlug(slug: string) {
  const db = getFirebaseDb();
  if (!db) return null;
  const snapshot = await getDoc(doc(db, COLLECTION, slug));
  return snapshot.exists() ? ({ ...(snapshot.data() as CatalogCourseOverride), slug } as CatalogCourseOverride) : null;
}

export async function upsertCatalogCourse(slug: string, data: Partial<Course>, options: { isNew?: boolean } = {}) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured.");

  await setDoc(
    doc(db, COLLECTION, slug),
    {
      ...data,
      slug,
      ...(options.isNew ? { isNew: true } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function hideCatalogCourse(slug: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured.");
  await setDoc(doc(db, COLLECTION, slug), { slug, hidden: true, updatedAt: serverTimestamp() }, { merge: true });
}

export async function restoreCatalogCourse(slug: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured.");
  await setDoc(doc(db, COLLECTION, slug), { slug, hidden: false, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteCatalogCourse(slug: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore is not configured.");
  await deleteDoc(doc(db, COLLECTION, slug));
}
