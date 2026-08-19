"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Bot,
  Brain,
  Cpu,
  Key,
  Database,
  ShieldAlert,
  Play,
  Activity,
  History,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Save,
  Send,
  Loader2,
  Plus,
  Trash2,
  Lock,
  Flame,
  ArrowRight,
  X,
} from "lucide-react";
import type {
  AIConfig,
  AIProviderCredential,
  AIConfigVersion,
  AIUsageMetric,
  AIAuditLog,
  AIProviderName,
} from "@/lib/db/types";
import { ALLOWED_MODELS } from "@/lib/ai/defaults";

interface AIControlCenterProps {
  initialActiveConfig: AIConfig;
  initialDraftConfig: AIConfig;
  initialCredentials: Partial<AIProviderCredential>[];
  initialVersions: AIConfigVersion[];
  docCounts: {
    projects: number;
    services: number;
    posts: number;
    skills: number;
    about: number;
  };
  initialStats: {
    totalRequests: number;
    successCount: number;
    errorCount: number;
    avgLatencyMs: number;
    providerBreakdown: Record<string, number>;
    requestsToday: number;
  };
  initialLogs: AIUsageMetric[];
  initialAuditLogs: AIAuditLog[];
}

type TabType =
  | "overview"
  | "brain"
  | "model"
  | "providers"
  | "knowledge"
  | "safety"
  | "playground"
  | "memory"
  | "usage"
  | "versions";

export default function AIControlCenter({
  initialActiveConfig,
  initialDraftConfig,
  initialCredentials,
  initialVersions,
  docCounts,
  initialStats,
  initialLogs,
  initialAuditLogs,
}: AIControlCenterProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [activeConfig, setActiveConfig] = useState<AIConfig>(initialActiveConfig);
  const [draftConfig, setDraftConfig] = useState<AIConfig>(initialDraftConfig);
  const [credentials, setCredentials] = useState<Partial<AIProviderCredential>[]>(initialCredentials);
  const [versions, setVersions] = useState<AIConfigVersion[]>(initialVersions);
  const [stats] = useState(initialStats);
  const [logs, setLogs] = useState<AIUsageMetric[]>(initialLogs);
  const [auditLogs, setAuditLogs] = useState<AIAuditLog[]>(initialAuditLogs);

  // Form states
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Key rotation modal / inputs
  const [selectedProviderKey, setSelectedProviderKey] = useState<"openai" | "anthropic" | "google" | null>(null);
  const [newSecretInput, setNewSecretInput] = useState("");
  const [newBaseUrlInput, setNewBaseUrlInput] = useState("");
  const [newOrgIdInput, setNewOrgIdInput] = useState("");
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; latencyMs?: number } | null>(null);

  // Playground state
  const [playgroundPrompt, setPlaygroundPrompt] = useState("What can Arefin build?");
  const [playgroundTarget, setPlaygroundTarget] = useState<"active" | "draft">("draft");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundResponse, setPlaygroundResponse] = useState<{
    reply: string;
    citations: Array<{ title: string; url: string; type: string }>;
    providerUsed: string;
    modelUsed: string;
    latencyMs?: number;
    tokens?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
  } | null>(null);

  // Version rollback confirmation
  const [selectedVersionToRestore, setSelectedVersionToRestore] = useState<AIConfigVersion | null>(null);
  const [snapshotViewVersion, setSnapshotViewVersion] = useState<AIConfigVersion | null>(null);

  // Client Leads & Memory State
  const [memories, setMemories] = useState<Array<{
    id: string;
    sessionId: string;
    messages: Array<{ role: string; content: string }>;
    extractedLead?: {
      hasContactInfo: boolean;
      name?: string;
      email?: string;
      phone?: string;
      intent: string;
      extractedTech: string[];
      summarySnippet: string;
    };
    lastActiveAt: string;
    createdAt: string;
  }>>([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [adminMemoryQuery, setAdminMemoryQuery] = useState("Summarize recent visitor inquiries and client leads.");
  const [adminMemoryQueryLoading, setAdminMemoryQueryLoading] = useState(false);
  const [adminMemoryAnswer, setAdminMemoryAnswer] = useState<string | null>(null);
  const [selectedSessionView, setSelectedSessionView] = useState<{
    sessionId: string;
    messages: Array<{ role: string; content: string }>;
    lastActiveAt: string;
  } | null>(null);

  const loadMemories = async () => {
    setMemoryLoading(true);
    try {
      const res = await fetch("/api/admin/ai/memory");
      const data = await res.json();
      if (res.ok) {
        setMemories(data.memories || []);
      }
    } catch {
      // Non-blocking
    } finally {
      setMemoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "memory") {
      loadMemories();
    }
  }, [activeTab]);

  const handleQueryMemoryIntelligence = async () => {
    if (!adminMemoryQuery.trim() || adminMemoryQueryLoading) return;
    setAdminMemoryQueryLoading(true);
    setAdminMemoryAnswer(null);
    try {
      const res = await fetch("/api/admin/ai/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: adminMemoryQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to query intelligence");
      setAdminMemoryAnswer(data.reply);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error querying memory");
    } finally {
      setAdminMemoryQueryLoading(false);
    }
  };

  // Reset status messages after 4s
  useEffect(() => {
    if (saveStatus || errorMessage) {
      const timer = setTimeout(() => {
        setSaveStatus(null);
        setErrorMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, errorMessage]);

  // Has draft diverged from active?
  const hasDraftChanges =
    JSON.stringify(draftConfig.brain) !== JSON.stringify(activeConfig.brain) ||
    JSON.stringify(draftConfig.model) !== JSON.stringify(activeConfig.model) ||
    JSON.stringify(draftConfig.knowledge) !== JSON.stringify(activeConfig.knowledge) ||
    JSON.stringify(draftConfig.safety) !== JSON.stringify(activeConfig.safety) ||
    JSON.stringify(draftConfig.limits) !== JSON.stringify(activeConfig.limits);

  // ─── ACTION HANDLERS ──────────────────────────────────────────────────────

  const handleSaveDraft = async () => {
    startTransition(async () => {
      setErrorMessage(null);
      try {
        const res = await fetch("/api/admin/ai/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftConfig),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to save draft");
        }
        setDraftConfig(data.draftConfig);
        setSaveStatus("Draft configuration saved successfully.");
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Error saving draft");
      }
    });
  };

  const handleActivateConfig = async () => {
    startTransition(async () => {
      setErrorMessage(null);
      try {
        // Save draft first to be 100% in sync
        const saveRes = await fetch("/api/admin/ai/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftConfig),
        });
        const saveData = await saveRes.json();
        if (!saveRes.ok || !saveData.success) {
          throw new Error(saveData.error || "Failed to save draft before activating");
        }

        // Activate
        const res = await fetch("/api/admin/ai/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            changeSummary: `Activated ${draftConfig.model.provider.toUpperCase()} (${draftConfig.model.modelId})`,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to activate configuration");
        }

        setActiveConfig(data.activeConfig);
        setDraftConfig(data.activeConfig);
        if (data.version) {
          setVersions((prev) => [data.version, ...prev.filter((v) => v.versionNumber !== data.version.versionNumber)]);
        }
        setSaveStatus(`v${data.activeConfig.versionNumber} (${data.activeConfig.model.provider}) is now LIVE on the portfolio!`);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Error activating configuration");
      }
    });
  };

  const handleTestConnection = async (
    provider: string,
    secret?: string,
    baseUrl?: string,
    organizationId?: string,
  ) => {
    setTestingProvider(provider);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/ai/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          testSecret: secret || undefined,
          baseUrl: baseUrl || undefined,
          organizationId: organizationId || undefined,
        }),
      });
      const data = await res.json();
      setTestResult({
        ok: data.ok,
        message: data.message || (data.ok ? "Connected" : "Failed"),
        latencyMs: data.latencyMs,
      });

      // Refresh credentials state
      const credRes = await fetch("/api/admin/ai/providers");
      if (credRes.ok) {
        const credData = await credRes.json();
        setCredentials(credData.credentials || []);
      }
    } catch {
      setTestResult({ ok: false, message: "Network error testing provider" });
    } finally {
      setTestingProvider(null);
    }
  };

  const handleSaveProviderKey = async () => {
    if (!selectedProviderKey || !newSecretInput.trim()) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/ai/providers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: selectedProviderKey,
            secret: newSecretInput.trim(),
            baseUrl: newBaseUrlInput.trim() || undefined,
            organizationId: newOrgIdInput.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to save key");
        }

        // Refresh credentials
        const credRes = await fetch("/api/admin/ai/providers");
        if (credRes.ok) {
          const credData = await credRes.json();
          setCredentials(credData.credentials || []);
        }

        setSelectedProviderKey(null);
        setNewSecretInput("");
        setNewBaseUrlInput("");
        setNewOrgIdInput("");
        setSaveStatus(`API Key for ${selectedProviderKey.toUpperCase()} saved & encrypted.`);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Error saving key");
      }
    });
  };

  const handleDisableProvider = async (provider: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/ai/providers?provider=${provider}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to disable provider");

        const credRes = await fetch("/api/admin/ai/providers");
        if (credRes.ok) {
          const credData = await credRes.json();
          setCredentials(credData.credentials || []);
        }
        setSaveStatus(`Provider ${provider.toUpperCase()} disabled.`);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Error disabling provider");
      }
    });
  };

  const handleRunPlaygroundTest = async () => {
    setPlaygroundLoading(true);
    setPlaygroundResponse(null);
    try {
      const res = await fetch("/api/admin/ai/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: playgroundPrompt,
          targetMode: playgroundTarget,
          configOverride: playgroundTarget === "draft" ? draftConfig : activeConfig,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Execution failed");
      }
      setPlaygroundResponse(data);

      // Refresh logs
      const usageRes = await fetch("/api/admin/ai/usage");
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setLogs(usageData.logs || []);
        setAuditLogs(usageData.auditLogs || []);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Playground test failed");
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleRestoreVersion = async (versionNumber: number, activateNow: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/ai/versions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ versionNumber, activateNow }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to restore version");
        }

        if (activateNow) {
          setActiveConfig(data.config);
          setDraftConfig(data.config);
          setSaveStatus(`Version v${versionNumber} restored and ACTIVATED live.`);
        } else {
          setDraftConfig(data.config);
          setSaveStatus(`Version v${versionNumber} restored as DRAFT.`);
        }
        setSelectedVersionToRestore(null);

        // Refresh versions list
        const vRes = await fetch("/api/admin/ai/versions");
        if (vRes.ok) {
          const vData = await vRes.json();
          setVersions(vData.versions || []);
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Error restoring version");
      }
    });
  };

  return (
    <div className="space-y-6 pb-24 text-slate-100">
      {/* ─── HEADER & TOP METADATA ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  AI Control Center
                </h1>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">
                  v{activeConfig.versionNumber || 1} ACTIVE
                </span>
                {hasDraftChanges && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 animate-pulse">
                    DRAFT EDITED
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage production Arefin AI intelligence, provider keys, model parameters, safety guardrails, and knowledge retrieval.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Summary Pill Cluster */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0e1320] border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60">Provider:</span>
            <span className="text-white font-semibold uppercase">{activeConfig.model.provider}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#0e1320] border border-white/10 hidden sm:flex items-center gap-2">
            <span className="text-white/60">Model:</span>
            <span className="text-violet-300 font-semibold">{activeConfig.model.modelId}</span>
          </div>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {saveStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ─── TAB NAVIGATION BAR ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar border-b border-white/[0.08] pb-2">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "brain", label: "Brain & Prompts", icon: Brain },
          { id: "model", label: "Model & Engine", icon: Cpu },
          { id: "providers", label: "Providers & Keys", icon: Key },
          { id: "knowledge", label: "Knowledge Base", icon: Database },
          { id: "safety", label: "Safety & Limits", icon: ShieldAlert },
          { id: "playground", label: "Playground", icon: Play },
          { id: "memory", label: "Client Leads & Memory", icon: Lock },
          { id: "usage", label: "Usage & Logs", icon: Flame },
          { id: "versions", label: "Versions & Rollback", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-1">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                System Status
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg font-bold text-white">Online &amp; Grounded</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">100% public data bounded</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-1">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                Active Provider
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-lg font-bold text-violet-300 uppercase">
                  {activeConfig.model.provider}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">{activeConfig.model.modelId}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-1">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                Requests Today
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-2xl font-bold text-white">{stats.requestsToday}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {stats.totalRequests} total (7d window)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-1">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                Avg Latency &amp; Health
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-2xl font-bold text-white">
                  {stats.avgLatencyMs > 0 ? `${stats.avgLatencyMs}ms` : "Fast (<50ms)"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {stats.errorCount} errors · {stats.successCount} successful
              </p>
            </div>
          </div>

          {/* Quick Actions & Knowledge Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Knowledge Sources Card */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-violet-400" />
                  <h3 className="font-semibold text-white text-sm">Indexed Knowledge Sources</h3>
                </div>
                <button
                  onClick={() => setActiveTab("knowledge")}
                  className="text-xs text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1"
                >
                  <span>Configure</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Projects</span>
                  <p className="text-lg font-bold text-white">{docCounts.projects}</p>
                  <span className="text-[9px] font-mono text-emerald-400">
                    {draftConfig.knowledge.enabledCollections.projects ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Services</span>
                  <p className="text-lg font-bold text-white">{docCounts.services}</p>
                  <span className="text-[9px] font-mono text-emerald-400">
                    {draftConfig.knowledge.enabledCollections.services ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Journal</span>
                  <p className="text-lg font-bold text-white">{docCounts.posts}</p>
                  <span className="text-[9px] font-mono text-emerald-400">
                    {draftConfig.knowledge.enabledCollections.posts ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Skills</span>
                  <p className="text-lg font-bold text-white">{docCounts.skills}</p>
                  <span className="text-[9px] font-mono text-emerald-400">
                    {draftConfig.knowledge.enabledCollections.skills ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">About &amp; Bio</span>
                  <p className="text-lg font-bold text-white">{docCounts.about}</p>
                  <span className="text-[9px] font-mono text-emerald-400">
                    {draftConfig.knowledge.enabledCollections.about ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Test Prompt Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2.5">
                <Play className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white text-sm">Quick Playground Test</h3>
              </div>
              <p className="text-xs text-slate-400">
                Instantly run a query against the active configuration to verify live responses.
              </p>
              <button
                onClick={() => {
                  setPlaygroundPrompt("What can Arefin build?");
                  setActiveTab("playground");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Playground</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: BRAIN & STRUCTURED PROMPTS ─────────────────────────────── */}
      {activeTab === "brain" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" />
              <span>Identity &amp; Persona</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Assistant Display Name</label>
                <input
                  type="text"
                  value={draftConfig.brain.name}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: { ...draftConfig.brain, name: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Role &amp; Title</label>
                <input
                  type="text"
                  value={draftConfig.brain.role}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: { ...draftConfig.brain, role: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Display Subtitle / Description</label>
                <input
                  type="text"
                  value={draftConfig.brain.displayDescription}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: { ...draftConfig.brain, displayDescription: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Persona &amp; Character</label>
                <textarea
                  rows={2}
                  value={draftConfig.brain.persona}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: { ...draftConfig.brain, persona: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Structured System Prompt Editor */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-400" />
              <span>Core System Prompt Template</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Base System Prompt</label>
              <textarea
                rows={4}
                value={draftConfig.brain.systemPrompt}
                onChange={(e) =>
                  setDraftConfig({
                    ...draftConfig,
                    brain: { ...draftConfig.brain, systemPrompt: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            {/* Behavior Rules List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-400">Behavior Rules (One per rule)</label>
                <button
                  type="button"
                  onClick={() =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: {
                        ...draftConfig.brain,
                        behaviorRules: [...draftConfig.brain.behaviorRules, "New behavior rule"],
                      },
                    })
                  }
                  className="text-[11px] font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Rule</span>
                </button>
              </div>

              <div className="space-y-2">
                {draftConfig.brain.behaviorRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const next = [...draftConfig.brain.behaviorRules];
                        next[idx] = e.target.value;
                        setDraftConfig({
                          ...draftConfig,
                          brain: { ...draftConfig.brain, behaviorRules: next },
                        });
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = draftConfig.brain.behaviorRules.filter((_, i) => i !== idx);
                        setDraftConfig({
                          ...draftConfig,
                          brain: { ...draftConfig.brain, behaviorRules: next },
                        });
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fallback & Greeting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Greeting Message</label>
                <input
                  type="text"
                  value={draftConfig.brain.greeting}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: { ...draftConfig.brain, greeting: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Fallback Response</label>
                <input
                  type="text"
                  value={draftConfig.brain.fallbackResponse}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      brain: { ...draftConfig.brain, fallbackResponse: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: MODEL & ENGINE ────────────────────────────────────────── */}
      {activeTab === "model" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Model Selection &amp; Inference Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Provider Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Primary Provider</label>
                <select
                  value={draftConfig.model.provider}
                  onChange={(e) => {
                    const nextProv = e.target.value as AIProviderName;
                    const defaultModel = ALLOWED_MODELS[nextProv]?.[0]?.id || "local-grounded-v1";
                    setDraftConfig({
                      ...draftConfig,
                      model: {
                        ...draftConfig.model,
                        provider: nextProv,
                        modelId: defaultModel,
                      },
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                >
                  <option value="local_grounded">Local Grounded Engine (Deterministic, Zero Hallucination)</option>
                  <option value="openai">OpenAI (GPT-4o, GPT-4o Mini)</option>
                  <option value="anthropic">Anthropic (Claude 3.5 Haiku, Sonnet)</option>
                  <option value="google">Google (Gemini 1.5 Flash, Pro)</option>
                </select>
              </div>

              {/* Model Dropdown (Allowlisted) */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Model ID (Allowlisted)</label>
                <select
                  value={draftConfig.model.modelId}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      model: { ...draftConfig.model, modelId: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                >
                  {(ALLOWED_MODELS[draftConfig.model.provider] || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-400">Temperature</label>
                  <span className="font-mono text-xs text-violet-300 font-bold">
                    {draftConfig.model.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={draftConfig.model.temperature}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      model: { ...draftConfig.model, temperature: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-violet-500"
                />
                <span className="text-[10px] text-slate-500 font-mono">
                  Low (0.0-0.3) = deterministic &amp; factual; High (0.7+) = creative
                </span>
              </div>

              {/* Max Output Tokens */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Max Output Tokens</label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  step="50"
                  value={draftConfig.model.maxTokens}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      model: { ...draftConfig.model, maxTokens: parseInt(e.target.value) || 500 },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              {/* Failover Settings */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#07090e] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white">Automatic Provider Failover</span>
                    <p className="text-[11px] text-slate-400">
                      If primary provider experiences rate limit or outage, seamlessly switch to fallback.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftConfig.model.enableFailover}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        model: { ...draftConfig.model, enableFailover: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-violet-500"
                  />
                </div>

                {draftConfig.model.enableFailover && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Fallback Provider</label>
                      <select
                        value={draftConfig.model.fallbackProvider || "local_grounded"}
                        onChange={(e) =>
                          setDraftConfig({
                            ...draftConfig,
                            model: {
                              ...draftConfig.model,
                              fallbackProvider: e.target.value as AIProviderName,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-white/10 text-white text-xs font-mono"
                      >
                        <option value="local_grounded">Local Grounded Engine</option>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="google">Google Gemini</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: PROVIDERS & ENCRYPTED KEYS ─────────────────────────────── */}
      {activeTab === "providers" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { id: "openai", name: "OpenAI", desc: "GPT-4o, GPT-4o Mini models" },
              { id: "anthropic", name: "Anthropic", desc: "Claude 3.5 Sonnet & Haiku" },
              { id: "google", name: "Google Gemini", desc: "Gemini 1.5 Flash & Pro" },
            ].map((prov) => {
              const cred = credentials.find((c) => c.provider === prov.id);
              const isConfigured = cred && cred.status === "connected";
              const isTesting = testingProvider === prov.id;

              return (
                <div
                  key={prov.id}
                  className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                      <span
                        className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${
                          isConfigured
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : cred?.status === "invalid"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {isConfigured ? "Connected" : cred?.status || "Not Configured"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{prov.desc}</p>

                    {/* Fingerprint Display */}
                    <div className="p-2.5 rounded-xl bg-[#07090e] border border-white/5 font-mono text-xs flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Stored Key:</span>
                      <span className="text-slate-300 font-bold">
                        {cred?.keyFingerprint || "None stored"}
                      </span>
                    </div>

                    {cred?.lastRotatedAt && (
                      <p className="text-[10px] font-mono text-slate-500">
                        Rotated: {new Date(cred.lastRotatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestConnection(prov.id)}
                        disabled={isTesting}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#07090e] hover:bg-white/[0.06] border border-white/10 text-white text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isTesting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>Test Connection</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProviderKey(prov.id as "openai" | "anthropic" | "google");
                          setNewSecretInput("");
                          setNewBaseUrlInput(cred?.baseUrl || "");
                          setNewOrgIdInput(cred?.organizationId || "");
                        }}
                        className="py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        <span>Rotate</span>
                      </button>
                    </div>

                    {isConfigured && (
                      <button
                        type="button"
                        onClick={() => handleDisableProvider(prov.id)}
                        className="w-full text-center text-[10px] font-mono text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        Disable Provider Key
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Rotation Modal Dialog */}
          {selectedProviderKey && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1424] border border-violet-500/30 space-y-4 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-violet-400" />
                  <h4 className="font-bold text-white text-sm uppercase">
                    Configure / Rotate {selectedProviderKey} API Key
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedProviderKey(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-300">
                API keys are securely encrypted at rest using AES-256-GCM. The raw key is write-only and will never be shown in cleartext again.
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">New API Key (Write-Only)</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={newSecretInput}
                    onChange={(e) => setNewSecretInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Custom Base URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newBaseUrlInput}
                      onChange={(e) => setNewBaseUrlInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Organization ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="org-..."
                      value={newOrgIdInput}
                      onChange={(e) => setNewOrgIdInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleTestConnection(
                      selectedProviderKey,
                      newSecretInput.trim(),
                      newBaseUrlInput.trim(),
                      newOrgIdInput.trim(),
                    )
                  }
                  disabled={!newSecretInput.trim() || testingProvider !== null}
                  className="px-4 py-2 rounded-xl bg-[#07090e] hover:bg-white/[0.06] border border-white/10 disabled:opacity-50 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  {testingProvider === selectedProviderKey ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>Test Key</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProviderKey(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProviderKey}
                    disabled={!newSecretInput.trim() || isPending}
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2"
                  >
                    {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save &amp; Encrypt Key</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
                testResult.ok
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <span>{testResult.message}</span>
              {testResult.latencyMs !== undefined && <span>{testResult.latencyMs}ms</span>}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 5: KNOWLEDGE BASE RETRIEVAL ──────────────────────────────── */}
      {activeTab === "knowledge" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-violet-400" />
              <span>Knowledge Sources &amp; Collection Filters</span>
            </h3>
            <p className="text-xs text-slate-400">
              Only published public documents from enabled collections will be retrieved. Drafts and private collections are strictly excluded.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "projects", label: "Projects & Workflows", count: docCounts.projects },
                { id: "services", label: "Capabilities & Services", count: docCounts.services },
                { id: "posts", label: "Journal Notes & Articles", count: docCounts.posts },
                { id: "skills", label: "Technical Skills Matrix", count: docCounts.skills },
                { id: "about", label: "About Bio & Site Settings", count: docCounts.about },
              ].map((src) => {
                const key = src.id as keyof typeof draftConfig.knowledge.enabledCollections;
                const isEnabled = draftConfig.knowledge.enabledCollections[key];

                return (
                  <div
                    key={src.id}
                    className="p-4 rounded-xl bg-[#07090e] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white block">{src.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {src.count} documents available
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          setDraftConfig({
                            ...draftConfig,
                            knowledge: {
                              ...draftConfig.knowledge,
                              enabledCollections: {
                                ...draftConfig.knowledge.enabledCollections,
                                [key]: e.target.checked,
                              },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Retrieval Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Top K Documents</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={draftConfig.knowledge.topK}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      knowledge: { ...draftConfig.knowledge, topK: parseInt(e.target.value) || 4 },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Context Budget (Chars)</label>
                <input
                  type="number"
                  min="1000"
                  max="15000"
                  step="500"
                  value={draftConfig.knowledge.contextBudgetChars}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      knowledge: {
                        ...draftConfig.knowledge,
                        contextBudgetChars: parseInt(e.target.value) || 5000,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Include Source Links</label>
                <select
                  value={draftConfig.knowledge.includeSourceLinks ? "true" : "false"}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      knowledge: {
                        ...draftConfig.knowledge,
                        includeSourceLinks: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                >
                  <option value="true">Yes — Cite public URLs</option>
                  <option value="false">No — Plain text only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: SAFETY & LIMITS ───────────────────────────────────────── */}
      {activeTab === "safety" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-violet-400" />
              <span>Prompt Injection Guardrails &amp; Rate Limits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#07090e] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Prompt Injection Defense</span>
                  <input
                    type="checkbox"
                    checked={draftConfig.safety.promptInjectionDefense}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        safety: { ...draftConfig.safety, promptInjectionDefense: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-violet-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Treats retrieved portfolio documents as untrusted content; blocks secret extraction queries.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#07090e] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Strict Grounding Filter</span>
                  <input
                    type="checkbox"
                    checked={draftConfig.safety.strictGrounding}
                    onChange={(e) =>
                      setDraftConfig({
                        ...draftConfig,
                        safety: { ...draftConfig.safety, strictGrounding: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-violet-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Refuses to answer queries without factual evidence in the retrieved portfolio context.
                </p>
              </div>
            </div>

            {/* Operational Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Rate Limit (Req / Min / IP)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={draftConfig.limits.rateLimitPerMin}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      limits: { ...draftConfig.limits, rateLimitPerMin: parseInt(e.target.value) || 15 },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Max Prompt Length (Chars)</label>
                <input
                  type="number"
                  min="200"
                  max="3000"
                  step="100"
                  value={draftConfig.limits.maxPromptLength}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      limits: { ...draftConfig.limits, maxPromptLength: parseInt(e.target.value) || 1000 },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Daily Request Cap</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="500"
                  value={draftConfig.limits.dailyRequestLimit}
                  onChange={(e) =>
                    setDraftConfig({
                      ...draftConfig,
                      limits: {
                        ...draftConfig.limits,
                        dailyRequestLimit: parseInt(e.target.value) || 2000,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 7: PLAYGROUND ────────────────────────────────────────────── */}
      {activeTab === "playground" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input & Parameters */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-white text-sm">Playground Tester</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">Config:</span>
                  <select
                    value={playgroundTarget}
                    onChange={(e) => setPlaygroundTarget(e.target.value as "active" | "draft")}
                    className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-white/10 text-white text-xs font-mono"
                  >
                    <option value="draft">Draft Configuration</option>
                    <option value="active">Active (Production)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Test Query</label>
                <textarea
                  rows={4}
                  value={playgroundPrompt}
                  onChange={(e) => setPlaygroundPrompt(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "What can Arefin build?",
                  "Show me his RAG work.",
                  "How does his agent architecture work?",
                  "What tools does he use?",
                  "How can I contact or hire him?",
                ].map((suggested, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPlaygroundPrompt(suggested)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-[11px] text-slate-300 font-mono transition-colors"
                  >
                    {suggested}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRunPlaygroundTest}
                disabled={playgroundLoading || !playgroundPrompt.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                {playgroundLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Run Test Query</span>
              </button>
            </div>

            {/* Live Response & Telemetry Output */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-slate-400">Response Output</span>
                  {playgroundResponse && (
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase">
                        {playgroundResponse.providerUsed}
                      </span>
                      {playgroundResponse.latencyMs !== undefined && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {playgroundResponse.latencyMs}ms
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {playgroundResponse ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {playgroundResponse.reply}
                    </div>

                    {playgroundResponse.citations && playgroundResponse.citations.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400">Generated Citations:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {playgroundResponse.citations.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded bg-violet-600/15 border border-violet-500/20 text-[10px] font-mono text-violet-300"
                            >
                              {c.title} ({c.url})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    Run a query to inspect real-time provider response, citations, and latency metrics.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: CLIENT LEADS & ENCRYPTED MEMORY ────────────────────────── */}
      {activeTab === "memory" && (
        <div className="space-y-6 animate-fade-in">
          {/* Security & Zero-Leakage Architecture Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    Encrypted Visitor Memory &amp; Lead Isolation
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                    AES-256-GCM SECURED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visitor sessions and contact inputs are strictly encrypted at rest. Public users cannot access or query another visitor&apos;s data under any circumstances.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadMemories}
              disabled={memoryLoading}
              className="px-3.5 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white rounded-xl text-xs font-mono font-medium transition-colors shrink-0 flex items-center gap-1.5"
            >
              {memoryLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>Refresh Leads</span>
            </button>
          </div>

          {/* AI Memory Intelligence Query Bar */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-violet-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-white text-sm">Admin AI Lead &amp; Inquiry Intelligence</h3>
              </div>
              <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md">
                Admin-Only Query Access
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={adminMemoryQuery}
                onChange={(e) => setAdminMemoryQuery(e.target.value)}
                placeholder="Ask AI: e.g. Who requested custom workflow pricing? Summarize this week's inquiries..."
                className="flex-1 px-4 py-2.5 bg-[#07090e] border border-white/15 focus:border-violet-500 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleQueryMemoryIntelligence}
                disabled={adminMemoryQueryLoading || !adminMemoryQuery.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center justify-center gap-2"
              >
                {adminMemoryQueryLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Memory...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Answer Output */}
            {adminMemoryAnswer && (
              <div className="p-4 rounded-xl bg-[#07090e] border border-violet-500/40 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-mono text-violet-300 font-semibold border-b border-white/10 pb-2">
                  <Bot className="w-4 h-4 text-violet-400" />
                  <span>Executive Intelligence Digest:</span>
                </div>
                <div className="text-xs sm:text-[13px] text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {adminMemoryAnswer}
                </div>
              </div>
            )}
          </div>

          {/* Decrypted Visitor Sessions Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Encrypted Visitor Sessions ({memories.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3">Session ID</th>
                    <th className="py-2.5 px-3">Captured Contact</th>
                    <th className="py-2.5 px-3">Detected Intent</th>
                    <th className="py-2.5 px-3">Tech Stacks Mentioned</th>
                    <th className="py-2.5 px-3">Messages</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {memories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        {memoryLoading ? "Loading decrypted sessions..." : "No visitor sessions recorded yet."}
                      </td>
                    </tr>
                  ) : (
                    memories.map((mem, i) => {
                      const hasContact = mem.extractedLead?.hasContactInfo;
                      return (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-3 text-slate-300 text-[11px]">
                            {new Date(mem.lastActiveAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-violet-300 font-mono text-[11px]">
                            {mem.sessionId.slice(0, 16)}...
                          </td>
                          <td className="py-3 px-3">
                            {hasContact ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                {mem.extractedLead?.email || mem.extractedLead?.phone || "Captured"}
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">None</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-300 text-[10px]">
                            {mem.extractedLead?.intent || "GENERAL_INQUIRY"}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[10px]">
                            {(mem.extractedLead?.extractedTech || []).join(", ") || "—"}
                          </td>
                          <td className="py-3 px-3 text-slate-300 text-[11px]">
                            {mem.messages.length} msgs
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setSelectedSessionView(mem)}
                              className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 rounded-lg text-[10px] font-mono border border-violet-500/30 transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Inspect Modal */}
          {selectedSessionView && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-2xl max-h-[85vh] bg-[#0c101d] border border-violet-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#080c16]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-violet-400" />
                    <h4 className="font-bold text-white text-sm">
                      Session Conversation ({selectedSessionView.sessionId})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSessionView(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar text-xs">
                  {selectedSessionView.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        m.role === "user"
                          ? "bg-violet-950/60 border border-violet-500/30 ml-6 text-violet-100"
                          : "bg-white/[0.04] border border-white/10 mr-6 text-slate-200"
                      }`}
                    >
                      <div className="text-[10px] font-mono opacity-60 uppercase mb-1">
                        {m.role === "user" ? "Visitor" : "Arefin AI"}
                      </div>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 8: USAGE & OPERATIONAL LOGS ──────────────────────────────── */}
      {activeTab === "usage" && (
        <div className="space-y-6 animate-fade-in">
          {/* Recent Query Logs */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <span>Recent AI Request Logs (Latest 50)</span>
            </h3>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3">Latency</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No request logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3 text-violet-300 uppercase font-bold">{log.provider}</td>
                        <td className="py-2.5 px-3 text-slate-300">{log.model}</td>
                        <td className="py-2.5 px-3 text-slate-400">{log.latencyMs}ms</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] ${
                              log.status === "success"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{log.requestType}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Audit Logs */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-violet-400" />
              <span>Administrative Audit Trail</span>
            </h3>

            <div className="space-y-2">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono py-4">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#07090e] border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase text-[9px]">
                        {item.action}
                      </span>
                      <span className="text-white">{item.target}</span>
                      <span className="text-slate-500 text-[10px]">by {item.actor}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 9: VERSIONS & ROLLBACK ───────────────────────────────────── */}
      {activeTab === "versions" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-violet-400" />
                <h3 className="font-semibold text-white text-sm">Configuration Version Snapshots</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {versions.length} total snapshots
              </span>
            </div>

            <div className="space-y-3">
              {versions.map((ver) => {
                const isCurrentActive = ver.versionNumber === activeConfig.versionNumber;

                return (
                  <div
                    key={ver.versionNumber}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrentActive
                        ? "bg-violet-600/10 border-violet-500/40"
                        : "bg-[#07090e] border-white/5"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-white">v{ver.versionNumber}</span>
                        {isCurrentActive && (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px]">
                            ACTIVE
                          </span>
                        )}
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{ver.changeSummary}</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500">
                        {new Date(ver.createdAt).toLocaleString()} · by {ver.createdBy} · Hash: {ver.promptHash}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSnapshotViewVersion(ver)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300"
                      >
                        Inspect
                      </button>

                      {!isCurrentActive && (
                        <button
                          type="button"
                          onClick={() => setSelectedVersionToRestore(ver)}
                          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-mono text-white font-semibold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Rollback</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Snapshot Inspector Modal */}
          {snapshotViewVersion && (
            <div className="p-5 rounded-2xl bg-[#0e1424] border border-violet-500/30 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-bold text-white text-sm font-mono">
                  Inspect Version v{snapshotViewVersion.versionNumber} Snapshot
                </h4>
                <button
                  onClick={() => setSnapshotViewVersion(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#07090e] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-80 custom-scrollbar">
                {JSON.stringify(snapshotViewVersion.config, null, 2)}
              </pre>
            </div>
          )}

          {/* Rollback Confirmation Modal */}
          {selectedVersionToRestore && (
            <div className="p-5 rounded-2xl bg-[#0e1424] border border-amber-500/40 space-y-4 animate-fade-in shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">
                  Confirm Rollback to v{selectedVersionToRestore.versionNumber}
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to restore configuration from version v{selectedVersionToRestore.versionNumber}? You can restore it as a Draft to test first, or immediately activate it to production.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVersionToRestore(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRestoreVersion(selectedVersionToRestore.versionNumber, false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono font-semibold"
                >
                  Restore as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleRestoreVersion(selectedVersionToRestore.versionNumber, true)}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold"
                >
                  Activate Live Immediately
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── STICKY BOTTOM ACTION BAR (Save Draft / Test / Activate) ──────── */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 z-30 bg-[#07090e]/95 backdrop-blur-md border-t border-white/[0.08] p-3 sm:p-4 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400 hidden sm:inline">Active Version:</span>
            <span className="text-white font-bold">v{activeConfig.versionNumber}</span>
            {hasDraftChanges && (
              <span className="text-amber-400 text-[11px] font-semibold">(Draft Unsaved)</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("playground");
              }}
              className="py-2 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test in Playground</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isPending}
              className="py-2 px-4 rounded-xl bg-[#141a29] hover:bg-[#1c2438] border border-white/10 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleActivateConfig}
              disabled={isPending}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Activate (Go Live)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
