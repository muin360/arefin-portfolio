import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AIControlCenter from "@/components/admin/ai/AIControlCenter";
import {
  getAIConfig,
  getAIProviderCredentials,
  getAIVersions,
  getAIUsageStats,
  getAILogs,
  getAIAuditLogs,
  getProjects,
  getServices,
  getBlogPosts,
  getSkills,
  getAboutData,
} from "@/lib/db";

export const metadata = {
  title: "AI Control Center · Admin",
  description: "Manage production AI behavior, providers, models, safety, and retrieval.",
};

export default async function AIAdminPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  // Fetch initial state server-side
  const [
    activeConfig,
    draftConfig,
    credentials,
    versions,
    stats,
    logs,
    auditLogs,
    projects,
    services,
    posts,
    skills,
    about,
  ] = await Promise.all([
    getAIConfig("active"),
    getAIConfig("draft"),
    getAIProviderCredentials(),
    getAIVersions(20),
    getAIUsageStats(7),
    getAILogs(50),
    getAIAuditLogs(30),
    getProjects({ publishedOnly: true }),
    getServices({ publishedOnly: true }),
    getBlogPosts({ publishedOnly: true }),
    getSkills({ publishedOnly: true }),
    getAboutData(),
  ]);

  const sanitizedCredentials = credentials.map((c) => ({
    provider: c.provider,
    keyFingerprint: c.keyFingerprint,
    baseUrl: c.baseUrl,
    organizationId: c.organizationId,
    status: c.status,
    lastRotatedAt: c.lastRotatedAt,
    lastTestedAt: c.lastTestedAt,
    lastError: c.lastError,
  }));

  const docCounts = {
    projects: projects.length,
    services: services.length,
    posts: posts.length,
    skills: skills.length,
    about: about ? 1 : 0,
  };

  return (
    <AIControlCenter
      initialActiveConfig={activeConfig}
      initialDraftConfig={draftConfig}
      initialCredentials={sanitizedCredentials}
      initialVersions={versions}
      docCounts={docCounts}
      initialStats={stats}
      initialLogs={logs}
      initialAuditLogs={auditLogs}
    />
  );
}
