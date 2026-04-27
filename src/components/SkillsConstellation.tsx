"use client";

import { useEffect, useRef, useState } from "react";

const tools = [
  { name: "n8n", level: 95, group: "Orchestration" },
  { name: "Zapier", level: 88, group: "Orchestration" },
  { name: "Make", level: 86, group: "Orchestration" },
  { name: "GoHighLevel", level: 80, group: "Orchestration" },
  { name: "LangChain", level: 90, group: "AI" },
  { name: "LangFlow", level: 85, group: "AI" },
  { name: "OpenAI", level: 92, group: "AI" },
  { name: "Anthropic", level: 88, group: "AI" },
  { name: "Pinecone", level: 84, group: "Data" },
  { name: "Supabase", level: 86, group: "Data" },
  { name: "Postgres", level: 80, group: "Data" },
  { name: "Airtable", level: 82, group: "Data" },
  { name: "Python", level: 92, group: "Code" },
  { name: "TypeScript", level: 90, group: "Code" },
  { name: "Node.js", level: 88, group: "Code" },
  { name: "Next.js", level: 84, group: "Code" },
];

/**
 * Animated tile grid — each tile fills a radial proficiency arc on
 * scroll-in, and tracks the cursor for a magnetic radial-glow hover.
 */
export default function SkillsConstellation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {tools.map((t, i) => (
        <SkillTile
          key={t.name}
          tool={t}
          index={i}
          shown={shown}
        />
      ))}
    </div>
  );
}

type Tool = { name: string; level: number; group: string };

function SkillTile({
  tool,
  index,
  shown,
}: {
  tool: Tool;
  index: number;
  shown: boolean;
}) {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const circumference = 2 * Math.PI * 18;
  const dash = (tool.level / 100) * circumference;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tileRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={tileRef}
      onMouseMove={onMove}
      className="skill-tile rounded-2xl border border-line bg-surface p-5 overflow-hidden"
      style={{
        transitionDelay: `${index * 30}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {tool.group}
        </span>
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="rgba(10, 10, 20, 0.08)"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="url(#skill-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${shown ? dash : 0} ${circumference}`}
            transform="rotate(-90 20 20)"
            style={{
              transition: "stroke-dasharray 1.4s cubic-bezier(0.2,0.8,0.2,1)",
              transitionDelay: `${index * 60 + 200}ms`,
            }}
          />
          <defs>
            <linearGradient id="skill-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-1)" />
              <stop offset="100%" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="mt-3 text-base font-medium tracking-tight">{tool.name}</p>
      <p className="mt-1 mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Proficiency · {tool.level}%
      </p>
    </div>
  );
}
