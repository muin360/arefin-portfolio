import crypto from "crypto";

/**
 * Derives a 32-byte Buffer key from environment configuration.
 * Prioritizes AI_SECRETS_ENCRYPTION_KEY, then AUTH_SECRET, then NEXTAUTH_SECRET.
 */
function getMasterEncryptionKey(): Buffer {
  const masterSecret =
    process.env.AI_SECRETS_ENCRYPTION_KEY ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (!masterSecret) {
    if (process.env.NODE_ENV === "test" || process.env.VITEST) {
      return crypto.createHash("sha256").update("vitest-test-master-key-32bytes-ok").digest();
    }
    throw new Error("AI provider secrets require secure configuration.");
  }

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
 * Decrypts an encrypted payload using AES-256-GCM.
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

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.encryptedSecret, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Computes a SHA-256 hash string for prompt / configuration versioning.
 */
export function computeConfigHash(data: unknown): string {
  const serialized = typeof data === "string" ? data : JSON.stringify(data);
  return crypto.createHash("sha256").update(serialized).digest("hex").slice(0, 16);
}
