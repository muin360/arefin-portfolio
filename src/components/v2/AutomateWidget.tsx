"use client";

import { useState } from "react";
import Link from "next/link";

const OPTIONS = [
  {
    id: "calls",
    label: "📞 Calls & Bookings",
    result: "→ Voice agent + calendar sync — avg 2 weeks to ship",
  },
  {
    id: "lead",
    label: "📧 Lead & Outreach",
    result: "→ n8n pipeline + LLM scoring — replaces 8 hrs/week manual work",
  },
  {
    id: "docs",
    label: "📄 Docs & Invoices",
    result: "→ Vision LLM + PDF extraction — zero-touch invoice processing",
  },
  {
    id: "custom",
    label: "🤖 Custom Agent",
    result: "→ Let's scope it — book a free 30-min audit",
  },
];

export default function AutomateWidget() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedOption = OPTIONS.find((o) => o.id === selectedId);

  return (
    <div className="v2-automate-widget">
      <p className="v2-automate-widget__header">{"// what do you want to automate?"}</p>
      <div className="v2-automate-widget__grid">

        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`v2-automate-widget__pill ${
              selectedId === opt.id ? "is-selected" : ""
            }`}
            onClick={() => setSelectedId(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      
      {selectedOption && (
        <div className="v2-automate-widget__result-area">
          <p className="v2-automate-widget__result-text">
            {selectedOption.result}
          </p>
          <Link href="/book" className="v2-automate-widget__link">
            [ Book audit → ]
          </Link>
        </div>
      )}
    </div>
  );
}
