"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Globe, Sparkles, MessageSquare, Phone, Mail, ToggleLeft, Activity } from "lucide-react";
import type { SiteSettings, LiveStatCard } from "@/lib/db/types";

type Props = {
  initialConfig: SiteSettings | null;
};

export default function SettingsForm({ initialConfig }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [formData, setFormData] = useState<SiteSettings>(
    initialConfig || {
      id: "settings-default",
      name: "Arefin Mueen",
      role: "AI Automation & AI Agent Developer",
      tagline: "I build practical AI agents, RAG systems, and workflow automations.",
      shortBio: "Independent developer specializing in practical AI workflows.",
      email: "arefinmueen360@gmail.com",
      phone: "+880 1994-605717",
      phoneE164: "8801994605717",
      availability: "available",
      availabilityNote: "Available for automation & agent projects",
      socialLinks: {
        github: "https://github.com/muin360",
        linkedin: "https://linkedin.com/in/arefinmueen",
        twitter: "https://x.com/arefinmueen",
        whatsapp: "https://wa.me/8801994605717",
        email: "arefinmueen360@gmail.com",
      },
      seo: {
        siteTitle: "Arefin Mueen — AI Automation & AI Agent Developer",
        siteDescription: "Portfolio of Arefin Mueen.",
        ogTitle: "Arefin Mueen — AI Automation & AI Agent Developer",
        ogDescription: "AI automation & agent developer.",
        canonicalUrl: "https://tensorstudio.vercel.app",
        author: "Arefin Mueen",
      },
      live30Days: [
        { label: "Active Workflows", value: "14", delta: "+3 this month", hint: "Active" },
        { label: "Emails Triaged", value: "1,240+", delta: "99.4% accuracy", hint: "Total processed" },
        { label: "Hours Saved / Month", value: "85h", delta: "Across pipelines", hint: "Time saved" },
      ],
      showLiveTicker: true,
      showHeroTiles: true,
      showLive30Days: true,
      updatedAt: new Date().toISOString(),
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Site settings and availability updated!");
      } else {
        showToast("Failed to save settings.");
      }
    } catch {
      showToast("Error connecting to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMetricChange = (index: number, field: keyof LiveStatCard, value: string) => {
    const metrics = [...(formData.live30Days || [])];
    metrics[index] = { ...metrics[index], [field]: value };
    setFormData({ ...formData, live30Days: metrics });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      live30Days: [...(formData.live30Days || []), { label: "New Metric", value: "100+", delta: "Updated", hint: "Metric" }],
    });
  };

  const removeMetric = (index: number) => {
    const metrics = (formData.live30Days || []).filter((_, i) => i !== index);
    setFormData({ ...formData, live30Days: metrics });
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
              SITE CONFIGURATION
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">Profile &amp; Live Stats</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Settings &amp; Live Metrics
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Manage portfolio identity, availability badge status, and public 30-day activity highlights
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
            Brand &amp; Positioning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Professional Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
              Tagline / Value Proposition
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Availability & Scoping Status */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
            Availability &amp; Scoping Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Availability State
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: e.target.value as SiteSettings["availability"],
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500 font-medium"
              >
                <option value="available">Available for Projects</option>
                <option value="scoping">Scoping &amp; Discovery Only</option>
                <option value="booked">Fully Booked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={formData.availabilityNote}
                onChange={(e) => setFormData({ ...formData, availabilityNote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Live 30-Day Activity Stats */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1a202c] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Public 30-Day Live Stats Section
              </h2>
              <p className="text-xs text-[#6b7280] font-mono mt-0.5">
                Key automation deliverables displayed on the public home page
              </p>
            </div>
            <button
              type="button"
              onClick={addMetric}
              className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          <div className="space-y-3">
            {(formData.live30Days || []).map((m, idx) => (
              <div key={idx} className="p-3.5 bg-[#141a29] rounded-xl border border-[#1e2433] flex items-center gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Metric Label (e.g. Active Workflows)"
                    value={m.label}
                    onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                    className="px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 14+)"
                    value={m.value}
                    onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                    className="px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-emerald-400 text-xs font-mono font-bold focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Delta (e.g. +3 this month)"
                    value={m.delta || ""}
                    onChange={(e) => handleMetricChange(idx, "delta", e.target.value)}
                    className="px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-[#9ca3af] text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMetric(idx)}
                  className="p-1.5 text-[#6b7280] hover:text-rose-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Channels */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
            Contact &amp; Messaging Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Display Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                WhatsApp E.164 Digits
              </label>
              <input
                type="text"
                value={formData.phoneE164}
                onChange={(e) => setFormData({ ...formData, phoneE164: e.target.value })}
                placeholder="8801994605717"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-[#1e2433] text-white text-sm font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1a202c]">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.github || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#141a29] border border-[#1e2433] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.linkedin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#141a29] border border-[#1e2433] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.twitter || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#141a29] border border-[#1e2433] text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-white tracking-tight border-b border-[#1a202c] pb-3">
            Public Website Feature Toggles
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showLiveTicker}
                onChange={(e) => setFormData({ ...formData, showLiveTicker: e.target.checked })}
                className="w-4 h-4 accent-violet-600 rounded"
              />
              Show System Status ticker banner across the top
            </label>

            <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showLive30Days}
                onChange={(e) => setFormData({ ...formData, showLive30Days: e.target.checked })}
                className="w-4 h-4 accent-violet-600 rounded"
              />
              Show 30-Day Activity &amp; Deliverables section
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
