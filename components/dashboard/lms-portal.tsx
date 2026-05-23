"use client";

import {
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  Menu,
  NotebookPen,
  Pause,
  Play,
  Upload,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getLmsProgramBySlug,
  lmsPrograms,
  type LmsLesson,
  type LmsModule,
  type LmsProgram,
} from "@/data/lms-content";
import { allCourses } from "@/data/courses";
import {
  addCourseQuestion,
  type FirestoreEnrollment,
  getCompletedLessons,
  getCourseQuestions,
  getLastVisitedLesson,
  getLessonNote,
  logFirestoreIssue,
  getUserNotifications,
  markLessonCompleted,
  markNotificationRead,
  saveLastVisitedLesson,
  saveLessonBookmark,
  saveLessonNote,
  type LessonQuestion,
  type LmsNotification,
} from "@/lib/firebase";
import { cn } from "@/lib/utils";

type DashboardUserInfo = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  whatsappPhone: string;
};

type SettingsState = {
  saving: boolean;
  onSaveWhatsapp: (phone: string) => Promise<void>;
};

type DashboardLmsPortalProps = {
  activeCourseSlug: string | null;
  onSelectCourse: (courseSlug: string) => void;
  onResetCourseSelection: () => void;
  enrollments: Array<FirestoreEnrollment & { id: string }>;
  paymentCompleted: boolean;
  enrollmentError: string | null;
  userInfo: DashboardUserInfo;
  settingsState: SettingsState;
};

type LessonType = "video" | "pdf" | "lab" | "live" | "quiz";
type PlayerTab = "overview" | "resources" | "notes" | "qa" | "assignment";
type ModuleState = "completed" | "active" | "locked";

type PlayerLesson = LmsLesson & {
  moduleId: string;
  moduleTitle: string;
  moduleIndex: number;
  lessonIndex: number;
  type: LessonType;
  scheduledAt: Date;
  resources: Array<{
    name: string;
    url: string;
    size: string;
    type: "PDF" | "LAB" | "PPT";
  }>;
  assignment: {
    description: string;
    deadline: Date;
    status: "Not submitted" | "Submitted" | "Reviewed";
    feedback?: string;
    score?: string;
  };
};

const tabLabels: Record<PlayerTab, string> = {
  overview: "Overview",
  resources: "Resources",
  notes: "Notes",
  qa: "Q&A",
  assignment: "Assignment",
};

const weekdayMap: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function parsePortalDate(value: string) {
  return new Date(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

function formatEnrollmentDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function getWeekdaysFromSchedule(schedule: string) {
  if (schedule.includes("Mon to Sat")) {
    return [1, 2, 3, 4, 5, 6];
  }

  if (schedule.includes("Weekend")) {
    return [6, 0];
  }

  return schedule
    .split("/")
    .map((part) => weekdayMap[part.trim().slice(0, 3)])
    .filter((value): value is number => Number.isInteger(value));
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function buildScheduleDate(program: LmsProgram, index: number) {
  const weekdays = getWeekdaysFromSchedule(program.trainingDays);
  const cursor = parsePortalDate(program.batchStartDate);
  let found = 0;

  while (found <= index) {
    if (!weekdays.length || weekdays.includes(cursor.getDay())) {
      if (found === index) {
        const [time = "7:00", meridian = "PM"] = program.classTimeLabel.split(" ");
        const [hourRaw, minuteRaw = "00"] = time.split(":");
        let hour = Number(hourRaw);
        const minute = Number(minuteRaw);

        if (meridian === "PM" && hour < 12) {
          hour += 12;
        }

        cursor.setHours(hour, minute, 0, 0);
        return new Date(cursor);
      }

      found += 1;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return cursor;
}

function isToday(value: Date) {
  const now = new Date();
  return value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth() && value.getDate() === now.getDate();
}

function getCountdownLabel(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function getLessonIcon(type: LessonType) {
  if (type === "pdf") {
    return "📄";
  }

  if (type === "lab") {
    return "🧪";
  }

  return "▶";
}

function buildPlayerLessons(program: LmsProgram) {
  return program.modules.map((module, moduleIndex) => {
    const scheduledAt = buildScheduleDate(program, moduleIndex);
    const lessons: PlayerLesson[] = module.lessons.flatMap((lesson, lessonIndex) => {
      const baseType: LessonType = lesson.embedUrl ? "video" : moduleIndex === 0 ? "live" : lesson.kind === "lab" ? "lab" : "pdf";
      const baseId = `${lesson.id}-${baseType}`;
      const common = {
        moduleId: module.id,
        moduleTitle: module.title,
        moduleIndex,
        lessonIndex,
        scheduledAt,
        resources: [
          {
            name: `${module.title} reference guide.pdf`,
            url: "#",
            size: "1.8 MB",
            type: "PDF" as const,
          },
          {
            name: `${module.title} hands-on lab.zip`,
            url: "#",
            size: "3.2 MB",
            type: "LAB" as const,
          },
        ],
        assignment: {
          description: `Complete the guided checkpoint for ${module.title} and submit your implementation notes.`,
          deadline: addDays(scheduledAt, 4),
          status: "Not submitted" as const,
        },
      };

      return [
        {
          ...lesson,
          ...common,
          id: baseId,
          type: baseType,
          duration: lesson.embedUrl ? lesson.duration : "Live session",
          title: baseType === "live" ? `${module.title} live class` : lesson.title,
        },
        {
          ...lesson,
          ...common,
          id: `${lesson.id}-resource`,
          title: `${module.title} study material`,
          description: "Download the session notes and reference material.",
          duration: "PDF",
          type: "pdf" as const,
          status: "available" as const,
          embedUrl: undefined,
        },
        {
          ...lesson,
          ...common,
          id: `${lesson.id}-lab`,
          title: `${module.title} practice lab`,
          description: "Hands-on guided exercise for this module.",
          duration: "45 mins",
          type: "lab" as const,
          status: "available" as const,
          embedUrl: undefined,
        },
      ];
    });

    return {
      ...module,
      lessons,
    };
  });
}

function getModuleState(module: LmsModule & { lessons: PlayerLesson[] }, index: number, completedLessonIds: Set<string>, previousComplete: boolean) {
  const complete = module.lessons.every((lesson) => completedLessonIds.has(lesson.id));

  if (complete) {
    return "completed" satisfies ModuleState;
  }

  if (index === 0 || previousComplete) {
    return "active" satisfies ModuleState;
  }

  return "locked" satisfies ModuleState;
}

function buildModuleStates(modules: Array<LmsModule & { lessons: PlayerLesson[] }>, completedLessonIds: Set<string>) {
  return modules.reduce<{ states: ModuleState[]; previousComplete: boolean }>(
    (acc, module, index) => {
      const state = getModuleState(module, index, completedLessonIds, acc.previousComplete);

      return {
        states: [...acc.states, state],
        previousComplete: state === "completed",
      };
    },
    { states: [], previousComplete: true },
  ).states;
}

function getCertificateId(userId: string, courseSlug: string) {
  return `GZN-${courseSlug.slice(0, 4).toUpperCase()}-${userId.slice(0, 6).toUpperCase()}`;
}

function downloadCertificate(studentName: string, courseName: string, certificateId: string) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");

  if (!printWindow) {
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${certificateId}</title>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; background: #0d1117; color: #f1f5f9; }
          .certificate { margin: 48px; padding: 56px; border: 1px solid #f97316; min-height: 520px; }
          .label { color: #f97316; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
          h1 { font-size: 44px; margin: 18px 0; }
          .name { font-size: 32px; font-weight: 700; margin: 28px 0 10px; }
          .course { color: #94a3b8; font-size: 20px; }
          .meta { margin-top: 60px; color: #64748b; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="label">Certificate of Completion</div>
          <h1>GenZNext Research & Training</h1>
          <div>This certifies that</div>
          <div class="name">${studentName}</div>
          <div>has successfully completed</div>
          <div class="course">${courseName}</div>
          <div class="meta">Completion Date: ${new Date().toLocaleDateString("en-IN")} · Certificate ID: ${certificateId}</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function LmsPortal({
  activeCourseSlug,
  onSelectCourse,
  onResetCourseSelection,
  enrollments,
  userInfo,
}: DashboardLmsPortalProps) {
  const firstEnrollment = enrollments[0];
  const selectedProgram = useMemo(() => {
    const courseSlug = activeCourseSlug || firstEnrollment?.courseId || "azure-administrator";
    return getLmsProgramBySlug(courseSlug) || lmsPrograms[0];
  }, [activeCourseSlug, firstEnrollment]);
  const selectedCourse = useMemo(
    () => allCourses.find((course) => course.slug === selectedProgram.courseSlug) || allCourses[0],
    [selectedProgram.courseSlug],
  );
  const modules = useMemo(() => buildPlayerLessons(selectedProgram), [selectedProgram]);
  const allLessons = useMemo(() => modules.flatMap((module) => module.lessons), [modules]);
  const [selectedLessonId, setSelectedLessonId] = useState(() => allLessons[0]?.id || "");
  const activeLesson = useMemo(
    () => allLessons.find((lesson) => lesson.id === selectedLessonId) || allLessons[0],
    [allLessons, selectedLessonId],
  );
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(() => new Set([modules[0]?.id || ""]));
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<PlayerTab>("overview");
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteDirty, setNoteDirty] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [notifications, setNotifications] = useState<LmsNotification[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [countdown, setCountdown] = useState("00:00:00");
  const [lastVisitedReady, setLastVisitedReady] = useState(false);

  const moduleStates = useMemo(
    () => buildModuleStates(modules, completedLessons),
    [completedLessons, modules],
  );

  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const currentModuleIndex = activeLesson?.moduleIndex || 0;
  const currentModule = modules[currentModuleIndex];
  const currentModuleState = moduleStates[currentModuleIndex] || "active";
  const activeLessonCompleted = activeLesson ? completedLessons.has(activeLesson.id) : false;
  const allModulesCompleted = totalLessons > 0 && completedCount >= totalLessons;
  const isLiveToday = activeLesson?.type === "live" && isToday(activeLesson.scheduledAt);
  const certificateId = getCertificateId(userInfo.uid, selectedProgram.courseSlug);
  const notificationCount = notifications.filter((item) => !item.read).length;
  const completedModuleCount = moduleStates.filter((state) => state === "completed").length;
  const moduleProgressPercent = modules.length ? Math.round((completedModuleCount / modules.length) * 100) : 0;
  const moduleProgressLabel = allModulesCompleted
    ? `${modules.length} of ${modules.length} modules`
    : `${Math.min(completedModuleCount + 1, modules.length)} of ${modules.length} modules`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLastVisitedReady(false);
      setSelectedLessonId(allLessons[0]?.id || "");
      setExpandedModuleIds(new Set([modules[0]?.id || ""]));
      onSelectCourse(selectedProgram.courseSlug);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [allLessons, modules, onSelectCourse, selectedProgram.courseSlug]);

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      void (async () => {
        try {
          const [nextCompleted, nextQuestions, nextNotifications] = await Promise.all([
            getCompletedLessons(userInfo.uid),
            getCourseQuestions(selectedProgram.courseSlug),
            getUserNotifications(userInfo.uid),
          ]);

          if (!active) {
            return;
          }

          setCompletedLessons(nextCompleted);
          setQuestions(nextQuestions);
          setNotifications(
            nextNotifications.length
              ? nextNotifications
              : [
                  {
                    id: "local-live",
                    userId: userInfo.uid,
                    type: "live",
                    title: "Live class starting in 30 mins",
                    target: "overview",
                  },
                  {
                    id: "local-resource",
                    userId: userInfo.uid,
                    type: "resource",
                    title: "New resource uploaded",
                    target: "resources",
                  },
                ],
          );
        } catch (error) {
          logFirestoreIssue("[LMS] Unable to load activity", error);
        }
      })();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [selectedProgram.courseSlug, userInfo.uid]);

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      void (async () => {
        const lastVisited = await getLastVisitedLesson(userInfo.uid, selectedProgram.courseSlug);

        if (!active) {
          return;
        }

        const restoredLesson = lastVisited
          ? allLessons.find((lesson) => lesson.id === lastVisited.lessonId)
          : null;

        if (restoredLesson) {
          setSelectedLessonId(restoredLesson.id);
          setExpandedModuleIds((current) => new Set([...current, restoredLesson.moduleId]));
          setToast("Welcome back! Continuing from where you left off \u{1F44B}");
          window.setTimeout(() => setToast(null), 2600);
        }

        setLastVisitedReady(true);
      })();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [allLessons, selectedProgram.courseSlug, userInfo.uid]);

  useEffect(() => {
    if (!activeLesson || !lastVisitedReady) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveLastVisitedLesson(userInfo.uid, selectedProgram.courseSlug, {
        lessonId: activeLesson.id,
        moduleId: activeLesson.moduleId,
      });
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [activeLesson, lastVisitedReady, selectedProgram.courseSlug, userInfo.uid]);

  useEffect(() => {
    if (!activeLesson || !lastVisitedReady) {
      return;
    }

    return () => {
      void saveLastVisitedLesson(userInfo.uid, selectedProgram.courseSlug, {
        lessonId: activeLesson.id,
        moduleId: activeLesson.moduleId,
      });
    };
  }, [activeLesson, lastVisitedReady, selectedProgram.courseSlug, userInfo.uid]);

  useEffect(() => {
    if (!activeLesson) {
      return;
    }

    let active = true;
    const frame = window.requestAnimationFrame(() => {
      void (async () => {
        const nextNote = await getLessonNote(userInfo.uid, activeLesson.id);

        if (!active) {
          return;
        }

        setNoteText(nextNote);
        setNoteDirty(false);
        setNoteSaved(false);
      })();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [activeLesson, userInfo.uid]);

  useEffect(() => {
    if (!activeLesson || !noteDirty) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveLessonNote(userInfo.uid, activeLesson.id, noteText).then(() => {
        setNoteSaved(true);
        setNoteDirty(false);
      });
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [activeLesson, noteDirty, noteText, userInfo.uid]);

  useEffect(() => {
    if (!isLiveToday || !activeLesson) {
      return;
    }

    const interval = window.setInterval(() => {
      setCountdown(getCountdownLabel(activeLesson.scheduledAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeLesson, isLiveToday]);

  function toggleModule(moduleId: string) {
    setExpandedModuleIds((current) => {
      const next = new Set(current);

      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }

      return next;
    });
  }

  function selectLesson(lesson: PlayerLesson, moduleState: ModuleState) {
    if (moduleState === "locked") {
      return;
    }

    setSelectedLessonId(lesson.id);
    setActiveTab("overview");
    setMobileSidebarOpen(false);
  }

  function navigateLesson(direction: "prev" | "next") {
    const currentIndex = allLessons.findIndex((lesson) => lesson.id === activeLesson?.id);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    const nextLesson = allLessons[nextIndex];

    if (!nextLesson) {
      return;
    }

    const nextModuleState = moduleStates[nextLesson.moduleIndex] || "locked";
    selectLesson(nextLesson, nextModuleState);
  }

  async function completeCurrentLesson() {
    if (!activeLesson || activeLessonCompleted) {
      return;
    }

    await markLessonCompleted(userInfo.uid, activeLesson.id);

    const nextCompleted = new Set(completedLessons);
    nextCompleted.add(activeLesson.id);
    setCompletedLessons(nextCompleted);

    const moduleDone = currentModule.lessons.every((lesson) => nextCompleted.has(lesson.id));
    if (moduleDone) {
      setToast(`Module ${currentModuleIndex + 1} Complete! Next module unlocked.`);
      window.setTimeout(() => setToast(null), 2800);
    }

    navigateLesson("next");
  }

  async function bookmarkCurrentLesson() {
    if (!activeLesson) {
      return;
    }

    await saveLessonBookmark(userInfo.uid, activeLesson.id);
    setBookmarked(true);
  }

  async function submitQuestion() {
    const trimmed = questionText.trim();

    if (!trimmed) {
      return;
    }

    const saved = await addCourseQuestion(selectedProgram.courseSlug, userInfo.uid, trimmed);
    setQuestionText("");

    if (saved) {
      setQuestions((current) => [saved, ...current]);
    }
  }

  async function handleNotificationClick(notification: LmsNotification) {
    if (!notification.id.startsWith("local-")) {
      await markNotificationRead(notification.id);
    }

    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
    );

    if (notification.target === "resources") {
      setActiveTab("resources");
    } else if (notification.target === "assignment") {
      setActiveTab("assignment");
    } else {
      setActiveTab("overview");
    }
  }

  function renderLessonSidebar() {
    return (
      <aside
        className={cn(
          "fixed inset-x-0 top-[52px] bottom-0 left-0 z-40 w-[260px] border-r border-[#e2e8f0] bg-white transition-transform md:static md:inset-auto md:w-[260px] md:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-[#f1f5f9] bg-[#f8fafc] px-4 py-[14px]">
            <button type="button" onClick={onResetCourseSelection} className="text-[11px] text-[#94a3b8] transition hover:text-[#475569]">
              ← View all courses
            </button>
          </div>

          {enrollments.length > 1 ? (
            <>
              <div className="border-b border-[#f1f5f9] px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                My Courses
              </div>
              <div className="space-y-2 border-b border-[#f1f5f9] px-4 py-3">
                {enrollments.map((enrollment) => {
                  const activeCourse = enrollment.courseId === selectedProgram.courseSlug;

                  return (
                    <button
                      key={enrollment.id}
                      type="button"
                      onClick={() => {
                        onSelectCourse(enrollment.courseId);
                        setMobileSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-[10px] border px-3 py-2 text-left transition",
                        activeCourse
                          ? "border-[#fed7aa] bg-[#fff7ed]"
                          : "border-[#e2e8f0] bg-white hover:border-[#fed7aa] hover:bg-[#fffaf5]",
                      )}
                    >
                      <div className={cn("text-[12px] font-semibold", activeCourse ? "text-[#ea580c]" : "text-[#1e293b]")}>
                        {enrollment.courseName}
                      </div>
                      <div className="mt-1 text-[10px] text-[#94a3b8]">
                        Purchased on {formatEnrollmentDate(enrollment.enrolledAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          <div className="mt-3 px-4 text-[13px] font-bold text-[#1e293b]">{selectedCourse?.title}</div>
          <div className="mt-1 px-4 text-[11px] text-[#94a3b8]">
            {selectedCourse?.duration || firstEnrollment?.duration || "12 Weeks"} · {selectedCourse?.level || firstEnrollment?.level || "Intermediate"}
          </div>

          <div className="border-b border-[#f1f5f9] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
            Progress Summary
          </div>

          <div className="border-b border-[#f1f5f9] px-4 py-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#64748b]">Progress</span>
              <span className="font-medium text-[#f97316]">{moduleProgressLabel}</span>
            </div>
            <div className="mt-2 h-[5px] rounded-full bg-[#e2e8f0]">
              <div
                className="h-[5px] rounded-full bg-[linear-gradient(90deg,#f97316,#fb923c)]"
                style={{ width: `${moduleProgressPercent || progressPercent}%` }}
              />
            </div>
          </div>

          <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
            Course Modules
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-2">
            {modules.map((module, moduleIndex) => {
              const moduleState = moduleStates[moduleIndex] || "locked";
              const expanded = expandedModuleIds.has(module.id);
              const activeModule = activeLesson?.moduleId === module.id;

              return (
                <div key={module.id} className="border-b border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-[10px] text-left transition hover:bg-[#f8fafc]",
                      (expanded || activeModule) && "bg-[#f8fafc]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-[22px] w-[22px] items-center justify-center rounded-[6px] text-[10px] font-semibold",
                        moduleState === "completed" && "bg-[#dcfce7] text-[#16a34a]",
                        moduleState === "active" && "border border-[#fed7aa] bg-[#fff7ed] text-[#ea580c]",
                        moduleState === "locked" && "bg-[#f1f5f9] text-[#94a3b8]",
                      )}
                    >
                      {moduleState === "completed" ? "✓" : moduleState === "locked" ? "🔒" : moduleIndex + 1}
                    </span>
                    <span className={cn("min-w-0 flex-1 text-[12px] font-medium", activeModule ? "text-[#1e293b]" : "text-[#475569]")}>
                      {module.title}
                    </span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-[#94a3b8] transition", expanded && "rotate-180")} />
                  </button>

                  {expanded ? (
                    <div className="space-y-1 px-4 pb-2 pl-[46px]">
                      {module.lessons.map((lesson) => {
                        const active = activeLesson?.id === lesson.id;
                        const complete = completedLessons.has(lesson.id);
                        const locked = moduleState === "locked";

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => selectLesson(lesson, moduleState)}
                            className={cn(
                              "flex w-full items-start gap-2 rounded-[7px] border px-[10px] py-[6px] text-left transition",
                              active && "border-[#fed7aa] bg-[#fff7ed]",
                              !active && "border-transparent",
                              !active && !locked && "hover:bg-[#f1f5f9]",
                            )}
                          >
                            <span className={cn("mt-0.5 text-[11px]", active ? "text-[#f97316]" : "text-[#cbd5e1]")}>
                              {getLessonIcon(lesson.type)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={cn("block text-[11px]", active ? "font-medium text-[#ea580c]" : "text-[#64748b]")}>
                                {lesson.title}
                              </span>
                              <span className="mt-0.5 block text-[10px] text-[#94a3b8]">{lesson.duration}</span>
                            </span>
                            {complete ? (
                              <span className="mt-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full border border-[#bbf7d0] bg-[#dcfce7] text-[9px] text-[#16a34a]">
                                ✓
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    );
  }

  function renderVideoArea() {
    if (!activeLesson) {
      return null;
    }

    return (
      <div className="relative h-[260px] bg-[#0f172a]">
        {isLiveToday ? (
          <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-[6px] bg-[#ef4444] px-2.5 py-[4px] text-[10px] font-semibold text-white">
            <span className="h-1.5 w-1.5 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-white" />
            LIVE CLASS TODAY 7PM
          </div>
        ) : null}

        {isLiveToday ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-[11px] text-[rgba(255,255,255,0.6)]">Starts in:</div>
            <div className="mt-2 text-[20px] font-bold text-[#f97316]">{countdown}</div>
            <Link
              href={selectedProgram.liveClassUrl}
              target="_blank"
              className="mt-5 rounded-[8px] bg-[#f97316] px-6 py-2.5 text-[14px] font-semibold text-white"
            >
              Join Live Class
            </Link>
          </div>
        ) : activeLesson.embedUrl ? (
          <>
            <iframe
              src={activeLesson.embedUrl}
              title={activeLesson.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="absolute right-0 bottom-0 left-0 flex items-center gap-3 bg-[rgba(0,0,0,0.82)] px-4 py-3 text-[11px] text-[rgba(255,255,255,0.6)]">
              <button type="button" className="text-[#f1f5f9]">
                <Play className="h-4 w-4" />
              </button>
              <button type="button" className="text-[rgba(255,255,255,0.6)]">
                <Pause className="h-4 w-4" />
              </button>
              <div className="h-1 flex-1 rounded-full bg-[rgba(255,255,255,0.12)]">
                <div className="h-1 w-1/3 rounded-full bg-[#f97316]" />
              </div>
              <span>03:21 / {activeLesson.duration}</span>
              <select className="rounded bg-[rgba(255,255,255,0.08)] px-2 py-1 text-[#f1f5f9] outline-none">
                {["0.75x", "1x", "1.25x", "1.5x", "2x"].map((speed) => (
                  <option key={speed}>{speed}</option>
                ))}
              </select>
              <button type="button" className="text-[#f1f5f9]">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Video className="h-10 w-10 text-[#475569]" />
            <div className="mt-3 text-[13px] text-[#cbd5e1]">Recording will appear after live class</div>
          </div>
        )}
      </div>
    );
  }

  function renderOverviewTab() {
    if (!activeLesson) {
      return null;
    }

    const coverageItems = [
      { icon: "▶", text: activeLesson.description, badge: "Video", color: "text-[#f97316] bg-[rgba(249,115,22,0.12)]" },
      { icon: "🧪", text: `Hands-on practice for ${activeLesson.moduleTitle}`, badge: "Lab", color: "text-[#60a5fa] bg-[rgba(59,130,246,0.12)]" },
      { icon: "📄", text: "Reference notes and downloadable session files", badge: "PDF", color: "text-[#64748b] bg-[rgba(255,255,255,0.06)]" },
      { icon: "✓", text: "Completion checkpoint for module progress", badge: "Quiz", color: "text-[#34d399] bg-[rgba(16,185,129,0.12)]" },
    ];

    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#1e293b]">{activeLesson.title}</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-[12px] text-[#64748b]">
            <span>{activeLesson.duration}</span>
            <span>Module {activeLesson.moduleIndex + 1}</span>
            <span>{selectedCourse?.level}</span>
            <span>{isLiveToday ? "Live today" : activeLesson.type === "live" ? "Live session" : "Recorded lesson"}</span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-[14px]">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]">This Session Covers</div>
          <div className="space-y-3">
            {coverageItems.map((item) => (
              <div key={item.badge} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#f8fafc] text-[13px] text-[#64748b]">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1 text-[12px] text-[#475569]">{item.text}</div>
                <span className={cn("rounded-full border px-2 py-1 text-[10px]", item.color)}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderResourcesTab() {
    if (!activeLesson) {
      return null;
    }

    return (
      <div className="space-y-3">
        {activeLesson.resources.map((resource) => (
          <a
            key={resource.name}
            href={resource.url}
            className="flex items-center gap-3 rounded-[10px] border border-[#e2e8f0] bg-white p-4 transition hover:border-[#fed7aa]"
          >
            <FileText
              className={cn(
                "h-5 w-5",
                resource.type === "PDF" && "text-[#ef4444]",
                resource.type === "LAB" && "text-[#60a5fa]",
                resource.type === "PPT" && "text-[#f97316]",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[#1e293b]">{resource.name}</div>
              <div className="mt-1 text-[11px] text-[#94a3b8]">{resource.size}</div>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] text-[#f97316]">
              <Download className="h-4 w-4" />
              Download
            </span>
          </a>
        ))}
      </div>
    );
  }

  function renderNotesTab() {
    return (
      <div>
        <textarea
          value={noteText}
          onChange={(event) => {
            setNoteText(event.target.value);
            setNoteDirty(true);
            setNoteSaved(false);
          }}
          placeholder="Write your notes for this lesson..."
          className="min-h-[220px] w-full resize-y rounded-[8px] border border-[#e2e8f0] bg-white p-3 text-[13px] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
        />
        {noteSaved ? <div className="mt-2 text-[11px] text-[#16a34a]">Notes auto-saved</div> : null}
      </div>
    );
  }

  function renderQaTab() {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder="Ask your mentor a question..."
            className="min-w-0 flex-1 rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-2.5 text-[13px] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
          />
          <button
            type="button"
            onClick={() => void submitQuestion()}
            className="rounded-[8px] bg-[#f97316] px-4 py-2 text-[12px] font-semibold text-white"
          >
            Ask
          </button>
        </div>

        {questions.length ? (
          questions.map((question) => (
            <div key={question.id} className="rounded-[10px] border border-[#e2e8f0] bg-white p-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(139,92,246,0.15)] text-[11px] font-bold text-[#a78bfa]">
                  {userInfo.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-[#1e293b]">{question.question}</div>
                  <div className="mt-1 text-[10px] text-[#94a3b8]">{question.createdAt || "Just now"}</div>
                  {question.answer ? (
                    <div className="mt-3 rounded-[8px] bg-[#dcfce7] p-3 text-[12px] text-[#166534]">
                      {question.answer}
                    </div>
                  ) : (
                    <span className="mt-3 inline-flex rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-1 text-[10px] text-[#f97316]">
                      Awaiting mentor response
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-5 text-[12px] text-[#64748b]">
            No questions yet for this lesson.
          </div>
        )}
      </div>
    );
  }

  function renderAssignmentTab() {
    if (!activeLesson) {
      return null;
    }

    return (
      <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-5">
        <div className="text-[14px] font-semibold text-[#1e293b]">Assignment</div>
        <p className="mt-3 text-[12px] leading-6 text-[#64748b]">{activeLesson.assignment.description}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <InfoTile label="Deadline" value={formatDate(activeLesson.assignment.deadline)} />
          <InfoTile label="Status" value={activeLesson.assignment.status} />
          <InfoTile label="Score" value={activeLesson.assignment.score || "Pending"} />
        </div>
        <div className="mt-5 rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-[12px] text-[#64748b]">Upload your file or add a text submission from this area.</div>
            <button type="button" className="inline-flex items-center gap-2 rounded-[8px] bg-[#f97316] px-4 py-2 text-[12px] font-semibold text-white">
              <Upload className="h-4 w-4" />
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderTabContent() {
    if (allModulesCompleted) {
      return (
        <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-6">
          <div className="text-[12px] uppercase tracking-[0.08em] text-[#f97316]">Certificate Ready</div>
          <div className="mt-2 text-[24px] font-semibold text-[#1e293b]">{selectedCourse?.certificate}</div>
          <div className="mt-3 text-[13px] text-[#64748b]">
            {userInfo.name} completed {selectedCourse?.title}. Certificate ID: {certificateId}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadCertificate(userInfo.name, selectedCourse?.title || "Course", certificateId)}
              className="rounded-[8px] bg-[#f97316] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Download Certificate
            </button>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://expertlearning.in")}`}
              target="_blank"
              className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] px-5 py-2.5 text-[13px] font-semibold text-[#f97316]"
            >
              Share on LinkedIn
            </Link>
          </div>
        </div>
      );
    }

    if (activeTab === "resources") {
      return renderResourcesTab();
    }

    if (activeTab === "notes") {
      return renderNotesTab();
    }

    if (activeTab === "qa") {
      return renderQaTab();
    }

    if (activeTab === "assignment") {
      return renderAssignmentTab();
    }

    return renderOverviewTab();
  }

  return (
    <div className="grid h-full min-h-0 overflow-hidden bg-[#f8fafc] text-[#1e293b] md:grid-cols-[260px_minmax(0,1fr)]">
      {mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close course menu"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      ) : null}
      {renderLessonSidebar()}

      <main className="flex min-w-0 flex-col bg-[#f8fafc]">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-5 py-[10px]">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b] md:hidden"
              aria-label="Open course menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigateLesson("prev")}
              className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b]"
              aria-label="Previous lesson"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigateLesson("next")}
              className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b]"
              aria-label="Next lesson"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="truncate text-[11px]">
              <span className="text-[#94a3b8]">Module {currentModuleIndex + 1}</span>
              <span className="px-2 text-[#334155]">→</span>
              <span className="text-[#475569]">{activeLesson?.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  const firstUnread = notifications.find((item) => !item.read);
                  if (firstUnread) {
                    void handleNotificationClick(firstUnread);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#e2e8f0] bg-white text-[#64748b]"
              >
                <Bell className="h-4 w-4" />
              </button>
              {notificationCount ? (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f97316] px-1 text-[9px] text-white">
                  {notificationCount}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                setNotesOpen((current) => !current);
                setActiveTab("notes");
              }}
              className="hidden items-center gap-2 rounded-[6px] border border-[#e2e8f0] bg-white px-3 py-[5px] text-[11px] text-[#64748b] sm:inline-flex"
            >
              <NotebookPen className="h-4 w-4" />
              Notes
            </button>
            <button
              type="button"
              onClick={() => void bookmarkCurrentLesson()}
              className={cn(
                "hidden items-center gap-2 rounded-[6px] border border-[#e2e8f0] bg-white px-3 py-[5px] text-[11px] sm:inline-flex",
                bookmarked ? "text-[#f97316]" : "text-[#64748b]",
              )}
            >
              <Bookmark className="h-4 w-4" />
              Bookmark
            </button>
            <button
              type="button"
              onClick={() => void completeCurrentLesson()}
              disabled={activeLessonCompleted || currentModuleState === "locked"}
              className="inline-flex items-center gap-2 rounded-[6px] border border-[#f97316] bg-[#f97316] px-4 py-[5px] text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Mark Complete
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {renderVideoArea()}

          <div className="sticky top-0 z-10 flex overflow-x-auto border-b border-[#e2e8f0] bg-white">
            {(Object.keys(tabLabels) as PlayerTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-[10px] text-[12px] transition hover:text-[#475569]",
                  activeTab === tab ? "border-[#f97316] font-medium text-[#f97316]" : "border-transparent text-[#64748b]",
                )}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className={cn("grid gap-5 bg-[#f8fafc] p-5", notesOpen && "lg:grid-cols-[minmax(0,1fr)_320px]")}>
            <div>{renderTabContent()}</div>
            {notesOpen ? (
              <div className="rounded-[10px] border border-[#e2e8f0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-[#1e293b]">Lesson Notes</div>
                  <button type="button" onClick={() => setNotesOpen(false)} className="text-[#64748b]" aria-label="Close notes">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {renderNotesTab()}
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {toast ? (
        <div className="fixed right-5 bottom-5 rounded-[10px] border border-[#bbf7d0] bg-white px-4 py-3 text-[13px] text-[#16a34a] shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
      <div className="text-[10px] uppercase tracking-[0.08em] text-[#94a3b8]">{label}</div>
      <div className="mt-1 text-[12px] text-[#1e293b]">{value}</div>
    </div>
  );
}
