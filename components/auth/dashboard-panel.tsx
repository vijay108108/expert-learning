"use client";

import { Award, BookOpen, CheckCircle2, Clock3, LoaderCircle, PlayCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LmsPortal } from "@/components/dashboard/lms-portal";
import { allCourses } from "@/data/courses";
import { getLmsProgramBySlug, lmsPrograms, type LmsLesson, type LmsProgram } from "@/data/lms-content";
import {
  getCompletedLessons,
  getMyEnrollments,
  getLastVisitedLessons,
  getUserProfile,
  isFirebaseConfigured,
  logFirestoreIssue,
  saveUserWhatsappNumber,
  type AppUserProfile,
  type FirestoreEnrollment,
  type LastVisitedLesson,
} from "@/lib/firebase";
import {
  latestOrderStorageKey,
  type StoredOrderSuccess,
} from "@/lib/order-success";

type DashboardPanelProps = {
  initialCourseSlug?: string | null;
  paymentCompleted?: boolean;
};

type DashboardLessonItem = Pick<LmsLesson, "id" | "title"> & {
  moduleId: string;
};

function normalizePhoneNumber(value: string | null | undefined) {
  const digits = (value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function getCourseIcon(courseId: string) {
  if (courseId.includes("aws")) {
    return "AWS";
  }

  if (courseId.includes("azure")) {
    return "AZ";
  }

  if (courseId.includes("ai") || courseId.includes("ml")) {
    return "AI";
  }

  if (courseId.includes("devops") || courseId.includes("docker") || courseId.includes("ci-cd")) {
    return "DO";
  }

  return "GN";
}

function getDashboardLessons(program: LmsProgram) {
  return program.modules.flatMap((module, moduleIndex) =>
    module.lessons.flatMap((lesson): DashboardLessonItem[] => {
      const baseType = lesson.embedUrl ? "video" : moduleIndex === 0 ? "live" : lesson.kind === "lab" ? "lab" : "pdf";

      return [
        {
          id: `${lesson.id}-${baseType}`,
          title: baseType === "live" ? `${module.title} live class` : lesson.title,
          moduleId: module.id,
        },
        {
          id: `${lesson.id}-resource`,
          title: `${module.title} study material`,
          moduleId: module.id,
        },
        {
          id: `${lesson.id}-lab`,
          title: `${module.title} hands-on lab`,
          moduleId: module.id,
        },
      ];
    }),
  );
}

function buildInvoiceEnrollments(invoice: StoredOrderSuccess) {
  return invoice.courses.map((course) => ({
    id: `local-${invoice.orderId}-${course.slug}`,
    userId: "",
    userName: invoice.customer.name,
    userPhone: invoice.customer.phone,
    userEmail: invoice.customer.email,
    courseId: course.slug,
    courseName: course.title,
    amountPaid: Math.round(course.amountPaise / 100),
    razorpayOrderId: invoice.orderId,
    razorpayPaymentId: invoice.paymentId,
    invoiceNumber: invoice.invoiceNumber,
    enrolledAt: invoice.paidAtIso,
    status: "active" as const,
    duration: course.duration,
    level: course.level,
    companyName: invoice.customer.companyName,
    gstNumber: invoice.customer.gstNumber,
  }));
}

export function DashboardPanel({ initialCourseSlug = null, paymentCompleted = false }: DashboardPanelProps) {
  const pathname = usePathname();
  const { isAuthReady, user } = useAuth();
  const [enrollments, setEnrollments] = useState<Array<FirestoreEnrollment & { id: string }>>([]);
  const [invoiceEnrollments, setInvoiceEnrollments] = useState<Array<FirestoreEnrollment & { id: string }>>([]);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [lastVisitedLessons, setLastVisitedLessons] = useState<LastVisitedLesson[]>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const selectedCourseSlug = useMemo(() => {
    const dashboardPathMatch = pathname.match(/^\/dashboard(?:\/([^/]+))?$/);
    return dashboardPathMatch?.[1] ? decodeURIComponent(dashboardPathMatch[1]) : initialCourseSlug;
  }, [initialCourseSlug, pathname]);
  const isCoursePortalView = Boolean(selectedCourseSlug);

  const dashboardEnrollments = useMemo(() => {
    if (!invoiceEnrollments.length) {
      return enrollments;
    }

    const enrollmentMap = new Map(enrollments.map((enrollment) => [enrollment.courseId, enrollment]));

    for (const invoiceEnrollment of invoiceEnrollments) {
      if (!enrollmentMap.has(invoiceEnrollment.courseId)) {
        enrollmentMap.set(invoiceEnrollment.courseId, invoiceEnrollment);
      }
    }

    return Array.from(enrollmentMap.values()).sort(
      (left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime(),
    );
  }, [enrollments, invoiceEnrollments]);

  const dashboardCourses = useMemo(
    () =>
      dashboardEnrollments.map((enrollment) => {
        const program = getLmsProgramBySlug(enrollment.courseId) || lmsPrograms[0];
        const course = allCourses.find((item) => item.slug === enrollment.courseId);
        const lessons = getDashboardLessons(program);
        const completedCount = lessons.filter((lesson) => completedLessons.has(lesson.id)).length;
        const progressPercent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
        const lastVisited = lastVisitedLessons.find((item) => item.courseId === enrollment.courseId);
        const lastVisitedLesson = lastVisited
          ? lessons.find((lesson) => lesson.id === lastVisited.lessonId)
          : null;
        const nextLesson =
          lastVisitedLesson || lessons.find((lesson) => !completedLessons.has(lesson.id)) || lessons[lessons.length - 1];
        const completed = lessons.length > 0 && completedCount >= lessons.length;
        const opened = Boolean(lastVisitedLesson) || completedCount > 0;
        const cta = completed ? "View Certificate \u2192" : opened ? "Continue Learning \u2192" : "Start Course \u2192";

        return {
          enrollment,
          course,
          program,
          lessons,
          completed,
          completedCount,
          progressPercent,
          nextLessonTitle: completed ? "Certificate ready" : nextLesson?.title || "Orientation",
          cta,
        };
      }),
    [completedLessons, dashboardEnrollments, lastVisitedLessons],
  );

  useEffect(() => {
    if (!user) {
      const frame = window.requestAnimationFrame(() => {
        setEnrollments([]);
        setInvoiceEnrollments([]);
        setProfile(null);
        setCompletedLessons(new Set());
        setLastVisitedLessons([]);
        setEnrollmentLoading(false);
        setEnrollmentError(null);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    let active = true;
    const shouldLoadCourseSummaries = !initialCourseSlug;
    const frame = window.requestAnimationFrame(() => {
      setEnrollmentLoading(true);
      setEnrollmentError(null);
    });

    void (async () => {
      try {
        const nextEnrollments = await getMyEnrollments(user.uid);

        if (!active) {
          return;
        }

        setEnrollments(nextEnrollments);
      } catch (error) {
        if (!active) {
          return;
        }

        setEnrollmentError(error instanceof Error ? error.message : "Unable to load dashboard data.");
      } finally {
        if (active) {
          setEnrollmentLoading(false);
        }
      }
    })();

    void (async () => {
      try {
        const nextProfile = await getUserProfile(user.uid);

        if (!active) {
          return;
        }

        setProfile(nextProfile);

        if (!shouldLoadCourseSummaries) {
          return;
        }

        const [nextCompletedLessons, nextLastVisitedLessons] = await Promise.all([
          getCompletedLessons(user.uid),
          getLastVisitedLessons(user.uid),
        ]);

        if (!active) {
          return;
        }

        setCompletedLessons(nextCompletedLessons);
        setLastVisitedLessons(nextLastVisitedLessons);
      } catch (error) {
        if (!active) {
          return;
        }

        logFirestoreIssue("[Dashboard] Unable to load profile or progress data", error);
      }
    })();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [initialCourseSlug, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(latestOrderStorageKey);

        if (!raw) {
          setInvoiceEnrollments([]);
          return;
        }

        const invoice = JSON.parse(raw) as StoredOrderSuccess;
        const invoicePhone = normalizePhoneNumber(invoice.customer.phone);
        const userPhone = normalizePhoneNumber(user.phoneNumber);

        if (invoicePhone && userPhone && invoicePhone !== userPhone) {
          setInvoiceEnrollments([]);
          return;
        }

        setInvoiceEnrollments(buildInvoiceEnrollments(invoice));
      } catch (error) {
        logFirestoreIssue("[Dashboard] Unable to restore latest invoice enrollment", error);
        setInvoiceEnrollments([]);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [user]);

  function handleCourseSelection(courseSlug: string) {
    if (pathname !== `/dashboard/${courseSlug}`) {
      window.history.pushState(null, "", `/dashboard/${courseSlug}`);
    }
  }

  function handleResetCourseSelection() {
    if (pathname !== "/dashboard") {
      window.history.pushState(null, "", "/dashboard");
    }
  }

  async function handleWhatsappSave(phone: string) {
    if (!user) {
      return;
    }

    setSettingsSaving(true);

    try {
      await saveUserWhatsappNumber(user.uid, phone);
      setProfile((current) => ({
        uid: user.uid,
        name: current?.name || user.displayName || "",
        email: current?.email || user.email || "",
        photo: current?.photo || user.photoURL || "",
        phone,
        createdAt: current?.createdAt,
        updatedAt: new Date().toISOString(),
        authMethod: current?.authMethod,
      }));
    } finally {
      setSettingsSaving(false);
    }
  }

  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-full rounded-[24px] border border-[#e2e8f0] bg-white p-8 text-[#1e293b]">
        Firebase auth setup required for the LMS dashboard.
      </div>
    );
  }

  if (!isAuthReady || !user || (enrollmentLoading && !isCoursePortalView)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f8fafc] px-4 py-10">
        <div className="inline-flex items-center gap-3 rounded-[16px] border border-[#e2e8f0] bg-white px-5 py-4 text-sm text-[#64748b] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#f97316]" />
          Loading your LMS dashboard...
        </div>
      </div>
    );
  }

  if (!selectedCourseSlug) {
    return (
      <main className="min-h-full bg-[#f8fafc] px-4 py-6 text-[#1e293b] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
              Learning dashboard
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#1e293b]">Your enrolled courses</h1>
                <p className="mt-2 max-w-2xl text-sm text-[#64748b]">
                  Pick a course to open its LMS portal. Your progress, last lesson, notes, and certificates stay linked to your account.
                </p>
              </div>
              {paymentCompleted ? (
                <div className="rounded-full border border-[#bbf7d0] bg-[#dcfce7] px-3 py-1 text-[11px] font-semibold text-[#16a34a]">
                  Enrollment active
                </div>
              ) : null}
            </div>
          </div>

          {enrollmentError ? (
            <div className="mb-4 rounded-[12px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#dc2626]">
              {enrollmentError}
            </div>
          ) : null}

          {dashboardCourses.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dashboardCourses.map((item) => (
                <article
                  key={item.enrollment.id}
                  className="group rounded-[14px] border border-[#1e2d42] bg-[#111827] p-[18px] transition hover:border-[#f97316] hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] text-[12px] font-bold text-[#f97316]">
                      {getCourseIcon(item.enrollment.courseId)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 text-[15px] font-semibold text-[#f1f5f9]">
                        {item.course?.title || item.enrollment.courseName}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[#475569]">
                        <span>{item.enrollment.duration}</span>
                        <span className="h-1 w-1 rounded-full bg-[#334155]" />
                        <span>{item.enrollment.level}</span>
                      </div>
                    </div>
                    {item.completed ? (
                      <Award className="h-5 w-5 shrink-0 text-[#16a34a]" />
                    ) : (
                      <BookOpen className="h-5 w-5 shrink-0 text-[#475569]" />
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[11px]">
                      <span className="text-[#475569]">Progress</span>
                      <span className="font-semibold text-[#f97316]">
                        {item.completedCount}/{item.lessons.length} lessons
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-[#1e2d42]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#f97316,#fb923c)]"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 rounded-[12px] border border-[#1e2d42] bg-[#0f172a] p-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                      {item.completed ? <CheckCircle2 className="h-3.5 w-3.5 text-[#16a34a]" /> : <Clock3 className="h-3.5 w-3.5 text-[#f97316]" />}
                      <span>Next up</span>
                    </div>
                    <div className="mt-1 line-clamp-1 text-[12px] font-medium text-[#f1f5f9]">
                      {item.nextLessonTitle}
                    </div>
                  </div>

                  <div className="text-[11px] text-[#334155]">
                    Enrolled: {new Date(item.enrollment.enrolledAt).toLocaleDateString("en-IN")}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCourseSelection(item.enrollment.courseId)}
                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f97316] px-4 py-[10px] text-[13px] font-medium text-white transition hover:bg-[#ea580c]"
                  >
                    <PlayCircle className="h-4 w-4" />
                    {item.progressPercent === 0 ? "Start Course →" : "Continue Learning →"}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-[#e2e8f0] bg-white p-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <BookOpen className="mx-auto h-8 w-8 text-[#94a3b8]" />
              <h2 className="mt-4 text-lg font-semibold text-[#1e293b]">No active enrollments yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#64748b]">
                After purchase, your active course cards will appear here first. Then you can open the LMS portal course by course.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <LmsPortal
      activeCourseSlug={selectedCourseSlug}
      onSelectCourse={handleCourseSelection}
      onResetCourseSelection={handleResetCourseSelection}
      enrollments={dashboardEnrollments}
      paymentCompleted={paymentCompleted}
      enrollmentError={enrollmentError}
      userInfo={{
        uid: user.uid,
        name: user.displayName || profile?.name || "GenZNext Learner",
        email: user.email || profile?.email || "",
        phone: user.phoneNumber || profile?.phone || "",
        whatsappPhone: profile?.phone || user.phoneNumber || "",
      }}
      settingsState={{
        saving: settingsSaving,
        onSaveWhatsapp: handleWhatsappSave,
      }}
    />
  );
}
