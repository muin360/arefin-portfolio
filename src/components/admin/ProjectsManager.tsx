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
  Check,
  ArrowRight,
  Layers,
  Sparkles,
  Bot,
  Zap,
  Code,
  Link as LinkIcon,
  X,
  ChevronDown,
  ChevronUp,
  Workflow,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import type { Project, IconName, WorkflowStep } from "@/lib/db/types";

interface Props {
  initialProjects: Project[];
}

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
  const [activeTab, setActiveTab] = useState<"basic" | "problem" | "workflow" | "stack" | "links">("basic");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New tag chip inputs
  const [newIntegration, setNewIntegration] = useState("");
  const [newStackTag, setNewStackTag] = useState("");

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
    setActiveTab("basic");
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
    });
  };

  const handleOpenEdit = (project: Project) => {
    setIsNew(false);
    setActiveTab("basic");
    setEditingProject({ ...project });
  };

  const handleDuplicate = (project: Project) => {
    setIsNew(true);
    setActiveTab("basic");
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.slug) {
      showToast("Title and Slug are required.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create project");
        setProjects((prev) => [data.project, ...prev]);
        setEditingProject(null);
        showToast("Project created successfully!");
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
        showToast("Project deleted permanently");
      }
    } catch {
      showToast("Failed to delete project");
    }
  };

  const handleTogglePublish = async (p: Project) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, published: !p.published }),
      });
      if (res.ok) {
        setProjects((prev) => prev.map((item) => (item.id === p.id ? { ...item, published: !p.published } : item)));
        showToast(p.published ? "Project unpublished" : "Project published live");
      }
    } catch {
      showToast("Failed to toggle publish status");
    }
  };

  const handleStepChange = (index: number, field: keyof WorkflowStep, value: string) => {
    if (!editingProject?.workflowSteps) return;
    const steps = [...editingProject.workflowSteps];
    steps[index] = { ...steps[index], [field]: value };
    setEditingProject({ ...editingProject, workflowSteps: steps });
  };

  const handleAddStep = () => {
    if (!editingProject) return;
    const current = editingProject.workflowSteps || [];
    const num = (current.length + 1).toString().padStart(2, "0");
    setEditingProject({
      ...editingProject,
      workflowSteps: [...current, { step: num, name: "New Step", desc: "Step description..." }],
    });
  };

  const handleRemoveStep = (index: number) => {
    if (!editingProject?.workflowSteps) return;
    const steps = editingProject.workflowSteps
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, step: (idx + 1).toString().padStart(2, "0") }));
    setEditingProject({ ...editingProject, workflowSteps: steps });
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    if (!editingProject?.workflowSteps) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= editingProject.workflowSteps.length) return;
    const steps = [...editingProject.workflowSteps];
    const temp = steps[index];
    steps[index] = steps[target];
    steps[target] = temp;
    const reindexed = steps.map((s, idx) => ({ ...s, step: (idx + 1).toString().padStart(2, "0") }));
    setEditingProject({ ...editingProject, workflowSteps: reindexed });
  };

  // Tag helpers
  const addIntegration = () => {
    if (!newIntegration.trim() || !editingProject) return;
    const current = editingProject.integrations || [];
    if (!current.includes(newIntegration.trim())) {
      setEditingProject({ ...editingProject, integrations: [...current, newIntegration.trim()] });
    }
    setNewIntegration("");
  };

  const removeIntegration = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      integrations: (editingProject.integrations || []).filter((t) => t !== tag),
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
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      stack: (editingProject.stack || []).filter((t) => t !== tag),
    });
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161d2d] border border-violet-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toast}
        </div>
      )}

      {/* ── HEADER WITH ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f111a] p-6 rounded-3xl border border-[#1e2433] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
              CONTENT MANAGEMENT
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">{projects.length} Total Projects</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Projects &amp; Case Studies
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Manage your hands-on AI automations, autonomous agents, and multi-agent case studies
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-violet-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0f111a] p-4 rounded-2xl border border-[#1e2433]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, categories, stack..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-[#9ca3af] focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-[#141a29] p-1 rounded-xl border border-[#1e2433] overflow-x-auto">
          {(["all", "published", "draft", "featured"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-[#9ca3af] hover:text-white hover:bg-[#1a202c]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROJECTS TABLE ── */}
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
                    {/* Title & Slug */}
                    <td className="py-3.5 pl-5 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                          <Workflow className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate group-hover:text-violet-300 transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[11px] text-[#6b7280] font-mono truncate">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#161d2d] text-[#9ca3af] border border-[#252f44]">
                        {p.category}
                      </span>
                    </td>

                    {/* Stack */}
                    <td className="py-3.5 font-mono text-[11px] text-[#9ca3af]">
                      <span className="truncate max-w-xs block">
                        {p.stack.slice(0, 3).join(", ")} {p.stack.length > 3 ? `+${p.stack.length - 3}` : ""}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all ${
                          p.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-[#1e2433] text-[#6b7280] border border-[#2d3748] hover:text-white"
                        }`}
                      >
                        {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.published ? "Live" : "Draft"}
                      </button>
                    </td>

                    {/* Featured Status */}
                    <td className="py-3.5 text-center">
                      {p.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
                      ) : (
                        <span className="text-[#4b5563] text-xs">—</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Live Preview link */}
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1e2433] rounded-lg transition-colors"
                          title="Preview Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1e2433] rounded-lg transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-violet-400 hover:text-white hover:bg-violet-600 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Confirmation */}
                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-mono text-[10px]"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-[#1e2433] text-[#9ca3af] rounded font-mono text-[10px]"
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

      {/* ── ADVANCED TABBED PROJECT EDITOR MODAL ── */}
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

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#1a202c] bg-[#0b0e17] overflow-x-auto">
              {[
                { id: "basic", label: "1. Basic Info" },
                { id: "problem", label: "2. Problem & Goal" },
                { id: "workflow", label: "3. Workflow Architecture" },
                { id: "stack", label: "4. Stack & Learning" },
                { id: "links", label: "5. Media & Publishing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
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
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Category
                      </label>
                      <select
                        value={editingProject.category || CATEGORIES[0]}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Icon Style
                      </label>
                      <select
                        value={editingProject.iconName || "workflow"}
                        onChange={(e) => setEditingProject({ ...editingProject, iconName: e.target.value as IconName })}
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
                      >
                        {ICONS.map((ic) => (
                          <option key={ic} value={ic}>
                            {ic}
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
                      value={editingProject.summary || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                      placeholder="Brief overview explaining what the automation does and why it was built..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PROBLEM & OBJECTIVES */}
              {activeTab === "problem" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      The Problem (Friction / Bottleneck)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.problem || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                      placeholder="Manual inbox triage takes hours of scanning, tagging, and repetitive writing..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Project Goal
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.goal || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, goal: e.target.value })}
                      placeholder="Build a reliable, automated pipeline to handle classification, drafting, and notification..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      AI Role &amp; Prompt Reasoning
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.aiRole || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, aiRole: e.target.value })}
                      placeholder="LLM handles intent parsing, urgency scoring with structured JSON schema guardrails..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                      Automation Logic &amp; Connectors
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.automationLogic || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, automationLogic: e.target.value })}
                      placeholder="Event-driven webhook in n8n triggers JSON parsing, OpenAI API prompt chaining, and Gmail API draft creation..."
                      className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: WORKFLOW ARCHITECTURE */}
              {activeTab === "workflow" && (
                <div className="space-y-4 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1a202c]">
                    <p className="text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                      Execution Steps ({editingProject.workflowSteps?.length || 0})
                    </p>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Step
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingProject.workflowSteps || []).map((st, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-[#141a29] border border-[#1e2433] rounded-xl flex items-start gap-3 group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                          {st.step}
                        </div>

                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={st.name}
                            onChange={(e) => handleStepChange(i, "name", e.target.value)}
                            placeholder="Step name (e.g. AI Processing)"
                            className="w-full px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                          />
                          <textarea
                            rows={2}
                            value={st.desc}
                            onChange={(e) => handleStepChange(i, "desc", e.target.value)}
                            placeholder="What happens in this step..."
                            className="w-full px-3 py-1.5 bg-[#0f111a] border border-[#1e2433] rounded-lg text-[#9ca3af] text-xs focus:outline-none focus:border-violet-500 leading-relaxed"
                          />
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={() => handleMoveStep(i, "up")}
                            className="p-1 text-[#6b7280] hover:text-white bg-[#0f111a] hover:bg-[#1a202c] disabled:opacity-30 rounded transition-colors"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={i === (editingProject.workflowSteps?.length || 1) - 1}
                            onClick={() => handleMoveStep(i, "down")}
                            className="p-1 text-[#6b7280] hover:text-white bg-[#0f111a] hover:bg-[#1a202c] disabled:opacity-30 rounded transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(i)}
                            className="p-1 text-[#6b7280] hover:text-rose-400 bg-[#0f111a] hover:bg-rose-500/10 rounded transition-colors mt-0.5"
                            title="Remove Step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: STACK & LEARNINGS */}
              {activeTab === "stack" && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* Integrations Chips */}
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
                        placeholder="Add integration (e.g. Pinecone, Slack, n8n)..."
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

                  {/* Stack Chips */}
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
                        placeholder="Add technology (e.g. Python, LangChain, OpenAI)..."
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

                  {/* Learning Outcome & Final Outcome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        What I Learned / Technical Takeaways
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.learningOutcome || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, learningOutcome: e.target.value })}
                        placeholder="Mastered structured output schemas, rate limit handling, MIME parsing..."
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1.5 font-semibold">
                        Final Key Outcome (Quote format)
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.outcome || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, outcome: e.target.value })}
                        placeholder="Classified incoming emails with structured metadata and created review-ready drafts."
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA, LINKS & PUBLISHING */}
              {activeTab === "links" && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* Media Management Section */}
                  <div className="p-4 bg-[#141a29] rounded-2xl border border-[#1e2433] space-y-4">
                    <h3 className="text-xs font-mono uppercase text-violet-400 font-semibold tracking-wider">
                      Media &amp; Architecture Diagrams
                    </h3>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                        Cover Image URL
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="url"
                          value={editingProject.coverImage || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                          placeholder="https://example.com/project-cover.png"
                          className="flex-1 px-3.5 py-2.5 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                        />
                        {editingProject.coverImage && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
                            <img
                              src={editingProject.coverImage}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Workflow & Architecture Diagrams */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                          Workflow Diagram URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.workflowImage || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, workflowImage: e.target.value })}
                          placeholder="https://example.com/workflow-map.png"
                          className="w-full px-3.5 py-2 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                          Demo Video URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.videoUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-3.5 py-2 bg-[#0f111a] border border-[#1e2433] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Links */}
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
                        GitHub Repository URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={editingProject.repoUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, repoUrl: e.target.value })}
                        placeholder="https://github.com/arefinmuin/project"
                        className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  {/* Publishing Controls & Public Preview */}
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
                        <span className="text-xs text-white font-medium">Featured Anchor</span>
                      </label>
                    </div>

                    {editingProject.slug && (
                      <Link
                        href={`/projects/${editingProject.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-violet-300 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview Live Design</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-[#1a202c]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 text-xs text-[#9ca3af] hover:text-white bg-[#141a29] hover:bg-[#1a202c] rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
                  >
                    {saving ? "Saving Changes..." : isNew ? "Create Project" : "Save Changes"}
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
