import crypto from "crypto";

/**
 * Validates and retrieves the master encryption key Buffer.
 * In production (NODE_ENV === "production"), AI_SECRETS_ENCRYPTION_KEY is STRICTLY mandatory
 * and must not fall back to auth secrets.
 */
export function getMasterEncryptionKey(): Buffer {
  const isProd = process.env.NODE_ENV === "production";
  const rawKey = process.env.AI_SECRETS_ENCRYPTION_KEY;

  if (isProd) {
    if (!rawKey || typeof rawKey !== "string" || rawKey.trim().length === 0) {
      throw new Error(
        "[AI Secrets Security] CRITICAL: AI_SECRETS_ENCRYPTION_KEY is mandatory in production environment. " +
          "Fallback to auth credentials or default seeds is strictly prohibited across trust boundaries.",
      );
    }

    const trimmed = rawKey.trim();
    if (trimmed.length < 16) {
      throw new Error(
        "[AI Secrets Security] CRITICAL: AI_SECRETS_ENCRYPTION_KEY must be at least 16 characters for cryptographic derivation.",
      );
    }

    return crypto.createHash("sha256").update(trimmed).digest();
  }

  // Development & Test environments: Controlled local fallback with isolation
  const devKey =
    rawKey?.trim() ||
    (process.env.NODE_ENV === "test" || process.env.VITEST
      ? "vitest-test-master-key-32bytes-ok"
      : "arefin-portfolio-dev-secret-encryption-seed-only");

  return crypto.createHash("sha256").update(devKey).digest();
}

/**
 * Validates the health and decodability of the current master encryption key.
 */
export function validateMasterEncryptionKey(): { valid: boolean; error?: string } {
  try {
    const key = getMasterEncryptionKey();
    if (!key || key.length !== 32) {
      return { valid: false, error: "Derived key length must be exactly 32 bytes (256 bits)." };
    }
    // Test cipher initialization
    const testIv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, testIv);
    cipher.update("healthcheck", "utf8");
    cipher.final();
    cipher.getAuthTag();
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Unknown master key validation error",
    };
  }
}

export interface EncryptedPayload {
  encryptedSecret: string; // base64
  iv: string; // base64
  authTag: string; // base64
  keyFingerprint: string;
}

/**
 * Computes a masked fingerprint for display without revealing the secret (e.g. ••••••••abcd).
 */
export function getKeyFingerprint(secret: string): string {
  if (!secret) return "••••••••";
  const trimmed = secret.trim();
  if (trimmed.length <= 4) return "••••••••";
  const last4 = trimmed.slice(-4);
  return `••••••••${last4}`;
}

/**
 * Encrypts a plaintext secret using AES-256-GCM.
 */
export async function encryptSecret(plainText: string): Promise<EncryptedPayload> {
  if (!plainText || plainText.trim().length === 0) {
    throw new Error("Cannot encrypt empty secret");
  }

  const key = getMasterEncryptionKey();
  const iv = crypto.randomBytes(12); // standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plainText.trim(), "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    encryptedSecret: encrypted,
    iv: iv.toString("base64"),
    authTag,
    keyFingerprint: getKeyFingerprint(plainText),
  };
}

/**
 * Decrypts an encrypted payload using AES-256-GCM with the active master key.
 */
export async function decryptSecret(payload: {
  encryptedSecret: string;
  iv: string;
  authTag: string;
}): Promise<string> {
  if (!payload.encryptedSecret || !payload.iv || !payload.authTag) {
    throw new Error("Invalid encrypted payload structure");
  }

  const key = getMasterEncryptionKey();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(payload.encryptedSecret, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    throw new Error("Failed to decrypt provider secret. Authentication tag verification failed.");
  }
}

/**
 * Computes a SHA-256 hash string for prompt / configuration versioning.
 */
export function computeConfigHash(data: unknown): string {
  const serialized = typeof data === "string" ? data : JSON.stringify(data);
  return crypto.createHash("sha256").update(serialized).digest("hex").slice(0, 16);
}
