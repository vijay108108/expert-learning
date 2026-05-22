"use client";

import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthModalMode = "login" | "signup";

export type AuthContextValue = {
  user: User | null;
  isAuthReady: boolean;
  isModalOpen: boolean;
  modalMode: AuthModalMode;
  redirectAfterAuth: string;
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
