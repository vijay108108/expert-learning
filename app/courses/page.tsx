"use client";

import { BookOpenCheck, GraduationCap, Search, SlidersHorizontal, Users2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CourseCatalogCard } from "@/components/ui/course-catalog-card";
import { allCourses, type Course } from "@/data/courses";
import type { LearningTrackKey } from "@/data/learning-tracks";

const trackOptions: Array<{ value: LearningTrackKey | "all"; label: string }> = [
  { value: "all", label: "All Tracks" },
  { value: "ai", label: "AI" },
  { value: "generative-ai", label: "Generative AI" },
  { value: "agentic-ai", label: "Agentic AI" },
  { value: "devsecops", label: "DevOps" },
  { value: "aws-certifications", label: "AWS" },
  { value: "azure-certifications", label: "Azure" },
];

const levelOptions = [
  { value: "all", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
] as const;

const modeOptions = [
  { value: "all", label: "All Modes" },
  { value: "live", label: "Live" },
  { value: "recorded", label: "Recorded" },
  { value: "hybrid", label: "Hybrid" },
] as const;

const stats = [
  { icon: Users2, value: "6,000+", label: "Learners trained" },
  { icon: BookOpenCheck, value: "48+", label: "Live batches" },
  { icon: GraduationCap, value: "96%", label: "Placement satisfaction" },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState<LearningTrackKey | "all">("all");
  const [level, setLevel] = useState<(typeof levelOptions)[number]["value"]>("all");
  const [mode, setMode] = useState<(typeof modeOptions)[number]["value"]>("all");
  const [courses, setCourses] = useState<Course[]>(allCourses);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog-courses")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => { /* keep static fallback */ });
    return () => { cancelled = true; };
  }, []);

  const hasActiveFilters = track !== "all" || level !== "all" || mode !== "all" || search.trim() !== "";

  function resetFilters() {
    setSearch("");
    setTrack("all");
    setLevel("all");
    setMode("all");
  }

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const bySearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query));
      const byTrack = track === "all" || course.track === track;
      const byLevel = level === "all" || course.level === level;
      const byMode = mode === "all" || course.mode === mode;
      return bySearch && byTrack && byLevel && byMode;
    });
  }, [courses, level, mode, search, track]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-[#E2E8F0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <span className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#64748B]">
            GenZNext Course Catalog
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
            Cloud, AI &amp; DevOps Courses
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#475569]">
            Mentor-led programs in AWS, Azure, DevSecOps, AI, Generative AI and Agentic AI — with live labs, projects and certification support.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
                <s.icon className="h-4 w-4 text-[#4F46E5]" />
                <span className="text-sm font-bold text-[#0F172A]">{s.value}</span>
                <span className="text-sm text-[#64748B]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="sticky top-[64px] z-10 border-b border-[#E2E8F0] bg-white/95 shadow-[0_1px_8px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">

          {/* Search */}
          <label className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 pr-3 pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/10"
            />
          </label>

          {/* Track */}
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value as LearningTrackKey | "all")}
            className="h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
          >
            {trackOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Level */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
            className="h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
          >
            {levelOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Mode */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
          >
            {modeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#64748B] transition hover:border-[#94A3B8] hover:text-[#0F172A]"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}

          {/* Count */}
          <span className="ml-auto text-sm text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">{filteredCourses.length}</span> courses
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#64748B]" />
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#475569]">
                &quot;{search}&quot; <button onClick={() => setSearch("")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {track !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#475569]">
                {trackOptions.find(o => o.value === track)?.label} <button onClick={() => setTrack("all")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {level !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#475569]">
                {level} <button onClick={() => setLevel("all")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {mode !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#475569]">
                {mode} <button onClick={() => setMode("all")}><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCatalogCard key={course.slug} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-8 py-16 text-center">
            <Search className="h-10 w-10 text-[#CBD5E1]" />
            <p className="mt-4 text-base font-semibold text-[#0F172A]">No courses found</p>
            <p className="mt-1 text-sm text-[#64748B]">Try adjusting your search or clearing the filters.</p>
            <button
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
