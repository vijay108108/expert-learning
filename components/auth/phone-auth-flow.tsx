"use client";

import {
  type Auth,
  type ConfirmationResult,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
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
  clearRecaptcha,
  ensurePhoneUserProfile,
  getFirebaseAuth,
  getFirebaseAuthErrorMessage,
  getFirebaseDb,
  getRecaptchaVerifier,
  getUserProfile,
  isFirebaseConfigured,
  isLocalPhoneAuthHost,
  isPhoneAuthTestingEnabled,
  normalizePhoneForAuth,
  preparePhoneAuth,
  recaptchaContainerId,
  saveUserWhatsappNumber,
  upsertGoogleUserProfile,
} from "@/lib/firebase";
import { cn } from "@/lib/utils";

const countryCodes = [
  { label: "India", value: "+91", flag: "IN" },
  { label: "United States", value: "+1", flag: "US" },
  { label: "United Kingdom", value: "+44", flag: "UK" },
  { label: "United Arab Emirates", value: "+971", flag: "UAE" },
  { label: "Singapore", value: "+65", flag: "SG" },
  { label: "Canada", value: "+1", flag: "CA" },
  { label: "Australia", value: "+61", flag: "AU" },
] as const;

const otpLength = 6;
const resendWindowSeconds = 30;

type AuthStep = "phone" | "otp" | "google-phone";
type AuthTab = "otp-login" | "password-login" | "signup";
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

function getFakeEmailCandidates(rawPhone: string) {
  return getLegacyPhoneAuthCandidates(rawPhone).map((candidate) => `${candidate}@genznext.app`);
}

async function findExistingAuthEmail(auth: Auth, rawPhone: string) {
  const primaryEmail = getFakeEmail(rawPhone);
  const candidateEmails = getFakeEmailCandidates(rawPhone);

  for (const candidateEmail of candidateEmails) {
    const methods = await fetchSignInMethodsForEmail(auth, candidateEmail);
    if (methods.length > 0) {
      return { email: candidateEmail, methods };
    }
  }

  return { email: primaryEmail, methods: [] as string[] };
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

export function PhoneAuthFlow({
  mode,
  variant = "modal",
  redirectTo = "/dashboard",
  onSuccess,
  onClose,
  onPendingChange,
}: PhoneAuthFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
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
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [googlePhone, setGooglePhone] = useState("");
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("phone");
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showSignupGoToLogin, setShowSignupGoToLogin] = useState(false);

  const firebaseReady = isFirebaseConfigured();
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
      ? "border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]"
      : "border-[#cbd5e1] bg-white text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]",
  );
  const prefixShellClass = cn(
    "flex h-[50px] overflow-hidden rounded-[14px] border transition",
    isModal
      ? "border-[#CBD5E1] bg-white focus-within:border-[#4F46E5] focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]"
      : "border-[#cbd5e1] bg-white focus-within:border-[#4F46E5] focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]",
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
        "Firebase phone authentication is not configured yet. Add the Firebase public keys to enable OTP login.",
      );
      return;
    }

    if (rateLimitSeconds > 0) {
      setStepError(`Firebase temporarily blocked OTP requests. Try again in ${rateLimitSeconds}s.`, isResend ? "otp" : "phone");
      return;
    }

    sendOtpLockRef.current = true;
    setPending(true);
    clearStepErrors();
    setSuccessMessage(null);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error("Firebase auth is not available.");
      }

      if (isLocalPhoneAuthHost() && !isPhoneAuthTestingEnabled()) {
        setStepError(
          "Real Firebase phone OTP is not supported on localhost. Use Google sign-in, deploy to a real domain, or enable Firebase test phone auth for local development.",
        );
        return;
      }

      preparePhoneAuth(auth);

      clearRecaptcha(recaptchaHostRef.current);
      recaptchaVerifierRef.current = null;
      const recaptchaMountPoint = createRecaptchaMountPoint();

      const verifier = getRecaptchaVerifier(auth, recaptchaMountPoint);
      recaptchaVerifierRef.current = verifier;

      confirmationResultRef.current = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setStep("otp");
      setOtpError(null);
      resetOtpInputs();
      setResendTimer(resendWindowSeconds);
      setSuccessMessage(isResend ? "A fresh OTP has been sent." : "OTP sent successfully.");
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 40);
    } catch (error) {
      logFirebaseAuthError("sendOtp", error);
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";

      if (code === "auth/too-many-requests" || code === "auth/quota-exceeded") {
        setRateLimitSeconds(60);
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
          "(A) Authentication → Sign-in method → Phone → Test phone numbers → add your number with code 123456. " +
          "(B) Authentication → Settings → Authorized domains → add 'localhost'.",
          isResend ? "otp" : "phone",
        );
      } else {
        setStepError(getFirebaseAuthErrorMessage(error), isResend ? "otp" : "phone");
      }
    } finally {
      sendOtpLockRef.current = false;
      setPending(false);
    }
  }

  const verifyOtp = useCallback(async () => {
    if (verifyOtpLockRef.current) {
      return;
    }

    if (otpCode.length !== otpLength) {
      setOtpError("Enter the complete 6-digit OTP.");
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

    try {
      const result = await confirmationResult.confirm(otpCode);

      await ensurePhoneUserProfile(result.user, fullName);
      await finishAuthSuccess("Login successful!");
    } catch (error) {
      autoVerifyRef.current = null;
      logFirebaseAuthError("verifyOtp", error);
      resetOtpInputs(true);
      setOtpError(getFirebaseAuthErrorMessage(error));
    } finally {
      verifyOtpLockRef.current = false;
      setPending(false);
    }
  }, [finishAuthSuccess, fullName, logFirebaseAuthError, mode, otpCode, resetOtpInputs]);

  useEffect(() => {
    if (activeTab !== "otp-login" || isForgotPasswordMode || step !== "otp" || pending) {
      return;
    }

    if (otpCode.length !== otpLength) {
      autoVerifyRef.current = null;
      return;
    }

    if (autoVerifyRef.current === otpCode) {
      return;
    }

    autoVerifyRef.current = otpCode;
    void verifyOtp();
  }, [activeTab, isForgotPasswordMode, otpCode, pending, step, verifyOtp]);

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
    googleUserIdRef.current = null;
    clearRecaptcha(recaptchaHostRef.current);
    recaptchaVerifierRef.current = null;
    verifyOtpLockRef.current = false;
    setGooglePhone("");
    clearStepErrors();
    setSuccessMessage(null);
    setResendTimer(0);
  }

  function handleTabChange(nextTab: AuthTab) {
    setActiveTab(nextTab);
    setCountryCode(nextTab === "otp-login" ? countryCode : "+91");
    clearResetState();
    resetOtpStep();
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
      await upsertGoogleUserProfile(signedInUser);
      const userDoc = await getUserProfile(signedInUser.uid);
      const savedPhone = userDoc?.phone?.trim() || "";

      if (savedPhone) {
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
      await saveUserWhatsappNumber(googleUserIdRef.current, formattedGooglePhone);
      await finishAuthSuccess("Login successful!");
    } catch (error) {
      setFeedback("Unable to save your number right now. You can skip and continue.");
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
          lastError = err;
          const code = err && typeof err === "object" && "code" in err ? String((err as any).code) : "";
          /* Wrong password on a real account → stop immediately */
          if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
            break;
          }
          /* user-not-found on this candidate → try next */
        }
      }

      if (signedIn) {
        await finishAuthSuccess("Login successful!");
        return;
      }

      const code = lastError && typeof lastError === "object" && "code" in lastError
        ? String((lastError as any).code)
        : "";

      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setFeedback("Incorrect password. Please try again.");
      } else if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setFeedback("No account found for this number. Please sign up first.");
      } else {
        setFeedback(getSanitizedErrorMessage(code, getFirebaseAuthErrorMessage(lastError)));
      }
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String((error as any).code) : "";
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
      const normalizedSignupPhone = normalizePhoneForAuth(phone);

      const verified = await confirmationResult.confirm(otpCode);
      const verifiedPhone = normalizePhoneForAuth(verified.user.phoneNumber || formattedPhone);
      const signupEmail = getFakeEmail(verifiedPhone);
      const credential = EmailAuthProvider.credential(signupEmail, signupPassword);
      const linked = await linkWithCredential(verified.user, credential);
      await updateProfile(linked.user, {
        displayName: fullName.trim(),
      });

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

      setSignupStep("form");
      setStep("phone");
      resetOtpInputs();
      await finishAuthSuccess("Account created successfully!");
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";

      if (code === "auth/email-already-in-use") {
        setFeedback("This mobile number is already registered.");
        setShowSignupGoToLogin(true);
      } else if (code === "auth/credential-already-in-use") {
        setFeedback("This mobile number is already registered.");
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
      const normalizedForgotPhone = normalizePhoneForAuth(phone);
      const primaryEmail = `${normalizedForgotPhone}@genznext.app`;
      setForgotPasswordEmail(primaryEmail);
    } catch (error) {
      setFeedback(getFirebaseAuthErrorMessage(error));
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
      const hasPasswordProvider = result.user.providerData.some((provider) => provider.providerId === "password");
      if (!hasPasswordProvider && forgotPasswordEmail) {
        const auth = getFirebaseAuth();
        const methods = auth ? await fetchSignInMethodsForEmail(auth, forgotPasswordEmail) : [];
        if (methods.includes("password")) {
          setOtpError("This account requires support verification. Please contact support.");
          setForgotPasswordStep("phone");
          setResetUser(null);
          return;
        }
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
    if (!resetUser) {
      setFeedback("Verify OTP before resetting your password.");
      return;
    }

    if (resetPasswordValue.length < 8) {
      setFeedback("Password must be at least 8 characters.");
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
      await updatePassword(resetUser, resetPasswordValue);

      const db = getFirebaseDb();
      if (db) {
        await setDoc(
          doc(db, "users", resetUser.uid),
          {
            passwordUpdatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }

      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
        await signInWithEmailAndPassword(auth, forgotPasswordEmail, resetPasswordValue);
        await signOut(auth);
      }

      const latestPhone = normalizePhoneForAuth(resetUser.phoneNumber || phone);
      setPhone(latestPhone);
      setLoginPassword("");
      clearResetState();
      setForgotPasswordEmail("");
      resetOtpStep();
      setActiveTab("password-login");
      setFeedback(null);
      setOtpError(null);
      setSuccessMessage("Password updated successfully. Please login.");
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
        setFeedback("Password updated, but validation login failed. Please try logging in again.");
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
              isModal ? "text-[#64748B] hover:text-[#4F46E5]" : "text-[#64748B] hover:text-[#0F172A]",
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
                  "focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]",
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
            <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
              <button
                type="button"
                onClick={() => void onResend()}
                disabled={pending || resendTimer > 0}
                className={cn(
                  "transition",
                  resendTimer > 0 || pending
                    ? "cursor-not-allowed text-[#475569]"
                    : "cursor-pointer font-medium text-[#4F46E5] hover:text-[#2563EB]",
                )}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={resetOtpStep}
                disabled={pending}
                className="text-[#64748B] transition hover:text-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={pending || otpCode.length !== otpLength}
            className={cn(
              isModal
                ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
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

  const showOtpPhoneState = activeTab === "otp-login" && step === "phone";
  const showOtpVerifyState = activeTab === "otp-login" && step === "otp";
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
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-[10px] py-[3px] text-[11px] text-[#4F46E5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                Free to join
              </div>
              <h2 className="text-[22px] font-bold text-[#0F172A]">{titleText}</h2>
              <p className="mt-2 text-[13px] text-[#475569]">{subtitleText}</p>
            </>
          ) : (
            <>
              <div className="section-label text-[#7C3AED]">
                {activeTab === "signup" ? "Sign Up" : isForgotPasswordMode ? "Reset Password" : "Login"}
              </div>
              <h2 className="mt-2 text-[26px] font-bold leading-[1.2] text-white">{titleText}</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#E2E8F0]">{subtitleText}</p>
            </>
          )}
        </div>
      </div>

      {!firebaseReady && (
        <div className="mt-6 rounded-[16px] border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-3 text-sm text-[#4338CA]">
          Firebase phone authentication is wired into the UI, but the Firebase public configuration is missing from the environment.
        </div>
      )}

      {user && !isForgotPasswordMode && !showGooglePhoneState ? (
        <div className="mt-6 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
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
            { id: "otp-login", label: "OTP Login" },
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
                    ? "bg-[linear-gradient(135deg,#6366F1,#4F46E5)] text-white font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.18)] -translate-y-[1px]"
                    : "bg-transparent text-[#64748B] hover:bg-[rgba(99,102,241,0.06)] hover:text-[#4F46E5]",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {showOtpPhoneState ? (
          <>
            <div>
              {!isModal ? (
                <label className="form-label text-[#E2E8F0]" htmlFor={`auth-phone-${variant}`}>
                  Mobile Number
                </label>
              ) : null}
              <div className={cn("grid gap-3", !isModal && "sm:grid-cols-[140px_1fr]")}>
                {!isModal ? (
                  <select
                    className="form-field"
                    value={countryCode}
                    onChange={(event) => {
                      setCountryCode(event.target.value);
                      clearAllFeedback();
                    }}
                    disabled={pending}
                  >
                    {countryCodes.map((option) => (
                      <option key={`${option.flag}-${option.value}`} value={option.value}>
                        {option.flag} {option.value}
                      </option>
                    ))}
                  </select>
                ) : null}
                {renderInput(
                  `auth-phone-${variant}`,
                  <Smartphone className="h-[15px] w-[15px]" />,
                  <input
                    id={`auth-phone-${variant}`}
                    className={cn(fieldClass, isModal && "pr-3 pl-9")}
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      clearAllFeedback();
                    }}
                    placeholder={isModal ? `${countryCode} Mobile number` : "Enter your mobile number"}
                    autoComplete="tel-national"
                    inputMode="tel"
                    disabled={pending}
                  />,
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void sendOtp()}
                disabled={pending || !firebaseReady || rateLimitSeconds > 0}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
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
          </>
        ) : null}

        {showOtpVerifyState ? renderOtpSection({
          onVerify: verifyOtp,
          onResend: async () => {
            await sendOtp(true);
          },
        }) : null}

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
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
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
                className="text-[12px] font-medium text-[#4F46E5] transition hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : null}

        {showSignupState ? (
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
                  <span className="rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] text-[#4F46E5]">Optional</span>
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
                      <ShieldCheck className="h-4 w-4 text-[#6366F1]" />
                      Secure verification
                    </div>
                    <p className="mt-1 text-[13px]">OTP sent to: {maskedPhone}</p>
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
                          "focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]",
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
                          : "cursor-pointer font-medium text-[#4F46E5] hover:text-[#6366F1]",
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
                disabled={pending || !firebaseReady || (showSignupOtpState && otpCode.length !== otpLength)}
                className={cn(
                  isModal
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {showSignupOtpState ? "Verifying..." : "Sending OTP..."}
                  </>
                ) : (
                  <>
                    {showSignupOtpState ? "Verify & Create Account" : "Send OTP"}
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
            </div>
          </>
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
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    {isModal ? <ArrowRight className="h-4 w-4" /> : null}
                  </>
                )}
              </button>
            </div>
            <div className="text-center text-[12px]">
              <button type="button" onClick={exitForgotPassword} className="font-medium text-[#4F46E5] hover:underline">
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
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("primary", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                {pending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    Reset Password
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
                    ? "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#6366F1,#4F46E5)] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
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

        {feedback && step !== "otp" && !(showForgotOtpState || showOtpVerifyState) ? (
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

        {showOtpPhoneState ? (
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
              className="font-medium text-[#4F46E5] hover:underline"
            >
              {activeTab === "signup" ? "Log in" : "Sign Up"}
            </button>
          </div>
        ) : null}

        {showOtpPhoneState ? (
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
