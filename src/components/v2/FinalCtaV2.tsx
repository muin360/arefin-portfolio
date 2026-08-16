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
          Ready to build an <em>intelligent</em> product
          <br />
          or automate your operations?
        </h2>
        <p className="v2-finalcta__sub">
          Full-stack web applications, modern conversion websites, and AI automation tailored to your business goals. Direct senior engineering with complete IP ownership.
        </p>

        <ul className="v2-finalcta__check">
          {[
            "Free 30-min discovery call — no sales pitch",
            "Milestone-based delivery with clear acceptance criteria",
            "Full frontend, backend, and AI integration",
            "You own 100% of source code, schemas, and accounts",
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
            aria-label="Start a project"
          >
            <span>Start a project</span>
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
