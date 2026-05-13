"use client";

import { useEffect, useState } from "react";

/**
 * SprintTimeline — autoplay editorial timeline showing what a real
 * 14-day Tensorix Sprint looks like. Six phases auto-advance on a
 * 3.6 second loop with a glowing pink playhead. Each phase reveals
 * its hour-by-hour breakdown in the right panel as it activates.
 *
 * No clicks needed. Visitors can still hover a phase pill to peek
 * at one ahead, but it's purely supplemental — the loop doesn't
 * pause and the page narrates itself.
 */

type Phase = {
  id: string;
  day: string;
  title: string;
  body: string;
  beats: string[];
  deliverable: string;
};

const PHASES: Phase[] = [
  {
    id: "kickoff",
    day: "Day 0",
    title: "Kickoff",
    body:
      "60 minutes of brutal honesty about the workflow that's eating your team alive — we map the actual pain, not the org chart.",
    beats: [
      "T+00:00  current-state walk-through",
      "T+00:18  pain points logged · 11 found",
      "T+00:34  scope locked · 1 workflow",
      "T+00:52  charter signed · slack opened",
    ],
    deliverable: "Engagement charter · Slack channel · shared doc",
  },
  {
    id: "discovery",
    day: "Day 1 – 2",
    title: "Discovery",
    body:
      "We shadow the people doing the work. Every click, every copy-paste, every escalation — instrumented. The truth is in the keystrokes, not the meeting.",
    beats: [
      "Day 1   stakeholder shadow sessions × 3",
      "Day 1   tool & data inventory complete",
      "Day 2   integration audit · 14 endpoints",
      "Day 2   risk + compliance pre-read",
    ],
    deliverable: "Process map · integration matrix · failure modes",
  },
  {
    id: "design",
    day: "Day 3 – 4",
    title: "Design",
    body:
      "We draft the system end-to-end on paper before a single line of code. Trigger, retrieval, reasoning, action, verification — every node defended.",
    beats: [
      "Day 3   architecture v1 · whiteboard",
      "Day 3   prompt + tool contract drafted",
      "Day 4   evaluation set written · 38 cases",
      "Day 4   architecture v2 · review approved",
    ],
    deliverable: "Architecture doc · eval set · API contracts",
  },
  {
    id: "build",
    day: "Day 5 – 9",
    title: "Build",
    body:
      "The studio assembles the workflow against the eval set, every commit gated by automated tests. No feature ships if the eval drops.",
    beats: [
      "Day 5   trigger + retrieval online",
      "Day 6   reasoning loop passing 91% eval",
      "Day 7   tool calls + verification wired",
      "Day 8   load test · 1.2k req · 0 errors",
      "Day 9   eval @ 96% · sign-off ready",
    ],
    deliverable: "Working system · 38/38 evals · cost telemetry",
  },
  {
    id: "ship",
    day: "Day 10 – 12",
    title: "Ship",
    body:
      "Quiet rollout. We launch behind a feature flag, ramp 10% → 50% → 100% on real production traffic, watching SLOs the whole way.",
    beats: [
      "Day 10  10% canary live · slo green",
      "Day 11  50% rollout · cost / run = $0.004",
      "Day 12  100% live · postmortem-ready dash",
    ],
    deliverable: "Production deploy · runbook · alert routes",
  },
  {
    id: "handoff",
    day: "Day 13 – 14",
    title: "Handoff",
    body:
      "We train your team to operate, debug and extend the system without us. The studio stays one Slack message away — but the keys are yours.",
    beats: [
      "Day 13  team operator training · 90 min",
      "Day 13  retro + roadmap to v2",
      "Day 14  handoff · system fully owned",
      "Day 14  retainer optional · always-on tail",
    ],
    deliverable: "Operator runbook · video walkthrough · keys handed",
  },
];

const STAGE_DURATION = 3600; // ms

export default function SprintTimeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current phase

  useEffect(() => {
    let raf = 0;
    let start = performance.now();
    let i = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / STAGE_DURATION);
      setProgress(p);
      if (elapsed >= STAGE_DURATION) {
        i = (i + 1) % PHASES.length;
        setActiveIdx(i);
        start = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = PHASES[activeIdx];
  // Compute global progress (across all phases) for the playhead's left position
  const globalProgress = (activeIdx + progress) / PHASES.length;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span className="relative flex">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-pink-400 animate-ping opacity-75" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/85">
            tensor.sprint · 14-day engagement
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          autoplaying · phase{" "}
          <span className="text-white/85 tabular-nums">
            {activeIdx + 1}/{PHASES.length}
          </span>
        </span>
      </div>

      {/* Track + phase pills */}
      <div className="px-6 md:px-8 pt-8 pb-2 relative">
        {/* base track */}
        <div className="relative h-px w-full bg-white/10">
          {/* progress fill */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400"
            style={{
              width: `${globalProgress * 100}%`,
              transition: "width 80ms linear",
            }}
          />
          {/* playhead */}
          <div
            className="absolute -top-1.5 w-3 h-3 rounded-full bg-pink-400 border border-white/40"
            style={{
              left: `calc(${globalProgress * 100}% - 6px)`,
              transition: "left 80ms linear",
              animation: "phase-pulse 1.6s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
        </div>

        {/* phase pills along the track */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
          {PHASES.map((phase, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <div
                key={phase.id}
                className={`flex flex-col items-start gap-1 pb-2 border-l-2 pl-3 transition-colors ${
                  isActive
                    ? "border-pink-400"
                    : isPast
                      ? "border-cyan-400/60"
                      : "border-white/15"
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    isActive
                      ? "text-pink-300"
                      : isPast
                        ? "text-cyan-300/80"
                        : "text-white/45"
                  }`}
                >
                  {phase.day}
                </span>
                <span
                  className={`text-sm md:text-base font-semibold tracking-tight transition-colors ${
                    isActive ? "text-white" : "text-white/65"
                  }`}
                  style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {phase.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active phase content (left = narrative, right = beats + deliverable) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-white/8 mt-2">
        <div className="lg:col-span-7 p-6 md:p-10 relative overflow-hidden">
          {/* ambient orb tied to active phase */}
          <div
            key={active.id}
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(236, 72, 153, 0.6), transparent 70%)",
              animation: "fade-in-up 600ms ease-out",
            }}
            aria-hidden="true"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mb-4">
            phase {String(activeIdx + 1).padStart(2, "0")} · {active.day}
          </p>
          <h3
            key={`title-${active.id}`}
            className="display text-3xl md:text-5xl text-white leading-[1.05]"
            style={{
              animation: "fade-in-up 500ms cubic-bezier(0.2, 0.7, 0.2, 1)",
            }}
          >
            {active.title}.
          </h3>
          <p
            key={`body-${active.id}`}
            className="mt-5 text-base md:text-lg text-white/70 leading-relaxed max-w-xl"
            style={{
              animation: "fade-in-up 600ms cubic-bezier(0.2, 0.7, 0.2, 1)",
              animationDelay: "60ms",
              animationFillMode: "backwards",
            }}
          >
            {active.body}
          </p>

          {/* per-phase progress bar */}
          <div className="mt-8 h-1 w-full bg-white/8 rounded-full overflow-hidden max-w-md">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-cyan-400"
              style={{
                width: `${progress * 100}%`,
                transition: "width 80ms linear",
              }}
            />
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 tabular-nums">
            phase progress · {Math.round(progress * 100)}%
          </p>
        </div>

        <div className="lg:col-span-5 p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-white/8 bg-[#0a0a14]/40">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mb-4">
            · beats · live
          </p>
          <ul className="space-y-2.5 font-mono text-[11px] leading-relaxed">
            {active.beats.map((beat, i) => (
              <li
                key={`${active.id}-beat-${i}`}
                className="flex items-start gap-2.5 text-white/75"
                style={{
                  animation: "fade-in-up 500ms cubic-bezier(0.2, 0.7, 0.2, 1)",
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <span className="text-pink-400 mt-0.5">›</span>
                <span className="break-words">{beat}</span>
              </li>
            ))}
          </ul>

          <div
            key={`deliverable-${active.id}`}
            className="mt-6 rounded-xl border border-white/12 bg-white/[0.03] p-4"
            style={{
              animation: "fade-in-up 700ms cubic-bezier(0.2, 0.7, 0.2, 1)",
              animationDelay: "300ms",
              animationFillMode: "backwards",
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
              · deliverable
            </p>
            <p className="text-sm text-white/85 leading-relaxed">
              {active.deliverable}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3 border-t border-white/8 bg-white/[0.015] font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
        <span>
          shape: <span className="text-white/75">14 calendar days · 1 workflow · fixed price</span>
        </span>
        <span>
          from <span className="text-white/85">$2.4k</span> · ideal for first-time AI engagements
        </span>
      </div>
    </div>
  );
}
