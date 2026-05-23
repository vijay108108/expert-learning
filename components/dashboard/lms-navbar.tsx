"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { allCourses } from "@/data/courses";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function getUserInitials(source?: string | null) {
  if (!source) {
    return "GZ";
  }

  const cleaned = source.trim();

  if (!cleaned) {
    return "GZ";
  }

  const words = cleaned
    .replace(/[@._-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}

function getRouteCourseSlug(pathname: string) {
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
    <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5" aria-label="GenZNext Learning Portal">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.2)]">
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <polygon points="14,3 25,9 25,19 14,25 3,19 3,9" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <polygon
            points="14,8 20,11.5 20,18.5 14,22 8,18.5 8,11.5"
            fill="rgba(139,92,246,0.2)"
            stroke="#a78bfa"
            strokeWidth="1"
          />
          <text x="14" y="17" textAnchor="middle" fontSize="8" fontWeight="700" fill="#f97316" fontFamily="sans-serif">
            GZ
          </text>
        </svg>
      </div>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-bold text-[#f1f5f9]">
          Gen<span className="text-[#f97316]">Z</span>Next
        </span>
        <span className="text-[8px] text-[#64748b]">Research &amp; Training</span>
      </span>
    </Link>
  );
}

export function LmsNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const currentCourseSlug = useMemo(() => getRouteCourseSlug(pathname), [pathname]);
  const currentCourse = useMemo(
    () => allCourses.find((course) => course.slug === currentCourseSlug),
    [currentCourseSlug],
  );
  const userInitials = useMemo(
    () => getUserInitials(user?.displayName || user?.email || user?.phoneNumber),
    [user?.displayName, user?.email, user?.phoneNumber],
  );

  return (
    <header className="border-b border-[#334155] bg-[#1e293b]">
      <div className="mx-auto flex h-[52px] w-full items-center justify-between gap-3 px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <LmsBrand />
          <div className="hidden h-[18px] w-px bg-[#334155] sm:block" aria-hidden="true" />
          <div className="hidden min-w-0 items-center text-[12px] sm:flex">
            <span className="truncate text-[#94a3b8]">Learning Portal</span>
            <span className="px-1.5 text-[#475569]">/</span>
            <span className="truncate font-medium text-[#f1f5f9]">
              {currentCourse?.title || "Dashboard"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#334155] bg-[rgba(255,255,255,0.05)] text-[#64748b] transition hover:text-[#f1f5f9]"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div
            className={cn(
              "inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[11px] font-bold",
              "border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.2)] text-[#a78bfa]",
            )}
            aria-label="Your account"
          >
            {userInitials}
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center rounded-[7px] border border-[#334155] bg-[rgba(255,255,255,0.05)] px-3 py-1.5 text-[11px] text-[#94a3b8] transition hover:text-[#f1f5f9]"
          >
            {"← Back to Main Site"}
          </button>
        </div>
      </div>
    </header>
  );
}

