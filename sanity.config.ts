"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Tensor CMS",
  basePath: studioUrl,
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision lets you run GROQ queries against your dataset from inside the
    // Studio — invaluable for debugging.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
