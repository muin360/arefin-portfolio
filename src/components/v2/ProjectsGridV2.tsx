"use client";

import Link from "next/link";
import { projects } from "@/data/site";
import { useInView } from "@/hooks/useInView";

/**
 * Project case-study grid (v2).
 *
 * Two-column layout. Each card has a tall numbered watermark, a tiny
 * type tag, a display-font title, a 2-line summary, and a row of mono
 * stack pills. The whole grid alternates reveal direction (odd cards
 * slide from the left, even from the right) once they hit the
 * viewport — IntersectionObserver-driven, motion-reduce aware.
 */
export default function ProjectsGridV2({
  limit = projects.length,
}: {
  limit?: number;
}) {
  const items = projects.slice(0, limit);
  return (
    <div className="v2-project__grid">
      {items.map((p, i) => (
        <Card key={p.title} index={i} project={p} />
      ))}
    </div>
  );
}

function Card({
  index,
  project,
}: {
  index: number;
  project: (typeof projects)[number];
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const side = index % 2 === 0 ? "left" : "right";
  return (
    <div
      ref={ref}
      className={`v2-project__card v2-project__card--${side} ${inView ? "is-in" : ""}`}
    >
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
      >
        <span>Read case study</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
