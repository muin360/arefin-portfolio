"use client";

import { useInView } from "@/hooks/useInView";

/**
 * Testimonials section (v2).
 *
 * Three "case result" dashboard cards. Each shows a five-star row, the
 * quote (italic, large enough to read), and a foot row with the
 * speaker's name, role and location. Left edge holds a 3px accent
 * line that lights up to `--a1` on hover.
 *
 * Quotes are deliberately small numbers in attribution but specific in
 * the body — same voice as the homepage hero.
 */

type Quote = {
  body: string;
  who: string;
  role: string;
  org: string;
  city: string;
};

const QUOTES: Quote[] = [
  {
    body:
      "Our inbound qualification used to take three days. With the agent Arefin shipped, the sales team gets a hot lead with full context inside an hour.",
    who: "Tariq R.",
    role: "Head of Sales",
    org: "Logistics SaaS",
    city: "Riyadh, KSA",
  },
  {
    body:
      "The thing I appreciate most is that we own the system. No black box, no recurring SaaS lock-in — Arefin handed us the keys and the runbook.",
    who: "Maya P.",
    role: "Founder",
    org: "Wellness Studio",
    city: "Toronto, Canada",
  },
  {
    body:
      "Quiet, professional, ridiculously fast. Two weeks from intro call to a live n8n pipeline replacing what our ops manager did manually every Monday.",
    who: "Anya S.",
    role: "Operations Lead",
    org: "E-commerce Brand",
    city: "Dhaka, Bangladesh",
  },
];

export default function TestimonialsV2() {
  return (
    <div className="v2-testimonial__grid">
      {QUOTES.map((q, i) => (
        <Card key={q.who + i} quote={q} idx={i} />
      ))}
    </div>
  );
}

function Card({ quote, idx }: { quote: Quote; idx: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <article
      ref={ref}
      className={`v2-testimonial__card ${inView ? "is-in" : ""}`}
      style={{ ["--delay" as string]: `${idx * 90}ms` }}
    >
      <div className="v2-testimonial__stars" aria-label="5 of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden="true">
            ★
          </span>
        ))}
      </div>
      <p className="v2-testimonial__body">&ldquo;{quote.body}&rdquo;</p>
      <div className="v2-testimonial__foot">
        <span className="v2-testimonial__who">
          {quote.who} · {quote.role}
        </span>
        <span className="v2-testimonial__where">
          {quote.org} · {quote.city}
        </span>
      </div>
    </article>
  );
}
