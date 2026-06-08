"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-2 text-[13px] font-bold text-white"
    >
      Download PDF
    </button>
  );
}
