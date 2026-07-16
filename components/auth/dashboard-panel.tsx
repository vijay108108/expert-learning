"use client";

import { BookOpen, LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MyLearningCard } from "@/components/dashboard/my-learning-card";
import { LmsPortal } from "@/components/dashboard/lms-portal";
import { allCourses } from "@/data/courses";
import { getLmsProgramBySlug, lmsPrograms, type LmsLesson, type LmsProgram } from "@/data/lms-content";
import {
  getCompletedLessons,
  getMyEnrollments,
  getUserProfile,
  logFirestoreIssue,
  saveUserWhatsappNumber,
  type AppUserProfile,
  type FirestoreEnrollment,
} from "@/lib/firebase";
import { readMyLearningCourses, type MyLearningCourse } from "@/lib/my-learning";
import { getCanonicalCourseId, getCheckoutOfferingBySlug, getCourseSlugByCourseId } from "@/lib/offering-catalog";
import { latestOrderStorageKey, type StoredOrderSuccess } from "@/lib/order-success";

type DashboardPanelProps = {
  initialCourseSlug?: string | null;
  paymentCompleted?: boolean;
};

type DashboardLessonItem = Pick<LmsLesson, "id" | "title"> & {
  moduleId: string;
};

type DashboardSummaryCard = {
  id: string;
  courseSlug: string;
  badge: string;
  title: string;
  status: string;
  progress: number;
  progressLabel: string;
  meta: string[];
  enrolledAt: string;
  enrolledLabel: string;
  syllabusUrl: string;
  liveClassUrl: string;
};

function normalizePhoneNumber(value: string | null | undefined) {
  const digits = (value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

const placeholderNames = new Set(["learner", "genznext learner", "student", "user"]);

function sanitizeName(value?: string | null) {
  const normalized = (value || "").trim();
  if (normalized.length < 2) {
    return "";
  }

  return placeholderNames.has(normalized.toLowerCase()) ? "" : normalized;
}

function resolveDisplayName(profileName?: string | null, authName?: string | null, email?: string | null, phone?: string | null) {
  const candidate = sanitizeName(profileName) || sanitizeName(authName);
  if (candidate) {
    return candidate;
  }

  const emailLocal = (email || "").trim().split("@")[0] || "";
  if (emailLocal) {
    return emailLocal;
  }

  if ((phone || "").trim()) {
    return (phone || "").trim();
  }

  return "Student";
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
    id: `local-${invoice.orderId}-${getCourseSlugByCourseId(course.slug)}`,
    userId: "",
    userName: invoice.customer.name,
    userPhone: invoice.customer.phone,
    userEmail: invoice.customer.email,
    courseId: getCourseSlugByCourseId(course.slug),
    enrollmentType: course.enrollmentType || "course",
    purchasedOfferingSlug: course.purchasedOfferingSlug || getCourseSlugByCourseId(course.slug),
    programSlug: course.programSlug || "",
    programName: course.programName || "",
    programCourseSlugs: course.programCourseSlugs || [],
    primaryCourseSlug: course.primaryCourseSlug || getCourseSlugByCourseId(course.slug),
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

function buildLocalLearningEnrollments(courses: MyLearningCourse[]) {
  return courses.map((course) => ({
    id: `learning-${getCourseSlugByCourseId(course.courseSlug)}`,
    userId: "",
    userName: "GenZNext Learner",
    userPhone: "",
    userEmail: "",
    courseId: getCourseSlugByCourseId(course.courseSlug),
    enrollmentType: course.enrollmentType || "course",
    purchasedOfferingSlug: course.purchasedOfferingSlug || getCourseSlugByCourseId(course.courseSlug),
    programSlug: course.programSlug || "",
    programName: course.programName || "",
    programCourseSlugs: course.programCourseSlugs || [],
    primaryCourseSlug: course.primaryCourseSlug || getCourseSlugByCourseId(course.courseSlug),
    courseName: course.title,
    amountPaid: 0,
    razorpayOrderId: "",
    razorpayPaymentId: "",
    invoiceNumber: "",
    enrolledAt: course.enrolledAt,
    status: "active" as const,
    duration: course.duration,
    level: course.level,
    companyName: "",
    gstNumber: "",
  }));
}

export function DashboardPanel({ initialCourseSlug = null, paymentCompleted = false }: DashboardPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthReady, openAuthModal, user } = useAuth();
  const [enrollments, setEnrollments] = useState<Array<FirestoreEnrollment & { id: string }>>([]);
  const [invoiceEnrollments, setInvoiceEnrollments] = useState<Array<FirestoreEnrollment & { id: string }>>([]);
  const [localLearningCourses, setLocalLearningCourses] = useState<MyLearningCourse[]>([]);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(paymentCompleted);
  const selectedCourseSlug = useMemo(() => {
    const dashboardPathMatch = pathname.match(/^\/dashboard(?:\/([^/]+))?$/);
    return dashboardPathMatch?.[1] ? decodeURIComponent(dashboardPathMatch[1]) : initialCourseSlug;
  }, [initialCourseSlug, pathname]);
  const isCoursePortalView = Boolean(selectedCourseSlug);

  const dashboardEnrollments = useMemo(() => {
    const enrollmentMap = new Map<string, FirestoreEnrollment & { id: string }>();

    function getEnrollmentKey(enrollment: FirestoreEnrollment & { id: string }) {
      if (enrollment.enrollmentType === "program") {
        const programSlug = enrollment.programSlug || enrollment.purchasedOfferingSlug || "";
        if (programSlug) {
          return `program:${programSlug}`;
        }
      }

      const purchasedOffering = enrollment.purchasedOfferingSlug
        ? getCheckoutOfferingBySlug(enrollment.purchasedOfferingSlug)
        : null;

      if (purchasedOffering?.kind === "bundle") {
        return `program:${purchasedOffering.slug}`;
      }

      return `course:${getCanonicalCourseId(enrollment.courseId)}`;
    }

    for (const enrollment of enrollments) {
      enrollmentMap.set(getEnrollmentKey(enrollment), enrollment);
    }

    for (const invoiceEnrollment of invoiceEnrollments) {
      const enrollmentKey = getEnrollmentKey(invoiceEnrollment);
      if (!enrollmentMap.has(enrollmentKey)) {
        enrollmentMap.set(enrollmentKey, invoiceEnrollment);
      }
    }

    for (const learningEnrollment of buildLocalLearningEnrollments(localLearningCourses)) {
      const enrollmentKey = getEnrollmentKey(learningEnrollment);
      if (!enrollmentMap.has(enrollmentKey)) {
        enrollmentMap.set(enrollmentKey, learningEnrollment);
      }
    }

    return Array.from(enrollmentMap.values()).sort(
      (left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime(),
    );
  }, [enrollments, invoiceEnrollments, localLearningCourses]);

  const dashboardCourses = useMemo(
    () =>
      dashboardEnrollments.map((enrollment) => {
        const program = getLmsProgramBySlug(enrollment.courseId) || lmsPrograms[0];
        const course = allCourses.find((item) => item.slug === enrollment.courseId);
        const lessons = getDashboardLessons(program);
        const completedCount = lessons.filter((lesson) => completedLessons.has(lesson.id)).length;
        const progressPercent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

        return {
          enrollment,
          course,
          program,
          progressPercent,
          displayProgress: progressPercent > 0 ? progressPercent : 25,
        };
      }),
    [completedLessons, dashboardEnrollments],
  );

  const summaryCards = useMemo(() => {
    const cardMap = new Map<string, DashboardSummaryCard>();

    for (const item of dashboardCourses) {
      const purchasedOffering = item.enrollment.purchasedOfferingSlug
        ? getCheckoutOfferingBySlug(item.enrollment.purchasedOfferingSlug)
        : null;

      cardMap.set(item.enrollment.courseId, {
        id: item.enrollment.id,
        courseSlug: item.enrollment.courseId,
        badge: getCourseIcon(item.enrollment.courseId),
        title:
          (purchasedOffering?.kind === "bundle" ? purchasedOffering.title : "")
          || item.enrollment.courseName
          || item.course?.title
          || item.enrollment.courseId,
        status: `Enrolled • ${item.program.status === "live" ? "Active Batch" : "Upcoming Batch"}`,
        progress: item.displayProgress,
        progressLabel: `${item.displayProgress}% Completed`,
        meta: [item.enrollment.duration, item.enrollment.level],
        enrolledAt: item.enrollment.enrolledAt,
        enrolledLabel: `Enrolled on ${new Date(item.enrollment.enrolledAt).toLocaleDateString("en-IN")}`,
        syllabusUrl: item.course?.officialSyllabusUrl || "",
        liveClassUrl: item.program.liveClassUrl,
      });
    }

    for (const item of localLearningCourses) {
      if (cardMap.has(item.courseSlug)) {
        continue;
      }

      const course = allCourses.find((entry) => entry.slug === item.courseSlug);
      const program = getLmsProgramBySlug(item.courseSlug);
      const progress = item.progress > 0 ? item.progress : 25;

      cardMap.set(item.courseSlug, {
        id: item.id,
        courseSlug: item.courseSlug,
        badge: getCourseIcon(item.courseSlug),
        title: item.title || course?.title || item.courseSlug,
        status: `${item.status} • ${program?.status === "live" ? "Active Batch" : item.batchLabel || "Upcoming Batch"}`,
        progress,
        progressLabel: `${progress}% Completed`,
        meta: [item.duration || course?.duration || "Program", item.level || course?.level || "Access ready"],
        enrolledAt: item.enrolledAt,
        enrolledLabel: `Added to My Learning on ${new Date(item.enrolledAt).toLocaleDateString("en-IN")}`,
        syllabusUrl: item.syllabusUrl || course?.officialSyllabusUrl || "",
        liveClassUrl: program?.liveClassUrl || "",
      });
    }

    return Array.from(cardMap.values()).sort(
      (left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime(),
    );
  }, [dashboardCourses, localLearningCourses]);

  const selectedGuestCourse = useMemo(
    () => summaryCards.find((item) => item.courseSlug === selectedCourseSlug) || null,
    [selectedCourseSlug, summaryCards],
  );

  useEffect(() => {
    const syncLocalLearning = () => {
      setLocalLearningCourses(readMyLearningCourses());
    };

    syncLocalLearning();
    window.addEventListener("storage", syncLocalLearning);
    return () => window.removeEventListener("storage", syncLocalLearning);
  }, []);

  useEffect(() => {
    if (!showSuccessToast) {
      return;
    }

    const timer = window.setTimeout(() => setShowSuccessToast(false), 3800);
    return () => window.clearTimeout(timer);
  }, [showSuccessToast]);

  useEffect(() => {
    if (!user) {
      const frame = window.requestAnimationFrame(() => {
        setEnrollments([]);
        setInvoiceEnrollments([]);
        setProfile(null);
        setCompletedLessons(new Set());
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

        const nextCompletedLessons = await getCompletedLessons(user.uid);

        if (!active) {
          return;
        }

        setCompletedLessons(nextCompletedLessons);
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
      router.push(`/dashboard/${encodeURIComponent(courseSlug)}`);
    }
  }

  function handleResetCourseSelection() {
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  }

  function handleProtectedCourseAccess(courseSlug: string) {
    if (user) {
      handleCourseSelection(courseSlug);
      return;
    }

    openAuthModal("login", `/dashboard/${encodeURIComponent(courseSlug)}`);
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

  if (!isAuthReady || (user && enrollmentLoading && !isCoursePortalView)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f8fafc] px-4 py-10">
        <div className="inline-flex items-center gap-3 rounded-[16px] border border-[#e2e8f0] bg-white px-5 py-4 text-sm text-[#64748b] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#f97316]" />
          Loading your LMS dashboard...
        </div>
      </div>
    );
  }

  if (selectedCourseSlug && !user) {
    return (
      <main className="min-h-full bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,#071028_0%,#0B1736_100%)] px-4 py-6 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.74))] p-6 shadow-[0_24px_64px_rgba(2,6,23,0.34)] sm:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">
              My Learning
            </div>
            <h1 className="mt-3 text-[30px] font-semibold leading-[1.12] text-white">
              {selectedGuestCourse?.title || "Your enrolled program is ready"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#B7C3D9]">
              Your enrollment has been saved on this device. Continue with your account to open the full course portal, join classes, and keep your learning progress synced.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openAuthModal("login", `/dashboard/${encodeURIComponent(selectedCourseSlug)}`)}
                className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(249,115,22,0.26)] transition hover:-translate-y-0.5"
              >
                Continue to My Course
              </button>
              {selectedGuestCourse?.syllabusUrl ? (
                <a
                  href={selectedGuestCourse.syllabusUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-[rgba(249,115,22,0.24)] bg-[rgba(249,115,22,0.08)] px-5 py-3 text-sm font-medium text-[#E56F12] transition hover:bg-[rgba(249,115,22,0.12)]"
                >
                  View Syllabus
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!selectedCourseSlug) {
    return (
      <main className="min-h-full bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,#071028_0%,#0B1736_100%)] px-4 py-6 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {showSuccessToast ? (
            <div className="mb-5 rounded-2xl border border-emerald-400/18 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 shadow-[0_14px_36px_rgba(16,185,129,0.14)]">
              Enrollment successful! Your course has been added to My Learning.
            </div>
          ) : null}

          <div className="mb-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.34)] sm:p-7">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E56F12]">
              Student Dashboard
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-[30px] font-semibold leading-[1.12] text-white">My Learning</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#B7C3D9]">
                  Access your enrolled programs, syllabus, and learning resources.
                </p>
              </div>
              {summaryCards.length ? (
                <div className="rounded-full border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] px-3 py-1 text-[11px] font-semibold text-[#E56F12]">
                  {summaryCards.length} active program{summaryCards.length === 1 ? "" : "s"}
                </div>
              ) : null}
            </div>
          </div>

          {enrollmentError ? (
            <div className="mb-4 rounded-[16px] border border-[rgba(248,113,113,0.24)] bg-[rgba(127,29,29,0.24)] p-4 text-sm text-[#FCA5A5]">
              {enrollmentError}
            </div>
          ) : null}

          {summaryCards.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {summaryCards.map((item) => (
                <MyLearningCard
                  key={item.id}
                  badge={item.badge}
                  title={item.title}
                  status={item.status}
                  progress={item.progress}
                  progressLabel={item.progressLabel}
                  meta={item.meta}
                  enrolledLabel={item.enrolledLabel}
                  actions={[
                    {
                      label: "View Course",
                      tone: "primary",
                      icon: "course",
                      onClick: () => handleProtectedCourseAccess(item.courseSlug),
                    },
                    item.syllabusUrl
                      ? {
                          label: "View Syllabus",
                          tone: "secondary",
                          icon: "syllabus" as const,
                          href: item.syllabusUrl,
                          external: true,
                        }
                      : {
                          label: "View Syllabus",
                          tone: "secondary",
                          icon: "syllabus" as const,
                          onClick: () => handleProtectedCourseAccess(item.courseSlug),
                        },
                    item.liveClassUrl && user
                      ? {
                          label: "Join Classes",
                          tone: "ghost",
                          icon: "classes" as const,
                          href: item.liveClassUrl,
                          external: true,
                        }
                      : {
                          label: "Join Classes",
                          tone: "ghost",
                          icon: "classes" as const,
                          onClick: () => handleProtectedCourseAccess(item.courseSlug),
                        },
                    {
                      label: "Download Certificate",
                      tone: "ghost",
                      icon: "certificate",
                      disabled: true,
                    },
                  ]}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-8 text-center shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
              <BookOpen className="mx-auto h-8 w-8 text-[#8FA1BF]" />
              <h2 className="mt-4 text-lg font-semibold text-white">You haven&apos;t enrolled in any training yet.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#B7C3D9]">
                Complete an enrollment and your purchased programs will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <LmsPortal
      activeCourseSlug={selectedCourseSlug}
      onSelectCourse={handleCourseSelection}
      onResetCourseSelection={handleResetCourseSelection}
      enrollments={dashboardEnrollments}
      verifiedEnrollments={enrollments}
      paymentCompleted={paymentCompleted}
      enrollmentError={enrollmentError}
      userInfo={{
        uid: user.uid,
        name: resolveDisplayName(profile?.name, user.displayName, user.email || profile?.email, user.phoneNumber || profile?.phone),
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
