import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons";

// Custom Studio sidebar — pins the singleton siteConfig and groups the
// content types so the editing UX is obvious.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Configuration")
        .icon(CogIcon)
        .child(
          S.editor()
            .id("siteConfig")
            .schemaType("siteConfig")
            .documentId("siteConfig"),
        ),
      S.divider(),
      S.documentTypeListItem("post").title("Blog Posts"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("skillCategory").title("Skill Categories"),
    ]);
