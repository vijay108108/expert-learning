"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthReady, openAuthModal, user } = useAuth();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthReady || user || redirectedRef.current) {
      return;
    }

    redirectedRef.current = true;
    openAuthModal("login", pathname);
    router.replace("/");
  }, [isAuthReady, openAuthModal, pathname, router, user]);

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

