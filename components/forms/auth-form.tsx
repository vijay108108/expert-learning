"use client";

import { PhoneAuthFlow } from "@/components/auth/phone-auth-flow";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  return <PhoneAuthFlow mode={mode} variant="page" redirectTo="/dashboard/courses" />;
}
