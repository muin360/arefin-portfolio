"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Zap,
  Maximize2,
  Minimize2,
  Download,
  Mic,
  MicOff,
  Calculator,
  Sliders,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
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

const DEFAULT_SUGGESTED_PROMPTS = [
  { label: "🚀 What can Arefin build?", text: "What AI automations and agentic workflows can Arefin build?" },
  { label: "🧠 Show RAG & Vector Systems", text: "Show me Arefin's RAG systems, Pinecone vector search, and knowledge architectures." },
  { label: "⚡ Multi-Agent Workflows", text: "How does Arefin design multi-agent decision loops and tool-calling systems in n8n/Python?" },
  { label: "🛠️ Production Tech Stack", text: "What is Arefin's production tech stack (n8n, LangChain, Claude, Python, Next.js, etc.)?" },
  { label: "📊 Workflow ROI & Pricing", text: "What are typical investment ranges and delivery timelines for AI automation workflows?" },
  { label: "📅 Schedule Scoping Call", text: "How can I hire Arefin or schedule a 30-minute discovery call for my business?" },
];

const INITIAL_MESSAGE: MessageItem = {
  id: "welcome",
  role: "assistant",
  content:
    "### 👋 Welcome to Arefin AI\n\nI am the autonomous **Portfolio Intelligence Agent** for **Arefin Mueen** (AI Automation & AI Agent Developer).\n\n**Core Capabilities:**\n- 🤖 **Multi-Agent Orchestration & Tool Calling** (n8n, LangChain, Python)\n- 📚 **Enterprise RAG Knowledge Engines** (Pinecone, Dense Vector Retrieval)\n- ⚡ **Production Case Studies & Blueprints**\n- 💼 **Project Scoping, Pricing & Discovery Calls**\n\n> [!NOTE]\n> All responses are strictly grounded in Arefin's verified project architecture, live services, and real-world client builds.\n\nHow can I help you today?",
  timestamp: "Live",
};

const ESTIMATOR_DATA = {
  n8n: {
    name: "Event-Driven n8n & Webhook Automation",
    standard: { range: "$500 – $900", time: "1 Week", desc: "Webhook trigger, CRM sync (HubSpot/Airtable), email notifications, error alerts" },
    advanced: { range: "$900 – $1,500", time: "1–2 Weeks", desc: "Multi-branch logic, automated data cleaning, API retries, database write-back" },
    enterprise: { range: "$1,500 – $2,500", time: "2–3 Weeks", desc: "High-throughput failover queues, multi-tenant schemas, custom node integrations" },
  },
  rag: {
    name: "Enterprise Pinecone RAG Knowledge Engine",
    standard: { range: "$1,200 – $1,800", time: "1–2 Weeks", desc: "Document ingestion, chunking pipeline, Pinecone vector embeddings, citation grounding" },
    advanced: { range: "$1,800 – $2,800", time: "2–3 Weeks", desc: "Hybrid dense/lexical search, metadata filtering, reranking models, live data sync" },
    enterprise: { range: "$2,800 – $4,500", time: "3–4 Weeks", desc: "Multi-index sharding, role-based access filtering, continuous re-indexing workers" },
  },
  multi_agent: {
    name: "Autonomous Multi-Agent Decision Swarm",
    standard: { range: "$1,500 – $2,200", time: "2 Weeks", desc: "2-3 specialized agents (Researcher, Writer, Reviewer) with deterministic routing" },
    advanced: { range: "$2,200 – $3,500", time: "2–4 Weeks", desc: "Multi-agent LangGraph / CrewAI swarms with tool-calling loops and human approval gate" },
    enterprise: { range: "$3,500 – $6,000", time: "4–6 Weeks", desc: "Distributed autonomous agents with long-term memory, state persistence, and self-healing" },
  },
  custom: {
    name: "End-to-End Custom AI Application & Assistant",
    standard: { range: "$2,000 – $3,000", time: "2–3 Weeks", desc: "Embedded chatbot widget, custom LLM routing, admin telemetry dashboard" },
    advanced: { range: "$3,000 – $4,500", time: "3–4 Weeks", desc: "Full-stack AI web application (Next.js 16 + FastAPI + MongoDB Atlas), auth & rate limits" },
    enterprise: { range: "$4,500 – $8,000+", time: "4–8 Weeks", desc: "Enterprise SaaS architecture, multi-tenant billing, streaming copilot, custom fine-tuning" },
  },
};

let userMsgSeq = 0;

export default function ArefinAIPanel({ isOpen, onClose }: ArefinAIPanelProps) {
  const pathname = usePathname() || "/";
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        let currentSession = sessionStorage.getItem("arefin_ai_session_id");
        if (!currentSession) {
          currentSession = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          sessionStorage.setItem("arefin_ai_session_id", currentSession);
        }
        return currentSession;
      } catch {
        return `session_${Date.now()}`;
      }
    }
    return "";
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEstimator, setShowEstimator] = useState(false);

  // Estimator Form State
  const [estWorkflow, setEstWorkflow] = useState<"n8n" | "rag" | "multi_agent" | "custom">("multi_agent");
  const [estComplexity, setEstComplexity] = useState<"standard" | "advanced" | "enterprise">("advanced");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Dynamic Route-Aware Contextual Prompts
  const getContextualPrompts = useCallback(() => {
    if (pathname.startsWith("/projects")) {
      return [
        { label: "🚀 Case Study Breakdown", text: "Explain the architecture, pipeline stages, and tradeoffs of this project." },
        { label: "⚡ Tool-Calling & Webhooks", text: "What tool-calling loops, webhooks, and APIs were integrated into this build?" },
        { label: "📊 Estimate Similar Build", text: "How much would a similar automation system cost and how long would it take?" },
        { label: "📅 Schedule Discovery Call", text: "How can I book a 30-minute scoping call with Arefin?" },
      ];
    }
    if (pathname.startsWith("/services")) {
      return [
        { label: "🛠️ Compare Services", text: "Compare n8n workflow automations vs custom multi-agent swarms." },
        { label: "📚 RAG Architecture", text: "How does Arefin build enterprise RAG knowledge bases with Pinecone?" },
        { label: "📊 Investment Guidelines", text: "What are typical project investment ranges and milestone timelines?" },
        { label: "📅 Book Discovery Call", text: "How can I schedule a 30-minute consultation for my business?" },
      ];
    }
    if (pathname.startsWith("/skills")) {
      return [
        { label: "🧠 Tech Stack Matrix", text: "What is Arefin's production tech stack across AI models, n8n, and backend?" },
        { label: "🤖 Model Selection Strategy", text: "When does Arefin recommend Claude 3.7 Sonnet vs GPT-4o vs Gemini 2.0?" },
        { label: "💾 Pinecone vs MongoDB", text: "How does Arefin choose between Pinecone Vector DB and MongoDB Atlas?" },
        { label: "📅 Schedule Scoping Call", text: "How can I hire Arefin for an AI engineering project?" },
      ];
    }
    return DEFAULT_SUGGESTED_PROMPTS;
  }, [pathname]);

  // Web Speech API Voice Dictation
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

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll and track open event
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

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTranscript = () => {
    const transcript = messages
      .map(
        (m) =>
          `[${m.role === "user" ? "VISITOR" : "AREFIN AI"} - ${m.timestamp}]\n${m.content}\n${
            m.citations && m.citations.length > 0
              ? "CITATIONS: " + m.citations.map((c) => c.title + " (" + c.url + ")").join(", ") + "\n"
              : ""
          }`,
      )
      .join("\n" + "-".repeat(60) + "\n\n");

    const header = `# AREFIN AI - PORTFOLIO & WORKFLOW CONSULTATION TRANSCRIPT\nDate: ${new Date().toLocaleString()}\nSession: ${sessionId}\nRoute: ${pathname}\n\n${"=".repeat(70)}\n\n`;
    const blob = new Blob([header + transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arefin-ai-consultation-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearSession = () => {
    const newSession = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    setSessionId(newSession);
    try {
      sessionStorage.setItem("arefin_ai_session_id", newSession);
    } catch {}
    setMessages([INITIAL_MESSAGE]);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  const handleCitationClick = (citation: Citation) => {
    trackAIProjectClick(citation.title);
    onClose();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    trackAIPrompt(query);
    setInput("");
    setError(null);

    userMsgSeq += 1;
    const userMessage: MessageItem = {
      id: `u_${userMsgSeq}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok && res.status !== 200) {
        throw new Error(data.error || "Failed to process query.");
      }

      userMsgSeq += 1;
      const botMessage: MessageItem = {
        id: `bot_${userMsgSeq}`,
        role: "assistant",
        content: data.reply || "I apologize, but I could not generate a response. Please try again.",
        citations: data.citations || [],
        provider: data.provider,
        model: data.model,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Error connecting to AI service";
      setError(errorText);
      userMsgSeq += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${userMsgSeq}`,
          role: "assistant",
          content: `> [!WARNING]\n> **Connection Notice:** ${errorText}\n\nYou can reach Arefin directly at [Schedule 30-Min Discovery Call](/book) or send an inquiry via the [Contact Form](/contact).`,
          citations: [
            { title: "Schedule Discovery Call", url: "/book", type: "service" },
            { title: "Contact Form", url: "/contact", type: "contact" },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyEstimatorSpecs = () => {
    setShowEstimator(false);
    const selectedWorkflow = ESTIMATOR_DATA[estWorkflow];
    const selectedTier = selectedWorkflow[estComplexity];

    const promptText = `I would like to scope a project: ${selectedWorkflow.name} with ${estComplexity.toUpperCase()} complexity (Estimated Investment: ${selectedTier.range}, Timeline: ${selectedTier.time}). What are the recommended architecture milestones and how soon can we begin?`;
    handleSendMessage(promptText);
  };

  const currentEstTier = ESTIMATOR_DATA[estWorkflow][estComplexity];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arefin-ai-title"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`h-full bg-[#070912]/95 border-l border-violet-500/30 shadow-[0_0_90px_rgba(139,92,246,0.25)] flex flex-col justify-between overflow-hidden relative z-10 backdrop-blur-2xl transition-all duration-300 animate-slide-left ${
          isExpanded ? "w-full max-w-5xl" : "w-full max-w-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-violet-600/20 via-indigo-600/5 to-transparent pointer-events-none" />

        {/* ─── DRAWER HEADER ───────────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#090d1a]/95 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 border border-violet-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070912]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 id="arefin-ai-title" className="font-bold text-white text-base tracking-tight">
                  Arefin AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[9px] font-mono font-bold tracking-wider">
                  AUTONOMOUS AGENT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic Grounding &bull; Zero Hallucination</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowEstimator((prev) => !prev)}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono font-semibold focus:ring-2 focus:ring-amber-500/40 focus:outline-none ${
                showEstimator
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-white/[0.04] text-slate-300 hover:text-white border-white/10 hover:border-violet-500/40"
              }`}
              title="Project Scope & Cost Estimator"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Scope Estimator</span>
            </button>

            <button
              type="button"
              onClick={handleExportTranscript}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all focus:ring-2 focus:ring-violet-500/40 focus:outline-none"
              title="Download Consultation Transcript (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all hidden sm:flex items-center justify-center focus:ring-2 focus:ring-violet-500/40 focus:outline-none"
              title={isExpanded ? "Collapse View" : "Expand Workstation"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClearSession}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all focus:ring-2 focus:ring-rose-500/40 focus:outline-none"
                title="Reset session & new conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all focus:ring-2 focus:ring-violet-500/40 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── RESET CONFIRMATION TOAST ────────────────────────────────────── */}
        {resetToast && (
          <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Session reset successfully. Started fresh consultation thread.</span>
          </div>
        )}

        {/* ─── ROUTE CONTEXT INDICATOR BAR ─────────────────────────────────── */}
        <div className="px-4 py-1.5 bg-[#060812] border-b border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-violet-400" />
            <span>Active Context:</span>
            <span className="text-violet-300 font-bold">{pathname}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Grounding Active</span>
          </div>
        </div>

        {/* ─── SCOPING CALCULATOR DRAWER ───────────────────────────────────── */}
        {showEstimator && (
          <div className="p-4 sm:p-5 bg-[#0a0e1c] border-b border-violet-500/30 text-white animate-fade-in space-y-3.5 shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm font-mono flex items-center gap-2 text-violet-300">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Instant AI Architecture & ROI Estimator</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowEstimator(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  1. Workflow Architecture:
                </label>
                <select
                  value={estWorkflow}
                  onChange={(e) => setEstWorkflow(e.target.value as typeof estWorkflow)}
                  className="w-full px-3 py-2 bg-[#04060d] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                >
                  <option value="multi_agent">Autonomous Multi-Agent Swarm (n8n / Python)</option>
                  <option value="rag">Enterprise Pinecone RAG Knowledge Engine</option>
                  <option value="n8n">Event-Driven n8n & Webhook CRM Sync</option>
                  <option value="custom">Custom AI Assistant & Web Application</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  2. Project Complexity & Scope:
                </label>
                <select
                  value={estComplexity}
                  onChange={(e) => setEstComplexity(e.target.value as typeof estComplexity)}
                  className="w-full px-3 py-2 bg-[#04060d] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                >
                  <option value="standard">Standard Architecture (1-2 Weeks)</option>
                  <option value="advanced">Advanced Multi-System (2-4 Weeks)</option>
                  <option value="enterprise">Enterprise Distributed (4+ Weeks)</option>
                </select>
              </div>
            </div>

            {/* Calculated Pricing & Milestone Preview Card */}
            <div className="p-3 rounded-xl bg-[#04060e] border border-violet-500/30 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Investment: {currentEstTier.range}</span>
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Timeline: {currentEstTier.time}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  {currentEstTier.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyEstimatorSpecs}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-md shadow-amber-950 active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Ask AI to Scope</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ─── CONVERSATION STREAM ─────────────────────────────────────────── */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar relative z-10"
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-in group ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-violet-950">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 space-y-3 shadow-xl transition-all ${
                    isUser
                      ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-tr-sm shadow-violet-950/40"
                      : "bg-[#0b0f1e]/90 border border-white/[0.08] hover:border-violet-500/30 text-slate-200 rounded-tl-sm shadow-black/40 backdrop-blur-xl"
                  }`}
                >
                  {/* Message Content */}
                  <div className="text-xs sm:text-[13.5px] leading-relaxed">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <FormattedAIOutput content={msg.content} onLinkClick={onClose} />
                    )}
                  </div>

                  {/* Citations Badges */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
                      <span className="text-[10px] font-mono text-violet-300 font-bold uppercase tracking-wider block">
                        Verified Sources & Blueprints:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((c, cIdx) => (
                          <Link
                            key={cIdx}
                            href={c.url}
                            onClick={() => handleCitationClick(c)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#05070e] hover:bg-violet-900/40 border border-violet-500/20 hover:border-violet-400/50 text-slate-300 hover:text-white text-[11px] font-mono transition-all group/cit shadow-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 group-hover/cit:bg-cyan-400 transition-colors" />
                            <span className="font-medium">{c.title}</span>
                            <ChevronRight className="w-3 h-3 opacity-60 group-hover/cit:translate-x-0.5 transition-transform" />
                          </Link>
                        ))}
                      </div>
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

        {/* ─── INTERACTIVE QUICK PROMPTS (ROUTE AWARE) ─────────────────────── */}
        {messages.length <= 2 && (
          <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#070a12] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Suggested:
            </span>
            {getContextualPrompts().map((item, idx) => (
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
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : pathname.startsWith("/projects")
                    ? "Ask about this project's architecture, tools, or hire Arefin..."
                    : "Ask about Arefin's agent workflows, RAG, n8n, or hire..."
                }
                maxLength={400}
                disabled={loading}
                className={`w-full pl-4 pr-10 py-3 bg-[#04060d] border rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all font-sans ${
                  isListening
                    ? "border-rose-500 animate-pulse text-rose-300"
                    : "border-white/15 focus:border-violet-500"
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
                title={isListening ? "Stop listening" : "Voice dictation"}
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
