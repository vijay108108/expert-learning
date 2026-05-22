"use client";

import { type Auth, RecaptchaVerifier } from "firebase/auth";

export const recaptchaContainerId = "recaptcha-container";

let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

function getRecaptchaContainer() {
  if (typeof window === "undefined") {
    throw new Error("reCAPTCHA can only be initialized in the browser.");
  }

  const container = document.getElementById(recaptchaContainerId);
  if (!container) {
    throw new Error("reCAPTCHA container was not found in the OTP component.");
  }

  return container;
}

export function getRecaptchaVerifier(auth: Auth): RecaptchaVerifier {
  if (recaptchaVerifierInstance) {
    return recaptchaVerifierInstance;
  }

  getRecaptchaContainer();

  recaptchaVerifierInstance = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
    callback: () => {
      console.log("[Firebase Phone Auth] reCAPTCHA solved");
    },
    "expired-callback": () => {
      console.log("[Firebase Phone Auth] reCAPTCHA expired");
      clearRecaptcha();
    },
  });

  return recaptchaVerifierInstance;
}

export function clearRecaptcha(): void {
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch (error) {
      console.warn("[Firebase Phone Auth] reCAPTCHA clear failed", { error });
    }
    recaptchaVerifierInstance = null;
  }

  if (typeof window !== "undefined") {
    const container = document.getElementById(recaptchaContainerId);
    if (container) {
      container.innerHTML = "";
    }
  }
}
