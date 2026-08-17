"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { AboutData } from "@/lib/db/types";

interface Props {
  initialAbout: AboutData;
}

export default function AboutEditor({ initialAbout }: Props) {
  const [about, setAbout] = useState<AboutData>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update about data");
      setAbout(data.about);
      showToast("About page information updated successfully!");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving");
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              IDENTITY &amp; PHILOSOPHY
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">Public Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            About &amp; Core Principles
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Configure your technical story, development philosophy, and core working principles
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50 shrink-0"
        >
          {saving ? "Saving Changes..." : "Save About Settings"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Headline & Bio */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
            Headline &amp; Bio
          </h2>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
              Display Headline
            </label>
            <input
              type="text"
              value={about.headline}
              onChange={(e) => setAbout({ ...about, headline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
              Primary Bio
            </label>
            <textarea
              rows={4}
              value={about.bio}
              onChange={(e) => setAbout({ ...about, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
              Mindset Statement
            </label>
            <textarea
              rows={3}
              value={about.mindset}
              onChange={(e) => setAbout({ ...about, mindset: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Story Paragraphs */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1a202c] pb-3">
            <h2 className="text-sm font-bold text-white tracking-tight">Personal Story / Journey</h2>
            <button
              type="button"
              onClick={() => setAbout({ ...about, story: [...about.story, ""] })}
              className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Paragraph
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
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = about.story.filter((_, idx) => idx !== i);
                    setAbout({ ...about, story: updated });
                  }}
                  className="p-2 text-[#6b7280] hover:text-rose-400 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1a202c] pb-3">
            <h2 className="text-sm font-bold text-white tracking-tight">Core Engineering Principles</h2>
            <button
              type="button"
              onClick={() =>
                setAbout({
                  ...about,
                  principles: [...about.principles, { title: "", desc: "" }],
                })
              }
              className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Principle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.principles.map((pr, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#141a29]/60 border border-[#1e2433] space-y-2 relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder="Principle Title"
                    value={pr.title}
                    onChange={(e) => {
                      const updated = [...about.principles];
                      updated[i] = { ...updated[i], title: e.target.value };
                      setAbout({ ...about, principles: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f111a] border border-[#1e2433] text-sm font-semibold text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = about.principles.filter((_, idx) => idx !== i);
                      setAbout({ ...about, principles: updated });
                    }}
                    className="text-[#6b7280] hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f111a] border border-[#1e2433] text-xs text-[#9ca3af] focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
