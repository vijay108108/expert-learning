"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  IconArrowRight,
  IconBrain,
  IconBrandAzure,
  IconCloud,
  IconSettingsAutomation,
} from "@tabler/icons-react";
import { ChevronDown, LogOut, Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Brand } from "@/components/layout/brand";
import { coursesByCategory } from "@/data/courses";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSecureLogout } from "@/hooks/use-secure-logout";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "AWS", href: "/courses/aws" },
  { label: "Azure", href: "/courses/azure" },
  { label: "AI", href: "/courses/ai" },
  { label: "DevOps", href: "/courses/devops" },
  { label: "Corporate", href: "/corporate-training" },
] as const;

const megaMenuCards = [
  {
    title: "AWS Courses",
    description: "Certification pathways for cloud foundations, architecture, operations, and DevOps delivery.",
    href: "/courses/aws",
    category: "aws",
    badge: "5 Programs",
    accent: {
      hover: "hover:border-[rgba(249,115,22,0.3)] hover:bg-[rgba(249,115,22,0.04)]",
      icon: "border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.12)] text-[#F97316]",
      badge: "bg-[rgba(249,115,22,0.1)] text-[#FB923C]",
    },
    Icon: IconCloud,
  },
  {
    title: "Azure Courses",
    description: "Microsoft-aligned certification tracks across administration, security, DevOps, and architecture.",
    href: "/courses/azure",
    category: "azure",
    badge: "5 Programs",
    accent: {
      hover: "hover:border-[rgba(59,130,246,0.3)] hover:bg-[rgba(59,130,246,0.04)]",
      icon: "border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.12)] text-[#60A5FA]",
      badge: "bg-[rgba(59,130,246,0.1)] text-[#60A5FA]",
    },
    Icon: IconBrandAzure,
  },
  {
    title: "AI Courses",
    description: "Modern AI programs covering machine learning, Generative AI, MLOps, and analytics applications.",
    href: "/courses/ai",
    category: "ai",
    badge: "4 Programs",
    accent: {
      hover: "hover:border-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.04)]",
      icon: "border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.12)] text-[#A78BFA]",
      badge: "bg-[rgba(139,92,246,0.1)] text-[#A78BFA]",
    },
    Icon: IconBrain,
  },
  {
    title: "DevOps Courses",
    description: "Hands-on DevOps pathways for containers, CI/CD, monitoring, automation, and platform workflows.",
    href: "/courses/devops",
    category: "devops",
    badge: "4 Programs",
    accent: {
      hover: "hover:border-[rgba(16,185,129,0.3)] hover:bg-[rgba(16,185,129,0.04)]",
      icon: "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.12)] text-[#34D399]",
      badge: "bg-[rgba(16,185,129,0.1)] text-[#34D399]",
    },
    Icon: IconSettingsAutomation,
  },
] as const;

const megaMenuQuickLinks = [
  {
    title: "Summer Training 2026",
    description: "Live classes · July batch open",
    href: "/summer-training",
    icon: "☀️",
  },
  {
    title: "Corporate Training",
    description: "Team & enterprise plans",
    href: "/corporate-training",
    icon: "🏢",
  },
  {
    title: "All Certifications",
    description: "Browse full catalog",
    href: "/courses",
    icon: "🏆",
  },
] as const;

function Divider() {
  return <div className="hidden h-[26px] w-px bg-[rgba(255,255,255,0.07)] lg:block" aria-hidden="true" />;
}

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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { count: cartCount, hydrated: cartHydrated } = useCart();
  const { isAuthReady, openAuthModal, user } = useAuth();
  const secureLogout = useSecureLogout();
  const coursesTriggerRef = useRef<HTMLDivElement | null>(null);
  const coursesDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchOverlayRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const isAuthed = isAuthReady && Boolean(user);
  const initials = useMemo(
    () => getUserInitials(user?.displayName || user?.email || user?.phoneNumber),
    [user?.displayName, user?.email, user?.phoneNumber],
  );

  const searchSuggestions = useMemo(
    () => [
      { label: "AWS Solutions Architect", href: "/courses/aws" },
      { label: "Azure Administrator AZ-104", href: "/courses/azure" },
      { label: "AI & Machine Learning", href: "/courses/ai" },
      { label: "Docker & Kubernetes", href: "/courses/devops" },
    ],
    [],
  );

  function executeSearch(query: string) {
    const trimmed = query.trim();
    router.push(trimmed ? `/courses?search=${encodeURIComponent(trimmed)}` : "/courses");
    setSearchOpen(false);
    setMobileOpen(false);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeSearch(searchValue);
  }

  function handleCoursesMenuNavigation(href: string) {
    setCoursesOpen(false);
    router.push(href);
  }

  useEffect(() => {
    if (!coursesOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const clickedTrigger = coursesTriggerRef.current?.contains(target);
      const clickedDropdown = coursesDropdownRef.current?.contains(target);

      if (!clickedTrigger && !clickedDropdown) {
        setCoursesOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCoursesOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [coursesOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const focusTimeout = window.setTimeout(() => searchInputRef.current?.focus(), 50);

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (!searchOverlayRef.current?.contains(target)) {
        setSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(focusTimeout);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.07)] bg-[#0D1117]">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] min-w-0 items-center gap-[10px] overflow-hidden px-4 sm:px-8">
        <Brand className="mr-1 self-center" />
        <Divider />

        <Link
          href="/#summer-training"
          className="hidden shrink-0 self-center whitespace-nowrap rounded-full border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] px-[10px] py-[3px] text-[11px] font-medium text-[#FB923C] transition-all duration-150 ease-in-out hover:border-[rgba(249,115,22,0.3)] hover:bg-[rgba(249,115,22,0.14)] lg:inline-flex"
        >
          Summer 2026
        </Link>

        <Divider />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden h-[34px] w-[34px] shrink-0 items-center justify-center self-center rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#475569] transition-all duration-150 ease-in-out hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#94A3B8] lg:inline-flex"
          aria-label="Search courses"
        >
          <Search className="h-[15px] w-[15px]" />
        </button>

        <nav className="hidden min-w-0 shrink-0 items-center self-center gap-[10px] overflow-hidden whitespace-nowrap lg:flex">
          <div ref={coursesTriggerRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setCoursesOpen((value) => !value)}
              className={cn(
                "pointer-events-auto relative z-[60] shrink-0 cursor-pointer whitespace-nowrap rounded-[7px] px-[10px] py-[5px] text-[13px] transition-all duration-150 ease-in-out",
                coursesOpen
                  ? "bg-[rgba(249,115,22,0.08)] text-[#F97316]"
                  : pathname === "/courses"
                    ? "bg-[rgba(249,115,22,0.08)] text-[#F97316]"
                    : "text-[#64748B] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#94A3B8]",
              )}
              aria-expanded={coursesOpen}
              aria-controls="courses-mega-menu"
            >
              <span className="inline-flex items-center gap-1">
                Courses
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", coursesOpen ? "rotate-180" : "rotate-0")}
                />
              </span>
              {!coursesOpen && pathname === "/courses" ? (
                <span className="pointer-events-none absolute bottom-[-18px] left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-[2px] bg-[#F97316]" aria-hidden="true" />
              ) : null}
            </button>
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-[7px] px-[10px] py-[5px] text-[13px] transition-all duration-150 ease-in-out",
                  active
                    ? "bg-[rgba(249,115,22,0.08)] text-[#F97316]"
                    : "text-[#64748B] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#94A3B8]",
                )}
              >
                {item.label}
                {active ? (
                  <span className="pointer-events-none absolute bottom-[-18px] left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-[2px] bg-[#F97316]" aria-hidden="true" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <Link
          href="/cart"
          className="relative hidden h-[34px] w-[34px] shrink-0 items-center justify-center self-center rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#64748B] transition-all duration-150 ease-in-out hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#94A3B8] lg:inline-flex"
          aria-label="My cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {cartHydrated && cartCount > 0 ? (
            <span className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full border-[1.5px] border-[#0D1117] bg-[#F97316] px-1 text-[10px] font-semibold leading-4 text-white">
              {cartCount}
            </span>
          ) : null}
        </Link>

        {isAuthed ? (
          <>
            <Link
              href="/dashboard"
              className="hidden h-[34px] w-[34px] shrink-0 items-center justify-center self-center rounded-[8px] border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.15)] text-[13px] font-semibold text-[#A78BFA] transition-all duration-150 ease-in-out hover:border-[rgba(139,92,246,0.42)] hover:bg-[rgba(139,92,246,0.2)] lg:inline-flex"
              aria-label="Open dashboard"
            >
              {initials}
            </Link>
            <button
              type="button"
              onClick={() => void secureLogout()}
              className="hidden shrink-0 self-center whitespace-nowrap rounded-[8px] border-0 bg-[#F97316] px-[14px] py-[6px] text-[12px] font-medium text-white transition-all duration-150 ease-in-out hover:bg-[#EA580C] lg:inline-flex"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("login", pathname)}
            className="hidden min-w-[68px] shrink-0 self-center whitespace-nowrap rounded-[8px] border border-[rgba(255,255,255,0.12)] bg-transparent px-4 py-[7px] text-[13px] text-[#94A3B8] transition-all duration-150 ease-in-out hover:border-[rgba(255,255,255,0.2)] hover:text-[#F1F5F9] lg:inline-flex lg:items-center lg:justify-center"
          >
            Login
          </button>
        )}

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center self-center rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#94A3B8] transition-all duration-150 ease-in-out hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#F1F5F9] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      <AnimatePresence>
        {coursesOpen ? (
          <motion.div
            id="courses-mega-menu"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.15, ease: "easeOut" }}
            className="pointer-events-auto absolute top-16 right-0 left-0 z-[100] hidden w-full lg:block"
          >
            <div
              ref={coursesDropdownRef}
              className="border-t-[0.5px] border-b-[0.5px] border-t-[rgba(255,255,255,0.05)] border-b-[rgba(255,255,255,0.07)] bg-[#0f1623] px-8 pt-5 pb-6 shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
            >
              <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_220px] gap-4">
                <div className="grid grid-cols-2 gap-2">
                  {megaMenuCards.map((item) => {
                    const courses = coursesByCategory[item.category];

                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleCoursesMenuNavigation(item.href)}
                        className={cn(
                          "flex cursor-pointer flex-col gap-[10px] rounded-[12px] border-[0.5px] border-transparent bg-[rgba(255,255,255,0.02)] p-[14px] text-left transition-all duration-150 ease-in-out",
                          item.accent.hover,
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border", item.accent.icon)}>
                            <item.Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[#F1F5F9]">{item.title}</div>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-[1.45] text-[#64748B]">{item.description}</p>
                          </div>
                        </div>

                        <div className="grid gap-1">
                          {courses.map((course, index) => {
                            const popular = index === 0;

                            return (
                              <div key={course.slug} className="flex items-center gap-2">
                                <span className={cn("h-1 w-1 rounded-full", popular ? "bg-[#F97316]" : "bg-[#334155]")} />
                                <span className={cn("line-clamp-1 text-[11px]", popular ? "text-[#64748B]" : "text-[#475569]")}>
                                  {course.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <span className={cn("rounded-full px-2 py-[2px] text-[10px]", item.accent.badge)}>{item.badge}</span>
                          <IconArrowRight size={13} className="text-[#334155]" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-[10px] border-[0.5px] border-[rgba(249,115,22,0.15)] bg-[linear-gradient(135deg,rgba(249,115,22,0.08),rgba(139,92,246,0.06))] p-[14px]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#F97316]">🔥 Summer Special</div>
                  <div className="mt-3 text-[13px] font-semibold text-[#F1F5F9]">Summer Training 2026</div>
                  <p className="mt-2 text-[11px] leading-[1.55] text-[#64748B]">
                    Live mentor-led training with practical cloud labs and career-ready project guidance.
                  </p>
                  <div className="mt-4 space-y-2 text-[11px]">
                    <div className="text-[#34D399]">✓ Azure Administrator (AZ-104)</div>
                    <div className="text-[#475569]">○ More courses coming soon</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCoursesMenuNavigation("/summer-training")}
                    className="mt-5 rounded-[6px] bg-[#F97316] px-[14px] py-[6px] text-[11px] font-semibold text-white transition hover:bg-[#EA580C]"
                  >
                    View Summer Batch →
                  </button>
                </div>
              </div>

              <div className="mx-auto my-[14px] h-px max-w-[1400px] bg-[rgba(255,255,255,0.05)]" />

              <div className="mx-auto grid max-w-[1400px] grid-cols-3 gap-2">
                {megaMenuQuickLinks.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleCoursesMenuNavigation(item.href)}
                    className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border-[0.5px] border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] px-[14px] py-3 text-left transition-all duration-150 ease-in-out hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.04)]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.04)] text-[15px]">
                      {item.icon}
                    </span>
                    <span>
                      <span className="block text-[12px] font-medium text-[#94A3B8]">{item.title}</span>
                      <span className="block text-[11px] text-[#475569]">{item.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.14 }}
            className="fixed inset-0 z-[200] flex items-start justify-center bg-[rgba(0,0,0,0.6)] px-4 pt-[15vh] backdrop-blur-[4px]"
          >
            <motion.div
              ref={searchOverlayRef}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.16, ease: "easeOut" }}
              className="w-full max-w-[560px] rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[#111827] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
            >
              <form onSubmit={handleSearchSubmit}>
                <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4">
                  <Search className="h-5 w-5 shrink-0 text-[#475569]" />
                  <input
                    ref={searchInputRef}
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search AWS, Azure, AI, DevOps courses..."
                    className="h-full w-full bg-transparent text-[16px] text-[#F1F5F9] outline-none placeholder:text-[#475569]"
                    aria-label="Search courses"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-[#64748B] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-[#94A3B8]"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </label>
              </form>

              <div className="mt-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155]">
                  Suggested searches
                </div>
                <div className="space-y-1">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.href + item.label}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchValue(item.label);
                        router.push(item.href);
                      }}
                      className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-[13px] text-[#94A3B8] transition hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F1F5F9]"
                    >
                      <span>{item.label}</span>
                      <IconArrowRight size={14} className="text-[#334155]" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.15, ease: "easeOut" }}
            className="border-t border-[rgba(255,255,255,0.07)] bg-[#0D1117] lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Link
                  href="/#summer-training"
                  onClick={() => setMobileOpen(false)}
                  className="shrink-0 rounded-full border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] px-[10px] py-[3px] text-[11px] font-medium text-[#FB923C]"
                >
                  Summer 2026
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="relative inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#64748B]"
                  aria-label="My cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartHydrated && cartCount > 0 ? (
                    <span className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full border-[1.5px] border-[#0D1117] bg-[#F97316] px-1 text-[10px] font-semibold leading-4 text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#475569]"
                  aria-label="Search courses"
                >
                  <Search className="h-[15px] w-[15px]" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5">
                <Link
                  href="/courses"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-[8px] px-3 py-2.5 text-sm transition-all duration-150 ease-in-out",
                    pathname === "/courses"
                      ? "bg-[rgba(249,115,22,0.08)] text-[#F97316]"
                      : "text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F1F5F9]",
                  )}
                >
                  Courses
                </Link>
                {navItems.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-[8px] px-3 py-2.5 text-sm transition-all duration-150 ease-in-out",
                        active
                          ? "bg-[rgba(249,115,22,0.08)] text-[#F97316]"
                          : "text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F1F5F9]",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4">
                {isAuthed ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.15)] text-sm font-medium text-[#A78BFA]"
                  >
                    {initials}
                    Dashboard
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal("login", pathname);
                      setMobileOpen(false);
                    }}
                    className="inline-flex h-10 w-full items-center justify-center rounded-[8px] border border-[rgba(255,255,255,0.12)] bg-transparent text-sm text-[#94A3B8] transition-all duration-150 ease-in-out hover:border-[rgba(255,255,255,0.2)] hover:text-[#F1F5F9]"
                  >
                    Login
                  </button>
                )}
              </div>

              {isAuthed ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      void secureLogout();
                      setMobileOpen(false);
                    }}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-[#F97316] px-[14px] text-sm font-medium text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
