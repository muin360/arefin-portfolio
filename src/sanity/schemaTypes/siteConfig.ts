import { defineField, defineType } from "sanity";

// Singleton document — only one instance, edited from /studio.
export const siteConfig = defineType({
  name: "siteConfig",
  title: "Site Configuration",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
    { name: "stats", title: "Live stats" },
    { name: "toggles", title: "Visibility toggles" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Person / studio name",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role / job title",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 3,
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Default site description (SEO)",
      type: "text",
      rows: 3,
      group: "identity",
    }),
    defineField({
      name: "availability",
      title: "Availability label",
      description:
        "Short status string shown in the navbar / hero / footer (e.g. \"Available · April 2025\").",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "availabilityNote",
      title: "Scarcity / availability note (homepage + services)",
      description:
        "The pill text shown above the hero CTAs and inside the services section. Drives both the homepage scarcity strip and the services-page scarcity copy.",
      type: "string",
      group: "identity",
    }),

    // ── Contact ────────────────────────────────────────────────────────
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone number (display)",
      description:
        "How the phone number is shown on the site (e.g. \"+880 1994-605717\").",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phoneE164",
      title: "Phone number (E.164, no spaces)",
      description:
        "Used for tel: and wa.me links. International format without symbols, e.g. \"8801994605717\".",
      type: "string",
      group: "contact",
    }),

    // ── Social ─────────────────────────────────────────────────────────
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      group: "social",
      fields: [
        { name: "github", type: "url", title: "GitHub" },
        { name: "linkedin", type: "url", title: "LinkedIn" },
        { name: "twitter", type: "url", title: "X / Twitter" },
        { name: "facebook", type: "url", title: "Facebook" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
        { name: "whatsapp", type: "url", title: "WhatsApp (link, e.g. https://wa.me/...)" },
        { name: "email", type: "url", title: "Email (mailto:)", validation: (r) => r.uri({ scheme: ["mailto"] }) },
      ],
    }),

    // ── Hero status tiles ──────────────────────────────────────────────
    defineField({
      name: "heroTiles",
      title: "Hero status tiles",
      description:
        "The four small tiles under the hero CTA (e.g. agents online, workflows live). Leave empty to hide the row.",
      type: "array",
      group: "stats",
      validation: (r) => r.max(4),
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label", validation: (r) => r.required() },
            { name: "value", type: "string", title: "Value (free-form, e.g. \"04\", \"14.2k\", \"99.97%\")", validation: (r) => r.required() },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),

    // ── Last-30-days stat tiles ────────────────────────────────────────
    defineField({
      name: "live30Days",
      title: "Last 30 days · stat cards",
      description:
        "The big stat cards in the \"Activity & Stats\" section. Leave empty to hide the section entirely.",
      type: "array",
      group: "stats",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label (small caps, e.g. \"workflows built\")", validation: (r) => r.required() },
            { name: "value", type: "string", title: "Value (display, e.g. \"10\", \"100\", \"99.9\")", validation: (r) => r.required() },
            { name: "suffix", type: "string", title: "Suffix (optional, e.g. \"+\", \"%\", \"m\")" },
            { name: "hint", type: "string", title: "Hint (small caption under sparkline)" },
            {
              name: "delta",
              type: "string",
              title: "Delta (e.g. \"+42%\", \"-67%\")",
              description: "Shown in the top-right corner. Leave empty to hide.",
            },
            { name: "trendUp", type: "boolean", title: "Trend is positive direction (green)?", initialValue: true },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),

    // ── Visibility toggles ─────────────────────────────────────────────
    defineField({
      name: "showLiveTicker",
      title: "Show the scrolling \"system feed\" ticker",
      description: "The decorative animated event log at the top of every page.",
      type: "boolean",
      group: "toggles",
      initialValue: true,
    }),
    defineField({
      name: "showHeroTiles",
      title: "Show hero status tiles",
      description: "The four small tiles under the hero CTA. Auto-hides if no tiles are configured.",
      type: "boolean",
      group: "toggles",
      initialValue: true,
    }),
    defineField({
      name: "showLive30Days",
      title: "Show Activity & Stats section",
      description: "Auto-hides if no stat cards are configured.",
      type: "boolean",
      group: "toggles",
      initialValue: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Configuration" }),
  },
});
