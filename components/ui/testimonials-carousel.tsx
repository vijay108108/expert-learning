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
    <div className="glass-panel overflow-hidden rounded-[32px] border border-border p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-brand-cyan">
          <Quote className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((current) => (current - 1 + items.length) % items.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:border-brand-blue/30 hover:text-brand-blue"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % items.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:border-brand-blue/30 hover:text-brand-blue"
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
          <p className="text-xl leading-9 text-foreground sm:text-2xl">{active.review}</p>
          <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple font-heading text-lg font-semibold text-white">
                {active.initials}
              </div>
              <div>
                <div className="font-semibold text-foreground">{active.name}</div>
                <div className="text-sm text-muted">
                  {active.role} at {active.company}
                </div>
              </div>
            </div>
            <div className="rounded-full border border-brand-cyan/20 bg-orange-50 px-4 py-2 text-sm font-semibold text-brand-cyan">
              {active.salaryHike}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
