"use client";

import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut,
  type User,
} from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, type AuthContextValue, type AuthModalMode } from "@/components/auth/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(() => !isFirebaseConfigured());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AuthModalMode>("choice");
  const [redirectAfterAuth, setRedirectAfterAuth] = useState("/dashboard");
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void | Promise<void>) | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      return;
    }

    let active = true;
    let unsubscribe: () => void = () => undefined;

    async function connect(currentAuth: NonNullable<typeof auth>) {
      try {
        await setPersistence(currentAuth, browserLocalPersistence);
      } catch {
        // Firebase falls back gracefully when persistence cannot be set.
      }

      unsubscribe = onAuthStateChanged(currentAuth, (nextUser) => {
        if (!active) {
          return;
        }

        setUser(nextUser);
        setIsAuthReady(true);
      });
    }

    void connect(auth);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const openAuthModal = useCallback((
    mode: AuthModalMode,
    redirectTo = "/dashboard",
    onAuthenticated?: (() => void | Promise<void>) | null,
  ) => {
    const auth = getFirebaseAuth();
    const activeUser = auth?.currentUser || user;

    if (isAuthReady && activeUser) {
      setIsModalOpen(false);
      setPendingAuthAction(null);
      router.replace(redirectTo);
      return;
    }

    setModalMode(mode);
    setRedirectAfterAuth(redirectTo);
    if (onAuthenticated !== undefined) {
      setPendingAuthAction(() => onAuthenticated ?? null);
    }
    setIsModalOpen(true);
  }, [isAuthReady, router, user]);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAuthAction(null);
  }, []);

  const handleAuthSuccess = useCallback(async () => {
    if (!pendingAuthAction) {
      return false;
    }

    const action = pendingAuthAction;
    setPendingAuthAction(null);
    await action();
    return true;
  }, [pendingAuthAction]);

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();

    if (!auth) {
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
    } finally {
      setUser(null);
      setPendingAuthAction(null);
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isModalOpen) {
      return;
    }

    const auth = getFirebaseAuth();
    const activeUser = auth?.currentUser || user;

    if (!activeUser) {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      setIsModalOpen(false);
      setPendingAuthAction(null);
      router.replace(redirectAfterAuth);
    }, 0);

    return () => window.clearTimeout(redirectTimer);
  }, [isAuthReady, isModalOpen, redirectAfterAuth, router, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthReady,
      isModalOpen,
      modalMode,
      redirectAfterAuth,
      openAuthModal,
      closeAuthModal,
      handleAuthSuccess,
      signOutUser,
    }),
    [closeAuthModal, handleAuthSuccess, isAuthReady, isModalOpen, modalMode, openAuthModal, redirectAfterAuth, signOutUser, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}
