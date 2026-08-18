"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, Terminal } from "lucide-react";

interface Props {
  content: string;
  className?: string;
}

function CodeBlockWithCopy({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl bg-[#080b12] border border-white/[0.08] overflow-hidden my-6 group">
      <div className="px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-white/40">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-violet-400" />
          <span className="uppercase">{lang || "code"}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-white/50" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs text-violet-200 leading-relaxed custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function MarkdownContent({ content, className = "" }: Props) {
  if (!content) return null;

  const blocks = content.split("\n\n").map((b) => b.trim()).filter(Boolean);

  return (
    <div className={`prose-content space-y-6 text-white/80 leading-relaxed font-sans ${className}`}>
      {blocks.map((block, idx) => {
        // H1
        if (block.startsWith("# ")) {
          return (
            <h1
              key={idx}
              className="text-3xl md:text-4xl font-bold text-white tracking-tight pt-6 pb-2 border-b border-white/10"
            >
              {block.replace(/^# /, "")}
            </h1>
          );
        }

        // H2
        if (block.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="text-2xl md:text-3xl font-semibold text-white tracking-tight pt-6 pb-2 border-b border-white/10"
            >
              {block.replace(/^## /, "")}
            </h2>
          );
        }

        // H3
        if (block.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-xl font-semibold text-white pt-4 pb-1">
              {block.replace(/^### /, "")}
            </h3>
          );
        }

        // Blockquote
        if (block.startsWith("> ")) {
          const quoteText = block.replace(/^>\s*/gm, "");
          return (
            <blockquote
              key={idx}
              className="p-4 rounded-xl bg-violet-600/10 border-l-4 border-violet-500 text-white/90 italic font-serif my-4"
            >
              {renderFormattedText(quoteText)}
            </blockquote>
          );
        }

        // Bullet List
        if (block.startsWith("- ") || block.startsWith("* ")) {
          const items = block.split("\n").map((line) => line.replace(/^[-*]\s+/, "").trim());
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 pl-2 text-white/85">
              {items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderFormattedText(item)}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered List
        if (/^\d+\.\s/.test(block)) {
          const items = block.split("\n").map((line) => line.replace(/^\d+\.\s+/, "").trim());
          return (
            <ol key={idx} className="list-decimal list-inside space-y-2 pl-2 text-white/85">
              {items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderFormattedText(item)}
                </li>
              ))}
            </ol>
          );
        }

        // Code block
        if (block.startsWith("```")) {
          const lines = block.split("\n");
          const firstLine = lines[0].replace(/^```/, "").trim();
          const code = lines.slice(1, lines.length - 1).join("\n");
          return <CodeBlockWithCopy key={idx} code={code} lang={firstLine} />;
        }

        // Regular paragraph with inline formatting
        return (
          <p key={idx} className="text-base leading-relaxed text-white/80">
            {renderFormattedText(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderFormattedText(text: string): React.ReactNode[] {
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <Link
          key={i}
          href={href}
          className="text-violet-400 hover:text-violet-300 underline decoration-violet-500/40 hover:decoration-violet-300 transition-colors"
        >
          {label}
        </Link>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}
