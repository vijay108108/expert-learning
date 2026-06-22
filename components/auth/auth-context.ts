"use client";

import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthModalMode = "login" | "signup" | "choice";

export type AuthContextValue = {
  user: User | null;
  isAuthReady: boolean;
  isModalOpen: boolean;
  modalMode: AuthModalMode;
  redirectAfterAuth: string;
  setSuppressAutoRedirect: (suppressed: boolean) => void;
  openAuthModal: (
    mode: AuthModalMode,
    redirectTo?: string,
    onAuthenticated?: (() => void | Promise<void>) | null,
  ) => void;
  closeAuthModal: () => void;
  handleAuthSuccess: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
