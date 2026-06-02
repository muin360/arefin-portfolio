import { describe, it, expect } from "vitest";
import {
  PHONE_E164,
  PHONE_DISPLAY,
  whatsappHref,
  WA_MESSAGES,
  CTA_VARIANTS,
  CTA,
  HERO_VARIANTS,
  ACTIVE_HERO,
} from "../cta";

describe("whatsappHref", () => {
  it("builds a wa.me URL with default phone", () => {
    const url = whatsappHref("Hi there");
    expect(url).toBe(
      `https://wa.me/${PHONE_E164}?text=${encodeURIComponent("Hi there")}`,
    );
  });

  it("accepts a custom phone number", () => {
    const url = whatsappHref("Hello", "1234567890");
    expect(url).toBe(
      `https://wa.me/1234567890?text=${encodeURIComponent("Hello")}`,
    );
  });

  it("encodes special characters in the message", () => {
    const url = whatsappHref("Hello & welcome! Price: $50");
    expect(url).toContain(encodeURIComponent("Hello & welcome! Price: $50"));
  });
});

describe("PHONE constants", () => {
  it("PHONE_E164 is digits only", () => {
    expect(PHONE_E164).toMatch(/^\d+$/);
  });

  it("PHONE_DISPLAY contains the same digits", () => {
    const digitsOnly = PHONE_DISPLAY.replace(/\D/g, "");
    expect(digitsOnly).toBe(PHONE_E164);
  });
});

describe("WA_MESSAGES", () => {
  it("has string messages for all static keys", () => {
    for (const [key, val] of Object.entries(WA_MESSAGES)) {
      if (key === "engagement") {
        expect(typeof val).toBe("function");
      } else {
        expect(typeof val).toBe("string");
        expect((val as string).length).toBeGreaterThan(0);
      }
    }
  });

  it("engagement message builder includes the name", () => {
    const msg = WA_MESSAGES.engagement("Systems audit");
    expect(msg).toContain("Systems audit");
  });
});

describe("CTA_VARIANTS and CTA", () => {
  it("has at least 3 variants", () => {
    expect(Object.keys(CTA_VARIANTS).length).toBeGreaterThanOrEqual(3);
  });

  it("CTA.primary is one of the variants", () => {
    expect(Object.values(CTA_VARIANTS)).toContain(CTA.primary);
  });

  it("CTA.secondary is one of the variants", () => {
    expect(Object.values(CTA_VARIANTS)).toContain(CTA.secondary);
  });
});

describe("HERO_VARIANTS", () => {
  it("has A, B, C variants", () => {
    expect(HERO_VARIANTS).toHaveProperty("A");
    expect(HERO_VARIANTS).toHaveProperty("B");
    expect(HERO_VARIANTS).toHaveProperty("C");
  });

  it.each(["A", "B", "C"] as const)("variant %s has required fields", (key) => {
    const v = HERO_VARIANTS[key];
    expect(v.eyebrow).toBeTruthy();
    expect(v.headline.line1).toBeTruthy();
    expect(v.headline.line2).toBeTruthy();
    expect(v.headline.line3).toBeTruthy();
    expect(v.headline.line4).toBeTruthy();
    expect(v.sub.length).toBeGreaterThan(0);
    expect(v.trust.length).toBeGreaterThan(0);
  });

  it("ACTIVE_HERO is a valid key", () => {
    expect(["A", "B", "C"]).toContain(ACTIVE_HERO);
  });
});
