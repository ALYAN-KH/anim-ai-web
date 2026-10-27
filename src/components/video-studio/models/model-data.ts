export type ModelIconKey =
  | "minimax"
  | "flux"
  | "kling"
  | "google"
  | "higgsfield"
  | "wan"
  | "seedance"
  | "genjutsu"
  | "grok"
  | "happyhorse";

export type ModelBadgeKind = "TOP" | "NEW" | "EXCLUSIVE" | "PREMIUM";

export interface ModelOption {
  name: string;
  icon?: ModelIconKey;
  badge?: ModelBadgeKind;
  sound?: boolean;
  resolution?: string;
  duration?: string;
  extras?: string[];
  tagIcons?: boolean;
  info?: { text?: string };
}

export interface ModelGroup {
  id: string;
  name: string;
  description: string;
  icon: ModelIconKey;
  direct?: boolean;
  models: ModelOption[];
}

export const FEATURED_MODELS: ModelOption[] = [
  {
    name: "Seedance 2.5",
    icon: "seedance",
    badge: "TOP",
    resolution: "1080p",
    duration: "4s-30s",
  },
  {
    name: "Seedance 2.5 Draft",
    icon: "seedance",
    badge: "NEW",
    resolution: "480p",
    duration: "4s-30s",
  },
  {
    name: "Higgsfield Genjutsu",
    icon: "genjutsu",
    badge: "NEW",
    resolution: "1080p",
    duration: "4s-30s",
    tagIcons: true,
  },
  {
    name: "Higgsfield Genjutsu Lite",
    icon: "genjutsu",
    badge: "NEW",
    resolution: "1080p",
    duration: "4s-30s",
    tagIcons: true,
  },
  {
    name: "Kling 4.0",
    icon: "kling",
    badge: "NEW",
    resolution: "1080p",
    duration: "3s-30s",
    tagIcons: true,
  },
  {
    name: "Wan 3.0 Prime",
    icon: "wan",
    sound: true,
    resolution: "1080p",
    duration: "2s-30s",
    tagIcons: true,
  },
];

export const MODEL_GROUPS: ModelGroup[] = [
  {
    id: "minimax",
    name: "Minimax Hailuo",
    description: "High-dynamic, VFX-ready, fastest and most affordable",
    icon: "minimax",
    models: [{ name: "Minimax Hailuo" }],
  },
  {
    id: "flux",
    name: "FLUX.3 Video",
    description: "Text, image, and video generation with synchronized audio",
    icon: "flux",
    models: [{ name: "FLUX.3 Video" }],
  },
  {
    id: "kling",
    name: "Kling",
    description: "Perfect motion with advanced video control",
    icon: "kling",
    models: [
      {
        name: "Kling 4.0",
        badge: "NEW",
        resolution: "1080p",
        duration: "3s-30s",
        tagIcons: true,
      },
    ],
  },
  {
    id: "veo",
    name: "Google Veo",
    description: "Precision video with sound control",
    icon: "google",
    models: [{ name: "Google Veo" }],
  },
  {
    id: "gemini",
    name: "Gemini Omni Flash",
    description: "Multi-image video generation by Google",
    icon: "google",
    models: [{ name: "Gemini Omni Flash" }],
  },
  {
    id: "higgsfield",
    name: "Higgsfield",
    description: "Advanced camera controls and effect presets",
    icon: "higgsfield",
    models: [{ name: "Higgsfield" }],
  },
  {
    id: "wan",
    name: "Wan",
    description: "Camera-controlled video with sound, more freedom",
    icon: "wan",
    models: [
      {
        name: "Wan 3.0 Prime",
        sound: true,
        resolution: "1080p",
        duration: "2s-30s",
        tagIcons: true,
      },
      { name: "Wan 3.0" },
    ],
  },
  {
    id: "seedance",
    name: "Seedance",
    description: "Cinematic, multi-shot video creation",
    icon: "seedance",
    models: [
      {
        name: "Seedance 2.5",
        badge: "TOP",
        resolution: "1080p",
        duration: "4s-30s",
      },
      {
        name: "Seedance 2.5 Draft",
        badge: "NEW",
        resolution: "480p",
        duration: "4s-30s",
      },
      {
        name: "Seedance 2.5 Edit",
        badge: "TOP",
        resolution: "480p-720p",
        extras: ["Edit Video", "Audio"],
      },
      {
        name: "Seedance 2.0 Fast",
        info: { text: "Seedance 2.0 Fast is not available in US" },
        resolution: "720p",
        duration: "4s-15s",
        tagIcons: true,
      },
      {
        name: "Seedance 2.0 Mini",
        info: {},
        badge: "EXCLUSIVE",
        resolution: "720p",
        duration: "4s-15s",
        tagIcons: true,
      },
      {
        name: "Seedance 2.0",
        resolution: "4K",
        duration: "4s-15s",
        tagIcons: true,
      },
      {
        name: "Seedance 1.5 Pro",
        info: { text: "Seedance 1.5 Pro is being retired" },
        resolution: "720p",
        duration: "4s-12s",
        tagIcons: true,
      },
      { name: "Seedance Pro", badge: "PREMIUM" },
    ],
  },
  {
    id: "genjutsu",
    name: "Higgsfield Genjutsu",
    description: "Transfer motion or swap objects from a reference video",
    icon: "genjutsu",
    models: [
      {
        name: "Higgsfield Genjutsu",
        badge: "NEW",
        resolution: "1080p",
        duration: "4s-30s",
        tagIcons: true,
      },
      {
        name: "Higgsfield Genjutsu Lite",
        badge: "NEW",
        resolution: "1080p",
        duration: "4s-30s",
        tagIcons: true,
      },
    ],
  },
  {
    id: "grok",
    name: "Grok Imagine",
    description: "Perfect motion with advanced video control",
    icon: "grok",
    models: [{ name: "Grok Imagine" }],
  },
  {
    id: "happyhorse",
    name: "HappyHorse",
    description: "",
    icon: "happyhorse",
    direct: true,
    models: [
      {
        name: "HappyHorse",
        sound: true,
        resolution: "1080p",
        duration: "3s-15s",
        tagIcons: true,
      },
    ],
  },
];
