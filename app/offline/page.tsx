"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RetryButton } from "./retry-button";

export default function OfflinePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator.onLine) {
      router.replace("/");
    }
  }, [router]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-4 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1E293B]">
        <WifiOff className="h-9 w-9 text-[#4F46E5]" />
      </div>
      <h1 className="text-2xl font-bold text-white">You&apos;re offline</h1>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-[#64748B]">
        No internet connection detected. If you are back online, this page will return to the homepage automatically.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
        >
          Open Homepage
        </Link>
        <RetryButton />
      </div>
    </section>
  );
}
