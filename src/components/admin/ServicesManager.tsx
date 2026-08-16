"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Service, IconName } from "@/lib/db/types";

interface Props {
  initialServices: Service[];
}

const ICONS: IconName[] = [
  "workflow",
  "bot",
  "spark",
  "chart",
  "agent",
  "brain",
  "layers",
  "terminal",
  "lock",
  "zap",
  "bookmark",
  "compass",
  "rocket",
  "globe",
];

export default function ServicesManager({ initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpenNew = () => {
    setIsNew(true);
    setError(null);
    setSuccess(null);
    setEditingService({
      title: "",
      iconName: "workflow",
      hook: "",
      problem: "",
      solution: "",
      outcome: "",
      bullets: ["", "", ""],
      ctaLabel: "Let's build an automation",
      ctaPrefill: "Hi Arefin! I want to discuss: ",
      isFeatured: false,
      published: true,
      order: services.length,
    });
  };

  const handleOpenEdit = (svc: Service) => {
    setIsNew(false);
    setError(null);
    setSuccess(null);
    setEditingService({ ...svc });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const url = "/api/admin/services";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save service");

      if (isNew) {
        setServices((prev) => [...prev, data.service]);
      } else {
        setServices((prev) =>
          prev.map((s) => (s.id === data.service.id ? data.service : s)),
        );
      }

      setSuccess("Service saved successfully!");
      setTimeout(() => {
        setEditingService(null);
        setSuccess(null);
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete service");
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          Manage your automation and AI development capability offerings.
        </p>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-violet-400 uppercase">
                  Icon: {s.iconName} · Order #{s.order}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{s.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{s.hook}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 rounded-lg bg-violet-950/40 border border-violet-800/80 text-violet-300 hover:bg-violet-900/60 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/80 text-rose-400 hover:bg-rose-900/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-3 border-t border-slate-800">
              <p>
                <strong className="text-slate-400">Problem:</strong> {s.problem}
              </p>
              <p>
                <strong className="text-slate-400">Solution:</strong> {s.solution}
              </p>
              <p>
                <strong className="text-slate-400">Outcome:</strong> {s.outcome}
              </p>
            </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {isNew ? "Create Service" : `Edit Service: ${editingService.title}`}
              </h2>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

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

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ""}
                    onChange={(e) =>
                      setEditingService((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Icon
                  </label>
                  <select
                    value={editingService.iconName || "workflow"}
                    onChange={(e) =>
                      setEditingService((p) => ({
                        ...p,
                        iconName: e.target.value as IconName,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {ICONS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Hook / One-liner
                </label>
                <input
                  type="text"
                  value={editingService.hook || ""}
                  onChange={(e) =>
                    setEditingService((p) => ({ ...p, hook: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Problem Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.problem || ""}
                  onChange={(e) =>
                    setEditingService((p) => ({ ...p, problem: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Solution Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.solution || ""}
                  onChange={(e) =>
                    setEditingService((p) => ({ ...p, solution: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Outcome / Result
                </label>
                <input
                  type="text"
                  value={editingService.outcome || ""}
                  onChange={(e) =>
                    setEditingService((p) => ({ ...p, outcome: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Bullets (One per line)
                </label>
                <textarea
                  rows={3}
                  value={(editingService.bullets || []).join("\n")}
                  onChange={(e) =>
                    setEditingService((p) => ({
                      ...p,
                      bullets: e.target.value.split("\n").filter(Boolean),
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={editingService.ctaLabel || ""}
                    onChange={(e) =>
                      setEditingService((p) => ({ ...p, ctaLabel: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    CTA WhatsApp Prefill
                  </label>
                  <input
                    type="text"
                    value={editingService.ctaPrefill || ""}
                    onChange={(e) =>
                      setEditingService((p) => ({ ...p, ctaPrefill: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.published ?? true}
                    onChange={(e) =>
                      setEditingService((p) => ({
                        ...p,
                        published: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
                  />
                  Published
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-xs text-slate-400 font-mono">Order:</label>
                  <input
                    type="number"
                    value={editingService.order ?? 0}
                    onChange={(e) =>
                      setEditingService((p) => ({
                        ...p,
                        order: Number(e.target.value),
                      }))
                    }
                    className="w-16 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Create Service" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
