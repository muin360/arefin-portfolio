import type {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  ProviderHealthCheckResult,
} from "./types";

export class OpenAIProviderAdapter implements AIProviderAdapter {
  name = "openai" as const;

  async generate(req: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const apiKey =
      req.apiKey ||
      process.env.OPENAI_API_KEY ||
      process.env.OPENAI_KEY ||
      process.env.OPENAI_API_TOKEN;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const endpoint = req.baseUrl
      ? `${req.baseUrl.replace(/\/+$/, "")}/chat/completions`
      : "https://api.openai.com/v1/chat/completions";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    };
    if (req.organizationId) {
      headers["OpenAI-Organization"] = req.organizationId.trim();
    }

    const isReasoningModel =
      req.modelId?.startsWith("o1") ||
      req.modelId?.startsWith("o3") ||
      req.modelId?.includes("preview");

    const messages = isReasoningModel
      ? [
          { role: "developer", content: req.systemPrompt },
          ...req.messages.map((m) => ({ role: m.role, content: m.content })),
        ]
      : [
          { role: "system", content: req.systemPrompt },
          ...req.messages.map((m) => ({ role: m.role, content: m.content })),
        ];

    const bodyPayload: Record<string, unknown> = {
      model: req.modelId || "gpt-4o-mini",
      messages,
    };

    if (isReasoningModel) {
      bodyPayload.max_completion_tokens = req.maxTokens ?? 1000;
    } else {
      bodyPayload.temperature = req.temperature ?? 0.2;
      bodyPayload.top_p = req.topP ?? 0.95;
      bodyPayload.max_tokens = req.maxTokens ?? 500;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), req.timeoutMs || 15000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        if (res.status === 401) {
          throw new Error("Invalid OpenAI API key (401 Unauthorized)");
        }
        if (res.status === 429) {
          throw new Error("OpenAI rate limit reached or quota exceeded (429)");
        }
        throw new Error(`OpenAI API error (${res.status}): ${errorText.slice(0, 150)}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new Error("Empty response returned from OpenAI");
      }

      const latencyMs = Date.now() - startTime;
      return {
        reply: content.trim(),
        citations: req.citations || [],
        providerUsed: "openai",
        modelUsed: req.modelId,
        tokens: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
        latencyMs,
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : "Unknown OpenAI error";
      throw new Error(`OpenAI execution failed: ${msg}`);
    }
  }

  async healthCheck(credentials?: {
    apiKey?: string;
    baseUrl?: string;
    organizationId?: string;
  }): Promise<ProviderHealthCheckResult> {
    const startTime = Date.now();
    const apiKey =
      credentials?.apiKey ||
      process.env.OPENAI_API_KEY ||
      process.env.OPENAI_KEY ||
      process.env.OPENAI_API_TOKEN;
    if (!apiKey) {
      return {
        ok: false,
        status: "not_configured",
        message: "No API key configured for OpenAI",
      };
    }

    const endpoint = credentials?.baseUrl
      ? `${credentials.baseUrl.replace(/\/+$/, "")}/models`
      : "https://api.openai.com/v1/models";

    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey.trim()}`,
    };
    if (credentials?.organizationId) {
      headers["OpenAI-Organization"] = credentials.organizationId.trim();
    }

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers,
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

      if (res.status === 401) {
        return {
          ok: false,
          status: "invalid",
          message: "Invalid API key (401 Unauthorized)",
          latencyMs,
        };
      }

      if (res.status === 429) {
        return {
          ok: false,
          status: "unavailable",
          message: "Rate limit reached or quota exhausted (429)",
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
