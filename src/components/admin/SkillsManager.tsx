"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Sparkles, X, Brain } from "lucide-react";
import type { SkillCategory, IconName } from "@/lib/db/types";

interface Props {
  initialSkills: SkillCategory[];
}

const ICONS: IconName[] = ["brain", "workflow", "terminal", "chart", "agent", "layers", "zap", "compass"];

export default function SkillsManager({ initialSkills }: Props) {
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillCategory> | null>(null);
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
    setEditingSkill({
      category: "",
      iconName: "brain",
      items: ["n8n", "Python", "OpenAI"],
      order: skills.length + 1,
      published: true,
    });
  };

  const handleOpenEdit = (skill: SkillCategory) => {
    setIsNew(false);
    setEditingSkill({ ...skill });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.category) {
      showToast("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSkill),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save skill category");
        setSkills((prev) => [...prev, data.skill]);
        setEditingSkill(null);
        showToast("Skill category created!");
      } else {
        const res = await fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingSkill),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update skill category");
        setSkills((prev) => prev.map((s) => (s.id === data.skill.id ? data.skill : s)));
        setEditingSkill(null);
        showToast("Skill category updated!");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving skill category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        showToast("Skill category deleted");
      }
    } catch {
      showToast("Failed to delete skill category");
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              TOOLCHAIN &amp; STACK
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">{skills.length} Technical Categories</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Skills &amp; Technical Capabilities
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Organize the core tools, agent architectures, and LLM frameworks powering your systems
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-violet-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Skill Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] space-y-4 hover:border-violet-500/30 transition-all shadow-sm group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  Order #{s.order} · {s.iconName}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {s.category}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-violet-400 hover:text-white hover:bg-violet-600 rounded-lg transition-colors"
                  title="Edit Skill Category"
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
                    title="Delete Skill Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1a202c]">
              {s.items.map((item) => (
                <span
                  key={item}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#141a29] text-[#9ca3af] border border-[#1e2433]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0f111a] border border-[#1e2433] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[#1a202c] bg-[#111827]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold">
                  {isNew ? "Add Skill Category" : "Edit Skill Category"}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {editingSkill.category || "Untitled Category"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="p-2 text-[#6b7280] hover:text-white bg-[#1a202c] rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.category || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  placeholder="e.g. LLMs & Prompt Engineering"
                  className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Icon
                  </label>
                  <select
                    value={editingSkill.iconName || "brain"}
                    onChange={(e) => setEditingSkill({ ...editingSkill, iconName: e.target.value as IconName })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
                  >
                    {ICONS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingSkill.order ?? 1}
                    onChange={(e) => setEditingSkill({ ...editingSkill, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Skills / Tools (comma separated)
                </label>
                <textarea
                  rows={4}
                  value={(editingSkill.items || []).join(", ")}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="n8n, LangChain, OpenAI API, Python, Next.js"
                  className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm font-mono focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1a202c]">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.published ?? true}
                    onChange={(e) => setEditingSkill({ ...editingSkill, published: e.target.checked })}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                  Published
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="px-4 py-2 text-xs text-[#9ca3af] hover:text-white bg-[#141a29] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : isNew ? "Create Category" : "Save Changes"}
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
