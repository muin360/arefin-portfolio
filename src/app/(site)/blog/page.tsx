import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/db";
import BlogList from "./BlogList";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Journal & Build Notes — Arefin Mueen",
  description:
    "Build notes, automation experiments, and technical lessons on AI agents, n8n workflows, RAG, and LLMs by Arefin Mueen.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal & Build Notes — Arefin Mueen",
    description:
      "Build notes and experiments on AI automations and agents by Arefin Mueen.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts({ publishedOnly: true });

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-4xl">
          <SectionPlate
            index="JOURNAL"
            title="BUILD NOTES &amp; EXPERIMENTS"
            meta={`${posts.length} entries · practical lessons`}
          />

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Notes from building AI systems,{" "}
            <span className="serif italic text-violet-300">
              automations, and agents.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans max-w-3xl">
            Hands-on architectural reflections, edge case recoveries, and technical lessons learned from building practical workflows, tool-calling agents, and RAG pipelines.
          </p>
        </div>

        {/* Dynamic Journal Filter & Editorial Post Stream */}
        <BlogList posts={posts} />

        {/* Direct Scoping Callout */}
        <div className="pt-12">
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Want to build something{" "}
                <span className="serif italic text-violet-300">similar?</span>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                Explore the verified case studies or discuss how to apply these agent and workflow architectures to your internal business processes.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  href="/projects"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View Case Studies
                </Button>

                <Button href="/contact" variant="secondary" size="lg">
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
