import { NextRequest, NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth";
import {
  getDecryptedLeadMemories,
  compileAdminLeadIntelligenceContext,
} from "@/lib/ai/memory";
import { executeAI } from "@/lib/ai/providers";

export const runtime = "nodejs";

/**
 * GET /api/admin/ai/memory
 * Returns decrypted conversation memories and captured client leads (Admin only).
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin && !isAdmin(session?.user?.email, (session?.user as { login?: string })?.login)) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const safeLimit = Math.min(Math.max(isNaN(limitParam) ? 50 : limitParam, 1), 100);

    const memories = await getDecryptedLeadMemories(safeLimit);
    const hotLeadsCount = memories.filter((m) => m.extractedLead?.leadTier === "HOT").length;
    const warmLeadsCount = memories.filter((m) => m.extractedLead?.leadTier === "WARM").length;

    return NextResponse.json({
      success: true,
      totalCount: memories.length,
      hotLeadsCount,
      warmLeadsCount,
      limit: safeLimit,
      memories,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load memories";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/ai/memory
 * Advanced Executive Assistant, Lead Intelligence & Content Generator for Admin.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin && !isAdmin(session?.user?.email, (session?.user as { login?: string })?.login)) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action : "query";
    const rawQuery = typeof body.query === "string" ? body.query : "";
    const cleanQuery = rawQuery
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim()
      .slice(0, 3000);

    // ─── ACTION: EXPORT MARKDOWN ───────────────────────────────────────────
    if (action === "export_markdown") {
      const memoryContext = await compileAdminLeadIntelligenceContext();
      return NextResponse.json({
        success: true,
        markdown: `# AREFIN MUEEN - EXECUTIVE BUSINESS & LEAD INTELLIGENCE REPORT
*Generated at: ${new Date().toISOString()}*

${memoryContext}`,
      });
    }

    if (!cleanQuery) {
      return NextResponse.json({ error: "Query is required (max 3000 chars)" }, { status: 400 });
    }

    // 1. Build private intelligence context from decrypted memories
    const memoryContext = await compileAdminLeadIntelligenceContext();

    // 2. Configure dynamic prompt based on action mode
    let adminSystemPrompt = `
=== PRIVATE EXECUTIVE BUSINESS INTELLIGENCE SYSTEM ===
You are Arefin Mueen's Private Business Intelligence & Lead Analytics Assistant.
Your audience is EXCLUSIVELY the verified website administrator (Arefin Mueen).

ROLE & PURPOSE:
- Analyze encrypted visitor conversation histories, captured client contact info, and workflow automation requirements.
- Provide direct, concise, high-density executive summaries of who contacted, what solutions visitors are requesting, project budgets, and technical demands.
- Format your response with clear Markdown bullet points, bold names/emails, callout alert cards, and actionable takeaways.

ENCRYPTED VISITOR CONVERSATION DIGEST:
${memoryContext}
`.trim();

    if (action === "draft_case_study") {
      adminSystemPrompt = `
=== EXECUTIVE CASE STUDY & PORTFOLIO WRITER ===
You are Arefin Mueen's Senior AI Portfolio Architect & Technical Case Study Writer.
Convert the provided specs or notes into a production-grade portfolio case study formatted with:
1. Executive Overview & Problem Statement
2. Architecture Blueprint (Components, Flow, Vector/RAG pipeline, Webhooks)
3. Technical Stack Matrix (n8n, Python, LangChain, Pinecone, FastAPI)
4. Verified Impact Metrics (Latency, Throughput, Efficiency Gains)
`.trim();
    } else if (action === "draft_proposal") {
      adminSystemPrompt = `
=== EXECUTIVE CLIENT PROPOSAL & SCOPE BUILDER ===
You are Arefin Mueen's Executive Technical Sales Engineer.
Draft a high-converting, professional project proposal and statement of work (SOW) based on client requirements.
Include:
1. Proposed Solution Architecture
2. Phased Milestone Deliverables (Phase 1 to Phase 3)
3. Tech Stack & Integration Points
4. Estimated Timeline & Discovery Recommendations
`.trim();
    } else if (action === "draft_seo") {
      adminSystemPrompt = `
=== TECHNICAL SEO & METADATA ARCHITECT ===
Generate high-ranking meta titles, meta descriptions, OpenGraph tags, and JSON-LD schema for Arefin's portfolio.
`.trim();
    } else if (action === "health_audit") {
      adminSystemPrompt = `
=== SYSTEM HEALTH & AI OBSERVABILITY AUDITOR ===
You are Arefin Mueen's Principal AI Infrastructure Engineer & Security Auditor.
Analyze system reliability, API provider failovers, token efficiency, memory security, and rate limiting status.
Provide:
1. Provider Health & Latency Benchmarks
2. Token Usage & Cost Efficiency Breakdown
3. Security, AES-256-GCM Vault & Isolation Verification
4. Architectural Recommendations for Next Steps
`.trim();
    }

    // 3. Execute AI with memory context
    const aiResponse = await executeAI({
      messages: [{ role: "user", content: cleanQuery }],
      systemPromptOverride: adminSystemPrompt,
      contextOverride: memoryContext,
      requestType: "playground",
    });

    return NextResponse.json({
      success: true,
      reply: aiResponse.reply,
      providerUsed: aiResponse.providerUsed,
      modelUsed: aiResponse.modelUsed,
      tokens: aiResponse.tokens,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to process intelligence query";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
