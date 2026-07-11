"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PhoneAuthFlow } from "@/components/auth/phone-auth-flow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAuth } from "@/hooks/use-auth";

export function AuthModal() {
  const { closeAuthModal, handleAuthSuccess, isModalOpen, modalMode, openAuthModal, redirectAfterAuth } = useAuth();
  const reducedMotion = useReducedMotion();
  const [isAuthBusy, setIsAuthBusy] = useState(false);

  const handleClose = useCallback(() => {
    setIsAuthBusy(false);
    closeAuthModal();
  }, [closeAuthModal]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      if (isAuthBusy) {
        event.preventDefault();
        return;
      }
      handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isAuthBusy, isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-3 py-4 backdrop-blur-[8px] sm:px-4 sm:py-6"
          onClick={isAuthBusy ? undefined : handleClose}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
            className="relative h-[min(660px,90vh)] w-full max-w-[1000px] overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isAuthBusy}
              className="absolute top-4 right-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.75)] text-[#64748B] backdrop-blur-[10px] transition hover:bg-white hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-55"
              aria-label="Close authentication modal"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {isAuthBusy ? (
              <div className="pointer-events-none absolute top-4 left-4 z-20 rounded-full border border-[#E2E8F0] bg-white/90 px-3 py-1 text-[11px] font-medium text-[#0B2E6B]">
                Verification in progress...
              </div>
            ) : null}
            <div className="grid h-full min-h-0 lg:grid-cols-[45fr_55fr]">
              <div className="h-full min-h-0 overflow-y-auto bg-white px-5 py-7 pr-1.5 sm:px-8 sm:py-8 sm:pr-2 lg:px-12 lg:py-11 lg:pr-3 [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin]">
                {modalMode === "choice" ? (
                  <div className="mx-auto flex h-full w-full max-w-[460px] flex-col justify-center">
                    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
                      <h2 className="text-[26px] font-bold tracking-[-0.02em] text-[#0F172A]">Continue to Enrollment</h2>
                      <p className="mt-2 text-sm leading-7 text-[#475569]">
                        Login if you already have an account, or create a new account to continue.
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => openAuthModal("login", redirectAfterAuth)}
                          className="inline-flex h-[50px] items-center justify-center rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                        >
                          Login
                        </button>
                        <button
                          type="button"
                          onClick={() => openAuthModal("signup", redirectAfterAuth)}
                          className="inline-flex h-[50px] items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#1B4C92,#0B2E6B)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.18)] transition hover:shadow-[0_14px_30px_rgba(99,102,241,0.24)]"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PhoneAuthFlow
                    key={modalMode}
                    mode={modalMode}
                    variant="modal"
                    redirectTo={redirectAfterAuth}
                    onSuccess={handleAuthSuccess}
                    onClose={closeAuthModal}
                    onPendingChange={setIsAuthBusy}
                  />
                )}
              </div>

              <aside className="relative hidden h-full overflow-hidden lg:block">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#EAF0FA_0%,#DCE7F7_45%,#F8FAFC_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.12),transparent_35%)]" />

                <div className="relative flex h-full flex-col justify-between px-10 py-10">
                  <div className="inline-flex w-fit items-center rounded-full border border-[#E2E8F0] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B2E6B]">
                    GenZNext Learning
                  </div>

                  <div>
                    <h3 className="max-w-[15ch] text-[38px] font-bold leading-tight tracking-[-0.02em] text-[#0F172A]">
                      Get Certified. Get Ahead.
                    </h3>
                    <p className="mt-4 max-w-[44ch] text-[15px] leading-7 text-[#475569]">
                      Master AI, Cloud, DevOps &amp; Generative AI with industry-ready learning.
                    </p>

                    <div className="mt-8 space-y-3">
                      {[
                        "6,000+ learners",
                        "Live mentorship",
                        "Certification support",
                        "Real-world projects",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-[14px] border border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.72)] px-4 py-2.5 text-[#334155] shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5">
                          <CheckCircle2 className="h-4 w-4 text-[#0B2E6B]" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
