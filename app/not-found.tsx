import Link from "next/link";
import { BookOpenCheck, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* 404 badge */}
        <span className="inline-flex items-center rounded-full border border-[#C8D7EE] bg-[#EAF0FA] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B2E6B]">
          404 — Page Not Found
        </span>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
          Oops! This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-[#475569]">
          The page you&apos;re looking for may have moved, been renamed, or never existed. Let&apos;s get you back on track.
        </p>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0B2E6B,#15407E)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.28)] transition hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/workshops/ai-developer-launch-lab"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#0B2E6B]/30 hover:text-[#0B2E6B]"
          >
            <BookOpenCheck className="h-4 w-4" /> Join Workshop
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#0B2E6B]/30 hover:text-[#0B2E6B]"
          >
            <Search className="h-4 w-4" /> View Programs
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-10 h-px max-w-xs bg-[#E2E8F0]" />
        <p className="mt-6 text-sm text-[#64748B]">
          Still can&apos;t find what you need?{" "}
          <Link href="/contact" className="font-semibold text-[#0B2E6B] hover:underline">
            Contact our team
          </Link>
          {" "}and we&apos;ll help.
        </p>
      </div>
    </section>
  );
}
