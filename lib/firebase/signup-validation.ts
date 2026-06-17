"use client";

import { normalizePhoneForAuth } from "./phone-utils";

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
  console.log("STEP 2 - Checking user existence", {
    phone,
    normalizedPhone: normalizePhoneForAuth(phone),
  });
  const response = await fetch(`/api/check-phone-exists?phone=${encodeURIComponent(phone)}`, {
    method: "GET",
  });

  const payload = (await response.json()) as PhoneCheckResponse;
  console.log("STEP 3 - User exists result:", payload.exists, {
    success: payload.success,
    normalizedPhone: payload.normalizedPhone || normalizePhoneForAuth(phone),
    source: payload.source || "users",
  });

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Unable to validate the phone number right now.");
  }

  return {
    exists: Boolean(payload.exists),
    normalizedPhone: payload.normalizedPhone || normalizePhoneForAuth(phone),
    source: payload.source || "users",
  };
}
