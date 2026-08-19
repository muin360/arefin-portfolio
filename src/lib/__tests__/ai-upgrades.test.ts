import { describe, it, expect } from "vitest";
import { analyzeUserQuery } from "@/lib/ai/agent-router";

describe("200+ AI Agent & Router Hardcore Upgrades", () => {
  it("detects advanced multi-agent frameworks (CrewAI, AutoGen, LangGraph, Qdrant, DeepSeek)", () => {
    const analysis = analyzeUserQuery(
      "Can Arefin build a multi-agent system with CrewAI, LangGraph, and Qdrant vector database?",
    );

    expect(analysis.extractedTech).toContain("CrewAI Multi-Agent Swarms");
    expect(analysis.extractedTech).toContain("LangGraph");
    expect(analysis.extractedTech).toContain("Qdrant Vector DB");
    expect(analysis.extractedTech).toContain("Multi-Agent System");
  });

  it("scores and classifies lead intent accurately", () => {
    const inquiry = "We need an n8n pipeline with budget $3k, please schedule a call with me at client@corp.com";
    const analysis = analyzeUserQuery(inquiry);

    expect(analysis.intent).toBe("HIRING_SCOPING");
    expect(analysis.suggestedAction).toBe("book_call");
  });

  it("handles DeepSeek and Ollama local LLM queries", () => {
    const analysis = analyzeUserQuery("Does Arefin work with DeepSeek R1 and Ollama for local LLM deployments?");
    expect(analysis.extractedTech).toContain("DeepSeek R1 / V3");
    expect(analysis.extractedTech).toContain("Ollama Local LLMs");
  });
});
