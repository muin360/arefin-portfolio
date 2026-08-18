import type { Citation } from "./retrieval";
import { executeAI, type ChatMessage } from "./providers";
import type { AIProviderName } from "@/lib/db/types";

export type { ChatMessage };

export type GenerateResponseOptions = {
  messages: ChatMessage[];
  contextText?: string;
  citations?: Citation[];
  systemPromptOverride?: string;
  requestType?: "chat" | "playground" | "health";
  clientIpHash?: string;
};

export type GenerateResponseResult = {
  reply: string;
  citations: Citation[];
  providerUsed: AIProviderName | "anthropic" | "openai" | "gemini" | "local_grounded";
  modelUsed?: string;
  tokens?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  latencyMs?: number;
};

/**
 * Main backward-compatible entrypoint for generating responses.
 * Proxies to dynamic provider abstraction layer.
 */
export async function generateAIResponse(
  options: GenerateResponseOptions,
): Promise<GenerateResponseResult> {
  const result = await executeAI({
    messages: options.messages,
    contextOverride: options.contextText,
    citationsOverride: options.citations,
    systemPromptOverride: options.systemPromptOverride,
    requestType: options.requestType || "chat",
    clientIpHash: options.clientIpHash,
  });

  return {
    reply: result.reply,
    citations: result.citations,
    providerUsed: result.providerUsed,
    modelUsed: result.modelUsed,
    tokens: result.tokens,
    latencyMs: result.latencyMs,
  };
}
