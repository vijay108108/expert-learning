"use client";

import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export function AppShellEnhancements() {
  return (
    <>
      <ScrollProgress />
      <FloatingWhatsApp />
    </>
  );
}
