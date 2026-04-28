// Shared options used across multiple schemas. The icon list maps 1:1 to
// keys in src/components/IconRegistry.tsx — keep them in sync if you add a
// new icon.
export type IconName =
  | "agent"
  | "workflow"
  | "chart"
  | "brain"
  | "code"
  | "compass"
  | "layers"
  | "rocket"
  | "terminal"
  | "bookmark"
  | "spark";

export const ICON_OPTIONS: { title: string; value: IconName }[] = [
  { title: "Agent", value: "agent" },
  { title: "Workflow", value: "workflow" },
  { title: "Chart", value: "chart" },
  { title: "Brain", value: "brain" },
  { title: "Code", value: "code" },
  { title: "Compass", value: "compass" },
  { title: "Layers", value: "layers" },
  { title: "Rocket", value: "rocket" },
  { title: "Terminal", value: "terminal" },
  { title: "Bookmark", value: "bookmark" },
  { title: "Spark", value: "spark" },
];
