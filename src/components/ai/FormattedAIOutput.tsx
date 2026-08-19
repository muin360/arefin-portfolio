"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  Info,
  AlertTriangle,
  Calendar,
  Layers,
  Mail,
  ChevronRight,
} from "lucide-react";

interface FormattedAIOutputProps {
  content: string;
  onLinkClick?: () => void;
  className?: string;
  enableActionCards?: boolean;
}

export default function FormattedAIOutput({
  content,
  onLinkClick,
  className = "",
  enableActionCards = true,
}: FormattedAIOutputProps) {
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  // Helper to format inline elements: **bold**, `code`, [link](url)
  const formatInlineElements = (text: string, parentKey: string): React.ReactNode[] => {
    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;
      const partKey = `${parentKey}_inl_${i}`;

      // Markdown Link [label](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isInternal = href.startsWith("/");

        return (
          <Link
            key={partKey}
            href={href}
            onClick={onLinkClick}
            className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-200 font-semibold underline decoration-violet-500/40 hover:decoration-violet-300 underline-offset-4 transition-all group/link mx-0.5"
          >
            <span>{label}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/link:opacity-100 transition-opacity" />
          </Link>
        );
      }

      // Bold Text **text**
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        return (
          <strong
            key={partKey}
            className="font-bold text-white tracking-wide bg-gradient-to-r from-violet-200 to-indigo-100 bg-clip-text text-transparent"
          >
            {inner}
          </strong>
        );
      }

      // Inline Code `code`
      if (part.startsWith("`") && part.endsWith("`")) {
        const inner = part.slice(1, -1);
        return (
          <code
            key={partKey}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#13182a] border border-violet-500/30 text-violet-300 font-mono text-[11px] font-semibold tracking-tight shadow-sm"
          >
            {inner}
          </code>
        );
      }

      return <span key={partKey}>{part}</span>;
    });
  };

  // Split into structural blocks
  const blocks = content.split("\n\n");

  // Check if content mentions key portfolio routes for bottom action shortcuts
  const hasBookLink = content.includes("/book") || content.toLowerCase().includes("discovery call");
  const hasProjectsLink = content.includes("/projects") || content.toLowerCase().includes("case studies");
  const hasContactLink = content.includes("/contact") || content.toLowerCase().includes("contact form");

  return (
    <div className={`space-y-3.5 font-sans leading-relaxed text-[13px] text-slate-200 ${className}`}>
      {blocks.map((block, idx) => {
        const blockKey = `blk_${idx}`;
        const trimmed = block.trim();
        if (!trimmed) return null;

        // ─── 1. FENCED CODE BLOCKS ```lang ... ``` ─────────────────────────
        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
          const lines = trimmed.slice(3, -3).trim().split("\n");
          const hasLang = lines[0].match(/^[a-z0-9_-]+$/i);
          const lang = hasLang ? lines[0].toLowerCase() : "code";
          const codeBody = hasLang ? lines.slice(1).join("\n") : lines.join("\n");
          const codeKey = `${blockKey}_code`;

          return (
            <div
              key={blockKey}
              className="my-3 rounded-xl bg-[#04060d] border border-violet-500/20 shadow-lg shadow-black/40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#090d18] border-b border-white/[0.06] text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-violet-400" />
                  <span className="uppercase font-bold tracking-wider text-violet-300">{lang}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeKey, codeBody)}
                  className="hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
                >
                  {copiedCodeKey === codeKey ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 text-[11px] font-mono text-violet-200 overflow-x-auto custom-scrollbar leading-relaxed">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // ─── 2. CALLOUT / QUOTE BLOCKS (> Quote) ───────────────────────────
        if (trimmed.startsWith("> ")) {
          const quoteText = trimmed.replace(/^>\s*/gm, "");
          return (
            <div
              key={blockKey}
              className="my-2.5 p-3.5 rounded-xl bg-violet-950/25 border-l-2 border-violet-500 border-y border-r border-violet-500/10 text-slate-300 text-xs flex items-start gap-2.5"
            >
              <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{formatInlineElements(quoteText, blockKey)}</div>
            </div>
          );
        }

        // ─── 3. HEADINGS (### or ## or #) ──────────────────────────────────
        if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const headingText = trimmed.replace(/^#{1,3}\s+/, "");
          return (
            <div key={blockKey} className="pt-2 pb-0.5 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-500 via-indigo-500 to-cyan-500 shrink-0" />
              <h4 className="text-sm font-bold text-white tracking-wide flex-1">
                {formatInlineElements(headingText, blockKey)}
              </h4>
            </div>
          );
        }

        // ─── 4. MARKDOWN TABLES (| Col 1 | Col 2 |) ────────────────────────
        if (trimmed.includes("|") && trimmed.split("\n").length >= 2 && trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter((r) => r.trim().length > 0 && !r.includes("---"));
          const headerRow = rows[0]?.split("|").filter((c) => c.trim().length > 0) || [];
          const bodyRows = rows.slice(1);

          return (
            <div key={blockKey} className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-[#060810]">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#0e1322] border-b border-white/10 text-violet-300 text-[10px] uppercase">
                    {headerRow.map((col, cIdx) => (
                      <th key={cIdx} className="py-2 px-3 font-bold">
                        {col.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bodyRows.map((row, rIdx) => {
                    const cells = row.split("|").filter((c) => c.trim().length > 0);
                    return (
                      <tr key={rIdx} className="hover:bg-white/[0.02]">
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 text-slate-300 text-[11px]">
                            {formatInlineElements(cell.trim(), `${blockKey}_tb_${rIdx}_${cIdx}`)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // ─── 5. BULLET LISTS (- or *) ──────────────────────────────────────
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ul key={blockKey} className="space-y-2 my-2 pl-0.5">
              {items.map((item, itemIdx) => {
                const cleaned = item.replace(/^[-*]\s+/, "");
                return (
                  <li
                    key={`${blockKey}_li_${itemIdx}`}
                    className="flex items-start gap-2.5 text-slate-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                    <div className="flex-1">{formatInlineElements(cleaned, `${blockKey}_li_${itemIdx}`)}</div>
                  </li>
                );
              })}
            </ul>
          );
        }

        // ─── 6. NUMBERED LISTS (1. 2. 3.) ──────────────────────────────────
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ol key={blockKey} className="space-y-2.5 my-2.5">
              {items.map((item, itemIdx) => {
                const numMatch = item.match(/^(\d+)\.\s+(.*)$/);
                const num = numMatch ? numMatch[1] : String(itemIdx + 1);
                const cleaned = numMatch ? numMatch[2] : item;
                return (
                  <li
                    key={`${blockKey}_ol_${itemIdx}`}
                    className="flex items-start gap-3 text-slate-200 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/40 text-violet-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {num}
                    </span>
                    <div className="flex-1">{formatInlineElements(cleaned, `${blockKey}_ol_${itemIdx}`)}</div>
                  </li>
                );
              })}
            </ol>
          );
        }

        // ─── 7. REGULAR PARAGRAPHS ─────────────────────────────────────────
        return (
          <p key={blockKey} className="leading-relaxed text-slate-200">
            {formatInlineElements(trimmed, blockKey)}
          </p>
        );
      })}

      {/* ─── OPTIONAL QUICK ACTION PILLS ─────────────────────────────────── */}
      {enableActionCards && (hasBookLink || hasProjectsLink || hasContactLink) && (
        <div className="pt-2.5 border-t border-white/[0.06] flex flex-wrap gap-2">
          {hasBookLink && (
            <Link
              href="/book"
              onClick={onLinkClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:text-white font-mono text-xs font-semibold transition-all shadow-sm group"
            >
              <Calendar className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span>Book 30-Min Discovery Call</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </Link>
          )}

          {hasProjectsLink && (
            <Link
              href="/projects"
              onClick={onLinkClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/30 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-all shadow-sm group"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Browse Projects</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </Link>
          )}

          {hasContactLink && (
            <Link
              href="/contact"
              onClick={onLinkClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-all shadow-sm group"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Direct Message</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
