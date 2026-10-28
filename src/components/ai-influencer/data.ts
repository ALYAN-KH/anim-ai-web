import options from "./data/options.json";
import influencers from "./data/influencers.json";
import icons from "./data/icons.json";

/** Character tiers: three human intensities plus six animal families. */
export type TierId = "normal" | "freak" | "total" | "insects" | "frogs" | "cats" | "dogs" | "capybaras" | "birds";
export type SectionId =
  | "tier" | "gender" | "body_type" | "hair" | "hair_colour" | "aesthetic" | "ethnicity_origin_base" | "age"
  | "skin_tone" | "height" | "proportions" | "freak_head" | "freak_neck" | "eye_shape" | "eye_color"
  | "freak_face" | "facial_hair" | "distinctive" | "accessory";
/** How an option renders: white head card, corner icon, full-bleed image, colour swatch or text pill. */
export type CardStyle = "tier" | "corner" | "cover" | "color" | "text";

export type CharacterOption = {
  id: string;
  label: string;
  image?: string;
  swatch?: string;
  visibleIn: string[];
  slot?: string;
};
export type CharacterSection = {
  id: SectionId;
  label: string;
  kind: "media" | "color" | "text";
  max: number;
  style: CardStyle;
  /** Verbatim icon markup from the reference sidebar. */
  icon: string;
  options: CharacterOption[];
};
/** Selected option ids per section (tier is stored separately). */
export type Selection = Partial<Record<SectionId, string[]>>;

export type InfluencerPreset = {
  id: string;
  name: string;
  preview: { url: string; thumb: string; width: number; height: number };
  sheet: { url: string; thumb: string; width: number; height: number };
  tier: TierId;
  selection: Selection;
  brief: string;
  seed: number;
};

export type PresetMedia = { url: string; thumb?: string; main?: string; width: number; height: number };
export type MotionPreset = {
  id: string;
  title: string;
  description: string;
  source: "higgsfield" | "community";
  jobType: string;
  mode: MotionMode;
  aspect: "9/16" | "3/4" | "3/2" | "16/9";
  original: PresetMedia;
  likes?: number;
  variants: { type: "edit" | "original" | "generation"; media: PresetMedia; prompt?: string; inputs: { url: string; thumb?: string; role: string }[]; resolution?: string }[];
  prompt?: string;
  resolution?: string;
};
export type MotionMode = "transfer" | "swap";
export type ExploreFeed = "influencers" | "presets" | "trends";

export const SECTIONS = options.sections as CharacterSection[];
export const TIER_SECTION = SECTIONS[0];
export const CHARACTER_SECTIONS = SECTIONS.slice(1);
export const STYLE_REF_ICON = options.styleRefIcon;
export const ANIMAL_TIERS = ["insects", "frogs", "cats", "dogs", "capybaras", "birds"] as const;
export const ANIMAL_SECTIONS = options.animalSections as SectionId[];
export const RULE_MESSAGES = Object.fromEntries(options.rules.map((r) => [r.id, r.message])) as Record<"kfgdXQ" | "tTsi1Q", string>;
export const DEFAULT_TIER: TierId = "total";
export const INFLUENCERS = influencers as InfluencerPreset[];
export const ICONS = icons as Record<string, string>;

/** Motion presets are large, so they ship as static JSON fetched when their tab opens. */
export const FEED_URLS: Record<Exclude<ExploreFeed, "influencers">, string> = {
  presets: "/ai-influencer/presets.json",
  trends: "/ai-influencer/trends.json",
};

const HERO_ROOT = "https://static.higgsfield.ai/ai-influencer/hero/2026-10-04";
/** The fanned hero collage: width:height ratio and stacking order match the reference. */
export const HERO_CLIPS = [
  { id: "cream-shirt", ratio: [90, 160], z: 0 },
  { id: "cream-tuxedo", ratio: [101, 180], z: 1 },
  { id: "red-bob", ratio: [113, 200], z: 2 },
  { id: "green-suit", ratio: [101, 180], z: 1 },
  { id: "burgundy-suit-dancer", ratio: [90, 160], z: 0 },
].map((clip) => ({ ...clip, video: `${HERO_ROOT}/${clip.id}.mp4`, poster: `${HERO_ROOT}/${clip.id}-poster.webp` }));

export const GENJUTSU_PREVIEW = "https://static.higgsfield.ai/genjutsu/model-preview-20261006/ver-1.mp4";
export const MOTION_MODEL = "Higgsfield Genjutsu";
/** Output qualities offered by the Genjutsu generator panel. */
export const QUALITIES = ["720p", "1080p"] as const;
export type Quality = (typeof QUALITIES)[number];

const EMPTY_ROOT = "https://static.higgsfield.ai/ai-influencer/design-update/2026-10-02/illustrations";
export const HISTORY_EMPTY = {
  glowWide: `${EMPTY_ROOT}/empty-glow-wide.svg`,
  glowTall: `${EMPTY_ROOT}/empty-glow-tall.svg`,
  portrait: `${EMPTY_ROOT}/empty-portrait.webp`,
  chips: [
    { label: "Female", image: `${EMPTY_ROOT}/empty-female.webp`, corner: true, transform: "translateY(0em) rotate(7.5deg)" },
    { label: "European", image: `${EMPTY_ROOT}/empty-european.webp`, transform: "translateY(-0.125em) rotate(-10.77deg)" },
    { label: "Retro", image: `${EMPTY_ROOT}/empty-retro.webp`, transform: "translateY(0.125em) rotate(4.2deg)" },
    { label: "Freckles", image: `${EMPTY_ROOT}/empty-freckles.webp`, transform: "translateY(-0.0625em) rotate(-1.82deg)" },
    { label: "Bob", image: `${EMPTY_ROOT}/empty-bob.webp`, transform: "translateY(-0.375em) rotate(3.29deg)" },
  ],
};

/** Sheet dialog groups, in the order the reference lists parameters. */
export const SHEET_GROUPS: { label: string; icon: string; sections: SectionId[] }[] = [
  { label: "Character parameters", icon: "groupCharacter", sections: ["tier", "gender", "ethnicity_origin_base", "age", "skin_tone", "height", "body_type", "proportions"] },
  { label: "Face", icon: "groupFace", sections: ["freak_head", "freak_neck", "eye_shape", "eye_color", "freak_face", "distinctive"] },
  { label: "Hair", icon: "groupHair", sections: ["facial_hair", "hair", "hair_colour"] },
  { label: "Style", icon: "groupStyle", sections: ["aesthetic", "accessory"] },
];
