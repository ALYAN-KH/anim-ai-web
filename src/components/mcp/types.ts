export type AgentId = "chatgpt" | "claude" | "claude-code" | "telegram" | "cli" | "other";

export interface ConnectGuide {
  title: string;
  steps: string[];
  /** Optional copy-able command / snippet shown under the steps. */
  code?: string;
  /** false = placeholder written by hand; replace with data from scripts/extract-mcp.mjs */
  verified: boolean;
}

export interface AgentDefinition {
  id: AgentId;
  label: string;
  /** value used in `?tab=` */
  param: string;
  /** name used inside the hero headline: "in {headlineName} with Higgsfield" */
  headlineName: string;
  primaryCta: { label: string; href: string };
  guide: ConnectGuide;
  /** tint of the small badge shown inside the headline */
  badgeClass: string;
}

export interface DemoDefinition {
  id: string;
  label: string;
  isNew?: boolean;
  poster: string;
  /** mp4 shown behind the prompt card. Missing => poster image is used. */
  videoSrc?: string;
  title: string;
  prompt: string;
}

export interface PresetCategory {
  id: string;
  label: string;
  icon: string;
  /** "plugins" renders below a divider in the sidebar */
  group: "main" | "plugins";
}

export interface PresetDefinition {
  id: string;
  title: string;
  isNew?: boolean;
  description: string;
  command: string;
  /** category ids, besides "popular" */
  categories: string[];
  popular: boolean;
  /** slug of https://higgsfield.ai/mcp/{slug} */
  slug: string;
  prompt: string;
  references: string[];
  media: { kind: "image" | "video"; src: string; poster?: string };
}
