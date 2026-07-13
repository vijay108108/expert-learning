"use client";

type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration";

type MetaEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _metaPixelInitialized?: boolean;
  }
}

function getMetaPixelId() {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
}

export function hasMetaPixel() {
  return Boolean(getMetaPixelId());
}

export function initMetaPixel() {
  if (typeof window === "undefined") {
    return;
  }

  if (!hasMetaPixel()) {
    return;
  }

  if (window._metaPixelInitialized) {
    return;
  }

  const tryInit = () => {
    if (typeof window.fbq !== "function") {
      return false;
    }

    window.fbq("init", getMetaPixelId());
    window._metaPixelInitialized = true;
    return true;
  };

  if (tryInit()) {
    return;
  }

  let attempts = 0;
  const interval = window.setInterval(() => {
    attempts += 1;

    if (window._metaPixelInitialized || tryInit() || attempts >= 20) {
      window.clearInterval(interval);
    }
  }, 250);
}

export function trackMetaEvent(event: MetaStandardEvent, params?: MetaEventParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  if (params) {
    window.fbq("track", event, params);
    return;
  }

  window.fbq("track", event);
}

export function trackMetaPageView() {
  trackMetaEvent("PageView");
}
