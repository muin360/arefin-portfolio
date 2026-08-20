/**
 * Multi-Tier Production Rate Limiting Engine
 * Supports:
 * 1. Upstash Redis REST API (zero dependencies, distributed multi-region)
 * 2. MongoDB Genuinely Atomic Window Counters (distributed across serverless instances)
 * 3. In-Memory Window Counter fallback (with strict degraded mode for public endpoints)
 */

import { getCollection } from "./mongodb";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
  totalLimit: number;
}

// In-Memory Storage & Bounded Window Counters
interface MemoryWindowRecord {
  windowStart: number;
  count: number;
}
const memoryRateLimits = new Map<string, MemoryWindowRecord>();

// Clean up stale memory records every 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryRateLimits.entries()) {
      if (now - record.windowStart > 120 * 1000) {
        memoryRateLimits.delete(key);
      }
    }
  }, 2 * 60 * 1000).unref?.();
}

/**
 * MongoDB Rate Limit Document Schema (Atomic Fixed-Window Counter)
 */
interface MongoRateLimitDoc {
  _id: string; // `rl:${bucket}:${key}:${windowIndex}`
  count: number;
  windowStart: number;
  expiresAt: Date;
}

let hasEnsuredTtlIndex = false;
async function ensureRateLimitIndexes() {
  if (hasEnsuredTtlIndex) return;
  try {
    const col = await getCollection<MongoRateLimitDoc>("ai_rate_limits");
    if (col) {
      // TTL index on expiresAt (deletes documents after expiresAt timestamp)
      await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      hasEnsuredTtlIndex = true;
    }
  } catch {
    // Ignore index creation errors on connection fail
  }
}

/**
 * Checks rate limit for a given key within a time window.
 * Priority: 1. Upstash Redis -> 2. MongoDB Atomic Window -> 3. In-Memory Fallback
 */
export async function checkRateLimit(options: {
  key: string;
  limit: number;
  windowSeconds?: number;
  bucket?: "public_chat" | "admin_ai" | "admin_playground" | "admin_keys";
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds = 60, bucket = "public_chat" } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowIndex = Math.floor(now / windowMs);
  const windowStart = windowIndex * windowMs;
  const windowElapsed = (now - windowStart) / 1000;
  const resetInSeconds = Math.max(1, Math.ceil(windowSeconds - windowElapsed));

  const compositeKey = `rl:${bucket}:${key}:${windowIndex}`;

  // ── 1. TRY UPSTASH REDIS REST API (DISTRIBUTED) ──────────────────────────
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const pipelineUrl = `${redisUrl.replace(/\/$/, "")}/pipeline`;
      const pipelineCommands = [
        ["INCR", compositeKey],
        ["EXPIRE", compositeKey, windowSeconds + 10],
      ];

      const res = await fetch(pipelineUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineCommands),
        signal: AbortSignal.timeout(1500),
      });

      if (res.ok) {
        const results = await res.json();
        const currentCount = Number(results[0]?.result ?? 1);
        const allowed = currentCount <= limit;
        return {
          allowed,
          remaining: Math.max(0, limit - currentCount),
          resetInSeconds,
          totalLimit: limit,
        };
      }
    } catch {
      // Fallback to Tier 2 on Redis timeout/error
    }
  }

  // ── 2. TRY MONGODB ATOMIC WINDOW COUNTER (DISTRIBUTED TIER 2) ────────────
  try {
    const col = await getCollection<MongoRateLimitDoc>("ai_rate_limits");
    if (col) {
      await ensureRateLimitIndexes();

      const expiresAt = new Date(windowStart + windowMs * 2);

      // Single atomic findOneAndUpdate with $inc and $setOnInsert
      const doc = await col.findOneAndUpdate(
        { _id: compositeKey },
        {
          $inc: { count: 1 },
          $setOnInsert: {
            windowStart,
            expiresAt,
          },
        } as unknown as Record<string, unknown>,
        {
          upsert: true,
          returnDocument: "after",
        },
      );

      const currentCount = doc?.count ?? 1;
      const allowed = currentCount <= limit;

      return {
        allowed,
        remaining: Math.max(0, limit - currentCount),
        resetInSeconds,
        totalLimit: limit,
      };
    }
  } catch {
    // Fallback to Tier 3 on MongoDB unavailability
  }

  // ── 3. IN-MEMORY FALLBACK & FAIL-SAFE DEGRADED POLICY ────────────────────
  // When both Redis and MongoDB are down:
  // Public AI enforces a strict degraded limit to prevent unmetered infrastructure cost.
  const effectiveLimit = bucket === "public_chat" ? Math.min(limit, 5) : limit;

  const currentRecord = memoryRateLimits.get(compositeKey);
  const currentCount = (currentRecord?.count || 0) + 1;

  memoryRateLimits.set(compositeKey, {
    windowStart,
    count: currentCount,
  });

  const allowed = currentCount <= effectiveLimit;

  return {
    allowed,
    remaining: Math.max(0, effectiveLimit - currentCount),
    resetInSeconds,
    totalLimit: effectiveLimit,
  };
}

/**
 * Validates whether a string is a well-formed IPv4 or IPv6 address.
 */
function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 64) return false;
  // IPv4 regex
  const ipv4Regex =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
  if (ipv4Regex.test(ip)) return true;

  // IPv6 regex
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$/;
  if (ipv6Regex.test(ip)) return true;

  // Simplified IPv6 structure check
  if (ip.includes(":") && !ip.includes(" ") && ip.length <= 45) {
    return true;
  }

  return false;
}

/**
 * Robustly extracts the verified client IP from HTTP Request / Headers.
 * Enforces strict Vercel deployment precedence and validates IP formatting.
 */
export function extractClientIp(reqOrHeaders: Request | Headers): string {
  const headers = "headers" in reqOrHeaders ? reqOrHeaders.headers : reqOrHeaders;

  // 1. Vercel trusted edge forwarded header
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp && vercelIp.trim()) {
    const first = vercelIp.split(",")[0]?.trim();
    if (first && isValidIp(first)) return first;
  }

  // 2. X-Real-IP
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp && xRealIp.trim()) {
    const clean = xRealIp.trim();
    if (isValidIp(clean)) return clean;
  }

  // 3. Cloudflare edge header (if behind CF proxy)
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) {
    const clean = cfIp.trim();
    if (isValidIp(clean)) return clean;
  }

  // 4. Standard X-Forwarded-For (take the outermost proxy client IP)
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor && xForwardedFor.trim()) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first && isValidIp(first)) return first;
  }

  return "127.0.0.1";
}
