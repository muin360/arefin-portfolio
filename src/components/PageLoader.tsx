"use client";

import { useEffect } from "react";

/**
 * Enhanced PageLoader.
 * Adds `is-loaded` to <body> after first paint — triggers the page-fade-in
 * animation on <main>. Also staggers section reveals by adding `can-reveal`
 * after a short delay so sections don't compete with the hero entrance.
 */
export default function PageLoader() {
  useEffect(() => {
    // Step 1: immediate — allow page-fade-in to fire
    const t1 = window.setTimeout(() => {
      document.body.classList.add("is-loaded");
    }, 60);

    // Step 2: 400ms later — enable section scroll reveals
    const t2 = window.setTimeout(() => {
      document.body.classList.add("can-reveal");
    }, 400);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
  return null;
}

