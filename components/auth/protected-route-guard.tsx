"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthReady, user } = useAuth();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthReady || user || redirectedRef.current) {
      return;
    }

    redirectedRef.current = true;
    const query = searchParams.toString();
    const redirectTarget = query ? `${pathname}?${query}` : pathname;
    router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
  }, [isAuthReady, pathname, router, searchParams, user]);

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
