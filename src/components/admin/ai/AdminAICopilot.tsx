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
  Zap,
  ShieldCheck,
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import FormattedAIOutput from "@/components/ai/FormattedAIOutput";

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
  { label: "📊 Summarize Recent Leads", query: "Summarize recent visitor inquiries, contact details, and client leads." },
  { label: "💰 Who Asked for Pricing / Quotes?", query: "Which visitors or clients asked about pricing, budget, or custom automation builds?" },
  { label: "🛠️ Stacks in Demand", query: "What tools and technologies (e.g. n8n, LangChain, RAG, Python) are visitors asking about?" },
  { label: "🔍 Diagnostic Health Check", query: "What is the current health status of Arefin AI, active models, and portfolio knowledge base?" },
];

export default function AdminAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "stats">("chat");
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "admin_welcome",
      role: "assistant",
      content:
        "### ⚡ Admin Executive Copilot Active\n\nI am your private **Executive Business Intelligence & System AI Copilot**.\n\n**Capabilities:**\n- 🔐 **Encrypted Visitor Memory Querying**: Direct access to AES-256-GCM decrypted visitor leads & project inquiries.\n- 📊 **Lead Qualification**: Instant executive summaries of client demands, budgets, and contact info.\n- ⚙️ **System Diagnostics**: Health verification of vector retrieval and multi-provider keys.\n\nHow may I assist you today, Arefin?",
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
        content: data.reply || "No intelligence report generated.",
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
          content: `> [!WARNING]\n> **Admin Copilot Connection Error:** ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ─── HEADER TRIGGER BUTTON ───────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30 hover:from-violet-600/50 hover:to-indigo-600/50 border border-violet-500/40 text-white text-xs font-mono font-semibold transition-all shadow-md shadow-violet-950/50 group active:scale-95"
        title="Open Admin AI Copilot (Ctrl+Shift+A)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
        </span>
        <Bot className="w-4 h-4 text-violet-300 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Copilot</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 bg-black/50 text-violet-300 text-[9px] rounded border border-violet-500/30 font-mono">
          ⌘⇧A
        </kbd>
      </button>

      {/* ─── COPILOT FLOATING DRAWER ─────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div
            className="w-full max-w-2xl h-full bg-[#070912]/95 border-l border-violet-500/30 shadow-[0_0_90px_rgba(139,92,246,0.25)] flex flex-col justify-between overflow-hidden relative z-10 backdrop-blur-2xl animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Radial Lighting */}
            <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-violet-600/20 via-indigo-600/5 to-transparent pointer-events-none" />

            {/* ─── DRAWER HEADER ───────────────────────────────────────────── */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#090d1a]/95 flex items-center justify-between shrink-0 relative z-20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 border border-violet-400/30">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070912]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base tracking-tight">
                      Admin Executive Copilot
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold tracking-wider">
                      ROOT ISOLATED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <Lock className="w-3 h-3 text-violet-400" />
                    <span>AES-256-GCM Decrypted Runtime Intelligence</span>
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
            <div className="px-4 py-2.5 bg-[#080b16] border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
              {ADMIN_QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(action.query)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1324] hover:bg-violet-600/30 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
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
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-1 shadow-md">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-4 sm:p-5 space-y-3 group transition-all ${
                        isUser
                          ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-tr-sm shadow-xl shadow-violet-950/40 font-medium text-xs sm:text-sm border-t border-white/20"
                          : "bg-[#0b0e1d]/95 border border-white/[0.08] text-slate-200 rounded-tl-sm shadow-2xl hover:border-violet-500/30"
                      }`}
                    >
                      {isUser ? (
                        <div className="text-xs sm:text-[13.5px] leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>
                      ) : (
                        <FormattedAIOutput content={msg.content} />
                      )}

                      <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400/80 pt-2 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {msg.provider && (
                            <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase font-bold text-[9px] border border-violet-500/30">
                              {msg.provider}
                            </span>
                          )}
                          {msg.model && (
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300 text-[9px]">
                              {msg.model}
                            </span>
                          )}
                        </div>

                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="opacity-70 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/[0.06]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Report</span>
                              </>
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
                  <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#0b0e1d]/95 border border-violet-500/40 rounded-2xl rounded-tl-sm p-4 space-y-2 shadow-2xl">
                    <div className="flex items-center gap-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                      <span className="font-mono text-xs text-violet-300 font-bold">
                        Synthesizing executive leads &amp; decrypted memory...
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 pl-6">
                      Querying AES-256 encrypted session vaults &bull; Zero external leakage
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── INPUT COMPOSER DOCK ─────────────────────────────────────── */}
            <div className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-[#080c18] shrink-0 space-y-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Copilot: e.g. Who requested custom workflow pricing this week?"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#04060d] border border-white/15 focus:border-violet-500 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send query"
                  className="p-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shrink-0 shadow-lg shadow-violet-600/40 active:scale-95 border-t border-white/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Private Executive Copilot</span>
                </div>
                <span>AES-256-GCM Zero-Leakage Architecture</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
