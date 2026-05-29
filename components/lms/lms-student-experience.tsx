"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getCourseBySlug } from "@/lib/course-catalog";
import {
  getMyEnrollments,
  listLessonsByCourse,
  listModulesByCourse,
  listResourcesByCourse,
  listUserProgress,
  logFirestoreIssue,
  upsertLessonProgress,
  type FirestoreEnrollment,
  type FirestoreLesson,
  type FirestoreModule,
  type FirestoreProgress,
  type FirestoreResource,
} from "@/lib/firebase";
import { readEnrolledCourses } from "@/lib/my-learning";
import { getCourseSlugByCourseId } from "@/lib/offering-catalog";

type CourseBundle = {
  enrollment: FirestoreEnrollment & { id: string };
  modules: Array<FirestoreModule & { id: string }>;
  lessons: Array<FirestoreLesson & { id: string }>;
  resources: Array<FirestoreResource & { id: string }>;
  progressRows: Array<(Omit<FirestoreProgress, "userId"> & { userId: string; id: string })>;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
};

function toEmbedUrl(url?: string) {
  if (!url) return "";
  if (url.includes("embed/")) return url;
  return url.replace("watch?v=", "embed/");
}

function isLessonLocked(lesson: FirestoreLesson & { id: string }, enrollmentExists: boolean, completedIds: Set<string>) {
  if (!enrollmentExists) return true;
  if (!lesson.locked) return false;
  return !completedIds.has(lesson.id);
}

function buildLocalEnrollment(userId: string, courseSlug: string) {
  const normalizedCourseSlug = getCourseSlugByCourseId(courseSlug);
  const localCourse = readEnrolledCourses().find(
    (course) => getCourseSlugByCourseId(course.courseSlug) === normalizedCourseSlug,
  );

  if (!localCourse) {
    return null;
  }

  const catalogCourse = getCourseBySlug(normalizedCourseSlug);

  return {
    id: `local-${normalizedCourseSlug}`,
    userId,
    userName: "GenZNext Learner",
    userPhone: "",
    userEmail: "",
    courseId: normalizedCourseSlug,
    courseName: catalogCourse?.title || localCourse.title,
    amountPaid: 0,
    razorpayOrderId: "",
    razorpayPaymentId: "",
    invoiceNumber: "",
    enrolledAt: localCourse.enrolledAt,
    status: "active" as const,
    duration: catalogCourse?.duration || localCourse.duration,
    level: catalogCourse?.level || localCourse.level,
  } satisfies FirestoreEnrollment & { id: string };
}

function mergeRemoteAndLocalEnrollments(userId: string, enrollments: Array<FirestoreEnrollment & { id: string }>) {
  const enrollmentMap = new Map(
    enrollments.map((enrollment) => [getCourseSlugByCourseId(enrollment.courseId), enrollment]),
  );

  for (const localCourse of readEnrolledCourses()) {
    const localEnrollment = buildLocalEnrollment(userId, localCourse.courseSlug);
    if (localEnrollment && !enrollmentMap.has(localEnrollment.courseId)) {
      enrollmentMap.set(localEnrollment.courseId, localEnrollment);
    }
  }

  return Array.from(enrollmentMap.values());
}

async function loadAccessibleEnrollments(userId: string, context: string) {
  try {
    return mergeRemoteAndLocalEnrollments(userId, await getMyEnrollments(userId));
  } catch (error) {
    logFirestoreIssue(context, error);
    return mergeRemoteAndLocalEnrollments(userId, []);
  }
}

export function LmsMyLearningClient() {
  const { user, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CourseBundle[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        if (!cancelled) {
          setRows([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const enrollments = await loadAccessibleEnrollments(
          user.uid,
          "[LMS My Learning] Remote enrollment lookup failed; using verified local purchases",
        );
        const bundles = await Promise.all(
          enrollments.map(async (enrollment) => {
            const [modules, lessons, resources, progressRows] = await Promise.all([
              listModulesByCourse(enrollment.courseId),
              listLessonsByCourse(enrollment.courseId),
              listResourcesByCourse(enrollment.courseId),
              listUserProgress(user.uid, enrollment.courseId),
            ]);
            const publishedLessons = lessons.filter((item) => item.status === "published");
            const completed = progressRows.filter((item) => item.completed).length;
            const total = Math.max(publishedLessons.length, 1);
            return {
              enrollment,
              modules: modules as Array<FirestoreModule & { id: string }>,
              lessons: lessons as Array<FirestoreLesson & { id: string }>,
              resources: resources as Array<FirestoreResource & { id: string }>,
              progressRows,
              totalLessons: publishedLessons.length,
              completedLessons: completed,
              progressPercent: Math.min(100, Math.round((completed / total) * 100)),
            } satisfies CourseBundle;
          }),
        );
        if (!cancelled) {
          setRows(bundles);
        }
      } catch (loadError) {
        logFirestoreIssue("[LMS My Learning] Failed to load enrolled courses", loadError);
        if (!cancelled) {
          setError("Unable to load your enrolled courses right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (isAuthReady) {
      void load();
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthReady, user]);

  if (!isAuthReady || loading) {
    return <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A]">Loading your learning dashboard...</section>;
  }

  if (error) {
    return <section className="bg-[#F8FAFC] px-4 py-8 text-rose-600">{error}</section>;
  }

  if (!rows.length) {
    return (
      <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A]">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold">My Learning</h1>
          <p className="mt-2 text-sm text-[#475569]">No active enrollments found yet. Enroll in a course to unlock LMS access.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold">My Learning</h1>
          <p className="mt-2 text-sm text-[#475569]">Track progress and continue your enrolled programs.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((row) => (
            <article key={row.enrollment.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1">
              <h2 className="text-lg font-semibold">{row.enrollment.courseName}</h2>
              <p className="mt-2 text-xs text-[#64748B]">
                {row.completedLessons}/{row.totalLessons} lessons complete
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#4F46E5,#2563EB)]" style={{ width: `${row.progressPercent}%` }} />
              </div>
              <p className="mt-2 text-sm text-[#475569]">{row.progressPercent}% complete</p>
              <div className="mt-4 flex gap-2">
                <Link href={`/lms/course/${row.enrollment.courseId}`} className="rounded-xl bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)]">
                  Continue Learning
                </Link>
                <Link href={`/lms/player?course=${row.enrollment.courseId}`} className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#0F172A]">
                  Open Player
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LmsCourseDetailClient({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<CourseBundle | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        const [enrollments, modules, lessons, resources, progressRows] = await Promise.all([
          loadAccessibleEnrollments(user.uid, "[LMS Course Detail] Remote enrollment lookup failed; using verified local purchases"),
          listModulesByCourse(courseId),
          listLessonsByCourse(courseId),
          listResourcesByCourse(courseId),
          listUserProgress(user.uid, courseId),
        ]);
        const enrollment = enrollments.find((item) => getCourseSlugByCourseId(item.courseId) === getCourseSlugByCourseId(courseId))
          || buildLocalEnrollment(user.uid, courseId);
        if (!enrollment) {
          if (!cancelled) {
            setError("You are not enrolled in this course.");
            setBundle(null);
          }
          return;
        }
        const publishedLessons = lessons.filter((item) => item.status === "published");
        const completed = progressRows.filter((item) => item.completed).length;
        const total = Math.max(publishedLessons.length, 1);
        if (!cancelled) {
          setBundle({
            enrollment,
            modules: modules as Array<FirestoreModule & { id: string }>,
            lessons: lessons as Array<FirestoreLesson & { id: string }>,
            resources: resources as Array<FirestoreResource & { id: string }>,
            progressRows,
            totalLessons: publishedLessons.length,
            completedLessons: completed,
            progressPercent: Math.min(100, Math.round((completed / total) * 100)),
          });
        }
      } catch (loadError) {
        logFirestoreIssue("[LMS Course Detail] Failed to load course", loadError);
        if (!cancelled) {
          setError("Unable to load course content right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId, user]);

  const lessonsByModule = useMemo(() => {
    const map = new Map<string, Array<FirestoreLesson & { id: string }>>();
    (bundle?.lessons || []).forEach((lesson) => {
      const existing = map.get(lesson.moduleId) || [];
      existing.push(lesson);
      map.set(lesson.moduleId, existing);
    });
    map.forEach((items, key) => {
      map.set(key, items.sort((a, b) => a.order - b.order));
    });
    return map;
  }, [bundle?.lessons]);

  if (loading) return <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A]">Loading course content...</section>;
  if (error || !bundle) return <section className="bg-[#F8FAFC] px-4 py-8 text-rose-600">{error || "Course not found."}</section>;

  const completedIds = new Set(bundle.progressRows.filter((item) => item.completed).map((item) => item.lessonId));
  const assignments = bundle.resources.filter((item) => item.resourceType === "assignments");

  return (
    <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold">{bundle.enrollment.courseName}</h1>
          <p className="mt-2 text-sm text-[#475569]">
            {bundle.completedLessons}/{bundle.totalLessons} lessons complete ({bundle.progressPercent}%)
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#4F46E5,#2563EB)]" style={{ width: `${bundle.progressPercent}%` }} />
          </div>
        </header>

        <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold">Modules & Lessons</h2>
          <div className="mt-3 space-y-3">
            {bundle.modules.length ? bundle.modules.map((module) => (
              <div key={module.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <h3 className="text-sm font-semibold">{module.order}. {module.title}</h3>
                <p className="mt-1 text-xs text-[#64748B]">{module.description}</p>
                <div className="mt-2 space-y-2">
                  {(lessonsByModule.get(module.id) || []).map((lesson) => {
                    const locked = isLessonLocked(lesson, true, completedIds);
                    return (
                      <div key={lesson.id} className="flex items-center justify-between rounded-md border border-[#E2E8F0] bg-white px-3 py-2">
                        <div>
                          <p className="text-sm">{lesson.title}</p>
                          <p className="text-xs text-[#64748B]">{lesson.lessonType} • {lesson.duration || "n/a"}</p>
                        </div>
                        {locked ? (
                          <span className="text-xs text-[#64748B]">Locked</span>
                        ) : (
                          <Link href={`/lms/player?course=${bundle.enrollment.courseId}&lessonId=${lesson.id}`} className="text-xs text-[#4F46E5]">
                            Open Lesson
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )) : <p className="text-sm text-[#64748B]">No modules published yet.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold">Resources</h2>
          <div className="mt-3 space-y-2">
            {bundle.resources.length ? bundle.resources.map((resource) => (
              <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm">
                {resource.title}
              </a>
            )) : <p className="text-sm text-[#64748B]">No resources available yet.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold">Assignments</h2>
          <div className="mt-3 space-y-2">
            {assignments.length ? assignments.map((assignment) => (
              <a key={assignment.id} href={assignment.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm">
                {assignment.title}
              </a>
            )) : <p className="text-sm text-[#64748B]">No assignments uploaded yet.</p>}
          </div>
        </article>
      </div>
    </section>
  );
}

export function LmsPlayerClient({ courseSlug, lessonId }: { courseSlug: string; lessonId?: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<(FirestoreEnrollment & { id: string }) | null>(null);
  const [lessons, setLessons] = useState<Array<FirestoreLesson & { id: string }>>([]);
  const [progressRows, setProgressRows] = useState<Array<(Omit<FirestoreProgress, "userId"> & { userId: string; id: string })>>([]);
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user || !courseSlug) return;
      setLoading(true);
      setError(null);
      try {
        const [enrollments, rawLessons, progress] = await Promise.all([
          loadAccessibleEnrollments(user.uid, "[LMS Player] Remote enrollment lookup failed; using verified local purchases"),
          listLessonsByCourse(courseSlug),
          listUserProgress(user.uid, courseSlug),
        ]);
        const owned = enrollments.find((item) => getCourseSlugByCourseId(item.courseId) === getCourseSlugByCourseId(courseSlug))
          || buildLocalEnrollment(user.uid, courseSlug);
        if (!owned) {
          if (!cancelled) {
            setError("You are not enrolled in this course.");
          }
          return;
        }
        const published = (rawLessons as Array<FirestoreLesson & { id: string }>)
          .filter((item) => item.status === "published")
          .sort((a, b) => a.order - b.order);
        const startId = lessonId && published.some((item) => item.id === lessonId) ? lessonId : published[0]?.id || "";

        if (!cancelled) {
          setEnrollment(owned);
          setLessons(published);
          setProgressRows(progress);
          setActiveLessonId(startId);
        }
      } catch (loadError) {
        logFirestoreIssue("[LMS Player] Failed to load lessons", loadError);
        if (!cancelled) {
          setError("Unable to load lesson player right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonId, user]);

  const completedIds = useMemo(
    () => new Set(progressRows.filter((item) => item.completed).map((item) => item.lessonId)),
    [progressRows],
  );
  const activeLesson = lessons.find((item) => item.id === activeLessonId) || lessons[0];
  const totalLessons = lessons.length;
  const completedLessons = progressRows.filter((item) => item.completed).length;
  const progressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  async function markCompleted() {
    if (!user || !activeLesson || marking) return;
    setMarking(true);
    try {
      await upsertLessonProgress(user.uid, activeLesson.id, {
        courseSlug,
        moduleId: activeLesson.moduleId,
        completed: true,
        progressPercent: progressPercent,
      });
      const next = await listUserProgress(user.uid, courseSlug);
      setProgressRows(next);
    } catch (markError) {
      logFirestoreIssue("[LMS Player] Failed to mark lesson complete", markError);
      setError("Unable to update progress right now.");
    } finally {
      setMarking(false);
    }
  }

  if (loading) return <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A]">Loading lesson player...</section>;
  if (error) return <section className="bg-[#F8FAFC] px-4 py-8 text-rose-600">{error}</section>;
  if (!enrollment) return <section className="bg-[#F8FAFC] px-4 py-8 text-[#64748B]">No enrollment access for this course.</section>;
  if (!activeLesson) return <section className="bg-[#F8FAFC] px-4 py-8 text-[#64748B]">No published lessons available yet.</section>;

  return (
    <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold">{enrollment.courseName} Player</h1>
          <p className="mt-2 text-sm text-[#475569]">{completedLessons}/{totalLessons} lessons complete ({progressPercent}%)</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#4F46E5,#2563EB)]" style={{ width: `${progressPercent}%` }} />
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="aspect-video overflow-hidden rounded-xl border border-[#E2E8F0] bg-black">
              <iframe className="h-full w-full" src={toEmbedUrl(activeLesson.url)} title={activeLesson.title} allowFullScreen />
            </div>
            <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
              <p className="text-sm font-medium">{activeLesson.title}</p>
              <p className="mt-1 text-xs text-[#64748B]">{activeLesson.description || "Lesson details"}</p>
            </div>
            <button
              type="button"
              onClick={markCompleted}
              disabled={marking || completedIds.has(activeLesson.id)}
              className="mt-3 rounded-xl bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {completedIds.has(activeLesson.id) ? "Completed" : marking ? "Updating..." : "Mark as Completed"}
            </button>
          </article>

          <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold">Lesson Queue</h2>
            <div className="mt-3 space-y-2">
              {lessons.map((lesson) => {
                const locked = isLessonLocked(lesson, true, completedIds);
                return (
                  <button
                    type="button"
                    key={lesson.id}
                    onClick={() => !locked && setActiveLessonId(lesson.id)}
                    disabled={locked}
                    className="block w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <p className="text-sm">{lesson.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{locked ? "Locked" : completedIds.has(lesson.id) ? "Completed" : "Available"}</p>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
