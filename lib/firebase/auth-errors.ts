const fallbackMessage = "We couldn't complete the verification. Please try again.";

const errorMessages: Record<string, string> = {
  "auth/invalid-phone-number": "Enter a valid mobile number with the selected country code.",
  "auth/missing-phone-number": "Enter your mobile number to continue.",
  "auth/too-many-requests": "Too many attempts were made. Please wait a little and try again.",
  "auth/invalid-verification-code": "Invalid OTP. Please enter the correct verification code.",
  "auth/invalid-verification-id": "This verification session is no longer valid. Request a fresh OTP and try again.",
  "auth/missing-verification-id": "Verification data is missing. Please request a new OTP.",
  "auth/code-expired": "That OTP has expired. Request a new one and try again.",
  "auth/session-expired": "Your verification session expired. Request a fresh OTP to continue.",
  "auth/quota-exceeded": "OTP requests are temporarily unavailable for this project. Please try again later.",
  "auth/captcha-check-failed":
    "reCAPTCHA could not be completed in this browser. Refresh the page, disable privacy/ad-blocking extensions, and try again.",
  "auth/missing-app-credential":
    "The phone verification could not be started. Refresh the page and try again.",
  "auth/invalid-app-credential":
    "The phone verification request used an invalid or expired app verifier. Please retry the OTP request.",
  "auth/unauthorized-domain":
    "This domain is not authorized for Firebase phone authentication. Add it in Firebase Authentication settings.",
  "auth/operation-not-allowed":
    "Phone authentication is not enabled for this Firebase project yet.",
  "auth/billing-not-enabled":
    "Phone OTP is blocked because billing is not enabled for this Firebase project. In Google Cloud Console: enable billing for this project, then retry OTP.",
  "auth/app-not-authorized":
    "This app or domain is not authorized for Firebase phone authentication. Check Firebase Auth authorized domains.",
  "auth/invalid-api-key":
    "Firebase configuration is invalid. Verify NEXT_PUBLIC_FIREBASE_API_KEY and related public keys.",
  "auth/app-deleted": "The auth session is no longer valid. Refresh the page and try again.",
  "auth/internal-error": "Firebase returned an internal auth error. Please try the request again.",
  "auth/network-request-failed":
    "Google reCAPTCHA or Firebase could not be reached in time. Check your network, disable VPN/ad blockers, and try again.",
  "auth/popup-blocked": "Your browser blocked the verification flow. Please allow popups and try again.",
};

export function getFirebaseAuthErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return fallbackMessage;
  }

  const code = "code" in error ? String((error as { code?: unknown }).code) : "";
  if (code && errorMessages[code]) {
    return errorMessages[code];
  }

  if (error instanceof Error && error.message?.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
