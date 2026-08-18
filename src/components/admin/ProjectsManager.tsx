"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Copy,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import type { Project, WorkflowStep, WorkflowStepType } from "@/lib/db/types";

interface Props {
  initialProjects: Project[];
}

const STEP_TYPES: Array<{ value: WorkflowStepType; label: string }> = [
  { value: "trigger", label: "Trigger (Webhook / Event)" },
  { value: "input", label: "Data Input (Payload / Validation)" },
  { value: "ai", label: "AI Reasoning (LLM / Embeddings)" },
  { value: "agent", label: "Agent Router (Decision / Loop)" },
  { value: "tool", label: "Tool / API (Connector / Action)" },
  { value: "database", label: "Database / Vector (Persistence)" },
  { value: "decision", label: "Decision Logic (Condition / Guard)" },
  { value: "output", label: "Output / Handoff (Notification / Delivery)" },
];

const PROJECT_TYPES = [
  "Personal Automation Project",
  "AI Agent Project",
  "RAG Project",
  "Multi-Agent Project",
  "Learning Project",
  "Voice AI Project",
  "Chatbot Project",
  "E-Commerce Automation",
];


const CATEGORIES = [
  "AI Automation",
  "AI Agent",
  "RAG Assistant",
  "Multi-Agent",
  "AI Workflow",
  "AI Chatbot",
  "Voice AI",
  "E-Commerce Bot",
];

export default function ProjectsManager({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "featured">("all");
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "story" | "workflow" | "media" | "stack" | "relations" | "seo" | "publishing"
  >("overview");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New tag chip inputs
  const [newIntegration, setNewIntegration] = useState("");
  const [newStackTag, setNewStackTag] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && p.published) ||
        (statusFilter === "draft" && !p.published) ||
        (statusFilter === "featured" && p.featured);

      return matchSearch && matchCat && matchStatus;
    });
  }, [projects, search, categoryFilter, statusFilter]);

  const handleOpenNew = () => {
    setIsNew(true);
    setActiveTab("overview");
    setEditingProject({
      title: "",
      slug: "",
      projectType: "Personal Automation Project",
      category: "AI Automation",
      summary: "",
      problem: "",
      goal: "",
      workflowSteps: [
        { step: "01", name: "Trigger", desc: "Webhook or scheduled event initiates the pipeline" },
        { step: "02", name: "Data Input", desc: "Extract payload and normalize schema" },
        { step: "03", name: "AI Processing", desc: "LLM reasoning, classification, or context retrieval" },
        { step: "04", name: "Agent Decision", desc: "Confidence check and conditional routing logic" },
        { step: "05", name: "Tool / API", desc: "External service execution and structured update" },
        { step: "06", name: "Output / Handoff", desc: "Notification dispatch or human-in-the-loop review" },
      ],
      aiRole: "",
      automationLogic: "",
      integrations: ["n8n", "OpenAI API", "Webhooks"],
      stack: ["n8n", "OpenAI", "Webhooks", "JSON"],
      learningOutcome: "",
      outcome: "",
      iconName: "workflow",
      featured: false,
      published: true,
      order: projects.length + 1,
      demoUrl: "",
      repoUrl: "",
      coverImage: "",
      workflowImage: "",
      architectureImage: "",
      gallery: [],
      videoUrl: "",
      videoPoster: "",
      altText: "",
    });
  };

  const handleOpenEdit = (project: Project) => {
    setIsNew(false);
    setActiveTab("overview");
    setEditingProject({ ...project });
  };

  const handleDuplicate = (project: Project) => {
    setIsNew(true);
    setActiveTab("overview");
    setEditingProject({
      ...project,
      id: undefined,
      title: `${project.title} (Copy)`,
      slug: `${project.slug}-copy`,
      published: false,
      featured: false,
      order: projects.length + 1,
    });
    showToast("Project duplicated as draft");
  };

  const generateSlug = () => {
    if (!editingProject?.title) return;
    const slug = editingProject.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setEditingProject((prev) => (prev ? { ...prev, slug } : null));
  };

  const saveProjectWithStatus = async (publishedState?: boolean) => {
    if (!editingProject?.title || !editingProject?.slug) {
      showToast("Title and Slug are required.");
      return;
    }

    const payload = {
      ...editingProject,
      published: publishedState !== undefined ? publishedState : (editingProject.published ?? true),
    };

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create project");
        setProjects((prev) => [data.project, ...prev]);
        setEditingProject(null);
        showToast(publishedState === false ? "Draft saved successfully!" : "Project published successfully!");
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update project");
        setProjects((prev) => prev.map((p) => (p.id === data.project.id ? data.project : p)));
        setEditingProject(null);
        showToast("Project updated successfully!");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProjectWithStatus();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      showToast("Project deleted.");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error deleting project");
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const updated = { ...project, published: !project.published };
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p)));
      showToast(`Project ${updated.published ? "published live" : "moved to drafts"}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  const handleAddStep = () => {
    if (!editingProject) return;
    const currentSteps = editingProject.workflowSteps || [];
    const nextIdx = (currentSteps.length + 1).toString().padStart(2, "0");
    const newStep: WorkflowStep = {
      step: nextIdx,
      type: currentSteps.length === 0 ? "trigger" : "tool",
      name: "",
      desc: "",
      tool: "",
    };
    setEditingProject({
      ...editingProject,
      workflowSteps: [...currentSteps, newStep],
    });
  };

  const handleRemoveStep = (idx: number) => {
    if (!editingProject?.workflowSteps) return;
    const updated = editingProject.workflowSteps.filter((_, i) => i !== idx);
    setEditingProject({ ...editingProject, workflowSteps: updated });
  };

  const handleStepChange = (idx: number, field: keyof WorkflowStep, val: string) => {
    if (!editingProject?.workflowSteps) return;
    const updated = [...editingProject.workflowSteps];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditingProject({ ...editingProject, workflowSteps: updated });
  };

  const handleMoveStep = (idx: number, dir: "up" | "down") => {
    if (!editingProject?.workflowSteps) return;
    const steps = [...editingProject.workflowSteps];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const temp = steps[idx];
    steps[idx] = steps[targetIdx];
    steps[targetIdx] = temp;
    setEditingProject({ ...editingProject, workflowSteps: steps });
  };

  const addIntegration = () => {
    if (!newIntegration.trim() || !editingProject) return;
    const current = editingProject.integrations || [];
    if (!current.includes(newIntegration.trim())) {
      setEditingProject({ ...editingProject, integrations: [...current, newIntegration.trim()] });
    }
    setNewIntegration("");
  };

  const removeIntegration = (tag: string) => {
    if (!editingProject?.integrations) return;
    setEditingProject({
      ...editingProject,
      integrations: editingProject.integrations.filter((t) => t !== tag),
    });
  };

  const addStackTag = () => {
    if (!newStackTag.trim() || !editingProject) return;
    const current = editingProject.stack || [];
    if (!current.includes(newStackTag.trim())) {
      setEditingProject({ ...editingProject, stack: [...current, newStackTag.trim()] });
    }
    setNewStackTag("");
  };

  const removeStackTag = (tag: string) => {
    if (!editingProject?.stack) return;
    setEditingProject({
      ...editingProject,
      stack: editingProject.stack.filter((t) => t !== tag),
    });
  };

  const addGalleryItem = () => {
    if (!newGalleryUrl.trim() || !editingProject) return;
    const current = editingProject.gallery || [];
    if (!current.includes(newGalleryUrl.trim())) {
      setEditingProject({ ...editingProject, gallery: [...current, newGalleryUrl.trim()] });
    }
    setNewGalleryUrl("");
  };

  const removeGalleryItem = (url: string) => {
    if (!editingProject?.gallery) return;
    setEditingProject({
      ...editingProject,
      gallery: editingProject.gallery.filter((g) => g !== url),
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-violet-600 text-white rounded-2xl text-xs font-mono font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast}
        </div>
      )}

      {/* Control Bar: Filters, Search, Create */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0f111a] border border-[#1e2433] p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, stack, slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-[#9ca3af] focus:outline-none focus:border-violet-500 font-mono"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Buttons & Create CTA */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center bg-[#141a29] border border-[#1e2433] rounded-xl p-1 text-[11px] font-mono">
            {[
              { id: "all", label: "All" },
              { id: "published", label: "Live" },
              { id: "draft", label: "Drafts" },
              { id: "featured", label: "Featured" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id as typeof statusFilter)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === st.id
                    ? "bg-violet-600 text-white font-bold shadow"
                    : "text-[#6b7280] hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Projects", val: projects.length },
          { label: "Published Live", val: projects.filter((p) => p.published).length },
          { label: "Draft Projects", val: projects.filter((p) => !p.published).length },
          { label: "Featured Anchors", val: projects.filter((p) => p.featured).length },
        ].map((s) => (
          <div key={s.label} className="bg-[#0f111a] border border-[#1e2433] p-3.5 rounded-xl">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#6b7280]">{s.label}</p>
            <p className="text-xl font-bold text-white mt-1 font-mono">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6b7280] font-mono">
            No projects found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#1e2433] text-[#6b7280] uppercase text-[10px] font-mono bg-[#0b0e17]">
                  <th className="py-3.5 pl-5 font-semibold">Project Title</th>
                  <th className="py-3.5 font-semibold">Category</th>
                  <th className="py-3.5 font-semibold">Stack Preview</th>
                  <th className="py-3.5 font-semibold text-center">Status</th>
                  <th className="py-3.5 font-semibold text-center">Featured</th>
                  <th className="py-3.5 pr-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2433]/60">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#141a29]/40 transition-colors group">
                    <td className="py-3.5 pl-5 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                          <Workflow className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate group-hover:text-violet-300 transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[11px] text-[#6b7280] font-mono truncate">/{p.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#161d2d] text-[#9ca3af] border border-[#252f44]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono text-[11px] text-[#9ca3af]">
                      <span className="truncate max-w-xs block">
                        {p.stack.slice(0, 3).join(", ")} {p.stack.length > 3 ? `+${p.stack.length - 3}` : ""}
                      </span>
                    </td>

                    <td className="py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all ${
                          p.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-[#1e2433] text-[#6b7280] border border-[#2d3748]"
                        }`}
                      >
                        {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.published ? "Live" : "Draft"}
                      </button>
                    </td>

                    <td className="py-3.5 text-center">
                      {p.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
                      ) : (
                        <span className="text-[#4b5563] text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/projects/${p.slug}?preview=true`}
                          target="_blank"
                          className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1e2433] rounded-lg transition-colors"
                          title="Preview Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1e2433] rounded-lg transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-violet-400 hover:text-white hover:bg-violet-600 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded font-mono text-[10px]"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-[#1e2433] text-white rounded font-mono text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-[#6b7280] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 8-TAB PROJECT EDITOR MODAL ── */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0f111a] border border-[#1e2433] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1a202c] bg-[#111827]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold">
                  {isNew ? "Create Project" : "Edit Project"}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {editingProject.title || "Untitled Project"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-2 text-[#6b7280] hover:text-white bg-[#1a202c] hover:bg-[#252f44] rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 8-Tab Navigation Bar */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#1a202c] bg-[#0b0e17] overflow-x-auto scrollbar-none">
              {[
                { id: "overview", label: "1. Overview" },
                { id: "story", label: "2. Story & Logic" },
                { id: "workflow", label: "3. Workflow" },
                { id: "media", label: "4. Media & Diagrams" },
                { id: "stack", label: "5. Tech Stack" },
                { id: "relations", label: "6. Relations" },
                { id: "seo", label: "7. SEO Preview" },
                { id: "publishing", label: "8. Publishing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-violet-500 text-white bg-[#0f111a]"
                      : "border-transparent text-[#6b7280] hover:text-white hover:bg-[#141a29]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[65vh] space-y-5 custom-scrollbar">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. Email Automation & Smart Triage"
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                          Slug URL *
                        </label>
                        <button
                          type="button"
                          onClick={generateSlug}
                          className="text-[10px] text-violet-400 hover:text-violet-300 font-mono"
                        >
                          Auto Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={editingProject.slug || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        placeholder="email-automation-triage"
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Project Type
                      </label>
                      <select
                        value={editingProject.projectType || PROJECT_TYPES[0]}
                        onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                      >
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Summary (Headline description for cards)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingProject.summary || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                      placeholder="High-intent automation classifying incoming tickets and generating structured drafts..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Key Outcome Quote
                    </label>
                    <input
                      type="text"
                      value={editingProject.outcome || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, outcome: e.target.value })}
                      placeholder="Reduced triage response latency from 4 hours to 12 seconds."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STORY & LOGIC */}
              {activeTab === "story" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Problem Statement
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.problem || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                        placeholder="What bottleneck was occurring?"
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Project Goal
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.goal || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, goal: e.target.value })}
                        placeholder="What is the automation engineered to accomplish?"
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        AI Role &amp; Processing Logic
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.aiRole || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, aiRole: e.target.value })}
                        placeholder="How LLMs, structured outputs, or vector embeddings are used..."
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Automation Connectors &amp; Routing
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.automationLogic || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, automationLogic: e.target.value })}
                        placeholder="n8n webhook triggers, error handling loops, retry logic..."
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      What I Learned / Technical Takeaways
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.learningOutcome || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, learningOutcome: e.target.value })}
                      placeholder="Key engineering learnings and production architecture takeaways..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: WORKFLOW ARCHITECTURE & BUILD EXPLORER */}
              {activeTab === "workflow" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-mono uppercase text-violet-400 font-semibold tracking-wider">
                        Workflow &amp; Build Explorer Steps
                      </h3>
                      <p className="text-xs text-[#6b7280]">
                        Configure the interactive execution pipeline (Trigger → Data → AI → Agent → Tools → Database → Output) shown on the public project page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#141a29] hover:bg-[#1e2433] text-violet-400 text-xs font-semibold rounded-xl border border-violet-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Step</span>
                    </button>
                  </div>

                  {(!editingProject.workflowSteps || editingProject.workflowSteps.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-[#141a29] border border-dashed border-[#1e2433] text-center space-y-2">
                      <p className="text-xs text-[#9ca3af]">No workflow steps configured for this project.</p>
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add First Execution Step</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingProject.workflowSteps.map((st, i) => (
                        <div
                          key={i}
                          className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-violet-600/20 text-violet-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                0{i + 1}
                              </span>
                              <span className="text-xs font-mono text-[#9ca3af] uppercase font-semibold">
                                Step Stage {i + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={i === 0}
                                onClick={() => handleMoveStep(i, "up")}
                                className="p-1 text-[#6b7280] hover:text-white bg-[#0f111a] hover:bg-[#1a202c] disabled:opacity-30 rounded transition-colors"
                                title="Move Step Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={i === (editingProject.workflowSteps?.length || 1) - 1}
                                onClick={() => handleMoveStep(i, "down")}
                                className="p-1 text-[#6b7280] hover:text-white bg-[#0f111a] hover:bg-[#1a202c] disabled:opacity-30 rounded transition-colors"
                                title="Move Step Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveStep(i)}
                                className="p-1 text-[#6b7280] hover:text-rose-400 bg-[#0f111a] hover:bg-rose-500/10 rounded transition-colors ml-1"
                                title="Delete Step"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                                Stage Type
                              </label>
                              <select
                                value={st.type || "tool"}
                                onChange={(e) =>
                                  handleStepChange(i, "type", e.target.value as WorkflowStepType)
                                }
                                className="w-full px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                              >
                                {STEP_TYPES.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                                Step Name / Title *
                              </label>
                              <input
                                type="text"
                                value={st.name || st.title || ""}
                                onChange={(e) => handleStepChange(i, "name", e.target.value)}
                                placeholder="e.g. LLM Reasoning & Intent Classification"
                                className="w-full px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                                Tool / Tech Used
                              </label>
                              <input
                                type="text"
                                value={st.tool || ""}
                                onChange={(e) => handleStepChange(i, "tool", e.target.value)}
                                placeholder="e.g. OpenAI GPT-4o, n8n, Pinecone"
                                className="w-full px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                                Detailed Step Description
                              </label>
                              <input
                                type="text"
                                value={st.desc || st.description || ""}
                                onChange={(e) => handleStepChange(i, "desc", e.target.value)}
                                placeholder="Describe what happens during this architecture step..."
                                className="w-full px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-[#9ca3af] text-xs focus:outline-none focus:border-violet-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MEDIA & DIAGRAMS */}
              {activeTab === "media" && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* Cover Image */}
                  <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-violet-400 font-semibold tracking-wider">
                        Cover Image
                      </label>
                      {editingProject.coverImage && (
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, coverImage: "" })}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-mono"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={editingProject.coverImage || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                      placeholder="https://example.com/cover-architecture.png"
                      className="w-full px-3.5 py-2.5 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                    <input
                      type="text"
                      value={editingProject.altText || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, altText: e.target.value })}
                      placeholder="Accessibility alt text describing the cover architecture"
                      className="w-full px-3.5 py-2 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                    />
                    {editingProject.coverImage && (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingProject.coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Workflow & Architecture Diagram URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-2">
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                        Workflow Map Diagram
                      </label>
                      <input
                        type="url"
                        value={editingProject.workflowImage || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, workflowImage: e.target.value })}
                        placeholder="https://example.com/workflow-map.png"
                        className="w-full px-3.5 py-2 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                      />
                      {editingProject.workflowImage && (
                        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-white/10 bg-black mt-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingProject.workflowImage}
                            alt="Workflow diagram preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-2">
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                        Infrastructure Architecture Diagram
                      </label>
                      <input
                        type="url"
                        value={editingProject.architectureImage || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, architectureImage: e.target.value })}
                        placeholder="https://example.com/architecture.png"
                        className="w-full px-3.5 py-2 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                      />
                      {editingProject.architectureImage && (
                        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-white/10 bg-black mt-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingProject.architectureImage}
                            alt="Architecture preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-Image Gallery */}
                  <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-3">
                    <label className="block text-xs font-mono uppercase text-violet-400 font-semibold tracking-wider">
                      Interface &amp; Logs Gallery
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryItem())}
                        placeholder="Add gallery image URL (https://...)..."
                        className="flex-1 px-3.5 py-2 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={addGalleryItem}
                        className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold"
                      >
                        Add Photo
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(editingProject.gallery || []).map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 bg-black group h-24">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(img)}
                            className="absolute top-1 right-1 p-1 bg-black/80 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demo Video URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                        Demo Video Embed / Direct URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.videoUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                        Video Poster Thumbnail URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.videoPoster || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, videoPoster: e.target.value })}
                        placeholder="https://example.com/poster.jpg"
                        className="w-full px-3.5 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TECH STACK */}
              {activeTab === "stack" && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* Tool Integrations */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Tool Integrations
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={newIntegration}
                        onChange={(e) => setNewIntegration(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIntegration())}
                        placeholder="e.g. Pinecone, Slack, n8n..."
                        className="flex-1 px-3 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={addIntegration}
                        className="px-3 py-2 bg-[#1e2433] hover:bg-[#252f44] text-white rounded-xl text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(editingProject.integrations || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#161d2d] border border-[#252f44] text-violet-300"
                        >
                          {tag}
                          <button type="button" onClick={() => removeIntegration(tag)}>
                            <X className="w-3 h-3 hover:text-white" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Technology Stack
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={newStackTag}
                        onChange={(e) => setNewStackTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStackTag())}
                        placeholder="e.g. Python, LangChain, OpenAI..."
                        className="flex-1 px-3 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={addStackTag}
                        className="px-3 py-2 bg-[#1e2433] hover:bg-[#252f44] text-white rounded-xl text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(editingProject.stack || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#161d2d] border border-[#252f44] text-emerald-300"
                        >
                          {tag}
                          <button type="button" onClick={() => removeStackTag(tag)}>
                            <X className="w-3 h-3 hover:text-white" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: RELATIONS */}
              {activeTab === "relations" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-2">
                    <h3 className="text-xs font-mono uppercase text-violet-400 font-semibold tracking-wider">
                      Connected Architecture Relationships
                    </h3>
                    <p className="text-xs text-[#6b7280]">
                      Cross-link this project to relevant capabilities and case studies across the site.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Linked Project Slugs (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={(editingProject.relatedProjectIds || []).join(", ")}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          relatedProjectIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="customer-support-qa-bot, social-media-content-generator"
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Linked Capability Names / IDs (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={(editingProject.relatedServiceIds || []).join(", ")}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          relatedServiceIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="AI Workflow Automation, AI Agents & Tool Calling"
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 7: SEO PREVIEW */}
              {activeTab === "seo" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280]">
                      Google SERP &amp; OpenGraph Snippet Preview
                    </span>
                    <div className="p-4 bg-[#0a0d18] rounded-xl border border-white/10 space-y-1">
                      <p className="text-[11px] font-mono text-[#22c55e]">
                        https://tensorstudio.vercel.app &rsaquo; projects &rsaquo; {editingProject.slug || "project-slug"}
                      </p>
                      <h4 className="text-base text-[#93c5fd] font-medium hover:underline cursor-pointer">
                        {editingProject.title || "Project Title"} — Arefin Mueen
                      </h4>
                      <p className="text-xs text-[#9ca3af] leading-relaxed line-clamp-2">
                        {editingProject.summary || "Project summary description will render here for search engine crawlers."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: PUBLISHING & ACTIONS */}
              {activeTab === "publishing" && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Live Demo URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={editingProject.demoUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                        placeholder="https://demo.example.com"
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        GitHub Repo URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={editingProject.repoUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, repoUrl: e.target.value })}
                        placeholder="https://github.com/arefinmuin/repo"
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.published ?? true}
                          onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                          className="w-4 h-4 accent-violet-600 rounded"
                        />
                        <span className="text-xs text-white font-medium">Published Live</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.featured ?? false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 accent-violet-600 rounded"
                        />
                        <span className="text-xs text-white font-medium">Featured Flagship</span>
                      </label>
                    </div>

                    {editingProject.slug && (
                      <Link
                        href={`/projects/${editingProject.slug}?preview=true`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 text-xs font-mono text-violet-300 hover:text-white border border-violet-500/30 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview Live Design</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Footer with Save Draft / Preview / Publish buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-[#1a202c]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 text-xs text-[#9ca3af] hover:text-white bg-[#141a29] hover:bg-[#1a202c] rounded-xl transition-colors font-medium text-center"
                >
                  Cancel
                </button>

                <div className="flex items-center justify-end gap-2.5">
                  {editingProject.slug && (
                    <Link
                      href={`/projects/${editingProject.slug}?preview=true`}
                      target="_blank"
                      className="px-4 py-2.5 bg-[#141a29] hover:bg-[#1e2433] text-white border border-[#2d3748] rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
                      <span>Preview</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveProjectWithStatus(false)}
                    className="px-4 py-2.5 bg-[#1e2433] hover:bg-[#252f44] text-white rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveProjectWithStatus(true)}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : isNew ? "Publish Project" : "Save & Publish"}
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
