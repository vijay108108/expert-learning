import { getCourseBySlug } from "@/lib/course-catalog";
import { getCourseSlugByCourseId } from "@/lib/course-identity";
import { dedupeCourseSlugRecords } from "@/lib/enrollment-utils";
import type { StoredOrderSuccess } from "@/lib/order-success";

export const myLearningStorageKey = "genznext-my-learning";
export const enrolledCoursesStorageKey = "enrolledCourses";

export type EnrolledCourse = {
  id: string;
  courseSlug: string;
  title: string;
  batch: string;
  status: "Active" | "Enrolled";
  enrolledAt: string;
  duration: string;
  level: string;
  syllabusUrl: string;
  progress: number;
};

export type MyLearningCourse = {
  id: string;
  courseSlug: string;
  title: string;
  status: "Active" | "Enrolled";
  batchLabel: string;
  progress: number;
  enrolledAt: string;
  duration: string;
  level: string;
  syllabusUrl: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function sanitizeProgress(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 25;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeEnrolledCourse(input: Partial<EnrolledCourse> & { title?: string; courseSlug?: string; id?: string }) {
  const rawCourseSlug = typeof input.courseSlug === "string" && input.courseSlug
    ? input.courseSlug
    : typeof input.id === "string" && input.id
      ? input.id
      : "";
  const courseSlug = getCourseSlugByCourseId(rawCourseSlug);

  if (!courseSlug || typeof input.title !== "string" || !input.title) {
    return null;
  }

  const catalogCourse = getCourseBySlug(courseSlug);

  return {
    id: typeof input.id === "string" && input.id ? input.id : courseSlug,
    courseSlug,
    title: input.title || catalogCourse?.title || courseSlug,
    batch: typeof input.batch === "string" && input.batch ? input.batch : "Summer 2026",
    status: input.status === "Enrolled" ? "Enrolled" : "Active",
    enrolledAt: typeof input.enrolledAt === "string" && input.enrolledAt ? input.enrolledAt : new Date().toISOString(),
    duration:
      typeof input.duration === "string" && input.duration
        ? input.duration
        : catalogCourse?.duration || "Program Access",
    level:
      typeof input.level === "string" && input.level
        ? input.level
        : catalogCourse?.level || "Career Track",
    syllabusUrl:
      typeof input.syllabusUrl === "string" && input.syllabusUrl
        ? input.syllabusUrl
        : catalogCourse?.officialSyllabusUrl || "",
    progress: sanitizeProgress(input.progress),
  } satisfies EnrolledCourse;
}

function readStoredJson<T>(key: string) {
  if (!isBrowser()) {
    return null as T | null;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return null as T | null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null as T | null;
  }
}

function readLegacyMyLearningCourses() {
  const parsed = readStoredJson<MyLearningCourse[]>(myLearningStorageKey);

  if (!Array.isArray(parsed)) {
    return [] as MyLearningCourse[];
  }

  return parsed
    .filter((item) => item && typeof item.courseSlug === "string")
    .map((item) => ({
      ...item,
      progress: sanitizeProgress(item.progress),
    }));
}

export function readEnrolledCourses() {
  const parsed = readStoredJson<Array<Partial<EnrolledCourse>>>(enrolledCoursesStorageKey);

  if (Array.isArray(parsed)) {
    return dedupeCourseSlugRecords(
      parsed
      .map((item) => normalizeEnrolledCourse(item))
      .filter((item): item is EnrolledCourse => Boolean(item))
      .sort((left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime()),
      "Duplicate local enrolled course records detected.",
    );
  }

  return dedupeCourseSlugRecords(
    readLegacyMyLearningCourses()
      .map((course) =>
        normalizeEnrolledCourse({
          id: course.id,
          courseSlug: course.courseSlug,
          title: course.title,
          batch: course.batchLabel,
          status: course.status,
          enrolledAt: course.enrolledAt,
          duration: course.duration,
          level: course.level,
          syllabusUrl: course.syllabusUrl,
          progress: course.progress,
        }),
      )
      .filter((item): item is EnrolledCourse => Boolean(item)),
    "Duplicate legacy My Learning records detected.",
  );
}

export function readEnrolledCourseSlugs() {
  return readEnrolledCourses().map((course) => course.courseSlug);
}

function toMyLearningCourse(course: EnrolledCourse): MyLearningCourse {
  return {
    id: course.id,
    courseSlug: course.courseSlug,
    title: course.title,
    status: course.status,
    batchLabel: course.batch,
    progress: course.progress,
    enrolledAt: course.enrolledAt,
    duration: course.duration,
    level: course.level,
    syllabusUrl: course.syllabusUrl,
  };
}

function writeLegacyMyLearningCourses(courses: EnrolledCourse[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(myLearningStorageKey, JSON.stringify(courses.map(toMyLearningCourse)));
}

export function readMyLearningCourses() {
  return readEnrolledCourses().map(toMyLearningCourse);
}

export function saveEnrolledCourses(courses: EnrolledCourse[]) {
  if (!isBrowser()) {
    return courses;
  }

  const normalized = dedupeCourseSlugRecords(
    courses
    .map((course) => normalizeEnrolledCourse(course))
    .filter((course): course is EnrolledCourse => Boolean(course))
    .sort((left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime()),
    "Duplicate local enrollment writes detected.",
  );

  window.localStorage.setItem(enrolledCoursesStorageKey, JSON.stringify(normalized));
  writeLegacyMyLearningCourses(normalized);
  return normalized;
}

export function saveMyLearningCourses(courses: MyLearningCourse[]) {
  return saveEnrolledCourses(
    courses.map((course) => ({
      id: course.id,
      courseSlug: course.courseSlug,
      title: course.title,
      batch: course.batchLabel,
      status: course.status,
      enrolledAt: course.enrolledAt,
      duration: course.duration,
      level: course.level,
      syllabusUrl: course.syllabusUrl,
      progress: course.progress,
    })),
  );
}

export function hasMyLearningCourses() {
  return readEnrolledCourses().length > 0;
}

export function syncMyLearningFromInvoice(invoice: StoredOrderSuccess) {
  const existing = readEnrolledCourses();
  const courseMap = new Map(existing.map((course) => [course.courseSlug, course]));

  for (const line of invoice.courses) {
    const normalizedCourseSlug = getCourseSlugByCourseId(line.slug);
    const course = getCourseBySlug(normalizedCourseSlug);
    const previous = courseMap.get(normalizedCourseSlug);

    courseMap.set(normalizedCourseSlug, {
      id: previous?.id || normalizedCourseSlug,
      courseSlug: normalizedCourseSlug,
      title: line.title || course?.title || normalizedCourseSlug,
      batch: "Summer 2026",
      status: "Active",
      progress: sanitizeProgress(previous?.progress ?? 25),
      enrolledAt: invoice.paidAtIso,
      duration: line.duration || course?.duration || "Program Access",
      level: line.level || course?.level || "Career Track",
      syllabusUrl: course?.officialSyllabusUrl || "",
    } satisfies EnrolledCourse);
  }

  const nextCourses = Array.from(courseMap.values()).sort(
    (left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime(),
  );

  return saveEnrolledCourses(nextCourses);
}
