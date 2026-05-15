import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex min-w-0 items-center gap-3 sm:gap-3.5",
        compact ? "flex-none" : "w-full max-w-[236px] xl:max-w-[248px]",
        className,
      )}
    >
      <div className="relative shrink-0 rounded-[20px] border border-white/80 bg-white p-1.5 shadow-[0_16px_42px_rgba(11,31,58,0.08)] sm:p-1.5">
        <Image
          src="/expert-learning-icon.svg"
          alt="Expert Learning EL icon"
          width={compact ? 48 : 54}
          height={compact ? 48 : 54}
          sizes={compact ? "48px" : "(max-width: 640px) 44px, 54px"}
          className={cn(
            "block h-auto w-auto object-contain",
            compact ? "size-12" : "size-[44px] sm:size-12 lg:size-[54px]",
          )}
          priority
        />
      </div>
      {!compact && (
        <div className="min-w-0 flex-1 self-center">
          <span className="block whitespace-nowrap font-heading text-[0.78rem] font-black leading-none tracking-[0.2em] text-brand-blue sm:text-[0.9rem] lg:text-[1rem]">
            EXPERT LEARNING
          </span>
          <span className="mt-1.5 block whitespace-nowrap text-[9.5px] font-medium leading-[1.25] text-slate-500/95 sm:text-[10.5px] lg:text-[11px]">
            Powered by Netseems Ventures Pvt Ltd
          </span>
        </div>
      )}
    </Link>
  );
}
