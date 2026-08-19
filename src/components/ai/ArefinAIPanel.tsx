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
  Sparkles,
  ExternalLink,
  Calendar,
  Layers,
  Mail,
  Zap,
  Code2,
  Maximize2,
  Minimize2,
  Terminal,
  Activity,
} from "lucide-react";
import type { Citation } from "@/lib/ai/retrieval";
import { trackAIOpen, trackAIPrompt, trackAIProjectClick } from "@/lib/track-event";
import FormattedAIOutput from "./FormattedAIOutput";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  provider?: string;
  model?: string;
  timestamp: string;
}

interface ArefinAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  { label: "🚀 What can Arefin build?", text: "What AI automations and agentic workflows can Arefin build?" },
  { label: "🧠 Show RAG & Vector Systems", text: "Show me Arefin's RAG systems, Pinecone vector search, and knowledge architectures." },
  { label: "⚡ Multi-Agent Workflows", text: "How does Arefin design multi-agent decision loops and tool-calling systems in n8n/Python?" },
  { label: "🛠️ Production Tech Stack", text: "What is Arefin's production tech stack (n8n, LangChain, Claude, Python, Next.js, etc.)?" },
  { label: "📅 Schedule Scoping Call", text: "How can I hire Arefin or schedule a 30-minute discovery call for my business?" },
];

const INITIAL_MESSAGE: MessageItem = {
  id: "welcome",
  role: "assistant",
  content:
    "### 👋 Welcome to Arefin AI\n\nI am the autonomous **Portfolio Intelligence Agent** for **Arefin Mueen** (AI Automation & AI Agent Developer).\n\n**Core Capabilities:**\n- 🤖 **Multi-Agent Orchestration & Tool Calling** (n8n, LangChain, Python)\n- 📚 **Enterprise RAG Knowledge Engines** (Pinecone, Dense Vector Retrieval)\n- ⚡ **Production Case Studies & Blueprints**\n- 💼 **Project Scoping, Pricing & Discovery Calls**\n\n> [!NOTE]\n> All responses are strictly grounded in Arefin's verified project architecture, live services, and real-world client builds.\n\nHow can I help you today?",
  timestamp: "Live",
};

export default function ArefinAIPanel({ isOpen, onClose }: ArefinAIPanelProps) {
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize unique session ID
  useEffect(() => {
    try {
      let currentSession = sessionStorage.getItem("arefin_ai_session_id");
      if (!currentSession) {
        currentSession = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem("arefin_ai_session_id", currentSession);
      }
      setSessionId(currentSession);
    } catch {
      setSessionId(`session_${Date.now()}`);
    }
  }, []);

  // Focus input and lock background scroll
  useEffect(() => {
    if (isOpen) {
      trackAIOpen();
      setTimeout(() => inputRef.current?.focus(), 200);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isFarFromBottom);
  }, []);

  // Auto-scroll on new messages or loading
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, scrollToBottom]);

  // Keyboard shortcut Esc to close
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
    setMessages([INITIAL_MESSAGE]);
    setError(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? input).trim();
    if (!content || loading) return;

    setError(null);
    setInput("");

    const userMsg: MessageItem = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);
    trackAIPrompt(content);

    try {
      const payload = {
        sessionId: sessionId || `session_${Date.now()}`,
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
        provider: data.provider,
        model: data.model,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network connection issue. Please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (c: Citation) => {
    trackAIProjectClick(c.url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-drawer-title"
    >
      {/* Background click backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container with dynamic expansion */}
      <div
        className={`h-full bg-[#060811]/95 border-l border-violet-500/30 shadow-[0_0_90px_rgba(139,92,246,0.25)] flex flex-col justify-between overflow-hidden relative z-10 animate-slide-left backdrop-blur-2xl transition-all duration-300 ${
          isExpanded ? "w-full max-w-4xl" : "w-full max-w-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Radial Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-600/15 via-indigo-600/5 to-transparent pointer-events-none" />

        {/* ─── DRAWER HEADER ───────────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#080c1a]/95 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 border border-violet-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#080c1a] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-drawer-title" className="font-bold text-white text-base tracking-tight">
                  Arefin AI Agent
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 text-[9px] font-mono text-violet-300 font-bold tracking-wider">
                  1000X ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Architecture &bull; RAG Grounded</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Expand / Minimize Drawer Width */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all hidden sm:flex items-center justify-center"
              title={isExpanded ? "Collapse width" : "Expand to wide workstation"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClearMessages}
                title="Clear conversation"
                aria-label="Clear conversation history"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Close drawer (Esc)"
              aria-label="Close AI Assistant"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── QUICK SHORTCUT TOOLBAR ──────────────────────────────────────── */}
        <div className="px-4 py-2.5 bg-[#080a14] border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto custom-scrollbar text-[11px] font-mono shrink-0">
          <Link
            href="/book"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/35 text-violet-300 hover:text-white border border-violet-500/30 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
            <span>Book 30-Min Discovery Call</span>
          </Link>
          <Link
            href="/projects"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>View 10+ Production Projects</span>
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Inquiry Form</span>
          </Link>
        </div>

        {/* ─── CHAT MESSAGES STREAM ────────────────────────────────────────── */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar relative"
        >
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
                  className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-4 sm:p-5 space-y-3 relative group transition-all ${
                    isUser
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-tr-sm shadow-xl shadow-violet-950/40 font-medium text-xs sm:text-sm border-t border-white/20"
                      : "bg-[#0b0e1d]/95 border border-white/[0.08] text-slate-200 rounded-tl-sm shadow-2xl hover:border-violet-500/30"
                  }`}
                >
                  {/* Message Content */}
                  <div>
                    {isUser ? (
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    ) : (
                      <FormattedAIOutput content={msg.content} onLinkClick={onClose} />
                    )}
                  </div>

                  {/* Dynamic Clickable Citation Badges */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
                      <span className="text-[10px] font-mono text-slate-400 w-full mb-0.5 font-bold uppercase tracking-wider">
                        Verified Portfolio References:
                      </span>
                      {msg.citations.map((c, i) => (
                        <Link
                          key={i}
                          href={c.url}
                          onClick={() => handleCitationClick(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/50 hover:bg-violet-900/60 border border-violet-500/40 hover:border-violet-300 text-violet-300 hover:text-white font-mono text-[11px] font-semibold transition-all group/cit shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400 group-hover/cit:scale-110 transition-transform" />
                          <span>{c.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Metadata Footer */}
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
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="opacity-70 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/[0.06]"
                        title="Copy full answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-violet-950 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-1 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking / Agent Processing State */}
          {loading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#0b0e1d]/95 border border-violet-500/40 rounded-2xl rounded-tl-sm p-4 space-y-2 max-w-[85%] shadow-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce" />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="font-mono text-xs text-violet-300 font-bold ml-1">
                    Agent Synthesizing Knowledge...
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 pl-6">
                  Querying verified blueprints, multi-agent frameworks, and live portfolio context.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-mono text-[11px] font-semibold transition-colors shrink-0 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
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
            className="absolute bottom-28 right-6 p-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-2xl transition-all z-20 flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="text-[10px] font-bold">Latest</span>
          </button>
        )}

        {/* ─── INTERACTIVE QUICK PROMPTS ───────────────────────────────────── */}
        {messages.length <= 2 && (
          <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#070a12] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Suggested:
            </span>
            {SUGGESTED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.text)}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-[#0e1322] hover:bg-violet-600/30 hover:text-white border border-white/10 hover:border-violet-500/40 text-slate-300 text-xs whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm active:scale-95 font-medium"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ─── INPUT COMPOSER ──────────────────────────────────────────────── */}
        <div className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-[#090d1a] shrink-0 space-y-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Arefin's agent workflows, RAG, n8n, or hire..."
                maxLength={400}
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
              <span>Grounded in live MongoDB portfolio records.</span>
            </div>
            <span>{input.length}/400</span>
          </div>
        </div>
      </div>
    </div>
  );
}
