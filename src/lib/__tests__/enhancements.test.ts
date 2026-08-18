import { describe, it, expect } from "vitest";
import {
  safeJsonLd,
  generatePersonJsonLd,
  generateWebSiteJsonLd,
  generateProjectJsonLd,
  generateArticleJsonLd,
} from "../json-ld";

describe("Enhanced JSON-LD Schemas", () => {
  it("generates valid Person JSON-LD", () => {
    const jsonLd = generatePersonJsonLd("https://tensorstudio.vercel.app");
    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.name).toBe("Arefin Mueen");
    expect(jsonLd.jobTitle).toContain("AI Automation");
    expect(jsonLd.url).toBe("https://tensorstudio.vercel.app");
    expect(jsonLd.knowsAbout).toContain("LangChain");
  });

  it("generates valid WebSite JSON-LD", () => {
    const jsonLd = generateWebSiteJsonLd("https://tensorstudio.vercel.app");
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.name).toBe("Arefin Mueen Portfolio");
    expect(jsonLd.url).toBe("https://tensorstudio.vercel.app");
  });

  it("generates valid Project SoftwareApplication JSON-LD", () => {
    const jsonLd = generateProjectJsonLd(
      {
        title: "Customer Support Q&A Bot",
        summary: "Autonomous tool-calling agent with RAG.",
        slug: "customer-support-qa-bot",
        coverImage: "/projects/support-bot.png",
      },
      "https://tensorstudio.vercel.app",
    );
    expect(jsonLd["@type"]).toBe("SoftwareApplication");
    expect(jsonLd.name).toBe("Customer Support Q&A Bot");
    expect(jsonLd.url).toBe("https://tensorstudio.vercel.app/projects/customer-support-qa-bot");
  });

  it("generates valid BlogPosting JSON-LD", () => {
    const jsonLd = generateArticleJsonLd(
      {
        title: "From Automation to LLM Engineering",
        summary: "How modern workflows evolve.",
        slug: "from-automation-to-llm-engineering",
        publishedAt: "2026-08-01T00:00:00.000Z",
      },
      "https://tensorstudio.vercel.app",
    );
    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.headline).toBe("From Automation to LLM Engineering");
    expect(jsonLd.url).toBe("https://tensorstudio.vercel.app/blog/from-automation-to-llm-engineering");
  });

  it("escapes malicious injection inside JSON-LD payload", () => {
    const malicious = {
      title: "Attack </script><script>alert('xss')</script>",
      summary: "Test & < > \u2028 \u2029",
    };
    const serialized = safeJsonLd(malicious);
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(serialized).toContain("\\u0026");
  });
});
