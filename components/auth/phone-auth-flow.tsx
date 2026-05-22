"use client";

import {
  type ConfirmationResult,
  GoogleAuthProvider,
  type RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck, Smartphone, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clearRecaptcha,
  getFirebaseAuth,
  getFirebaseAuthErrorMessage,
  getRecaptchaVerifier,
  getUserProfile,
  isFirebaseConfigured,
  recaptchaContainerId,
  saveUserWhatsappNumber,
  upsertGoogleUserProfile,
} from "@/lib/firebase";
import { buttonLinkClasses } from "@/components/ui/button-link";
import { useAuth } from "@/hooks/use-auth";
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

type PhoneAuthFlowProps = {
  mode: "login" | "signup";
  variant?: "modal" | "page";
  redirectTo?: string;
  onSuccess?: () => boolean | Promise<boolean>;
  onClose?: () => void;
};

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
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

export function PhoneAuthFlow({
  mode,
  variant = "modal",
  redirectTo = "/dashboard",
  onSuccess,
  onClose,
}: PhoneAuthFlowProps) {
  const router = useRouter();
  const { openAuthModal, user } = useAuth();
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const sendOtpLockRef = useRef(false);
  const autoVerifyRef = useRef<string | null>(null);
  const googleUserIdRef = useRef<string | null>(null);

  const [countryCode, setCountryCode] = useState("+91");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array.from({ length: otpLength }, () => ""));
  const [step, setStep] = useState<AuthStep>("phone");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [googlePhone, setGooglePhone] = useState("");

  const firebaseReady = isFirebaseConfigured();
  const otpCode = otp.join("");
  const formattedPhone = useMemo(() => `${countryCode}${normalizePhone(phone)}`, [countryCode, phone]);
  const maskedPhone = useMemo(() => maskPhoneNumber(formattedPhone), [formattedPhone]);
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
    return () => {
      clearRecaptcha();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const logFirebaseAuthError = useCallback((stage: string, error: unknown) => {
    console.error(`[Firebase Phone Auth] ${stage} failed`, {
      error,
      code: typeof error === "object" && error && "code" in error ? error.code : undefined,
      message: typeof error === "object" && error && "message" in error ? error.message : undefined,
      mode,
      phone: formattedPhone,
      step,
      hostname: typeof window !== "undefined" ? window.location.hostname : undefined,
    });
  }, [formattedPhone, mode, step]);

  function validatePhone() {
    const digits = normalizePhone(phone);

    if (mode === "signup" && !fullName.trim()) {
      return "Enter your full name to continue.";
    }

    if (digits.length < 8 || digits.length > 14) {
      return "Enter a valid mobile number to continue.";
    }

    return null;
  }

  const finishAuthSuccess = useCallback(async (message = "Login successful!") => {
    setSuccessMessage(message);
    clearRecaptcha();
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
      console.info("[Firebase Phone Auth] duplicate OTP send prevented at UI layer", {
        mode,
        phone: formattedPhone,
        isResend,
      });
      return;
    }

    const validationMessage = validatePhone();

    if (validationMessage) {
      setFeedback(validationMessage);
      return;
    }

    if (!getFirebaseAuth()) {
      setFeedback(
        "Firebase phone authentication is not configured yet. Add the Firebase public keys to enable OTP login.",
      );
      return;
    }

    if (rateLimitSeconds > 0) {
      setFeedback(`Firebase temporarily blocked OTP requests. Try again in ${rateLimitSeconds}s.`);
      return;
    }

    sendOtpLockRef.current = true;
    setPending(true);
    setFeedback(null);
    setSuccessMessage(null);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error("Firebase auth is not available.");
      }

      clearRecaptcha();
      recaptchaVerifierRef.current = null;

      const verifier = getRecaptchaVerifier(auth);
      recaptchaVerifierRef.current = verifier;

      confirmationResultRef.current = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      console.log("[Firebase Phone Auth] OTP sent successfully");
      setStep("otp");
      setOtp(Array.from({ length: otpLength }, () => ""));
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

      clearRecaptcha();
      recaptchaVerifierRef.current = null;

      if (code === "auth/invalid-phone-number") {
        setFeedback("Invalid phone number. Use +91XXXXXXXXXX format");
      } else if (code === "auth/too-many-requests") {
        setFeedback("Too many attempts. Please try again later.");
      } else {
        setFeedback(getFirebaseAuthErrorMessage(error));
      }
    } finally {
      sendOtpLockRef.current = false;
      setPending(false);
    }
  }

  const verifyOtp = useCallback(async () => {
    if (otpCode.length !== otpLength) {
      setFeedback("Enter the complete 6-digit OTP.");
      return;
    }

    const confirmationResult = confirmationResultRef.current;
    if (!confirmationResult) {
      setFeedback("Request a new OTP to continue.");
      return;
    }

    setPending(true);
    setFeedback(null);

    try {
      const result = await confirmationResult.confirm(otpCode);
      console.info("[Firebase Phone Auth] OTP verified successfully", {
        uid: result.user.uid,
        phone: result.user.phoneNumber,
        mode,
      });

      if (mode === "signup" && fullName.trim()) {
        await updateProfile(result.user, {
          displayName: fullName.trim(),
        });
      }

      await finishAuthSuccess("Login successful!");
    } catch (error) {
      autoVerifyRef.current = null;
      logFirebaseAuthError("verifyOtp", error);
      setFeedback(getFirebaseAuthErrorMessage(error));
    } finally {
      setPending(false);
    }
  }, [finishAuthSuccess, fullName, logFirebaseAuthError, mode, otpCode]);

  useEffect(() => {
    if (step !== "otp" || pending) {
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
  }, [otpCode, pending, step, verifyOtp]);

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < otpLength - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
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
    const focusIndex = Math.min(pasted.length, otpLength - 1);
    otpInputRefs.current[focusIndex]?.focus();
  }

  const isModal = variant === "modal";

  function switchMode(nextMode: "login" | "signup") {
    openAuthModal(nextMode, redirectTo);
  }

  function resetOtpStep() {
    setStep("phone");
    setOtp(Array.from({ length: otpLength }, () => ""));
    confirmationResultRef.current = null;
    googleUserIdRef.current = null;
    clearRecaptcha();
    recaptchaVerifierRef.current = null;
    autoVerifyRef.current = null;
    setGooglePhone("");
    setFeedback(null);
    setSuccessMessage(null);
    setResendTimer(0);
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

      console.error("Google sign-in failed:", error);
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
      console.error("Saving WhatsApp number failed:", error);
      setFeedback("Unable to save your number right now. You can skip and continue.");
    } finally {
      setPending(false);
    }
  }

  async function handleGooglePhoneSkip() {
    await finishAuthSuccess("Login successful!");
  }

  function renderInput(
    id: string,
    icon: ReactNode,
    input: ReactNode,
  ) {
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
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] px-[10px] py-[3px] text-[11px] text-[#FB923C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                Free to join
              </div>
              <h2 className="text-[20px] font-bold text-[#F1F5F9]">
                {mode === "login" ? "Log in to GenZNext" : "Create your account"}
              </h2>
              <p className="mt-2 text-[12px] text-[#475569]">
                Join 4,200+ students already learning on GenZNext
              </p>
            </>
          ) : (
            <>
              <div className="section-label text-[#FDBA74]">{mode === "login" ? "Login" : "Sign Up"}</div>
              <h2 className="mt-2 text-[26px] font-bold leading-[1.2] text-white">
                {mode === "login" ? "Continue with mobile OTP" : "Create your account with OTP"}
              </h2>
              <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#E2E8F0]">
                Secure your learning account with Firebase phone authentication and a one-time verification code.
              </p>
            </>
          )}
        </div>
      </div>

      {!firebaseReady && (
        <div className="mt-6 rounded-[18px] border border-[#FB923C]/26 bg-[#F97316]/12 px-4 py-3 text-sm text-[#FDBA74]">
          Firebase phone authentication is wired into the UI, but the Firebase public configuration is missing from the environment.
        </div>
      )}

      {user && (
        <div className="mt-6 rounded-[22px] border border-[#FB923C]/16 bg-white/8 p-4">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/16 text-[#FDBA74]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">You are already signed in</div>
              <div className="mt-1 text-sm text-[#E2E8F0]">
                {user.phoneNumber || user.displayName || "Active session detected."}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn("space-y-5", isModal ? "mt-6" : "mt-6")}>
        {mode === "signup" && step === "phone" && (
          <div>
            {!isModal ? (
              <label className="form-label text-[#E2E8F0]" htmlFor={`auth-name-${variant}`}>
                Full Name
              </label>
            ) : null}
            {renderInput(
              `auth-name-${variant}`,
              <User2 className="h-[15px] w-[15px]" />,
              <input
                id={`auth-name-${variant}`}
                className={cn(
                  "form-field",
                  isModal &&
                    "w-full rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] py-[10px] pr-3 pl-9 text-[13px] text-[#F1F5F9] placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.4)] focus:bg-[rgba(249,115,22,0.03)]",
                )}
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setFeedback(null);
                }}
                placeholder="Full name"
                autoComplete="name"
              />,
            )}
          </div>
        )}

        {step !== "google-phone" ? (
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
                  setFeedback(null);
                }}
                disabled={step === "otp" || pending}
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
                className={cn(
                  "form-field",
                  isModal &&
                    "w-full rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] py-[10px] pr-3 pl-9 text-[13px] text-[#F1F5F9] placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.4)] focus:bg-[rgba(249,115,22,0.03)]",
                )}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setFeedback(null);
                }}
                placeholder={isModal ? `${countryCode} Mobile number` : "Enter your mobile number"}
                autoComplete="tel-national"
                inputMode="tel"
                disabled={step === "otp" || pending}
              />,
            )}
          </div>
        </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className={cn("text-sm font-semibold", isModal ? "text-[#F1F5F9]" : "text-white")}>
                One last step!
              </div>
              <p className={cn("mt-1 text-[12px] leading-5", isModal ? "text-[#64748B]" : "text-[#E2E8F0]")}>
                Add WhatsApp number for batch joining link &amp; updates
              </p>
            </div>
            {renderInput(
              `google-phone-${variant}`,
              <Smartphone className="h-[15px] w-[15px]" />,
              <input
                id={`google-phone-${variant}`}
                className={cn(
                  "form-field",
                  isModal &&
                    "w-full rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] py-[10px] pr-3 pl-9 text-[13px] text-[#F1F5F9] placeholder:text-[#334155] focus:border-[rgba(249,115,22,0.4)] focus:bg-[rgba(249,115,22,0.03)]",
                )}
                value={googlePhone}
                onChange={(event) => {
                  setGooglePhone(event.target.value);
                  setFeedback(null);
                }}
                placeholder="+91 mobile number"
                autoComplete="tel"
                inputMode="tel"
                disabled={pending}
              />,
            )}
          </div>
        )}

        {step === "otp" && (
          <div>
            <label className={cn("form-label", isModal ? "text-[#94A3B8]" : "text-[#E2E8F0]")} htmlFor={`otp-0-${variant}`}>
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
                    "h-12 w-11 rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-center text-[20px] font-semibold text-[#F1F5F9] outline-none transition",
                    "focus:border-[rgba(249,115,22,0.4)] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)]",
                  )}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={value}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <p className={cn("text-sm", isModal ? "text-[#CBD5E1]" : "text-[#E2E8F0]")}>OTP sent to {maskedPhone}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
                <button
                  type="button"
                  onClick={() => void sendOtp(true)}
                  disabled={pending || resendTimer > 0}
                  className={cn(
                    "transition",
                    resendTimer > 0 || pending
                      ? "cursor-not-allowed text-[#475569]"
                      : "cursor-pointer font-medium text-[#F97316] hover:text-[#FB923C]",
                  )}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
                <button
                  type="button"
                  onClick={resetOtpStep}
                  disabled={pending}
                  className="text-[#94A3B8] transition hover:text-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Change number
                </button>
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={cn(
              "rounded-[16px] px-4 py-3 text-sm",
              isModal
                ? "border border-[rgba(248,113,113,0.18)] bg-[rgba(127,29,29,0.18)] text-[#FCA5A5]"
                : "border border-rose-200 bg-rose-50 text-rose-700",
            )}
          >
            {feedback}
          </div>
        )}

        {successMessage && (
          <div
            className={cn(
              "rounded-[16px] px-4 py-3 text-sm",
              isModal
                ? "border border-[rgba(16,185,129,0.18)] bg-[rgba(6,78,59,0.18)] text-[#6EE7B7]"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700",
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              {successMessage}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {step === "phone" ? (
            <button
              type="button"
              onClick={() => void sendOtp()}
              disabled={pending || !firebaseReady || rateLimitSeconds > 0}
              className={cn(
                isModal
                  ? "inline-flex w-full items-center justify-center gap-2 rounded-[8px] border-0 bg-[#F97316] px-4 py-[11px] text-[14px] font-semibold text-white transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-70"
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
          ) : step === "otp" ? (
            <>
              <button
                type="button"
                onClick={() => void verifyOtp()}
                disabled={pending || otpCode.length !== otpLength}
                className={cn(
                  isModal
                    ? "inline-flex w-full items-center justify-center gap-2 rounded-[8px] border-0 bg-[#F97316] px-4 py-[11px] text-[14px] font-semibold text-white transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-70"
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
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void handleGooglePhoneSave()}
                disabled={pending}
                className={cn(
                  isModal
                    ? "inline-flex w-full items-center justify-center gap-2 rounded-[8px] border-0 bg-[#F97316] px-4 py-[11px] text-[14px] font-semibold text-white transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-70"
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
                    ? "inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-transparent px-4 py-[11px] text-[13px] text-[#94A3B8] transition hover:border-[rgba(255,255,255,0.2)] hover:text-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-70"
                    : buttonLinkClasses("outline", "w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"),
                )}
              >
                Skip for now
              </button>
            </>
          )}
        </div>
        {isModal && step === "phone" ? (
          <>
            <div className="flex items-center gap-[10px]">
              <div className="h-px flex-1 bg-[rgba(255,255,255,0.08)]" />
              <span className="text-[11px] text-[#334155]">or continue with</span>
              <div className="h-px flex-1 bg-[rgba(255,255,255,0.08)]" />
            </div>
            <button
              type="button"
              onClick={() => void handleGoogleSignIn()}
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-transparent px-4 py-[10px] text-[13px] text-[#94A3B8] transition hover:border-[rgba(255,255,255,0.2)] hover:text-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path fill="#EA4335" d="M12 10.2v3.9h5.42c-.24 1.26-.95 2.32-2 3.03l3.24 2.51c1.89-1.74 2.98-4.29 2.98-7.32 0-.71-.06-1.39-.18-2.04H12Z" />
                <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.24-2.51c-.9.6-2.05.95-3.39.95-2.61 0-4.82-1.77-5.61-4.14H3.04v2.6A10 10 0 0 0 12 22Z" />
                <path fill="#4A90E2" d="M6.39 13.86A5.99 5.99 0 0 1 6.08 12c0-.64.11-1.25.31-1.86v-2.6H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.46l3.35-2.6Z" />
                <path fill="#FBBC05" d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.04 7.54l3.35 2.6C7.18 7.75 9.39 5.98 12 5.98Z" />
              </svg>
              Continue with Google
            </button>
            <div className="text-center text-[12px] text-[#475569]">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-[#F97316]"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </div>
            <p className="text-center text-[11px] leading-5 text-[#334155]">
              By continuing you agree to our{" "}
              <span className="text-[#475569] underline">Terms of Service</span> and{" "}
              <span className="text-[#475569] underline">Privacy Policy</span>
            </p>
          </>
        ) : null}
      </div>
      <div
        id={recaptchaContainerId}
        aria-hidden="true"
        className="pointer-events-none h-px w-px overflow-hidden opacity-0"
      />
    </div>
  );
}
