import { defineField, defineType } from "sanity";

// Singleton document — only one instance, edited from /studio.
export const siteConfig = defineType({
  name: "siteConfig",
  title: "Site Configuration",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Person / studio name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role / job title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Default site description (SEO)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      fields: [
        { name: "github", type: "url", title: "GitHub" },
        { name: "linkedin", type: "url", title: "LinkedIn" },
        { name: "twitter", type: "url", title: "X / Twitter" },
        { name: "facebook", type: "url", title: "Facebook" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
        { name: "whatsapp", type: "url", title: "WhatsApp (link)" },
        { name: "email", type: "url", title: "Email (mailto:)", validation: (r) => r.uri({ scheme: ["mailto"] }) },
      ],
    }),
  ],
});
