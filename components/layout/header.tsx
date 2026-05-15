"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { courseCategories } from "@/data/courses";
import { navCourseLinks } from "@/data/site";
import { Brand } from "@/components/layout/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const secondaryNav = [
  ...navCourseLinks,
  { label: "Corporate Training", href: "/corporate-training" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[96px] items-center justify-between gap-3 rounded-[28px] border border-white/75 bg-white/86 px-3.5 py-4 shadow-[0_18px_40px_rgba(11,31,58,0.08)] backdrop-blur-2xl sm:min-h-[104px] sm:gap-4 sm:px-6 sm:py-[1.15rem]">
          <div className="min-w-0 shrink xl:basis-[248px]">
            <Brand />
          </div>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 xl:flex xl:px-2 2xl:gap-2">
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[13px] font-semibold text-foreground transition duration-300 hover:bg-brand-blue/6 hover:text-brand-blue 2xl:px-4 2xl:text-sm"
              >
                Courses
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute left-1/2 top-full mt-4 w-[760px] -translate-x-1/2 translate-y-2 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-[30px] border border-white/80 bg-white p-5 shadow-[0_28px_70px_rgba(11,31,58,0.14)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-cyan">
                        Explore Tracks
                      </div>
                      <div className="mt-1 text-lg font-semibold text-foreground">
                        Certification pathways built for modern tech careers
                      </div>
                    </div>
                    <Link href="/courses" className="text-sm font-semibold text-brand-blue">
                      View all courses
                    </Link>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {courseCategories.map((category) => (
                      <Link
                        key={category.key}
                        href={category.href}
                        className="rounded-[24px] border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-brand-cyan/30 hover:shadow-[0_20px_44px_rgba(11,31,58,0.08)]"
                      >
                        <div
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white",
                            "bg-gradient-to-r",
                            category.gradient,
                          )}
                        >
                          {category.title}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {secondaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2.5 text-[13px] font-medium text-foreground transition duration-300 hover:bg-brand-blue/6 hover:text-brand-blue 2xl:px-4 2xl:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center justify-end gap-2.5 lg:flex xl:basis-[206px]">
            <ButtonLink
              href="/contact"
              variant="ghost"
              className="rounded-full px-3.5 py-2.5 text-[13px] font-semibold text-brand-blue hover:bg-brand-blue/6 2xl:px-4 2xl:text-sm"
            >
              Login
            </ButtonLink>
            <ButtonLink
              href="/contact"
              className="rounded-[15px] bg-gradient-to-r from-[#F97316] via-[#FB7C1B] to-[#F59E0B] px-[1.125rem] py-[0.72rem] text-[13px] shadow-[0_12px_24px_rgba(249,115,22,0.16)] hover:shadow-[0_16px_28px_rgba(249,115,22,0.2)] 2xl:px-5 2xl:text-sm"
            >
              Sign Up
            </ButtonLink>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition duration-300 hover:border-brand-cyan/40 xl:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: "easeOut" }}
              className="mt-3 rounded-[30px] border border-white/75 bg-white px-5 py-5 shadow-[0_22px_60px_rgba(11,31,58,0.12)] xl:hidden"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">
                  Navigation
                </span>
                <span className="rounded-full bg-brand-blue/6 px-3 py-1 text-xs font-semibold text-brand-blue">
                  Explore
                </span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/courses"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-brand-blue/6"
                >
                  All Courses
                </Link>
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-brand-blue/6"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <ButtonLink
                  href="/contact"
                  variant="ghost"
                  className="w-full rounded-[16px] border border-border bg-white px-4 py-3 text-brand-blue shadow-[0_12px_24px_rgba(11,31,58,0.05)] hover:bg-brand-blue/6"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  className="w-full rounded-[16px] bg-gradient-to-r from-[#F97316] via-[#FB7C1B] to-[#F59E0B] px-4 py-3 shadow-[0_12px_24px_rgba(249,115,22,0.16)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </ButtonLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
