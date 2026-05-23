"use client";

import { ButtonLink } from "@/components/ui/button-link";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-blue/15 bg-white/96 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_20px_rgba(0,45,122,0.08)] backdrop-blur md:hidden">
      <ButtonLink href="/courses" variant="amber" className="w-full">
        Enroll Now
      </ButtonLink>
    </div>
  );
}
