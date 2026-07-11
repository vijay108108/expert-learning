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
    "inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
    variant === "primary" &&
      "bg-[linear-gradient(135deg,#5B5BF6_0%,#15407E_100%)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_18px_36px_rgba(37,99,235,0.3)]",
    variant === "secondary" &&
      "border border-[#E5E7EB] bg-white text-[#111827] shadow-[0_8px_20px_rgba(17,24,39,0.06)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#C8D7EE] hover:bg-[#EAF0FA] hover:text-[#092552]",
    variant === "outline" &&
      "border border-[#E5E7EB] bg-white text-[#111827] shadow-[0_8px_20px_rgba(17,24,39,0.06)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#C8D7EE] hover:bg-[#EAF0FA] hover:shadow-[0_14px_28px_rgba(37,99,235,0.14)]",
    variant === "gradient" &&
      "bg-[linear-gradient(135deg,#5B5BF6_0%,#15407E_100%)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_18px_36px_rgba(37,99,235,0.3)]",
    variant === "navGhost" &&
      "border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13px] text-[#0B2E6B] shadow-[0_8px_20px_rgba(17,24,39,0.05)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#0B2E6B] hover:bg-[#EAF0FA]",
    variant === "navPrimary" &&
      "bg-[linear-gradient(135deg,#5B5BF6_0%,#15407E_100%)] px-4 py-2.5 text-[13px] text-white shadow-[0_12px_26px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_18px_34px_rgba(37,99,235,0.3)]",
    variant === "amber" &&
      "bg-[linear-gradient(135deg,#5B5BF6_0%,#15407E_100%)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_18px_36px_rgba(37,99,235,0.3)]",
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
