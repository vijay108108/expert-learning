"use client";

import { getPhoneLookupCandidates, normalizePhoneForAuth } from "./phone-utils";

type PhoneCheckResponse = {
  success: boolean;
  exists: boolean;
  message?: string;
  normalizedPhone?: string;
  source?: string;
};

export type SignupPhoneCheckResult = {
  exists: boolean;
  normalizedPhone: string;
  source: string;
};

export async function checkSignupPhoneAvailability(phone: string): Promise<SignupPhoneCheckResult> {
  const response = await fetch("/api/auth/phone-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      candidates: getPhoneLookupCandidates(phone),
      normalizedPhone: normalizePhoneForAuth(phone),
    }),
  });

  const payload = (await response.json()) as PhoneCheckResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Unable to validate the phone number right now.");
  }

  return {
    exists: Boolean(payload.exists),
    normalizedPhone: payload.normalizedPhone || normalizePhoneForAuth(phone),
    source: payload.source || "users",
  };
}
