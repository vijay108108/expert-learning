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
  { label: "Courses",  href: "/courses",          prefixes: ["/courses", "/aws", "/azure", "/ai", "/genai", "/devsecops", "/agentic-ai"] },
  { label: "Programs", href: "/programs",         prefixes: ["/programs", "/corporate-training"] },
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
  const { isAuthReady, openAuthModal, user } = useAuth();
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
        "sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md transition-shadow duration-200",
        scrolled && "shadow-[0_4px_20px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">

        {/* Brand */}
        <Brand className="pr-0" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:ml-10 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(pathname, item.prefixes);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-all duration-150",
                  active
                    ? "text-[#4F46E5]"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#4F46E5]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-2 md:flex">
          {/* WhatsApp quick link */}
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[12px] font-semibold text-[#16A34A] transition hover:border-[#16A34A]/30 hover:bg-[#F0FDF4]"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>

          {isAuthed ? (
            <DashboardMenu />
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal("login", "/")}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup", "/")}
                className="rounded-lg bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] transition hover:shadow-[0_6px_20px_rgba(99,102,241,0.38)] hover:scale-[1.02]"
              >
                Get Started
              </button>
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
          {navItems.map((item) => {
            const active = isActive(pathname, item.prefixes);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-[#EEF2FF] font-semibold text-[#4F46E5]"
                    : "font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                )}
              >
                {item.label}
              </Link>
            );
          })}

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
                <button
                  type="button"
                  onClick={() => { openAuthModal("login", "/"); setMobileOpen(false); }}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { openAuthModal("signup", "/"); setMobileOpen(false); }}
                  className="rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-3 py-2.5 text-sm font-semibold text-white"
                >
                  Get Started
                </button>
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
