"use client";

import { ArrowRight, LockKeyhole, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { useCart } from "@/hooks/use-cart";
import { iconMap } from "@/lib/icon-map";

export function CartPage() {
  const { courses, count, hydrated, removeCourse, totalPaise, totalLabel } = useCart();

  if (!hydrated) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="surface-form rounded-[26px] p-8 text-center">
            <div className="text-sm text-[#CBD5E1]">Loading your cart...</div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="surface-form rounded-[28px] px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] border border-[#15407E]/20 bg-[rgba(249,115,22,0.12)] text-[#E56F12] shadow-[0_18px_36px_rgba(249,115,22,0.12)]">
              <ShoppingBag className="h-9 w-9" />
            </div>
            <h2 className="mt-6 text-[30px] font-bold text-white">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#CBD5E1]">
              Start building your cloud and AI learning path by adding a course to your cart.
            </p>
            <div className="mt-7">
              <ButtonLink href="/courses" className="px-6">
                Explore Courses
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="surface-form rounded-[28px] p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#0B2E6B]">MY CART</div>
              <h2 className="mt-2 text-[28px] font-bold text-white">Review your selected programs</h2>
              <p className="mt-2 text-sm leading-7 text-[#CBD5E1]">
                {count} course{count > 1 ? "s" : ""} ready for a secure checkout.
              </p>
            </div>
            <div className="shrink-0 rounded-[10px] border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.1)] px-4 py-2 text-[14px] font-semibold text-[#0B2E6B]">
              {totalLabel}
            </div>
          </div>

          <div className="space-y-4">
            {courses.map((course) => {
              const Icon = iconMap[course.icon];

              return (
                <article
                  key={course.slug}
                  className="surface-card flex flex-col gap-4 rounded-[22px] border border-white/10 p-4 transition-all duration-200 hover:border-[#15407E]/30 hover:shadow-[0_16px_34px_rgba(2,8,28,0.22)] sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(249,115,22,0.14)] text-[#0B2E6B]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[18px] font-semibold text-white">{course.title}</div>
                      <p className="mt-1 text-sm leading-6 text-[#CBD5E1]">{course.subtitle}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="mono-tag rounded-[8px] border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-[#CBD5E1]">
                          {course.duration}
                        </span>
                        <span className="mono-tag rounded-[8px] border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-[#CBD5E1]">
                          {course.level}
                        </span>
                        {course.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="mono-tag rounded-[8px] border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-[#CBD5E1]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <div className="mono-meta text-[18px] font-semibold text-[#E56F12]">{course.price}</div>
                    <button
                      type="button"
                      onClick={() => removeCourse(course.slug)}
                      className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#1E2D42] bg-transparent px-2 py-1 text-[11px] text-[#475569] transition hover:border-[rgba(239,68,68,0.3)] hover:text-[#EF4444]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#1E2D42] bg-[#111827] px-[18px] py-[14px]">
            <div>
              <div className="text-sm font-semibold text-[#64748B]">Continue exploring</div>
              <div className="text-[13px] text-[#475569]">Add more certifications before you checkout</div>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.08)] px-4 py-2 text-sm font-medium text-[#0B2E6B] transition hover:bg-[rgba(249,115,22,0.12)]"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0B2E6B] px-5 py-[13px] text-[15px] font-semibold text-white transition hover:bg-[#092552]"
          >
            <LockKeyhole className="h-4.5 w-4.5" />
            Proceed to Checkout — ₹{Math.round(totalPaise / 100).toLocaleString("en-IN")}
          </Link>
        </div>
      </div>
    </section>
  );
}
