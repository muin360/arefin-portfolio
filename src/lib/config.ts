/**
 * Centralized site configuration.
 *
 * Every domain reference, contact detail, and brand constant lives here
 * so we never scatter these values across the codebase again. Import
 * `SITE` wherever you need any of these.
 */
import { SITE_URL } from "./site-url";

export const SITE = {
  url: SITE_URL,
  name: "Tensorix",
  tagline: "AI Automation & Agent Engineering Studio",
  description:
    "Founder-led AI systems studio. We design and build reliable AI agents, workflow automation, API integrations, and conversion-focused web systems for small teams.",
  author: {
    name: "Arefin Muin",
    role: "AI Automation Engineer & Agent Developer",
  },
  email: "hello@tensorix.me",
  whatsapp: "+8801994605717",
  whatsappUrl: "https://wa.me/8801994605717",
  bookUrl: "/book",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61588840534814",
    whatsapp: "https://wa.me/8801994605717",
  },
  colors: {
    primary: "#1D9E75",
    accent: "#5DCAA5",
  },
} as const;
