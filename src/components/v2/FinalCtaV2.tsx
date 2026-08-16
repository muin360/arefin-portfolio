"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";

/**
 * Final CTA (v2).
 *
 * The last band on the homepage before the footer. A blurred indigo
 * orb sits behind a glass card. The card holds a small mono label, a
 * display-font headline, a short pitch, a 4-item checklist, and two
 * CTAs side by side (book audit + whatsapp).
 *
 * Headline copy is unchanged from the rest of the site — this just
 * binds it into the v2 visual language.
 */
export default function FinalCtaV2() {
  return (
    <section className="v2-finalcta" aria-label="Let's work together">
      <div className="v2-finalcta__orb" aria-hidden="true" />
      <div className="v2-finalcta__card">
        <span className="v2-finalcta__eyebrow">[ next step ]  let&rsquo;s work together</span>
        <h2 className="v2-finalcta__head">
          Have a workflow or repetitive task
          <br />
          you want to <em>automate?</em>
        </h2>
        <p className="v2-finalcta__sub">
          Let&rsquo;s map out your process and build practical AI agents, automated workflows, or RAG assistants to handle the work for you.
        </p>

        <ul className="v2-finalcta__check">
          {[
            "Free 30-min scoping call — explore what's possible",
            "Clear workflow architecture and step-by-step logic",
            "Built with n8n, LangChain, Langflow, or custom Python",
            "You own 100% of workflows, credentials, and code",
          ].map((line) => (
            <li key={line}>
              <span className="v2-finalcta__tick" aria-hidden="true">
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="v2-finalcta__row">
          <Link
            href="/contact"
            className="v2-finalcta__primary group"
            aria-label="Let's build an automation"
          >
            <span>Let&rsquo;s build an automation</span>
            <ArrowRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="v2-finalcta__arrow"
            />
          </Link>
          <a
            href={whatsappHref(WA_MESSAGES.generic)}
            className="v2-finalcta__secondary group"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on WhatsApp"
          >
            <MessageCircle
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="v2-finalcta__wa-icon"
            />
            <span>WhatsApp me</span>
          </a>
        </div>
      </div>
    </section>
  );
}
