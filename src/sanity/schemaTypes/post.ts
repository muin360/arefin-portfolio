import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short summary shown in lists and used as meta description.",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Strategy", value: "Strategy" },
          { title: "Tools", value: "Tools" },
          { title: "Engineering", value: "Engineering" },
          { title: "Tutorial", value: "Tutorial" },
          { title: "Notes", value: "Notes" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readingTime",
      title: "Reading time",
      description: "e.g. \"5 min read\". Auto-derived from word count if left blank.",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (r) =>
                      r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  },
                ],
              },
            ],
          },
        },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] },
        {
          type: "object",
          name: "codeBlock",
          title: "Code block",
          fields: [
            { name: "language", type: "string", title: "Language" },
            { name: "code", type: "text", title: "Code", rows: 8 },
          ],
          preview: {
            select: { language: "language", code: "code" },
            prepare: ({ language, code }) => ({
              title: `Code · ${language || "plain"}`,
              subtitle: (code || "").slice(0, 60),
            }),
          },
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title (override)",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description (override)",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toISOString().slice(0, 10) : "Unpublished",
      media,
    }),
  },
});
