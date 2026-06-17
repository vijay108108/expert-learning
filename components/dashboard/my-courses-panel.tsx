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
import { getCanonicalCourseId, getCheckoutOfferingBySlug, getCourseSlugByCourseId } from "@/lib/offering-catalog";
import { readEnrolledCourses, type EnrolledCourse } from "@/lib/my-learning";
import { latestOrderStorageKey, type StoredOrderSuccess } from "@/lib/order-success";
import { cn } from "@/lib/utils";

type MyCoursesPanelProps = {
  paymentCompleted?: boolean;
};

type DashboardCourseCard = {
  id: string;
  courseSlug: string;
  enrollmentType: "course" | "program";
  purchasedOfferingSlug?: string;
  programSlug?: string;
  programName?: string;
  programCourseSlugs?: string[];
  primaryCourseSlug?: string;
  title: string;
  status: string;
  batch: string;
  enrolledAt: string;
  syllabusUrl: string;
  duration: string;
  level: string;
};

function isSummerTrainingCourse(courseSlug: string, title: string) {
  const slug = courseSlug.toLowerCase();
  const courseTitle = title.toLowerCase();
  return slug.includes("industrial-training") || courseTitle.includes("industrial training");
}

function getBatchLabel(courseSlug: string, title: string, fallback?: string | null) {
  if (isSummerTrainingCourse(courseSlug, title)) {
    return fallback?.trim() || "Summer 2026";
  }

  return "";
}

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
    const normalizedCourseSlug = getCourseSlugByCourseId(courseLine.slug);
    const catalogCourse = getCourseBySlug(normalizedCourseSlug);
    const resolvedTitle = courseLine.title || catalogCourse?.title || normalizedCourseSlug;

    return {
      id: `invoice-${invoice.orderId}-${normalizedCourseSlug}`,
      courseSlug: normalizedCourseSlug,
      enrollmentType: courseLine.enrollmentType || "course",
      purchasedOfferingSlug: courseLine.purchasedOfferingSlug || normalizedCourseSlug,
      programSlug: courseLine.programSlug || "",
      programName: courseLine.programName || "",
      programCourseSlugs: courseLine.programCourseSlugs || [],
      primaryCourseSlug: courseLine.primaryCourseSlug || normalizedCourseSlug,
      title: resolvedTitle,
      status: "Active",
      batch: getBatchLabel(normalizedCourseSlug, resolvedTitle),
      enrolledAt: invoice.paidAtIso,
      syllabusUrl: catalogCourse?.officialSyllabusUrl || "",
      duration: courseLine.duration || catalogCourse?.duration || "Program Access",
      level: courseLine.level || catalogCourse?.level || "Career Track",
    } satisfies DashboardCourseCard;
  });
}

function buildLocalCourses(courses: EnrolledCourse[]) {
  return courses.map((course) => {
    const catalogCourse = getCourseBySlug(course.courseSlug);
    const resolvedTitle = course.title || catalogCourse?.title || course.courseSlug;

    return {
      id: `local-${course.courseSlug}`,
      courseSlug: course.courseSlug,
      enrollmentType: course.enrollmentType || "course",
      purchasedOfferingSlug: course.purchasedOfferingSlug || course.courseSlug,
      programSlug: course.programSlug || "",
      programName: course.programName || "",
      programCourseSlugs: course.programCourseSlugs || [],
      primaryCourseSlug: course.primaryCourseSlug || course.courseSlug,
      title: resolvedTitle,
      status: formatStatus(course.status),
      batch: getBatchLabel(course.courseSlug, resolvedTitle, course.batch),
      enrolledAt: course.enrolledAt,
      syllabusUrl: course.syllabusUrl || catalogCourse?.officialSyllabusUrl || "",
      duration: course.duration || catalogCourse?.duration || "Program Access",
      level: course.level || catalogCourse?.level || "Career Track",
    } satisfies DashboardCourseCard;
  });
}

function buildFirestoreCourses(enrollments: Array<FirestoreEnrollment & { id: string }>) {
  return enrollments.map((enrollment) => {
    const normalizedCourseSlug = getCourseSlugByCourseId(enrollment.courseId);
    const catalogCourse = getCourseBySlug(normalizedCourseSlug);
    const purchasedOffering = enrollment.purchasedOfferingSlug
      ? getCheckoutOfferingBySlug(enrollment.purchasedOfferingSlug)
      : null;
    const resolvedTitle =
      (purchasedOffering?.kind === "bundle" ? purchasedOffering.title : "")
      || enrollment.courseName
      || catalogCourse?.title
      || normalizedCourseSlug;

    return {
      id: enrollment.id,
      courseSlug: normalizedCourseSlug,
      enrollmentType: enrollment.enrollmentType || (purchasedOffering?.kind === "bundle" ? "program" : "course"),
      purchasedOfferingSlug: enrollment.purchasedOfferingSlug || normalizedCourseSlug,
      programSlug: enrollment.programSlug || (purchasedOffering?.kind === "bundle" ? purchasedOffering.slug : ""),
      programName: enrollment.programName || (purchasedOffering?.kind === "bundle" ? purchasedOffering.title : ""),
      programCourseSlugs: enrollment.programCourseSlugs || (purchasedOffering?.kind === "bundle" ? purchasedOffering.courseSlugs : []),
      primaryCourseSlug: enrollment.primaryCourseSlug || normalizedCourseSlug,
      title: resolvedTitle,
      status: formatStatus(enrollment.status),
      batch: getBatchLabel(normalizedCourseSlug, resolvedTitle),
      enrolledAt: enrollment.enrolledAt,
      syllabusUrl: catalogCourse?.officialSyllabusUrl || "",
      duration: catalogCourse?.duration || enrollment.duration || "Program Access",
      level: catalogCourse?.level || enrollment.level || "Career Track",
    } satisfies DashboardCourseCard;
  });
}

function mergeCourses(...courseLists: DashboardCourseCard[][]) {
  const courseMap = new Map<string, DashboardCourseCard>();
  const duplicateKeys: string[] = [];
  const duplicateEnrollmentIds: string[] = [];

  function getCardGroupingKey(course: DashboardCourseCard) {
    if (course.enrollmentType === "program") {
      const programSlug = course.programSlug || course.purchasedOfferingSlug || "";
      if (programSlug) {
        return `program:${programSlug}`;
      }
    }

    const purchasedOffering = course.purchasedOfferingSlug
      ? getCheckoutOfferingBySlug(course.purchasedOfferingSlug)
      : null;

    if (purchasedOffering?.kind === "bundle") {
      return `program:${purchasedOffering.slug}`;
    }

    return `course:${getCanonicalCourseId(course.courseSlug)}`;
  }

  for (const list of courseLists) {
    for (const course of list) {
      const groupingKey = getCardGroupingKey(course);
      const existing = courseMap.get(groupingKey);

      if (!existing) {
        courseMap.set(groupingKey, course);
      } else {
        duplicateKeys.push(groupingKey);
        duplicateEnrollmentIds.push(course.id);
        const mergedProgramCourseSlugs = Array.from(
          new Set([...(existing.programCourseSlugs || []), ...(course.programCourseSlugs || [])]),
        );
        const shouldReplace = new Date(course.enrolledAt).getTime() > new Date(existing.enrolledAt).getTime();

        courseMap.set(
          groupingKey,
          shouldReplace
            ? {
                ...course,
                programCourseSlugs: mergedProgramCourseSlugs,
                primaryCourseSlug: course.primaryCourseSlug || existing.primaryCourseSlug || course.courseSlug,
              }
            : {
                ...existing,
                programCourseSlugs: mergedProgramCourseSlugs,
                primaryCourseSlug: existing.primaryCourseSlug || course.primaryCourseSlug || existing.courseSlug,
              },
        );
      }
    }
  }

  if (duplicateKeys.length > 0) {
    console.warn("[Enrollment Debug] Duplicate course cards suppressed in My Courses.", {
      duplicateCourseIds: Array.from(new Set(duplicateKeys)),
      duplicateEnrollmentIds: Array.from(new Set(duplicateEnrollmentIds)),
      totalInputCards: courseLists.flat().length,
      renderedCards: courseMap.size,
    });
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
    if (!highlightedCourseSlug) {
      return;
    }

    const highlightedCourse = dashboardCourses.find(
      (course) => course.courseSlug === highlightedCourseSlug || course.primaryCourseSlug === highlightedCourseSlug,
    );

    if (!highlightedCourse) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      courseCardRefs.current[highlightedCourse.id]?.scrollIntoView({
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
      <div className="flex min-h-full items-center justify-center bg-[#F8FAFC] px-4 py-10">
        <div className="inline-flex items-center gap-3 rounded-[18px] border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#475569] shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#4F46E5]" />
          Loading your enrolled programs...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <AnimatePresence>
          {showSuccessToast ? (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: "easeOut" }}
              className="mb-5 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-[0_10px_24px_rgba(16,185,129,0.10)]"
            >
              Enrollment successful! Check Dashboard → My Courses.
            </motion.div>
          ) : null}
        </AnimatePresence>

        <section className="rounded-[28px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7C3AED]">
                <Sparkles className="h-3.5 w-3.5" />
                Student Dashboard
              </div>
              <h1 className="mt-4 text-[30px] font-semibold leading-[1.1] text-[#0F172A]">My Courses</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#475569]">
                Access your enrolled programs, syllabus, and learning resources.
              </p>
            </div>
            {dashboardCourses.length ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] text-[#64748B] shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
                <Layers3 className="h-3.5 w-3.5 text-[#4F46E5]" />
                {dashboardCourses.length} enrolled program{dashboardCourses.length === 1 ? "" : "s"}
              </div>
            ) : null}
          </div>
        </section>

        {user && error ? (
          <div className="mt-5 rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {dashboardCourses.length ? (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboardCourses.map((course) => (
              <article
                key={course.id}
                ref={(node) => {
                  courseCardRefs.current[course.id] = node;
                }}
                className={cn(
                  "group rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)]",
                  (highlightedCourseSlug === course.courseSlug || highlightedCourseSlug === course.primaryCourseSlug) &&
                    "border-[#A7F3D0] shadow-[0_18px_36px_rgba(16,185,129,0.14)]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[19px] font-bold leading-[1.3] text-[#111827]">{course.title}</h2>
                    <div className="mt-4 space-y-2 text-sm text-[#374151]">
                      <p>
                        <span className="text-[#6B7280]">Status:</span> {course.status}
                      </p>
                      {course.batch ? (
                        <p>
                          <span className="text-[#6B7280]">Batch:</span> {course.batch}
                        </p>
                      ) : null}
                      {course.enrollmentType === "program" ? (
                        <p>
                          <span className="text-[#6B7280]">Includes:</span> {Math.max(course.programCourseSlugs?.length || 0, 1)} course{Math.max(course.programCourseSlugs?.length || 0, 1) === 1 ? "" : "s"}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-[11px] font-semibold text-[#059669]">
                    Active
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-[#6B7280]">
                  <span className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1">{course.duration}</span>
                  <span className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1">{course.level}</span>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/${encodeURIComponent(course.primaryCourseSlug || course.courseSlug)}`)}
                    className="inline-flex h-[42px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] bg-[linear-gradient(135deg,#4F46E5,#2563EB)] px-3.5 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_20px_rgba(79,70,229,0.20)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(79,70,229,0.28)]"
                  >
                    Continue Learning
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSyllabusSlug(course.primaryCourseSlug || course.courseSlug)}
                    className="inline-flex h-[42px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-[14px] font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#C7D2FE] hover:bg-[#F9FAFB] hover:shadow-[0_8px_16px_rgba(99,102,241,0.12)]"
                  >
                    📖 Syllabus
                    <BookOpen className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3 text-[11px] text-[#6B7280]">
                  Enrolled • {formatEnrollmentDate(course.enrolledAt)}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-6 rounded-[24px] border border-[#E5E7EB] bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <BookOpen className="mx-auto h-9 w-9 text-[#6B7280]" />
            <h2 className="mt-4 text-lg font-semibold text-[#111827]">No courses purchased yet.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6B7280]">
              Choose a course or program when you are ready, and your purchases will appear here automatically.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#4F46E5,#2563EB)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(79,70,229,0.26)]"
              >
                Browse Courses
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#C7D2FE] hover:bg-[#F9FAFB]"
              >
                View Programs
              </Link>
            </div>
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
            className="fixed inset-0 z-[220] flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-4 py-6 backdrop-blur-[8px]"
          >
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: "easeOut" }}
              className="w-full max-w-3xl overflow-hidden rounded-[26px] border border-[#E2E8F0] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
            >
              {/* Modal header */}
              <div className="border-b border-[#F1F5F9] bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#4F46E5]">
                      Course Syllabus
                    </span>
                    <h2 className="mt-2 text-[22px] font-bold leading-snug text-[#0F172A]">{selectedSyllabusCourse.title}</h2>
                    <p className="mt-1 text-sm text-[#475569]">{selectedSyllabusCourse.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSyllabusSlug(null)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    aria-label="Close syllabus"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="p-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  {[
                    { label: "Learning Roadmap",  items: selectedSyllabusCourse.roadmap },
                    { label: "Tools Covered",      items: selectedSyllabusCourse.toolsCovered },
                    { label: "Career Outcomes",    items: selectedSyllabusCourse.outcomes },
                  ].map((col) => (
                    <div key={col.label} className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">{col.label}</p>
                      <ul className="mt-3 space-y-1.5">
                        {col.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[12.5px] text-[#374151]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4F46E5]" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSyllabusSlug(null);
                      router.push(`/dashboard/${encodeURIComponent(selectedSyllabusCourse.slug)}`);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#4F46E5,#2563EB)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] transition hover:scale-[1.02]"
                  >
                    Continue Learning <ArrowRight className="h-4 w-4" />
                  </button>
                  {selectedSyllabusCourse.officialSyllabusUrl && (
                    <Link
                      href={selectedSyllabusCourse.officialSyllabusUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#475569] transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
                    >
                      Official Syllabus <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
