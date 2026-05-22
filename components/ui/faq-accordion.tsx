"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Item = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: Item[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div key={item.question} className="overflow-hidden rounded-[18px] border border-[#FB923C]/14 bg-white/[0.07] shadow-[0_18px_40px_rgba(2,8,28,0.36)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setActiveIndex(isActive ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-[14px] font-semibold text-white">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#FDBA74] transition-transform ${isActive ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.12 : 0.25, ease: "easeOut" }}
                >
                  <p className="px-6 pb-6 text-[13px] leading-[1.75] text-[#E2E8F0]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
