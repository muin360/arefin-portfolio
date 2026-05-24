"use client";

import Link from "next/link";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";
import { IconArrow, IconCheck } from "@/components/icons";

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
    <section className="v2-finalcta" aria-label="Book the next sprint">
      <div className="v2-finalcta__orb" aria-hidden="true" />
      <div className="v2-finalcta__card">
        <span className="v2-finalcta__eyebrow">[ next step ]  book the studio</span>
        <h2 className="v2-finalcta__head">
          You don&rsquo;t need <em>more</em> tools.
          <br />
          You need <span style={{ color: "var(--a2)" }}>one</span> system
          that runs the work for you.
        </h2>
        <p className="v2-finalcta__sub">
          14 days, fixed price, you own everything we build. If automation
          doesn&rsquo;t deliver real time back to your team in 30 days, you
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
              <IconCheck width={14} height={14} className="text-[#5DCAA5] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="v2-finalcta__row">
          <Link
            href="/book"
            className="v2-finalcta__primary"
            aria-label="Book a free 30-min audit"
          >
            Book free audit
            <IconArrow width={14} height={14} aria-hidden="true" />
          </Link>
          <a
            href={whatsappHref(WA_MESSAGES.generic)}
            className="v2-finalcta__secondary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on WhatsApp"
          >
            WhatsApp the studio
          </a>
        </div>
      </div>
    </section>
  );
}
