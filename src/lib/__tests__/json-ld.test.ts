import { describe, it, expect } from "vitest";
import { safeJsonLd } from "../json-ld";

describe("safeJsonLd", () => {
  it("serializes a simple object", () => {
    const result = safeJsonLd({ name: "Test" });
    expect(result).toBe('{"name":"Test"}');
  });

  it("escapes < to prevent script breakout", () => {
    const result = safeJsonLd({ text: "</script>" });
    expect(result).toContain("\\u003c");
    expect(result).toContain("\\u003e");
    expect(result).not.toContain("</script>");
  });

  it("escapes > characters", () => {
    const result = safeJsonLd({ text: "a > b" });
    expect(result).toContain("\\u003e");
    expect(result).not.toContain("a > b");
  });

  it("escapes & characters", () => {
    const result = safeJsonLd({ text: "a & b" });
    expect(result).toContain("\\u0026");
    expect(result).not.toContain("a & b");
  });

  it("escapes U+2028 line separator", () => {
    const result = safeJsonLd({ text: "a\u2028b" });
    expect(result).toContain("\\u2028");
  });

  it("escapes U+2029 paragraph separator", () => {
    const result = safeJsonLd({ text: "a\u2029b" });
    expect(result).toContain("\\u2029");
  });

  it("handles nested objects", () => {
    const result = safeJsonLd({
      "@type": "Person",
      name: "Test <User>",
      address: { city: "Dhaka & Chittagong" },
    });
    const parsed = JSON.parse(
      result
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">")
        .replace(/\\u0026/g, "&"),
    );
    expect(parsed["@type"]).toBe("Person");
    expect(parsed.name).toBe("Test <User>");
    expect(parsed.address.city).toBe("Dhaka & Chittagong");
  });

  it("handles arrays", () => {
    const result = safeJsonLd(["<script>", "&amp;"]);
    expect(result).not.toContain("<script>");
    expect(result).toContain("\\u003c");
    expect(result).toContain("\\u0026");
  });

  it("handles null and primitive types", () => {
    expect(safeJsonLd(null)).toBe("null");
    expect(safeJsonLd(42)).toBe("42");
    expect(safeJsonLd(true)).toBe("true");
  });
});
