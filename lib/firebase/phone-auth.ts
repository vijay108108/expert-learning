"use client";

import { type Auth, RecaptchaVerifier } from "firebase/auth";
import { env } from "@/lib/env";

export const recaptchaContainerId = "recaptcha-container";

let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

export function normalizePhoneForAuth(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }

  return digits;
}

export function isLocalPhoneAuthHost() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function isPhoneAuthTestingEnabled() {
  return env.nextPublicFirebasePhoneAuthTestMode;
}

export function preparePhoneAuth(auth: Auth) {
  auth.settings.appVerificationDisabledForTesting =
    isLocalPhoneAuthHost() && isPhoneAuthTestingEnabled();
}

const retryablePhoneVerificationErrors = new Set([
  "auth/captcha-check-failed",
  "auth/invalid-app-credential",
  "auth/missing-app-credential",
  "auth/network-request-failed",
  "auth/internal-error",
  "auth/unauthorized-domain",
]);

export function isRetryablePhoneVerificationError(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && retryablePhoneVerificationErrors.has(code);
}

function resolveRecaptchaContainer(container?: string | HTMLElement | null) {
  if (typeof window === "undefined") {
    throw new Error("reCAPTCHA can only be initialized in the browser.");
  }

  if (container instanceof HTMLElement) {
    return container;
  }

  const resolvedContainer = document.getElementById(container || recaptchaContainerId);
  if (!resolvedContainer) {
    throw new Error("reCAPTCHA container was not found in the OTP component.");
  }

  return resolvedContainer;
}

export function getRecaptchaVerifier(auth: Auth, container?: string | HTMLElement): RecaptchaVerifier {
  if (recaptchaVerifierInstance) {
    return recaptchaVerifierInstance;
  }

  const resolvedContainer = resolveRecaptchaContainer(container);

  recaptchaVerifierInstance = new RecaptchaVerifier(auth, resolvedContainer, {
    size: "invisible",
    callback: () => {
      /* reCAPTCHA solved */
    },
    "expired-callback": () => {
      /* reCAPTCHA expired */
      clearRecaptcha();
    },
  });

  return recaptchaVerifierInstance;
}

export function clearRecaptcha(container?: string | HTMLElement | null): void {
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch (error) {
      console.warn("[Firebase Phone Auth] reCAPTCHA clear failed", { error });
    }
    recaptchaVerifierInstance = null;
  }

  if (typeof window !== "undefined") {
    const resolvedContainer = container
      ? resolveRecaptchaContainer(container)
      : document.getElementById(recaptchaContainerId);

    if (resolvedContainer) {
      resolvedContainer.innerHTML = "";
    }
  }
}
