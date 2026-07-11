"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoutSuccessToast } from "@/components/auth/logout-success-toast";
import { LmsNavbar } from "@/components/dashboard/lms-navbar";
import { AppShellEnhancements } from "@/components/app-shell-enhancements";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";

function isLmsRoute(pathname: string) {
  return (
    pathname.startsWith("/lms") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/portal") ||
    /^\/courses\/.+\/learn(?:\/|$)/.test(pathname)
  );
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lmsRoute = isLmsRoute(pathname);
  const marketingRoute =
    /^\/(?:about|contact|career|corporate-training|summer-training|blog|workshops)(?:\/|$)/.test(pathname);
  const showShellEnhancements = marketingRoute;
  const showMobileStickyCta = marketingRoute;

  if (lmsRoute) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#f8fafc] text-[#1e293b]">
        <LogoutSuccessToast />
        <LmsNavbar />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <LogoutSuccessToast />
      {showShellEnhancements ? <AppShellEnhancements /> : null}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer reserveMobileCtaSpace={showMobileStickyCta} />
      {showMobileStickyCta ? <MobileStickyCta /> : null}
    </div>
  );
}
