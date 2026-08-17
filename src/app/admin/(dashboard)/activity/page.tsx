import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Activity, Clock, Shield, User, ArrowRight } from "lucide-react";
import { getRecentAdminActivity } from "@/lib/analytics-db";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Activity Audit · Portfolio OS",
};

export default async function AdminActivityPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/admin/login");

  const activities = await getRecentAdminActivity(50);

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f111a] p-6 rounded-3xl border border-[#1e2433] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
              AUDIT TRAIL
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">Administrative Logging</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Admin Operations &amp; Audit Log
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Chronological audit record of project updates, article publications, and configuration changes
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#6b7280]">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Logged Sessions Active</span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 shadow-sm">
        {activities.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6b7280] font-mono">
            <Activity className="w-8 h-8 text-[#252f44] mx-auto mb-2" />
            No administrative events recorded yet. Future content edits and setting updates will be logged here.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-4 p-3.5 rounded-xl bg-[#141a29]/60 border border-[#1e2433] hover:border-violet-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-white">{act.description}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#161d2d] text-violet-300 border border-violet-500/20">
                      {act.type.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-[#6b7280]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {act.actor || "Admin"}
                    </span>
                    {act.targetTitle && (
                      <span className="truncate">Target: {act.targetTitle}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
