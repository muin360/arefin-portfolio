import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Off the map · Arefin Muin",
  description: "That page doesn't exist (or it never did).",
};

export default function NotFound() {
  return (
    <section className="relative bg-paper border-b border-line overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-24 md:pt-40 md:pb-40 relative">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <p className="eyebrow">[ 404 ] Off the map</p>
          <span className="mono uppercase tracking-[0.16em] text-muted text-xs hidden md:inline">
            Page not found
          </span>
        </div>
        <h1 className="display text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] max-w-5xl">
          This page is{" "}
          <span className="serif">not in the workflow.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
          Either it never existed, or it was retired. Both are reasonable. Try
          one of the links below — or head back to the start.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/projects" className="btn-secondary">
            Selected work
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
