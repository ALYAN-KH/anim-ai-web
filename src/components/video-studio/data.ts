import type {
  EditTool,
  EditWorkflowStep,
  GlyphKind,
  VideoModel,
  VideoModelFamily,
  VideoTab,
} from "./types";

export type {
  EditTool,
  EditWorkflowStep,
  GlyphKind,
  VideoModel,
  VideoModelFamily,
  VideoTab
};

/* -------------------------------------------------------------------------- */
/* Media Assets                                                               */
/* -------------------------------------------------------------------------- */

export const videoStudioMedia = {
  modelPreview: "https://static.higgsfield.ai/wan27/wan27-motion-preset.mp4",
  modelPreviewPoster:
    "https://images.ctfassets.net/91663d1w6kgm/1szw9qankUpZGc2HIbvfvp/4bc40f593a82a4e414a888abef0de74c/Sequence_02.00_00_39_19.Still006.png",
  addImage:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/feed/step-1-v2.webp",
  choosePreset: "https://static.higgsfield.ai/feed/step-2.mp4",
  result: "https://static.higgsfield.ai/feed/step-3.mp4",
} as const;

export const editVideoMedia = {
  hero: "https://static.higgsfield.ai/video-edit-form/v2/tools-hero/main.mp4",
  heroPoster:
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fstatic.higgsfield.ai%2Fvideo-edit-form%2Fv2%2Ftools-hero%2Fmain-poster.webp&w=800&q=85",
  relight:
    "https://static.higgsfield.ai/video-edit-tutorial/v4/relight-and-atmosphere.mp4",
  relightPoster:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/video-edit-tutorial/v4/relight-and-atmosphere.webp",
  draw:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/sd-2-5-edit/draw-to-edit-thumbnail.webp",
  drawVideo:
    "https://static.higgsfield.ai/video-edit-form/v2/tools-hero/main.mp4",
  swap:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/video-edit-tutorial/v4/precise-object-swap.webp",
  swapVideo:
    "https://static.higgsfield.ai/video-edit-tutorial/v4/precise-object-swap.mp4",
  reframe:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/video-edit-tutorial/v4/re-frame-composition.webp",
  reframeVideo:
    "https://static.higgsfield.ai/video-edit-tutorial/v4/re-frame-composition.mp4",
  cleanup:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/video-edit-tutorial/v4/smart-clean-up.webp",
  cleanupVideo:
    "https://static.higgsfield.ai/video-edit-tutorial/v4/smart-clean-up.mp4",
  recolor:
    "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1280,quality=85/https://static.higgsfield.ai/video-edit-tutorial/recolor-restyle.webp",
  recolorVideo:
    "https://static.higgsfield.ai/video-edit-tutorial/v4/recolor-restyle.mp4",
} as const;

export const academyImages = [
  "https://static.higgsfield.ai/academy/catalog/learning-ugc-creature.webp",
  "https://static.higgsfield.ai/academy/catalog/learning-ugc-sneakers.webp",
  "https://static.higgsfield.ai/academy/catalog/learning-ugc-product.webp",
] as const;

/* -------------------------------------------------------------------------- */
/* Workflow Steps                                                             */
/* -------------------------------------------------------------------------- */

const editStepCdn =
  "https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect";

const rawEditWorkflowSteps = [
  {
    step: "Step 1",
    title: "Input Anything",
    description:
      "Upload reference images (up to 7), a video clip, or simply start with a text idea.",
    source: "https://static.higgsfield.ai/public/asset/empty/video-edit/step-1.webp",
  },
  {
    step: "Step 2",
    title: "Write the prompt",
    description:
      "Use natural language to direct the scene and describe desired scenario",
    source: "https://static.higgsfield.ai/public/asset/empty/video-edit/step-2.webp",
  },
  {
    step: "Step 3",
    title: "Generate with Kling",
    description:
      "Receive high-fidelity video in seconds. Iterate and edit the result seamlessly to perfect your shot",
    source: "https://static.higgsfield.ai/public/asset/empty/video-edit/step-3.webp",
  },
];

export const editWorkflowSteps: EditWorkflowStep[] = rawEditWorkflowSteps.map(
  (item) => ({
    ...item,
    src: `${editStepCdn},width=1920,quality=85/${item.source}`,
    srcSet: [384, 640, 1280, 1920]
      .map(
        (width) =>
          `${editStepCdn},width=${width},quality=85/${item.source} ${width}w`,
      )
      .join(", "),
  }),
);

/* -------------------------------------------------------------------------- */
/* Editing Tools                                                              */
/* -------------------------------------------------------------------------- */

export const editTools: readonly EditTool[] = [
  {
    id: "edit-video",
    title: "Edit Video",
    description: "Make targeted changes",
    icon: "sparkles",
  },
  {
    id: "extend-video",
    title: "Extend Video",
    description: "Generate a continuation",
    icon: "film",
  },
  {
    id: "reframe",
    title: "Reframe",
    description: "Resize and reposition for any format",
    icon: "crop",
  },
  {
    id: "upscale",
    title: "Upscale",
    description: "Increase resolution",
    icon: "expand",
  },
  {
    id: "remove-background",
    title: "Remove Background",
    description: "Cut out the object",
    icon: "layers2",
    isNew: true,
  },
  {
    id: "sdr-to-hdr",
    title: "SDR to HDR",
    description: "Convert SDR footage to HDR",
    icon: "sun-moon",
    isNew: true,
  },
  {
    id: "fps-boost",
    title: "FPS Boost",
    description: "Increase frame rate",
    icon: "gauge",
    isNew: true,
  },
  {
    id: "depth-map",
    title: "Depth Map",
    description: "Depth maps from media",
    icon: "clapperboard",
    isNew: true,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Video Tabs                                                                 */
/* -------------------------------------------------------------------------- */

export const videoTabs: { id: VideoTab; label: string }[] = [
  { id: "create", label: "Create Video" },
  { id: "edit", label: "Edit Video" },
  { id: "motion", label: "Motion Control" },
];

/* -------------------------------------------------------------------------- */
/* AI Video Models                                                            */
/* -------------------------------------------------------------------------- */

export const featuredVideoModels: VideoModel[] = [
  { id: "wan3", name: "Wan 3.0", res: "1080p", dur: "5s-30s", glyph: "wan" },
  { id: "kling3", name: "Kling 3.0", res: "4K", dur: "3s-15s", glyph: "kling" },
  {
    id: "kling3mc",
    name: "Kling 3.0 Motion Control",
    res: "1080p",
    dur: "3s-30s",
    glyph: "kling",
  },
  {
    id: "grok15lite",
    name: "Grok Imagine 1.5 Lite",
    res: "1080p",
    dur: "1s-15s",
    badge: "NEW",
    glyph: "grok",
  },
  {
    id: "grok15",
    name: "Grok Imagine 1.5",
    res: "720p",
    dur: "1s-15s",
    glyph: "grok",
  },
];

export const videoModelFamilies: VideoModelFamily[] = [
  {
    id: "hailuo",
    name: "Minimax Hailuo",
    desc: "High-dynamic, VFX-ready, fastest and most affordable",
    glyph: "wave",
    items: [
      { id: "h3max", name: "MiniMax H3 Max", res: "768p", dur: "5s-15s" },
      { id: "h3", name: "MiniMax H3", res: "2K", dur: "5s-15s" },
      {
        id: "h23f",
        name: "Minimax Hailuo 2.3 Fast",
        res: "1080p",
        dur: "6s-10s",
      },
      {
        id: "h23",
        name: "Minimax Hailuo 2.3",
        res: "1080p",
        dur: "6s-10s",
        badge: "PREMIUM",
      },
      {
        id: "h02f",
        name: "Minimax Hailuo 02 Fast",
        res: "512p",
        dur: "6s-10s",
      },
      {
        id: "h02",
        name: "Minimax Hailuo 02",
        res: "1080p",
        dur: "6s-10s",
        badge: "PREMIUM",
      },
    ],
  },
  {
    id: "flux3",
    name: "FLUX.3 Video",
    desc: "Text, image, and video generation with synchronized audio",
    glyph: "tri",
    items: [
      { id: "flux3", name: "FLUX.3 Video", res: "1080p", dur: "5s-10s" },
      { id: "flux3f", name: "FLUX.3 Video Fast", res: "720p", dur: "5s-10s" },
    ],
  },
];

export const allVideoModels: VideoModel[] = [
  ...featuredVideoModels,
  ...videoModelFamilies.flatMap((family) => family.items),
];

// ── Edit-video model picker data ──────────────────────────────────────────

export type EditModelChip = { icon?: "resolution" | "clock"; text: string };

export type EditModelEntry = {
  id: string;
  name: string;
  /** Provider key maps to an SVG icon inside EditModelPicker */
  provider: "seedance" | "genjutsu" | "kling" | "wan" | "minimax" | "gemini" | "flux" | "grok";
  badge?: "top" | "new";
  sound?: boolean;
  chips: EditModelChip[];
};

export const editModels: EditModelEntry[] = [
  { id: "seedance-2.5", name: "Seedance 2.5", provider: "seedance", badge: "top", chips: [{ text: "1080p" }, { text: "4s-30s" }] },
  { id: "seedance-2.5-draft", name: "Seedance 2.5 Draft", provider: "seedance", badge: "new", chips: [{ text: "480p" }, { text: "4s-30s" }] },
  { id: "genjutsu", name: "Higgsfield Genjutsu", provider: "genjutsu", badge: "new", chips: [{ icon: "resolution", text: "1080p" }, { icon: "clock", text: "4s-30s" }] },
  { id: "genjutsu-lite", name: "Higgsfield Genjutsu Lite", provider: "genjutsu", badge: "new", chips: [{ icon: "resolution", text: "1080p" }, { icon: "clock", text: "4s-30s" }] },
  { id: "kling-4.0", name: "Kling 4.0", provider: "kling", badge: "new", chips: [{ icon: "resolution", text: "1080p" }, { icon: "clock", text: "3s-30s" }] },
  { id: "wan-3.0-prime", name: "Wan 3.0 Prime", provider: "wan", sound: true, chips: [{ icon: "resolution", text: "1080p" }, { icon: "clock", text: "2s-30s" }] },
  { id: "seedance-2.5-edit", name: "Seedance 2.5 Edit", provider: "seedance", badge: "top", chips: [{ text: "480p-720p" }, { text: "Edit Video" }, { text: "Audio" }] },
  { id: "seedance-2.0", name: "Seedance 2.0", provider: "seedance", chips: [{ icon: "resolution", text: "4K" }, { icon: "clock", text: "4s-15s" }] },
  { id: "seedance-2.0-fast", name: "Seedance 2.0 Fast", provider: "seedance", chips: [{ icon: "resolution", text: "720p" }, { icon: "clock", text: "4s-15s" }] },
  { id: "seedance-2.0-mini", name: "Seedance 2.0 Mini", provider: "seedance", chips: [{ icon: "resolution", text: "720p" }, { icon: "clock", text: "4s-15s" }] },
  { id: "minimax-h3", name: "MiniMax H3", provider: "minimax", chips: [{ icon: "resolution", text: "2K" }, { icon: "clock", text: "5s-15s" }] },
  { id: "minimax-h3-max", name: "MiniMax H3 Max", provider: "minimax", chips: [{ icon: "resolution", text: "768p" }, { icon: "clock", text: "5s-15s" }] },
  { id: "gemini-flash-1.1", name: "Gemini Omni Flash 1.1", provider: "gemini", chips: [{ icon: "resolution", text: "4K" }, { icon: "clock", text: "3s-10s" }] },
  { id: "gemini-flash-1.1-ext", name: "Gemini Omni Flash 1.1 Extend", provider: "gemini", chips: [{ icon: "resolution", text: "4K" }, { icon: "clock", text: "3s-10s" }] },
  { id: "flux3-video", name: "FLUX.3 Video", provider: "flux", sound: true, chips: [{ icon: "resolution", text: "4K" }, { icon: "clock", text: "5s-20s" }] },
  { id: "kling-3.0", name: "Kling 3.0", provider: "kling", sound: true, chips: [{ icon: "resolution", text: "4K" }, { icon: "clock", text: "3s-15s" }] },
  { id: "kling-3.0-motion", name: "Kling 3.0 Motion Control", provider: "kling", chips: [{ icon: "resolution", text: "1080p" }, { icon: "clock", text: "3s-30s" }] },
  { id: "grok-1.5-lite", name: "Grok Imagine 1.5 Lite", provider: "grok", badge: "new", chips: [{ icon: "resolution", text: "1080p" }, { icon: "clock", text: "1s-15s" }] },
  { id: "grok-1.5", name: "Grok Imagine 1.5", provider: "grok", chips: [{ icon: "resolution", text: "720p" }, { icon: "clock", text: "1s-15s" }] },
];

