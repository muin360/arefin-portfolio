"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Check, Eye, EyeOff, Star } from "lucide-react";
import type { Project, IconName } from "@/lib/db/types";

interface Props {
  initialProjects: Project[];
}

const PROJECT_TYPES = [
  "Personal Project",
  "Learning Project",
  "Automation Project",
  "AI Agent Project",
  "RAG Project",
  "Multi-Agent Project",
  "Voice AI Project",
  "Chatbot Project",
];

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

export default function ProjectsManager({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.stack.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  );

  const handleOpenNew = () => {
    setIsNew(true);
    setError(null);
    setSuccess(null);
    setEditingProject({
      title: "",
      slug: "",
      projectType: "Personal Automation Project",
      category: "AI Automation",
      summary: "",
      problem: "",
      goal: "",
      workflowSteps: [
        { step: "01", name: "Trigger", desc: "" },
        { step: "02", name: "Data Input", desc: "" },
        { step: "03", name: "AI Processing", desc: "" },
        { step: "04", name: "Agent Decision", desc: "" },
        { step: "05", name: "Tool / API", desc: "" },
        { step: "06", name: "Output", desc: "" },
      ],
      aiRole: "",
      automationLogic: "",
      integrations: ["n8n", "OpenAI API"],
      stack: ["n8n", "OpenAI", "Webhooks"],
      learningOutcome: "",
      outcome: "",
      iconName: "workflow",
      featured: false,
      published: true,
      order: projects.length + 1,
      demoUrl: "",
      repoUrl: "",
    });
  };

  const handleOpenEdit = (project: Project) => {
    setIsNew(false);
    setError(null);
    setSuccess(null);
    setEditingProject({ ...project });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.slug) {
      setError("Title and Slug are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const url = "/api/admin/projects";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      if (isNew) {
        setProjects((prev) => [...prev, data.project]);
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === data.project.id ? data.project : p)),
        );
      }

      setSuccess("Project saved successfully!");
      setTimeout(() => {
        setEditingProject(null);
        setSuccess(null);
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting project");
    }
  };

  const handleTogglePublished = async (project: Project) => {
    try {
      const updated = { ...project, published: !project.published };
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? updated : p)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = { ...project, featured: !project.featured };
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? updated : p)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search projects by name, category, or stack..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 flex-1 max-w-md"
        />
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No projects found matching your search.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-base">
                      {p.title}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {p.projectType || p.category}
                    </span>
                    {p.published ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Draft
                      </span>
                    )}
                    {p.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{p.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>slug: /{p.slug}</span>
                    <span>·</span>
                    <span>stack: {p.stack.join(", ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    title={p.featured ? "Unfeature" : "Feature on Homepage"}
                    className={`p-2 rounded-lg border transition-colors ${
                      p.featured
                        ? "bg-amber-950/40 border-amber-800 text-amber-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleTogglePublished(p)}
                    title={p.published ? "Unpublish" : "Publish"}
                    className={`p-2 rounded-lg border transition-colors ${
                      p.published
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <a
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live page"
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleOpenEdit(p)}
                    title="Edit project"
                    className="p-2 rounded-lg bg-violet-950/40 border border-violet-800/80 text-violet-300 hover:bg-violet-900/60 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    title="Delete project"
                    className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/80 text-rose-400 hover:bg-rose-900/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {isNew ? "Create Project" : `Edit: ${editingProject.title}`}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
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

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = isNew
                        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                        : editingProject.slug;
                      setEditingProject((p) => ({ ...p, title, slug }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, slug: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Project Type
                  </label>
                  <select
                    value={editingProject.projectType || PROJECT_TYPES[0]}
                    onChange={(e) =>
                      setEditingProject((p) => ({
                        ...p,
                        projectType: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingProject.category || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Icon
                  </label>
                  <select
                    value={editingProject.iconName || "workflow"}
                    onChange={(e) =>
                      setEditingProject((p) => ({
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
                  Summary
                </label>
                <textarea
                  rows={2}
                  value={editingProject.summary || ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({ ...p, summary: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.problem || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, problem: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Project Goal
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.goal || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, goal: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Workflow Steps Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-slate-400">
                    Execution Workflow Steps (Trigger → Decision → Output)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingProject.workflowSteps || [];
                      const stepNum = String(cur.length + 1).padStart(2, "0");
                      setEditingProject((p) => ({
                        ...p,
                        workflowSteps: [
                          ...cur,
                          { step: stepNum, name: "Step", desc: "" },
                        ],
                      }));
                    }}
                    className="text-xs text-violet-400 hover:text-violet-300 font-mono"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(editingProject.workflowSteps || []).map((st, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 relative"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={st.step}
                          onChange={(e) => {
                            const steps = [...(editingProject.workflowSteps || [])];
                            steps[i] = { ...steps[i], step: e.target.value };
                            setEditingProject((p) => ({ ...p, workflowSteps: steps }));
                          }}
                          className="w-12 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-violet-300 font-mono text-center"
                        />
                        <input
                          type="text"
                          placeholder="Step Name (e.g. Trigger)"
                          value={st.name}
                          onChange={(e) => {
                            const steps = [...(editingProject.workflowSteps || [])];
                            steps[i] = { ...steps[i], name: e.target.value };
                            setEditingProject((p) => ({ ...p, workflowSteps: steps }));
                          }}
                          className="flex-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const steps = (editingProject.workflowSteps || []).filter(
                              (_, idx) => idx !== i,
                            );
                            setEditingProject((p) => ({ ...p, workflowSteps: steps }));
                          }}
                          className="text-slate-500 hover:text-rose-400 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Description of this node's action..."
                        value={st.desc}
                        onChange={(e) => {
                          const steps = [...(editingProject.workflowSteps || [])];
                          steps[i] = { ...steps[i], desc: e.target.value };
                          setEditingProject((p) => ({ ...p, workflowSteps: steps }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    AI Role &amp; Processing
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.aiRole || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, aiRole: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Automation Logic &amp; Connectors
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.automationLogic || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({
                        ...p,
                        automationLogic: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  What I Learned (Learning Outcome)
                </label>
                <textarea
                  rows={2}
                  value={editingProject.learningOutcome || ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({
                      ...p,
                      learningOutcome: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.stack || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject((p) => ({
                        ...p,
                        stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    placeholder="n8n, LangChain, Python, OpenAI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Integrations (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.integrations || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject((p) => ({
                        ...p,
                        integrations: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    placeholder="Gmail API, Slack, Notion API"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Repository URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.repoUrl || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, repoUrl: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.demoUrl || ""}
                    onChange={(e) =>
                      setEditingProject((p) => ({ ...p, demoUrl: e.target.value }))
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.published ?? true}
                    onChange={(e) =>
                      setEditingProject((p) => ({
                        ...p,
                        published: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
                  />
                  Published (Visible on site)
                </label>

                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured ?? false}
                    onChange={(e) =>
                      setEditingProject((p) => ({
                        ...p,
                        featured: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
                  />
                  Featured on Homepage
                </label>

                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-xs text-slate-400 font-mono">Order:</label>
                  <input
                    type="number"
                    value={editingProject.order ?? 1}
                    onChange={(e) =>
                      setEditingProject((p) => ({
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
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
