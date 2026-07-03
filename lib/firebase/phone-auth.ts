"use client";

import { type Auth, RecaptchaVerifier } from "firebase/auth";
import { env } from "@/lib/env";

export const recaptchaContainerId = "recaptcha-container";

export { normalizePhoneForAuth } from "./phone-utils";

let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

export function isLocalPhoneAuthHost() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function isIpAddressHost(hostname: string) {
  if (!hostname) {
    return false;
  }

  // IPv4
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
    return true;
  }

  // Basic IPv6/loopback detection for bracketless browser hostnames.
  return hostname === "::1" || hostname.includes(":");
}

export function isPhoneAuthTestingEnabled() {
  return env.nextPublicFirebasePhoneAuthTestMode;
}

export function preparePhoneAuth(auth: Auth) {
  auth.settings.appVerificationDisabledForTesting =
    isLocalPhoneAuthHost() && isPhoneAuthTestingEnabled();
}

export function getPhoneAuthEnvironmentError() {
  if (typeof window === "undefined") {
    return null;
  }

  const { hostname, protocol } = window.location;

  if (isLocalPhoneAuthHost()) {
    if (!isPhoneAuthTestingEnabled()) {
      return "Real Firebase phone OTP is not supported on localhost. Use Google sign-in, deploy to your real domain, or enable Firebase test phone auth for local development.";
    }

    return null;
  }

  if (isIpAddressHost(hostname)) {
    return `Real Firebase phone OTP should be opened on your real website domain, not the raw server IP (${hostname}). Open the site on https://genznext.com or another Firebase-authorized domain.`;
  }

  if (protocol !== "https:" || !window.isSecureContext) {
    return "Real Firebase phone OTP requires a secure HTTPS website domain. Open the site on its real HTTPS domain and try again.";
  }

  return null;
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
