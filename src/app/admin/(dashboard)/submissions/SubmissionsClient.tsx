"use client";

import { useState } from "react";
import { Mail, Trash2, CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";

type Submission = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message?: string;
  _createdAt: string;
  read?: boolean;
};

export default function SubmissionsClient({
  initialSubmissions,
}: {
  initialSubmissions: Submission[];
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = submissions.filter((s) => {
    if (filter === "unread") return !s.read;
    if (filter === "read") return s.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  const toggleRead = async (id: string, currentRead: boolean) => {
    setLoading(id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, read: !currentRead } : s))
        );
      }
    } finally {
      setLoading(null);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    setLoading(id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s._id !== id));
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-violet-600 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {f === "all" ? `All (${submissions.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${submissions.length - unreadCount})`}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-700/30">
            {filtered.map((submission) => (
              <div
                key={submission._id}
                className={`p-6 transition-colors ${!submission.read ? "bg-violet-950/10" : "hover:bg-slate-700/20"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {submission.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{submission.name}</h3>
                          {!submission.read && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{submission.email}</p>
                      </div>
                    </div>

                    {submission.subject && (
                      <p className="text-sm text-slate-300 font-medium mb-2">
                        {submission.subject}
                      </p>
                    )}

                    {/* Expandable message */}
                    {submission.message && (
                      <div>
                        <p className={`text-sm text-slate-400 ${expanded === submission._id ? "" : "line-clamp-2"}`}>
                          {submission.message}
                        </p>
                        {submission.message.length > 120 && (
                          <button
                            onClick={() =>
                              setExpanded(expanded === submission._id ? null : submission._id)
                            }
                            className="flex items-center gap-1 mt-1 text-xs text-violet-400 hover:text-violet-300"
                          >
                            {expanded === submission._id ? (
                              <><ChevronUp className="w-3 h-3" /> Show less</>
                            ) : (
                              <><ChevronDown className="w-3 h-3" /> Show more</>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                      <time>{new Date(submission._createdAt).toLocaleString()}</time>
                      {submission.read && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleRead(submission._id, !!submission.read)}
                      disabled={loading === submission._id}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 transition-colors disabled:opacity-50"
                      title={submission.read ? "Mark as unread" : "Mark as read"}
                    >
                      {submission.read ? (
                        <Circle className="w-5 h-5" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </button>
                    <a
                      href={`mailto:${submission.email}`}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Reply via email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => deleteSubmission(submission._id)}
                      disabled={loading === submission._id}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-600/20 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {filter === "all" ? "No submissions yet" : `No ${filter} submissions`}
            </h3>
            <p className="text-slate-500">
              {filter === "all"
                ? "Contact form submissions will appear here."
                : `You have no ${filter} submissions.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
