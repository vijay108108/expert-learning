"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Layers, MonitorPlay } from "lucide-react";
import type { Course } from "@/data/courses";
import { CourseEnrollmentAction } from "@/components/enroll/course-enrollment-action";
import { useAuth } from "@/hooks/use-auth";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";

const trackLabel: Record<Course["track"], string> = {
  "ai": "AI",
  "generative-ai": "Generative AI",
  "agentic-ai": "Agentic AI",
  "devsecops": "DevOps",
  "aws-certifications": "AWS",
  "azure-certifications": "Azure",
};

const trackColor: Record<Course["track"], string> = {
  "ai": "bg-[#FFF3E8] text-[#C65A0D] border-[#FCD7B6]",
  "generative-ai": "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]",
  "agentic-ai": "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
  "devsecops": "bg-[#EEF4FB] text-[#1D4ED8] border-[#C8D7EE]",
  "aws-certifications": "bg-[#FEFCE8] text-[#854D0E] border-[#FDE68A]",
  "azure-certifications": "bg-[#EEF4FB] text-[#1E40AF] border-[#C8D7EE]",
};

const levelColor: Record<Course["level"], string> = {
  Beginner: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
  Intermediate: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
  Advanced: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]",
};

const modeIcon: Record<Course["mode"], React.ElementType> = {
  live: MonitorPlay,
  recorded: Layers,
  "self-paced": Layers,
  hybrid: MonitorPlay,
};

const modeLabel: Record<Course["mode"], string> = {
  live: "Live",
  recorded: "Recorded",
  "self-paced": "Self-Paced",
  hybrid: "Hybrid",
};

export function CourseCatalogCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const { enrolledCourseIds, enrolledMetaByCourseId } = useEnrolledCourseIds();
  const isEnrolled = Boolean(user && enrolledCourseIds.includes(course.slug));

  const highlights = [
    course.tags[0] || "Live Mentorship",
    course.tags[1] || "Hands-on Projects",
    course.tags[2] || "Career Guidance",
  ].slice(0, 3);

  const ModeIcon = modeIcon[course.mode] ?? Layers;

  return (
    <article className={`group flex h-full flex-col rounded-2xl border bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${
      isEnrolled ? "border-[#C8D7EE]" : "border-[#E2E8F0]"
    }`}>

      {/* ── Top accent bar ── */}
      <div className={`h-1 w-full rounded-t-2xl ${isEnrolled ? "bg-[linear-gradient(90deg,#1B4C92,#0B2E6B)]" : "bg-[linear-gradient(90deg,#E2E8F0,#F1F5F9)]"}`} />

      <div className="flex flex-1 flex-col p-5">

        {/* ── Track + Level badges ── */}
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${trackColor[course.track]}`}>
            {trackLabel[course.track]}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${levelColor[course.level]}`}>
            {course.level}
          </span>
        </div>

        {/* ── Certification label ── */}
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B2E6B]">
          {course.certification}
        </p>

        {/* ── Title ── */}
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#0F172A]">
          {course.title}
        </h3>

        {/* ── Description ── */}
        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.6] text-[#64748B]">
          {course.shortDescription}
        </p>

        {/* ── Meta row ── */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <Clock3 className="h-3 w-3 text-[#94A3B8]" />{course.duration}
          </span>
          <span className="h-3 w-px bg-[#E2E8F0]" />
          <span className="flex items-center gap-1">
            <ModeIcon className="h-3 w-3 text-[#94A3B8]" />{modeLabel[course.mode]}
          </span>
          <span className="h-3 w-px bg-[#E2E8F0]" />
          <span className="uppercase">{course.category}</span>
        </div>

        {/* ── Highlights ── */}
        <div className="mt-3.5 space-y-1.5">
          {highlights.map((item) => (
            <p key={item} className="flex items-start gap-1.5 text-[12px] leading-[1.5] text-[#374151]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B2E6B]" />
              <span className="line-clamp-1">{item}</span>
            </p>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="mt-4 h-px bg-[#F1F5F9]" />

        {/* ── Footer ── */}
        {isEnrolled ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-[#C8D7EE] bg-[#EAF0FA] px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B2E6B]">Enrolled</p>
                {enrolledMetaByCourseId[course.slug]?.enrolledAt && (
                  <p className="text-[10px] text-[#64748B]">
                    {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
                      .format(new Date(enrolledMetaByCourseId[course.slug].enrolledAt as string))}
                  </p>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#C8D7EE]">
                <div className="h-full w-[25%] rounded-full bg-[#0B2E6B]" />
              </div>
              <p className="mt-1 text-[10px] text-[#092552]">25% completed</p>
            </div>
            <Link
              href={`/dashboard/${course.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2E6B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#092552]"
            >
              Continue Learning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-extrabold text-[#0F172A]">
                {course.price.replace("INR", "₹")}
              </p>
              {course.originalPrice && course.originalPrice !== course.price && (
                <p className="text-[12px] text-[#94A3B8] line-through">
                  {course.originalPrice.replace("INR", "₹")}
                </p>
              )}
            </div>
            <Link
              href={`/courses/syllabus/${course.slug}`}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#C8D7EE] bg-[#EAF0FA] px-3 py-2.5 text-[13px] font-semibold text-[#0B2E6B] transition hover:bg-[#DCE7F7]"
            >
              View Syllabus <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <CourseEnrollmentAction
                courseSlug={course.slug}
                checkoutLabel="Enroll Now"
                checkoutHelperText=""
                enrolledHelperText=""
                checkoutButtonClassName="rounded-xl px-3 py-2.5 text-[13px]"
                enrolledButtonClassName="rounded-xl px-3 py-2.5 text-[13px]"
                helperClassName="hidden"
              />
              <Link
                href={`/contact?course=${encodeURIComponent(course.title)}`}
                className="flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-[13px] font-medium text-[#475569] transition hover:border-[#0B2E6B] hover:text-[#0B2E6B]"
              >
                Enquire
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
