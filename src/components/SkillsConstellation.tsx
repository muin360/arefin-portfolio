"use client";

import { useEffect, useRef, useState } from "react";

const tools = [
  { name: "n8n", level: 95, group: "Orchestration" },
  { name: "Zapier", level: 88, group: "Orchestration" },
  { name: "Make", level: 86, group: "Orchestration" },
  { name: "LangChain", level: 92, group: "AI & Agents" },
  { name: "LangFlow", level: 88, group: "AI & Agents" },
  { name: "OpenAI API", level: 94, group: "Foundation" },
  { name: "Claude API", level: 92, group: "Foundation" },
  { name: "Pinecone / Qdrant", level: 86, group: "Vector DB" },
  { name: "MongoDB Atlas", level: 90, group: "Data & Storage" },
  { name: "PostgreSQL", level: 84, group: "Data & Storage" },
  { name: "Airtable / Sheets", level: 92, group: "Business Data" },
  { name: "Python", level: 94, group: "Code & Glue" },
  { name: "TypeScript / Node", level: 90, group: "Code & Glue" },
  { name: "REST / Webhooks", level: 96, group: "Integration" },
  { name: "Git / GitHub", level: 90, group: "DevOps & CI" },
  { name: "FastAPI / Next.js", level: 88, group: "App Layer" },
];

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
      { threshold: 0.15 }
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
  const circumference = 2 * Math.PI * 16;
  const dash = (tool.level / 100) * circumference;

  return (
    <div
      ref={tileRef}
      className="group relative rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-5 overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:bg-[#101420] shadow-lg hover:shadow-violet-950/20"
      style={{
        transitionDelay: `${index * 25}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400 font-semibold">
          {tool.group}
        </span>
        <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${shown ? dash : 0} ${circumference}`}
            transform="rotate(-90 18 18)"
            style={{
              transition: "stroke-dasharray 1.2s cubic-bezier(0.2,0.8,0.2,1)",
              transitionDelay: `${index * 40 + 150}ms`,
            }}
          />
        </svg>
      </div>
      <p className="mt-3 text-base font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
        {tool.name}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
        Proficiency · {tool.level}%
      </p>
    </div>
  );
}
