import { defineField, defineType } from "sanity";

export const engagement = defineType({
  name: "engagement",
  title: "Engagement / Pricing tier",
  type: "document",
  fields: [
    defineField({
      name: "tag",
      title: "Tag (small badge, e.g. \"Sprint\")",
      type: "string",
      validation: (r) => r.required().max(20),
    }),
    defineField({
      name: "name",
      title: "Name (heading)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Price (free-form, e.g. \"From $2.4k\" or \"Custom quote\")",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cadence",
      title: "Cadence (e.g. \"2 weeks · fixed scope\")",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(500),
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "ideal",
      title: "Ideal-for line (italic, bottom of card)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA button label (optional)",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Featured / most popular?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "price", tag: "tag" },
    prepare: ({ title, subtitle, tag }) => ({
      title: tag ? `${tag} · ${title}` : title,
      subtitle,
    }),
  },
});
