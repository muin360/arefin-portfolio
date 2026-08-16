"use client";

import { useState } from "react";
import type { AboutData } from "@/lib/db/types";

interface Props {
  initialAbout: AboutData;
}

export default function AboutEditor({ initialAbout }: Props) {
  const [about, setAbout] = useState<AboutData>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update about data");
      setAbout(data.about);
      setSuccess("About information saved successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
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

      {/* Main Headline & Bio */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Headline &amp; Bio</h2>
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Display Headline
          </label>
          <input
            type="text"
            value={about.headline}
            onChange={(e) => setAbout({ ...about, headline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Primary Bio
          </label>
          <textarea
            rows={4}
            value={about.bio}
            onChange={(e) => setAbout({ ...about, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Mindset Statement
          </label>
          <textarea
            rows={3}
            value={about.mindset}
            onChange={(e) => setAbout({ ...about, mindset: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Story Paragraphs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Personal Story / Journey</h2>
          <button
            type="button"
            onClick={() => setAbout({ ...about, story: [...about.story, ""] })}
            className="text-xs text-violet-400 hover:text-violet-300 font-mono"
          >
            + Add Paragraph
          </button>
        </div>

        <div className="space-y-3">
          {about.story.map((para, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                rows={3}
                value={para}
                onChange={(e) => {
                  const updated = [...about.story];
                  updated[i] = e.target.value;
                  setAbout({ ...about, story: updated });
                }}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = about.story.filter((_, idx) => idx !== i);
                  setAbout({ ...about, story: updated });
                }}
                className="text-slate-500 hover:text-rose-400 px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Core Principles</h2>
          <button
            type="button"
            onClick={() =>
              setAbout({
                ...about,
                principles: [...about.principles, { title: "", desc: "" }],
              })
            }
            className="text-xs text-violet-400 hover:text-violet-300 font-mono"
          >
            + Add Principle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {about.principles.map((pr, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Principle Title"
                  value={pr.title}
                  onChange={(e) => {
                    const updated = [...about.principles];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setAbout({ ...about, principles: updated });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-semibold text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = about.principles.filter((_, idx) => idx !== i);
                    setAbout({ ...about, principles: updated });
                  }}
                  className="text-slate-500 hover:text-rose-400 px-2"
                >
                  ✕
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Description..."
                value={pr.desc}
                onChange={(e) => {
                  const updated = [...about.principles];
                  updated[i] = { ...updated[i], desc: e.target.value };
                  setAbout({ ...about, principles: updated });
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save About Settings"}
        </button>
      </div>
    </form>
  );
}
