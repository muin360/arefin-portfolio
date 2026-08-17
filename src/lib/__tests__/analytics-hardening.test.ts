import { describe, it, expect } from "vitest";
import { sanitizeCsvField } from "@/lib/csv-sanitizer";

describe("Analytics CSV Formula Sanitization", () => {
  it("escapes formula injection prefixes with single quote", () => {
    expect(sanitizeCsvField("=SUM(A1:A10)")).toBe(`"'=SUM(A1:A10)"`);
    expect(sanitizeCsvField("+12345")).toBe(`"'+12345"`);
    expect(sanitizeCsvField("-500")).toBe(`"'-500"`);
    expect(sanitizeCsvField("@cmd")).toBe(`"'@cmd"`);
    expect(sanitizeCsvField("\tTabInjected")).toBe(`"'\tTabInjected"`);
  });

  it("handles standard text, quotes, numbers, and null safely", () => {
    expect(sanitizeCsvField("Normal User Text")).toBe(`"Normal User Text"`);
    expect(sanitizeCsvField('Hello "World"')).toBe(`"Hello ""World"""`);
    expect(sanitizeCsvField(42)).toBe(`"42"`);
    expect(sanitizeCsvField(null)).toBe(`""`);
    expect(sanitizeCsvField(undefined)).toBe(`""`);
  });
});
