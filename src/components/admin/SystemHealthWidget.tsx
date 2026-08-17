"use client";

import { useEffect, useState } from "react";
import { Database, Shield, Globe, Mail, Loader2, RefreshCw, Server, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HealthData {
  mongodb: { status: string; dbName: string; latencyMs?: number };
  auth: { status: string; githubOAuth: string; googleOAuth: string };
  email: { status: string };
  site: { url: string; status: string };
  checkedAt: string;
}

type Status = "connected" | "ready" | "configured" | "live" | "error" | "not_configured" | "missing_secret" | string;

function StatusBadge({ status }: { status: Status }) {
  const map: Record<string, { label: string; dot: string; text: string }> = {
    connected: { label: "Connected", dot: "bg-emerald-400", text: "text-emerald-400" },
    ready: { label: "Ready", dot: "bg-emerald-400", text: "text-emerald-400" },
    configured: { label: "Active", dot: "bg-emerald-400", text: "text-emerald-400" },
    live: { label: "Live", dot: "bg-emerald-400", text: "text-emerald-400" },
    error: { label: "Offline", dot: "bg-red-500", text: "text-red-400" },
    not_configured: { label: "Optional", dot: "bg-[#4b5563]", text: "text-[#6b7280]" },
    missing_secret: { label: "Missing secret", dot: "bg-amber-500", text: "text-amber-400" },
  };
  const cfg = map[status] ?? { label: status, dot: "bg-[#4b5563]", text: "text-[#6b7280]" };
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      <span className={`text-[10px] font-mono font-semibold ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}

export default function SystemHealthWidget() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
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
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#1a202c] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">System Diagnostics</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="p-1 text-[#6b7280] hover:text-white transition-colors rounded-lg"
            aria-label="Refresh health status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-violet-400" : ""}`} />
          </button>
          <Link
            href="/admin/health"
            className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium flex items-center"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 justify-center text-[#6b7280] text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
          <span>Polling diagnostic health...</span>
        </div>
      ) : error ? (
        <p className="text-xs text-[#6b7280] py-3 text-center font-mono">
          Diagnostic telemetry offline.
        </p>
      ) : data ? (
        <div className="space-y-2 text-xs">
          {/* MongoDB */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141a29]/60 border border-[#1e2433]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-white font-medium block">MongoDB Atlas</span>
                {data.mongodb.latencyMs !== undefined && (
                  <span className="text-[10px] font-mono text-[#6b7280]">{data.mongodb.latencyMs}ms query ping</span>
                )}
              </div>
            </div>
            <StatusBadge status={data.mongodb.status} />
          </div>

          {/* Auth */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141a29]/60 border border-[#1e2433]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Shield className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="text-white font-medium truncate">Passcode Auth</span>
            </div>
            <StatusBadge status={data.auth.status} />
          </div>

          {/* Vercel */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141a29]/60 border border-[#1e2433]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-white font-medium truncate">Vercel Deployment</span>
            </div>
            <StatusBadge status={data.site.status} />
          </div>

          {/* Resend Email */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141a29]/60 border border-[#1e2433]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-white font-medium truncate">Email (Resend)</span>
            </div>
            <StatusBadge status={data.email.status} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
