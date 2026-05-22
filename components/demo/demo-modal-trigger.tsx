"use client";

import type { MouseEvent, ReactNode } from "react";
import { buttonLinkClasses, type ButtonLinkVariant } from "@/components/ui/button-link";
import { useAuth } from "@/hooks/use-auth";
import { demoModalEventName, type DemoModalPayload } from "@/lib/demo-modal";
import { usePathname } from "next/navigation";

type DemoModalTriggerProps = DemoModalPayload & {
  children: ReactNode;
  className?: string;
  variant?: ButtonLinkVariant;
  unstyled?: boolean;
  onClick?: () => void;
};

export function DemoModalTrigger({
  children,
  className,
  variant = "secondary",
  unstyled = false,
  onClick,
  ...detail
}: DemoModalTriggerProps) {
  const pathname = usePathname();
  const { isAuthReady, openAuthModal, user } = useAuth();

  function openDemo() {
    onClick?.();
    window.dispatchEvent(new CustomEvent<DemoModalPayload>(demoModalEventName, { detail }));
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!isAuthReady) {
      return;
    }

    if (!user) {
      openAuthModal("signup", pathname, async () => {
        openDemo();
      });
      return;
    }

    openDemo();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={unstyled ? className : buttonLinkClasses(variant, className)}
    >
      {children}
    </button>
  );
}
