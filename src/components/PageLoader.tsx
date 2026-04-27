"use client";

import { useEffect } from "react";

/**
 * Adds `is-loaded` to <body> as soon as the first paint completes,
 * triggering a one-time fade-in defined in globals.css.
 */
export default function PageLoader() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.body.classList.add("is-loaded");
    }, 60);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
