import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { project } from "./project";
import { service } from "./service";
import { skillCategory } from "./skillCategory";
import { siteConfig } from "./siteConfig";
import { engagement } from "./engagement";
import { faq } from "./faq";
import { testimonial } from "./testimonial";
import { hero } from "./hero";
import { contactSubmission } from "./contactSubmission";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    project,
    service,
    skillCategory,
    siteConfig,
    engagement,
    faq,
    testimonial,
    hero,
    contactSubmission,
  ],
};
