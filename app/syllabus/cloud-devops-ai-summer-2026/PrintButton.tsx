"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-4 py-2 text-[13px] font-bold text-white"
    >
      Download PDF
    </button>
  );
}
