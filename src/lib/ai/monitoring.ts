import * as Sentry from "@sentry/nextjs";

/**
 * Sanitizes strings to remove API keys, secrets, bearer tokens, or database connection URIs.
 */
export function sanitizeSensitiveText(text: string): string {
  if (!text || typeof text !== "string") return "";

  return text
    // Replace API keys (sk-..., AIzaSy..., ant-...)
    .replace(/(?:sk-[a-zA-Z0-9_\-]{20,})/gi, "[REDACTED_API_KEY]")
    .replace(/(?:AIzaSy[a-zA-Z0-9_\-]{30,})/gi, "[REDACTED_GOOGLE_KEY]")
    .replace(/(?:sk-ant-[a-zA-Z0-9_\-]{20,})/gi, "[REDACTED_ANTHROPIC_KEY]")
    // Replace Bearer tokens
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, "Bearer [REDACTED_TOKEN]")
    // Replace MongoDB URIs
    .replace(/mongodb(\+srv)?:\/\/[^\s]+/gi, "mongodb://[REDACTED_DB_URI]")
    // Replace Authorization headers
    .replace(/authorization:\s*[^\r\n]+/gi, "authorization: [REDACTED]")
    // Replace passwords
    .replace(/password[:=]\s*[^\s,]+/gi, "password=[REDACTED]");
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
