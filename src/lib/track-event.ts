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

/** Helper for tracking Arefin AI assistant modal opening */
export function trackAIOpen(label = "Ask Arefin AI") {
  void trackEvent("ai_open", { label });
}

/** Helper for tracking user prompt in Arefin AI (stores only anonymized intent/length, no private chat) */
export function trackAIPrompt(prompt: string) {
  const sanitizedLabel = prompt.slice(0, 40).replace(/[^a-zA-Z0-9\s-_]/g, "").trim();
  void trackEvent("ai_prompt", { label: sanitizedLabel || "prompt" });
}

/** Helper for tracking citation click in Arefin AI */
export function trackAIProjectClick(projectSlug: string) {
  void trackEvent("ai_project_click", { projectSlug, label: `Citation: ${projectSlug}` });
}

/** Helper for tracking interactive System Blueprint / Build Explorer interaction */
export function trackBuildExplorerOpen(projectSlug: string) {
  void trackEvent("build_explorer_open", { projectSlug, label: `Blueprint: ${projectSlug}` });
}

/** Helper for tracking node/step click in System Blueprint */
export function trackBuildStepClick(stepType: string, projectSlug?: string) {
  void trackEvent("build_step_click", { projectSlug, label: `Step: ${stepType}` });
}

/** Helper for copying blueprint specifications */
export function trackBlueprintCopySpecs(projectSlug?: string) {
  void trackEvent("blueprint_copy_specs", { projectSlug, label: "Copy Architecture Blueprint" });
}

/** Helper for tracking case study page view */
export function trackCaseStudyView(projectSlug: string) {
  void trackEvent("case_study_view", { projectSlug, label: `Case Study: ${projectSlug}` });
}

/** Helper for tracking proof item view or hover */
export function trackProofView(proofTitle: string, projectSlug?: string) {
  void trackEvent("proof_view", { projectSlug, label: `Proof: ${proofTitle}` });
}

/** Helper for opening proof lightbox */
export function trackProofOpen(proofTitle: string, projectSlug?: string) {
  void trackEvent("proof_open", { projectSlug, label: `Lightbox: ${proofTitle}` });
}

/** Helper for case study CTA clicks */
export function trackCaseStudyCta(ctaLabel: string, projectSlug?: string) {
  void trackEvent("case_study_cta", { projectSlug, label: `CTA: ${ctaLabel}` });
}

/** Helper for external project links */
export function trackExternalProjectLink(linkLabel: string, projectSlug?: string) {
  void trackEvent("external_project_link", { projectSlug, label: `Link: ${linkLabel}` });
}
