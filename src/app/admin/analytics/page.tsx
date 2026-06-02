import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-2">
          Track your website performance and visitor data
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <BarChart3 className="w-8 h-8 text-slate-500 mb-4" />
            <p className="text-slate-400 text-sm mb-2">Metric {i + 1}</p>
            <p className="text-2xl font-bold text-white">--</p>
          </div>
        ))}
      </div>
    </div>
  );
}
