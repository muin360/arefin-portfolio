import type { WorkflowStep } from "@/lib/db/types";

export type BlueprintNodeType =
  | "trigger"
  | "input"
  | "ai"
  | "agent"
  | "tool"
  | "database"
  | "decision"
  | "output"
  | "default";

export interface BlueprintNodeShapeConfig {
  label: string;
  category: string;
  shape: "bracket" | "capsule" | "datastack" | "module" | "diamond" | "terminal" | "rect";
  accentHex: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentBorderActive: string;
  whyItExists: string;
}

export const BLUEPRINT_NODE_CONFIG: Record<BlueprintNodeType, BlueprintNodeShapeConfig> = {
  trigger: {
    label: "TRIGGER",
    category: "Ingestion Port",
    shape: "bracket",
    accentHex: "#f59e0b",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500/[0.08]",
    accentBorder: "border-amber-500/25",
    accentBorderActive: "border-amber-400",
    whyItExists: "Ingests raw event payloads, webhook calls, or scheduled triggers and validates headers and signatures.",
  },
  input: {
    label: "DATA INPUT",
    category: "Schema Normalization",
    shape: "module",
    accentHex: "#38bdf8",
    accentText: "text-sky-400",
    accentBg: "bg-sky-500/[0.08]",
    accentBorder: "border-sky-500/25",
    accentBorderActive: "border-sky-400",
    whyItExists: "Normalizes unstructured incoming payloads into strictly typed, sanitized JSON contracts ready for reasoning.",
  },
  ai: {
    label: "AI REASONING",
    category: "Inference Engine",
    shape: "capsule",
    accentHex: "#a78bfa",
    accentText: "text-violet-400",
    accentBg: "bg-violet-500/[0.08]",
    accentBorder: "border-violet-500/25",
    accentBorderActive: "border-violet-400",
    whyItExists: "Executes LLM reasoning, intent classification, and parameter extraction with strict system prompt guardrails.",
  },
  agent: {
    label: "AGENT ROUTER",
    category: "Policy & Orchestration",
    shape: "diamond",
    accentHex: "#c084fc",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/[0.08]",
    accentBorder: "border-purple-500/25",
    accentBorderActive: "border-purple-400",
    whyItExists: "Dynamically selects execution tools and branches workflows based on confidence scores and deterministic rules.",
  },
  tool: {
    label: "TOOL / API",
    category: "External Execution",
    shape: "module",
    accentHex: "#34d399",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/[0.08]",
    accentBorder: "border-emerald-500/25",
    accentBorderActive: "border-emerald-400",
    whyItExists: "Executes external REST API mutations, webhook dispatches, database writes, or third-party platform actions.",
  },
  database: {
    label: "DATABASE / VECTOR",
    category: "Context Persistence",
    shape: "datastack",
    accentHex: "#22d3ee",
    accentText: "text-cyan-400",
    accentBg: "bg-cyan-500/[0.08]",
    accentBorder: "border-cyan-500/25",
    accentBorderActive: "border-cyan-400",
    whyItExists: "Stores conversation memory and performs hybrid dense-sparse vector similarity search for grounded retrieval.",
  },
  decision: {
    label: "DECISION LOGIC",
    category: "Conditional Branch",
    shape: "diamond",
    accentHex: "#818cf8",
    accentText: "text-indigo-400",
    accentBg: "bg-indigo-500/[0.08]",
    accentBorder: "border-indigo-500/25",
    accentBorderActive: "border-indigo-400",
    whyItExists: "Applies validation thresholds, policy checks, and human-in-the-loop escalation criteria.",
  },
  output: {
    label: "OUTPUT / HANDOFF",
    category: "Terminal Delivery",
    shape: "terminal",
    accentHex: "#10b981",
    accentText: "text-emerald-300",
    accentBg: "bg-emerald-500/[0.08]",
    accentBorder: "border-emerald-500/25",
    accentBorderActive: "border-emerald-400",
    whyItExists: "Formats final responses, updates client dashboards, notifies Slack/WhatsApp, or hands off to human operators.",
  },
  default: {
    label: "PIPELINE STAGE",
    category: "System Node",
    shape: "rect",
    accentHex: "#94a3b8",
    accentText: "text-slate-300",
    accentBg: "bg-white/[0.04]",
    accentBorder: "border-white/10",
    accentBorderActive: "border-white/40",
    whyItExists: "Processes data payload and transitions state to the downstream execution phase.",
  },
};

export interface BlueprintNodeData {
  index: number;
  id: string;
  stepNumber: string;
  title: string;
  functionSummary: string;
  description: string;
  tool?: string;
  type: BlueprintNodeType;
  config: BlueprintNodeShapeConfig;
  rawStep: WorkflowStep;
}

export function detectBlueprintStepType(
  step: WorkflowStep,
  idx: number,
  total: number,
): BlueprintNodeType {
  if (step.type && step.type in BLUEPRINT_NODE_CONFIG) {
    return step.type as BlueprintNodeType;
  }
  const nameLower = (step.name || step.title || "").toLowerCase();
  const toolLower = (step.tool || "").toLowerCase();
  const descLower = (step.desc || step.description || "").toLowerCase();

  if (nameLower.includes("trigger") || nameLower.includes("webhook") || idx === 0) return "trigger";
  if (nameLower.includes("input") || nameLower.includes("payload") || nameLower.includes("parse")) return "input";
  if (
    nameLower.includes("vector") ||
    nameLower.includes("database") ||
    nameLower.includes("mongo") ||
    nameLower.includes("pinecone") ||
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
    nameLower.includes("review") ||
    nameLower.includes("human")
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
    nameLower.includes("process") ||
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
  if (
    nameLower.includes("output") ||
    nameLower.includes("dispatch") ||
    nameLower.includes("handoff") ||
    nameLower.includes("response") ||
    idx === total - 1
  ) {
    return "output";
  }
  return "default";
}

/**
 * Transforms an array of WorkflowSteps into normalized BlueprintNodeData
 */
export function formatBlueprintNodes(steps: WorkflowStep[]): BlueprintNodeData[] {
  const total = steps.length;
  return steps.map((step, idx) => {
    const type = detectBlueprintStepType(step, idx, total);
    const config = BLUEPRINT_NODE_CONFIG[type] || BLUEPRINT_NODE_CONFIG.default;
    const desc = step.desc || step.description || "Processes payload and transitions pipeline state.";
    
    // Extract concise functional summary (1 sentence max)
    const firstSentence = desc.split(/[.!?]/)[0]?.trim() || desc;
    const functionSummary = firstSentence.length > 85 ? firstSentence.slice(0, 82) + "..." : firstSentence;

    return {
      index: idx,
      id: step.id || `node-${idx}-${step.step || idx + 1}`,
      stepNumber: step.step || `0${idx + 1}`,
      title: step.name || step.title || `Stage ${idx + 1}`,
      functionSummary,
      description: desc,
      tool: step.tool,
      type,
      config,
      rawStep: step,
    };
  });
}
