"use client";

import { useEffect, useState } from "react";
import TerminalLog from "./TerminalLog";
import TypewriterText from "./TypewriterText";
import { useInView } from "@/hooks/useInView";
import CountUp from "./CountUp";

/**
 * Agent Monitoring Dashboard — the centerpiece of the v2 hero.
 *
 * Lives on the right side of the homepage hero. Reads like a real
 * production observability surface: window-style top bar, three live
 * metrics, a staggered terminal log, a typed chat exchange between an
 * inbound lead and the agent, and a row of agreement-style pills at
 * the foot. A scan-line sweeps the surface to keep it feeling alive.
 *
 * Numbers are illustrative — they are pinned to TODAY's metrics so the
 * widget never looks stale.
 */
export default function AgentDashboard() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [latency, setLatency] = useState(12);

  // Pulse the latency value every ~3.5s while the widget is visible,
  // so the metric strip feels live without being distracting.
  useEffect(() => {
    if (!inView) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      // 10ms – 18ms range, integer
      setLatency(10 + Math.floor(Math.random() * 9));
    }, 3400);
    return () => window.clearInterval(id);
  }, [inView]);

  const lines = [
    { time: "09:42:11", type: "info" as const,  message: "lead.created · channel=whatsapp",            status: "200 ok" },
    { time: "09:42:11", type: "agent" as const, message: "router → agent.lead-bot · trace 8211",      status: "8 ms" },
    { time: "09:42:12", type: "info" as const,  message: "vector.search query=onboarding k=4",        status: "284 ms" },
    { time: "09:42:13", type: "ok" as const,    message: "tool.call crm.create_deal · $8,200",        status: "deal_8211" },
    { time: "09:42:13", type: "agent" as const, message: "drafting reply · gpt-4o · temp=0.4",        status: "1.1 s" },
    { time: "09:42:14", type: "ok" as const,    message: "delivery → twilio · message #2098",         status: "sent" },
  ];

  return (
    <div ref={ref} className="v2-dashboard w-full" aria-label="Live agent monitoring dashboard">
      <div className="scan-line" aria-hidden="true" />

      <div className="v2-dashboard__inner">
        {/* Top window-style bar */}
        <div className="v2-dashboard__topbar">
          <div className="flex items-center gap-2">
            <span className="v2-dashboard__dot" style={{ background: "var(--red)" }} />
            <span className="v2-dashboard__dot" style={{ background: "var(--amber)" }} />
            <span className="v2-dashboard__dot" style={{ background: "var(--green)" }} />
          </div>
          <span className="v2-dashboard__title">tensorix · lead-agent · v1.4</span>
          <span className="v2-dashboard__live">
            <span className="v2-dashboard__live-dot" />
            live
          </span>
        </div>

        {/* Metrics row — 3 boxes */}
        <div className="grid grid-cols-3">
          <div className="v2-metric">
            <span className="v2-metric__label">Latency</span>
            <span className="v2-metric__value" aria-live="polite">
              {latency} ms<span className="v2-metric__delta">↓</span>
            </span>
          </div>
          <div className="v2-metric">
            <span className="v2-metric__label">Uptime</span>
            <span className="v2-metric__value">
              99.9 <span className="v2-metric__delta" style={{ color: "var(--a2)" }}>%</span>
            </span>
          </div>
          <div className="v2-metric">
            <span className="v2-metric__label">Today</span>
            <span className="v2-metric__value">
              <CountUp target={47} duration={1400} />
              <span className="v2-metric__delta">leads</span>
            </span>
          </div>
        </div>

        {/* Terminal log */}
        <TerminalLog lines={lines} stagger={160} />

        {/* Chat — user + AI bubble */}
        <div className="v2-chat">
          <div className="v2-chat__bubble v2-chat__bubble--user">
            Hi! Looking to automate onboarding emails. Free this week?
          </div>
          <div className="v2-chat__bubble v2-chat__bubble--agent">
            <TypewriterText
              text="Happy to scope an onboarding flow — sending a 15-min slot now."
              speed={28}
              startDelay={1400}
            />
          </div>
        </div>

        {/* Bottom pills */}
        <div className="v2-pillrow">
          <span className="v2-pill"><span className="v2-pill__dot" />Reply &lt; 1 hr</span>
          <span className="v2-pill"><span className="v2-pill__dot" />Delivery &lt; 14d</span>
          <span className="v2-pill"><span className="v2-pill__dot" />You own it</span>
          <span className="v2-pill"><span className="v2-pill__dot" />30d support</span>
        </div>
      </div>
    </div>
  );
}
