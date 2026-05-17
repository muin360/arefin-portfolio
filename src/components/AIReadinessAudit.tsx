"use client";

import { useEffect, useRef, useState } from "react";
import BentoCard from "./BentoCard";

type Answer = {
  label: string;
  weight: number;
  trace: string; // tool/agent trace shown when picked
};

type Question = {
  prompt: string;
  metric: string; // small label e.g. "tooling", "scale"
  answers: Answer[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "What does your team automate today?",
    metric: "Maturity · current state",
    answers: [
      { label: "Almost nothing — manual everywhere", weight: 6, trace: "INFER · maturity_level=greenfield" },
      { label: "A few Zapier flows that work most days", weight: 11, trace: "INFER · maturity_level=light · noise=high" },
      { label: "Many flows in n8n / Make / Zapier", weight: 16, trace: "INFER · maturity_level=intermediate" },
      { label: "Custom code + workflows + an agent or two", weight: 22, trace: "INFER · maturity_level=advanced · agents=true" },
    ],
  },
  {
    prompt: "Where does an LLM sit in your stack?",
    metric: "AI integration · depth",
    answers: [
      { label: "Nowhere — we use ChatGPT in a tab", weight: 5, trace: "MEASURE · llm_in_loop=false" },
      { label: "One or two prompts in a flow", weight: 12, trace: "MEASURE · llm_in_loop=shallow" },
      { label: "RAG over our knowledge base", weight: 18, trace: "MEASURE · llm_in_loop=deep · rag=enabled" },
      { label: "Production agents with tools and memory", weight: 22, trace: "MEASURE · llm_in_loop=production · agents=multi" },
    ],
  },
  {
    prompt: "How are your workflows monitored?",
    metric: "Reliability · observability",
    answers: [
      { label: "We find out when someone complains", weight: 4, trace: "AUDIT · observability=none · drift=unknown" },
      { label: "Email alerts on failures", weight: 9, trace: "AUDIT · observability=basic · ttd=hours" },
      { label: "Dashboard with run history + retries", weight: 15, trace: "AUDIT · observability=structured" },
      { label: "Real metrics — latency, errors, cost, drift", weight: 20, trace: "AUDIT · observability=production · slo=tracked" },
    ],
  },
  {
    prompt: "What slows your team down most?",
    metric: "Pain · primary friction",
    answers: [
      { label: "Repetitive manual data entry", weight: 14, trace: "DIAGNOSE · primary_friction=ops_toil" },
      { label: "Customer messages we can't reply to fast", weight: 16, trace: "DIAGNOSE · primary_friction=response_latency" },
      { label: "Reporting that takes hours to compile", weight: 14, trace: "DIAGNOSE · primary_friction=reporting_lag" },
      { label: "Decisions that need context across tools", weight: 18, trace: "DIAGNOSE · primary_friction=cross_tool_context" },
    ],
  },
  {
    prompt: "How many tools does your data pass through?",
    metric: "Integration · sprawl",
    answers: [
      { label: "1–3 (we are tiny)", weight: 8, trace: "GRAPH · tools=lo · integration_load=light" },
      { label: "4–8 (a normal small team)", weight: 14, trace: "GRAPH · tools=mid · integration_load=moderate" },
      { label: "9–20 (operations-heavy)", weight: 18, trace: "GRAPH · tools=high · integration_load=heavy" },
      { label: "20+ (we have a tooling problem)", weight: 16, trace: "GRAPH · tools=sprawl · integration_load=critical" },
    ],
  },
  {
    prompt: "Where do you want to be in 6 months?",
    metric: "Ambition · target state",
    answers: [
      { label: "Just want one painful task automated", weight: 8, trace: "TARGET · scope=focused · risk=low" },
      { label: "Replace a brittle Zap/Make stack", weight: 14, trace: "TARGET · scope=migration · roi=fast" },
      { label: "A team-wide AI assistant on our data", weight: 20, trace: "TARGET · scope=org · agent_strategy=true" },
      { label: "Multi-agent system across operations", weight: 24, trace: "TARGET · scope=systemic · maturity=production" },
    ],
  },
];

const RECOMMENDATIONS: { min: number; max: number; tag: string; title: string; body: string; tier: string }[] = [
  {
    min: 0,
    max: 49,
    tag: "Foundation",
    title: "Start with one painful workflow.",
    body: "Your team has obvious automation upside. We'd recommend a 2-week Sprint engagement to take one repetitive process off your plate end-to-end — measurable, scoped, and a foundation to build on.",
    tier: "Sprint · 2 weeks",
  },
  {
    min: 50,
    max: 79,
    tag: "Acceleration",
    title: "You're ready for an engineering engagement.",
    body: "You've already proven automation pays off. The next step is replacing brittle no-code stacks with a durable system, adding observability, and bringing one or two real LLM agents into the loop. A 4–8 week Build engagement fits.",
    tier: "Build · 4–8 weeks",
  },
  {
    min: 80,
    max: 100,
    tag: "Production",
    title: "You need a partner, not a project.",
    body: "Your AI surface area is large enough that ad-hoc projects won't keep up. A retainer with the studio gives you continuous improvements, monitoring, new agents, and an embedded engineering layer for your AI stack.",
    tier: "Retainer · monthly",
  },
];

export default function AIReadinessAudit() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length means questions, then result
  const [picks, setPicks] = useState<(Answer | null)[]>(
    QUESTIONS.map(() => null),
  );
  const [score, setScore] = useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const handlePick = (qIdx: number, ans: Answer) => {
    const next = [...picks];
    next[qIdx] = ans;
    setPicks(next);
    if (qIdx + 1 >= QUESTIONS.length) {
      // Compute score (max possible would vary; we normalize to 100)
      const total = next.reduce((acc, a) => acc + (a?.weight ?? 0), 0);
      const maxPossible = QUESTIONS.reduce(
        (acc, q) => acc + Math.max(...q.answers.map((a) => a.weight)),
        0,
      );
      const normalized = Math.round((total / maxPossible) * 100);
      setScore(normalized);
      setStep(qIdx + 1);
    } else {
      setStep(qIdx + 1);
    }
  };

  // Animate score counter on result reveal
  useEffect(() => {
    if (score === null) return;
    let frame = 0;
    const target = score;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    frame = raf;
    return () => cancelAnimationFrame(frame);
  }, [score]);

  // Auto-scroll transcript on new answer
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [step, picks]);

  const progress = Math.min(100, Math.round((step / QUESTIONS.length) * 100));
  const finished = score !== null && step >= QUESTIONS.length;
  const currentQ = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  const reset = () => {
    setStep(0);
    setPicks(QUESTIONS.map(() => null));
    setScore(null);
    setAnimatedScore(0);
  };

  const recommendation =
    score !== null
      ? RECOMMENDATIONS.find((r) => score >= r.min && score <= r.max)!
      : null;

  return (
    <BentoCard className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT — Input panel (transcript + question) */}
        <div className="lg:col-span-7 lg:border-r border-white/10 lg:pr-8">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
                tensor.audit · interactive
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 tabular-nums">
              {finished
                ? "complete"
                : `q ${Math.min(step + 1, QUESTIONS.length)} / ${QUESTIONS.length}`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-7">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${finished ? 100 : progress}%` }}
            />
          </div>

          {/* Transcript of past Q&A */}
          <div
            ref={transcriptRef}
            className="space-y-4 max-h-[280px] overflow-y-auto pr-2 mb-6 scroll-smooth"
          >
            {picks.map((pick, i) => {
              if (!pick) return null;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                      / {String(i + 1).padStart(2, "0")} · {QUESTIONS[i].metric}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/55 leading-relaxed">
                    {QUESTIONS[i].prompt}
                  </p>
                  <div className="rounded-lg border border-violet-400/20 bg-violet-400/5 px-3.5 py-2.5">
                    <p className="text-sm text-white">{pick.label}</p>
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-pink-300/80">
                    → {pick.trace}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active question or result CTA */}
          {!finished && currentQ ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3">
                {currentQ.metric}
              </p>
              <h3 className="text-xl md:text-2xl text-white tracking-tight mb-5 leading-snug">
                {currentQ.prompt}
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.answers.map((ans, i) => (
                  <button
                    key={ans.label}
                    type="button"
                    onClick={() => handlePick(step, ans)}
                    className="group text-left rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 px-4 py-3 transition-all flex items-center gap-3"
                  >
                    <span className="font-mono text-[10px] tracking-[0.14em] text-white/40 group-hover:text-pink-300 w-6">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-white/85 group-hover:text-white flex-1">
                      {ans.label}
                    </span>
                    <span className="text-white/30 group-hover:text-white/80 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300 mb-3">
                · audit complete · recommendation generated
              </p>
              <p className="text-sm text-white/65 leading-relaxed mb-5">
                Your AI-readiness score is based on six signals: maturity,
                LLM integration, observability, friction, integration sprawl
                and ambition. Reset and try different answers — the model
                re-evaluates on each pick.
              </p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-white/60 hover:text-white border border-white/15 hover:border-white/40 rounded-full px-4 py-2 transition-colors"
              >
                ↻ Run audit again
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — Output panel (score + recommendation) */}
        <div className="lg:col-span-5 lg:pl-8 mt-8 lg:mt-0 flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              · output / verdict
            </span>
          </div>

          {finished && recommendation ? (
            <div className="flex-1 flex flex-col">
              {/* Score gauge */}
              <div className="relative">
                <svg viewBox="0 0 200 200" className="w-full max-w-[260px] mx-auto">
                  <defs>
                    <linearGradient id="scoreArc" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#a78bfa" />
                      <stop offset="0.55" stopColor="#ec4899" />
                      <stop offset="1" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  {/* Background ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 160 * 0.75} ${Math.PI * 160}`}
                    transform="rotate(135 100 100)"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#scoreArc)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      Math.PI * 160 * 0.75 * (animatedScore / 100)
                    } ${Math.PI * 160}`}
                    transform="rotate(135 100 100)"
                    style={{ transition: "stroke-dasharray 0.3s ease" }}
                  />
                  {/* Tick marks */}
                  {[0, 25, 50, 75, 100].map((tick) => {
                    const angle = (tick / 100) * 270 - 225;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 100 + 92 * Math.cos(rad);
                    const y1 = 100 + 92 * Math.sin(rad);
                    const x2 = 100 + 100 * Math.cos(rad);
                    const y2 = 100 + 100 * Math.sin(rad);
                    return (
                      <line
                        key={tick}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="display text-6xl md:text-7xl font-medium tabular-nums tracking-tight text-white">
                    {animatedScore}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mt-1">
                    AI-readiness · / 100
                  </span>
                </div>
              </div>

              {/* Recommendation card */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-pink-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    {recommendation.tag}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    {recommendation.tier}
                  </span>
                </div>
                <h4 className="text-lg text-white tracking-tight font-medium mb-2.5 leading-snug">
                  {recommendation.title}
                </h4>
                <p className="text-[13px] text-white/65 leading-relaxed mb-4">
                  {recommendation.body}
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-white text-[#04040a] hover:bg-white/90 px-5 py-2.5 text-sm font-medium shimmer transition-colors"
                >
                  Book a discovery call →
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-10">
              <div className="w-20 h-20 rounded-full border border-white/10 grid place-items-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2v4m0 12v4m10-10h-4M6 12H2m14.95-7.07l-2.83 2.83M9.88 14.12l-2.83 2.83m0-12.02l2.83 2.83m4.24 4.24l2.83 2.83"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/65 leading-relaxed max-w-xs">
                Your AI-readiness score and a tailored Tensor recommendation
                will appear here once you finish the six questions.
              </p>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                ~ 90 seconds · no email required
              </p>
            </div>
          )}
        </div>
      </div>
    </BentoCard>
  );
}
