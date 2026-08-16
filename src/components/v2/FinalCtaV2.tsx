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
          You don&rsquo;t need <em>more</em> tools.
          <br />
          You need <span style={{ color: "var(--a2)" }}>one</span> system
          that runs the work for you.
        </h2>
        <p className="v2-finalcta__sub">
          14 days, fixed price, you own everything I build. If automation
          doesn&rsquo;t deliver real time back to you in 30 days, you
          don&rsquo;t pay the second invoice.
        </p>

        <ul className="v2-finalcta__check">
          {[
            "Free 30-min scoping call — no pitch deck",
            "Fixed-price sprint, no surprise invoices",
            "Production-ready in 14 days or less",
            "You own every script, model and credential",
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
            href="/book"
            className="v2-finalcta__primary group"
            aria-label="Book a free 30-min audit"
          >
            <span>Book free audit</span>
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
