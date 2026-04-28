import {
  IconAgent,
  IconWorkflow,
  IconChart,
  IconBrain,
  IconCode,
  IconCompass,
  IconLayers,
  IconRocket,
  IconTerminal,
  IconBookmark,
  IconSpark,
} from "./icons";
import type { ComponentType, SVGProps } from "react";
import type { IconName } from "@/sanity/schemaTypes/shared";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Maps the iconName string stored in Sanity → the actual React icon
// component. Keep this in sync with ICON_OPTIONS in
// src/sanity/schemaTypes/shared.ts.
const REGISTRY: Record<IconName, IconComponent> = {
  agent: IconAgent,
  workflow: IconWorkflow,
  chart: IconChart,
  brain: IconBrain,
  code: IconCode,
  compass: IconCompass,
  layers: IconLayers,
  rocket: IconRocket,
  terminal: IconTerminal,
  bookmark: IconBookmark,
  spark: IconSpark,
};

export function iconFor(name: string | undefined): IconComponent {
  if (name && name in REGISTRY) return REGISTRY[name as IconName];
  // Fallback so the build never breaks if the studio adds an unknown value.
  return IconLayers;
}
