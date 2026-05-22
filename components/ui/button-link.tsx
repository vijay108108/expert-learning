import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "gradient" | "navGhost" | "navPrimary" | "amber";
  onClick?: () => void;
};

export type ButtonLinkVariant = NonNullable<ButtonLinkProps["variant"]>;

export function buttonLinkClasses(
  variant: ButtonLinkVariant = "primary",
  className?: string,
) {
  return cn(
    "inline-flex touch-manipulation items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200",
    variant === "primary" &&
      "bg-[linear-gradient(135deg,#F97316,#FB923C)] text-white shadow-[0_12px_30px_rgba(249,115,22,0.32),0_0_22px_rgba(251,146,60,0.14)] hover:-translate-y-0.5 hover:bg-[#EA580C] hover:shadow-[0_18px_40px_rgba(234,88,12,0.36),0_0_28px_rgba(251,146,60,0.18)]",
    variant === "secondary" &&
      "border border-[#FB923C]/38 bg-white text-[#F97316] shadow-[0_10px_24px_rgba(249,115,22,0.08)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#EA580C]",
    variant === "outline" &&
      "border border-[#FB923C]/38 bg-white text-[#F97316] shadow-[0_8px_24px_rgba(249,115,22,0.08)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#F97316] hover:bg-[#FFF7ED] hover:shadow-[0_14px_28px_rgba(249,115,22,0.16)]",
    variant === "gradient" &&
      "bg-[linear-gradient(135deg,#F97316,#FB923C)] text-white shadow-[0_12px_30px_rgba(249,115,22,0.32),0_0_22px_rgba(251,146,60,0.14)] hover:-translate-y-0.5 hover:bg-[#EA580C] hover:shadow-[0_18px_40px_rgba(234,88,12,0.36),0_0_28px_rgba(251,146,60,0.18)]",
    variant === "navGhost" &&
      "border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-4 py-2.5 text-[13px] text-white shadow-[0_12px_26px_rgba(2,8,28,0.22),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#FB923C]/44 hover:bg-white/12 hover:shadow-[0_16px_32px_rgba(249,115,22,0.14),inset_0_1px_0_rgba(255,255,255,0.08)]",
    variant === "navPrimary" &&
      "bg-[linear-gradient(135deg,#F97316,#FB923C)] px-4 py-2.5 text-[13px] text-white shadow-[0_14px_30px_rgba(249,115,22,0.32),0_0_22px_rgba(251,146,60,0.16)] hover:-translate-y-0.5 hover:bg-[#EA580C] hover:shadow-[0_20px_38px_rgba(234,88,12,0.36),0_0_28px_rgba(251,146,60,0.2)]",
    variant === "amber" &&
      "bg-[linear-gradient(135deg,#F97316,#FB923C)] text-white shadow-[0_12px_30px_rgba(249,115,22,0.32),0_0_22px_rgba(251,146,60,0.14)] hover:-translate-y-0.5 hover:bg-[#EA580C] hover:shadow-[0_18px_40px_rgba(234,88,12,0.36),0_0_28px_rgba(251,146,60,0.18)]",
    className,
  );
}

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
      className={buttonLinkClasses(variant, className)}
    >
      {children}
    </Link>
  );
}
