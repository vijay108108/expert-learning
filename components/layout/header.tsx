"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/layout/brand";
import { DashboardMenu } from "@/components/layout/dashboard-menu";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home",     href: "/",                prefixes: ["/"] },
  { label: "Programs", href: "/programs",         prefixes: ["/programs", "/corporate-training"] },
  { label: "Courses",  href: "/courses",          prefixes: ["/courses"] },
  { label: "About",    href: "/about",            prefixes: ["/about"] },
  { label: "Contact",  href: "/contact",          prefixes: ["/contact"] },
] as const;

function isActive(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((p) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/"),
  );
}

export function Header() {
  const pathname = usePathname() ?? "";
  const { isAuthReady, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuPath, setMobileMenuPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const isAuthed = isAuthReady && Boolean(user);

  const isMobileMenuOpen = mobileOpen && mobileMenuPath === pathname;

  /* Shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm transition-[background-color,box-shadow,backdrop-filter,border-color] duration-200 ease-out",
        scrolled && "bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 pl-4 pr-4 sm:pl-5 sm:pr-5 md:h-[74px] md:pl-6 md:pr-6 lg:h-[82px] lg:pl-6 lg:pr-8">

        {/* Brand */}
        <Brand className="items-center" />

        {/* Desktop nav */}
        {isAuthed ? (
          <div className="hidden items-center justify-center md:flex">
            <Link
              href="/dashboard/courses"
              className="rounded-lg border border-[#D7E2F3] bg-[#EAF0FA] px-4 py-2 text-[13px] font-semibold text-[#0B2E6B] transition hover:border-[#0B2E6B]/40"
            >
              Go to LMS
            </Link>
          </div>
        ) : (
          <nav className="hidden items-center justify-center gap-1 pl-4 md:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(pathname, item.prefixes);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-[16px] font-semibold transition-colors duration-200 ease-out lg:text-[17px]",
                    active
                      ? "text-[#0B2E6B]"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#0B2E6B]" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Desktop right */}
        <div className="hidden items-center justify-end gap-2.5 md:flex">
          {/* WhatsApp quick link */}
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 text-[13px] font-semibold text-[#16A34A] transition-colors duration-200 ease-out hover:border-[#16A34A]/30 hover:bg-[#F0FDF4]"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>

          {isAuthed ? (
            <DashboardMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-lg px-4 text-[14px] font-semibold text-[#475569] transition-colors duration-200 ease-out hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                SignIn
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-[46px] items-center rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(11,46,107,0.28)] transition-[box-shadow,transform] duration-200 ease-out hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(11,46,107,0.34)]"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => {
            if (isMobileMenuOpen) {
              setMobileOpen(false);
              return;
            }
            setMobileMenuPath(pathname);
            setMobileOpen(true);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] md:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-[#E2E8F0] bg-white transition-all duration-200 ease-out md:hidden",
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="space-y-0.5 px-4 pb-4 pt-2">
          {!isAuthed
            ? navItems.map((item) => {
                const active = isActive(pathname, item.prefixes);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-xl px-3 py-2.5 text-sm transition-all",
                      active
                        ? "bg-[#EAF0FA] font-semibold text-[#0B2E6B]"
                        : "font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })
            : (
              <Link
                href="/dashboard/courses"
                onClick={() => setMobileOpen(false)}
                className="mb-2 flex items-center justify-center rounded-xl border border-[#D7E2F3] bg-[#EAF0FA] px-3 py-2.5 text-sm font-semibold text-[#0B2E6B]"
              >
                Open LMS Dashboard
              </Link>
            )}

          <div className="mt-3 border-t border-[#F1F5F9] pt-3">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2.5 text-sm font-semibold text-[#16A34A]"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
            {!isAuthed ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
                >
                  SignIn
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-3 py-2.5 text-sm font-semibold text-white"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <DashboardMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
