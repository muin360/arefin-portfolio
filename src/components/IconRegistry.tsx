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
import type { IconName } from "@/lib/db/types";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const REGISTRY: Record<string, IconComponent> = {
  agent: IconAgent,
  bot: IconAgent,
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
  lock: IconCode,
  zap: IconSpark,
  globe: IconCompass,
};

export function iconFor(name: string | undefined): IconComponent {
  if (name && name in REGISTRY) return REGISTRY[name as IconName];
  // Fallback so the build never breaks if the studio adds an unknown value.
  return IconLayers;
}
