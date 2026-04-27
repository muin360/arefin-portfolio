"use client";

import { useEffect, useState } from "react";

/**
 * Live ticking clock — updates once per second. Shows GMT+6 (Dhaka)
 * because that's where I'm based. Falls back to a static placeholder
 * during SSR to avoid hydration mismatch.
 */
export default function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tz = "Asia/Dhaka";
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <span className="font-mono tabular-nums">
      {time ?? "--:--:--"}
    </span>
  );
}
