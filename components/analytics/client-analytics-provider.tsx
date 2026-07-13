"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/client-analytics";
import { initMetaPixel } from "@/lib/meta-pixel";

export function ClientAnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    initMetaPixel();

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    trackPageView();
  }, [pathname, searchParams]);

  return null;
}
