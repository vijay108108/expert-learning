"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AnimatedCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.6 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const shownValue = reducedMotion && isInView ? value : display;

  useEffect(() => {
    if (!isInView || reducedMotion) {
      return;
    }

    const duration = 1200;
    const start = performance.now();
    const from = 0;
    let animationFrame = 0;

    const frame = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const nextValue = from + (value - from) * progress;
      setDisplay(value % 1 === 0 ? Math.round(nextValue) : Number(nextValue.toFixed(1)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(frame);
      }
    };

    animationFrame = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, reducedMotion, value]);

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-card/80 p-4 backdrop-blur sm:p-5">
      <div className="text-2xl font-semibold text-foreground sm:text-3xl">
        {shownValue}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-muted">{label}</div>
    </div>
  );
}
