import crypto from "crypto";

/**
 * Returns candidate secret sources in order of priority.
 */
function getCandidateSecrets(): string[] {
  const candidates = [
    process.env.AI_SECRETS_ENCRYPTION_KEY,
    process.env.AUTH_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_SECRET,
    process.env.MONGODB_URI,
    "arefin-portfolio-secure-encryption-key-seed",
    "vitest-test-master-key-32bytes-ok",
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates));
}

/**
 * Derives the primary 32-byte Buffer key from environment configuration.
 */
function getMasterEncryptionKey(): Buffer {
  const masterSecret =
    process.env.AI_SECRETS_ENCRYPTION_KEY ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET ||
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV === "test" || process.env.VITEST
      ? "vitest-test-master-key-32bytes-ok"
      : "arefin-portfolio-secure-encryption-key-seed");

  // Compute sha256 to ensure exact 32-byte key length for aes-256-gcm
  return crypto.createHash("sha256").update(masterSecret).digest();
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
 * Decrypts an encrypted payload using AES-256-GCM with multi-candidate resilience.
 */
export async function decryptSecret(payload: {
  encryptedSecret: string;
  iv: string;
  authTag: string;
}): Promise<string> {
  if (!payload.encryptedSecret || !payload.iv || !payload.authTag) {
    throw new Error("Invalid encrypted payload structure");
  }

  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  // 1. Try with primary derived key
  try {
    const primaryKey = getMasterEncryptionKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", primaryKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(payload.encryptedSecret, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    // Fallthrough to candidate keys
  }

  // 2. Try candidate keys for backward compatibility across environment changes
  const candidates = getCandidateSecrets();
  for (const cand of candidates) {
    try {
      const candKey = crypto.createHash("sha256").update(cand).digest();
      const decipher = crypto.createDecipheriv("aes-256-gcm", candKey, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(payload.encryptedSecret, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch {
      // Continue to next candidate
    }
  }

  throw new Error("Failed to decrypt provider secret. Authentication tag verification failed.");
}

/**
 * Computes a SHA-256 hash string for prompt / configuration versioning.
 */
export function computeConfigHash(data: unknown): string {
  const serialized = typeof data === "string" ? data : JSON.stringify(data);
  return crypto.createHash("sha256").update(serialized).digest("hex").slice(0, 16);
}
