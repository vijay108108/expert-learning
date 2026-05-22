"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonLinkClasses } from "@/components/ui/button-link";
import { useCart } from "@/hooks/use-cart";
import { iconMap } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

export function FloatingCart() {
  const [open, setOpen] = useState(false);
  const { courses, count, hydrated, removeCourse, totalLabel } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-40 z-50 inline-flex h-[56px] w-[56px] items-center justify-center rounded-[18px] border border-[#FB923C]/28 bg-[linear-gradient(180deg,rgba(7,20,43,0.94),rgba(11,28,52,0.96))] text-white shadow-[0_18px_34px_rgba(2,8,28,0.34),0_0_26px_rgba(249,115,22,0.18)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#FB923C]/44 hover:shadow-[0_22px_40px_rgba(2,8,28,0.38),0_0_30px_rgba(249,115,22,0.24)] md:bottom-[5.5rem]"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-5 w-5 text-[#FDBA74]" />
        <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-[24px] items-center justify-center rounded-full border border-[#FDBA74]/24 bg-[linear-gradient(135deg,#F97316,#FB923C)] px-1.5 py-1 text-[11px] font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.26)]">
          {count}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.55)] backdrop-blur-sm"
            />
            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-4 right-4 bottom-4 z-[61] flex w-[calc(100vw-2rem)] max-w-[410px] flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,20,43,0.96),rgba(11,28,52,0.98))] shadow-[0_28px_60px_rgba(2,8,28,0.42),0_0_30px_rgba(249,115,22,0.08)] backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5">
                <div>
                  <div className="section-label text-[#FDBA74]">My Cart</div>
                  <h2 className="mt-2 text-[24px] font-bold text-white">Course checkout</h2>
                  <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
                    {hydrated ? `${count} selected course${count === 1 ? "" : "s"}` : "Loading cart..."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/70 transition hover:border-[#FB923C]/40 hover:bg-white/10 hover:text-[#FDBA74]"
                  aria-label="Close cart panel"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {!hydrated ? (
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-[#CBD5E1]">
                    Loading your cart...
                  </div>
                ) : courses.length === 0 ? (
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#FB923C]/20 bg-[rgba(249,115,22,0.12)] text-[#FDBA74] shadow-[0_16px_30px_rgba(249,115,22,0.12)]">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-[22px] font-semibold text-white">Your cart is empty</h3>
                    <p className="mt-3 text-sm leading-7 text-[#CBD5E1]">
                      Add a program to start your premium learning journey.
                    </p>
                    <Link
                      href="/courses"
                      onClick={() => setOpen(false)}
                      className={buttonLinkClasses("navPrimary", "mt-6 inline-flex px-5 py-3")}
                    >
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => {
                      const Icon = iconMap[course.icon];

                      return (
                        <article
                          key={course.slug}
                          className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 transition-all duration-200 hover:border-[#FB923C]/30 hover:bg-white/[0.06]"
                        >
                          <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(249,115,22,0.14)] text-[#F97316]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[16px] font-semibold leading-6 text-white">{course.title}</div>
                              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#CBD5E1]">
                                <span className="rounded-[8px] border border-white/12 bg-white/[0.04] px-2.5 py-1">{course.duration}</span>
                                <span className="rounded-[8px] border border-white/12 bg-white/[0.04] px-2.5 py-1">{course.level}</span>
                              </div>
                              <div className="mt-3 flex items-center justify-between gap-3">
                                <div className="mono-meta text-[16px] font-semibold text-[#FDBA74]">{course.price}</div>
                                <button
                                  type="button"
                                  onClick={() => removeCourse(course.slug)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2 text-xs font-medium text-[#CBD5E1] transition hover:border-[#FB923C]/40 hover:text-[#FDBA74]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 px-5 py-5">
                <div className="mb-4 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-[#CBD5E1]">Total Amount</span>
                    <span className={cn("mono-meta text-[18px] font-semibold", courses.length ? "text-[#FDBA74]" : "text-white/60")}>
                      {courses.length ? totalLabel : "Rs. 0"}
                    </span>
                  </div>
                </div>
                {courses.length ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      className={buttonLinkClasses("navPrimary", "inline-flex w-full items-center justify-center gap-2 px-5 py-3.5")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/courses"
                      onClick={() => setOpen(false)}
                      className={buttonLinkClasses("navGhost", "inline-flex w-full items-center justify-center px-5 py-3")}
                    >
                      Explore More Courses
                    </Link>
                  </div>
                ) : null}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
