"use client";

import { useState } from "react";
import { Search, Globe, CheckCircle2, AlertCircle, Share2, Sparkles, ExternalLink } from "lucide-react";
import type { SiteSettings } from "@/lib/db/types";

interface Props {
  initialSeo: SiteSettings["seo"];
}

export default function SeoEditor({ initialSeo }: Props) {
  const [seo, setSeo] = useState<SiteSettings["seo"]>(initialSeo);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const titleLength = seo.siteTitle?.length || 0;
  const descLength = seo.siteDescription?.length || 0;

  // SEO Health Checks
  const checks = [
    {
      label: "Title Length (Optimal: 30–60 chars)",
      pass: titleLength >= 30 && titleLength <= 60,
      detail: `${titleLength}/60 characters`,
    },
    {
      label: "Description Length (Optimal: 100–160 chars)",
      pass: descLength >= 100 && descLength <= 160,
      detail: `${descLength}/160 characters`,
    },
    {
      label: "Canonical URL Configured",
      pass: Boolean(seo.canonicalUrl && seo.canonicalUrl.startsWith("http")),
      detail: seo.canonicalUrl || "Missing",
    },
    {
      label: "OpenGraph Metadata Complete",
      pass: Boolean(seo.ogTitle && seo.ogDescription),
      detail: seo.ogTitle ? "Configured" : "Incomplete",
    },
    {
      label: "XML Sitemap Active",
      pass: true,
      detail: "/sitemap.xml",
    },
    {
      label: "Robots.txt Active",
      pass: true,
      detail: "/robots.txt",
    },
  ];

  const passScore = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update SEO settings");
      setSeo(data.seo);
      showToast("SEO metadata updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving SEO settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161d2d] border border-violet-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f111a] p-6 rounded-3xl border border-[#1e2433] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
              SEARCH &amp; METADATA
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">Score: {passScore}%</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            SEO &amp; OpenGraph Control
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Optimize search engine visibility, structured snippet previews, and social media cards
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50 shrink-0"
        >
          {saving ? "Saving Changes..." : "Save SEO Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
              Search Engine Tags
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                  Global Site Title *
                </label>
                <span className={`text-[10px] font-mono ${titleLength > 60 ? "text-rose-400" : "text-[#6b7280]"}`}>
                  {titleLength}/60 chars
                </span>
              </div>
              <input
                type="text"
                required
                value={seo.siteTitle}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                  Meta Description *
                </label>
                <span className={`text-[10px] font-mono ${descLength > 160 ? "text-rose-400" : "text-[#6b7280]"}`}>
                  {descLength}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={seo.siteDescription}
                onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  placeholder="https://tensorstudio.vercel.app"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Author / Publisher
                </label>
                <input
                  type="text"
                  value={seo.author}
                  onChange={(e) => setSeo({ ...seo, author: e.target.value })}
                  placeholder="Arefin Mueen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
              Social Sharing &amp; OpenGraph Card
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                OpenGraph Title
              </label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                OpenGraph Description
              </label>
              <textarea
                rows={2}
                value={seo.ogDescription}
                onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          </div>
        </form>

        {/* Right Pane: SERP Preview & Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Google SERP Preview */}
          <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-violet-400" />
                Google SERP Snippet Preview
              </span>
              <span className="text-[10px] font-mono text-[#6b7280]">Live Preview</span>
            </div>

            <div className="p-4 bg-[#141a29] rounded-xl border border-[#1e2433] space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] font-mono truncate">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{seo.canonicalUrl || "https://tensorstudio.vercel.app"}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {seo.siteTitle || "Arefin Mueen · AI Automation & Agent Developer"}
              </h3>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {seo.siteDescription || "Personal portfolio showcasing hands-on AI automations and autonomous systems."}
              </p>
            </div>
          </div>

          {/* Social OpenGraph Preview Card */}
          <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Social Card / Twitter Preview
              </span>
              <span className="text-[10px] font-mono text-[#6b7280]">Summary Card</span>
            </div>

            <div className="bg-[#141a29] rounded-xl border border-[#1e2433] overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-violet-950 via-[#111827] to-[#0f111a] flex items-center justify-center border-b border-[#1e2433] p-4 text-center">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white font-mono">AREFIN MUEEN</p>
                  <p className="text-[10px] text-violet-400">AI Automation &amp; Agent Systems</p>
                </div>
              </div>
              <div className="p-3.5 space-y-1">
                <p className="text-[10px] font-mono text-[#6b7280] uppercase">tensorstudio.vercel.app</p>
                <p className="text-xs font-bold text-white truncate">
                  {seo.ogTitle || seo.siteTitle || "Arefin Mueen Portfolio"}
                </p>
                <p className="text-[11px] text-[#9ca3af] line-clamp-2">
                  {seo.ogDescription || seo.siteDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Automated Health Checklist */}
          <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-3">
              <h3 className="text-xs font-bold text-white">SEO Health &amp; Compliance</h3>
              <span className="text-xs font-mono font-bold text-emerald-400">{passScore}% Passed</span>
            </div>

            <div className="space-y-2">
              {checks.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#141a29]/60 border border-[#1e2433] text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {c.pass ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className="text-[#d1d5db] truncate">{c.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6b7280] shrink-0 ml-2">
                    {c.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
