"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Loader2,
  Trash2,
  Lock,
  Layers,
  Database,
  Check,
  Copy,
  Terminal,
  Activity,
  Cpu,
  RefreshCw,
} from "lucide-react";

interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  timestamp: string;
}

const ADMIN_QUICK_ACTIONS = [
  { label: "📊 Summarize Recent Leads", query: "Summarize recent visitor inquiries and client leads." },
  { label: "🔍 Who Asked for Pricing?", query: "Which visitors or clients asked about pricing, budget, or discovery calls?" },
  { label: "🛠️ Tech Stacks in Demand", query: "What tools and technologies (e.g. n8n, LangChain, RAG) are visitors most interested in?" },
  { label: "🟢 System Status & Health", query: "What is the current status of Arefin AI's providers and knowledge base?" },
];

export default function AdminAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "admin_welcome",
      role: "assistant",
      content:
        "### ⚡ Admin Executive Copilot Active\n\nI am your private **Admin AI Copilot** with direct access to **encrypted visitor memories**, **system analytics**, and **portfolio knowledge**.\n\nHow can I assist you today?",
      timestamp: "Live",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (overrideText?: string) => {
    const query = (overrideText ?? input).trim();
    if (!query || loading) return;

    setInput("");
    const userMsg: CopilotMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process query");

      const botMsg: CopilotMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        content: data.reply || "No response generated.",
        provider: data.providerUsed,
        model: data.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error connecting to Admin Copilot";
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: `⚠️ **Copilot Error:** ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ─── HEADER CO-PILOT TRIGGER BUTTON ──────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600/50 hover:to-indigo-600/50 border border-violet-500/40 text-white text-xs font-mono font-semibold transition-all shadow-md shadow-violet-950/40 group active:scale-95"
        title="Open Admin AI Copilot (Ctrl+Shift+A)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
        </span>
        <Bot className="w-4 h-4 text-violet-300 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Copilot</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-black/40 text-violet-300 text-[9px] rounded border border-violet-500/30">
          ⌘⇧A
        </kbd>
      </button>

      {/* ─── FLOATING DRAWER MODAL ────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div
            className="w-full max-w-xl h-full bg-[#07090f]/95 border-l border-violet-500/30 shadow-[0_0_80px_rgba(139,92,246,0.2)] flex flex-col justify-between overflow-hidden relative z-10 backdrop-blur-2xl animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-violet-600/15 via-indigo-600/5 to-transparent pointer-events-none" />

            {/* ─── DRAWER HEADER ───────────────────────────────────────────── */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0a0d18]/90 flex items-center justify-between shrink-0 relative z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
                  <Terminal className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base tracking-tight">
                      Admin Executive Copilot
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
                      ADMIN ROOT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-violet-400" />
                    <span>Access to AES-256 Encrypted Visitor Intelligence</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setMessages([
                        {
                          id: "admin_welcome",
                          role: "assistant",
                          content: "### ⚡ Admin Executive Copilot Active\n\nHow can I assist you?",
                          timestamp: "Live",
                        },
                      ])
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                    title="Clear Copilot chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ─── QUICK EXECUTIVE ACTIONS BAR ─────────────────────────────── */}
            <div className="px-4 py-2.5 bg-[#080b15] border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
              {ADMIN_QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(action.query)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-[#0f1424] hover:bg-violet-600/25 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* ─── CHAT MESSAGES STREAM ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    } animate-fade-in`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 space-y-2.5 group transition-all ${
                        isUser
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-md font-medium text-xs sm:text-sm"
                          : "bg-[#0b0e1b] border border-white/[0.08] text-slate-200 rounded-tl-sm shadow-xl"
                      }`}
                    >
                      <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.content}
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400/70 pt-1.5 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {msg.provider && (
                            <span className="px-1.5 py-0.2 rounded bg-white/[0.05] text-violet-300 uppercase">
                              {msg.provider}
                            </span>
                          )}
                        </div>

                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="opacity-60 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1"
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
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#0b0e1b] border border-violet-500/30 rounded-2xl rounded-tl-sm p-4 space-y-1.5 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                      <span className="font-mono text-xs text-violet-300 font-semibold">
                        Decrypting memories &amp; synthesizing executive intelligence...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── INPUT COMPOSER ──────────────────────────────────────────── */}
            <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#090d18] shrink-0 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Copilot about leads, visitors, system stats, or draft notes..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[#05070e] border border-white/15 focus:border-violet-500 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all font-sans"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send query"
                  className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shrink-0 shadow-lg shadow-violet-600/30 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Private Administrator Intelligence Engine</span>
                </div>
                <span>AES-256-GCM Decrypted at Runtime</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
