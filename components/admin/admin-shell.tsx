"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenCheck,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Layers,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
  Megaphone,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/layout/brand";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const nav = [
  {
    section: "Dashboard",
    items: [
      { label: "Overview",      href: "/admin",              icon: LayoutDashboard },
    ],
  },
  {
    section: "Learners",
    items: [
      { label: "Users",         href: "/admin/users",        icon: Users },
      { label: "Enrollments",   href: "/admin/enrollments",  icon: GraduationCap },
    ],
  },
  {
    section: "Content (CMS)",
    items: [
      { label: "Course Catalog",href: "/admin/catalog",      icon: BookOpenCheck },
      { label: "LMS Courses",   href: "/admin/courses",      icon: BookOpenCheck },
      { label: "LMS Content",   href: "/admin/lms",          icon: Layers },
    ],
  },
  {
    section: "CMS Pages",
    items: [
      { label: "Blog Posts",    href: "/admin/cms/blog",     icon: MessageSquare },
      { label: "Programs",      href: "/admin/cms/programs", icon: Megaphone },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Leads",         href: "/admin/leads",        icon: MessageSquare },
      { label: "Payments",      href: "/admin/payments",     icon: CreditCard },
      { label: "Invoices",      href: "/admin/invoices",     icon: FileText },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings",      href: "/admin/settings",     icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, signOutUser } = useAuth();

  async function handleSignOut() {
    try { await signOutUser(); } catch { /* ignore */ }
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col bg-[#0D1117] text-white">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="rounded-lg bg-white/95 px-1.5 py-1">
            <Brand
              href="/admin"
              className="min-h-0 py-0"
            />
          </span>
          <div className="leading-none">
            <p className="text-[10px] text-[#F58220]">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#64748B] hover:text-white md:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {nav.map((group) => (
          <div key={group.section} className="mb-4 px-3">
            <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-[#475569]">
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
                    active
                      ? "bg-[#0B2E6B]/20 text-[#818CF8]"
                      : "text-[#64748B] hover:bg-white/5 hover:text-[#E2E8F0]",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", active ? "text-[#818CF8]" : "text-[#475569]")} />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#818CF8]" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/8 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-white">{user?.displayName || "Admin"}</p>
            <p className="truncate text-[10px] text-[#475569]">{user?.email || user?.phoneNumber || ""}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#475569] transition hover:bg-white/5 hover:text-[#EF4444]"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <Link
          href="/"
          target="_blank"
          className="mt-2 flex items-center gap-1.5 text-[11px] text-[#334155] transition hover:text-[#64748B]"
        >
          ← Back to main site
        </Link>
      </div>
    </div>
  );
}

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { signOutUser } = useAuth();

  // Build breadcrumb
  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: "/" + arr.slice(0, i + 1).join("/"),
    }));

  return (
    <div className="flex h-screen overflow-hidden bg-[#060B14]">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 overflow-y-auto md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-56">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-[56px] shrink-0 items-center justify-between border-b border-white/6 bg-[#0D1117] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-[#475569] hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumb */}
            <nav className="hidden items-center gap-1 text-[12px] sm:flex">
              {crumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-[#334155]" />}
                  <Link
                    href={crumb.href}
                    className={cn(
                      "transition",
                      i === crumbs.length - 1 ? "font-semibold text-[#E2E8F0]" : "text-[#475569] hover:text-[#94A3B8]",
                    )}
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-[#334155]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0B2E6B]" />
              Admin
            </span>
            <button
              type="button"
              onClick={async () => {
                try { await signOutUser(); } catch { /* ignore */ }
                window.location.href = "/";
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-[#64748B] transition hover:border-red-900/40 hover:bg-red-900/10 hover:text-[#EF4444]"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#060B14] px-4 py-6 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
              {subtitle && <p className="mt-1 text-[13px] text-[#64748B]">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
