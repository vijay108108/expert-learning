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
      className={cn("flex min-h-11 shrink-0 cursor-pointer items-center whitespace-nowrap py-1", className)}
      aria-label="GenZNext Research and Training"
    >
      <Image
        src="/genznext-navbar-logo.png"
        alt="GenZNext Research and Training"
        width={300}
        height={90}
        priority={mode === "header"}
        className={cn(
          "h-10 w-auto object-contain",
          mode === "footer" && "opacity-95",
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
