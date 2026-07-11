"use client";

import { Award, BookOpenCheck, CalendarDays, Clock3, Files, Layers3, Users2 } from "lucide-react";
import Link from "next/link";
import { lmsCourseMaterials, lmsMockCourses } from "@/data/lms-portal-mock";

type LmsFoundationProps = {
  title: string;
  subtitle: string;
};

export function LmsFoundation({ title, subtitle }: LmsFoundationProps) {
  const totalCourses = lmsMockCourses.length;
  const averageProgress = Math.round(
    lmsMockCourses.reduce((sum, course) => sum + course.progress, 0) / Math.max(totalCourses, 1),
  );

  return (
    <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[28px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#EAF0FA,#F8FAFC)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0B2E6B]">LMS Portal</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] sm:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569]">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Enrolled Program", value: `${totalCourses}` },
                { label: "Learning Modules", value: "12" },
                { label: "Certifications", value: "4" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                  <p className="text-[11px] text-[#64748B]">{stat.label}</p>
                  <p className="mt-1 text-xl font-bold text-[#0F172A]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <article className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Continue Learning</h2>
              <Link href="/lms/player" className="text-sm font-semibold text-[#0B2E6B] hover:underline">Open Player</Link>
            </div>
            <div className="mt-4 space-y-3">
              {lmsMockCourses.slice(0, 2).map((course) => (
                <article key={course.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">{course.title}</h3>
                      <p className="mt-1 text-xs text-[#64748B]">{course.completedLessons}/{course.totalLessons} modules completed</p>
                    </div>
                    <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] text-[#64748B]">{course.status === "active" ? "Active" : "Locked"}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#1B4C92,#0B2E6B)]" style={{ width: `${course.progress}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-[#64748B]">{course.progress}% completed</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-[#0B2E6B]" /> 10 weeks</span>
                    <span className="inline-flex items-center gap-1"><Users2 className="h-3.5 w-3.5 text-[#0B2E6B]" /> Mentor guided</span>
                    <span className="inline-flex items-center gap-1"><Layers3 className="h-3.5 w-3.5 text-[#0B2E6B]" /> Live + recorded</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/lms/course/${course.id}`} className="inline-flex h-12 items-center rounded-[14px] bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)]">
                      Continue Learning
                    </Link>
                    <Link href="/lms/resources" className="inline-flex h-12 items-center rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]">
                      View Syllabus
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="space-y-4">
            <aside className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-base font-semibold">Upcoming Live Classes</h2>
              <div className="mt-3 space-y-2">
                {[
                  "AWS Architecture Session - Tue, 7:00 PM",
                  "GenAI Prompt Engineering - Thu, 8:00 PM",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#475569]">
                    <div className="inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#0B2E6B]" /> {item}</div>
                  </div>
                ))}
              </div>
            </aside>

            <aside className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-base font-semibold">Recent Resources</h2>
              <div className="mt-3 space-y-2">
                {lmsCourseMaterials.slice(0, 3).map((resource) => (
                  <Link key={resource.id} href={resource.href} className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#475569] transition hover:bg-white">
                    <span className="inline-flex items-center gap-2"><Files className="h-3.5 w-3.5 text-[#0B2E6B]" /> {resource.title}</span>
                    <span className="text-[11px] text-[#64748B]">{resource.type}</span>
                  </Link>
                ))}
              </div>
            </aside>

            <aside className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-base font-semibold">Certificates</h2>
              <div className="mt-3 space-y-2 text-sm">
                {["AZ-104 Completion", "AWS Practitioner Prep", "AI Foundations"].map((item) => (
                  <div key={item} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[#475569]">
                    <span className="inline-flex items-center gap-2"><Award className="h-3.5 w-3.5 text-[#0B2E6B]" /> {item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>

        <section className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Learning Progress</h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs text-[#64748B]">
              <BookOpenCheck className="h-3.5 w-3.5 text-[#0B2E6B]" />
              {averageProgress}% overall completed
            </span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#1B4C92,#0B2E6B)]" style={{ width: `${averageProgress}%` }} />
          </div>
        </section>
      </div>
    </section>
  );
}
