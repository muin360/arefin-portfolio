import { getDb } from "@/lib/mongodb";
import { encryptSecret, decryptSecret } from "./secrets";
import { analyzeUserQuery } from "./agent-router";
import type { AIUserMemory } from "@/lib/db/types";
import type { ChatMessage } from "./providers/types";

const COLLECTION_NAME = "ai_user_memories";

export interface DecryptedLeadMemory {
  id: string;
  sessionId: string;
  messages: ChatMessage[];
  extractedLead?: {
    hasContactInfo: boolean;
    name?: string;
    email?: string;
    phone?: string;
    intent: string;
    extractedTech: string[];
    summarySnippet: string;
  };
  lastActiveAt: string;
  createdAt: string;
}

/**
 * Extracts potential lead info (email, phone, name) safely without leaking.
 */
function extractLeadMetadata(messages: ChatMessage[]) {
  const fullText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" \n ");

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
  const nameMatch = fullText.match(/(?:my name is|i am|call me|this is)\s+([A-Za-z\s]{2,25})/i);

  const lastQuery = messages[messages.length - 1]?.content || "";
  const analysis = analyzeUserQuery(lastQuery);

  const hasContactInfo = Boolean(emailMatch || phoneMatch);

  return {
    hasContactInfo,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    name: nameMatch ? nameMatch[1].trim() : undefined,
    intent: analysis.intent,
    extractedTech: analysis.extractedTech,
    summarySnippet: lastQuery.slice(0, 120),
  };
}

/**
 * Securely encrypts and saves user conversation session memory into MongoDB.
 * AES-256-GCM encryption at rest ensures zero cross-tenant leakage.
 */
export async function saveUserSessionMemory(
  sessionId: string,
  messages: ChatMessage[],
): Promise<void> {
  if (!sessionId || !messages || messages.length === 0) return;

  try {
    const db = await getDb();
    if (!db) return;

    const leadMeta = extractLeadMetadata(messages);
    const now = new Date().toISOString();

    // Payload to encrypt
    const rawPayload = JSON.stringify({
      messages,
      leadMeta,
      savedAt: now,
    });

    const encrypted = await encryptSecret(rawPayload);

    await db.collection(COLLECTION_NAME).updateOne(
      { sessionId },
      {
        $set: {
          sessionId,
          encryptedData: encrypted.encryptedSecret,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          extractedLead: {
            hasContactInfo: leadMeta.hasContactInfo,
            name: leadMeta.name,
            intent: leadMeta.intent,
            extractedTech: leadMeta.extractedTech,
            summarySnippet: leadMeta.summarySnippet,
          },
          lastActiveAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );
  } catch (err) {
    // Non-blocking log
    console.error("[AI Memory] Failed to save encrypted user memory:", err);
  }
}

/**
 * Decrypts user memories for Admin viewing.
 * Accessible strictly by authenticated administrators.
 */
export async function getDecryptedLeadMemories(limit = 40): Promise<DecryptedLeadMemory[]> {
  const db = await getDb();
  if (!db) return [];

  const rawRecords = (await db
    .collection<AIUserMemory>(COLLECTION_NAME)
    .find({})
    .sort({ lastActiveAt: -1 })
    .limit(limit)
    .toArray()) as AIUserMemory[];

  const decryptedList: DecryptedLeadMemory[] = [];

  for (const record of rawRecords) {
    try {
      if (!record.encryptedData || !record.iv || !record.authTag) continue;

      const decryptedJson = await decryptSecret({
        encryptedSecret: record.encryptedData,
        iv: record.iv,
        authTag: record.authTag,
      });

      const parsed = JSON.parse(decryptedJson);
      decryptedList.push({
        id: record.id || record.sessionId,
        sessionId: record.sessionId,
        messages: parsed.messages || [],
        extractedLead: parsed.leadMeta || record.extractedLead,
        lastActiveAt: record.lastActiveAt,
        createdAt: record.createdAt,
      });
    } catch {
      // Skip un-decryptable corrupt records
    }
  }

  return decryptedList;
}

/**
 * Builds high-density executive intelligence from decrypted memory for Admin AI querying.
 */
export async function compileAdminLeadIntelligenceContext(): Promise<string> {
  const memories = await getDecryptedLeadMemories(25);

  if (memories.length === 0) {
    return "NO VISITOR SESSIONS RECORDED YET. There are currently no recorded client inquiries or conversation logs in the database.";
  }

  const sections: string[] = [];
  sections.push(`TOTAL RECORDED SESSIONS: ${memories.length}`);

  memories.forEach((m, idx) => {
    const userMsgs = m.messages.filter((msg) => msg.role === "user");
    const assistantMsgs = m.messages.filter((msg) => msg.role === "assistant");
    const lead = m.extractedLead;

    const contactStr = lead?.hasContactInfo
      ? `[CONTACT CAPTURED] Email: ${lead.email || "N/A"} | Phone: ${lead.phone || "N/A"} | Name: ${lead.name || "N/A"}`
      : `[NO CONTACT INFO]`;

    const inquirySummary = userMsgs.map((u, i) => `   U${i + 1}: ${u.content}`).join("\n");

    sections.push(`
SESSION #${idx + 1} (${m.lastActiveAt})
Session ID: ${m.sessionId}
Status: ${contactStr}
Intent: ${lead?.intent || "GENERAL_INQUIRY"}
Tech Mentioned: ${(lead?.extractedTech || []).join(", ") || "None"}
Messages Count: ${m.messages.length} (${userMsgs.length} user, ${assistantMsgs.length} bot)
Conversation Inquiries:
${inquirySummary}
----------------------------------------`);
  });

  return sections.join("\n");
}
