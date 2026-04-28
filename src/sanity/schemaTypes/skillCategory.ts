import { defineField, defineType } from "sanity";
import { ICON_OPTIONS } from "./shared";

export const skillCategory = defineType({
  name: "skillCategory",
  title: "Skill Category",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category name",
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
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r) => r.required().min(1),
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
    select: { title: "category", subtitle: "items.0" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `${subtitle}, ...` : undefined }),
  },
});
