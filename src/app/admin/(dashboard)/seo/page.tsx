import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/db";
import SeoEditor from "@/components/admin/SeoEditor";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "SEO & Meta · Admin · Arefin Mueen",
};

type HealthStatus = "healthy" | "warning" | "missing";

interface SeoField {
  label: string;
  value: string | undefined | null;
  recommended?: number; // min char length
  max?: number;
  status: HealthStatus;
  note?: string;
}

function evaluateField(
  label: string,
  value: string | undefined | null,
  min = 1,
  max?: number,
): SeoField {
  if (!value || value.trim().length === 0) {
    return { label, value, status: "missing", note: "Field is empty" };
  }
  if (value.length < min) {
    return { label, value, status: "warning", note: `Too short (min ${min} chars)` };
  }
  if (max && value.length > max) {
    return { label, value, status: "warning", note: `Too long (max ${max} chars)` };
  }
  return { label, value, status: "healthy" };
}

function StatusIcon({ status }: { status: HealthStatus }) {
  if (status === "healthy")
    return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (status === "warning")
    return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
}

const STATUS_LABELS: Record<HealthStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  missing: "Missing",
};

const STATUS_COLORS: Record<HealthStatus, string> = {
  healthy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  missing: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default async function AdminSeoPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();
  const seo = settings.seo;

  const fields: SeoField[] = [
    evaluateField("Site Title", seo.siteTitle, 10, 70),
    evaluateField("Meta Description", seo.siteDescription, 50, 160),
    evaluateField("Canonical URL", seo.canonicalUrl, 5),
    evaluateField("OG Title", seo.ogTitle, 10, 70),
    evaluateField("OG Description", seo.ogDescription, 50, 200),
    evaluateField("Author", seo.author, 2),
  ];

  const healthyCnt = fields.filter((f) => f.status === "healthy").length;
  const score = Math.round((healthyCnt / fields.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">SEO & Metadata</h1>
        <p className="text-sm text-[#6b7280] mt-0.5">
          Control global title tags, meta descriptions, Open Graph, and structured data.
        </p>
      </div>

      {/* SEO Health Panel */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e2433]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2433]">
          <h2 className="text-sm font-semibold text-white">SEO Health Score</h2>
          <div className="flex items-center gap-2">
            <div
              className={`text-lg font-bold ${
                score >= 80
                  ? "text-emerald-400"
                  : score >= 50
                    ? "text-amber-400"
                    : "text-red-400"
              }`}
            >
              {score}%
            </div>
            <span className="text-xs text-[#6b7280]">
              {healthyCnt}/{fields.length} fields healthy
            </span>
          </div>
        </div>
        <div className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-[#1a2033] transition-colors"
            >
              <StatusIcon status={field.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-[#9ca3af]">{field.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[field.status]}`}
                  >
                    {STATUS_LABELS[field.status]}
                  </span>
                </div>
                {field.value ? (
                  <p className="text-[11px] text-[#4b5563] font-mono mt-0.5 truncate">
                    {field.value.slice(0, 80)}{field.value.length > 80 ? "…" : ""}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#374151] mt-0.5 italic">Not set</p>
                )}
                {field.note && (
                  <p className="text-[10px] text-amber-400/80 mt-0.5">{field.note}</p>
                )}
              </div>
              {field.value && (
                <span className="text-[10px] text-[#4b5563] font-mono shrink-0">
                  {field.value.length}c
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SEO Editor */}
      <SeoEditor initialSeo={seo} />
    </div>
  );
}
