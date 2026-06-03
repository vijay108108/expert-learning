"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/* ── Service Worker registration ── */
function useServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => { /* silent in dev */ });
  }, []);
}

/* ── Install prompt ── */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setDeferredPrompt(null);
    }
  }

  function dismiss() {
    setDismissed(true);
    setDeferredPrompt(null);
  }

  return { canInstall: !!deferredPrompt && !dismissed, install, dismiss };
}

/* ── Install Banner ── */
function InstallBanner() {
  const { canInstall, install, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[300] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-[#C7D2FE] bg-white shadow-[0_16px_40px_rgba(79,70,229,0.2)] sm:bottom-6">
      <div className="flex items-center gap-3 p-4">
        {/* App icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#4F46E5,#2563EB)]">
          <span className="select-none font-sans text-[16px] font-black text-white">GZ</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-[#0F172A]">Install GenZNext App</p>
          <p className="text-[11px] text-[#64748B]">Fast, offline-ready — add to your home screen</p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 rounded-full p-1 text-[#94A3B8] transition hover:text-[#0F172A]"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 border-t border-[#F1F5F9]">
        <button onClick={dismiss} className="py-3 text-[13px] font-medium text-[#94A3B8] transition hover:bg-[#F8FAFC]">
          Not now
        </button>
        <button
          onClick={install}
          className="flex items-center justify-center gap-1.5 border-l border-[#F1F5F9] py-3 text-[13px] font-bold text-[#4F46E5] transition hover:bg-[#EEF2FF]"
        >
          <Download className="h-4 w-4" /> Install
        </button>
      </div>
    </div>
  );
}

/* ── PWA Provider (root) ── */
export function PwaProvider() {
  useServiceWorker();
  return <InstallBanner />;
}
