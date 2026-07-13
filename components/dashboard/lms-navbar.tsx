"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenCheck,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/hooks/use-auth";
import { getUserProfile } from "@/lib/firebase/user-profiles";
import { cn, getInitials } from "@/lib/utils";

const navLinks = [
  { label: "My Courses",   href: "/dashboard/courses",  icon: LayoutDashboard },
  { label: "My Learning",  href: "/lms/my-learning",    icon: BookOpenCheck },
  { label: "Player",       href: "/lms/player",         icon: PlayCircle },
] as const;

function LmsBrand() {
  return (
    <div className="flex shrink-0 items-center gap-2.5" aria-label="GenZNext Learning Portal">
      <Brand
        href="/dashboard/courses"
        className="min-h-0 py-0"
      />
      <span className="flex flex-col leading-none">
        <span className="mt-0.5 text-[9px] text-[#64748B]">Learning Portal</span>
      </span>
    </div>
  );
}

export function LmsNavbar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { user, signOutUser } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState("");

  const activeLabel = useMemo(() => {
    const match = navLinks.find((l) => pathname === l.href || pathname.startsWith(l.href + "/"));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  useEffect(() => {
    let active = true;

    async function loadProfileName() {
      if (!user?.uid) {
        if (active) {
          setProfileName("");
        }
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        if (active) {
          setProfileName(profile?.name?.trim() || "");
        }
      } catch {
        if (active) {
          setProfileName("");
        }
      }
    }

    void loadProfileName();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  const resolvedDisplayName = profileName || user?.displayName || "";
  const resolvedIdentity = resolvedDisplayName || user?.email || user?.phoneNumber || "";

  async function handleSignOut() {
    try { await signOutUser(); } catch { /* ignore */ }
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/96 shadow-[0_1px_6px_rgba(15,23,42,0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-[60px] w-full items-center justify-between gap-4 px-4 sm:px-6">

        {/* Left: brand + breadcrumb */}
        <div className="flex min-w-0 items-center gap-3">
          <LmsBrand />
          <ChevronRight className="hidden h-4 w-4 shrink-0 text-[#CBD5E1] sm:block" />
          <span className="hidden truncate text-[13px] font-medium text-[#0F172A] sm:block">{activeLabel}</span>
        </div>

        {/* Center: nav links (desktop) */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="LMS navigation">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-all",
                  active
                    ? "bg-[#EAF0FA] text-[#0B2E6B]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: user menu + back */}
        <div className="flex shrink-0 items-center gap-2">
          {/* User avatar / menu */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] text-[12px] font-bold text-white transition hover:scale-105"
                aria-label="User menu"
              >
                {getInitials(resolvedIdentity, "U")}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl border border-[#E2E8F0] bg-white py-1 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                  {/* User info */}
                  <div className="border-b border-[#F1F5F9] px-4 py-3">
                    <p className="text-[13px] font-semibold text-[#0F172A] truncate">
                      {resolvedDisplayName || "Learner"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#64748B] truncate">
                      {user.phoneNumber || user.email || ""}
                    </p>
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#374151] transition hover:bg-[#F8FAFC]"
                    >
                      <User className="h-4 w-4 text-[#64748B]" /> Profile
                    </Link>
                    <Link
                      href="/dashboard/courses"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#374151] transition hover:bg-[#F8FAFC]"
                    >
                      <GraduationCap className="h-4 w-4 text-[#64748B]" /> My Courses
                    </Link>
                  </div>
                  <div className="border-t border-[#F1F5F9] py-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-[#EF4444] transition hover:bg-[#FEF2F2]"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Close on outside click */}
              {userMenuOpen && (
                <button
                  type="button"
                  className="fixed inset-0 z-40"
                  aria-hidden="true"
                  onClick={() => setUserMenuOpen(false)}
                />
              )}
            </div>
          )}

        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="flex border-t border-[#F1F5F9] md:hidden">
        {navLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition",
                active ? "text-[#0B2E6B]" : "text-[#94A3B8]",
              )}
            >
              <link.icon className={cn("h-4.5 w-4.5", active && "text-[#0B2E6B]")} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
