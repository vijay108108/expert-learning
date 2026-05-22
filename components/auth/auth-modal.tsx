"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { PhoneAuthFlow } from "@/components/auth/phone-auth-flow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAuth } from "@/hooks/use-auth";

export function AuthModal() {
  const { closeAuthModal, handleAuthSuccess, isModalOpen, modalMode, redirectAfterAuth } = useAuth();
  const reducedMotion = useReducedMotion();

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

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.7)] px-4 py-6 backdrop-blur-[4px]"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
            className="relative w-full max-w-[400px] overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#111827] p-7 shadow-[0_28px_80px_rgba(2,8,28,0.34)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute top-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] text-[#64748B] transition hover:border-[rgba(255,255,255,0.18)] hover:text-[#CBD5E1]"
              aria-label="Close authentication modal"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <PhoneAuthFlow
              key={modalMode}
              mode={modalMode}
              variant="modal"
              redirectTo={redirectAfterAuth}
              onSuccess={handleAuthSuccess}
              onClose={closeAuthModal}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
