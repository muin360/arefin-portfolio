import { z } from "zod";
import { ALLOWED_MODELS } from "./defaults";
import type { AIProviderName, AIConfig } from "../db/types";

// ─── 1. CHAT REQUEST SCHEMA ───────────────────────────────────────────────

export const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z
      .string()
      .trim()
      .min(1, "Message content cannot be empty")
      .max(3000, "Message exceeds 3,000 character limit"),
  })
  .strict();

export const chatRequestSchema = z
  .object({
    messages: z
      .array(chatMessageSchema)
      .min(1, "At least one message is required")
      .max(20, "Conversation history cannot exceed 20 messages"),
  })
  .strict();

// ─── 2. PROVIDER CREDENTIAL SCHEMA ────────────────────────────────────────

export const providerCredentialSchema = z
  .object({
    provider: z.enum(["openai", "anthropic", "google"]),
    secret: z
      .string()
      .trim()
      .min(1, "API secret key is required")
      .max(500, "API secret key is unusually long (max 500 chars)"),
    baseUrl: z
      .string()
      .trim()
      .url("Custom Base URL must be a valid HTTP/HTTPS URL")
      .optional()
      .nullable()
      .or(z.literal("")),
    organizationId: z
      .string()
      .trim()
      .max(100, "Organization ID cannot exceed 100 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
  })
  .strict();

// ─── 3. BRAIN CONFIG SCHEMA ───────────────────────────────────────────────

export const aiBrainConfigSchema = z
  .object({
    name: z.string().trim().min(1).max(50),
    role: z.string().trim().min(1).max(100),
    persona: z.string().trim().min(1).max(1000),
    displayDescription: z.string().trim().min(1).max(300),
    systemPrompt: z.string().trim().min(1).max(8000),
    behaviorRules: z
      .array(z.string().trim().min(1).max(400))
      .max(30, "Cannot exceed 30 behavior rules"),
    knowledgeRules: z
      .array(z.string().trim().min(1).max(400))
      .max(30)
      .default([]),
    safetyRules: z
      .array(z.string().trim().min(1).max(400))
      .max(30)
      .default([]),
    responseStyle: z.string().trim().max(1000).default("Structured Markdown with bullet points."),
    greeting: z.string().trim().min(1).max(500),
    fallbackResponse: z.string().trim().min(1).max(500),
    suggestedPrompts: z
      .array(z.string().trim().min(1).max(150))
      .max(15, "Cannot exceed 15 suggested prompts"),
    tone: z.enum(["technical_direct", "collaborative", "executive", "analytical"]),
    languageBehavior: z.enum(["auto_detect", "english_only", "configurable"]),
  })
  .strict();

// ─── 4. MODEL CONFIG SCHEMA ───────────────────────────────────────────────

export const aiModelConfigSchema = z
  .object({
    provider: z.enum(["openai", "anthropic", "google", "local_grounded"]),
    modelId: z.string().trim().min(1).max(100),
    temperature: z.number().min(0, "Temperature cannot be negative").max(2, "Temperature cannot exceed 2.0"),
    topP: z.number().min(0, "Top P cannot be negative").max(1, "Top P cannot exceed 1.0"),
    maxTokens: z.number().int().min(50, "Min tokens is 50").max(4000, "Max tokens is 4,000"),
    contextBudget: z.number().int().min(500).max(15000).optional().default(5000),
    timeoutMs: z.number().int().min(5000, "Timeout min 5s").max(60000, "Timeout max 60s"),
    enableFailover: z.boolean(),
    fallbackProvider: z.enum(["openai", "anthropic", "google", "local_grounded"]).optional(),
    fallbackModelId: z.string().trim().max(100).optional(),
  })
  .strict();

// ─── 5. KNOWLEDGE CONFIG SCHEMA ───────────────────────────────────────────

export const aiKnowledgeConfigSchema = z
  .object({
    enabledCollections: z
      .object({
        projects: z.boolean(),
        services: z.boolean(),
        posts: z.boolean(),
        skills: z.boolean(),
        about: z.boolean(),
      })
      .strict(),
    topK: z.number().int().min(1, "Top K min 1").max(10, "Top K max 10"),
    minRelevanceScore: z.number().min(0).max(1),
    contextBudgetChars: z.number().int().min(500).max(15000),
    maxDocuments: z.number().int().min(1).max(20).optional().default(10),
    includeSourceLinks: z.boolean(),
  })
  .strict();

// ─── 6. SAFETY & LIMITS CONFIG SCHEMAS ────────────────────────────────────

export const aiSafetyConfigSchema = z
  .object({
    promptInjectionDefense: z.boolean(),
    strictGrounding: z.boolean(),
    blockSecretExtraction: z.boolean().optional().default(true),
    toolPermissions: z.enum(["public_read_only", "admin"]).optional().default("public_read_only"),
  })
  .strict();

export const aiLimitsConfigSchema = z
  .object({
    rateLimitPerMin: z.number().int().min(1, "Min rate limit is 1/min").max(60, "Max rate limit is 60/min"),
    maxPromptLength: z.number().int().min(200).max(3000),
    maxOutputTokens: z.number().int().min(50).max(4000),
    dailyRequestLimit: z.number().int().min(50).max(50000),
    monthlyRequestLimit: z.number().int().min(500).max(500000),
  })
  .strict();

// ─── 7. FULL AI CONFIG SCHEMA ─────────────────────────────────────────────

export const aiConfigSchema = z
  .object({
    id: z.string().optional(),
    status: z.enum(["active", "draft"]).optional().default("draft"),
    versionNumber: z.number().int().min(1).optional().default(1),
    promptHash: z.string().max(64).optional(),
    brain: aiBrainConfigSchema,
    model: aiModelConfigSchema,
    knowledge: aiKnowledgeConfigSchema,
    safety: aiSafetyConfigSchema,
    limits: aiLimitsConfigSchema,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    updatedBy: z.string().optional(),
  })
  .strict();

// ─── 8. PLAYGROUND REQUEST SCHEMA ─────────────────────────────────────────

export const playgroundRequestSchema = z
  .object({
    prompt: z.string().trim().min(1, "Prompt cannot be empty").max(3000, "Prompt exceeds 3,000 characters"),
    targetMode: z.enum(["active", "draft"]).default("active"),
    systemPromptOverride: z.string().trim().max(4000).optional().or(z.literal("")),
    configOverride: z.custom<Partial<AIConfig>>().optional(),
  })
  .strict();

// ─── 9. VALIDATION HELPER FUNCTIONS ───────────────────────────────────────

/**
 * Validates that a model ID is strictly allowlisted for the specified provider.
 */
export function validateModelAllowlist(provider: AIProviderName, modelId: string): boolean {
  const allowed = ALLOWED_MODELS[provider];
  if (!allowed || allowed.length === 0) return false;
  return allowed.some((m) => m.id === modelId);
}

/**
 * Validates and parses a full or partial AI Configuration payload.
 */
export function validateAIConfigPayload(data: unknown) {
  return aiConfigSchema.safeParse(data);
}

/**
 * Validates and parses a Chat Request payload.
 */
export function validateChatPayload(data: unknown) {
  return chatRequestSchema.safeParse(data);
}

/**
 * Validates and parses a Playground Request payload.
 */
export function validatePlaygroundPayload(data: unknown) {
  return playgroundRequestSchema.safeParse(data);
}

/**
 * Validates and parses a Provider Credential payload.
 */
export function validateProviderCredentialPayload(data: unknown) {
  return providerCredentialSchema.safeParse(data);
}
