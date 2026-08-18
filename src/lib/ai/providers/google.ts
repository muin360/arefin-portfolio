import type {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  ProviderHealthCheckResult,
} from "./types";

export class GoogleGeminiProviderAdapter implements AIProviderAdapter {
  name = "google" as const;

  async generate(req: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const apiKey =
      req.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Google Gemini API key not configured");
    }

    const model = req.modelId || "gemini-1.5-flash";
    const endpoint = req.baseUrl
      ? `${req.baseUrl.replace(/\/+$/, "")}/${model}:generateContent?key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = req.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), req.timeoutMs || 15000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: req.systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: req.temperature ?? 0.2,
            maxOutputTokens: req.maxTokens ?? 500,
            topP: req.topP ?? 0.95,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        if (res.status === 400 && errorText.includes("API_KEY_INVALID")) {
          throw new Error("Invalid Google Gemini API key (400)");
        }
        if (res.status === 429) {
          throw new Error("Google Gemini quota exceeded (429)");
        }
        throw new Error(`Google Gemini API error (${res.status}): ${errorText.slice(0, 150)}`);
      }

      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content || typeof content !== "string") {
        throw new Error("Empty response returned from Google Gemini");
      }

      const latencyMs = Date.now() - startTime;
      return {
        reply: content.trim(),
        citations: req.citations || [],
        providerUsed: "google",
        modelUsed: req.modelId,
        tokens: {
          promptTokens: data.usageMetadata?.promptTokenCount,
          completionTokens: data.usageMetadata?.candidatesTokenCount,
          totalTokens: data.usageMetadata?.totalTokenCount,
        },
        latencyMs,
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : "Unknown Google Gemini error";
      throw new Error(`Google Gemini execution failed: ${msg}`);
    }
  }

  async healthCheck(credentials?: {
    apiKey?: string;
    baseUrl?: string;
  }): Promise<ProviderHealthCheckResult> {
    const startTime = Date.now();
    const apiKey =
      credentials?.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        status: "not_configured",
        message: "No API key configured for Google Gemini",
      };
    }

    const endpoint = credentials?.baseUrl
      ? `${credentials.baseUrl.replace(/\/+$/, "")}/gemini-1.5-flash:generateContent?key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 1 },
        }),
        signal: AbortSignal.timeout(6000),
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        return {
          ok: true,
          status: "connected",
          message: `Connected successfully (${latencyMs}ms)`,
          latencyMs,
        };
      }

      if (res.status === 400) {
        return {
          ok: false,
          status: "invalid",
          message: "Invalid API key or model",
          latencyMs,
        };
      }

      return {
        ok: false,
        status: "unavailable",
        message: `Provider returned HTTP ${res.status}`,
        latencyMs,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection timeout";
      return {
        ok: false,
        status: "unavailable",
        message: `Connection failed: ${msg}`,
        latencyMs: Date.now() - startTime,
      };
    }
  }
}
