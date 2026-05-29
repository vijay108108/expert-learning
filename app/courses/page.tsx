"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CourseCatalogCard } from "@/components/ui/course-catalog-card";
import { allCourses } from "@/data/courses";
import type { LearningTrackKey } from "@/data/learning-tracks";

const trackOptions: Array<{ value: LearningTrackKey | "all"; label: string }> = [
  { value: "all", label: "All Tracks" },
  { value: "ai", label: "AI" },
  { value: "generative-ai", label: "Generative AI" },
  { value: "agentic-ai", label: "Agentic AI" },
  { value: "devsecops", label: "DevOps" },
  { value: "aws-certifications", label: "AWS Certifications" },
  { value: "azure-certifications", label: "Azure Certifications" },
];

const modeOptions = [
  { value: "all", label: "All Modes" },
  { value: "live", label: "Live" },
  { value: "recorded", label: "Recorded" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState<LearningTrackKey | "all">("all");
  const [level, setLevel] = useState<"all" | "Beginner" | "Intermediate" | "Advanced">("all");
  const [mode, setMode] = useState<(typeof modeOptions)[number]["value"]>("all");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allCourses.filter((course) => {
      const bySearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query));
      const byTrack = track === "all" || course.track === track;
      const byLevel = level === "all" || course.level === level;
      const byMode = mode === "all" || course.mode === mode;
      return bySearch && byTrack && byLevel && byMode;
    });
  }, [level, mode, search, track]);

  return (
    <section className="bg-[#F8FAFC] text-[#6B7280]">
      <div className="bg-[#F8FAFC]">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#FFFFFF] px-6 py-8 shadow-sm sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111827]">GenZNext Course Catalog</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-[#111827] sm:text-4xl">
              Advance Your Cloud & AI Career
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6B7280] sm:text-base">
              Explore mentor-led pathways in AWS, Azure, DevSecOps, AI, Generative AI, and Agentic AI with practical projects and certification support.
            </p>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                <p className="font-semibold">1,500+ learners</p>
                <p className="mt-1 text-xs text-[#6B7280]">Career-focused training programs</p>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                <p className="font-semibold">40+ live batches</p>
                <p className="mt-1 text-xs text-[#6B7280]">Mentor-guided interactive sessions</p>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                <p className="font-semibold">Certification-first</p>
                <p className="mt-1 text-xs text-[#6B7280]">Exam prep, projects, and support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[74px] z-10 border-y border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-3 px-4 py-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <label className="relative block lg:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, skill, or tool"
              className="w-full rounded-xl border border-[#6B7280] bg-white py-2.5 pr-3 pl-9 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            />
          </label>
          <select
            value={track}
            onChange={(event) => setTrack(event.target.value as LearningTrackKey | "all")}
            className="rounded-xl border border-[#6B7280] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
          >
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as typeof level)}
              className="rounded-xl border border-[#6B7280] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as typeof mode)}
              className="rounded-xl border border-[#6B7280] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            >
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-[#6B7280]">
            Showing <span className="font-semibold text-[#111827]">{filteredCourses.length}</span> programs
          </p>
          <p className="hidden text-xs text-[#9CA3AF] sm:block">Certification tracks · Live mentorship · LMS access</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCatalogCard key={course.slug} course={course} />
          ))}
        </div>

        {!filteredCourses.length ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center">
            <p className="text-sm font-medium text-[#111827]">No courses match your current filters.</p>
            <p className="mt-1 text-sm text-[#6B7280]">Try resetting search, track, level, or mode to explore more programs.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
