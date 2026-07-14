"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneAuthFlow } from "@/components/auth/phone-auth-flow";
import { useAuth } from "@/hooks/use-auth";

const forgotPasswordFlowStorageKey = "genznext-forgot-password-flow-active";

function isForgotPasswordFlowActive() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(forgotPasswordFlowStorageKey) === "1";
}

function getSafeRedirectPath(redirectTo?: string) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/lms/my-learning";
  }

  return redirectTo;
}

export function AuthForm({ mode, redirectTo }: { mode: "login" | "signup"; redirectTo?: string }) {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const safeRedirectTo = getSafeRedirectPath(redirectTo);

  useEffect(() => {
    if (!isAuthReady || !user || isForgotPasswordFlowActive()) {
      return;
    }

    router.replace(safeRedirectTo);
  }, [isAuthReady, router, safeRedirectTo, user]);

  if (isAuthReady && user && !isForgotPasswordFlowActive()) {
    return null;
  }

  return <PhoneAuthFlow mode={mode} variant="page" redirectTo={safeRedirectTo} />;
}
