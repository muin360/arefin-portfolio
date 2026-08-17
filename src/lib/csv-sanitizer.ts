/**
 * Sanitize CSV cell values to prevent CSV formula injection (DDE attacks).
 * Prepends a single quote if the field begins with =, +, -, @, tab, or carriage return.
 */
export function sanitizeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  let safeStr = str;
  if (/^[=+\-@\t\r]/.test(safeStr)) {
    safeStr = "'" + safeStr;
  }
  return `"${safeStr.replace(/"/g, '""')}"`;
}
