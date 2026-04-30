import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import { sanityFetch } from "@/sanity/fetch";
import { allFaqsQuery } from "@/sanity/queries";
import type { FaqDoc } from "@/sanity/types";
import { FALLBACK_FAQS } from "@/data/fallbacks";
import { safeJsonLd } from "@/lib/json-ld";

export default async function FaqSection() {
  const faqsRaw = await sanityFetch<FaqDoc[]>({
    query: allFaqsQuery,
    tags: ["faq"],
  });
  const faqs =
    faqsRaw && faqsRaw.length > 0
      ? faqsRaw.map((f) => ({ q: f.question, a: f.answer }))
      : FALLBACK_FAQS.map((f) => ({ q: f.question, a: f.answer }));

  // FAQPage JSON-LD — eligible for Google rich-result expandable answers.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="border-b border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 section">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="eyebrow mb-5">[ FAQ ] Common questions</p>
            <h2 className="display text-4xl md:text-6xl">
              Everything you&apos;re{" "}
              <span className="serif">about to ask.</span>
            </h2>
            <p className="mt-5 text-muted max-w-2xl mx-auto leading-relaxed">
              Honest answers to the questions every small business asks before
              starting. No marketing speak.
            </p>
          </div>
        </Reveal>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
