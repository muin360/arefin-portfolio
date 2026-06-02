import { describe, it, expect } from "vitest";
import {
  FALLBACK_SITE_CONFIG,
  FALLBACK_ENGAGEMENTS,
  FALLBACK_SERVICES,
} from "../fallbacks";

describe("FALLBACK_SITE_CONFIG", () => {
  it("has required string fields", () => {
    expect(typeof FALLBACK_SITE_CONFIG.name).toBe("string");
    expect(typeof FALLBACK_SITE_CONFIG.role).toBe("string");
    expect(typeof FALLBACK_SITE_CONFIG.tagline).toBe("string");
    expect(typeof FALLBACK_SITE_CONFIG.siteDescription).toBe("string");
  });

  it("has valid contact info", () => {
    expect(FALLBACK_SITE_CONFIG.email).toContain("@");
    expect(FALLBACK_SITE_CONFIG.phone).toBeTruthy();
    expect(FALLBACK_SITE_CONFIG.phoneE164).toMatch(/^\d+$/);
  });

  it("has social links", () => {
    const { social } = FALLBACK_SITE_CONFIG;
    expect(social.facebook).toMatch(/^https:\/\//);
    expect(social.whatsapp).toMatch(/^https:\/\//);
    expect(social.email).toMatch(/^mailto:/);
  });

  it("has boolean flags", () => {
    expect(typeof FALLBACK_SITE_CONFIG.showLiveTicker).toBe("boolean");
    expect(typeof FALLBACK_SITE_CONFIG.showHeroTiles).toBe("boolean");
    expect(typeof FALLBACK_SITE_CONFIG.showLive30Days).toBe("boolean");
  });
});

describe("FALLBACK_ENGAGEMENTS", () => {
  it("has at least 2 engagements", () => {
    expect(FALLBACK_ENGAGEMENTS.length).toBeGreaterThanOrEqual(2);
  });

  it("each engagement has required fields", () => {
    for (const eng of FALLBACK_ENGAGEMENTS) {
      expect(eng._id).toBeTruthy();
      expect(eng.name).toBeTruthy();
      expect(eng.tag).toBeTruthy();
      expect(eng.summary).toBeTruthy();
      expect(eng.price).toBeTruthy();
      expect(Array.isArray(eng.deliverables)).toBe(true);
      expect(eng.deliverables.length).toBeGreaterThan(0);
      expect(typeof eng.order).toBe("number");
    }
  });

  it("engagements are in ascending order", () => {
    for (let i = 1; i < FALLBACK_ENGAGEMENTS.length; i++) {
      expect(FALLBACK_ENGAGEMENTS[i].order).toBeGreaterThan(
        FALLBACK_ENGAGEMENTS[i - 1].order,
      );
    }
  });

  it("has exactly one featured engagement", () => {
    const featured = FALLBACK_ENGAGEMENTS.filter((e) => e.featured);
    expect(featured.length).toBe(1);
  });
});

describe("FALLBACK_SERVICES", () => {
  it("has at least 3 services", () => {
    expect(FALLBACK_SERVICES.length).toBeGreaterThanOrEqual(3);
  });

  it("each service has required fields", () => {
    for (const svc of FALLBACK_SERVICES) {
      expect(svc._id).toBeTruthy();
      expect(svc.title).toBeTruthy();
      expect(svc.iconName).toBeTruthy();
      expect(svc.hook).toBeTruthy();
      expect(svc.problem).toBeTruthy();
      expect(svc.solution).toBeTruthy();
      expect(svc.outcome).toBeTruthy();
    }
  });

  it("all service IDs are unique", () => {
    const ids = FALLBACK_SERVICES.map((s) => s._id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
