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
    return NextResponse.json({
      success: true,
      totalCount: memories.length,
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
 * Allows the Admin to chat with the AI about client inquiries, lead demands, and visitor trends.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin && !isAdmin(session?.user?.email, (session?.user as { login?: string })?.login)) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawQuery = typeof body.query === "string" ? body.query : "";
    const cleanQuery = rawQuery
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim()
      .slice(0, 2000);

    if (!cleanQuery) {
      return NextResponse.json({ error: "Query is required (max 2000 chars)" }, { status: 400 });
    }

    // 1. Build private intelligence context from decrypted memories
    const memoryContext = await compileAdminLeadIntelligenceContext();

    const adminSystemPrompt = `
=== PRIVATE EXECUTIVE BUSINESS INTELLIGENCE SYSTEM ===
You are Arefin Mueen's Private Business Intelligence & Lead Analytics Assistant.
Your audience is EXCLUSIVELY the verified website administrator (Arefin Mueen).

ROLE & PURPOSE:
- Analyze encrypted visitor conversation histories, captured client contact info, and workflow automation requirements.
- Provide direct, concise, high-density executive summaries of who contacted, what solutions visitors are requesting, project budgets, and technical demands.
- Format your response with clear Markdown bullet points, bold names/emails, and actionable takeaways.

ENCRYPTED VISITOR CONVERSATION DIGEST:
${memoryContext}
`.trim();

    // 2. Execute AI with memory context
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
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to process intelligence query";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
