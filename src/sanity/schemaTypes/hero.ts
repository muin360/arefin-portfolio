import { defineField, defineType } from "sanity";

/**
 * Hero — singleton document. Edit headline, subheadline, trust line and the
 * two hero CTAs from one place. Use the `Document Actions` panel to keep
 * exactly one published Hero document.
 */
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow (small line above headline)",
      type: "string",
      description: "e.g. 'AI automation, Messenger bots & websites for small businesses'",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "The H1 visitors see first. Use a strong outcome.",
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: "trustLine",
      title: "Trust line (under buttons)",
      type: "string",
      description: "e.g. 'Reply in 1 hour · Plan in 48 hours · 2 spots left this month'",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "primaryCTA",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Button label", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "secondaryCTA",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Button label", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "scarcityPill",
      title: "Scarcity pill (top of hero)",
      type: "string",
      description: "Single-line trust/scarcity chip. e.g. 'Booking 2 clients this month · Free 30-min audit'",
      validation: (r) => r.max(120),
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "subheadline" },
  },
});
