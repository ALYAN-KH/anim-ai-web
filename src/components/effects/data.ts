import effects from "@/data/content/sections/effects";

export type EffectSlot = { key: "character" | "location" | "products"; label: string; optional: boolean; multiple?: boolean };
export type Effect = { id: string; title: string; poster: string; video?: string; ratio: [number, number]; slots: EffectSlot[] };

const SLOTS: Record<EffectSlot["key"], EffectSlot> = {
  character: { key: "character", label: "Character", optional: false },
  location: { key: "location", label: "Location", optional: true },
  products: { key: "products", label: "Products", optional: true, multiple: true },
};
const FULL = [SLOTS.character, SLOTS.location, SLOTS.products];
const SLOTS_BY_ID: Record<string, EffectSlot[]> = {
  "world-morphing": [SLOTS.character, SLOTS.location],
  "street-colossus": [SLOTS.character, SLOTS.location],
  melting: [SLOTS.character, SLOTS.products],
};

export const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Monster dab only appears in the captured markup (poster, no video).
const captured = [{ t: "Monster dab", poster: "https://cdn.higgsfield.ai/viral_hub/afd75c6a-1880-4cc0-bab9-576c4d1e7ff1.webp", video: undefined, aspectRatio: "16 / 9" }];

export const EFFECTS: Effect[] = [...effects, ...captured].map(e => {
  const [w, h] = e.aspectRatio.split("/").map(Number);
  const id = slugify(e.t);
  return { id, title: e.t, poster: e.poster, video: e.video, ratio: [w, h], slots: SLOTS_BY_ID[id] ?? FULL };
});

export const RESOLUTIONS = ["480p", "720p", "1080p"];
export const ASPECTS = ["Auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"];
export const DEFAULT_EFFECT = "floating-fall";
