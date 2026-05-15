"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.18 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out will-change-transform motion-reduce:transform-none motion-reduce:transition-none",
        (isInView || reducedMotion) ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: reducedMotion ? "0ms" : `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
}
