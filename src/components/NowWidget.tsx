type Item = { label: string; value: string };

const items: Item[] = [
  { label: "Now building", value: "Multi-agent SDR system on n8n + LangChain" },
  { label: "Now learning", value: "LLM evaluation, observability, fine-tuning" },
  { label: "Reading", value: "Building Effective AI Agents — Anthropic" },
  { label: "Open to", value: "1–2 new client engagements per month" },
];

export default function NowWidget() {
  return (
    <div className="border border-line rounded-3xl bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-line bg-paper-deep/40">
        <div className="flex items-center gap-3">
          <span className="live-dot" aria-hidden="true" />
          <span className="mono text-xs uppercase tracking-[0.18em] text-muted">
            Now / Live status
          </span>
        </div>
        <span className="mono text-xs text-muted">
          Updated April 2025
        </span>
      </div>
      <ul className="divide-y divide-line">
        {items.map((it) => (
          <li
            key={it.label}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 px-6 md:px-8 py-5"
          >
            <span className="sm:col-span-3 mono text-xs uppercase tracking-[0.14em] text-muted">
              {it.label}
            </span>
            <span className="sm:col-span-9 text-foreground/90 text-[0.95rem]">
              {it.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
