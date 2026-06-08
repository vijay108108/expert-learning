"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { getFirebaseAuth, getUserProfile, type AppUserProfile } from "@/lib/firebase";
import { env } from "@/lib/env";

const ADMIN_SESSION_KEY = "gz_admin_pin_auth";
const ADMIN_PIN         = process.env.NEXT_PUBLIC_ADMIN_PIN || "GZAdmin2026";

function normalizePhone(v: string | null | undefined) {
  return (v || "").replace(/\D/g, "").slice(-10);
}

function isAdminProfile(
  profile: AppUserProfile | null,
  email: string | null | undefined,
  phone: string | null | undefined,
) {
  if (profile?.role === "admin") return true;
  const e = (email || "").trim().toLowerCase();
  if (e && env.adminEmails.includes(e)) return true;
  const p = normalizePhone(phone || profile?.phone);
  if (p && env.adminPhones.map(normalizePhone).includes(p)) return true;
  return false;
}

/* ── PIN login screen ────────────────────────────────────── */
function AdminPinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin]         = useState("");
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState("");
  const [shaking, setShaking] = useState(false);

  async function attempt() {
    if (pin === ADMIN_PIN) {
      try { sessionStorage.setItem(ADMIN_SESSION_KEY, "1"); } catch { /* ignore */ }
      /* Sign in to Firebase anonymously so Firestore operations work */
      try {
        const auth = getFirebaseAuth();
        if (auth && !auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch { /* ignore — Firestore rules may still work with if true */ }
      onSuccess();
    } else {
      setError("Incorrect PIN. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPin("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060B14] px-4">
      <div
        className={`w-full max-w-sm overflow-hidden rounded-[24px] border border-white/10 bg-[#0D1117] shadow-[0_32px_80px_rgba(0,0,0,0.5)] transition-transform ${shaking ? "animate-[shake_0.4s_ease]" : ""}`}
      >
        <div className="h-1 w-full bg-[linear-gradient(90deg,#9333EA,#4F46E5,#0EA5E9)]" />

        <div className="p-8">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)]">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>

          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-[#9333EA]">GenZNext</p>
          <h1 className="mt-1 text-center text-[22px] font-extrabold text-white">Admin Panel</h1>
          <p className="mt-2 text-center text-[13px] text-[#64748B]">Enter the admin PIN to continue</p>

          {/* PIN input */}
          <div className="relative mt-6">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#475569]" />
            <input
              type={show ? "text" : "password"}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && attempt()}
              placeholder="Enter admin PIN"
              autoFocus
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 text-[14px] text-white placeholder:text-[#334155] outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/20"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#475569] hover:text-white"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <p className="mt-2 text-center text-[12px] text-[#EF4444]">{error}</p>
          )}

          <button
            type="button"
            onClick={attempt}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] py-3 text-[14px] font-bold text-white shadow-[0_8px_24px_rgba(147,51,234,0.3)] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldCheck className="h-4 w-4" /> Enter Admin Panel
          </button>

          <p className="mt-4 text-center text-[11px] text-[#334155]">
            Contact the platform admin for access.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

/* ── Guard ───────────────────────────────────────────────── */
export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useAuth();

  /* PIN session check (fastest — no Firebase needed) */
  const [pinAuth, setPinAuth] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!pinAuth) {
      return;
    }

    void (async () => {
      try {
        const auth = getFirebaseAuth();
        if (auth && !auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch { /* ignore */ }
    })();
  }, [pinAuth]);

  /* Firebase role check (secondary) */
  const [firebaseAdmin, setFirebaseAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthReady || !user) {
      return;
    }
    let active = true;
    void (async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (active) setFirebaseAdmin(isAdminProfile(profile, user.email, user.phoneNumber));
      } catch {
        if (active) setFirebaseAdmin(false);
      }
    })();
    return () => { active = false; };
  }, [isAuthReady, user]);

  /* Allow if: PIN authenticated OR Firebase admin */
  const allowed = pinAuth || firebaseAdmin === true;

  if (!allowed) {
    return (
      <AdminPinScreen
        onSuccess={() => setPinAuth(true)}
      />
    );
  }

  return <>{children}</>;
}
