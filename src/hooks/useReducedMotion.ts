"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return typeof window !== "undefined"
    ? window.matchMedia(QUERY).matches
    : false;
}

function getServerSnapshot() {
  return false;
}

/**
 * Returns true when the visitor has requested reduced motion at the
 * OS level. Subscribes to changes via `useSyncExternalStore` so the
 * component re-renders if the user flips the setting at runtime.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
