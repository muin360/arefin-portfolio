import type {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  ProviderHealthCheckResult,
} from "./types";

export class AnthropicProviderAdapter implements AIProviderAdapter {
  name = "anthropic" as const;

  async generate(req: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const apiKey = req.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    const endpoint = req.baseUrl
      ? `${req.baseUrl.replace(/\/+$/, "")}/messages`
      : "https://api.anthropic.com/v1/messages";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };

    const messages = req.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), req.timeoutMs || 15000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: req.modelId || "claude-3-5-haiku-20241022",
          max_tokens: req.maxTokens ?? 500,
          temperature: req.temperature ?? 0.2,
          system: req.systemPrompt,
          messages,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        if (res.status === 401) {
          throw new Error("Invalid Anthropic API key (401 Unauthorized)");
        }
        if (res.status === 429) {
          throw new Error("Anthropic rate limit reached (429)");
        }
        throw new Error(`Anthropic API error (${res.status}): ${errorText.slice(0, 150)}`);
      }

      const data = await res.json();
      const content = data.content?.[0]?.text;
      if (!content || typeof content !== "string") {
        throw new Error("Empty response returned from Anthropic");
      }

      const latencyMs = Date.now() - startTime;
      return {
        reply: content.trim(),
        citations: req.citations || [],
        providerUsed: "anthropic",
        modelUsed: req.modelId,
        tokens: {
          promptTokens: data.usage?.input_tokens,
          completionTokens: data.usage?.output_tokens,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
        latencyMs,
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : "Unknown Anthropic error";
      throw new Error(`Anthropic execution failed: ${msg}`);
    }
  }

  async healthCheck(credentials?: {
    apiKey?: string;
    baseUrl?: string;
  }): Promise<ProviderHealthCheckResult> {
    const startTime = Date.now();
    const apiKey = credentials?.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        status: "not_configured",
        message: "No API key configured for Anthropic",
      };
    }

    const endpoint = credentials?.baseUrl
      ? `${credentials.baseUrl.replace(/\/+$/, "")}/messages`
      : "https://api.anthropic.com/v1/messages";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 1,
          messages: [{ role: "user", content: "ping" }],
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

      if (res.status === 401) {
        return {
          ok: false,
          status: "invalid",
          message: "Invalid API key (401 Unauthorized)",
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
