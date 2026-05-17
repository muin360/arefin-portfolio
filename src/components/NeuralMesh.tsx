"use client";

import { useMemo } from "react";

/**
 * NeuralMesh — animated SVG neural-network backdrop
 *
 * Renders a quiet network of nodes connected by thin lines that pulse with
 * a slow opacity loop. Sits behind hero / section content as an "AI studio
 * is alive" ambient layer. Pure CSS animation — no per-frame JS — so it
 * stays cheap on the main thread and the GPU is the only thing working.
 *
 * `prefers-reduced-motion: reduce` disables the animation via the global
 * stylesheet rules.
 */
type NeuralMeshProps = {
  /** Number of nodes. More = denser mesh. Default 24. */
  nodes?: number;
  /** Random seed for deterministic positions across renders. */
  seed?: number;
  className?: string;
};

// Linear congruential generator — deterministic PRNG seeded by a number,
// so the mesh is stable across server + client renders (no hydration
// mismatch) but still feels organic. Period is fine for the small N we use.
function makeRng(seed: number) {
  let s = (seed | 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    // Map to [0, 1)
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

export default function NeuralMesh({
  nodes = 24,
  seed = 7,
  className = "",
}: NeuralMeshProps) {
  // Positions are computed once per (nodes, seed) tuple. Two passes:
  // 1. Distribute points pseudo-randomly across the 0–100 viewBox.
  // 2. Connect each node to its 2 nearest neighbours so the graph reads
  //    as a network, not a star field.
  const { points, edges } = useMemo(() => {
    const rng = makeRng(seed);
    const points = Array.from({ length: nodes }, () => ({
      x: rng() * 100,
      y: rng() * 100,
    }));

    type Edge = { i: number; j: number; d: number };
    const edges: Edge[] = [];
    for (let i = 0; i < points.length; i++) {
      // Find the two closest other nodes for each node — gives every node a
      // couple of outgoing edges without an O(n^2) explosion of clutter.
      const distances = points
        .map((p, j) => {
          const dx = p.x - points[i].x;
          const dy = p.y - points[i].y;
          return { j, d: Math.hypot(dx, dy) };
        })
        .filter((e) => e.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j, d } of distances) {
        // De-dupe undirected edges
        if (!edges.some((e) => (e.i === j && e.j === i) || (e.i === i && e.j === j))) {
          edges.push({ i, j, d });
        }
      }
    }
    return { points, edges };
  }, [nodes, seed]);

  return (
    <div className={`neural-mesh ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {edges.map((e, idx) => {
            const a = points[e.i];
            const b = points[e.j];
            return (
              <line
                key={`l-${idx}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className="neural-mesh__line"
                style={{ animationDelay: `${(idx % 8) * 0.4}s` }}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {points.map((p, idx) => (
            <circle
              key={`n-${idx}`}
              cx={p.x}
              cy={p.y}
              r={0.5}
              className="neural-mesh__node"
              style={{ animationDelay: `${(idx % 6) * 0.5}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
