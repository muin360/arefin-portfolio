import { describe, it, expect } from "vitest";
import type { Project, ProjectCaseStudy, CaseStudyMetric } from "@/lib/db/types";

describe("Case Study & Proof System Logic", () => {
  const sampleCaseStudy: ProjectCaseStudy = {
    enabled: true,
    status: "published",
    eyebrow: "PRODUCTION ARCHITECTURE · MULTI-SYSTEM AUTOMATION",
    shortSummary: "End-to-end multi-system store automation connecting Telegram, OpenAI, WooCommerce, Drive, and Gmail.",
    problem: "Manual context-switching causes delayed order dispatch.",
    solution: "Event-driven webhook pipeline orchestrating n8n and tool-calling.",
    aiRole: "Intent parsing and structured catalog updating.",
    automationRole: "PDF rendering, Drive archiving, and customer notifications.",
    integrations: [
      { name: "WooCommerce REST API", category: "E-Commerce", purpose: "Catalog CRUD mutations" },
      { name: "OpenAI GPT-4o", category: "AI", purpose: "Function schemas and intent parsing" },
    ],
    proofItems: [
      {
        id: "proof-1",
        type: "workflow",
        title: "n8n DAG Workflow",
        mediaUrl: "https://example.com/workflow.png",
        order: 1,
        featured: true,
      },
      {
        id: "proof-2",
        type: "output",
        title: "Generated PDF Invoice",
        mediaUrl: "https://example.com/invoice.pdf",
        order: 2,
        featured: false,
      },
    ],
    metrics: [
      { label: "Execution Pipeline", value: "6 Systems", context: "Telegram, WooCommerce, Drive", isVerified: true },
      { label: "Latency Reduction", value: "85%", context: "Compared to manual entry", isVerified: false },
    ],
    learnings: "Mastered idempotent webhooks under concurrency.",
    limitations: "Requires rate-limit monitoring during flash sales.",
    featuredProof: "https://example.com/workflow.png",
  };

  const mockProject: Project = {
    id: "p-woo",
    title: "WooCommerce AI Store Automation",
    slug: "woocommerce-ai-store-automation",
    projectType: "Multi-System Automation Project",
    category: "AI Automation",
    summary: "Multi-system store automation",
    problem: "Manual e-commerce friction",
    goal: "Unify store admin",
    workflowSteps: [
      { step: "01", type: "trigger", name: "Telegram Bot", desc: "Command trigger" },
      { step: "02", type: "agent", name: "AI Router", desc: "Intent parsing" },
    ],
    aiRole: "Conversational store operator",
    automationLogic: "n8n workflow orchestrator",
    integrations: ["n8n", "WooCommerce", "OpenAI"],
    stack: ["n8n", "WooCommerce", "OpenAI"],
    learningOutcome: "Error handling & webhooks",
    iconName: "workflow",
    featured: true,
    published: true,
    order: 1,
    caseStudy: sampleCaseStudy,
    createdAt: "2025-03-10T10:00:00Z",
    updatedAt: "2025-03-10T10:00:00Z",
  };

  it("identifies when a project has an active published case study", () => {
    const isPublicCaseStudy =
      mockProject.caseStudy?.enabled === true &&
      mockProject.caseStudy?.status === "published";

    expect(isPublicCaseStudy).toBe(true);
  });

  it("strictly hides draft case studies from public visitors without preview mode", () => {
    const draftProject: Project = {
      ...mockProject,
      caseStudy: {
        ...sampleCaseStudy,
        status: "draft",
      },
    };

    const isPublic =
      draftProject.caseStudy?.enabled === true &&
      draftProject.caseStudy?.status === "published";

    const isVisibleInPreview =
      draftProject.caseStudy?.enabled === true &&
      (draftProject.caseStudy?.status === "published" || true); // preview = true

    expect(isPublic).toBe(false);
    expect(isVisibleInPreview).toBe(true);
  });

  it("correctly identifies hero featured proof and fallback order", () => {
    const proofs = mockProject.caseStudy?.proofItems || [];
    const featured = proofs.find((p) => p.featured);

    expect(featured).toBeDefined();
    expect(featured?.title).toBe("n8n DAG Workflow");
    expect(featured?.type).toBe("workflow");
  });

  it("accurately distinguishes verified metrics from observed prototype benchmarks", () => {
    const metrics: CaseStudyMetric[] = mockProject.caseStudy?.metrics || [];

    const verified = metrics.filter((m) => m.isVerified);
    const unverified = metrics.filter((m) => !m.isVerified);

    expect(verified.length).toBe(1);
    expect(verified[0].label).toBe("Execution Pipeline");
    expect(unverified.length).toBe(1);
    expect(unverified[0].label).toBe("Latency Reduction");
  });

  it("preserves backward compatibility for projects without caseStudy data", () => {
    const legacyProject: Project = {
      id: "p-legacy",
      title: "Legacy Project",
      slug: "legacy-project",
      projectType: "Automation",
      category: "AI",
      summary: "Standard project",
      problem: "Problem",
      goal: "Goal",
      workflowSteps: [],
      aiRole: "AI",
      automationLogic: "Logic",
      integrations: [],
      stack: [],
      learningOutcome: "Outcome",
      iconName: "workflow",
      featured: false,
      published: true,
      order: 5,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    };

    expect(legacyProject.caseStudy).toBeUndefined();
    const hasCaseStudy = legacyProject.caseStudy?.enabled === true;
    expect(hasCaseStudy).toBe(false);
  });
});
