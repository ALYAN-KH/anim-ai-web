// Saved reference markup is supplemented by the public catalog used by higgsfield.ai/katana.
// Refresh exact video URLs and category metadata with `node scripts/sync-katana.mjs`.
import presets from "./presets.json";

export type KatanaPreset = {
  id: string;
  title: string;
  width: number;
  height: number;
  image: string;
  /** Example edit from the card's <video>; only present when the capture included one. */
  video?: string;
  poster?: string;
  /** Like count as captured; absent when the card was cut off before its like button. */
  likes?: number;
  /** Verified public-catalog category, when available. */
  category?: KatanaCategory;
};

export const KATANA_CATEGORIES = ["Personalized edits", "Style transfer", "Motion transfer"] as const;
export type KatanaCategory = (typeof KATANA_CATEGORIES)[number];

export const KATANA_PRESETS = presets as KatanaPreset[];

export const KATANA_IMAGE_SIZES = "(max-width: 768px) 384px, (max-width: 1200px) 33vw, 15vw";
// Exact reference files, cached by scripts/cache-katana-media.mjs. Provenance is saved beside them.
export const BANNER_VIDEO = "/media/katana/banner.mp4";
export const BANNER_POSTER = "/media/katana/banner.webp";
export const HERO_VIDEO = "/media/katana/hero.mp4";
export const HERO_POSTER = "/media/katana/hero.webp";
export const TUTORIAL_VIDEO = "/media/katana/connect.mp4";
export const TUTORIAL_POSTER = "/media/katana/connect.png";
export const CONNECT_URL = "https://claude.ai/new";
