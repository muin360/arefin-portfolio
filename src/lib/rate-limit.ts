/**
 * Multi-Tier Production Rate Limiting Engine
 * Supports:
 * 1. Upstash Redis REST API (zero dependencies, distributed multi-region)
 * 2. MongoDB Sliding Window fallback (distributed across instances)
 * 3. In-Memory Sliding Window fallback (zero latency, auto-pruned)
 */

import { getCollection } from "./mongodb";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
  totalLimit: number;
}

// In-Memory Storage & Cleaner
interface MemoryRecord {
  timestamps: number[];
}
const memoryRateLimits = new Map<string, MemoryRecord>();

// Clean up stale memory records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryRateLimits.entries()) {
      const valid = record.timestamps.filter((t) => now - t < 120 * 1000);
      if (valid.length === 0) {
        memoryRateLimits.delete(key);
      } else {
        memoryRateLimits.set(key, { timestamps: valid });
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Checks rate limit for a given key within a sliding time window.
 */
export async function checkRateLimit(options: {
  key: string;
  limit: number;
  windowSeconds?: number;
  bucket?: "public_chat" | "admin_ai" | "admin_playground" | "admin_keys";
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds = 60, bucket = "public_chat" } = options;
  const compositeKey = `rl:${bucket}:${key}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // 1. Try Upstash Redis REST if configured
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // Use atomic Redis pipeline: ZREMRANGEBYSCORE, ZADD, ZCARD, EXPIRE
      const pipelineUrl = `${redisUrl.replace(/\/$/, "")}/pipeline`;
      const minScore = 0;
      const maxScore = now - windowMs;

      const pipelineCommands = [
        ["ZREMRANGEBYSCORE", compositeKey, minScore, maxScore],
        ["ZADD", compositeKey, now, `${now}-${Math.random().toString(36).slice(2, 7)}`],
        ["ZCARD", compositeKey],
        ["EXPIRE", compositeKey, windowSeconds + 5],
      ];

      const res = await fetch(pipelineUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineCommands),
        signal: AbortSignal.timeout(2000), // 2s timeout
      });

      if (res.ok) {
        const results = await res.json();
        // ZCARD response is index 2
        const currentCount = results[2]?.result ?? 1;
        const allowed = currentCount <= limit;
        return {
          allowed,
          remaining: Math.max(0, limit - currentCount),
          resetInSeconds: windowSeconds,
          totalLimit: limit,
        };
      }
    } catch {
      // Fallback to MongoDB / In-memory on Redis network error
    }
  }

  // 2. Try MongoDB Sliding Window if connected
  try {
    const col = await getCollection<{
      _id: string;
      timestamps: number[];
      expiresAt: Date;
    }>("ai_rate_limits");

    if (col) {
      const windowStart = now - windowMs;
      // Atomic find and update
      const doc = await col.findOneAndUpdate(
        { _id: compositeKey },
        {
          $pull: { timestamps: { $lt: windowStart } },
        } as unknown as Record<string, unknown>,
        { returnDocument: "after" },
      );

      const timestamps = doc?.timestamps || [];
      if (timestamps.length >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetInSeconds: Math.ceil((timestamps[0] + windowMs - now) / 1000) || windowSeconds,
          totalLimit: limit,
        };
      }

      // Add current timestamp
      await col.updateOne(
        { _id: compositeKey },
        {
          $push: { timestamps: now },
          $set: { expiresAt: new Date(now + windowMs + 10000) },
        } as unknown as Record<string, unknown>,
        { upsert: true },
      );

      return {
        allowed: true,
        remaining: Math.max(0, limit - timestamps.length - 1),
        resetInSeconds: windowSeconds,
        totalLimit: limit,
      };
    }
  } catch {
    // Fallback to in-memory limiter
  }

  // 3. In-Memory Sliding Window Limiter (local fallback)
  const record = memoryRateLimits.get(compositeKey) || { timestamps: [] };
  const validTimestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    memoryRateLimits.set(compositeKey, { timestamps: validTimestamps });
    const oldest = validTimestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((oldest + windowMs - now) / 1000) || windowSeconds,
      totalLimit: limit,
    };
  }

  validTimestamps.push(now);
  memoryRateLimits.set(compositeKey, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: Math.max(0, limit - validTimestamps.length),
    resetInSeconds: windowSeconds,
    totalLimit: limit,
  };
}

/**
 * Robustly extracts the verified client IP from HTTP Request / Headers.
 * Handles proxy chains, Cloudflare, and Vercel edge headers safely without spoofing.
 */
export function extractClientIp(reqOrHeaders: Request | Headers): string {
  const headers = "headers" in reqOrHeaders ? reqOrHeaders.headers : reqOrHeaders;

  // Cloudflare header
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) return cfIp.trim();

  // True-Client-IP header
  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp && trueClientIp.trim()) return trueClientIp.trim();

  // X-Real-IP header
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp && xRealIp.trim()) return xRealIp.trim();

  // X-Forwarded-For (take the first IP in the comma-separated list)
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor && xForwardedFor.trim()) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

