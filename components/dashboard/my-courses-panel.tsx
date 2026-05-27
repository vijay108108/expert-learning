"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, ExternalLink, Layers3, LoaderCircle, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getCourseBySlug } from "@/lib/course-catalog";
import { getMyEnrollments, logFirestoreIssue, type FirestoreEnrollment } from "@/lib/firebase";
import { readEnrolledCourses, type EnrolledCourse } from "@/lib/my-learning";
import { latestOrderStorageKey, type StoredOrderSuccess } from "@/lib/order-success";
import { cn } from "@/lib/utils";

type MyCoursesPanelProps = {
  paymentCompleted?: boolean;
};

type DashboardCourseCard = {
  id: string;
  courseSlug: string;
  title: string;
  status: string;
  batch: string;
  enrolledAt: string;
  syllabusUrl: string;
  duration: string;
  level: string;
};

function normalizePhoneNumber(value: string | null | undefined) {
  const digits = (value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function formatStatus(value?: string | null) {
  if (!value) {
    return "Active";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatEnrollmentDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function buildInvoiceFallbackCourses(invoice: StoredOrderSuccess) {
  return invoice.courses.map((courseLine) => {
    const catalogCourse = getCourseBySlug(courseLine.slug);

    return {
      id: `invoice-${invoice.orderId}-${courseLine.slug}`,
      courseSlug: courseLine.slug,
      title: catalogCourse?.title || courseLine.title,
      status: "Active",
      batch: "Summer 2026",
      enrolledAt: invoice.paidAtIso,
      syllabusUrl: catalogCourse?.officialSyllabusUrl || "",
      duration: catalogCourse?.duration || courseLine.duration,
      level: catalogCourse?.level || courseLine.level,
    } satisfies DashboardCourseCard;
  });
}

function buildLocalCourses(courses: EnrolledCourse[]) {
  return courses.map((course) => {
    const catalogCourse = getCourseBySlug(course.courseSlug);

    return {
      id: `local-${course.courseSlug}`,
      courseSlug: course.courseSlug,
      title: catalogCourse?.title || course.title,
      status: formatStatus(course.status),
      batch: course.batch || "Summer 2026",
      enrolledAt: course.enrolledAt,
      syllabusUrl: course.syllabusUrl || catalogCourse?.officialSyllabusUrl || "",
      duration: course.duration || catalogCourse?.duration || "Program Access",
      level: course.level || catalogCourse?.level || "Career Track",
    } satisfies DashboardCourseCard;
  });
}

function buildFirestoreCourses(enrollments: Array<FirestoreEnrollment & { id: string }>) {
  return enrollments.map((enrollment) => {
    const catalogCourse = getCourseBySlug(enrollment.courseId);

    return {
      id: enrollment.id,
      courseSlug: enrollment.courseId,
      title: catalogCourse?.title || enrollment.courseName,
      status: formatStatus(enrollment.status),
      batch: "Summer 2026",
      enrolledAt: enrollment.enrolledAt,
      syllabusUrl: catalogCourse?.officialSyllabusUrl || "",
      duration: catalogCourse?.duration || enrollment.duration || "Program Access",
      level: catalogCourse?.level || enrollment.level || "Career Track",
    } satisfies DashboardCourseCard;
  });
}

function mergeCourses(...courseLists: DashboardCourseCard[][]) {
  const courseMap = new Map<string, DashboardCourseCard>();

  for (const list of courseLists) {
    for (const course of list) {
      if (!courseMap.has(course.courseSlug)) {
        courseMap.set(course.courseSlug, course);
      }
    }
  }

  return Array.from(courseMap.values()).sort(
    (left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime(),
  );
}

export function MyCoursesPanel({ paymentCompleted = false }: MyCoursesPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const { isAuthReady, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Array<FirestoreEnrollment & { id: string }>>([]);
  const [localCourses, setLocalCourses] = useState<EnrolledCourse[]>([]);
  const [invoiceFallbackCourses, setInvoiceFallbackCourses] = useState<DashboardCourseCard[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(paymentCompleted);
  const [selectedSyllabusSlug, setSelectedSyllabusSlug] = useState<string | null>(null);
  const courseCardRefs = useRef<Record<string, HTMLElement | null>>({});

  const selectedSyllabusCourse = useMemo(
    () => (selectedSyllabusSlug ? getCourseBySlug(selectedSyllabusSlug) : null),
    [selectedSyllabusSlug],
  );

  const dashboardCourses = useMemo(
    () => mergeCourses(buildFirestoreCourses(user ? enrollments : []), buildLocalCourses(localCourses), invoiceFallbackCourses),
    [enrollments, invoiceFallbackCourses, localCourses, user],
  );
  const highlightedCourseSlug = searchParams.get("course");

  useEffect(() => {
    if (!highlightedCourseSlug || !dashboardCourses.some((course) => course.courseSlug === highlightedCourseSlug)) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      courseCardRefs.current[highlightedCourseSlug]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [dashboardCourses, highlightedCourseSlug]);

  useEffect(() => {
    if (!showSuccessToast) {
      return;
    }

    const timer = window.setTimeout(() => setShowSuccessToast(false), 4200);
    return () => window.clearTimeout(timer);
  }, [showSuccessToast]);

  useEffect(() => {
    function syncDeviceCourses() {
      const storedLocalCourses = readEnrolledCourses();
      setLocalCourses(storedLocalCourses);

      try {
        const raw = window.localStorage.getItem(latestOrderStorageKey);

        if (!raw) {
          setInvoiceFallbackCourses([]);
          return;
        }

        const invoice = JSON.parse(raw) as StoredOrderSuccess;

        if (user) {
          const invoicePhone = normalizePhoneNumber(invoice.customer.phone);
          const userPhone = normalizePhoneNumber(user.phoneNumber);

          if (invoicePhone && userPhone && invoicePhone !== userPhone) {
            setInvoiceFallbackCourses([]);
            return;
          }
        }

        setInvoiceFallbackCourses(buildInvoiceFallbackCourses(invoice));
      } catch (nextError) {
        logFirestoreIssue("[My Courses] Unable to restore latest invoice enrollment", nextError);
        setInvoiceFallbackCourses([]);
      }
    }

    syncDeviceCourses();
    window.addEventListener("storage", syncDeviceCourses);

    return () => window.removeEventListener("storage", syncDeviceCourses);
  }, [user]);

  useEffect(() => {
    if (!isAuthReady || !user) {
      return;
    }

    let active = true;
    const frame = window.requestAnimationFrame(() => {
      if (!active) {
        return;
      }

      setLoading(true);
      setError(null);
    });

    void (async () => {
      try {
        const nextEnrollments = await getMyEnrollments(user.uid);

        if (!active) {
          return;
        }

        setEnrollments(nextEnrollments);
      } catch (nextError) {
        if (!active) {
          return;
        }

        setError(nextError instanceof Error ? nextError.message : "Unable to load your courses.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [isAuthReady, user]);

  if (!isAuthReady || (user && loading)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,#071028_0%,#0B1736_100%)] px-4 py-10">
        <div className="inline-flex items-center gap-3 rounded-[18px] border border-white/10 bg-[rgba(15,23,42,0.82)] px-5 py-4 text-sm text-[#CBD5E1] shadow-[0_20px_48px_rgba(2,6,23,0.32)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#F97316]" />
          Loading your enrolled programs...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,#071028_0%,#0B1736_100%)] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <AnimatePresence>
          {showSuccessToast ? (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: "easeOut" }}
              className="mb-5 rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 shadow-[0_14px_36px_rgba(16,185,129,0.14)]"
            >
              Enrollment successful! Check Dashboard → My Courses.
            </motion.div>
          ) : null}
        </AnimatePresence>

        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.34)] sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">
                <Sparkles className="h-3.5 w-3.5" />
                Student Dashboard
              </div>
              <h1 className="mt-4 text-[30px] font-semibold leading-[1.1] text-white">My Courses</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#B7C3D9]">
                Access your enrolled programs, syllabus, and learning resources.
              </p>
            </div>
            {dashboardCourses.length ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[12px] text-[#D8E1F0]">
                <Layers3 className="h-3.5 w-3.5 text-[#FDBA74]" />
                {dashboardCourses.length} enrolled program{dashboardCourses.length === 1 ? "" : "s"}
              </div>
            ) : null}
          </div>
        </section>

        {user && error ? (
          <div className="mt-5 rounded-[16px] border border-[rgba(248,113,113,0.24)] bg-[rgba(127,29,29,0.24)] p-4 text-sm text-[#FCA5A5]">
            {error}
          </div>
        ) : null}

        {dashboardCourses.length ? (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboardCourses.map((course) => (
              <article
                key={course.id}
                ref={(node) => {
                  courseCardRefs.current[course.courseSlug] = node;
                }}
                className={cn(
                  "group rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.76))] p-5 shadow-[0_18px_42px_rgba(2,6,23,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[rgba(249,115,22,0.24)] hover:shadow-[0_24px_52px_rgba(2,6,23,0.4),0_0_28px_rgba(249,115,22,0.08)]",
                  highlightedCourseSlug === course.courseSlug &&
                    "border-[rgba(52,211,153,0.34)] bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(12,37,28,0.82))] shadow-[0_24px_52px_rgba(2,6,23,0.4),0_0_28px_rgba(52,211,153,0.12)]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[19px] font-semibold leading-[1.3] text-white">{course.title}</h2>
                    <div className="mt-4 space-y-2 text-sm text-[#C8D3E3]">
                      <p>
                        <span className="text-[#8FA1BF]">Status:</span> {course.status}
                      </p>
                      <p>
                        <span className="text-[#8FA1BF]">Batch:</span> {course.batch}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.12)] px-3 py-1 text-[11px] font-semibold text-[#FDBA74]">
                    Active
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-[#8FA1BF]">
                  <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1">{course.duration}</span>
                  <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1">{course.level}</span>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/${encodeURIComponent(course.courseSlug)}`)}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#F97316,#FB923C)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(249,115,22,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.3)]"
                  >
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSyllabusSlug(course.courseSlug)}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.08)] px-4 py-3 text-sm font-medium text-[#FDBA74] transition hover:border-[rgba(249,115,22,0.32)] hover:bg-[rgba(249,115,22,0.12)]"
                  >
                    View Syllabus
                    <BookOpen className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 text-[11px] text-[#7C8CA8]">
                  Enrolled on {formatEnrollmentDate(course.enrolledAt)}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-8 text-center shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
            <BookOpen className="mx-auto h-9 w-9 text-[#8FA1BF]" />
            <h2 className="mt-4 text-lg font-semibold text-white">You haven&apos;t enrolled in any programs yet.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#B7C3D9]">
              Complete an enrollment and your purchased programs will appear here automatically.
            </p>
            <Link
              href="/courses"
              className="mt-5 inline-flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#F97316,#FB923C)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5"
            >
              Explore Courses
            </Link>
          </section>
        )}
      </div>

      <AnimatePresence>
        {selectedSyllabusCourse ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.16 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-[rgba(2,6,23,0.72)] px-4 py-6 backdrop-blur-[4px]"
          >
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: "easeOut" }}
              className="w-full max-w-3xl rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,30,0.96),rgba(15,23,42,0.9))] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.52)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FDBA74]">Course Syllabus</div>
                  <h2 className="mt-3 text-[26px] font-semibold leading-[1.2] text-white">{selectedSyllabusCourse.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[#B7C3D9]">{selectedSyllabusCourse.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSyllabusSlug(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[#D8E1F0] transition hover:border-[rgba(249,115,22,0.22)] hover:text-[#FDBA74]"
                  aria-label="Close syllabus"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <div className="text-[12px] font-semibold text-[#FDBA74]">Roadmap</div>
                  <ul className="mt-3 space-y-2 text-sm text-[#D8E1F0]">
                    {selectedSyllabusCourse.roadmap.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <div className="text-[12px] font-semibold text-[#FDBA74]">Tools Covered</div>
                  <ul className="mt-3 space-y-2 text-sm text-[#D8E1F0]">
                    {selectedSyllabusCourse.toolsCovered.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <div className="text-[12px] font-semibold text-[#FDBA74]">Outcomes</div>
                  <ul className="mt-3 space-y-2 text-sm text-[#D8E1F0]">
                    {selectedSyllabusCourse.outcomes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSyllabusSlug(null);
                    router.push(`/dashboard/${encodeURIComponent(selectedSyllabusCourse.slug)}`);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#F97316,#FB923C)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href={selectedSyllabusCourse.officialSyllabusUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.08)] px-5 py-3 text-sm font-medium text-[#FDBA74] transition hover:border-[rgba(249,115,22,0.32)] hover:bg-[rgba(249,115,22,0.12)]"
                >
                  Open Official Syllabus
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
