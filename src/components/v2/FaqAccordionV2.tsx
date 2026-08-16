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
    q: "What tools and platforms do you specialize in?",
    a: "I specialize in n8n, Zapier, Make, Langflow, LangChain, OpenAI & Claude APIs, vector databases (Pinecone), webhooks, and REST APIs. I also write custom Python and JavaScript scripts for API glue and data transformations.",
  },
  {
    q: "What type of automations and agents do you build?",
    a: "I build event-driven workflow automations (email triage, CRM syncing, lead qualification), RAG knowledge assistants over company documentation, multi-agent research crews, and conversational chatbots.",
  },
  {
    q: "Can you connect with my existing business tools?",
    a: "Yes. Any platform that provides an API, webhook triggers, or an n8n/Zapier connector (such as Gmail, Slack, Google Sheets, Airtable, Notion, Shopify, Typeform, or CRMs) can be integrated into automated pipelines.",
  },
  {
    q: "Can you build RAG assistants or multi-agent workflows?",
    a: "Yes. I build RAG assistants that index documentation into vector stores for citation-backed answers, and multi-agent systems with LangChain where specialized agents research, synthesize, and review outputs.",
  },
  {
    q: "How do you approach a new project?",
    a: "We start by mapping the manual workflow steps from trigger to output. I then design the automation blueprint, configure the API and prompt logic, test with realistic payloads, and provide full video and written documentation upon handover.",
  },
  {
    q: "Who owns the workflows and accounts after handover?",
    a: "You own 100% of everything. All workflows, scripts, and API credentials are built directly under your accounts and repository with full runbooks and walkthrough instructions.",
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
