"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track-event";

/**
 * Global Telemetry & Interaction Observer
 * - Fires `page_view` on route change
 * - Fires `scroll_50` and `scroll_90` on user engagement
 * - Tracks outbound clicks (WhatsApp, GitHub, Demo)
 */
export default function TrackPageView() {
  const pathname = usePathname();
  const tracked50 = useRef(false);
  const tracked90 = useRef(false);

  useEffect(() => {
    // Reset scroll milestones on route change
    tracked50.current = false;
    tracked90.current = false;

    // Track page view
    void trackEvent("page_view");

    // Scroll depth observer
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const progress = window.scrollY / scrollHeight;

      if (progress >= 0.5 && !tracked50.current) {
        tracked50.current = true;
        void trackEvent("scroll_50");
      }

      if (progress >= 0.9 && !tracked90.current) {
        tracked90.current = true;
        void trackEvent("scroll_90");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}
