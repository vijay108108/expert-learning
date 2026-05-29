"use client";

import Link from "next/link";
import type { Course } from "@/data/courses";
import { CourseEnrollmentAction } from "@/components/enroll/course-enrollment-action";
import { useAuth } from "@/hooks/use-auth";
import { useEnrolledCourseIds } from "@/hooks/use-enrolled-course-ids";

const trackLabelMap: Record<Course["track"], string> = {
  ai: "AI",
  "generative-ai": "Generative AI",
  "agentic-ai": "Agentic AI",
  devsecops: "DevOps",
  "aws-certifications": "AWS Certifications",
  "azure-certifications": "Azure Certifications",
};

const levelTone: Record<Course["level"], string> = {
  Beginner: "bg-[#E3F2FD] text-[#0D47A1] border-[#E3F2FD]",
  Intermediate: "bg-[#FFF3E0] text-[#4338CA] border-[#FFF3E0]",
  Advanced: "bg-[#FCE4EC] text-[#880E4F] border-[#FCE4EC]",
};

export function CourseCatalogCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const { enrolledCourseIds, enrolledMetaByCourseId } = useEnrolledCourseIds();
  const isEnrolled = Boolean(user && enrolledCourseIds.includes(course.slug));
  const progressPercent = isEnrolled ? 25 : 0;
  const highlights = [
    course.tags[0] || "Live Mentorship",
    course.tags[1] || "Hands-on Projects",
    course.tags[2] || "Career Guidance",
  ].slice(0, 3);

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] ${
        isEnrolled
          ? "border-[#C7D2FE] bg-[#F8FAFF]"
          : "border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.96)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[#E5E7EB] bg-[#E5E7EB] px-2.5 py-1 text-[11px] font-semibold text-[#111827]">
          {trackLabelMap[course.track]}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${levelTone[course.level]}`}>
          {course.level}
        </span>
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#111827]">{course.certification}</p>
      <h3 className="mt-2 line-clamp-2 min-h-[56px] text-lg font-semibold leading-tight text-[#111827]">{course.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-[40px] text-[12px] leading-5 text-[#6B7280]">{course.shortDescription}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1.5 text-[#6B7280]">{course.duration}</div>
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1.5 text-[#6B7280]">{course.mode}</div>
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1.5 text-[#6B7280]">{course.category.toUpperCase()}</div>
      </div>

      <div className="mt-2">
        <span className="inline-flex items-center rounded-full border border-[#DCE3F1] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-medium text-[#4F46E5]">
          Career-Focused Program
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {highlights.map((item) => (
          <p key={item} className="flex items-center gap-2 text-[12px] leading-4 text-[#374151]">
            <span className="text-[#16A34A]">✓</span>
            <span className="truncate">{item}</span>
          </p>
        ))}
      </div>

      {isEnrolled ? (
        <>
          <div className="mt-auto pt-4">
            <div className="rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#4F46E5]">Enrolled</p>
            <p className="mt-1 text-xs font-medium text-[#4338CA]">Progress: {progressPercent}%</p>
            </div>
          </div>
          <Link
            href={`/dashboard/${course.slug}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#4F46E5] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
          >
            Continue Learning
          </Link>
        </>
      ) : (
        <>
          <div className="mt-auto pt-4">
            <p className="text-[20px] font-bold text-[#111827]">{course.price}</p>
          </div>
          <div className="mt-2.5 flex gap-2">
            <div className="flex-1">
              <CourseEnrollmentAction
                courseSlug={course.slug}
                checkoutLabel="Enroll Now"
                checkoutHelperText=""
                enrolledHelperText=""
                checkoutButtonClassName="rounded-lg px-3 py-2.5 text-sm"
                enrolledButtonClassName="rounded-lg px-3 py-2.5 text-sm"
                helperClassName="hidden"
              />
            </div>
            <Link
              href={`/contact?course=${encodeURIComponent(course.title)}`}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#111827] px-3 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-[#E5E7EB]"
            >
              Request Callback
            </Link>
          </div>
        </>
      )}
      {isEnrolled && enrolledMetaByCourseId[course.slug]?.enrolledAt ? (
        <p className="mt-2 text-[11px] text-[#6B7280]">
          Enrolled • {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(enrolledMetaByCourseId[course.slug].enrolledAt as string))}
        </p>
      ) : null}
    </article>
  );
}
