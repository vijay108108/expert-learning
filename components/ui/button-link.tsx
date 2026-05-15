import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex touch-manipulation items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300",
        variant === "primary" &&
          "bg-gradient-to-r from-brand-cyan to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30",
        variant === "secondary" &&
          "border border-brand-blue/14 bg-white text-foreground shadow-[0_14px_34px_rgba(11,31,58,0.05)] hover:border-brand-cyan/45 hover:bg-orange-50/60",
        variant === "ghost" &&
          "text-foreground hover:bg-brand-blue/6 hover:text-brand-blue",
        className,
      )}
    >
      {children}
    </Link>
  );
}
