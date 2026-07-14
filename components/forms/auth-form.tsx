"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneAuthFlow } from "@/components/auth/phone-auth-flow";
import { useAuth } from "@/hooks/use-auth";

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
    if (!isAuthReady || !user) {
      return;
    }

    router.replace(safeRedirectTo);
  }, [isAuthReady, router, safeRedirectTo, user]);

  if (isAuthReady && user) {
    return null;
  }

  return <PhoneAuthFlow mode={mode} variant="page" redirectTo={safeRedirectTo} />;
}
