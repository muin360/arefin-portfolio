import { describe, it, expect } from "vitest";
import type { WorkflowStep } from "@/lib/db/types";
import {
  detectBlueprintStepType,
  formatBlueprintNodes,
  BLUEPRINT_NODE_CONFIG,
} from "@/components/blueprint/types";
import {
  trackBuildExplorerOpen,
  trackBuildStepClick,
  trackBlueprintCopySpecs,
} from "@/lib/track-event";

describe("Interactive System Blueprint Schema & Workflow Steps", () => {
  const steps: WorkflowStep[] = [
    {
      step: "01",
      type: "trigger",
      name: "Webhook Ingestion",
      desc: "Receives raw customer payload via HTTP POST webhook with header validation.",
      tool: "n8n Webhook",
    },
    {
      step: "02",
      type: "ai",
      name: "LLM Intent Reasoning",
      desc: "Extracts key intent and entities with structured JSON output and safety guardrails.",
      tool: "OpenAI GPT-4o",
    },
    {
      step: "03",
      type: "database",
      name: "Vector Retrieval",
      desc: "Queries Pinecone vector database for relevant enterprise documentation.",
      tool: "Pinecone",
    },
    {
      step: "04",
      type: "output",
      name: "Notification & Response",
      desc: "Dispatches validated response back to user channel and updates Notion logs.",
      tool: "Resend API",
    },
  ];

  it("validates workflow steps structure with custom types", () => {
    expect(steps.length).toBe(4);
    expect(steps[0].type).toBe("trigger");
    expect(steps[1].type).toBe("ai");
    expect(steps[2].type).toBe("database");
    expect(steps[3].type).toBe("output");
  });

  it("detects blueprint step types from names and descriptions when type is missing", () => {
    expect(detectBlueprintStepType({ name: "Webhook Trigger", desc: "" }, 0, 4)).toBe("trigger");
    expect(detectBlueprintStepType({ name: "Context Vector Search", desc: "" }, 1, 4)).toBe("database");
    expect(detectBlueprintStepType({ name: "Autonomous Agent Routing", desc: "" }, 2, 4)).toBe("agent");
    expect(detectBlueprintStepType({ name: "Slack Dispatch Output", desc: "" }, 3, 4)).toBe("output");
  });

  it("formats blueprint nodes with custom architectural shapes and summaries", () => {
    const nodes = formatBlueprintNodes(steps);
    expect(nodes.length).toBe(4);

    expect(nodes[0].config.shape).toBe("bracket");
    expect(nodes[1].config.shape).toBe("capsule");
    expect(nodes[2].config.shape).toBe("datastack");
    expect(nodes[3].config.shape).toBe("terminal");

    // Must have non-empty functionSummary and whyItExists
    nodes.forEach((node) => {
      expect(node.functionSummary.length).toBeGreaterThan(0);
      expect(node.config.whyItExists.length).toBeGreaterThan(0);
      expect(node.stepNumber).toBeDefined();
    });
  });

  it("maps all blueprint node types to valid shape configurations", () => {
    expect(BLUEPRINT_NODE_CONFIG.trigger.shape).toBe("bracket");
    expect(BLUEPRINT_NODE_CONFIG.input.shape).toBe("module");
    expect(BLUEPRINT_NODE_CONFIG.ai.shape).toBe("capsule");
    expect(BLUEPRINT_NODE_CONFIG.agent.shape).toBe("diamond");
    expect(BLUEPRINT_NODE_CONFIG.tool.shape).toBe("module");
    expect(BLUEPRINT_NODE_CONFIG.database.shape).toBe("datastack");
    expect(BLUEPRINT_NODE_CONFIG.decision.shape).toBe("diamond");
    expect(BLUEPRINT_NODE_CONFIG.output.shape).toBe("terminal");
  });

  it("handles empty workflow step arrays safely", () => {
    const emptyNodes = formatBlueprintNodes([]);
    expect(emptyNodes).toEqual([]);
  });

  it("fires analytics helper functions without throwing exceptions in SSR/browser contexts", () => {
    expect(() => trackBuildExplorerOpen("email-automation-triage")).not.toThrow();
    expect(() => trackBuildStepClick("ai", "email-automation-triage")).not.toThrow();
    expect(() => trackBlueprintCopySpecs("email-automation-triage")).not.toThrow();
  });
});
