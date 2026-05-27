"use client";

import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import type { SiteConfig } from "@/sanity/types";

type Props = {
  initialConfig: SiteConfig | null;
};

export default function SettingsForm({ initialConfig }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    email: initialConfig?.email || "",
    phone: initialConfig?.phone || "",
    phoneE164: initialConfig?.phoneE164 || "",
    availability: initialConfig?.availability || "",
    availabilityNote: initialConfig?.availabilityNote || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while saving settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
        {/* Alert Messages */}
        {message && (
          <div
            className={`flex gap-3 p-4 rounded-lg mb-6 border ${
              message.type === "success"
                ? "bg-emerald-900/20 border-emerald-700/30 text-emerald-200"
                : "bg-red-900/20 border-red-700/30 text-red-200"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Primary Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Used for contact form submissions and public contact pages
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone (Display Format)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1994-605717"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              How your phone number appears on the website
            </p>
          </div>

          {/* Phone E.164 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone (E.164 Format)
            </label>
            <input
              type="tel"
              name="phoneE164"
              value={formData.phoneE164}
              onChange={handleChange}
              placeholder="8801994605717"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              Digits only, used for WhatsApp and tel: links
            </p>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Availability Status
            </label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Available · accepting new engagements"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              Shows on the homepage and contact page
            </p>
          </div>

          {/* Availability Note */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Availability Note
            </label>
            <textarea
              name="availabilityNote"
              value={formData.availabilityNote}
              onChange={handleChange}
              rows={3}
              placeholder="Limited project capacity · Free 30-min systems audit"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600/30 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Additional availability details
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
