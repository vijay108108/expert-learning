"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const popupTags = ["Azure", "AZ-104", "Cloud Admin", "DevOps", "Live Labs"] as const;
const popupDelayMs = 2400;
const enrollRoute = "/enroll/azure-administrator";

export function SummerTrainingPopup() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const { isAuthReady, openAuthModal, user } = useAuth();

  function handleClose() {
    setOpen(false);
  }

  function handleEnrollClick() {
    if (!isAuthReady) {
      return;
    }

    if (!user) {
      handleClose();
      openAuthModal("signup", enrollRoute);
      return;
    }

    handleClose();
    router.push(enrollRoute);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOpen(true);
    }, popupDelayMs);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.22 }}
          className="fixed inset-0 z-[180] flex items-end justify-center bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.14),rgba(2,6,23,0.72)_46%,rgba(2,6,23,0.86))] px-4 py-5 backdrop-blur-[8px] sm:items-center sm:px-6"
          onClick={handleClose}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.26, ease: "easeOut" }}
            className="relative w-full max-w-[540px] overflow-hidden rounded-[26px] border border-[rgba(251,146,60,0.22)] bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(17,24,39,0.9))] p-5 shadow-[0_24px_72px_rgba(2,6,23,0.48),0_0_0_1px_rgba(255,255,255,0.05)_inset] sm:p-6"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="summer-training-popup-title"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.22),rgba(249,115,22,0)_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),rgba(59,130,246,0)_34%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />

            <button
              type="button"
              onClick={handleClose}
              onPointerDown={(event) => event.stopPropagation()}
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(15,23,42,0.82)] text-[#CBD5E1] transition hover:border-[rgba(251,146,60,0.32)] hover:bg-[rgba(30,41,59,0.92)] hover:text-white"
              aria-label="Close Summer Training popup"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="relative z-10 pr-12 text-center sm:pr-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(251,146,60,0.24)] bg-[rgba(249,115,22,0.1)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FDBA74]">
                <Sparkles className="h-3.5 w-3.5" />
                AZ-104 Summer Batch 2026
              </div>

              <h2
                id="summer-training-popup-title"
                className="mt-4 text-[30px] font-bold leading-[1.02] tracking-[-0.04em] text-[#F8FAFC] sm:text-[38px]"
              >
                Azure Administrator (AZ-104)
              </h2>

              <p className="mx-auto mt-3 max-w-[38ch] text-[14px] leading-6 text-[#CBD5E1] sm:text-[15px]">
                6 Weeks Azure Industrial Training with Internship, Live Labs &amp; Certification Support
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {popupTags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-[12px] font-medium text-[#E2E8F0]"
                  >
                    {tag}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleEnrollClick}
                className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,#F97316,#EA580C)] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_18px_42px_rgba(249,115,22,0.28),0_0_26px_rgba(249,115,22,0.18)] transition hover:scale-[1.01] hover:shadow-[0_24px_56px_rgba(249,115,22,0.36),0_0_34px_rgba(249,115,22,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDBA74] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              >
                Enroll Now
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
