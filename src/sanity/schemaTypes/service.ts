import { defineField, defineType } from "sanity";
import { ICON_OPTIONS } from "./shared";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "iconName",
      title: "Icon",
      type: "string",
      options: { list: ICON_OPTIONS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "hook",
      title: "Hook (one-line benefit)",
      type: "string",
      description:
        "Single-sentence buyer-facing benefit shown under the title. e.g. 'Get back 20+ hours every week — without new software.'",
      validation: (r) => r.max(140),
    }),
    defineField({
      name: "problem",
      title: "Problem",
      type: "text",
      rows: 2,
      description: "What's broken today, in the buyer's words.",
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "text",
      rows: 2,
      description: "What you build to fix it. Plain language. No jargon.",
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "outcome",
      title: "Outcome (bold result)",
      type: "string",
      description:
        "The bottom-line result, surfaced visually. e.g. 'Reply in 30 seconds, all day.'",
      validation: (r) => r.max(140),
    }),
    defineField({
      name: "bullets",
      title: "Bullet highlights (max 3)",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      description: "e.g. 'Get a free Messenger bot demo'",
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "ctaPrefill",
      title: "WhatsApp pre-fill message",
      type: "text",
      rows: 2,
      description: "Pre-populated into WhatsApp when the card CTA is tapped.",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured (Most Popular badge)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Card badge text",
      type: "string",
      description: "Optional. Shows on the card. e.g. 'Most Popular'.",
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "description",
      title: "Long description (legacy / fallback)",
      type: "text",
      rows: 4,
      description:
        "Used on /services and as fallback if Problem/Solution/Outcome are not set.",
      validation: (r) => r.max(500),
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
    select: { title: "title", subtitle: "hook", featured: "isFeatured" },
    prepare({ title, subtitle, featured }) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: subtitle ?? "",
      };
    },
  },
});
