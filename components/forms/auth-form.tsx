"use client";

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneAuthFlow } from "@/components/auth/phone-auth-flow";
import { useAuth } from "@/hooks/use-auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady || !user) {
      return;
    }

    router.replace("/dashboard/courses");
  }, [isAuthReady, router, user]);

  if (isAuthReady && user) {
    return null;
  }

  return <PhoneAuthFlow mode={mode} variant="page" redirectTo="/dashboard/courses" />;
}
