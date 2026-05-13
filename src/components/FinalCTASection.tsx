import Link from "next/link";
import Reveal from "@/components/Reveal";
import { IconArrow } from "@/components/icons";

const PHONE_E164 = "8801994605717";
const PREFILL =
  "Hi Tensorix team! I'd like to book a free 30-min audit call. Best time for me is …";
const WA_HREF = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(PREFILL)}`;

export default function FinalCTASection() {
  return (
    <section className="hero-dark relative overflow-hidden border-t border-white/5">
      <div className="aurora opacity-40" aria-hidden="true" />
      <div className="orb orb-violet" aria-hidden="true" />
      <div className="orb orb-pink" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-50" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-24 md:py-32 relative">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono uppercase tracking-[0.2em] text-white/70 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Only 2 audit slots left this month
            </p>
            <h2 className="display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-3xl mx-auto">
              Stop losing leads to{" "}
              <span className="serif iridescent">&ldquo;I&rsquo;ll reply tomorrow.&rdquo;</span>
            </h2>
            <p className="mt-7 text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              30 free minutes. We&rsquo;ll review your workflow, Messenger inbox or
              current website live on the call and tell you exactly what to
              fix first.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto text-sm text-white/80">
            {[
              { num: "01", label: "Live audit on the call — no slides" },
              { num: "02", label: "Written plan in 48 hours · flat price" },
              { num: "03", label: "No obligation. No pitch. No spam." },
            ].map((b) => (
              <li
                key={b.num}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 mt-0.5 shrink-0">
                  / {b.num}
                </span>
                <span className="leading-snug">{b.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <Link
              href="/book"
              className="btn-primary shimmer bg-white text-foreground border-white hover:bg-white/90 w-full sm:w-auto justify-center"
            >
              Book my free audit
              <IconArrow width={16} height={16} />
            </Link>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3.5 text-sm font-medium transition-colors w-full sm:w-auto"
            >
              <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true" fill="currentColor">
                <path d="M19.11 17.21c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16s-.81 1-.99 1.21c-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.83-1.55-1.84-1.73-2.15-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.95-2.32-.25-.6-.51-.52-.7-.53l-.59-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.66.75.24 1.44.21 1.98.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.36zM16 4C9.37 4 4 9.37 4 16c0 2.12.55 4.11 1.5 5.84L4 28l6.32-1.45A11.93 11.93 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4z" />
              </svg>
              WhatsApp now
            </a>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-8 text-center text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">
            Reply within 1 hour · 7 days a week · Based in Dhaka · Serving globally
          </p>
        </Reveal>
      </div>
    </section>
  );
}
