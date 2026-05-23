"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

function HeaderBrandMark() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border-[0.5px] border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.12)]">
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <polygon points="14,3 25,9 25,19 14,25 3,19 3,9" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        <polygon
          points="14,8 20,11.5 20,18.5 14,22 8,18.5 8,11.5"
          fill="rgba(139,92,246,0.2)"
          stroke="#a78bfa"
          strokeWidth="1"
        />
        <text x="14" y="17" textAnchor="middle" fontSize="8" fontWeight="700" fill="#f97316" fontFamily="sans-serif">
          GZ
        </text>
      </svg>
    </div>
  );
}

export function Brand({
  className,
  mode = "header",
}: {
  className?: string;
  mode?: "header" | "footer";
}) {
  if (mode === "footer") {
    return (
      <Link
        href="/"
        className={cn("flex w-[178px] min-w-0 items-center sm:w-[206px]", className)}
        aria-label="GenZNext Research and Training"
      >
        <div className="flex min-h-[42px] w-full items-center sm:min-h-[46px]">
          <Image
            src="/genznext-navbar-logo.png"
            alt="GenZNext Research & Training"
            width={380}
            height={88}
            className="h-auto max-h-[46px] w-auto object-contain object-left brightness-110 contrast-110 drop-shadow-[0_0_18px_rgba(251,146,60,0.08)] sm:max-h-[50px]"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn("flex shrink-0 cursor-pointer items-center gap-[10px] whitespace-nowrap", className)}
      aria-label="GenZNext Research and Training"
    >
      <HeaderBrandMark />
      <span className="flex flex-col gap-px">
        <span className="whitespace-nowrap text-[15px] leading-none font-extrabold tracking-[-0.03em] text-[#F1F5F9]">
          Gen<span className="text-[#F97316]">Z</span>Next
        </span>
        <span className="whitespace-nowrap text-[9px] leading-none font-normal tracking-[0.04em] text-[#475569]">
          Research &amp; Training
        </span>
      </span>
    </Link>
  );
}
