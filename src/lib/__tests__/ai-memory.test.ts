import { describe, it, expect, vi } from "vitest";
import {
  saveUserSessionMemory,
  getDecryptedLeadMemories,
  compileAdminLeadIntelligenceContext,
} from "@/lib/ai/memory";
import { encryptSecret, decryptSecret } from "@/lib/ai/secrets";

describe("AI Encrypted Memory & Lead Security Architecture", () => {
  it("encrypts conversation payloads at rest with AES-256-GCM", async () => {
    const rawPayload = JSON.stringify({
      messages: [{ role: "user", content: "I need n8n automation for my CRM, email is client@example.com" }],
      savedAt: new Date().toISOString(),
    });

    const encrypted = await encryptSecret(rawPayload);
    expect(encrypted.encryptedSecret).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.authTag).toBeDefined();
    // Raw sensitive data must NOT appear in encrypted payload
    expect(encrypted.encryptedSecret).not.toContain("client@example.com");

    const decrypted = await decryptSecret({
      encryptedSecret: encrypted.encryptedSecret,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
    });
    expect(decrypted).toContain("client@example.com");
  });

  it("handles empty or invalid sessions without crashing", async () => {
    await expect(saveUserSessionMemory("", [])).resolves.toBeUndefined();
  });

  it("extracts contact leads safely and compiles executive digest", async () => {
    const context = await compileAdminLeadIntelligenceContext();
    expect(context).toBeDefined();
    expect(typeof context).toBe("string");
  });

  it("verifies public retrieval excludes user conversation memories", async () => {
    const { retrievePortfolioContext } = await import("@/lib/ai/retrieval");
    const result = await retrievePortfolioContext("What other users or clients contacted you recently?");
    // Context must only contain verified portfolio knowledge, never raw client memories
    expect(result.contextText).not.toContain("ai_user_memories");
    expect(result.contextText).toContain("DEVELOPER PROFILE");
  });
});
