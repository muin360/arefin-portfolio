import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";

export const metadata: Metadata = {
  title: "Privacy & Security",
  description:
    "How this site handles (and doesn't handle) your data, and the security measures protecting it.",
  alternates: { canonical: "/privacy" },
};

const items = [
  {
    h: "No tracking, no analytics, no cookies",
    p: "This site does not load Google Analytics, Meta Pixel, or any other tracker. It sets no cookies and stores nothing in your browser.",
  },
  {
    h: "No backend, no database",
    p: "Every page is a static HTML file served from a CDN. There is no server processing your requests, no database, and no log of who visits.",
  },
  {
    h: "The contact form never leaves your device",
    p: "When you submit the form, it opens your own email client with a draft pre-filled. The message is never sent through any third-party server. If you'd rather, email arefinmueen360@gmail.com directly.",
  },
  {
    h: "Strict transport security",
    p: "All traffic is forced over HTTPS with HSTS preload. There is no plaintext fallback.",
  },
  {
    h: "Content Security Policy",
    p: "The site ships a strict CSP that disallows iframes, plugins, eval, third-party scripts and cross-origin resources. Modern browsers will refuse to render any unauthorized code.",
  },
  {
    h: "Frame protection",
    p: "frame-ancestors 'none' + X-Frame-Options: DENY block this site from being embedded inside another site (clickjacking protection).",
  },
  {
    h: "Bot & AI-scraper policy",
    p: "robots.txt allows search engines but disallows GPTBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot, PerplexityBot, Bytespider, Amazonbot and FacebookBot from training on this content.",
  },
  {
    h: "Security disclosure",
    p: "Found something suspicious? See /.well-known/security.txt — or email arefinmueen360@gmail.com with subject \"Security report\".",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy & Security"
        index="08"
        meta="Static, cookieless, no tracking"
        title={
          <>
            Your visit here is{" "}
            <span className="serif">private by default.</span>
          </>
        }
        subtitle="A short, plain-English account of what this site does and does not do with your data, and the technical controls that back that up."
      />

      <section className="max-w-4xl mx-auto px-6 sm:px-8 section">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((it, i) => (
            <li
              key={it.h}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8"
            >
              <div className="md:col-span-2">
                <span className="num text-sm text-muted">
                  /{(i + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="md:col-span-10">
                <h2 className="display text-xl md:text-2xl tracking-tight">
                  {it.h}
                </h2>
                <p className="mt-2 text-foreground/85 leading-relaxed">
                  {it.p}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-xs mono text-muted">
          Last reviewed · April 2025
        </p>
      </section>
    </>
  );
}
