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
  Download,
  FileText,
  Flame,
  Search,
  Filter,
  Mail,
  Phone,
  Mic,
  MicOff,
  Sliders,
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

interface LeadSession {
  id: string;
  sessionId: string;
  lastActiveAt: string;
  extractedLead?: {
    hasContactInfo: boolean;
    name?: string;
    email?: string;
    phone?: string;
    intent: string;
    extractedTech: string[];
    summarySnippet: string;
    leadScore: number;
    leadTier: "HOT" | "WARM" | "EXPLORING";
  };
}

const ADMIN_QUICK_ACTIONS = [
  { label: "🔥 Hot Leads & Quotes", query: "Who are the highest-intent visitors requesting quotes or custom automation builds?" },
  { label: "📊 Inquiries Summary", query: "Summarize recent visitor inquiries, contact details, and client leads." },
  { label: "🛠️ Stacks in Demand", query: "What tools and technologies (e.g. n8n, LangChain, RAG, Python) are visitors asking about?" },
  { label: "🔍 Diagnostic Health Check", query: "What is the current health status of Arefin AI, active models, and portfolio knowledge base?" },
];

export default function AdminAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "leads" | "generator" | "telemetry">("chat");
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "admin_welcome",
      role: "assistant",
      content:
        "### ⚡ Admin Executive Copilot Active\n\nI am your private **Executive Business Intelligence & Copilot Engine**.\n\n**Executive Capabilities:**\n- 🔐 **AES-256-GCM Memory Telemetry**: Direct querying of live visitor leads, quotes & workflow inquiries.\n- 🔥 **Hot Prospect CRM**: Instant identification of Hot, Warm, and High-Budget clients.\n- ✍️ **Autonomous Content Drafter**: 1-click drafting of case studies, client proposals, and SEO metadata.\n- 🩺 **Live Telemetry & Diagnostics**: Real-time MongoDB Atlas and AI cluster health.\n\nHow can I assist your operations today, Arefin?",
      timestamp: "Live",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Leads & Stats State
  const [leads, setLeads] = useState<LeadSession[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadFilter, setLeadFilter] = useState<"ALL" | "HOT" | "WARM">("ALL");
  const [leadSearch, setLeadSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Voice Dictation
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

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
      loadLeads();
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

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/admin/ai/memory?limit=50");
      const data = await res.json();
      if (data.success && Array.isArray(data.memories)) {
        setLeads(data.memories);
      }
    } catch {
      // Non-blocking
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportMarkdown = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/ai/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export_markdown" }),
      });
      const data = await res.json();
      if (data.markdown) {
        const blob = new Blob([data.markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `arefin-lead-intelligence-${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("Failed to export intelligence report");
    } finally {
      setExporting(false);
    }
  };

  const handleSend = async (overrideText?: string, actionType = "query") => {
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
        body: JSON.stringify({ query, action: actionType }),
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

  const filteredLeads = leads.filter((l) => {
    if (leadFilter === "HOT" && l.extractedLead?.leadTier !== "HOT") return false;
    if (leadFilter === "WARM" && l.extractedLead?.leadTier !== "WARM") return false;
    if (leadSearch.trim()) {
      const s = leadSearch.toLowerCase();
      const text = `${l.extractedLead?.email || ""} ${l.extractedLead?.name || ""} ${l.extractedLead?.intent || ""} ${l.extractedLead?.extractedTech?.join(" ") || ""} ${l.extractedLead?.summarySnippet || ""}`.toLowerCase();
      return text.includes(s);
    }
    return true;
  });

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
            {/* Ambient Lighting */}
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
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  disabled={exporting}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all flex items-center gap-1 text-xs font-mono"
                  title="Export Intelligence Report (.md)"
                >
                  <Download className="w-4 h-4" />
                </button>

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

            {/* ─── WORKSTATION NAVIGATION TABS ─────────────────────────────── */}
            <div className="px-4 py-2 bg-[#080b15] border-b border-white/[0.06] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                {[
                  { id: "chat", label: "Executive Chat", icon: MessageSquare },
                  { id: "leads", label: `Leads Matrix (${leads.length})`, icon: Users },
                  { id: "generator", label: "Content Drafter", icon: FileText },
                  { id: "telemetry", label: "Telemetry & Health", icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-violet-600 text-white shadow-md shadow-violet-950"
                          : "bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── TAB 1: EXECUTIVE CHAT ───────────────────────────────────── */}
            {activeTab === "chat" && (
              <>
                {/* Quick Executive Actions */}
                <div className="px-4 py-2 bg-[#080b16] border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
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

                {/* Chat Stream */}
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
                                    <span className="text-emerald-400 font-semibold">Copied</span>
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
                            Synthesizing executive intelligence...
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 pl-6">
                          Decrypted AES-256 session vaults &bull; Zero external leakage
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Composer */}
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
                        placeholder={isListening ? "Listening to voice..." : "Ask Copilot: e.g. Who requested custom workflow pricing this week?"}
                        disabled={loading}
                        className={`w-full pl-4 pr-10 py-3 bg-[#04060d] border rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all font-sans ${
                          isListening ? "border-rose-500 animate-pulse text-rose-300" : "border-white/15 focus:border-violet-500"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                          isListening
                            ? "bg-rose-500 text-white animate-bounce"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.08]"
                        }`}
                        title={isListening ? "Stop listening" : "Voice input"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
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
                </div>
              </>
            )}

            {/* ─── TAB 2: LEADS MATRIX ─────────────────────────────────────── */}
            {activeTab === "leads" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {(["ALL", "HOT", "WARM"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setLeadFilter(tier)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          leadFilter === tier
                            ? "bg-violet-600 text-white"
                            : "bg-white/[0.04] text-slate-400 hover:text-white"
                        }`}
                      >
                        {tier === "HOT" ? "🔥 Hot Leads" : tier === "WARM" ? "⚡ Warm Leads" : "All Leads"}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 sm:max-w-xs">
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search leads, email, tech..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#04060d] border border-white/15 focus:border-violet-500 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {leadsLoading ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span>Loading decrypted leads matrix...</span>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    No leads matching filter recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLeads.map((item, idx) => {
                      const lead = item.extractedLead;
                      const isHot = lead?.leadTier === "HOT";
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border transition-all ${
                            isHot
                              ? "bg-violet-950/20 border-violet-500/40 shadow-lg shadow-violet-950/30"
                              : "bg-[#0b0e1a] border-white/[0.08]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/[0.06]">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                                    isHot
                                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  }`}
                                >
                                  {isHot ? "🔥 HOT PROSPECT" : "⚡ WARM PROSPECT"}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  Score: {lead?.leadScore || 10}/100
                                </span>
                              </div>
                              <div className="text-xs font-bold text-white mt-1">
                                {lead?.name ? `${lead.name} • ` : ""}
                                {lead?.email || lead?.phone || "Visitor Inquiry"}
                              </div>
                            </div>

                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(item.lastActiveAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="pt-2 text-xs text-slate-300 space-y-1">
                            <div>
                              <span className="text-slate-500 font-mono text-[10px]">Intent: </span>
                              <span className="font-semibold text-violet-300">{lead?.intent}</span>
                            </div>
                            {lead?.extractedTech && lead.extractedTech.length > 0 && (
                              <div>
                                <span className="text-slate-500 font-mono text-[10px]">Tech: </span>
                                <span>{lead.extractedTech.join(", ")}</span>
                              </div>
                            )}
                            <div className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2 rounded-lg border border-white/[0.04] mt-1">
                              &ldquo;{lead?.summarySnippet}&rdquo;
                            </div>
                          </div>

                          {/* Direct Contact Actions */}
                          {(lead?.email || lead?.phone) && (
                            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center gap-2">
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}?subject=Follow-up:%20AI%20Automation%20Inquiry%20with%20Arefin%20Mueen`}
                                  className="px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                                >
                                  <Mail className="w-3 h-3 text-emerald-400" />
                                  <span>Email Lead</span>
                                </a>
                              )}
                              {lead.phone && (
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 3: CONTENT DRAFTER ──────────────────────────────────── */}
            {activeTab === "generator" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
                <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Autonomous Executive Content Drafter</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a template to generate production case studies, client proposals, or SEO metadata.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      title: "🚀 Draft Portfolio Case Study",
                      action: "draft_case_study",
                      prompt: "Draft a technical case study for an Enterprise Multi-Agent Automation system using n8n and LangChain.",
                    },
                    {
                      title: "💼 Draft Client SOW / Proposal",
                      action: "draft_proposal",
                      prompt: "Draft a client proposal for building a custom Pinecone RAG Knowledge Engine and AI support agent.",
                    },
                    {
                      title: "🌐 Draft SEO Schema & Metadata",
                      action: "draft_seo",
                      prompt: "Generate high-ranking JSON-LD schema, meta title, and meta description for AI Automation Services.",
                    },
                    {
                      title: "📢 Draft Technical Announcement",
                      action: "draft_proposal",
                      prompt: "Draft a high-impact technical announcement for LinkedIn showcasing our new autonomous agent architecture.",
                    },
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveTab("chat");
                        handleSend(tpl.prompt, tpl.action);
                      }}
                      className="p-4 rounded-xl bg-[#0b0e1d] hover:bg-violet-950/40 border border-white/10 hover:border-violet-500/40 text-left transition-all group"
                    >
                      <div className="font-bold text-white text-xs group-hover:text-violet-300 transition-colors">
                        {tpl.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {tpl.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB 4: TELEMETRY & HEALTH ───────────────────────────────── */}
            {activeTab === "telemetry" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
                <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Diagnostic Health & Telemetry</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct diagnostics across MongoDB cluster, AI Providers, and encrypted session vaults.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#0b0e1d] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">Database Cluster</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        ONLINE
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">MongoDB Atlas</div>
                    <div className="text-[11px] text-slate-400">AES-256-GCM encrypted session vaults active.</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b0e1d] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">Failover Engine</span>
                      <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-mono font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">Multi-Provider Cascade</div>
                    <div className="text-[11px] text-slate-400">Automatic fallback to local grounded engine on 429/limits.</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend("What is the current health status of Arefin AI, active models, and portfolio knowledge base?");
                  }}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-md shadow-violet-950 flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Run Comprehensive Live Health Diagnostic</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
