"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/db/types";

type Props = {
  initialConfig: SiteSettings | null;
};

export default function SettingsForm({ initialConfig }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
      availabilityNote: "Open to automation & agent projects",
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
      live30Days: [],
      showLiveTicker: true,
      showHeroTiles: true,
      showLive30Days: true,
      updatedAt: new Date().toISOString(),
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Settings saved successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: "Failed to save settings. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred while saving settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {message && (
        <div
          className={`flex gap-3 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
              : "bg-rose-950/40 border-rose-800 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Brand & Identity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Brand &amp; Positioning</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Professional Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Tagline / Value Proposition
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Availability & Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Availability &amp; Scoping Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="available">Available for Projects</option>
              <option value="scoping">Scoping &amp; Discovery Only</option>
              <option value="booked">Fully Booked</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Availability Note (Badge text)
            </label>
            <input
              type="text"
              value={formData.availabilityNote}
              onChange={(e) =>
                setFormData({ ...formData, availabilityNote: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Channels */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Contact &amp; Messaging Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Display Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              WhatsApp E.164 (digits only)
            </label>
            <input
              type="text"
              value={formData.phoneE164}
              onChange={(e) =>
                setFormData({ ...formData, phoneE164: e.target.value })
              }
              placeholder="8801994605717"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
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
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
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
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
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
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Visibility Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-bold text-white">Feature Toggles</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showLiveTicker}
              onChange={(e) =>
                setFormData({ ...formData, showLiveTicker: e.target.checked })
              }
              className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
            />
            Show System Feed Ticker at top of page
          </label>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showLive30Days}
              onChange={(e) =>
                setFormData({ ...formData, showLive30Days: e.target.checked })
              }
              className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
            />
            Show Activity &amp; Stats Section
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
