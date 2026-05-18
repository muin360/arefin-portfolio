"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * FAQ accordion (v2).
 *
 * Each item is a single row with a slash-prefixed two-digit index,
 * the question, and a `+` icon on the right that rotates 45° to a
 * `×` when open. When an item opens, the left edge gains a 2px
 * `--a1` accent line and the body height transitions via
 * max-height (measured from the actual content via ResizeObserver
 * + a one-time post-mount measurement).
 *
 * Only one item open at a time — clicking another closes the
 * previous one. Keyboard accessible: each header is a button with
 * `aria-expanded` and `aria-controls` set to its panel id.
 */

type Item = { q: string; a: string };

const ITEMS: Item[] = [
  {
    q: "What does a typical engagement look like?",
    a: "We start with a 30–60 min scoping call. If there's a clear automation worth building, I scope it as a 1- to 4-week fixed-price sprint. Most projects ship a working v1 in under 14 days, with a 30-day support window included.",
  },
  {
    q: "Do you charge hourly or fixed?",
    a: "Fixed price by default. I quote a single number for the sprint so you know exactly what it costs before we start. Ongoing retainers for evolving systems are billed monthly.",
  },
  {
    q: "Will I actually own the system?",
    a: "Yes. I deliver everything inside your accounts (n8n, GoHighLevel, OpenAI, etc.) and give your team a written runbook plus a video walkthrough. No agency lock-in, no recurring SaaS to me.",
  },
  {
    q: "What if the automation breaks?",
    a: "Every project ships with a 30-day support window where I fix anything that misbehaves at no extra cost. After that, you can either operate it yourself with the runbook or keep me on a light retainer.",
  },
  {
    q: "Can you work with my existing tools?",
    a: "Almost always. I've shipped automations against Salesforce, HubSpot, GoHighLevel, Notion, Airtable, Stripe, Twilio, Slack, Gmail and dozens more. If a tool has an API or a Zapier/n8n connector, I can wire it in.",
  },
  {
    q: "Where are you based, and how do you communicate?",
    a: "I'm in Dhaka, Bangladesh and work async with clients across SE Asia, Europe and North America. Weekly written updates inside a shared Slack channel, plus a 30-min call at the start and end of each sprint.",
  },
];

export default function FaqAccordionV2() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="v2-faq">
      {ITEMS.map((item, i) => (
        <FaqRow
          key={item.q}
          idx={i}
          item={item}
          open={openIdx === i}
          onToggle={() => setOpenIdx((cur) => (cur === i ? null : i))}
        />
      ))}
    </div>
  );
}

function FaqRow({
  idx,
  item,
  open,
  onToggle,
}: {
  idx: number;
  item: Item;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);
  const id = `faq-panel-${idx}`;
  const labelId = `faq-label-${idx}`;

  // Cache the natural height of the panel body once it mounts and any
  // time it changes (e.g. font load / window resize). This avoids
  // reading the ref during render which violates `react-hooks/refs`.
  const measure = useCallback(() => {
    if (bodyRef.current) {
      setHeight(bodyRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(bodyRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className={`v2-faq__row ${open ? "is-open" : ""}`}>
      <button
        type="button"
        id={labelId}
        onClick={onToggle}
        className="v2-faq__head"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="v2-faq__index" aria-hidden="true">
          /{String(idx + 1).padStart(2, "0")}
        </span>
        <span className="v2-faq__q">{item.q}</span>
        <span className="v2-faq__icon" aria-hidden="true">
          +
        </span>
      </button>
      <div
        id={id}
        role="region"
        aria-labelledby={labelId}
        className="v2-faq__panel"
        style={{ maxHeight: open ? `${height || 800}px` : "0px" }}
      >
        <div ref={bodyRef} className="v2-faq__a">
          {item.a}
        </div>
      </div>
    </div>
  );
}
