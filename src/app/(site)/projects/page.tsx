import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/db";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { IconArrow } from "@/components/icons";
import ProjectsFilterArchive from "@/components/ProjectsFilterArchive";

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
    <>
      <PageHeader
        eyebrow="Arefin Mueen · Selected Work"
        index="03"
        meta="AI Automation · AI Agents · RAG · Multi-Agent"
        title={
          <>
            Practical AI systems,
            <br />
            <span className="serif">built to automate real work.</span>
          </>
        }
        subtitle="A collection of hands-on AI automation workflows, autonomous agents, RAG assistants, and multi-agent systems built by Arefin Mueen."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5 py-12 sm:py-16">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          <ProjectsFilterArchive projects={projects} />

          <Reveal>
            <div className="mt-20 relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden="true">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(800px circle at 30% 20%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(700px circle at 80% 80%, rgba(236,72,153,0.30), transparent 60%)",
                  }}
                />
              </div>
              <div className="relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                  [ Next project ]
                </p>
                <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                  Want a system like one of{" "}
                  <span className="serif iridescent">these?</span>
                </h2>
              </div>
              <Link href="/contact" className="btn-primary shimmer relative z-10 bg-white text-[#04040a] border-white">
                Let&rsquo;s build an automation
                <IconArrow width={16} height={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
