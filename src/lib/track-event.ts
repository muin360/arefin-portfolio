"use client";

import type { AnalyticsEventType } from "@/lib/db/types";

/** Get or create a persistent anonymous session ID stored in sessionStorage */
function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("__arefin_sid");
    if (!id) {
      id = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
      sessionStorage.setItem("__arefin_sid", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

/** Fire a custom analytics event. Never throws. Silently drops in SSR. */
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
    const payload = {
      event,
      path: window.location.pathname,
      sessionId: getSessionId(),
      ...meta,
    };
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Analytics must never crash the UI
  }
}
