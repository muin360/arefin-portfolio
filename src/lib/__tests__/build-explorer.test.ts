import { describe, it, expect } from "vitest";
import type { WorkflowStep } from "@/lib/db/types";

describe("BuildExplorer Schema & Workflow Steps", () => {
  it("validates workflow steps structure with custom types", () => {
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

    expect(steps.length).toBe(4);
    expect(steps[0].type).toBe("trigger");
    expect(steps[1].type).toBe("ai");
    expect(steps[2].type).toBe("database");
    expect(steps[3].type).toBe("output");
  });
});
