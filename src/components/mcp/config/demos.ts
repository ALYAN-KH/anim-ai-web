import type { DemoDefinition } from "../types";
import { STATIC } from "./links";

/**
 * Genjutsu is fully verified (poster, mp4, prompt). The other four have verified
 * posters; run scripts/extract-mcp.mjs and paste `videoSrc` + `prompt` from
 * data/extracted/chatgpt.json.
 */
export const DEMOS: DemoDefinition[] = [
  {
    id: "genjutsu",
    label: "Genjutsu",
    isNew: true,
    poster: `${STATIC}/genjutsu/genjutsu-intro-poster.webp`,
    videoSrc: `${STATIC}/genjutsu/genjutsu-intro.mp4`,
    title: "Genjutsu",
    prompt:
      "Use Genjutsu to remake my reference video with my own characters, locations and products while preserving the original motion, camera movement and timing. Ask me to upload my reference video and images before starting.",
  },
  {
    id: "generate-video",
    label: "Generate video",
    poster: `${STATIC}/landing/gpt-skills/demos/20261016-audio/video-generation-poster.webp`,
    title: "Generate video",
    prompt: "TODO: paste prompt from data/extracted/chatgpt.json",
  },
  {
    id: "generate-image",
    label: "Generate image",
    poster: `${STATIC}/landing/gpt-skills/20261016-assets/demos/fashion.webp`,
    title: "Generate image",
    prompt: "TODO: paste prompt from data/extracted/chatgpt.json",
  },
  {
    id: "edit-photo",
    label: "Edit a photo",
    poster: `${STATIC}/landing/gpt-skills/demos/20261017-photo-swap/photo-original.webp`,
    title: "Edit a photo",
    prompt: "TODO: paste prompt from data/extracted/chatgpt.json",
  },
  {
    id: "video-edit",
    label: "Video edit",
    poster: `${STATIC}/landing/gpt-skills/katana/20261016/test_v2-poster.webp`,
    title: "Video edit",
    prompt: "TODO: paste prompt from data/extracted/chatgpt.json",
  },
];
