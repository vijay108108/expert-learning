"use client";

import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────
   GenZNext Logo Mark — original SVG
   Three ascending circuit nodes on an L-shaped PCB trace.
   Uses React useId() to avoid duplicate SVG gradient ids.
───────────────────────────────────────────────────────── */

function BrandMark({ size = 36, radius = 9 }: { size?: number; radius?: number }) {
  const uid  = useId().replace(/:/g, "");
  const grad = `gz-grad-${uid}`;
  const glow = `gz-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#9333EA" />
          <stop offset="52%"  stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="38" height="38" rx={radius} fill={`url(#${grad})`} />

      {/* PCB trace */}
      <path
        d="M 9.5 28.5 L 9.5 19 L 19 19 L 19 9.5 L 28.5 9.5"
        stroke="white" strokeWidth="1.6" strokeLinecap="round"
        strokeLinejoin="round" strokeOpacity="0.32" fill="none"
      />

      {/* Node 1 — Foundation */}
      <circle cx="9.5"  cy="28.5" r="3"   fill="white" opacity="0.52" />
      {/* Node 2 — Growth */}
      <circle cx="19"   cy="19"   r="4"   fill="white" opacity="0.72" />
      {/* Node 3 — Mastery: halo + solid */}
      <circle cx="28.5" cy="9.5"  r="8.5" stroke="white" strokeWidth="0.9" strokeOpacity="0.15" fill="none" />
      <circle cx="28.5" cy="9.5"  r="6.2" stroke="white" strokeWidth="0.7" strokeOpacity="0.22" fill="none" />
      <circle cx="28.5" cy="9.5"  r="4.5" fill="white" filter={`url(#${glow})`} />
      {/* Junction dots */}
      <circle cx="9.5"  cy="19"   r="1.1" fill="white" opacity="0.5" />
      <circle cx="19"   cy="9.5"  r="1.1" fill="white" opacity="0.5" />
    </svg>
  );
}

function Wordmark({ dark = false }: { dark?: boolean }) {
  const nameColor = dark ? "#FFFFFF" : "#111827";
  const subColor  = dark ? "#64748B" : "#6B7280";
  return (
    <span className="flex flex-col gap-[3px]">
      <span style={{
        fontSize: "15px", fontWeight: 800, letterSpacing: "-0.038em",
        lineHeight: 1, color: nameColor, whiteSpace: "nowrap", userSelect: "none",
      }}>
        Gen
        <span style={{
          background: "linear-gradient(135deg,#9333EA 0%,#4F46E5 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", fontWeight: 900,
        }}>Z</span>
        Next
      </span>
      <span style={{
        fontSize: "8.5px", fontWeight: 600, letterSpacing: "0.1em",
        lineHeight: 1, color: subColor, whiteSpace: "nowrap",
        textTransform: "uppercase", userSelect: "none",
      }}>
        Research &amp; Training
      </span>
    </span>
  );
}

export function Brand({
  className,
  mode = "header",
}: {
  className?: string;
  mode?: "header" | "footer";
}) {
  return (
    <Link
      href="/"
      className={cn("flex min-h-11 shrink-0 cursor-pointer items-center gap-[10px] whitespace-nowrap py-1", className)}
      aria-label="GenZNext Research and Training"
    >
      <BrandMark size={36} radius={9} />
      <Wordmark dark={mode === "footer"} />
    </Link>
  );
}

export function BrandIcon({ size = 38 }: { size?: number }) {
  return <BrandMark size={size} radius={Math.round(size * 0.26)} />;
}
