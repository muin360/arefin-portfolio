"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
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
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenNew = () => {
    setIsNew(true);
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
      order: services.length + 1,
    });
  };

  const handleOpenEdit = (svc: Service) => {
    setIsNew(false);
    setEditingService({ ...svc });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      showToast("Title is required.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingService),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create service");
        setServices((prev) => [...prev, data.service]);
        setEditingService(null);
        showToast("Service offering created!");
      } else {
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingService),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update service");
        setServices((prev) => prev.map((s) => (s.id === data.service.id ? data.service : s)));
        setEditingService(null);
        showToast("Service offering updated!");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        showToast("Service deleted");
      }
    } catch {
      showToast("Failed to delete service");
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              SERVICE OFFERINGS
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">{services.length} Active Capabilities</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Services &amp; Capabilities
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Manage your AI automations, agent engineering, and advisory capability packages
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-violet-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] space-y-4 hover:border-violet-500/30 transition-all group shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider">
                  Icon: {s.iconName} · Order #{s.order}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-violet-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">{s.hook}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-violet-400 hover:text-white hover:bg-violet-600 rounded-lg transition-colors"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {deleteConfirmId === s.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-mono"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-0.5 bg-[#1e2433] text-[#9ca3af] rounded text-[10px] font-mono"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(s.id)}
                    className="p-1.5 text-[#6b7280] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-[#9ca3af] space-y-1.5 pt-3 border-t border-[#1a202c]">
              <p>
                <strong className="text-white font-medium">Problem:</strong> {s.problem}
              </p>
              <p>
                <strong className="text-white font-medium">Solution:</strong> {s.solution}
              </p>
              <p>
                <strong className="text-white font-medium">Outcome:</strong> {s.outcome}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0f111a] border border-[#1e2433] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[#1a202c] bg-[#111827]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold">
                  {isNew ? "Create Service Offering" : "Edit Service Offering"}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {editingService.title || "Untitled Service"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-2 text-[#6b7280] hover:text-white bg-[#1a202c] rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[70vh] space-y-4 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ""}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Icon Identifier
                  </label>
                  <select
                    value={editingService.iconName || "workflow"}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value as IconName })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
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
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Hook / One-liner
                </label>
                <input
                  type="text"
                  value={editingService.hook || ""}
                  onChange={(e) => setEditingService({ ...editingService, hook: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Problem Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.problem || ""}
                  onChange={(e) => setEditingService({ ...editingService, problem: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Solution Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.solution || ""}
                  onChange={(e) => setEditingService({ ...editingService, solution: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Outcome / Deliverable
                </label>
                <input
                  type="text"
                  value={editingService.outcome || ""}
                  onChange={(e) => setEditingService({ ...editingService, outcome: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Key Bullet Points (One per line)
                </label>
                <textarea
                  rows={3}
                  value={(editingService.bullets || []).join("\n")}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      bullets: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={editingService.ctaLabel || ""}
                    onChange={(e) => setEditingService({ ...editingService, ctaLabel: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    WhatsApp Prefill Message
                  </label>
                  <input
                    type="text"
                    value={editingService.ctaPrefill || ""}
                    onChange={(e) => setEditingService({ ...editingService, ctaPrefill: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1a202c]">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.published ?? true}
                    onChange={(e) => setEditingService({ ...editingService, published: e.target.checked })}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                  Published Live
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 text-xs text-[#9ca3af] hover:text-white bg-[#141a29] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : isNew ? "Create Service" : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
