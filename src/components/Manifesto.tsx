"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  {
    eye: "01 · BELIEF",
    text: (
      <>
        We don&apos;t sell <em className="serif">AI</em>. We sell{" "}
        <em className="serif">quiet hours back</em> to your team.
      </>
    ),
  },
  {
    eye: "02 · METHOD",
    text: (
      <>
        Workflows that survive the second year are designed by people who&apos;ll{" "}
        <em className="serif">still be reachable</em> in month thirteen.
      </>
    ),
  },
  {
    eye: "03 · BAR",
    text: (
      <>
        If a system needs an instruction manual to run, it isn&apos;t{" "}
        <em className="serif">finished</em>. It&apos;s a draft we haven&apos;t admitted to.
      </>
    ),
  },
];

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll("[data-line]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.line);
            setVisible((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
          }
        });
      },
      { threshold: 0.45 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="hero-dark border-y border-white/5 relative overflow-hidden">
      {/* Aurora + orbs for ambience */}
      <div className="aurora opacity-50" aria-hidden="true" />
      <div className="orb orb-violet" aria-hidden="true" />
      <div className="orb orb-pink" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-50" aria-hidden="true" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sticky left rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-white/55 mb-5">[ 03 ] Manifesto</p>
              <h2 className="display text-4xl md:text-5xl text-white leading-[1.05]">
                Three things
                <br />
                <span className="serif">we keep</span> on
                <br />
                the wall.
              </h2>
              <p className="mt-6 text-white/60 max-w-sm leading-relaxed">
                Not a positioning doc. Not a deck. Just the rules we read on
                the way out, that decide which projects we say yes to.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                  signed
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-white/85">
                  TENSOR · DHAKA · 2024
                </span>
              </div>
            </div>
          </div>

          {/* Lines */}
          <div className="lg:col-span-8 space-y-12 md:space-y-16">
            {LINES.map((line, i) => {
              const shown = visible.includes(i);
              return (
                <div
                  key={i}
                  data-line={i}
                  className="border-t border-white/10 pt-8 md:pt-10"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-px bg-gradient-to-r from-pink-400 to-transparent" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pink-300/85">
                      {line.eye}
                    </span>
                  </div>
                  <p
                    className={`display text-3xl md:text-5xl lg:text-6xl text-white leading-[1.08] transition-all duration-1000 ${
                      shown
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                  >
                    {line.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
