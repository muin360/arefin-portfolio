"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  ArrowDown,
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

const INITIAL_MESSAGE: MessageItem = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am **Arefin AI**, grounded in Arefin Mueen's verified portfolio. Ask me anything about his AI agent architectures, RAG systems, n8n automations, tech stack, or case studies.",
  timestamp: "Just now",
};

export default function ArefinAIPanel({ isOpen, onClose }: ArefinAIPanelProps) {
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  }, []);

  // Detect user scrolling up
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 120;
    setShowScrollBottom(isUp);
  }, []);

  // Scroll to bottom on new messages if not scrolled up
  useEffect(() => {
    if (!showScrollBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, showScrollBottom]);

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

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearMessages = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

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

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);
    trackAIPrompt(query);

    try {
      const payload = {
        messages: nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok && res.status !== 200) {
        throw new Error(data.error || "Failed to retrieve response");
      }

      const assistantMsg: MessageItem = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am here to assist with Arefin's technical case studies and workflows.",
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (c: Citation) => {
    trackAIProjectClick(c.url);
    onClose();
  };

  const formatInlineText = (text: string): React.ReactNode[] => {
    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        return (
          <Link
            key={i}
            href={href}
            onClick={onClose}
            className="text-violet-400 hover:text-violet-300 underline decoration-violet-500/40 hover:decoration-violet-300 transition-colors font-medium"
          >
            {label}
          </Link>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    const parts = content.split("\n\n");
    return (
      <div className="space-y-2">
        {parts.map((p, i) => {
          if (p.startsWith("- ") || p.startsWith("* ")) {
            const listItems = p.split("\n");
            return (
              <ul key={i} className="list-disc list-inside space-y-1 pl-1 text-white/90">
                {listItems.map((li, j) => (
                  <li key={j} className="leading-relaxed">
                    {formatInlineText(li.replace(/^[-*]\s+/, ""))}
                  </li>
                ))}
              </ul>
            );
          }
          if (p.startsWith("1. ") || p.startsWith("2. ")) {
            const listItems = p.split("\n");
            return (
              <ol key={i} className="list-decimal list-inside space-y-1 pl-1 text-white/90">
                {listItems.map((li, j) => (
                  <li key={j} className="leading-relaxed">
                    {formatInlineText(li.replace(/^\d+\.\s+/, ""))}
                  </li>
                ))}
              </ol>
            );
          }
          return (
            <p key={i} className="leading-relaxed text-white/90">
              {formatInlineText(p)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-drawer-title"
    >
      <div
        className="w-full max-w-lg h-full bg-[#090d16] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden relative animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── DRAWER HEADER ───────────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0c101d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-drawer-title" className="font-bold text-white text-sm sm:text-base">
                  Arefin AI Assistant
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                  GROUNDED
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">
                Verified portfolio intelligence &amp; architectures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClearMessages}
                aria-label="Clear conversation history"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close AI Assistant"
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── CHAT MESSAGES STREAM ────────────────────────────────────────── */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar relative"
        >
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
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2.5 relative group ${
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

                  <div className="flex items-center justify-between text-[9px] font-mono opacity-50 pt-1 border-t border-white/[0.04]">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
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

          {/* Thinking State */}
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
                  Retrieving verified portfolio knowledge...
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

        {/* ─── FLOATING SCROLL-TO-BOTTOM BUTTON ─────────────────────────────── */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="absolute bottom-24 right-6 p-2 rounded-full bg-violet-600 text-white shadow-xl hover:bg-violet-500 transition-all z-20 flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="text-[10px]">Latest</span>
          </button>
        )}

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
              className="flex-1 px-4 py-2.5 bg-[#07090e] border border-white/15 rounded-xl text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all font-sans"
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
              <span>Grounded in verified portfolio records.</span>
            </div>
            <span>{input.length}/400</span>
          </div>
        </div>
      </div>
    </div>
  );
}
