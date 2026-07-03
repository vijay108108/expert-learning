"use client";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="rounded-xl border border-[#1E293B] bg-[#0D1117] px-5 py-2.5 text-sm font-semibold text-[#64748B] transition hover:text-white"
    >
      Retry
    </button>
  );
}
