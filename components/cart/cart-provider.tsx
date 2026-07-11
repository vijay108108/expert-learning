"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { type Course } from "@/data/courses";
import { CART_STORAGE_KEY, type CartEntry, dedupeCartEntries } from "@/lib/cart";
import { formatPaiseToPrice, getCourseBySlug, parsePriceToPaise } from "@/lib/course-catalog";

type CartToast = {
  id: number;
  message: string;
  tone: "success" | "info";
};

type CartContextValue = {
  items: CartEntry[];
  courses: Course[];
  count: number;
  totalPaise: number;
  totalLabel: string;
  hydrated: boolean;
  addCourse: (courseSlug: string) => { added: boolean };
  removeCourse: (courseSlug: string) => void;
  clearCart: () => void;
  hasCourse: (courseSlug: string) => boolean;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as CartEntry[]) : [];
        setItems(dedupeCartEntries(parsed));
      } catch (error) {
        console.error("[Cart] Unable to load persisted cart", error);
      } finally {
        setHydrated(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("[Cart] Unable to persist cart", error);
    }
  }, [hydrated, items]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const courses = useMemo(
    () =>
      items
        .map((item) => getCourseBySlug(item.courseSlug))
        .filter((course): course is Course => Boolean(course)),
    [items],
  );

  const totalPaise = useMemo(
    () =>
      courses.reduce((sum, course) => {
        const amount = parsePriceToPaise(course.price);
        return sum + (amount || 0);
      }, 0),
    [courses],
  );

  const showToast = useCallback((message: string, tone: "success" | "info" = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const addCourse = useCallback(
    (courseSlug: string) => {
      let added = false;

      setItems((current) => {
        if (current.some((item) => item.courseSlug === courseSlug)) {
          return current;
        }

        added = true;
        return [...current, { courseSlug, addedAt: new Date().toISOString() }];
      });

      if (added) {
        showToast("Course added to cart", "success");
      } else {
        showToast("This course is already in your cart", "info");
      }

      return { added };
    },
    [showToast],
  );

  const removeCourse = useCallback(
    (courseSlug: string) => {
      setItems((current) => current.filter((item) => item.courseSlug !== courseSlug));
      showToast("Course removed from cart", "info");
    },
    [showToast],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("[Cart] Unable to clear persisted cart", error);
    }
  }, []);

  const hasCourse = useCallback((courseSlug: string) => items.some((item) => item.courseSlug === courseSlug), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      courses,
      count: items.length,
      totalPaise,
      totalLabel: formatPaiseToPrice(totalPaise),
      hydrated,
      addCourse,
      removeCourse,
      clearCart,
      hasCourse,
    }),
    [addCourse, clearCart, courses, hasCourse, hydrated, items, removeCourse, totalPaise],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none fixed right-4 bottom-4 z-[90] sm:right-6 sm:bottom-6"
          >
            <div className="pointer-events-auto flex items-center gap-3 rounded-[18px] border border-[#15407E]/24 bg-[linear-gradient(135deg,rgba(7,20,43,0.96),rgba(11,28,52,0.96))] px-4 py-3 text-sm text-white shadow-[0_18px_36px_rgba(2,8,28,0.32),0_0_22px_rgba(249,115,22,0.12)] backdrop-blur-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(249,115,22,0.16)] text-[#E56F12]">
                {toast.tone === "success" ? <CheckCircle2 className="h-4.5 w-4.5" /> : <ShoppingCart className="h-4.5 w-4.5" />}
              </div>
              <div className="pr-2 text-[13px] font-medium">{toast.message}</div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="rounded-full p-1 text-white/60 transition hover:bg-white/8 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
