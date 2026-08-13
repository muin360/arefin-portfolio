"use client";

import { useState } from "react";
import Link from "next/link";
import { projects } from "@/data/site";
import { useInView } from "@/hooks/useInView";
import SpotlightCursor from "@/components/SpotlightCursor";
import ProjectModal from "@/components/masterpiece/ProjectModal";

export default function ProjectsGridV2({
  limit = projects.length,
}: {
  limit?: number;
}) {
  const items = projects.slice(0, limit);
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);

  return (
    <>
      <div className="v2-project__grid">
        {items.map((p, i) => (
          <Card 
            key={p.title} 
            index={i} 
            project={p} 
            onClick={() => setSelected(p)} 
          />
        ))}
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Card({
  index,
  project,
  onClick
}: {
  index: number;
  project: (typeof projects)[number];
  onClick: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const side = index % 2 === 0 ? "left" : "right";
  
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`v2-project__card v2-project__card--${side} nebula-card ${inView ? "is-in" : ""} relative cursor-pointer`}
    >
      <SpotlightCursor size={350} color="rgba(139, 92, 246, 0.08)" />
      <div className="v2-project__badge" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="v2-project__tag">{project.category}</span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--t3)" }}
        >
          case · 2024–2025
        </span>
      </div>

      <h3 className="v2-project__title">{project.title}</h3>
      <p className="v2-project__summary">{project.summary}</p>

      <div className="v2-project__stack">
        {project.stack.map((s) => (
          <span key={s} className="v2-project__pill">
            {s}
          </span>
        ))}
      </div>

      <Link
        href="/projects"
        className="v2-project__link"
        aria-label={`Read full case study: ${project.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span>Read case study</span>
        <span aria-hidden="true">→</span>
      </Link>
      
      <div style={{
        position: "absolute", bottom: "1.25rem", right: "1.25rem",
        fontSize: "9px", color: "var(--t4)", fontFamily: "var(--font-jetbrains-mono), monospace",
        letterSpacing: "0.1em", opacity: 0,
        transition: "opacity 200ms ease",
      }} className="card-demo-hint">
        [ run demo → ]
      </div>
    </div>
  );
}
