"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { getFirebaseAuth } from "@/lib/firebase";
import { latestOrderStorageKey } from "@/lib/order-success";

async function revokeServerSession() {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();

  if (!token) {
    return;
  }

  try {
    await fetch("/api/auth/revoke", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Session revocation failed:", error);
  }
}

export const logoutToastSessionKey = "genznext-logout-toast";

const KEYS_TO_CLEAR = [
  "genznext-cart",
  "genznext-order",
  "genznext-my-learning",
  "enrolledCourses",
  "genznext-enrolled",
  "lastVisited",
  CART_STORAGE_KEY,
  latestOrderStorageKey,
  "cart",
];

export function useSecureLogout() {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const { clearCart } = useCart();

  return async function secureLogout() {
    await revokeServerSession();

    try {
      await signOutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    clearCart();

    if (typeof window !== "undefined") {
      KEYS_TO_CLEAR.forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });

      window.localStorage.clear();
      window.sessionStorage.clear();
    }

    router.replace("/");
  };
}
