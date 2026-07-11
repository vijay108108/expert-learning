"use client";

import { trackMetaEvent, trackMetaPageView } from "@/lib/meta-pixel";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gaEvent(name: string, params?: AnalyticsParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, params || {});
}

export function trackPageView() {
  trackMetaPageView();
}

export function trackWorkshopViewContent() {
  trackMetaEvent("ViewContent", {
    content_name: "AI Developer Launch Lab",
    content_category: "Workshop",
    content_type: "Workshop",
    currency: "INR",
    value: 99,
  });

  gaEvent("view_workshop", {
    workshop_name: "AI Developer Launch Lab",
    currency: "INR",
    value: 99,
  });
}

export function trackRegisterClick() {
  trackMetaEvent("InitiateCheckout", {
    content_name: "AI Developer Launch Lab",
    content_category: "Workshop",
    content_type: "Workshop",
    currency: "INR",
    value: 99,
  });

  gaEvent("click_register", {
    workshop_name: "AI Developer Launch Lab",
    currency: "INR",
    value: 99,
  });
}

export function trackLoginEvent(source: string) {
  gaEvent("login", { source });
}

export function trackPaymentStarted(courseSlug: string, amount: number) {
  gaEvent("payment_started", { course_slug: courseSlug, value: amount, currency: "INR" });
}

export function trackPaymentSuccess(params: {
  value: number;
  paymentId: string;
  orderId: string;
}) {
  trackMetaEvent("Purchase", {
    value: params.value,
    currency: "INR",
    content_name: "AI Developer Launch Lab",
    payment_id: params.paymentId,
    order_id: params.orderId,
  });

  trackMetaEvent("CompleteRegistration", {
    content_name: "AI Developer Launch Lab",
    content_type: "Workshop",
  });

  gaEvent("payment_success", {
    payment_id: params.paymentId,
    order_id: params.orderId,
    value: params.value,
    currency: "INR",
  });
}

export function trackPaymentFailed(reason: string) {
  gaEvent("payment_failed", { reason });
}

export function trackJoinWhatsapp() {
  gaEvent("join_whatsapp", { workshop_name: "AI Developer Launch Lab" });
}

export function trackLmsOpen(courseSlug: string) {
  gaEvent("lms_open", { course_slug: courseSlug });
}

export function trackLead(source: string) {
  trackMetaEvent("Lead", { source });
}

export function trackCompleteRegistration(source: string) {
  trackMetaEvent("CompleteRegistration", { source });
}
