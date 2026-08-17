"use client";

import type { AnalyticsEventType } from "@/lib/db/types";

let inMemorySessionId: string | null = null;

/** Get or create a persistent anonymous session ID stored in sessionStorage with in-memory fallback */
export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";

  if (inMemorySessionId) return inMemorySessionId;

  try {
    let id = sessionStorage.getItem("__arefin_sid");
    if (!id) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        id = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
      } else {
        id = "sid_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      }
      try {
        sessionStorage.setItem("__arefin_sid", id);
      } catch {
        // Private mode or storage quota exceeded
      }
    }
    inMemorySessionId = id;
    return id;
  } catch {
    if (!inMemorySessionId) {
      inMemorySessionId = "mem_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    return inMemorySessionId;
  }
}

/** Fire a custom analytics event with sendBeacon and keepalive fallback */
export async function trackEvent(
  event: AnalyticsEventType,
  meta?: {
    projectSlug?: string;
    postSlug?: string;
    label?: string;
  },
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const payload = JSON.stringify({
      event,
      path: window.location.pathname,
      sessionId: getSessionId(),
      ...meta,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/analytics", blob);
      if (sent) return;
    }

    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    // Analytics must never crash the UI
  }
}

/** Helper for tracking CTA & button clicks */
export function trackCta(label: string, meta?: { projectSlug?: string; postSlug?: string }) {
  void trackEvent("cta_click", { label, ...meta });
}

/** Helper for tracking WhatsApp outbound clicks */
export function trackWhatsAppClick(label = "WhatsApp Contact") {
  void trackEvent("whatsapp_click", { label });
}

/** Helper for tracking Email outbound clicks */
export function trackEmailClick(label = "Email Contact") {
  void trackEvent("email_click", { label });
}
