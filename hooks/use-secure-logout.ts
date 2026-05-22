"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

export function useSecureLogout() {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const { clearCart } = useCart();

  return async function secureLogout() {
    try {
      await signOutUser();
      clearCart();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
}

