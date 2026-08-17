"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track-event";

/**
 * Auto-fires a page_view event when the component mounts.
 * Mount once at the layout level for all public pages.
 */
export default function TrackPageView() {
  useEffect(() => {
    trackEvent("page_view");
  }, []);
  return null;
}
