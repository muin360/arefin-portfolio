import type { Metadata } from "next";
import { getProjects } from "@/lib/db";
import ProjectsFilterArchive from "@/components/ProjectsFilterArchive";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Selected Work — Arefin Mueen",
  description:
    "Practical AI automations, autonomous agents, RAG systems, and multi-agent workflows built by Arefin Mueen.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Selected Work — Arefin Mueen",
    description:
      "Hands-on AI automation projects, autonomous agents, RAG assistants, and multi-agent workflows built by Arefin Mueen.",
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects({ publishedOnly: true });

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-4xl">
          <SectionPlate
            index="SELECTED WORK"
            title="SYSTEMS &amp; AGENTS"
            meta="Arefin Mueen · Verified Case Studies"
          />

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Practical AI systems,{" "}
            <span className="serif italic text-violet-300">
              built to automate real work.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans max-w-3xl">
            A collection of hands-on AI automation workflows, autonomous agents, RAG knowledge assistants, and multi-agent systems built by Arefin Mueen.
          </p>
        </div>

        {/* Dynamic Project Filter & Hierarchy Archive */}
        <ProjectsFilterArchive projects={projects} />

        {/* Bottom Direct Scoping CTA */}
        <div className="pt-12">
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Want a system tailored to{" "}
                <span className="serif italic text-violet-300">your workflow?</span>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                Free scoping conversation — let&rsquo;s map your manual processes and build autonomous AI agents or reliable API pipelines under your 100% ownership.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Let&rsquo;s Build an Automation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
