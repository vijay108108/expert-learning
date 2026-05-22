"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type AuthActionButtonProps = {
  children: ReactNode;
  className?: string;
  href: string;
  mode?: "login" | "signup";
};

export function AuthActionButton({
  children,
  className,
  href,
  mode = "signup",
}: AuthActionButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthReady, openAuthModal, user } = useAuth();

  function completeAction() {
    const target = href.startsWith("#") ? `${pathname}${href}` : href;
    router.push(target);
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!isAuthReady) {
          return;
        }

        if (!user) {
          openAuthModal(mode, pathname, async () => {
            completeAction();
          });
          return;
        }

        completeAction();
      }}
      className={cn(className)}
    >
      {children}
    </button>
  );
}
