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
  ShieldCheck,
  Calendar,
  Layers,
  Mail,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Terminal,
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

  // Helper to format inline elements: **bold**, `code`, [link](url), *italic*
  const formatInlineElements = (text: string, parentKey: string): React.ReactNode[] => {
    // Regex matches: markdown links [label](url), bold **bold**, inline code `code`, highlight tags
    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;
      const partKey = `${parentKey}_inl_${i}`;

      // Markdown Link [label](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        return (
          <Link
            key={partKey}
            href={href}
            onClick={onLinkClick}
            className="inline-flex items-center gap-1 font-semibold text-violet-300 hover:text-white px-1.5 py-0.5 rounded-md bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/30 hover:border-violet-400 transition-all group/link mx-0.5 shadow-sm text-xs"
          >
            <span>{label}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/link:opacity-100 transition-opacity" />
          </Link>
        );
      }

      // Bold Text **text**
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        return (
          <strong
            key={partKey}
            className="font-bold text-white tracking-wide bg-gradient-to-r from-white via-violet-100 to-indigo-200 bg-clip-text text-transparent"
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
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#101424] border border-violet-500/30 text-violet-300 font-mono text-[11px] font-semibold tracking-tight shadow-inner"
          >
            {inner}
          </code>
        );
      }

      return <span key={partKey}>{part}</span>;
    });
  };

  // Split content into blocks
  const blocks = content.split("\n\n");

  // Check for smart portfolio action shortcuts
  const hasBookLink =
    content.includes("/book") ||
    content.toLowerCase().includes("discovery call") ||
    content.toLowerCase().includes("schedule call") ||
    content.toLowerCase().includes("consultation");

  const hasProjectsLink =
    content.includes("/projects") ||
    content.toLowerCase().includes("case studies") ||
    content.toLowerCase().includes("portfolio projects");

  const hasContactLink =
    content.includes("/contact") ||
    content.toLowerCase().includes("contact form") ||
    content.toLowerCase().includes("direct email");

  return (
    <div className={`space-y-3.5 font-sans leading-relaxed text-[13.5px] text-slate-200 ${className}`}>
      {blocks.map((block, idx) => {
        const blockKey = `blk_${idx}`;
        const trimmed = block.trim();
        if (!trimmed) return null;

        // ─── 1. HORIZONTAL RULE (--- or ***) ──────────────────────────────
        if (trimmed === "---" || trimmed === "***") {
          return (
            <div key={blockKey} className="my-4 relative flex items-center justify-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
              <span className="absolute px-2 bg-[#090d19] text-violet-400/60 text-[10px] font-mono">✦ ✦ ✦</span>
            </div>
          );
        }

        // ─── 2. FENCED CODE BLOCKS ```lang ... ``` ─────────────────────────
        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
          const lines = trimmed.slice(3, -3).trim().split("\n");
          const hasLang = lines[0].match(/^[a-z0-9_-]+$/i);
          const lang = hasLang ? lines[0].toLowerCase() : "code";
          const codeBody = hasLang ? lines.slice(1).join("\n") : lines.join("\n");
          const codeKey = `${blockKey}_code`;

          return (
            <div
              key={blockKey}
              className="my-3.5 rounded-xl bg-[#05070f] border border-violet-500/30 shadow-2xl shadow-black/60 overflow-hidden group/code transition-all hover:border-violet-500/50"
            >
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#090e1c] border-b border-white/[0.08] text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block" />
                  </div>
                  <div className="h-3 w-px bg-white/10 mx-1" />
                  <Terminal className="w-3 h-3 text-violet-400" />
                  <span className="uppercase font-bold tracking-widest text-violet-300">{lang}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeKey, codeBody)}
                  className="hover:text-white transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-violet-600/30 border border-white/10 hover:border-violet-500/40 text-slate-300 font-mono text-[10px] active:scale-95"
                >
                  {copiedCodeKey === codeKey ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-[11.5px] font-mono text-violet-200 overflow-x-auto custom-scrollbar leading-relaxed bg-[#05070f]">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // ─── 3. CALLOUT BOXES (> Quote, > [!NOTE], > [!TIP], > [!WARNING]) ─
        if (trimmed.startsWith("> ")) {
          const rawQuote = trimmed.replace(/^>\s*/gm, "");
          const isWarning = rawQuote.includes("[!WARNING]") || rawQuote.toLowerCase().includes("warning:");
          const isTip = rawQuote.includes("[!TIP]") || rawQuote.toLowerCase().includes("tip:");
          const isSecurity = rawQuote.includes("[!SECURITY]") || rawQuote.toLowerCase().includes("security:");

          const cleanQuote = rawQuote.replace(/\[!(NOTE|TIP|WARNING|IMPORTANT|SECURITY|CAUTION)\]\s*/i, "");

          return (
            <div
              key={blockKey}
              className={`my-3 p-3.5 rounded-xl border flex items-start gap-3 shadow-lg ${
                isWarning
                  ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                  : isTip
                  ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                  : isSecurity
                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                  : "bg-violet-950/30 border-violet-500/40 text-violet-200"
              }`}
            >
              {isWarning ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : isTip ? (
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : isSecurity ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed text-xs sm:text-[13px]">
                {formatInlineElements(cleanQuote, blockKey)}
              </div>
            </div>
          );
        }

        // ─── 4. HEADINGS (### or ## or #) ──────────────────────────────────
        if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const headingText = trimmed.replace(/^#{1,3}\s+/, "");
          return (
            <div key={blockKey} className="pt-2 pb-1 flex items-center gap-2.5 border-b border-white/[0.04] pb-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-400 via-indigo-500 to-cyan-400 shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              <h4 className="text-sm sm:text-[14.5px] font-bold text-white tracking-wide flex-1">
                {formatInlineElements(headingText, blockKey)}
              </h4>
            </div>
          );
        }

        // ─── 5. MARKDOWN TABLES (| Col 1 | Col 2 |) ────────────────────────
        if (trimmed.includes("|") && trimmed.split("\n").length >= 2 && trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter((r) => r.trim().length > 0 && !r.includes("---"));
          const headerRow = rows[0]?.split("|").filter((c) => c.trim().length > 0) || [];
          const bodyRows = rows.slice(1);

          return (
            <div
              key={blockKey}
              className="my-3.5 overflow-x-auto rounded-xl border border-white/10 bg-[#060810] shadow-xl custom-scrollbar"
            >
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#0d1222] border-b border-white/10 text-violet-300 text-[10.5px] uppercase tracking-wider">
                    {headerRow.map((col, cIdx) => (
                      <th key={cIdx} className="py-2.5 px-3.5 font-bold">
                        {col.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bodyRows.map((row, rIdx) => {
                    const cells = row.split("|").filter((c) => c.trim().length > 0);
                    return (
                      <tr key={rIdx} className="hover:bg-violet-950/20 transition-colors">
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3.5 text-slate-300 text-[11px] leading-relaxed">
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

        // ─── 6. BULLET LISTS (- or *) ──────────────────────────────────────
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ul key={blockKey} className="space-y-2.5 my-2.5 pl-0.5">
              {items.map((item, itemIdx) => {
                const cleaned = item.replace(/^[-*]\s+/, "");
                return (
                  <li
                    key={`${blockKey}_li_${itemIdx}`}
                    className="flex items-start gap-3 text-slate-200 leading-relaxed group/item"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(139,92,246,0.9)] group-hover/item:scale-125 transition-transform" />
                    <div className="flex-1">{formatInlineElements(cleaned, `${blockKey}_li_${itemIdx}`)}</div>
                  </li>
                );
              })}
            </ul>
          );
        }

        // ─── 7. NUMBERED LISTS (1. 2. 3.) ──────────────────────────────────
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ol key={blockKey} className="space-y-3 my-3">
              {items.map((item, itemIdx) => {
                const numMatch = item.match(/^(\d+)\.\s+(.*)$/);
                const num = numMatch ? numMatch[1] : String(itemIdx + 1);
                const cleaned = numMatch ? numMatch[2] : item;
                return (
                  <li
                    key={`${blockKey}_ol_${itemIdx}`}
                    className="flex items-start gap-3 text-slate-200 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/40 text-violet-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-violet-950">
                      {num}
                    </span>
                    <div className="flex-1">{formatInlineElements(cleaned, `${blockKey}_ol_${itemIdx}`)}</div>
                  </li>
                );
              })}
            </ol>
          );
        }

        // ─── 8. REGULAR PARAGRAPHS ─────────────────────────────────────────
        return (
          <p key={blockKey} className="leading-relaxed text-slate-200">
            {formatInlineElements(trimmed, blockKey)}
          </p>
        );
      })}

      {/* ─── SMART ACTION LAUNCHER CARDS ─────────────────────────────────── */}
      {enableActionCards && (hasBookLink || hasProjectsLink || hasContactLink) && (
        <div className="pt-3.5 border-t border-white/[0.08] flex flex-wrap gap-2.5 animate-fade-in">
          {hasBookLink && (
            <Link
              href="/book"
              onClick={onLinkClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30 hover:from-violet-600/50 hover:to-indigo-600/50 border border-violet-500/40 hover:border-violet-400 text-white font-mono text-xs font-bold transition-all shadow-md shadow-violet-950/40 group active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-violet-300 group-hover:scale-110 transition-transform" />
              <span>Book 30-Min Discovery Call</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {hasProjectsLink && (
            <Link
              href="/projects"
              onClick={onLinkClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f1424] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/40 text-slate-200 hover:text-white font-mono text-xs font-semibold transition-all shadow-sm group active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Explore 10+ Production Projects</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {hasContactLink && (
            <Link
              href="/contact"
              onClick={onLinkClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f1424] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white font-mono text-xs font-semibold transition-all shadow-sm group active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Direct Inquiry Form</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
