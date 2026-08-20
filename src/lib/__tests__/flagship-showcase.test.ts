import { describe, it, expect } from "vitest";
import type { Project } from "@/lib/db/types";

describe("Flagship Systems Filtering & Hierarchy Selection Logic", () => {
  const mockProjects: Project[] = [
    {
      id: "p-email",
      title: "Email Automation & Smart Triage",
      slug: "email-automation-triage",
      category: "AI Automation",
      summary: "Basic inbox triage workflow",
      problem: "Manual email triage",
      goal: "Automate email replies",
      workflowSteps: [],
      aiRole: "Drafts email replies",
      automationLogic: "Webhook",
      integrations: ["n8n", "Gmail"],
      stack: ["n8n", "Gmail"],
      learningOutcome: "MIME parsing",
      iconName: "workflow",
      featured: false,
      tier: "advanced",
      published: true,
      order: 4,
      createdAt: "2025-01-10T00:00:00Z",
      updatedAt: "2025-01-10T00:00:00Z",
    },
    {
      id: "p-woo",
      title: "WooCommerce AI Store Automation",
      slug: "woocommerce-ai-store-automation",
      category: "AI Automation",
      summary: "End-to-end multi-system e-commerce store automation",
      problem: "Fragmented store operations across tools",
      goal: "Unify store admin via Telegram and webhooks",
      workflowSteps: [],
      aiRole: "Conversational store operator",
      automationLogic: "Multi-system n8n pipeline",
      integrations: ["WooCommerce", "Telegram", "OpenAI", "Drive", "Gmail", "Sheets"],
      stack: ["n8n", "WooCommerce", "OpenAI", "Telegram"],
      learningOutcome: "Multi-system orchestration",
      iconName: "workflow",
      featured: true,
      tier: "flagship",
      published: true,
      order: 1,
      featuredOrder: 1,
      createdAt: "2025-03-10T00:00:00Z",
      updatedAt: "2025-03-10T00:00:00Z",
    },
    {
      id: "p-market",
      title: "Market Research Multi-Agent System",
      slug: "market-research-multi-agent",
      category: "Multi-Agent",
      summary: "Collaborative 4-agent market research crew",
      problem: "Manual market research bottleneck",
      goal: "Multi-agent review pipeline",
      workflowSteps: [],
      aiRole: "Specialized cognitive agents",
      automationLogic: "LangChain supervisor loop",
      integrations: ["LangChain", "Claude API", "Notion"],
      stack: ["LangChain", "Python", "Claude API"],
      learningOutcome: "Agent supervisor loops",
      iconName: "brain",
      featured: true,
      tier: "flagship",
      published: true,
      order: 2,
      featuredOrder: 2,
      createdAt: "2025-02-01T00:00:00Z",
      updatedAt: "2025-02-01T00:00:00Z",
    },
    {
      id: "p-support",
      title: "Customer Support Q&A Bot",
      slug: "customer-support-qa-bot",
      category: "AI Chatbot",
      summary: "Enterprise RAG knowledge engine",
      problem: "Repetitive support queries",
      goal: "Accurate citation-backed answers",
      workflowSteps: [],
      aiRole: "Grounded LLM synthesis",
      automationLogic: "Vector search + confidence gate",
      integrations: ["Langflow", "Pinecone", "OpenAI"],
      stack: ["Langflow", "Pinecone", "OpenAI"],
      learningOutcome: "Vector search thresholds",
      iconName: "bookmark",
      featured: true,
      tier: "flagship",
      published: true,
      order: 3,
      featuredOrder: 3,
      createdAt: "2025-01-20T00:00:00Z",
      updatedAt: "2025-01-20T00:00:00Z",
    },
    {
      id: "p-draft",
      title: "Draft Agent",
      slug: "draft-agent",
      category: "AI Automation",
      summary: "Unpublished draft",
      problem: "",
      goal: "",
      workflowSteps: [],
      aiRole: "",
      automationLogic: "",
      integrations: [],
      stack: [],
      learningOutcome: "",
      iconName: "workflow",
      featured: true,
      tier: "flagship",
      published: false,
      order: 0,
      createdAt: "2025-04-01T00:00:00Z",
      updatedAt: "2025-04-01T00:00:00Z",
    },
  ];

  function getFlagshipSystems(projects: Project[]) {
    const published = projects.filter((p) => p.published !== false);

    return published
      .sort((a, b) => {
        const aIsWoo = a.slug === "woocommerce-ai-store-automation";
        const bIsWoo = b.slug === "woocommerce-ai-store-automation";
        if (aIsWoo && !bIsWoo) return -1;
        if (!aIsWoo && bIsWoo) return 1;

        const aIsFlagship = a.tier === "flagship";
        const bIsFlagship = b.tier === "flagship";
        if (aIsFlagship && !bIsFlagship) return -1;
        if (!aIsFlagship && bIsFlagship) return 1;

        const aOrder = a.featuredOrder ?? a.order ?? 99;
        const bOrder = b.featuredOrder ?? b.order ?? 99;
        return aOrder - bOrder;
      })
      .slice(0, 3);
  }

  it("prioritizes WooCommerce AI Store Automation as Flagship #1", () => {
    const flagship = getFlagshipSystems(mockProjects);

    expect(flagship.length).toBe(3);
    expect(flagship[0].slug).toBe("woocommerce-ai-store-automation");
    expect(flagship[1].slug).toBe("market-research-multi-agent");
    expect(flagship[2].slug).toBe("customer-support-qa-bot");
  });

  it("excludes basic email automation from the top 3 flagship showcase", () => {
    const flagship = getFlagshipSystems(mockProjects);
    const hasEmail = flagship.some((p) => p.slug === "email-automation-triage");
    expect(hasEmail).toBe(false);
  });

  it("never includes unpublished draft projects even if marked flagship", () => {
    const flagship = getFlagshipSystems(mockProjects);
    const hasDraft = flagship.some((p) => p.published === false);
    expect(hasDraft).toBe(false);
  });

  it("handles empty or single project list safely", () => {
    expect(getFlagshipSystems([])).toEqual([]);

    const single = [mockProjects[1]];
    const singleFlagship = getFlagshipSystems(single);
    expect(singleFlagship.length).toBe(1);
    expect(singleFlagship[0].slug).toBe("woocommerce-ai-store-automation");
  });
});
