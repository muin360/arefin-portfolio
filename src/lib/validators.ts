/**
 * Enterprise Validation & Input Sanitization Suite
 * Provides runtime validation, XSS escaping, slug normalization, phone sanitization, and timing-safe comparison.
 * 100% pure & Edge-runtime compatible.
 */

/** Timing-safe comparison to eliminate timing attacks across Node and Edge runtimes */
export function timingSafePasscodeCheck(provided?: string, expected?: string): boolean {
  if (!provided || !expected) return false;
  if (typeof provided !== "string" || typeof expected !== "string") return false;

  const a = provided;
  const b = expected;
  let mismatch = a.length === b.length ? 0 : 1;

  for (let i = 0; i < a.length; i++) {
    const charA = a.charCodeAt(i);
    const charB = b.charCodeAt(i % b.length);
    mismatch |= charA ^ charB;
  }

  return mismatch === 0 && a.length === b.length;
}

/** Sanitize general string by trimming and removing dangerous control characters */
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, maxLength);
}

/** Sanitize HTML entities to prevent stored XSS attacks in plain text contexts */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Validate and normalize URL slug */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** Validate email format according to RFC 5322 basic pattern */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/** Format phone number to clean E.164 digits without symbols */
export function sanitizeE164Phone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/** Validate safe HTTP/HTTPS URL */
export function isValidHttpUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate integer within range */
export function clampInteger(val: unknown, min: number, max: number, defaultVal: number): number {
  const num = typeof val === "number" ? val : parseInt(String(val), 10);
  if (isNaN(num)) return defaultVal;
  return Math.max(min, Math.min(max, num));
}
