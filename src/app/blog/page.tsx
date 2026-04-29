import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/fetch";
import { allPostsQuery } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";
import { PageHeader } from "@/components/Section";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from Tensor on AI automation, agents and the engineering side of LLMs — lessons from real client work, opinions on the toolchain, and what I'm learning in production.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal — Tensor",
    description:
      "Notes from Tensor on AI automation, agents and the engineering side of LLMs.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const sorted = await sanityFetch<PostListItem[]>({
    query: allPostsQuery,
    tags: ["post"],
  });
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        index="06"
        meta={`${sorted.length} entries · Updated regularly`}
        title={
          <>
            Notes on shipping{" "}
            <span className="serif">AI in production.</span>
          </>
        }
        subtitle="Lessons from real client work, opinions on the toolchain, and what I'm learning as I go deeper into LLM engineering."
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
