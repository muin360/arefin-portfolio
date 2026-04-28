import { defineField, defineType } from "sanity";
import { ICON_OPTIONS } from "./shared";

export const project = defineType({
  name: "project",
  title: "Project / Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Agent", value: "Agent" },
          { title: "Bot", value: "Bot" },
          { title: "Pipeline", value: "Pipeline" },
          { title: "RAG", value: "RAG" },
          { title: "Outreach", value: "Outreach" },
          { title: "Integration", value: "Integration" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "iconName",
      title: "Icon",
      type: "string",
      description: "Choose the icon shown next to this project on the site.",
      options: { list: ICON_OPTIONS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: "outcome",
      title: "Outcome / metric",
      description: "One-line, high-signal result. Shown on the projects page.",
      type: "string",
    }),
    defineField({
      name: "stack",
      title: "Stack / tools",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail / hero image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower numbers appear first. Leave blank to use newest-created order.",
      type: "number",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }, { field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "thumbnail" },
  },
});
