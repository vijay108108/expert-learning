"use client";

import {
  type ConfirmationResult,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  type RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  type User,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buttonLinkClasses } from "@/components/ui/button-link";
import { useAuth } from "@/hooks/use-auth";
import {
  type AppUserProfile,
  clearRecaptcha,
  getFirebaseAuth,
  getFirebaseAuthErrorMessage,
  getFirebaseDb,
  getRecaptchaVerifier,
  getPhoneAuthEnvironmentError,
  getUserProfile,
  isFirebaseConfigured,
  isLocalPhoneAuthHost,
  normalizePhoneForAuth,
  preparePhoneAuth,
  recaptchaContainerId,
  finalizePhoneSignupReservation,
  releasePhoneSignupReservation,
  saveUserWhatsappNumber,
  reservePhoneSignup,
  checkSignupPhoneAvailability,
  upsertGoogleUserProfile,
} from "@/lib/firebase";
import { cn } from "@/lib/utils";

const otpLength = 6;
const resendWindowSeconds = 30;
const phoneOtpRequestTimeoutMs = 30000;
const otpValiditySeconds = 600; // 10 minutes

function formatOtpCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type AuthStep = "phone" | "otp" | "google-phone";
type AuthTab = "password-login" | "signup";
type ForgotPasswordStep = "phone" | "otp" | "reset";
type SignupStep = "form" | "otp";

type PhoneAuthFlowProps = {
  mode: "login" | "signup";
  variant?: "modal" | "page";
  redirectTo?: string;
  onSuccess?: () => boolean | Promise<boolean>;
  onClose?: () => void;
  onPendingChange?: (pending: boolean) => void;
};

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function formatPhoneForOtp(phone: string, countryCode: string) {
  const trimmed = phone.trim();
  const digits = normalizePhone(trimmed);

  if (countryCode === "+91") {
    return `+${normalizePhoneForAuth(trimmed)}`;
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  return `${countryCode}${digits}`;
}

function getLegacyPhoneAuthCandidates(phone: string) {
  const digits = normalizePhone(phone);
  const normalized = normalizePhoneForAuth(phone);
  const candidates = [normalized];

  if (digits.length === 10) {
    candidates.push(digits);
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    candidates.push(digits.slice(2));
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

function getFakeEmail(rawPhone: string) {
  const normalizedPhone = normalizePhoneForAuth(rawPhone);
  return `${normalizedPhone}@genznext.app`;
}

function isPhonePasswordAccount(user: User, phone: string, existingProfile?: AppUserProfile | null) {
  if (existingProfile?.authMethod === "password") {
    return true;
  }

  if (user.providerData.some((provider) => provider.providerId === "password")) {
    return true;
  }

  return (user.email || "").trim().toLowerCase() === getFakeEmail(phone).toLowerCase();
}

function getErrorCode(error: unknown): string {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return "";
  }

  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : "";
}

function maskPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) {
    return value;
  }

  const countryPrefix = value.startsWith("+91") ? "+91 " : "";
  const lastFour = digits.slice(-4);
  return `${countryPrefix}XXXXXX${lastFour}`;
}

function getInitialTab(mode: PhoneAuthFlowProps["mode"]): AuthTab {
  return mode === "signup" ? "signup" : "password-login";
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string) {
  let timer: number | null = null;

  const timeout = new Promise<T>((_, reject) => {
    timer = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  return Promise.race([
    promise.finally(() => {
      if (timer) {
        window.clearTimeout(timer);
      }
    }),
    timeout,
  ]) as Promise<T>;
}

export function PhoneAuthFlow({
  mode,
  variant = "modal",
  redirectTo = "/",
  onSuccess,
  onClose,
  onPendingChange,
}: PhoneAuthFlowProps) {
  const router = useRouter();
  const { user, isAuthReady, setSuppressAutoRedirect } = useAuth();
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaHostRef = useRef<HTMLDivElement | null>(null);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const loginPhoneInputRef = useRef<HTMLInputElement | null>(null);
  const loginPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const signupOtpSectionRef = useRef<HTMLDivElement | null>(null);
  const sendOtpLockRef = useRef(false);
  const verifyOtpLockRef = useRef(false);
  const passwordLoginThrottleRef = useRef(0);
  const passwordResetThrottleRef = useRef(0);
  const autoVerifyRef = useRef<string | null>(null);
  const googleUserIdRef = useRef<string | null>(null);

  const [activeTab, setActiveTab] = useState<AuthTab>(() => getInitialTab(mode));
  const [countryCode, setCountryCode] = useState("+91");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  /* Billing / GST fields (optional, signup only) */
  const [showBilling, setShowBilling]         = useState(false);
  const [billingCompany, setBillingCompany]   = useState("");
  const [billingGst, setBillingGst]           = useState("");
  const [billingAddress, setBillingAddress]   = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array.from({ length: otpLength }, () => ""));
  const [step, setStep] = useState<AuthStep>("phone");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(0);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [googlePhone, setGooglePhone] = useState("");
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("phone");
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showSignupGoToLogin, setShowSignupGoToLogin] = useState(false);
  const [signupLookupPending, setSignupLookupPending] = useState(false);

  useEffect(() => {
    /* Confirming the forgot-password OTP signs the user into Firebase Auth as
       a side effect, which would otherwise trigger AuthProvider's global
       "user is signed in, close modal and redirect to dashboard" effect
       before the Create New Password step gets a chance to render. */
    setSuppressAutoRedirect(isForgotPasswordMode);
    return () => setSuppressAutoRedirect(false);
  }, [isForgotPasswordMode, setSuppressAutoRedirect]);

  const firebaseReady = isFirebaseConfigured();
  const firebaseSetupKeys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
    "NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE",
  ] as const;
  const otpCode = otp.join("");
  const isModal = variant === "modal";
  const formattedPhone = useMemo(() => formatPhoneForOtp(phone, countryCode), [countryCode, phone]);
  const maskedPhone = useMemo(() => maskPhoneNumber(formattedPhone), [formattedPhone]);
  const normalizedPhone = useMemo(() => normalizePhoneForAuth(phone), [phone]);
  const formattedGooglePhone = useMemo(() => {
    const raw = googlePhone.trim();
    if (!raw) {
      return "";
    }

    if (raw.startsWith("+")) {
      return `${raw.slice(0, 1)}${normalizePhone(raw)}`;
    }

    return `${countryCode}${normalizePhone(raw)}`;
  }, [countryCode, googlePhone]);
  const titleText = useMemo(() => {
    if (step === "google-phone") {
      return "Complete your profile";
    }

    if (activeTab === "signup") {
      return "Create your account";
    }

    if (activeTab === "password-login" && isForgotPasswordMode) {
      return "Reset your password";
    }

    return "Log in to GenZNext";
  }, [activeTab, isForgotPasswordMode, step]);
  const subtitleText = useMemo(() => {
    if (step === "google-phone") {
      return "Add your WhatsApp number so we can share batch updates and joining links.";
    }

    if (activeTab === "signup") {
      return "Create your mobile account with password-based access.";
    }

    if (activeTab === "password-login" && isForgotPasswordMode) {
      return "Verify your number and set a fresh password.";
    }

    if (activeTab === "password-login") {
      return "Use your mobile number and password to continue.";
    }

    return "Join 6,000+ students already learning on GenZNext";
  }, [activeTab, isForgotPasswordMode, step]);

  const fieldClass = cn(
    "w-full h-[50px] rounded-[14px] border px-3 text-[14px] outline-none transition",
    isModal
      ? "border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0B2E6B] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]"
      : "border-[#cbd5e1] bg-white text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#0B2E6B] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]",
  );
  const prefixShellClass = cn(
    "flex h-[50px] overflow-hidden rounded-[14px] border transition",
    isModal
      ? "border-[#CBD5E1] bg-white focus-within:border-[#0B2E6B] focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]"
      : "border-[#cbd5e1] bg-white focus-within:border-[#0B2E6B] focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]",
  );
  const prefixLabelClass = cn(
    "inline-flex items-center border-r px-3 text-[13px] font-medium",
    isModal
      ? "border-[#E2E8F0] text-[#475569]"
      : "border-[#e2e8f0] text-[#475569]",
  );
  const prefixInputClass = cn(
    "min-w-0 flex-1 bg-transparent px-3 text-[14px] outline-none",
    isModal ? "text-[#0F172A] placeholder:text-[#94A3B8]" : "text-[#0f172a] placeholder:text-[#94a3b8]",
  );
  const labelClass = cn("form-label", isModal ? "text-[#64748B]" : "text-[#E2E8F0]");

  const getSanitizedErrorMessage = useCallback((code: string, fallback = "We couldn't complete your request. Please try again.") => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found. Please sign up.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/too-many-requests":
        return "Too many attempts. Try later.";
      case "auth/invalid-verification-code":
        return "Invalid OTP. Please try again.";
      case "auth/code-expired":
      case "auth/session-expired":
        return "OTP expired. Please request a new OTP.";
      default:
        return fallback;
    }
  }, []);

  const setStepError = useCallback((message: string, targetStep: AuthStep = step) => {
    if (targetStep === "otp") {
      setOtpError(message);
      setFeedback(null);
      return;
    }

    setFeedback(message);
    setOtpError(null);
  }, [step]);

  const clearStepErrors = useCallback(() => {
    setFeedback(null);
    setOtpError(null);
  }, []);

  const clearAllFeedback = useCallback(() => {
    clearStepErrors();
    setSuccessMessage(null);
    setShowSignupGoToLogin(false);
  }, [clearStepErrors]);

  const resetOtpInputs = useCallback((focusFirstInput = false) => {
    setOtp(Array.from({ length: otpLength }, () => ""));
    autoVerifyRef.current = null;

    if (focusFirstInput) {
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 40);
    }
  }, []);

  const clearResetState = useCallback(() => {
    setIsForgotPasswordMode(false);
    setForgotPasswordStep("phone");
    setResetUser(null);
    setResetPasswordValue("");
    setResetConfirmPassword("");
    setShowResetPassword(false);
    setShowResetConfirmPassword(false);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setResendTimer((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const tick = () => {
      const remaining = otpExpiresAt
        ? Math.max(0, Math.round((otpExpiresAt - Date.now()) / 1000))
        : 0;
      setOtpRemainingSeconds(remaining);
      if (otpExpiresAt && remaining <= 0) {
        confirmationResultRef.current = null;
      }
    };

    const initialTickTimer = window.setTimeout(tick, 0);

    if (!otpExpiresAt) {
      return () => window.clearTimeout(initialTickTimer);
    }

    const interval = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(initialTickTimer);
      window.clearInterval(interval);
    };
  }, [otpExpiresAt]);

  useEffect(() => {
    if (rateLimitSeconds <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setRateLimitSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [rateLimitSeconds]);

  useEffect(() => {
    onPendingChange?.(pending);
  }, [onPendingChange, pending]);

  useEffect(() => {
    const recaptchaHost = recaptchaHostRef.current;

    return () => {
      clearRecaptcha(recaptchaHost);
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const logFirebaseAuthError = useCallback((_stage: string, _error: unknown) => {
    void _stage;
    void _error;
    // Intentionally no-op in production UI layer to avoid leaking auth internals.
  }, []);

  const createRecaptchaMountPoint = useCallback(() => {
    const host = recaptchaHostRef.current;

    if (!host) {
      throw new Error("reCAPTCHA container was not found in the OTP component.");
    }

    host.innerHTML = "";

    const mountPoint = document.createElement("div");
    mountPoint.id = `${recaptchaContainerId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    host.appendChild(mountPoint);

    return mountPoint;
  }, []);

  function validatePhone() {
    const digits = normalizePhone(phone);

    if (digits.length < 8 || digits.length > 14) {
      return "Enter a valid mobile number to continue.";
    }

    return null;
  }

  function validateIndianPhone() {
    if (!/^91\d{10}$/.test(normalizedPhone)) {
      return "Enter a valid 10-digit mobile number.";
    }

    return null;
  }

  const finishAuthSuccess = useCallback(async (message = "Login successful!") => {
    setSuccessMessage(message);
    clearRecaptcha(recaptchaHostRef.current);
    recaptchaVerifierRef.current = null;

    window.setTimeout(async () => {
      const handledRedirect = await onSuccess?.();
      onClose?.();
      if (handledRedirect !== true) {
        router.push(redirectTo);
      }
    }, 1000);
  }, [onClose, onSuccess, redirectTo, router]);

  async function ensureSignupPhoneCanRequestOtp() {
    const phoneCheck = await checkSignupPhoneAvailability(formattedPhone);
    if (phoneCheck.canProceed) {
      return true;
    }

    clearRecaptcha(recaptchaHostRef.current);
    recaptchaVerifierRef.current = null;
    confirmationResultRef.current = null;
    setFeedback("An account already exists with this number. Please log in instead.");
    setShowSignupGoToLogin(true);
    setSignupStep("form");
    setStep("phone");
    resetOtpInputs();
    return false;
  }

  async function lookupPhoneAccount(phoneValue: string) {
    const result = await checkSignupPhoneAvailability(phoneValue);
    return {
      exists: result.exists || !result.canProceed,
      passwordEnabled: result.passwordEnabled,
    };
  }

  async function sendOtp(isResend = false) {
    if (sendOtpLockRef.current) {
      return;
    }

    const validationMessage = validatePhone();

    if (validationMessage) {
      setStepError(validationMessage, isResend ? "otp" : "phone");
      return;
    }

    if (!getFirebaseAuth()) {
      setStepError(
        "Firebase authentication is not configured yet. Add the Firebase public keys to enable login.",
      );
      return;
    }

    if (activeTab === "signup" && !isResend) {
      try {
        const canRequestOtp = await ensureSignupPhoneCanRequestOtp();
        if (!canRequestOtp) {
          return;
        }
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "retryAfterSeconds" in error &&
          typeof error.retryAfterSeconds === "number" &&
          error.retryAfterSeconds > 0
        ) {
          setRateLimitSeconds(error.retryAfterSeconds);
        }

        setStepError(
          error instanceof Error && error.message
            ? error.message
            : "Unable to validate this phone number right now. Please try again.",
          "phone",
        );
        return;
      }
    }

    sendOtpLockRef.current = true;
    setPending(true);
    clearStepErrors();
    setSuccessMessage(null);

    try {
      for (let attempt = 0; attempt < 1; attempt += 1) {
        const auth = getFirebaseAuth();
        if (!auth) {
          throw new Error("Firebase auth is not available.");
        }

        const environmentError = getPhoneAuthEnvironmentError();
        if (environmentError) {
          setStepError(environmentError);
          return;
        }

        preparePhoneAuth(auth);

        clearRecaptcha(recaptchaHostRef.current);
        recaptchaVerifierRef.current = null;
        const recaptchaMountPoint = createRecaptchaMountPoint();

        const verifier = getRecaptchaVerifier(auth, recaptchaMountPoint);
        recaptchaVerifierRef.current = verifier;

        try {
          confirmationResultRef.current = await withTimeout(
            signInWithPhoneNumber(auth, formattedPhone, verifier),
            phoneOtpRequestTimeoutMs,
            "OTP request timed out. Please try again.",
          );
          setStep("otp");
          setOtpError(null);
          resetOtpInputs();
          setRateLimitSeconds(0);
          setResendTimer(resendWindowSeconds);
          setOtpExpiresAt(Date.now() + otpValiditySeconds * 1000);
          setSuccessMessage(isResend ? "A fresh OTP has been sent." : "OTP sent successfully.");
          window.setTimeout(() => {
            otpInputRefs.current[0]?.focus();
          }, 40);
          return;
        } catch (error) {
          logFirebaseAuthError("sendOtp", error);
          const code =
            error && typeof error === "object" && "code" in error
              ? String((error as { code?: unknown }).code)
              : error instanceof Error && error.message === "OTP request timed out. Please try again."
                ? "auth/network-request-failed"
                : "";

          if (code === "auth/too-many-requests" || code === "auth/quota-exceeded") {
            /* Firebase's own phone-auth abuse lockout typically lasts minutes,
               not seconds — this is just a client-side guard against
               immediately re-triggering the same throttle, not a guarantee
               Firebase will accept a retry once it expires. */
            setRateLimitSeconds(120);
          }

          clearRecaptcha(recaptchaHostRef.current);
          recaptchaVerifierRef.current = null;

          const isLocalhost = isLocalPhoneAuthHost();

          if (code === "auth/invalid-phone-number") {
            setStepError("Invalid phone number. Use a valid 10-digit mobile number.", isResend ? "otp" : "phone");
          } else if (code === "auth/too-many-requests") {
            setStepError("Too many attempts. Please wait a few minutes and try again.", isResend ? "otp" : "phone");
          } else if (
            (code === "auth/captcha-check-failed" || code === "auth/unauthorized-domain" || code === "auth/invalid-app-credential")
            && isLocalhost
          ) {
            setStepError(
              "OTP is blocked on localhost. Fix in Firebase Console (choose one): " +
              "(A) Authentication -> Sign-in method -> Phone -> Test phone numbers -> add your number with code 123456. " +
              "(B) Authentication -> Settings -> Authorized domains -> add 'localhost'.",
              isResend ? "otp" : "phone",
            );
          } else {
            const firebaseMessage = getFirebaseAuthErrorMessage(error);
            const message =
              firebaseMessage === "We couldn't complete the verification. Please try again."
                ? "OTP could not be sent. Refresh the page, disable ad-block/VPN, and try again. If this continues, use Password Login."
                : firebaseMessage;
            setStepError(message, isResend ? "otp" : "phone");
          }
          return;
        }
      }
    } finally {
      sendOtpLockRef.current = false;
      setPending(false);
    }
  }

  function handleOtpPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpLength)
      .split("");

    if (!pasted.length) {
      return;
    }

    const next = Array.from({ length: otpLength }, (_, index) => pasted[index] || "");
    setOtp(next);
    if (otpError) {
      setOtpError(null);
    }
    const focusIndex = Math.min(pasted.length, otpLength - 1);
    otpInputRefs.current[focusIndex]?.focus();
  }

  function resetOtpStep() {
    setStep("phone");
    resetOtpInputs();
    confirmationResultRef.current = null;
    setOtpExpiresAt(null);
    googleUserIdRef.current = null;
    clearRecaptcha(recaptchaHostRef.current);
    recaptchaVerifierRef.current = null;
    verifyOtpLockRef.current = false;
    setGooglePhone("");
    clearStepErrors();
    setSuccessMessage(null);
    setResendTimer(0);
    setRateLimitSeconds(0);
  }

  function handleTabChange(nextTab: AuthTab) {
    setActiveTab(nextTab);
    setCountryCode("+91");
    clearResetState();
    resetOtpStep();
    setSignupLookupPending(false);
    setLoginPassword("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);
    setSignupStep("form");
    setShowSignupGoToLogin(false);
  }

  function beginForgotPassword() {
    clearAllFeedback();
    resetOtpStep();
    setCountryCode("+91");
    setIsForgotPasswordMode(true);
    setForgotPasswordStep("phone");
    setResetUser(null);
    setForgotPasswordEmail("");
    setResetPasswordValue("");
    setResetConfirmPassword("");
  }

  function exitForgotPassword() {
    clearAllFeedback();
    clearResetState();
    resetOtpStep();
    setLoginPassword("");
  }

  async function handleGoogleSignIn() {
    const auth = getFirebaseAuth();

    if (!auth) {
      setFeedback("Firebase auth is not available right now.");
      return;
    }

    setPending(true);
    setFeedback(null);
    setSuccessMessage(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      try {
        await upsertGoogleUserProfile(signedInUser);
      } catch {
        // Google profile sync is best-effort and must not block platform entry.
      }

      try {
        const userDoc = await getUserProfile(signedInUser.uid);
        const savedPhone = userDoc?.phone?.trim() || "";

        if (savedPhone) {
          await finishAuthSuccess("Login successful!");
          return;
        }
      } catch {
        await finishAuthSuccess("Login successful!");
        return;
      }

      googleUserIdRef.current = signedInUser.uid;
      setGooglePhone("");
      setStep("google-phone");
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";

      if (code === "auth/popup-closed-by-user") {
        return;
      }

      setFeedback("Google sign-in failed. Try OTP instead.");
    } finally {
      setPending(false);
    }
  }

  async function handleGooglePhoneSave() {
    if (!googleUserIdRef.current) {
      await finishAuthSuccess("Login successful!");
      return;
    }

    const digits = normalizePhone(formattedGooglePhone);
    if (digits.length < 8 || digits.length > 14) {
      setFeedback("Enter a valid mobile number to continue.");
      return;
    }

    setPending(true);
    setFeedback(null);

    try {
      try {
        await saveUserWhatsappNumber(googleUserIdRef.current, formattedGooglePhone);
      } catch {
        // Optional metadata save failed; do not block the session.
      }
      await finishAuthSuccess("Login successful!");
    } catch {
      await finishAuthSuccess("Login successful!");
    } finally {
      setPending(false);
    }
  }

  async function handleGooglePhoneSkip() {
    await finishAuthSuccess("Login successful!");
  }

  async function handlePasswordLogin() {
    const auth = getFirebaseAuth();

    if (!auth) {
      setFeedback("Firebase auth is not available right now.");
      return;
    }

    const phoneMessage = validateIndianPhone();
    if (phoneMessage) {
      setFeedback(phoneMessage);
      return;
    }

    if (!loginPassword.trim()) {
      setFeedback("Enter your password to continue.");
      return;
    }

    const loginAttemptAt = Date.now();
    if (loginAttemptAt - passwordLoginThrottleRef.current < 1200) {
      setFeedback("Please wait a moment before trying again.");
      return;
    }
    passwordLoginThrottleRef.current = loginAttemptAt;

    setPending(true);
    clearAllFeedback();

    try {
      if (auth.currentUser) {
        await signOut(auth);
      }

      /* ── Try all candidate emails (avoids fetchSignInMethodsForEmail
         which is broken when Firebase email enumeration protection is ON) ── */
      const phoneAccount = await lookupPhoneAccount(formattedPhone);
      if (!phoneAccount.exists) {
        setFeedback("No account found with this phone number. Please sign up first.");
        return;
      }

      if (!phoneAccount.passwordEnabled) {
        setFeedback("Password login is not set up for this phone number. Use Forgot Password to create one.");
        return;
      }

      const normalizedLoginPhone = normalizePhoneForAuth(phone);
      const candidates = getLegacyPhoneAuthCandidates(normalizedLoginPhone)
        .map((c) => `${c}@genznext.app`);

      let lastError: unknown = null;
      let signedIn = false;

      for (const candidateEmail of candidates) {
        try {
          await signInWithEmailAndPassword(auth, candidateEmail, loginPassword);
          signedIn = true;
          break;
        } catch (err) {
          /* With email-enumeration protection, Firebase returns the same
             "invalid-credential" code both for "wrong password on a real
             account" and "no account with this email" — it no longer
             exposes auth/user-not-found. Since candidates include both the
             current and legacy email schemes, we can't tell those apart
             from a single attempt, so every candidate must be tried before
             giving up. */
          lastError = err;
        }
      }

      if (signedIn) {
        // Back-fill phone-signup-claims so future duplicate checks work for this user
        try {
          const normalizedLoginPhone = normalizePhoneForAuth(phone);
          if (normalizedLoginPhone) {
            await finalizePhoneSignupReservation(normalizedLoginPhone, auth.currentUser?.uid || "");
          }
        } catch { /* best-effort */ }
        await finishAuthSuccess("Login successful!");
        return;
      }

      const code = getErrorCode(lastError);

      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setFeedback("Incorrect password. Please try again.");
      } else if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setFeedback("No account found with this phone number. Please sign up first.");
      } else {
        setFeedback(getSanitizedErrorMessage(code, getFirebaseAuthErrorMessage(lastError)));
      }
    } catch (error) {
      const code = getErrorCode(error);
      setFeedback(getSanitizedErrorMessage(code, getFirebaseAuthErrorMessage(error)));
    } finally {
      setPending(false);
    }
  }

  async function handlePasswordSignup() {
    if (!getFirebaseAuth() || !getFirebaseDb()) {
      setFeedback("Firebase auth is not available right now.");
      return;
    }

    if (signupLookupPending || pending) {
      return;
    }

    if (fullName.trim().length < 2) {
      setFeedback("Enter your full name to continue.");
      return;
    }

    const phoneMessage = validateIndianPhone();
    if (phoneMessage) {
      setFeedback(phoneMessage);
      return;
    }

    if (signupPassword.length < 8) {
      setFeedback("Password must be at least 8 characters.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    setSignupLookupPending(true);

    try {
      const canRequestOtp = await ensureSignupPhoneCanRequestOtp();
      if (!canRequestOtp) {
        return;
      }
    } catch (error) {
      setFeedback(
        error instanceof Error && error.message
          ? error.message
          : "Unable to validate this phone number right now. Please try again.",
      );
      return;
    } finally {
      setSignupLookupPending(false);
    }

    await sendOtp(false);
    if (confirmationResultRef.current) {
      setSignupStep("otp");
      setOtpError(null);
      setShowSignupGoToLogin(false);
      setSuccessMessage("OTP sent. Verify to create your account.");
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 40);
    }
  }

  function handleSignupGoToLogin() {
    setActiveTab("password-login");
    setSignupStep("form");
    setShowSignupGoToLogin(false);
    setOtpError(null);
    setFeedback(null);
    setSuccessMessage(null);
    setLoginPassword("");
    window.setTimeout(() => {
      loginPasswordInputRef.current?.focus();
    }, 60);
  }

  async function handleSignupVerifyAndCreate() {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    let reservedPhone: string | null = null;
    let finalizedPhoneSignup = false;

    if (!auth || !db) {
      setFeedback("Firebase auth is not available right now.");
      return;
    }

    if (otpCode.length !== otpLength) {
      setOtpError("Enter the complete 6-digit OTP.");
      return;
    }

    if (signupPassword.length < 8) {
      setFeedback("Password must be at least 8 characters.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    if (otpExpiresAt && Date.now() > otpExpiresAt) {
      setOtpError("OTP expired. Please request a new OTP.");
      confirmationResultRef.current = null;
      return;
    }

    const confirmationResult = confirmationResultRef.current;
    if (!confirmationResult) {
      setOtpError("Request OTP again to continue.");
      setSignupStep("form");
      return;
    }

    if (verifyOtpLockRef.current) {
      return;
    }

    verifyOtpLockRef.current = true;
    setPending(true);
    setOtpError(null);
    setFeedback(null);
    setSuccessMessage(null);

    try {
      /* Skip fetchSignInMethodsForEmail — broken with email enumeration protection.
         Duplicate detection happens naturally: linkWithCredential throws
         auth/credential-already-in-use if the email is already registered. */
      const verified = await confirmationResult.confirm(otpCode);
      const verifiedPhone = normalizePhoneForAuth(verified.user.phoneNumber || formattedPhone);
      const existingProfile = await getUserProfile(verified.user.uid).catch(() => null);

      // Strong duplicate guard: if this phone-auth UID already has a password profile,
      // treat this as an existing account and route the user to login.
      if (isPhonePasswordAccount(verified.user, verifiedPhone, existingProfile)) {
        try { await signOut(auth); } catch { /* ignore */ }
        clearRecaptcha(recaptchaHostRef.current);
        recaptchaVerifierRef.current = null;
        setSignupStep("form");
        setStep("phone");
        resetOtpInputs();
        confirmationResultRef.current = null;
        setFeedback("An account already exists with this number. Please log in instead.");
        setShowSignupGoToLogin(true);
        return;
      }

      // Strongest duplicate check: if the Firebase user already has a password
      // provider linked, this phone number was used to sign up before.
      const alreadyHasPassword = isPhonePasswordAccount(verified.user, verifiedPhone, existingProfile);
      if (alreadyHasPassword) {
        try { await signOut(auth); } catch { /* ignore */ }
        clearRecaptcha(recaptchaHostRef.current);
        recaptchaVerifierRef.current = null;
        setSignupStep("form");
        setStep("phone");
        resetOtpInputs();
        confirmationResultRef.current = null;
        setFeedback("An account already exists with this number. Please log in instead.");
        setShowSignupGoToLogin(true);
        return;
      }

      try {
        const phoneCheck = await checkSignupPhoneAvailability(verifiedPhone);
        if (!phoneCheck.canProceed) {
          try {
            await signOut(auth);
          } catch {
            // If sign-out fails, the auth session will still be replaced by the next login attempt.
          }

          clearRecaptcha(recaptchaHostRef.current);
          recaptchaVerifierRef.current = null;
          setSignupStep("form");
          setStep("phone");
          resetOtpInputs();
          confirmationResultRef.current = null;
          setFeedback("An account already exists with this number. Please log in instead.");
          setShowSignupGoToLogin(true);
          return;
        }
      } catch (lookupError) {
        try {
          await signOut(auth);
        } catch {
          // Keep going only if we can safely validate the signup path.
        }

        throw lookupError;
      }

      reservedPhone = await reservePhoneSignup(verifiedPhone, verified.user.uid);
      const signupEmail = getFakeEmail(verifiedPhone);
      const credential = EmailAuthProvider.credential(signupEmail, signupPassword);
      const linked = await linkWithCredential(verified.user, credential);
      await finalizePhoneSignupReservation(verifiedPhone, linked.user.uid);
      finalizedPhoneSignup = true;
      try {
        await updateProfile(linked.user, {
          displayName: fullName.trim(),
        });
      } catch {
        // Profile decoration is best-effort; auth success must not be blocked.
      }

      try {
        await setDoc(doc(db, "users", linked.user.uid), {
          uid: linked.user.uid,
          name: fullName.trim(),
          phone: verifiedPhone,
          authMethod: "password",
          createdAt: new Date().toISOString(),
          ...(billingCompany.trim() && { companyName: billingCompany.trim() }),
          ...(billingGst.trim()     && { gstNumber: billingGst.trim().toUpperCase() }),
          ...(billingAddress.trim() && { billingAddress: billingAddress.trim() }),
        }, { merge: true });
      } catch {
        // Firestore profile sync is best-effort; auth success must not be blocked.
      }

      setSignupStep("form");
      setStep("phone");
      resetOtpInputs();
      await finishAuthSuccess("Account created successfully!");
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";

      if (reservedPhone && !finalizedPhoneSignup) {
        try {
          await releasePhoneSignupReservation(reservedPhone);
        } catch {
          // If cleanup fails, keep the reservation as a conservative duplicate guard.
        }
      }

      if (
        code === "auth/email-already-in-use" ||
        code === "auth/credential-already-in-use" ||
        code === "auth/phone-number-already-in-use"
      ) {
        try {
          await signOut(auth);
        } catch {
          // Keep the user on the login path even if sign-out fails.
        }
        clearRecaptcha(recaptchaHostRef.current);
        recaptchaVerifierRef.current = null;
        confirmationResultRef.current = null;
        setSignupStep("form");
        setStep("phone");
        resetOtpInputs();
        setFeedback("User already exists. Please login instead.");
        setShowSignupGoToLogin(true);
      } else if (code === "auth/invalid-verification-code") {
        setOtpError("Invalid OTP. Please try again.");
      } else if (code === "auth/code-expired") {
        setOtpError("OTP expired. Please request a new OTP.");
      } else if (code === "auth/weak-password") {
        setFeedback("Password must be at least 8 characters.");
      } else {
        setFeedback(getFirebaseAuthErrorMessage(error));
      }
    } finally {
      verifyOtpLockRef.current = false;
      setPending(false);
    }
  }

  async function handleForgotPasswordOtpSend(isResend = false) {
    const auth = getFirebaseAuth();
    if (!auth) {
      setFeedback("Firebase auth is not available right now.");
      return;
    }

    const phoneMessage = validateIndianPhone();
    if (phoneMessage) {
      setFeedback(phoneMessage);
      return;
    }

    setPending(true);
    clearAllFeedback();

    try {
      /* Skip fetchSignInMethodsForEmail — broken with Firebase email enumeration protection.
         Just set the primary email and proceed to OTP; the reset step will validate. */
      const phoneAccount = await lookupPhoneAccount(formattedPhone);
      if (!phoneAccount.exists) {
        setFeedback("No account found with this phone number. Please sign up first.");
        return;
      }

      const normalizedForgotPhone = normalizePhoneForAuth(phone);
      const primaryEmail = `${normalizedForgotPhone}@genznext.app`;
      setForgotPasswordEmail(primaryEmail);
    } catch (error) {
      setFeedback(
        error instanceof Error && error.message
          ? error.message
          : "Unable to validate this phone number right now. Please try again.",
      );
      return;
    } finally {
      setPending(false);
    }

    await sendOtp(isResend);

    if (confirmationResultRef.current) {
      setForgotPasswordStep("otp");
    }
  }

  async function handleForgotPasswordOtpVerify() {
    if (verifyOtpLockRef.current) {
      return;
    }

    if (otpCode.length !== otpLength) {
      setOtpError("Enter the complete 6-digit OTP.");
      return;
    }

    if (otpExpiresAt && Date.now() > otpExpiresAt) {
      setOtpError("OTP expired. Please request a new OTP.");
      confirmationResultRef.current = null;
      return;
    }

    const confirmationResult = confirmationResultRef.current;
    if (!confirmationResult) {
      setOtpError("Request a new OTP to continue.");
      return;
    }

    verifyOtpLockRef.current = true;
    setPending(true);
    setOtpError(null);
    setFeedback(null);
    setSuccessMessage(null);

    try {
      const result = await confirmationResult.confirm(otpCode);
      if (forgotPasswordStep === "otp") {
        setResetUser(result.user);
        setForgotPasswordStep("reset");
        setStep("phone");
        resetOtpInputs();
        setSuccessMessage("OTP verified. Set your new password.");
        return;
      }
      const normalizedVerifiedPhone = normalizePhoneForAuth(result.user.phoneNumber || phone);
      const existingProfile = await getUserProfile(result.user.uid).catch(() => null);
      const hasPasswordProvider = isPhonePasswordAccount(result.user, normalizedVerifiedPhone, existingProfile);
      if (!hasPasswordProvider) {
        /* This phone number has no password credential on it, which means
           confirming the OTP either created a brand-new disconnected
           account or resolved to a phone-only/Google account. Letting the
           flow continue would call updatePassword() on an account with no
           email, producing a password that no login attempt can ever
           reach. (fetchSignInMethodsForEmail can't help distinguish this —
           it's a no-op under email-enumeration protection.) */
        try {
          await signOut(getFirebaseAuth()!);
        } catch {
          // Best-effort cleanup of the orphan/disconnected session.
        }
        setOtpError(
          "This number isn't set up for password login. If you signed up with Google, use \"Continue with Google\" instead, or contact support.",
        );
        setResetUser(null);
        return;
      }
      setResetUser(result.user);
      setForgotPasswordStep("reset");
      setStep("phone");
      resetOtpInputs();
      setSuccessMessage("OTP verified. Set your new password.");
    } catch (error) {
      autoVerifyRef.current = null;
      logFirebaseAuthError("verifyForgotPasswordOtp", error);
      resetOtpInputs(true);
      setOtpError(getFirebaseAuthErrorMessage(error));
    } finally {
      verifyOtpLockRef.current = false;
      setPending(false);
    }
  }

  async function handleForgotPasswordReset() {
    const activeResetUser = resetUser || getFirebaseAuth()?.currentUser || null;

    if (!activeResetUser) {
      setFeedback("Verify OTP before resetting your password.");
      return;
    }

    if (resetPasswordValue.length < 8) {
      setFeedback("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Za-z]/.test(resetPasswordValue) || !/[0-9]/.test(resetPasswordValue)) {
      setFeedback("Password must include at least one letter and one number.");
      return;
    }

    if (resetPasswordValue !== resetConfirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    if (!forgotPasswordEmail) {
      setFeedback("Missing account context. Please restart Forgot Password.");
      return;
    }

    const resetAttemptAt = new Date().getTime();
    if (resetAttemptAt - passwordResetThrottleRef.current < 1200) {
      setFeedback("Please wait a moment before trying again.");
      return;
    }
    passwordResetThrottleRef.current = resetAttemptAt;

    setPending(true);
    clearAllFeedback();

    try {
      const normalizedResetPhone = normalizePhoneForAuth(activeResetUser.phoneNumber || phone);
      const existingProfile = await getUserProfile(activeResetUser.uid).catch(() => null);
      const passwordEnabled = isPhonePasswordAccount(activeResetUser, normalizedResetPhone, existingProfile);

      if (passwordEnabled) {
        await updatePassword(activeResetUser, resetPasswordValue);
      } else {
        const resetEmail = getFakeEmail(normalizedResetPhone);
        const credential = EmailAuthProvider.credential(resetEmail, resetPasswordValue);
        await linkWithCredential(activeResetUser, credential);
      }

      const db = getFirebaseDb();
      if (db) {
        await setDoc(
          doc(db, "users", activeResetUser.uid),
          {
            uid: activeResetUser.uid,
            phone: normalizedResetPhone,
            authMethod: "password",
            createdAt: existingProfile?.createdAt || new Date().toISOString(),
            passwordUpdatedAt: new Date().toISOString(),
            passwordEnabled: true,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      const auth = getFirebaseAuth();
      if (auth?.currentUser) {
        try {
          await signOut(auth);
        } catch {
          // Signing out is a cleanup step here; a browser-specific auth state
          // hiccup should not turn a successful password update into a failure.
        }
      }

      const latestPhone = normalizePhoneForAuth(activeResetUser.phoneNumber || phone);
      setPhone(latestPhone);
      setLoginPassword("");
      clearResetState();
      setForgotPasswordEmail("");
      resetOtpStep();
      setActiveTab("password-login");
      setFeedback(null);
      setOtpError(null);
      setSuccessMessage("Password reset successfully. Please login with your new password.");
      window.setTimeout(() => {
        loginPasswordInputRef.current?.focus();
      }, 60);
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";

      if (code === "auth/weak-password") {
        setFeedback("Password must be at least 8 characters.");
      } else if (code === "auth/invalid-verification-code") {
        setFeedback("Invalid OTP. Please try again.");
      } else if (code === "auth/code-expired") {
        setFeedback("OTP expired. Please request a new OTP.");
      } else if (code === "auth/user-not-found") {
        setFeedback("No account found with this number. Please sign up first.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setFeedback("Password reset could not be completed. Please request OTP again and try once more.");
      } else {
        setFeedback(getSanitizedErrorMessage(code, "Password update failed. Please try again."));
      }
    } finally {
      setPending(false);
    }
  }

  function renderInput(_id: string, icon: ReactNode, input: ReactNode) {
    if (!isModal) {
      return input;
    }

    return (
      <div className="relative">
        <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#475569]">{icon}</div>
        {input}
      </div>
    );
  }

  function renderTextField({
    id,
    label,
    icon,
    value,
    onChange,
    placeholder,
    autoComplete,
    inputMode,
    disabled,
  }: {
    id: string;
    label: string;
    icon: ReactNode;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    autoComplete?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    disabled?: boolean;
  }) {
    return (
      <div>
        {!isModal ? (
          <label className={labelClass} htmlFor={id}>
            {label}
          </label>
        ) : null}
        {renderInput(
          id,
          icon,
          <input
            id={id}
            className={cn(fieldClass, isModal && "pr-3 pl-9")}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            disabled={disabled}
          />,
        )}
      </div>
    );
  }

  function renderPhoneField({
    id,
    label,
    value,
    onChange,
    inputRef,
    disabled,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    disabled?: boolean;
  }) {
    return (
      <div>
        {!isModal ? (
          <label className={labelClass} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div className={prefixShellClass}>
          <span className={prefixLabelClass}>+91</span>
          <input
            ref={inputRef}
            id={id}
            className={prefixInputClass}
            value={value}
            onChange={(event) => {
              setCountryCode("+91");
              onChange(event.target.value);
            }}
            placeholder="9876543210"
            autoComplete="tel-national"
            inputMode="numeric"
            maxLength={10}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  function renderPasswordField({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
    autoComplete,
    inputRef,
    disabled,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    visible: boolean;
    onToggle: () => void;
    placeholder: string;
    autoComplete?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    disabled?: boolean;
  }) {
    return (
      <div>
        {!isModal ? (
          <label className={labelClass} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={inputRef}
            id={id}
            className={cn(fieldClass, "pr-11")}
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "absolute top-1/2 right-3 -translate-y-1/2 transition",
              isModal ? "text-[#64748B] hover:text-[#0B2E6B]" : "text-[#64748B] hover:text-[#0F172A]",
            )}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  }

  function renderOtpSection({
    onVerify,
    onResend,
  }: {
    onVerify: () => Promise<void>;
    onResend: () => Promise<void>;
  }) {
    return (
      <>
        <div>
          <label className={cn("form-label", isModal ? "text-[#64748B]" : "text-[#E2E8F0]")} htmlFor={`otp-0-${variant}`}>
            Enter OTP
          </label>
          <div className="flex gap-2 sm:gap-3">
            {otp.map((value, index) => (
              <input
                key={`otp-${index}`}
                id={`otp-${index}-${variant}`}
                ref={(node) => {
                  otpInputRefs.current[index] = node;
                }}
                className={cn(
                  "h-14 w-[52px] rounded-[14px] border text-center text-[20px] font-semibold outline-none transition",
                  isModal
                    ? "border-[#CBD5E1] bg-white text-[#0F172A]"
                    : "border-[#cbd5e1] bg-white text-[#0f172a]",
                  "focus:border-[#0B2E6B] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]",
                )}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                disabled={pending}
                aria-invalid={otpError ? "true" : "false"}
                value={value}
                onChange={(event) => {
                  const digit = event.target.value.replace(/\D/g, "").slice(-1);
                  const next = [...otp];
                  next[index] = digit;
                  setOtp(next);

                  if (otpError) {
                    setOtpError(null);
                  }

                  if (digit && index < otpLength - 1) {
                    otpInputRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !otp[index] && index > 0) {
                    otpInputRefs.current[index - 1]?.focus();
                  }
                }}
                onPaste={handleOtpPaste}
              />
            ))}
          </div>
          {otpError ? (
            <p className={cn("mt-2 text-sm", isModal ? "text-[#FCA5A5]" : "text-rose-600")}>
              {otpError}
            </p>
          ) : null}
          <div className="mt-3 space-y-2">
            <p className={cn("text-sm", isModal ? "text-[#475569]" : "text-[#E2E8F0]")}>OTP sent to {maskedPhone}</p>
            <p className={cn("text-[12px]", otpRemainingSeconds > 0 ? (isModal ? "text-[#475569]" : "text-[#CBD5E1]") : "font-medium text-rose-600")}>
              {otpRemainingSeconds > 0
                ? `OTP expires in ${formatOtpCountdown(otpRemainingSeconds)}`
                : "OTP expired. Please request a new OTP."}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
              <button
                type="button"
                onClick={() => void onResend()}
                disabled={pending || resendTimer > 0}
                className={cn(
                  "transition",
                  resendTimer > 0 || pending
                    ? "cursor-not-allowed text-[#475569]"
                    : "cursor-pointer font-medium text-[#0B2E6B] hover:text-[#15407E]",
                )}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={resetOtpStep}
                disabled={pending}
                className="text-[#64748B] transition hover:text-[#0B2E6B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Change number
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void onVerify()}
            disabled={pending || otpCode.length !== otpLength || otpRemainingSeconds <= 0}
            className={cn(
              isModal
                ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
            )}
          >
            {pending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                {isModal ? <ArrowRight className="h-4 w-4" /> : null}
              </>
            )}
          </button>
          {!isModal ? (
            <button
              type="button"
              onClick={resetOtpStep}
              disabled={pending}
              className={buttonLinkClasses("outline", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70")}
            >
              Change Number
            </button>
          ) : null}
        </div>
      </>
    );
  }

  const showGooglePhoneState = step === "google-phone";
  const showPasswordLoginState = activeTab === "password-login" && !isForgotPasswordMode;
  const showSignupState = activeTab === "signup";
  const showSignupOtpState = showSignupState && signupStep === "otp";
  const signupPasswordStrength = useMemo(() => {
    const value = signupPassword.trim();
    if (!value) return null;
    if (value.length < 8) return { label: "Weak", tone: "text-rose-600" };
    const checks = [
      /[A-Z]/.test(value),
      /[a-z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value),
    ].filter(Boolean).length;
    if (checks >= 3 && value.length >= 10) return { label: "Strong", tone: "text-emerald-600" };
    return { label: "Medium", tone: "text-amber-600" };
  }, [signupPassword]);

  useEffect(() => {
    if (!showSignupOtpState) return;
    window.setTimeout(() => {
      signupOtpSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      otpInputRefs.current[0]?.focus();
    }, 40);
  }, [showSignupOtpState]);
  const showForgotPhoneState = activeTab === "password-login" && isForgotPasswordMode && forgotPasswordStep === "phone";
  const showForgotOtpState = activeTab === "password-login" && isForgotPasswordMode && forgotPasswordStep === "otp";
  const showForgotResetState = activeTab === "password-login" && isForgotPasswordMode && forgotPasswordStep === "reset";
  const shouldRedirectSignedInSignupUser = mode === "signup" && isAuthReady && Boolean(user);

  useEffect(() => {
    if (!shouldRedirectSignedInSignupUser) {
      return;
    }

    confirmationResultRef.current = null;
    clearRecaptcha(recaptchaHostRef.current);
    recaptchaVerifierRef.current = null;

    if (isModal) {
      onClose?.();
    }

    router.replace(redirectTo);
  }, [
    isModal,
    onClose,
    redirectTo,
    router,
    shouldRedirectSignedInSignupUser,
  ]);

  if (shouldRedirectSignedInSignupUser) {
    return null;
  }

  return (
    <div
      className={cn(
        variant === "page" && "surface-form rounded-[28px] p-6 shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:p-8",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {isModal ? (
            <>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-[10px] py-[3px] text-[11px] text-[#0B2E6B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0B2E6B]" />
                Free to join
              </div>
              <h2 className="text-[22px] font-bold text-[#0F172A]">{titleText}</h2>
              <p className="mt-2 text-[13px] text-[#475569]">{subtitleText}</p>
            </>
          ) : (
            <>
              <div className="section-label text-[#E56F12]">
                {activeTab === "signup" ? "Sign Up" : isForgotPasswordMode ? "Reset Password" : "Login"}
              </div>
              <h2 className="mt-2 text-[26px] font-bold leading-[1.2] text-white">{titleText}</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#E2E8F0]">{subtitleText}</p>
            </>
          )}
        </div>
      </div>

      {!firebaseReady && (
        <div className="mt-6 rounded-[18px] border border-[#C8D7EE] bg-[#EAF0FA] px-4 py-4 text-sm text-[#092552]">
          <div className="font-semibold">Firebase setup required</div>
          <p className="mt-1 leading-6">
            Sign up and password login both depend on the Firebase public configuration being available in the
            runtime environment.
          </p>
          <p className="mt-3 text-[12px] leading-5 text-[#4C1D95]">
            Add these keys to your local `.env.local` or the VM app env file, then restart the app:
          </p>
          <div className="mt-3 grid gap-1 rounded-[14px] border border-[#E8DCCF] bg-white/70 p-3 text-[12px] font-mono text-[#312E81] sm:grid-cols-2">
            {firebaseSetupKeys.map((key) => (
              <div key={key}>{key}</div>
            ))}
          </div>
        </div>
      )}

      {user && activeTab !== "signup" && !isForgotPasswordMode && !showGooglePhoneState ? (
        <div className="mt-6 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0FA] text-[#0B2E6B]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0F172A]">You are already signed in</div>
              <div className="mt-1 text-sm text-[#475569]">
                {user.phoneNumber || user.displayName || "Active session detected."}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!showGooglePhoneState ? (
        <div className="mt-7 flex gap-1.5 rounded-[18px] border border-[rgba(226,232,240,0.9)] bg-[rgba(248,250,252,0.92)] p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          {[
            { id: "password-login", label: "Password Login" },
            { id: "signup", label: "Sign Up" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as AuthTab)}
                className={cn(
                  "flex h-[50px] flex-1 items-center justify-center rounded-[14px] px-3 text-center text-[17px] font-medium tracking-[-0.01em] transition-all duration-250 ease-in-out",
                  active
                    ? "bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] text-white font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.18)] -translate-y-[1px]"
                    : "bg-transparent text-[#64748B] hover:bg-[rgba(99,102,241,0.06)] hover:text-[#0B2E6B]",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {showPasswordLoginState ? (
          <>
            {renderPhoneField({
              id: `password-login-phone-${variant}`,
              label: "Mobile Number",
              value: phone,
              inputRef: loginPhoneInputRef,
              onChange: (value) => {
                setPhone(value);
                clearAllFeedback();
              },
              disabled: pending,
            })}
            {renderPasswordField({
              id: `password-login-password-${variant}`,
              label: "Password",
              value: loginPassword,
              inputRef: loginPasswordInputRef,
              onChange: (value) => {
                setLoginPassword(value);
                clearAllFeedback();
              },
              visible: showLoginPassword,
              onToggle: () => setShowLoginPassword((current) => !current),
              placeholder: "Enter your password",
              autoComplete: "current-password",
              disabled: pending,
            })}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handlePasswordLogin()}
                disabled={pending || !firebaseReady}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Log In
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={beginForgotPassword}
                className="text-[12px] font-medium text-[#0B2E6B] transition hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : null}

        {showSignupState ? (
          !firebaseReady ? (
            <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#475569]">
              <div className="font-semibold text-[#0F172A]">Signup is paused until Firebase is configured</div>
              <p className="mt-2 leading-6">
                The form is intentionally disabled because the app cannot create accounts without Firebase auth and Firestore
                access.
              </p>
              <p className="mt-3 text-[12px] leading-5 text-[#64748B]">
                Once the Firebase public environment variables are present, refresh the app and the full signup flow will
                work normally.
              </p>
            </div>
          ) : (
            <>
            {renderTextField({
              id: `password-signup-name-${variant}`,
              label: "Full Name",
              icon: <User2 className="h-[15px] w-[15px]" />,
              value: fullName,
              onChange: (value) => {
                setFullName(value);
                clearAllFeedback();
              },
              placeholder: "Full name",
              autoComplete: "name",
              disabled: pending,
            })}
            {renderPhoneField({
              id: `password-signup-phone-${variant}`,
              label: "Mobile Number",
              value: phone,
              onChange: (value) => {
                setPhone(value);
                clearAllFeedback();
              },
              disabled: pending,
            })}
            {renderPasswordField({
              id: `password-signup-password-${variant}`,
              label: "Password",
              value: signupPassword,
              onChange: (value) => {
                setSignupPassword(value);
                clearAllFeedback();
              },
              visible: showSignupPassword,
              onToggle: () => setShowSignupPassword((current) => !current),
              placeholder: "Minimum 8 characters",
              autoComplete: "new-password",
              disabled: pending,
            })}
            {signupPasswordStrength ? (
              <p className={cn("-mt-2 text-[12px] font-medium", signupPasswordStrength.tone)}>
                Strength: {signupPasswordStrength.label}
              </p>
            ) : null}
            {renderPasswordField({
              id: `password-signup-confirm-${variant}`,
              label: "Confirm Password",
              value: signupConfirmPassword,
              onChange: (value) => {
                setSignupConfirmPassword(value);
                clearAllFeedback();
              },
              visible: showSignupConfirmPassword,
              onToggle: () => setShowSignupConfirmPassword((current) => !current),
              placeholder: "Re-enter password",
              autoComplete: "new-password",
              disabled: pending,
            })}
            {/* ── Optional billing / GST section ── */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <button
                type="button"
                onClick={() => setShowBilling((v) => !v)}
                className="flex w-full items-center justify-between text-[12px] font-semibold text-[#475569]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="rounded bg-[#EAF0FA] px-1.5 py-0.5 text-[10px] text-[#0B2E6B]">Optional</span>
                  Add GST / Billing Details for Tax Invoice
                </span>
                <span className="text-[#94A3B8]">{showBilling ? "▲" : "▼"}</span>
              </button>
              {showBilling && (
                <div className="mt-3 space-y-2.5">
                  <div>
                    <label className="form-label">Company / Business Name</label>
                    <input
                      value={billingCompany}
                      onChange={(e) => setBillingCompany(e.target.value)}
                      placeholder="e.g. Acme Pvt Ltd"
                      className={cn(fieldClass)}
                      disabled={pending}
                    />
                  </div>
                  <div>
                    <label className="form-label">GST Number (GSTIN)</label>
                    <input
                      value={billingGst}
                      onChange={(e) => setBillingGst(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AAHCN4778J1ZU"
                      maxLength={15}
                      className={cn(fieldClass, "font-mono uppercase")}
                      disabled={pending}
                    />
                    {billingGst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(billingGst) && (
                      <p className="mt-1 text-[11px] text-rose-500">Enter a valid 15-character GSTIN</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Billing Address</label>
                    <input
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="Street, City, State, PIN"
                      className={cn(fieldClass)}
                      disabled={pending}
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    These details will be pre-filled on your invoice at checkout. You can update them anytime from your profile.
                  </p>
                </div>
              )}
            </div>

            <AnimatePresence initial={false}>
              {showSignupOtpState ? (
                <motion.div
                  key="signup-otp"
                  ref={signupOtpSectionRef}
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#475569]">
                    <div className="flex items-center gap-2 font-medium text-[#334155]">
                      <ShieldCheck className="h-4 w-4 text-[#1B4C92]" />
                      Secure verification
                    </div>
                    <p className="mt-1 text-[13px]">OTP sent to: {maskedPhone}</p>
                    <p className={cn("mt-1 text-[12px]", otpRemainingSeconds > 0 ? "text-[#64748B]" : "font-medium text-rose-600")}>
                      {otpRemainingSeconds > 0
                        ? `OTP expires in ${formatOtpCountdown(otpRemainingSeconds)}`
                        : "OTP expired. Please request a new OTP."}
                    </p>
                  </div>
                  <label className={cn("form-label", isModal ? "text-[#64748B]" : "text-[#E2E8F0]")} htmlFor={`signup-otp-0-${variant}`}>
                    Enter OTP
                  </label>
                  <div className="flex gap-2 sm:gap-3">
                    {otp.map((value, index) => (
                      <input
                        key={`signup-otp-${index}`}
                        id={`signup-otp-${index}-${variant}`}
                        ref={(node) => {
                          otpInputRefs.current[index] = node;
                        }}
                        className={cn(
                          "h-14 w-[52px] rounded-[14px] border text-center text-[20px] font-semibold outline-none transition",
                          isModal ? "border-[#CBD5E1] bg-white text-[#0F172A]" : "border-[#cbd5e1] bg-white text-[#0f172a]",
                          "focus:border-[#1B4C92] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]",
                        )}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        disabled={pending}
                        aria-invalid={otpError ? "true" : "false"}
                        value={value}
                        onChange={(event) => {
                          const digit = event.target.value.replace(/\D/g, "").slice(-1);
                          const next = [...otp];
                          next[index] = digit;
                          setOtp(next);
                          if (otpError) {
                            setOtpError(null);
                          }
                          if (digit && index < otpLength - 1) {
                            otpInputRefs.current[index + 1]?.focus();
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Backspace" && !otp[index] && index > 0) {
                            otpInputRefs.current[index - 1]?.focus();
                          }
                        }}
                        onPaste={handleOtpPaste}
                      />
                    ))}
                  </div>
                  {otpError ? <p className="text-sm text-rose-600">{otpError}</p> : null}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                    <button
                      type="button"
                      onClick={() => void handlePasswordSignup()}
                      disabled={pending || resendTimer > 0}
                      className={cn(
                        resendTimer > 0 || pending
                          ? "cursor-not-allowed text-[#94A3B8]"
                          : "cursor-pointer font-medium text-[#0B2E6B] hover:text-[#1B4C92]",
                      )}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                  {feedback && showSignupGoToLogin ? (
                    <div className="rounded-[14px] border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-700">
                      <div>{feedback}</div>
                      <button
                        type="button"
                        onClick={handleSignupGoToLogin}
                        className="mt-2 inline-flex items-center text-[13px] font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-800"
                      >
                        Go to Login
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void (showSignupOtpState ? handleSignupVerifyAndCreate() : handlePasswordSignup())}
                disabled={
                  pending || signupLookupPending || !firebaseReady ||
                  (!showSignupOtpState && rateLimitSeconds > 0) ||
                  (showSignupOtpState && (otpCode.length !== otpLength || otpRemainingSeconds <= 0))
                }
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {showSignupOtpState ? "Verifying..." : "Sending OTP..."}
                  </>
                ) : !showSignupOtpState && rateLimitSeconds > 0 ? (
                  `Try again in ${rateLimitSeconds}s`
                ) : (
                  <>
                    {showSignupOtpState ? "Verify & Create Account" : "Send OTP"}
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
            </div>
            </>
          )
        ) : null}

        {showForgotPhoneState ? (
          <>
            {renderPhoneField({
              id: `forgot-password-phone-${variant}`,
              label: "Mobile Number",
              value: phone,
              onChange: (value) => {
                setPhone(value);
                clearAllFeedback();
              },
              disabled: pending,
            })}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleForgotPasswordOtpSend()}
                disabled={pending || !firebaseReady || rateLimitSeconds > 0}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : rateLimitSeconds > 0 ? (
                  `Try again in ${rateLimitSeconds}s`
                ) : (
                  <>
                    Send OTP
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
            </div>
            <div className="text-center text-[12px]">
              <button type="button" onClick={exitForgotPassword} className="font-medium text-[#0B2E6B] hover:underline">
                Back to Log In
              </button>
            </div>
          </>
        ) : null}

        {showForgotOtpState ? renderOtpSection({
          onVerify: handleForgotPasswordOtpVerify,
          onResend: async () => {
            await handleForgotPasswordOtpSend(true);
          },
        }) : null}

        {showForgotResetState ? (
          <>
            {renderPasswordField({
              id: `forgot-reset-password-${variant}`,
              label: "New Password",
              value: resetPasswordValue,
              onChange: (value) => {
                setResetPasswordValue(value);
                clearAllFeedback();
              },
              visible: showResetPassword,
              onToggle: () => setShowResetPassword((current) => !current),
              placeholder: "Minimum 8 characters",
              autoComplete: "new-password",
              disabled: pending,
            })}
            {renderPasswordField({
              id: `forgot-reset-confirm-${variant}`,
              label: "Confirm New Password",
              value: resetConfirmPassword,
              onChange: (value) => {
                setResetConfirmPassword(value);
                clearAllFeedback();
              },
              visible: showResetConfirmPassword,
              onToggle: () => setShowResetConfirmPassword((current) => !current),
              placeholder: "Re-enter new password",
              autoComplete: "new-password",
              disabled: pending,
            })}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleForgotPasswordReset()}
                disabled={pending || !firebaseReady}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Setting password...
                  </>
                ) : (
                  <>
                    Set New Password
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
            </div>
          </>
        ) : null}

        {showGooglePhoneState ? (
          <>
            <div className="space-y-3">
              <div>
                <div className={cn("text-sm font-semibold", isModal ? "text-[#0F172A]" : "text-white")}>
                  One last step!
                </div>
                <p className={cn("mt-1 text-[12px] leading-5", isModal ? "text-[#475569]" : "text-[#E2E8F0]")}>
                  Add WhatsApp number for batch joining link &amp; updates
                </p>
              </div>
              {renderInput(
                `google-phone-${variant}`,
                <Smartphone className="h-[15px] w-[15px]" />,
                <input
                  id={`google-phone-${variant}`}
                  className={cn(fieldClass, isModal && "pr-3 pl-9")}
                  value={googlePhone}
                  onChange={(event) => {
                    setGooglePhone(event.target.value);
                    clearAllFeedback();
                  }}
                  placeholder="+91 mobile number"
                  autoComplete="tel"
                  inputMode="tel"
                  disabled={pending}
                />,
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleGooglePhoneSave()}
                disabled={pending}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => void handleGooglePhoneSkip()}
                disabled={pending}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-[13px] text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("outline", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                Skip for now
              </button>
            </div>
          </>
        ) : null}

        {feedback && step !== "otp" && !showForgotOtpState ? (
          <div
            className={cn(
              "rounded-[16px] px-4 py-3 text-sm",
              isModal
                ? "border border-rose-200 bg-rose-50 text-rose-700"
                : "border border-rose-200 bg-rose-50 text-rose-700",
            )}
          >
            {feedback}
          </div>
        ) : null}

        {successMessage ? (
          <div
            className={cn(
              "rounded-[16px] px-4 py-3 text-sm",
              isModal
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700",
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              {successMessage}
            </div>
          </div>
        ) : null}

        {showPasswordLoginState ? (
          <>
            <div className="flex items-center gap-[10px]">
              <div className="h-px flex-1 bg-[#E2E8F0]" />
              <span className="text-[11px] text-[#64748B]">or continue with</span>
              <div className="h-px flex-1 bg-[#E2E8F0]" />
            </div>
            <button
              type="button"
              onClick={() => void handleGoogleSignIn()}
              disabled={pending}
              className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-[13px] text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path fill="#EA4335" d="M12 10.2v3.9h5.42c-.24 1.26-.95 2.32-2 3.03l3.24 2.51c1.89-1.74 2.98-4.29 2.98-7.32 0-.71-.06-1.39-.18-2.04H12Z" />
                <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.24-2.51c-.9.6-2.05.95-3.39.95-2.61 0-4.82-1.77-5.61-4.14H3.04v2.6A10 10 0 0 0 12 22Z" />
                <path fill="#4A90E2" d="M6.39 13.86A5.99 5.99 0 0 1 6.08 12c0-.64.11-1.25.31-1.86v-2.6H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.46l3.35-2.6Z" />
                <path fill="#FBBC05" d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.04 7.54l3.35 2.6C7.18 7.75 9.39 5.98 12 5.98Z" />
              </svg>
              Continue with Google
            </button>
          </>
        ) : null}

        {!showGooglePhoneState ? (
          <div className="text-center text-[12px] text-[#475569]">
            {activeTab === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => handleTabChange(activeTab === "signup" ? "password-login" : "signup")}
              className="font-medium text-[#0B2E6B] hover:underline"
            >
              {activeTab === "signup" ? "Log in" : "Sign Up"}
            </button>
          </div>
        ) : null}

        {showPasswordLoginState ? (
          <p className="text-center text-[11px] leading-5 text-[#64748B]">
            By continuing you agree to our{" "}
            <span className="text-[#475569] underline">Terms of Service</span> and{" "}
            <span className="text-[#475569] underline">Privacy Policy</span>
          </p>
        ) : null}
      </div>

      <div
        id={recaptchaContainerId}
        ref={recaptchaHostRef}
        className="pointer-events-none h-px w-px overflow-hidden opacity-0"
      />
    </div>
  );
}
