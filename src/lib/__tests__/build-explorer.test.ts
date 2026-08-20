import { describe, it, expect } from "vitest";
import type { WorkflowStep } from "@/lib/db/types";
import {
  detectStepType,
  calculateNodePositions,
  calculateConnections,
  STEP_3D_CONFIG,
} from "@/components/build-explorer/types";
import {
  trackBuildExplorerOpen,
  trackBuildExplorer3DOpen,
  trackBuildStepClick,
  trackBuildExplorerNodeClick,
  trackBuildExplorerReset,
} from "@/lib/track-event";

describe("BuildExplorer Schema & Workflow Steps", () => {
  const steps: WorkflowStep[] = [
    {
      step: "01",
      type: "trigger",
      name: "Webhook Ingestion",
      desc: "Receives raw customer payload via HTTP POST webhook",
      tool: "n8n Webhook",
    },
    {
      step: "02",
      type: "ai",
      name: "LLM Intent Reasoning",
      desc: "Extracts key intent and entities with structured JSON output",
      tool: "OpenAI GPT-4o",
    },
    {
      step: "03",
      type: "database",
      name: "Vector Retrieval",
      desc: "Queries Pinecone vector database for relevant documentation",
      tool: "Pinecone",
    },
    {
      step: "04",
      type: "output",
      name: "Notification & Response",
      desc: "Dispatches validated response back to user channel",
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

  it("detects step types from step names when type is not explicitly provided", () => {
    expect(detectStepType({ name: "Webhook Trigger", desc: "" }, 0, 4)).toBe("trigger");
    expect(detectStepType({ name: "Vector Search Context", desc: "" }, 1, 4)).toBe("database");
    expect(detectStepType({ name: "Autonomous Agent Routing", desc: "" }, 2, 4)).toBe("agent");
    expect(detectStepType({ name: "Final Output Dispatch", desc: "" }, 3, 4)).toBe("output");
  });

  it("maps step visual configurations to valid Three.js geometry presets", () => {
    expect(STEP_3D_CONFIG.trigger.geometry).toBe("torus");
    expect(STEP_3D_CONFIG.input.geometry).toBe("box");
    expect(STEP_3D_CONFIG.ai.geometry).toBe("sphere");
    expect(STEP_3D_CONFIG.agent.geometry).toBe("octahedron");
    expect(STEP_3D_CONFIG.tool.geometry).toBe("box");
    expect(STEP_3D_CONFIG.database.geometry).toBe("cylinder");
    expect(STEP_3D_CONFIG.decision.geometry).toBe("diamond");
    expect(STEP_3D_CONFIG.output.geometry).toBe("dodecahedron");
  });

  it("calculates 3D node positions along an ergonomic spatial pipeline", () => {
    const nodes = calculateNodePositions(steps);
    expect(nodes.length).toBe(4);

    // X coordinates must increase monotonically
    for (let i = 0; i < nodes.length - 1; i++) {
      expect(nodes[i].position[0]).toBeLessThan(nodes[i + 1].position[0]);
    }

    // Coordinates must be finite valid 3D numbers
    nodes.forEach((node) => {
      expect(node.position.length).toBe(3);
      expect(Number.isFinite(node.position[0])).toBe(true);
      expect(Number.isFinite(node.position[1])).toBe(true);
      expect(Number.isFinite(node.position[2])).toBe(true);
    });
  });

  it("generates N-1 smooth connections with midpoints for N nodes", () => {
    const nodes = calculateNodePositions(steps);
    const connections = calculateConnections(nodes);

    expect(connections.length).toBe(3);
    connections.forEach((conn, i) => {
      expect(conn.fromIndex).toBe(i);
      expect(conn.toIndex).toBe(i + 1);
      expect(conn.start).toEqual(nodes[i].position);
      expect(conn.end).toEqual(nodes[i + 1].position);
      expect(conn.midPoint.length).toBe(3);
    });
  });

  it("handles empty workflow step arrays safely", () => {
    const emptyNodes = calculateNodePositions([]);
    expect(emptyNodes).toEqual([]);
    const emptyConnections = calculateConnections(emptyNodes);
    expect(emptyConnections).toEqual([]);
  });

  it("fires analytics helper functions without throwing exceptions in SSR/browser contexts", () => {
    expect(() => trackBuildExplorerOpen("email-automation-triage")).not.toThrow();
    expect(() => trackBuildExplorer3DOpen("email-automation-triage")).not.toThrow();
    expect(() => trackBuildStepClick("ai", "email-automation-triage")).not.toThrow();
    expect(() => trackBuildExplorerNodeClick("ai", "email-automation-triage")).not.toThrow();
    expect(() => trackBuildExplorerReset("email-automation-triage")).not.toThrow();
  });
});
