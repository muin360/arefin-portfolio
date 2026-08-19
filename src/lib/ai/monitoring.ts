import * as Sentry from "@sentry/nextjs";

/**
 * Sanitizes strings to remove API keys, secrets, bearer tokens, or database connection URIs.
 */
export function sanitizeSensitiveText(text: string): string {
  if (!text || typeof text !== "string") return "";

  return text
    // Replace API keys (sk-..., AIzaSy..., ant-..., gsk-..., hf-...)
    .replace(/(?:sk-[a-zA-Z0-9_\-]{20,})/gi, "[REDACTED_API_KEY]")
    .replace(/(?:AIzaSy[a-zA-Z0-9_\-]{30,})/gi, "[REDACTED_GOOGLE_KEY]")
    .replace(/(?:sk-ant-[a-zA-Z0-9_\-]{20,})/gi, "[REDACTED_ANTHROPIC_KEY]")
    .replace(/(?:gsk_[a-zA-Z0-9_\-]{20,})/gi, "[REDACTED_GROQ_KEY]")
    .replace(/(?:hf_[a-zA-Z0-9_\-]{20,})/gi, "[REDACTED_HF_KEY]")
    .replace(/(?:ghp_[a-zA-Z0-9]{30,}|github_pat_[a-zA-Z0-9_]{50,})/gi, "[REDACTED_GITHUB_TOKEN]")
    .replace(/(?:AKIA[0-9A-Z]{16})/g, "[REDACTED_AWS_KEY]")
    // Replace Bearer tokens and JWTs
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, "Bearer [REDACTED_TOKEN]")
    .replace(/(?:eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})/g, "[REDACTED_JWT]")
    // Replace MongoDB URIs
    .replace(/mongodb(\+srv)?:\/\/[^\s]+/gi, "mongodb://[REDACTED_DB_URI]")
    // Replace Authorization headers
    .replace(/authorization:\s*[^\r\n]+/gi, "authorization: [REDACTED]")
    // Replace passwords & secret tokens
    .replace(/(?:password|secret|key|token)[:=]\s*['"]?[^\s,'"]+['"]?/gi, "$1=[REDACTED]");
}

/**
 * Safely reports an AI error to Sentry with strict payload and secret sanitization.
 */
export function captureSanitizedAIError(
  error: unknown,
  context: {
    provider?: string;
    modelId?: string;
    errorCategory?: string;
    requestType?: string;
  } = {},
) {
  try {
    const rawMessage = error instanceof Error ? error.message : String(error);
    const sanitizedMsg = sanitizeSensitiveText(rawMessage);

    Sentry.withScope((scope) => {
      scope.setTag("component", "arefin-ai");
      if (context.provider) scope.setTag("ai.provider", context.provider);
      if (context.modelId) scope.setTag("ai.model", context.modelId);
      if (context.errorCategory) scope.setTag("ai.error_category", context.errorCategory);
      if (context.requestType) scope.setTag("ai.request_type", context.requestType);

      scope.setContext("ai_metadata", {
        category: context.errorCategory || "unknown",
        provider: context.provider || "unknown",
        sanitizedErrorMessage: sanitizedMsg,
      });

      const sanitizedError = new Error(sanitizedMsg);
      if (error instanceof Error && error.stack) {
        sanitizedError.stack = sanitizeSensitiveText(error.stack);
      }

      Sentry.captureException(sanitizedError);
    });
  } catch {
    // Sentry reporting failure must NEVER affect production user flow
  }
}
