import type { PresetCategory, PresetDefinition } from "../types";
import { STATIC } from "./links";

export const PRESET_CATEGORIES: PresetCategory[] = [
  { id: "popular", label: "Popular", icon: "flame", group: "main" },
  { id: "paid-ads", label: "Paid Ads", icon: "dollar", group: "main" },
  { id: "motion-design", label: "Motion Design", icon: "motion", group: "main" },
  { id: "marketing", label: "Marketing", icon: "marketing", group: "main" },
  { id: "production", label: "Production", icon: "camera", group: "main" },
  { id: "ugc", label: "UGC", icon: "user", group: "main" },
  { id: "faceless", label: "Faceless", icon: "play", group: "main" },
  { id: "after-effects", label: "For After Effects", icon: "ae", group: "plugins" },
  { id: "blender", label: "For Blender", icon: "blender", group: "plugins" },
];

const C = "https://d2ol7oe51mr4n9.cloudfront.net/content_user_id";

/**
 * The 7 "Popular" cards scraped from https://higgsfield.ai/mcp?tab=chatgpt.
 * Titles, descriptions, commands, prompts, links are verified.
 * `media` is each card's cover video + poster (URLs verified to serve video/mp4).
 */
export const PRESETS: PresetDefinition[] = [
  {
    id: "katana",
    title: "Recreate aura edits",
    isNew: true,
    description:
      "Turn your footage into an aura edit, or recreate a reference with your own subject, pacing, transitions, and visual effects.",
    command: "katana",
    categories: ["production", "motion-design"],
    popular: true,
    slug: "katana",
    prompt:
      "/katana Recreate this aura edit using my subject. Match the reference’s pacing, camera movement, transitions, color grade, and graphic effects, and adapt the scenes and on-screen text to my subject. Keep the reference soundtrack unless I request a different track. Ask me for the reference video and a photo or clip of my subject before starting.",
    references: [
      `${STATIC}/landing/gpt-skills/katana/20261017-inputs/subject-reference.webp`,
      `${STATIC}/landing/gpt-skills/katana/20261017-inputs/style-reference.webp`,
    ],
    media: {
      kind: "video",
      src: `${STATIC}/landing/gpt-skills/katana/20261016/test_v2.mp4`,
      poster: `${STATIC}/landing/gpt-skills/katana/20261016/test_v2-poster.webp`,
    },
  },
  {
    id: "ugc-flow",
    title: "Product review UGC",
    description: "Create a creator-style product review from your product brief and reference images.",
    command: "ugc-flow",
    categories: ["ugc"],
    popular: true,
    slug: "ugc-flow",
    prompt:
      "Create a complete UGC flow for this tumbler using the attached creator, from concept and script to a finished 9:16 video.",
    references: [
      `${C}/804cd979-090a-47d0-aa18-1a052f130a73.webp`,
      `${C}/1df6d4ab-c9e0-440a-a039-e7faeff060c3.webp`,
    ],
    media: {
      kind: "video",
      src: `${STATIC}/mcp/v2/ugc-content.mp4`,
      poster: `${STATIC}/sc-videos-thumbnails/ugc-content-thumbnail.webp`,
    },
  },
  {
    id: "ad-adaptation",
    title: "Ad Recreator",
    description:
      "Turn a reference video’s storytelling and sales structure into an original video ad for your product.",
    command: "marketing-adapt-video",
    categories: ["paid-ads"],
    popular: true,
    slug: "ad-adaptation",
    prompt:
      "/marketing-adapt-video Create an original ad for my product using this reference video’s persuasion structure.",
    references: [`${STATIC}/gpt-astra/gulpo-by-astra-input.mp4`],
    media: {
      kind: "video",
      src: `${STATIC}/gpt-astra/ad-adaptation-cover.mp4`,
      poster: `${STATIC}/gpt-astra/ad-adaptation-cover-poster.webp`,
    },
  },
  {
    id: "link-to-ads",
    title: "Ad Strategist",
    description:
      "Turn product and competitor research into static ads tailored to your market. Explore different angles grounded in what your product offers.",
    command: "marketing-research-to-ads",
    categories: ["paid-ads"],
    popular: true,
    slug: "link-to-ads",
    prompt:
      "/marketing-research-to-ads Research this product and its competitors, then create 5 static Meta ads with distinct angles.",
    references: [`${STATIC}/gpt-astra/sorbet-soda-link-to-ads.webp`],
    media: {
      kind: "video",
      src: `${STATIC}/gpt-skills/media/link-to-ads/cover.mp4`,
      poster: `${STATIC}/gpt-skills/media/link-to-ads/cover-poster.webp`,
    },
  },
  {
    id: "ad-hooks",
    title: "Hook Multiplier",
    description:
      "Give one video multiple opening hooks. Get complete edited versions ready to test different ways of grabbing attention.",
    command: "marketing-hook-variants",
    categories: ["paid-ads"],
    popular: true,
    slug: "ad-hooks",
    prompt:
      "/marketing-hook-variants Create 3 complete versions of this video with new opening hooks. Keep the rest unchanged.",
    references: [`${STATIC}/gpt-astra/dog-ad-hook-original.mp4`],
    media: {
      kind: "video",
      src: `${STATIC}/gpt-skills/media/ad-hooks/cover.mp4`,
      poster: `${STATIC}/gpt-skills/media/ad-hooks/cover-poster.webp`,
    },
  },
  {
    id: "vox-mixed-media",
    title: "Editorial Motion Graphics",
    description: "Explain a story using editorial motion graphics and mixed visual media.",
    command: "vox-mixed-media",
    categories: ["marketing", "faceless"],
    popular: true,
    slug: "vox-mixed-media",
    prompt:
      "Create an editorial motion graphics faceless video about how the Mona Lisa became the world’s most famous painting.",
    references: [],
    media: {
      kind: "video",
      src: `${STATIC}/mcp-landing/editorial-motion-graphics.mp4`,
      poster: `${STATIC}/mcp-landing/editorial-motion-graphics-thumbnail.webp`,
    },
  },
  {
    id: "stickman-explainer",
    title: "Stickman cartoon",
    description: "Turn a story or concept into an animated explainer with simple stickman characters.",
    command: "stickman-explainer",
    categories: ["marketing", "faceless"],
    popular: true,
    slug: "stickman-explainer",
    prompt: "Create a stickman cartoon faceless video showing Odysseus's journey to Troy and back home",
    references: [],
    media: {
      kind: "video",
      src: `${STATIC}/skills-stickerman/sub_1-mini.mp4`,
      poster: `${STATIC}/skills-stickerman/sub_1-mini-thumbnail.webp`,
    },
  },
];
