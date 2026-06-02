import { describe, it, expect } from "vitest";
import { SITE_URL, GOOGLE_SITE_VERIFICATION } from "../site-url";

describe("SITE_URL", () => {
  it("is a string", () => {
    expect(typeof SITE_URL).toBe("string");
  });

  it("starts with https://", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("has no trailing slash", () => {
    expect(SITE_URL).not.toMatch(/\/$/);
  });

  it("defaults to tensorix.me when env var not set", () => {
    expect(SITE_URL).toBe("https://tensorix.me");
  });
});

describe("GOOGLE_SITE_VERIFICATION", () => {
  it("is a non-empty string", () => {
    expect(typeof GOOGLE_SITE_VERIFICATION).toBe("string");
    expect(GOOGLE_SITE_VERIFICATION.length).toBeGreaterThan(0);
  });
});
