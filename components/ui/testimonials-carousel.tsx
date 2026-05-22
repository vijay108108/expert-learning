"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Testimonial = {
  name: string;
  initials: string;
  role: string;
  company: string;
  salaryHike: string;
  review: string;
};

export function TestimonialsCarousel({
  items,
}: {
  items: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [items.length]);

  const active = items[index];

  return (
    <div className="surface-card overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#F97316]/18 text-[#FDBA74]">
          <Quote className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((current) => (current - 1 + items.length) % items.length)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-[#FB923C] hover:bg-white/10 hover:text-[#FDBA74]"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % items.length)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-[#FB923C] hover:bg-white/10 hover:text-[#FDBA74]"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.name}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
          transition={{ duration: reducedMotion ? 0.18 : 0.35, ease: "easeOut" }}
          className="mt-8"
        >
          <p className="text-lg leading-8 text-white sm:text-xl">{active.review}</p>
          <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#F97316,#FB923C)] text-sm font-semibold text-white">
                {active.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{active.name}</div>
                <div className="text-[12px] text-[#E2E8F0]">
                  {active.role} at {active.company}
                </div>
              </div>
            </div>
            <div className="rounded-full border border-[#FB923C]/28 bg-[#F97316]/12 px-4 py-2 text-[12px] font-semibold text-[#FDBA74]">
              {active.salaryHike}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
