"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, UserRound, BookOpenCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSecureLogout } from "@/hooks/use-secure-logout";
import { cn } from "@/lib/utils";

type DashboardMenuProps = {
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  align?: "left" | "right";
  fullWidth?: boolean;
  onNavigate?: () => void;
};

const dashboardItems = [
  {
    href: "/dashboard/courses",
    label: "My Courses",
    icon: BookOpenCheck,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: UserRound,
  },
] as const;

export function DashboardMenu({
  className,
  buttonClassName,
  panelClassName,
  align = "right",
  fullWidth = false,
  onNavigate,
}: DashboardMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const secureLogout = useSecureLogout();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    onNavigate?.();
    await secureLogout();
  }

  function handleNavigate(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  return (
    <div ref={containerRef} className={cn("relative z-[80] isolate overflow-visible", fullWidth && "w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-[18px] text-sm font-medium text-[#0F172A] shadow-[0_4px_14px_rgba(15,23,42,0.05)] transition-all duration-200 hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
          fullWidth && "w-full justify-between",
          buttonClassName,
        )}
      >
        <span>Dashboard</span>
        <ChevronDown className={cn("h-4 w-4 text-[#64748B] transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: "easeOut" }}
            className={cn(
              "absolute top-[110%] z-[9999] pointer-events-auto",
              fullWidth ? "left-0 right-0" : "min-w-[200px]",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            <div
              role="menu"
              className={cn(
                "min-w-[240px] overflow-hidden rounded-[18px] border border-[rgba(226,232,240,0.9)] bg-[rgba(255,255,255,0.96)] p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-[16px]",
                panelClassName,
              )}
            >
              {dashboardItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    role="menuitem"
                    className={cn(
                      "relative z-10 flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] px-[14px] text-left text-sm text-[#0F172A] transition-all duration-200 ease-out pointer-events-auto",
                      active
                        ? "bg-[rgba(99,102,241,0.10)] font-semibold text-[#0B2E6B]"
                        : "hover:bg-[rgba(99,102,241,0.08)] hover:text-[#0B2E6B]",
                    )}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon className={cn("h-[15px] w-[15px] transition-colors duration-200", active ? "text-[#0B2E6B]" : "text-[#64748B]")} />
                      {item.label}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-55" />
                  </button>
                );
              })}

              <div className="my-2 h-px bg-[#E2E8F0]" />

              <button
                type="button"
                onClick={() => void handleLogout()}
                role="menuitem"
                className="relative z-10 flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-[12px] px-[14px] text-sm text-[#0F172A] transition-all duration-200 pointer-events-auto hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="h-[15px] w-[15px] text-[#64748B]" />
                Logout
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
