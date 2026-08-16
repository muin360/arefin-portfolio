"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpenNew = () => {
    setIsNew(true);
    setError(null);
    setSuccess(null);
    setEditingSkill({
      category: "",
      iconName: "brain",
      items: ["", "", ""],
      order: skills.length,
      published: true,
    });
  };

  const handleOpenEdit = (skill: SkillCategory) => {
    setIsNew(false);
    setError(null);
    setSuccess(null);
    setEditingSkill({ ...skill });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.category) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const url = "/api/admin/skills";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save skill category");

      if (isNew) {
        setSkills((prev) => [...prev, data.skill]);
      } else {
        setSkills((prev) =>
          prev.map((s) => (s.id === data.skill.id ? data.skill : s)),
        );
      }

      setSuccess("Skill category saved successfully!");
      setTimeout(() => {
        setEditingSkill(null);
        setSuccess(null);
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving skill category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete skill category");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting skill category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          Manage your categorized skills, toolchains, and technical capabilities.
        </p>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-violet-400 uppercase">
                  Order #{s.order} · {s.iconName}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{s.category}</h3>
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

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
              {s.items.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {isNew ? "Add Skill Category" : `Edit: ${editingSkill.category}`}
              </h2>
              <button
                onClick={() => setEditingSkill(null)}
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
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.category || ""}
                  onChange={(e) =>
                    setEditingSkill((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Icon
                </label>
                <select
                  value={editingSkill.iconName || "brain"}
                  onChange={(e) =>
                    setEditingSkill((p) => ({
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

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Skills / Tools (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={(editingSkill.items || []).join(", ")}
                  onChange={(e) =>
                    setEditingSkill((p) => ({
                      ...p,
                      items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="n8n, LangChain, OpenAI, Python"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.published ?? true}
                    onChange={(e) =>
                      setEditingSkill((p) => ({
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
                    value={editingSkill.order ?? 0}
                    onChange={(e) =>
                      setEditingSkill((p) => ({
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
                  onClick={() => setEditingSkill(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Create Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
