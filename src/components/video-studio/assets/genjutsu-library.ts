import { videoPresets } from "./preset-videos";

export type GenjutsuMode = "motion" | "swap";

export type GenjutsuItem = {
  id: string;
  name: string;
  mode: GenjutsuMode;
  likes: number;
  url: string;
  poster: string;
};

export const GENJUTSU_MODES: Record<GenjutsuMode, string> = { motion: "Motion transfer", swap: "Objects swap" };

const BASE = "https://d8j0ntlcm91z4.cloudfront.net/community-presets/";
const clip = (id: string) => `${BASE}${id}/generation-genjutsu-h264-600-v1.mp4`;
const poster = (id: string) => `${BASE}${id}/generation.webp`;

// First cards of the live Motion Library, with their real mode and like counts.
const LIVE: GenjutsuItem[] = [
  { id: "7cd5101b-3faa-4488-b0c9-d25c4ed63efc", name: "Objects Swap 1", mode: "swap" as GenjutsuMode, likes: 142 },
  { id: "ba4e6baf-c828-49c1-aaa9-217e40a9cd2a", name: "Objects Swap 2", mode: "swap" as GenjutsuMode, likes: 213 },
  { id: "74db1b30-8fc0-4db2-86da-ca29995668cd", name: "Cash Stack Flex", mode: "motion" as GenjutsuMode, likes: 388 },
  { id: "d281aa41-ebbf-4498-b1bc-14c56e97af2d", name: "Motion Transfer 1", mode: "motion" as GenjutsuMode, likes: 96 },
  { id: "613ebae7-6d90-4867-81aa-4d26747864c6", name: "Motion Transfer 2", mode: "motion" as GenjutsuMode, likes: 945 },
  { id: "c35086c9-fa91-4097-b12e-3b1da4673a37", name: "Motion Transfer 3", mode: "motion" as GenjutsuMode, likes: 904 },
  { id: "1908b554-d3b2-4bd0-afa3-f6e0bc971ca0", name: "Motion Transfer 4", mode: "motion" as GenjutsuMode, likes: 200 },
  { id: "c631f048-e718-4a84-b2a4-11c1a8f66ca7", name: "Motion Transfer 5", mode: "motion" as GenjutsuMode, likes: 839 },
  { id: "807458af-2ab0-4c3f-b130-2274d7930a95", name: "Motion Transfer 6", mode: "motion" as GenjutsuMode, likes: 120 },
].map(item => ({ ...item, url: clip(item.id), poster: poster(item.id) }));

// The remaining Genjutsu clips come from the preset catalogue; mode and likes are placeholders.
const EXTRA: GenjutsuItem[] = videoPresets
  .filter(preset => preset.url.includes("generation-genjutsu") && !LIVE.some(item => preset.url.includes(item.id)))
  .map((preset, index) => {
    const id = preset.url.split("/community-presets/")[1].split("/")[0];
    const mode: GenjutsuMode = index % 3 === 0 ? "swap" : "motion";
    return { id, name: preset.name, mode, likes: 40 + ((index * 53) % 320), url: preset.url, poster: poster(id) };
  });

export const genjutsuLibrary: readonly GenjutsuItem[] = [...LIVE, ...EXTRA];

export type GenjutsuSource = "higgsfield" | "trending" | "new";

// The three source tabs share one set of videos, in the same order.
export function genjutsuItems(_source: GenjutsuSource): GenjutsuItem[] {
  return [...genjutsuLibrary];
}
