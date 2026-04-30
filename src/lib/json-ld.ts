/**
 * Safely serialize a JSON-LD payload for inline injection into a
 * <script type="application/ld+json"> tag.
 *
 * Escapes characters that could prematurely close the surrounding
 * <script> element or break out of the JSON context — namely `<`, `>`,
 * `&`, and the U+2028 / U+2029 line terminators. This makes it safe to
 * include even user-supplied (CMS) content in structured data without
 * a separate sanitizer.
 *
 * Reference: https://github.com/google/code-prettify/issues/87#issue-1004593
 */
export function safeJsonLd(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
