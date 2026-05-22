"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoModalTrigger } from "@/components/demo/demo-modal-trigger";
import { summerTrainingPopupPrograms } from "@/data/summer-training";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function RegistrationPopup() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const storageKey = "summer-training-popup-seen";

    try {
      if (window.sessionStorage.getItem(storageKey) === "true") {
        return;
      }
    } catch {}

    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        window.sessionStorage.setItem(storageKey, "true");
      } catch {}
    }, 3600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.18 }}
          className="fixed inset-0 z-[130] flex items-end justify-center bg-[rgba(0,0,0,0.55)] px-4 py-6 backdrop-blur-[6px] sm:items-center"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
            className="relative w-full max-w-[650px] overflow-hidden rounded-[24px] border border-[rgba(249,115,22,0.14)] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.26)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(249,115,22,0))]" />
            <div className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.22),rgba(251,146,60,0))]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.10),rgba(249,115,22,0))]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FED7AA] bg-white text-[#7C2D12] transition hover:border-[#FB923C] hover:bg-[#FFF7ED] hover:text-[#EA580C]"
              aria-label="Close summer training popup"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#EA580C] shadow-[0_10px_24px_rgba(249,115,22,0.10)]">
                <CalendarRange className="h-3.5 w-3.5" />
                Admissions Open
              </div>
              <h2 className="mt-5 max-w-[520px] text-[28px] font-bold leading-[1.16] text-[#0F172A] sm:text-[32px]">
                <span className="text-[#F97316]">Summer Training 2026</span> Registrations Open
              </h2>
              <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#475569] sm:text-[15px]">
              6 Weeks Summer Industrial Training Program for B.Tech &amp; AKTU Students with guided projects,
              internship support, and mentor-led delivery.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {summerTrainingPopupPrograms.map((program) => (
                <span
                  key={program}
                  className="inline-flex items-center gap-2 rounded-full border border-[#FDBA74] bg-white px-3.5 py-2 text-xs font-semibold text-[#C2410C] shadow-[0_10px_24px_rgba(249,115,22,0.08)] transition duration-200 hover:border-[#F97316] hover:bg-[#F97316] hover:text-white"
                >
                  <Sparkles className="h-3 w-3" />
                  {program}
                </span>
              ))}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href="/courses#azure-programs"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#F97316] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(249,115,22,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#EA580C] hover:shadow-[0_20px_40px_rgba(234,88,12,0.28)]"
                onClick={() => setOpen(false)}
              >
                Register Now
              </Link>
              <DemoModalTrigger
                unstyled
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#FDBA74] bg-white px-5 py-3.5 text-sm font-semibold text-[#EA580C] shadow-[0_10px_24px_rgba(249,115,22,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F97316] hover:bg-[#FFF7ED]"
                course="Azure Administrator Training"
                message="I would like free counseling for Azure Administrator Training."
                source="Summer Training Popup Counseling"
                onClick={() => setOpen(false)}
              >
                Book Free Counseling
              </DemoModalTrigger>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
