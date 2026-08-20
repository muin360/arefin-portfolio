import type { WorkflowStep, WorkflowStepType } from "@/lib/db/types";

export type StepGeometryType =
  | "torus"
  | "box"
  | "sphere"
  | "octahedron"
  | "cylinder"
  | "dodecahedron"
  | "diamond";

export interface StepVisualConfig {
  label: string;
  categoryName: string;
  geometry: StepGeometryType;
  accentColor: string; // Hex for Three.js
  emissiveColor: string; // Hex for Three.js
  glowColor: string; // rgba CSS
  tailwindTextColor: string;
  tailwindBgColor: string;
  tailwindBorderColor: string;
}

export const STEP_3D_CONFIG: Record<WorkflowStepType | "default", StepVisualConfig> = {
  trigger: {
    label: "TRIGGER",
    categoryName: "Event Ingestion",
    geometry: "torus",
    accentColor: "#fbbf24",
    emissiveColor: "#d97706",
    glowColor: "rgba(245, 158, 11, 0.2)",
    tailwindTextColor: "text-amber-400",
    tailwindBgColor: "bg-amber-500/10",
    tailwindBorderColor: "border-amber-500/30",
  },
  input: {
    label: "DATA INPUT",
    categoryName: "Payload Normalization",
    geometry: "box",
    accentColor: "#38bdf8",
    emissiveColor: "#0284c7",
    glowColor: "rgba(56, 189, 248, 0.2)",
    tailwindTextColor: "text-sky-400",
    tailwindBgColor: "bg-sky-500/10",
    tailwindBorderColor: "border-sky-500/30",
  },
  ai: {
    label: "AI REASONING",
    categoryName: "LLM Inference",
    geometry: "sphere",
    accentColor: "#a78bfa",
    emissiveColor: "#7c3aed",
    glowColor: "rgba(168, 85, 247, 0.25)",
    tailwindTextColor: "text-violet-400",
    tailwindBgColor: "bg-violet-500/10",
    tailwindBorderColor: "border-violet-500/30",
  },
  agent: {
    label: "AGENT ROUTER",
    categoryName: "Orchestration & Routing",
    geometry: "octahedron",
    accentColor: "#c084fc",
    emissiveColor: "#9333ea",
    glowColor: "rgba(192, 132, 252, 0.25)",
    tailwindTextColor: "text-purple-400",
    tailwindBgColor: "bg-purple-500/10",
    tailwindBorderColor: "border-purple-500/30",
  },
  tool: {
    label: "TOOL / API",
    categoryName: "External Execution",
    geometry: "box",
    accentColor: "#34d399",
    emissiveColor: "#059669",
    glowColor: "rgba(52, 211, 153, 0.2)",
    tailwindTextColor: "text-emerald-400",
    tailwindBgColor: "bg-emerald-500/10",
    tailwindBorderColor: "border-emerald-500/30",
  },
  database: {
    label: "DATABASE / VECTOR",
    categoryName: "Context Persistence",
    geometry: "cylinder",
    accentColor: "#22d3ee",
    emissiveColor: "#0891b2",
    glowColor: "rgba(6, 182, 212, 0.2)",
    tailwindTextColor: "text-cyan-400",
    tailwindBgColor: "bg-cyan-500/10",
    tailwindBorderColor: "border-cyan-500/30",
  },
  decision: {
    label: "DECISION LOGIC",
    categoryName: "Branching Condition",
    geometry: "diamond",
    accentColor: "#818cf8",
    emissiveColor: "#4f46e5",
    glowColor: "rgba(99, 102, 241, 0.2)",
    tailwindTextColor: "text-indigo-400",
    tailwindBgColor: "bg-indigo-500/10",
    tailwindBorderColor: "border-indigo-500/30",
  },
  output: {
    label: "OUTPUT / HANDOFF",
    categoryName: "Dispatch & Escalation",
    geometry: "dodecahedron",
    accentColor: "#6ee7b7",
    emissiveColor: "#10b981",
    glowColor: "rgba(52, 211, 153, 0.25)",
    tailwindTextColor: "text-emerald-300",
    tailwindBgColor: "bg-emerald-500/15",
    tailwindBorderColor: "border-emerald-500/35",
  },
  default: {
    label: "PIPELINE STAGE",
    categoryName: "System Node",
    geometry: "sphere",
    accentColor: "#cbd5e1",
    emissiveColor: "#64748b",
    glowColor: "rgba(255, 255, 255, 0.1)",
    tailwindTextColor: "text-slate-300",
    tailwindBgColor: "bg-white/[0.04]",
    tailwindBorderColor: "border-white/10",
  },
};

export interface Step3DNode {
  index: number;
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  tool?: string;
  type: WorkflowStepType | "default";
  config: StepVisualConfig;
  position: [number, number, number];
  rawStep: WorkflowStep;
}

export interface Step3DConnection {
  id: string;
  fromIndex: number;
  toIndex: number;
  start: [number, number, number];
  end: [number, number, number];
  midPoint: [number, number, number];
  color: string;
}

export function detectStepType(
  step: WorkflowStep,
  idx: number,
  total: number,
): WorkflowStepType | "default" {
  if (step.type) return step.type;
  const nameLower = (step.name || step.title || "").toLowerCase();
  const toolLower = (step.tool || "").toLowerCase();
  const descLower = (step.desc || step.description || "").toLowerCase();

  if (nameLower.includes("trigger") || nameLower.includes("webhook") || idx === 0) return "trigger";
  if (nameLower.includes("input") || nameLower.includes("payload") || nameLower.includes("parse")) return "input";
  if (
    nameLower.includes("vector") ||
    nameLower.includes("database") ||
    toolLower.includes("mongo") ||
    toolLower.includes("pinecone") ||
    descLower.includes("vector")
  ) {
    return "database";
  }
  if (
    nameLower.includes("decision") ||
    nameLower.includes("condition") ||
    nameLower.includes("branch") ||
    nameLower.includes("review")
  ) {
    return "decision";
  }
  if (
    nameLower.includes("agent") ||
    nameLower.includes("router") ||
    toolLower.includes("langchain") ||
    toolLower.includes("crewai")
  ) {
    return "agent";
  }
  if (
    nameLower.includes("ai") ||
    nameLower.includes("llm") ||
    nameLower.includes("reason") ||
    toolLower.includes("openai") ||
    toolLower.includes("claude") ||
    toolLower.includes("gpt")
  ) {
    return "ai";
  }
  if (
    nameLower.includes("tool") ||
    nameLower.includes("api") ||
    nameLower.includes("exec") ||
    toolLower.includes("rest") ||
    toolLower.includes("http") ||
    toolLower.includes("resend") ||
    toolLower.includes("gmail")
  ) {
    return "tool";
  }
  if (nameLower.includes("output") || nameLower.includes("dispatch") || nameLower.includes("handoff") || idx === total - 1) {
    return "output";
  }
  return "default";
}

/**
 * Calculates spatial 3D node positions along an ergonomic curved pipeline axis.
 * Nodes flow left-to-right (X) with alternating subtle height (Y) and depth (Z)
 * to create a beautiful, readable depth hierarchy without floating chaos.
 */
export function calculateNodePositions(steps: WorkflowStep[]): Step3DNode[] {
  const total = steps.length;
  if (total === 0) return [];

  // Spacing constants
  const spacingX = total <= 4 ? 3.0 : 2.5;
  const startX = -((total - 1) * spacingX) / 2;

  return steps.map((step, idx) => {
    const type = detectStepType(step, idx, total);
    const config = STEP_3D_CONFIG[type] || STEP_3D_CONFIG.default;

    const x = startX + idx * spacingX;
    // Gentle sine wave elevation for visual cadence
    const y = Math.sin((idx / Math.max(1, total - 1)) * Math.PI) * 0.45 - (idx % 2 === 1 ? 0.2 : -0.1);
    // Spatial arc depth: nodes in the center are slightly pushed forward/back
    const z = Math.sin(((idx + 0.5) / total) * Math.PI) * 0.8 - 0.3;

    return {
      index: idx,
      id: step.id || `node-${idx}-${step.step || idx + 1}`,
      stepNumber: step.step || `0${idx + 1}`,
      title: step.name || step.title || `Stage ${idx + 1}`,
      desc: step.desc || step.description || "System workflow execution node.",
      tool: step.tool,
      type,
      config,
      position: [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))],
      rawStep: step,
    };
  });
}

/**
 * Generates directional connections between sequential nodes.
 */
export function calculateConnections(nodes: Step3DNode[]): Step3DConnection[] {
  const connections: Step3DConnection[] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const fromNode = nodes[i];
    const toNode = nodes[i + 1];

    const start = fromNode.position;
    const end = toNode.position;

    // Midpoint curved slightly upward and toward the viewer for clean arcing
    const midPoint: [number, number, number] = [
      Number(((start[0] + end[0]) / 2).toFixed(3)),
      Number(((start[1] + end[1]) / 2 + 0.35).toFixed(3)),
      Number(((start[2] + end[2]) / 2 + 0.25).toFixed(3)),
    ];

    connections.push({
      id: `conn-${fromNode.index}-${toNode.index}`,
      fromIndex: fromNode.index,
      toIndex: toNode.index,
      start,
      end,
      midPoint,
      color: toNode.config.accentColor,
    });
  }

  return connections;
}
