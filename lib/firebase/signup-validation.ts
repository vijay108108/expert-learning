"use client";

import { normalizePhoneForAuth } from "./phone-utils";

type PhoneCheckResponse = {
  success: boolean;
  canProceed?: boolean;
  exists?: boolean;
  passwordEnabled?: boolean;
  message?: string;
  retryAfterSeconds?: number;
};

export type SignupPhoneCheckResult = {
  canProceed: boolean;
  exists: boolean;
  passwordEnabled: boolean;
};

export async function checkSignupPhoneAvailability(phone: string): Promise<SignupPhoneCheckResult> {
  const response = await fetch("/api/auth/phone-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      phone: normalizePhoneForAuth(phone),
    }),
  });

  const payload = (await response.json()) as PhoneCheckResponse;

  if (!response.ok || !payload.success) {
    const error = new Error(payload.message || "Unable to validate the phone number right now.") as Error & {
      retryAfterSeconds?: number;
    };
    error.retryAfterSeconds = payload.retryAfterSeconds;
    throw error;
  }

  return {
    canProceed: payload.canProceed !== false,
    exists: payload.exists === true,
    passwordEnabled: payload.passwordEnabled === true,
  };
}
