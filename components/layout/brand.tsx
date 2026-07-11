"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      className={cn("flex min-h-12 shrink-0 cursor-pointer items-center whitespace-nowrap py-0.5", className)}
      aria-label="GenZNext Research and Training"
    >
      <Image
        src="/genznext-navbar-logo.png"
        alt="GenZNext Research and Training"
        width={1254}
        height={1254}
        priority={mode === "header"}
        className={cn(
          "w-auto object-contain drop-shadow-[0_2px_8px_rgba(15,23,42,0.12)]",
          mode === "header" ? "h-12 md:h-14" : "h-14 md:h-16 opacity-95",
        )}
      />
    </Link>
  );
}

export function BrandIcon({ size = 38 }: { size?: number }) {
  return (
    <Image
      src="/icon-192.png"
      alt="GenZNext"
      width={size}
      height={size}
      className="rounded-md"
    />
  );
}
