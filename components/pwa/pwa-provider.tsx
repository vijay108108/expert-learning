"use client";

import { useEffect } from "react";

function useDisableServiceWorkers() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function disableServiceWorkers() {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }

        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }

        if (
          !cancelled &&
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller &&
          window.sessionStorage.getItem("pwa-cleanup-reloaded") !== "true"
        ) {
          window.sessionStorage.setItem("pwa-cleanup-reloaded", "true");
          window.location.reload();
          return;
        }

        if (!cancelled) {
          window.sessionStorage.removeItem("pwa-cleanup-reloaded");
        }
      } catch {
        // Swallow cleanup errors so the site continues loading normally.
      }
    }

    void disableServiceWorkers();

    return () => {
      cancelled = true;
    };
  }, []);
}

export function PwaProvider() {
  useDisableServiceWorkers();
  return null;
}
