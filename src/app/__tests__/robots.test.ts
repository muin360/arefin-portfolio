import { describe, it, expect } from "vitest";
import robots from "../robots";

describe("robots()", () => {
  const result = robots();

  it("returns rules array", () => {
    expect(Array.isArray(result.rules)).toBe(true);
    expect(result.rules.length).toBeGreaterThan(1);
  });

  it("has a default allow-all rule for * user agent", () => {
    const defaultRule = Array.isArray(result.rules)
      ? result.rules.find(
          (r) => "userAgent" in r && r.userAgent === "*",
        )
      : null;
    expect(defaultRule).toBeDefined();
    expect(defaultRule).toHaveProperty("allow", "/");
  });

  it("disallows /studio and /api for default user agent", () => {
    const defaultRule = Array.isArray(result.rules)
      ? result.rules.find(
          (r) => "userAgent" in r && r.userAgent === "*",
        )
      : null;
    expect(defaultRule).toBeDefined();
    const disallow = (defaultRule as { disallow: string[] }).disallow;
    expect(disallow).toContain("/studio");
    expect(disallow).toContain("/api/");
  });

  it("blocks known AI training scrapers", () => {
    const scraperBots = ["GPTBot", "ClaudeBot", "CCBot", "PerplexityBot"];
    for (const bot of scraperBots) {
      const rule = Array.isArray(result.rules)
        ? result.rules.find(
            (r) => "userAgent" in r && r.userAgent === bot,
          )
        : null;
      expect(rule).toBeDefined();
      expect(rule).toHaveProperty("disallow", "/");
    }
  });

  it("includes a sitemap URL", () => {
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it("includes a host", () => {
    expect(result.host).toMatch(/^https:\/\//);
  });
});
