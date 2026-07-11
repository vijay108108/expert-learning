"use client";

import { useEffect } from "react";

export function PwaProvider() {
  useEffect(() => {
    let cancelled = false;

    async function cleanupStalePwaState() {
      // This app is not actively running a service worker. If users still have
      // one from older deployments, it can serve stale HTML/chunks and cause
      // hydration/chunk-load errors. Clean it up once on app load.
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));
      }

      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if (!cancelled) {
        // no-op: explicit guard for future stateful logic
      }
    }

    void cleanupStalePwaState();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
