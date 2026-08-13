"use client";

import { useInView } from "@/hooks/useInView";

export default function AnimatedSkillBar({
  proficiency,
  index,
}: {
  proficiency: number;
  index: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`v2-skill-bar-container ${inView ? "is-in" : ""}`}
    >
      <div
        className="v2-skill-bar-fill"
        style={{
          width: inView ? `${proficiency}%` : "0%",
          transitionDelay: `${index * 60}ms`,
        }}
      />
      <span
        className="v2-skill-bar-pct"
        style={{
          transitionDelay: `${index * 60 + 900}ms`,
          opacity: inView ? 1 : 0,
        }}
      >
        {proficiency}%
      </span>
    </div>
  );
}
