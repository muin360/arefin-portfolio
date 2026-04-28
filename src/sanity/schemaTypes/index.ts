import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { project } from "./project";
import { service } from "./service";
import { skillCategory } from "./skillCategory";
import { siteConfig } from "./siteConfig";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, project, service, skillCategory, siteConfig],
};
