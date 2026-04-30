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
  // The studio is only meaningful when Sanity is configured. If env vars
  // are missing we still need to satisfy the type signature; a clearly-
  // bogus default makes the misconfiguration obvious in the studio UI.
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision lets you run GROQ queries against your dataset from inside the
    // Studio — invaluable for debugging.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
