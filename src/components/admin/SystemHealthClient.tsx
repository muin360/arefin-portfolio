"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Database,
  Shield,
  Globe,
  Mail,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface HealthData {
  mongodb: { status: string; dbName: string; latencyMs?: number; collectionsCount?: number };
  auth: { status: string; githubOAuth: string; googleOAuth: string };
  email: { status: string };
  site: { url: string; status: string };
  checkedAt: string;
}

type StatusType = "ok" | "warn" | "error" | "unknown";

function getStatusType(status: string): StatusType {
  if (["connected", "ready", "configured", "live"].includes(status)) return "ok";
  if (["not_configured"].includes(status)) return "warn";
  if (["error", "missing_secret"].includes(status)) return "error";
  return "unknown";
}

function StatusIndicator({ status }: { status: string }) {
  const type = getStatusType(status);
  const label: Record<string, string> = {
    connected: "Connected",
    ready: "Ready",
    configured: "Active",
    live: "Live",
    error: "Offline",
    not_configured: "Optional / Not Set",
    missing_secret: "Missing Secret",
  };
  const cfg = {
    ok: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    warn: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    unknown: { icon: AlertCircle, color: "text-[#6b7280]", bg: "bg-[#1e2433]", border: "border-[#2d3748]" },
  }[type];

  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg} border ${cfg.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label[status] ?? status}
    </span>
  );
}

interface ServiceCardProps {
  icon: React.ElementType;
  name: string;
  status: string;
  details?: React.ReactNode;
}

function ServiceCard({ icon: Icon, name, status, details }: ServiceCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] flex items-start gap-4 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-[#141a29] border border-[#1e2433] flex items-center justify-center shrink-0 text-violet-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
          <span className="text-sm font-bold text-white">{name}</span>
          <StatusIndicator status={status} />
        </div>
        {details && <div className="mt-2">{details}</div>}
      </div>
    </div>
  );
}

export default function SystemHealthClient() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) throw new Error("Failed");
      setData(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/health")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((json: HealthData) => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center text-[#6b7280]">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        <span className="text-sm font-mono">Running deep system diagnostics…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 rounded-3xl bg-[#0f111a] border border-[#1e2433] text-center shadow-lg">
        <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-base text-white font-bold">Diagnostic Check Failed</p>
        <p className="text-xs text-[#6b7280] mt-1 font-mono">Could not connect to health telemetry endpoint.</p>
        <button
          onClick={load}
          className="mt-5 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-600/20"
        >
          Retry Diagnostics
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f111a] p-6 rounded-3xl border border-[#1e2433] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              OPERATIONAL STATUS
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">
              Last checked {new Date(data.checkedAt).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            System Health &amp; Runtime Diagnostics
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Monitor real-time database connection latency, security secrets, and cloud infrastructure
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#161d2d] hover:bg-[#1f293d] border border-[#252f44] text-white rounded-xl text-xs font-semibold transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
          Re-check Systems
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ServiceCard
          icon={Database}
          name="MongoDB Atlas Database"
          status={data.mongodb.status}
          details={
            data.mongodb.status === "connected" ? (
              <div className="text-xs text-[#6b7280] space-y-1 font-mono">
                <p>
                  Database Name: <span className="text-[#9ca3af]">{data.mongodb.dbName}</span>
                </p>
                {data.mongodb.latencyMs !== undefined && (
                  <p>
                    Ping Latency:{" "}
                    <span
                      className={
                        data.mongodb.latencyMs < 100
                          ? "text-emerald-400 font-bold"
                          : data.mongodb.latencyMs < 300
                            ? "text-amber-400 font-bold"
                            : "text-red-400 font-bold"
                      }
                    >
                      {data.mongodb.latencyMs}ms
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#6b7280]">
                Check MongoDB Atlas network access IP whitelist and connection string.
              </p>
            )
          }
        />

        <ServiceCard
          icon={Shield}
          name="Passcode Auth &amp; Session Layer"
          status={data.auth.status}
          details={
            <div className="text-xs text-[#6b7280] space-y-1 font-mono">
              <p>
                Admin Passcode Mode: <span className="text-emerald-400">Active</span>
              </p>
              <p>
                Session Engine: <span className="text-[#9ca3af]">JWT encrypted with AUTH_SECRET</span>
              </p>
            </div>
          }
        />

        <ServiceCard
          icon={Globe}
          name="Production Edge Server (Vercel)"
          status={data.site.status}
          details={
            <p className="text-xs text-[#9ca3af] font-mono break-all">{data.site.url}</p>
          }
        />

        <ServiceCard
          icon={Mail}
          name="Transactional Email (Resend)"
          status={data.email.status}
          details={
            data.email.status === "not_configured" ? (
              <p className="text-xs text-[#6b7280] font-mono">
                Optional: Add <code className="text-amber-400">RESEND_API_KEY</code> for automated email notifications.
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-mono">API Key configured for delivery</p>
            )
          }
        />
      </div>

      {/* Environment Check */}
      <div className="p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
        <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#1a202c]">
          Runtime Environment Variables
        </h3>
        <div className="space-y-3">
          {[
            { key: "MONGODB_URI", label: "MongoDB Atlas Connection String", ok: data.mongodb.status !== "not_configured" },
            { key: "AUTH_SECRET", label: "NextAuth Session Encryption Key", ok: data.auth.status !== "missing_secret" },
            { key: "NEXT_PUBLIC_SITE_URL", label: "Public Canonical Domain", ok: true },
            { key: "ADMIN_PASSWORD / ADMIN_SECRET", label: "Passcode Authentication Credentials", ok: true },
            { key: "RESEND_API_KEY", label: "Resend Email Dispatch API", ok: data.email.status === "configured" },
          ].map((env) => (
            <div
              key={env.key}
              className="flex items-center justify-between p-3 rounded-xl bg-[#141a29]/60 border border-[#1e2433] text-xs"
            >
              <div className="flex items-center gap-3">
                {env.ok ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <code className="text-white font-mono font-semibold">{env.key}</code>
                  <p className="text-[11px] text-[#6b7280]">{env.label}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  env.ok
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-[#1e2433] text-[#6b7280]"
                }`}
              >
                {env.ok ? "Configured" : "Not Set"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
