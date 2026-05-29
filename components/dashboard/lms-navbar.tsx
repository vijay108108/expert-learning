"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { allCourses } from "@/data/courses";

function getRouteCourseSlug(pathname: string) {
  if (pathname === "/dashboard/courses" || pathname === "/dashboard/profile") {
    return null;
  }

  const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)$/);

  if (dashboardMatch?.[1]) {
    return decodeURIComponent(dashboardMatch[1]);
  }

  const learnMatch = pathname.match(/^\/learn\/([^/]+)/);

  if (learnMatch?.[1]) {
    return decodeURIComponent(learnMatch[1]);
  }

  const courseLearnMatch = pathname.match(/^\/courses\/[^/]+\/([^/]+)\/learn(?:\/|$)/);

  if (courseLearnMatch?.[1]) {
    return decodeURIComponent(courseLearnMatch[1]);
  }

  const portalMatch = pathname.match(/^\/portal\/([^/]+)/);

  if (portalMatch?.[1]) {
    return decodeURIComponent(portalMatch[1]);
  }

  return null;
}

function LmsBrand() {
  return (
    <Link href="/dashboard/courses" className="flex shrink-0 items-center gap-2.5" aria-label="GenZNext Learning Portal">
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #6366F1, #4F46E5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-1px",
            fontFamily: "sans-serif",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          GZ
        </span>
      </div>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-bold text-[#0F172A]">
          Gen<span className="text-[#4F46E5]">Z</span>Next
        </span>
        <span className="text-[9px] text-[#64748B]">Research &amp; Training</span>
      </span>
    </Link>
  );
}

export function LmsNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentCourseSlug = useMemo(() => getRouteCourseSlug(pathname), [pathname]);
  const currentCourse = useMemo(
    () => allCourses.find((course) => course.slug === currentCourseSlug),
    [currentCourseSlug],
  );
  const currentSectionLabel =
    pathname === "/dashboard/courses" ? "My Courses" : pathname === "/dashboard/profile" ? "Profile" : currentCourse?.title || "Dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(226,232,240,0.9)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[14px]">
      <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <LmsBrand />
          <div className="hidden h-[22px] w-px bg-[#E2E8F0] sm:block" aria-hidden="true" />
          <div className="hidden min-w-0 items-center text-[12px] sm:flex">
            <span className="truncate text-[#64748B]">Learning Portal</span>
            <span className="px-1.5 text-[#94A3B8]">/</span>
            <span className="truncate font-medium text-[#0F172A]">{currentSectionLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex h-10 items-center rounded-[12px] border border-[#E2E8F0] bg-white px-3.5 text-[12px] text-[#64748B] shadow-[0_4px_14px_rgba(15,23,42,0.05)] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            {"← Back to Main Site"}
          </button>
        </div>
      </div>
    </header>
  );
}

