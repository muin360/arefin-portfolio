"use client";

import { useEffect, useState } from "react";

// Renders the current local time in Asia/Dhaka. Updates every minute on the
// client without causing hydration mismatch — initial server render shows a
// neutral placeholder, then the real value appears after mount.
export default function StudioTime({
  timeZone = "Asia/Dhaka",
  label = "Studio time · Dhaka",
}: {
  timeZone?: string;
  label?: string;
}) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const d = new Date();
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);
      const offsetParts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        timeZoneName: "shortOffset",
      })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName");
      setNow(`${time} · ${offsetParts?.value ?? ""}`);
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <p
      suppressHydrationWarning
      className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mt-2"
    >
      <span className="opacity-70">{label}</span>{" "}
      <span className="text-white/75 ml-1">{now ?? "—"}</span>
    </p>
  );
}
