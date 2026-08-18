"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";
import type { Citation } from "@/lib/ai/retrieval";
import { trackAIOpen, trackAIPrompt, trackAIProjectClick } from "@/lib/track-event";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: string;
}

interface ArefinAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "What can you build?",
  "Show me your RAG work.",
  "How does your agent architecture work?",
  "What tools do you use?",
  "How can I contact or hire you?",
];

export default function ArefinAIPanel({ isOpen, onClose }: ArefinAIPanelProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am **Arefin AI**, grounded in Arefin Mueen's verified portfolio. Ask me anything about his AI agent architectures, RAG systems, n8n automations, tech stack, or case studies.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and track open
  useEffect(() => {
    if (isOpen) {
      trackAIOpen();
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    setInput("");
    setError(null);

    const userMessageId = `user_${Date.now()}`;
    const userMsg: MessageItem = {
      id: userMessageId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    trackAIPrompt(query);

    try {
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
        }
        throw new Error("Failed to get response from AI assistant.");
      }

      const data = await res.json();
      const assistantMsg: MessageItem = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am here to help. What else would you like to know about Arefin's work?",
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI assistant is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    trackAIProjectClick(citation.url);
    onClose();
  };

  /** Simple lightweight markdown-to-JSX renderer for bold, code, bullet lists, and paragraphs */
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Bullet line
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemText = trimmed.slice(2);
        return (
          <li key={idx} className="ml-4 list-disc text-white/80 my-0.5">
            {renderInlineMarkdown(itemText)}
          </li>
        );
      }

      // Numbered list item
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+\.)\s(.*)$/);
        if (match) {
          return (
            <div key={idx} className="flex items-start gap-1.5 text-white/80 my-0.5">
              <span className="font-mono text-violet-400 font-semibold">{match[1]}</span>
              <span>{renderInlineMarkdown(match[2])}</span>
            </div>
          );
        }
      }

      return (
        <p key={idx} className="my-1 leading-relaxed text-white/85">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  function renderInlineMarkdown(text: string) {
    // Split by bold (**text**) and code (`text`)
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Check for **bold**
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
      // Check for `code`
      const codeMatch = remaining.match(/`(.*?)`/);

      const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
      const codeIndex = codeMatch ? remaining.indexOf(codeMatch[0]) : -1;

      if (boldIndex === -1 && codeIndex === -1) {
        parts.push(remaining);
        break;
      }

      if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
        if (boldIndex > 0) {
          parts.push(remaining.slice(0, boldIndex));
        }
        parts.push(
          <strong key={keyIdx++} className="font-bold text-white">
            {boldMatch![1]}
          </strong>,
        );
        remaining = remaining.slice(boldIndex + boldMatch![0].length);
      } else if (codeIndex !== -1) {
        if (codeIndex > 0) {
          parts.push(remaining.slice(0, codeIndex));
        }
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 font-mono text-[11px]"
          >
            {codeMatch![1]}
          </code>,
        );
        remaining = remaining.slice(codeIndex + codeMatch![0].length);
      }
    }

    return parts;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Arefin AI Technical Assistant"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Slide-over container */}
      <div className="relative w-full sm:max-w-2xl bg-[#0b0e17] border-t sm:border border-white/10 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[680px] max-h-screen z-10 animate-in slide-in-from-bottom-6 duration-200">
        {/* ─── HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#0f1320]/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono tracking-wider">
                  AREFIN AI
                </h2>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GROUNDED
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-sans">
                Ask about my work, systems, and capabilities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Arefin AI assistant"
            className="p-2 text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── MESSAGES CHAT STREAM ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-gradient-to-b from-[#0b0e17] to-[#07090e]">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs sm:text-sm ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 space-y-2.5 ${
                    isUser
                      ? "bg-violet-600 text-white rounded-tr-sm shadow-md"
                      : "bg-[#121624] border border-white/[0.08] text-white/90 rounded-tl-sm shadow-md"
                  }`}
                >
                  <div className="font-sans leading-relaxed text-xs sm:text-[13px]">
                    {isUser ? msg.content : renderFormattedContent(msg.content)}
                  </div>

                  {/* Citations & Quick Links */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                      {msg.citations.map((c, i) => (
                        <Link
                          key={i}
                          href={c.url}
                          onClick={() => handleCitationClick(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/70 border border-white/10 hover:border-violet-500/40 text-violet-300 hover:text-white font-mono text-[10px] transition-colors"
                        >
                          <span>
                            {c.type === "project"
                              ? "View project →"
                              : c.type === "service"
                              ? "Explore service →"
                              : c.type === "journal"
                              ? "Read build note →"
                              : `${c.title} →`}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end text-[9px] font-mono opacity-40 pt-1">
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#1a2030] border border-white/10 flex items-center justify-center text-white/60 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking animation state */}
          {loading && (
            <div className="flex gap-3 text-xs sm:text-sm justify-start">
              <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#121624] border border-white/[0.08] rounded-2xl rounded-tl-sm p-3.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
                <span className="font-mono text-[10px] text-white/40 ml-1.5">
                  Retrieving portfolio knowledge...
                </span>
              </div>
            </div>
          )}

          {/* Error retry banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-2">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 text-white rounded-lg font-mono text-[10px] hover:bg-rose-500 shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── SUGGESTED QUICK PROMPTS ─────────────────────────────────────── */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-white/[0.06] bg-[#0c0f18] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-mono text-white/40 uppercase shrink-0 mr-1">
              Suggested:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-violet-600/20 hover:text-violet-200 border border-white/10 hover:border-violet-500/30 text-white/70 text-[11px] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* ─── INPUT COMPOSER ──────────────────────────────────────────────── */}
        <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0f1320] shrink-0 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Arefin's projects, RAG systems, tools, or scoping..."
              maxLength={400}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#07090e] border border-white/15 rounded-xl text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send query"
              className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white rounded-xl transition-colors shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 px-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Grounded in verified portfolio records. Zero hallucinations.</span>
            </div>
            <span>{input.length}/400</span>
          </div>
        </div>
      </div>
    </div>
  );
}
