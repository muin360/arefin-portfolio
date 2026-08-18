import type { AIProviderName } from "@/lib/db/types";
import type { Citation } from "@/lib/ai/retrieval";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProviderRequest {
  messages: ChatMessage[];
  systemPrompt: string;
  modelId: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  contextText?: string;
  citations?: Citation[];
  apiKey?: string;
  baseUrl?: string;
  organizationId?: string;
  timeoutMs?: number;
}

export interface AIProviderResponse {
  reply: string;
  citations: Citation[];
  providerUsed: AIProviderName;
  modelUsed: string;
  tokens?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  latencyMs?: number;
}

export interface ProviderHealthCheckResult {
  ok: boolean;
  status: "connected" | "invalid" | "unavailable" | "not_configured";
  message: string;
  latencyMs?: number;
}

export interface AIProviderAdapter {
  name: AIProviderName;
  generate(req: AIProviderRequest): Promise<AIProviderResponse>;
  healthCheck(credentials?: {
    apiKey?: string;
    baseUrl?: string;
    organizationId?: string;
  }): Promise<ProviderHealthCheckResult>;
}
