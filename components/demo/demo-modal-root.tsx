"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LeadForm } from "@/components/forms/lead-form";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { demoModalEventName, type DemoModalPayload } from "@/lib/demo-modal";

const defaultDescription =
  "Share your details and our team will reach out with the right roadmap, demo details, and course guidance.";

export function DemoModalRoot() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<DemoModalPayload>({});
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function handleOpen(event: Event) {
      const customEvent = event as CustomEvent<DemoModalPayload>;
      setPayload(customEvent.detail || {});
      setOpen(true);
    }

    window.addEventListener(demoModalEventName, handleOpen as EventListener);
    return () => window.removeEventListener(demoModalEventName, handleOpen as EventListener);
  }, []);

  const initialMessage = useMemo(() => {
    if (payload.message) {
      return payload.message;
    }

    if (payload.course) {
      return `I would like to book a free demo for ${payload.course}.`;
    }

    return "I would like to book a free demo and consultation.";
  }, [payload.course, payload.message]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.18 }}
          className="fixed inset-0 z-[140] flex items-end justify-center bg-[rgba(0,0,0,0.55)] px-4 py-5 backdrop-blur-[8px] sm:items-center sm:px-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: "easeOut" }}
            className="relative w-full max-w-[850px] overflow-hidden rounded-[24px] border border-[#FF7B22]/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(255,247,237,0.99))] p-4 shadow-[0_28px_80px_rgba(2,8,28,0.34)] sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -top-14 -right-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,123,34,0.18),rgba(255,123,34,0))]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.12),rgba(251,146,60,0))]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FED7AA] bg-white text-[#7C2D12] transition hover:border-[#FB923C] hover:bg-[#FFF7ED] hover:text-[#EA580C]"
              aria-label="Close demo booking modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
              <div className="rounded-[22px] border border-[#FFEDD5] bg-[linear-gradient(180deg,#FFFDFB,#FFF7ED)] p-5 shadow-[0_16px_36px_rgba(249,115,22,0.08)] sm:p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FED7AA] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#EA580C]">
                <CalendarRange className="h-3.5 w-3.5" />
                Free Demo & Consultation
                </div>
                <h2 className="mt-4 text-[24px] font-bold leading-[1.18] text-[#07142B] sm:text-[28px]">
                  {payload.title || "Book a personalized course walkthrough"}
                </h2>
                <p className="mt-3 text-[14px] leading-7 text-slate-600">
                  {payload.description || defaultDescription}
                </p>
                {payload.course && (
                  <div className="mt-4 inline-flex rounded-full border border-[#FDBA74] bg-white px-3.5 py-2 text-xs font-semibold text-[#C2410C] shadow-[0_10px_24px_rgba(249,115,22,0.08)]">
                    Interested Program: {payload.course}
                  </div>
                )}
                <div className="mt-5 space-y-3">
                  {[
                    "Live course demo and platform walkthrough",
                    "Batch timing, fees, and career roadmap guidance",
                    "Personalized recommendation based on your background",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[16px] border border-[#FFEDD5] bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#FB923C]/12 bg-white/94 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-5">
                <LeadForm
                  key={`${payload.course || "general"}|${payload.message || "default"}|${payload.source || "demo"}`}
                  includeMessage
                  submitLabel={payload.submitLabel || "Book Free Demo"}
                  source={payload.source || "Book Free Demo Modal"}
                  initialCourse={payload.course || ""}
                  initialMessage={initialMessage}
                  variant="compact"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
