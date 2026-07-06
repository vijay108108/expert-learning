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
          className="fixed inset-0 z-[140] flex items-end justify-center bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),rgba(2,8,23,0.86)_46%,rgba(2,6,23,0.94))] px-4 py-5 backdrop-blur-[10px] sm:items-center sm:px-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: "easeOut" }}
            className="relative w-full max-w-[980px] overflow-hidden rounded-[30px] border border-[rgba(251,146,60,0.28)] bg-[linear-gradient(145deg,rgba(255,251,246,0.98),rgba(255,244,232,0.96))] p-3 shadow-[0_32px_90px_rgba(2,8,23,0.42),0_0_0_1px_rgba(255,255,255,0.25)_inset] sm:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -top-18 -right-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.22),rgba(249,115,22,0))]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.18),rgba(251,146,60,0))]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0))]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.65)] bg-white/88 text-[#7C2D12] shadow-[0_10px_24px_rgba(148,64,0,0.14)] transition hover:border-[#2563EB] hover:bg-[#FFF7ED] hover:text-[#4338CA]"
              aria-label="Close demo booking modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-stretch">
              <div className="rounded-[26px] border border-[rgba(255,255,255,0.1)] bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.24),rgba(251,146,60,0)_28%),linear-gradient(180deg,#111827,#172554)] p-6 text-white shadow-[0_24px_50px_rgba(15,23,42,0.28)] sm:p-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(253,186,116,0.32)] bg-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7C3AED]">
                  <CalendarRange className="h-3.5 w-3.5" />
                  Free Demo & Consultation
                </div>
                <h2 className="mt-5 max-w-[14ch] text-[30px] font-bold leading-[1.05] text-[#f8fafc] sm:text-[38px]">
                  {payload.title || "Book a personalized course walkthrough"}
                </h2>
                <p className="mt-4 max-w-[34ch] text-[15px] leading-7 text-[#dbe4f3]">
                  {payload.description || defaultDescription}
                </p>
                {payload.course && (
                  <div className="mt-5 inline-flex rounded-full border border-[rgba(253,186,116,0.28)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-semibold text-[#fed7aa]">
                    Interested Program: {payload.course}
                  </div>
                )}
                <div className="mt-6 grid gap-3">
                  {[
                    "Live course demo and platform walkthrough",
                    "Batch timing, fees, and career roadmap guidance",
                    "Personalized recommendation based on your background",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] px-4 py-3.5 text-sm leading-6 text-[#f5f9ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px] text-[#cdd7ea]">
                  <div className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
                    Response within 24 hours
                  </div>
                  <div className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
                    Career roadmap included
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-[rgba(234,216,194,0.9)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,251,247,0.96))] p-5 shadow-[0_24px_50px_rgba(124,74,22,0.12)] sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b88a5b]">
                      Tell us about your goal
                    </div>
                    <h3 className="mt-2 text-[24px] font-bold leading-tight text-[#1f2937]">
                      Reserve a free counselling call
                    </h3>
                    <p className="mt-2 max-w-[42ch] text-[14px] leading-6 text-[#6b7280]">
                      Share your contact details and course interest. Our team will reach out on {` `}
                      <span className="font-semibold text-[#9a5a1d]">info@genznext.com</span> workflow and follow up with you directly.
                    </p>
                  </div>
                </div>
                <LeadForm
                  key={`${payload.course || "general"}|${payload.message || "default"}|${payload.source || "demo"}`}
                  includeMessage
                  submitLabel={payload.submitLabel || "Book Free Demo"}
                  source={payload.source || "Book Free Demo Modal"}
                  initialCourse={payload.course || ""}
                  initialMessage={initialMessage}
                  variant="compact"
                  tone="light"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
