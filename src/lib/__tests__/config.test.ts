import { describe, it, expect } from "vitest";
import { SITE, whatsappLink, mailto } from "../config";

describe("SITE constant", () => {
  it("has a url with no trailing slash", () => {
    expect(SITE.url).not.toMatch(/\/$/);
  });

  it("exports expected brand fields", () => {
    expect(SITE.name).toBe("Tensorix");
    expect(SITE.author).toBe("Arefin Muin");
    expect(typeof SITE.tagline).toBe("string");
    expect(typeof SITE.description).toBe("string");
  });

  it("has valid contact info", () => {
    expect(SITE.contactEmail).toContain("@");
    expect(SITE.founderEmail).toContain("@");
    expect(SITE.whatsapp).toMatch(/^\d+$/);
  });

  it("has social links", () => {
    const { socials } = SITE;
    expect(socials.github).toMatch(/^https:\/\//);
    expect(socials.linkedin).toMatch(/^https:\/\//);
    expect(socials.twitter).toMatch(/^https:\/\//);
    expect(socials.facebook).toMatch(/^https:\/\//);
  });

  it("has area served as ISO codes", () => {
    expect(SITE.areaServed.length).toBeGreaterThan(0);
    for (const code of SITE.areaServed) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
  });
});

describe("whatsappLink", () => {
  it("builds a wa.me URL with encoded message", () => {
    const url = whatsappLink("Hello world");
    expect(url).toBe(
      `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello world")}`,
    );
  });

  it("encodes special characters", () => {
    const url = whatsappLink("Hi & bye?");
    expect(url).toContain("Hi%20%26%20bye%3F");
  });

  it("handles empty message", () => {
    const url = whatsappLink("");
    expect(url).toBe(`https://wa.me/${SITE.whatsapp}?text=`);
  });
});

describe("mailto", () => {
  it("builds a plain mailto link with no options", () => {
    expect(mailto("test@example.com")).toBe("mailto:test@example.com");
  });

  it("appends subject", () => {
    const link = mailto("a@b.com", { subject: "Hello" });
    expect(link).toBe("mailto:a@b.com?subject=Hello");
  });

  it("appends subject and body", () => {
    const link = mailto("a@b.com", { subject: "Hi", body: "Test body" });
    expect(link).toContain("subject=Hi");
    expect(link).toContain("body=Test+body");
  });

  it("encodes special characters in subject and body", () => {
    const link = mailto("a@b.com", {
      subject: "Q&A session",
      body: "Hello & goodbye",
    });
    expect(link).toContain("subject=Q%26A+session");
    expect(link).toContain("body=Hello+%26+goodbye");
  });

  it("omits params when empty", () => {
    const link = mailto("a@b.com", {});
    expect(link).toBe("mailto:a@b.com");
  });
});
