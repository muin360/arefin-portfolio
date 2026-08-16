import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/fetch";
import { allPostsQuery } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";
import { FALLBACK_POSTS } from "@/data/fallbacks";
import { PageHeader } from "@/components/Section";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Journal & Build Notes",
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
  const raw = await sanityFetch<PostListItem[]>({
    query: allPostsQuery,
    tags: ["post"],
  });
  const sorted = raw && raw.length > 0 ? raw : FALLBACK_POSTS;
  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · Journal & Build Notes"
        index="06"
        meta={`${sorted.length} entries · Practical insights`}
        title={
          <>
            Notes on building{" "}
            <span className="serif">AI automations &amp; agents.</span>
          </>
        }
        subtitle="Hands-on build notes, opinions on the toolchain, and lessons learned from building practical workflows and agents."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section relative">
          <BlogList posts={sorted} />
        </div>
      </section>
    </>
  );
}
