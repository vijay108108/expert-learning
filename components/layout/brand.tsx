"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  mode = "header",
  href = "/",
  imageClassName,
}: {
  className?: string;
  mode?: "header" | "footer";
  href?: string;
  imageClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex min-h-10 shrink-0 cursor-pointer items-center whitespace-nowrap py-0", className)}
      aria-label="GenZNext AI & Cloud Academy"
    >
      <Image
        src="/genznext-navbar-logo.png"
        alt="GenZNext AI & Cloud Academy"
        width={240}
        height={56}
        priority={mode === "header"}
        className={cn(
          "w-auto object-contain drop-shadow-[0_2px_8px_rgba(15,23,42,0.12)]",
          mode === "header" ? "h-10 sm:h-12 lg:h-14" : "h-12 sm:h-14 lg:h-16 opacity-95",
          imageClassName,
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
