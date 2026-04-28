"use client";

import { useEffect, useState } from "react";

type Parts = {
  hh: string;
  mm: string;
  ss: string;
  ms: string; // 3-digit millis
  date: string; // formatted date string
};

/**
 * Live ticking clock with millisecond precision. Updates ~10× per second
 * for the millis pulse, with the seconds/minutes/hours rolling smoothly.
 * The colon glyph blinks every 500ms, and the millisecond block is rendered
 * dimmer to keep the eye drawn to HH:MM:SS while the page still feels alive.
 *
 * Falls back to a static placeholder during SSR to avoid hydration mismatch.
 */
export default function LiveClock() {
  const [parts, setParts] = useState<Parts | null>(null);
  const [colon, setColon] = useState(true);

  useEffect(() => {
    const tz = "Asia/Dhaka";
    const fmtTime = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
    });
    const fmtDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: tz,
    });

    const tick = () => {
      const now = new Date();
      const t = fmtTime.format(now); // "HH:MM:SS"
      const [hh, mm, ss] = t.split(":");
      // millis from a Date in Dhaka (millis are tz-independent)
      const ms = String(now.getMilliseconds()).padStart(3, "0");
      const date = fmtDate.format(now).toUpperCase();
      setParts({ hh, mm, ss, ms, date });
      setColon(now.getMilliseconds() < 500);
    };

    tick();
    // ~12 Hz millisecond updates; the eye reads it as continuous motion.
    const id = window.setInterval(tick, 80);
    return () => window.clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <span className="font-mono tabular-nums text-white/70">--:--:--</span>
    );
  }

  return (
    <span className="inline-flex items-baseline gap-2 font-mono tabular-nums text-white/85">
      <span className="inline-flex items-baseline">
        <Digits text={parts.hh} />
        <span
          className={`px-[0.05em] transition-opacity duration-100 ${
            colon ? "opacity-100" : "opacity-30"
          }`}
        >
          :
        </span>
        <Digits text={parts.mm} />
        <span
          className={`px-[0.05em] transition-opacity duration-100 ${
            colon ? "opacity-100" : "opacity-30"
          }`}
        >
          :
        </span>
        <Digits text={parts.ss} />
        <span className="ml-1 text-white/35 text-[0.78em]">
          .<Digits text={parts.ms} />
        </span>
      </span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
        · {parts.date} · GMT+6
      </span>
    </span>
  );
}

/**
 * Render a string of digits where every digit gets a key tied to its
 * value, so React unmount/remount the changing digit. Combined with a
 * tiny CSS keyframe (digit-flip) this gives the appearance of each
 * digit gently popping into place when it changes.
 */
function Digits({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split("").map((d, i) => (
        <span
          key={`${i}-${d}`}
          className="inline-block tabular-nums"
          style={{
            animation: "digit-flip 220ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        >
          {d}
        </span>
      ))}
    </span>
  );
}
