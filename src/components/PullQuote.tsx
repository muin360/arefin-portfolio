"use client";

import LiveTicker from "./LiveTicker";

type Props = {
  quote: React.ReactNode;
  attribution?: string;
};

/**
 * Full-bleed editorial pull-quote on dark, with rotating gradient border
 * and live ticker behind it.
 */
export default function PullQuote({ quote, attribution }: Props) {
  return (
    <section className="hero-dark relative overflow-hidden border-y border-white/5">
      {/* Backdrop ticker */}
      <div className="absolute inset-x-0 top-0 opacity-50">
        <LiveTicker />
      </div>
      <div className="absolute inset-x-0 bottom-0 opacity-50 rotate-180">
        <LiveTicker />
      </div>

      {/* Aurora + orbs */}
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="orb orb-pink" aria-hidden="true" />
      <div className="orb orb-cyan" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-36 relative">
        {/* Rotating gradient border frame */}
        <div className="relative bento bento-spin rounded-3xl">
          <div className="bento-inner rounded-3xl bg-[#0c0c14]/90 backdrop-blur-sm px-8 md:px-16 py-16 md:py-24">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-px bg-gradient-to-r from-pink-400 to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-pink-300/85">
                · what tensor sounds like
              </span>
            </div>

            {/* Big serif quote */}
            <blockquote className="display serif text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1]">
              <span aria-hidden="true" className="text-pink-400/60 mr-2">“</span>
              {quote}
              <span aria-hidden="true" className="text-pink-400/60 ml-2">”</span>
            </blockquote>

            {/* Attribution */}
            {attribution && (
              <div className="mt-10 flex items-center gap-4">
                <span className="w-12 h-px bg-white/30" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65">
                  {attribution}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
