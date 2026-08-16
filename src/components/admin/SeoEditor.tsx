"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/db/types";

interface Props {
  initialSeo: SiteSettings["seo"];
}

export default function SeoEditor({ initialSeo }: Props) {
  const [seo, setSeo] = useState<SiteSettings["seo"]>(initialSeo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update SEO settings");
      setSeo(data.seo);
      setSuccess("SEO metadata saved successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm">
          {success}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Global Search &amp; Social Metadata</h2>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Site Title (Default &lt;title&gt;)
          </label>
          <input
            type="text"
            required
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Meta Description
          </label>
          <textarea
            rows={3}
            required
            value={seo.siteDescription}
            onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              OpenGraph Title
            </label>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Canonical URL
            </label>
            <input
              type="url"
              value={seo.canonicalUrl}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            OpenGraph Description
          </label>
          <textarea
            rows={2}
            value={seo.ogDescription}
            onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Author Name
          </label>
          <input
            type="text"
            value={seo.author}
            onChange={(e) => setSeo({ ...seo, author: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </div>
    </form>
  );
}
