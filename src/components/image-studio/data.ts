import { soulStyle } from "@/data/imageStudio";

export type ModelIcon = "snake" | "snakeDim" | "gpt" | "google" | "seedream";

export interface ModelOption {
  id: string;
  name: string;
  short: string;
  desc: string;
  badge?: "PREMIUM" | "NEW";
  icon: ModelIcon;
}

export interface Preset {
  name: string;
  src: string;
  fallback?: string;
}

export interface Aspect {
  id: string;
  w: number;
  h: number;
}

export interface Quality {
  id: string;
  desc: string;
}

export type MenuName = "aspect" | "quality";

/**
 * 4th image of the "Make your own character" collage (pink-hair close-up).
 * Save the image from higgsfield.ai into /public/higgsfield-assets/ with this name.
 */
export const characterCollageFourth =
  "/higgsfield-assets/character-example-4.jpg";

/**
 * Moodboard ("General") window collage. The site swaps the whole set of 4 cards
 * between these looks. Save the images into /public/higgsfield-assets/.
 */
export const moodboardCollageSets: string[][] = [
  [
    "/higgsfield-assets/moodboard-collage-1.jpg", // sky + flowers
    "/higgsfield-assets/moodboard-collage-2.jpg", // desert / olive pants
    "/higgsfield-assets/moodboard-collage-3.jpg", // blue jacket (circle)
    "/higgsfield-assets/moodboard-collage-4.jpg", // orange pants, glasshouse
  ],
  [
    "/higgsfield-assets/moodboard-collage-b-1.jpg", // silver illustration
    "/higgsfield-assets/moodboard-collage-b-2.jpg", // pink moth
    "/higgsfield-assets/moodboard-collage-b-3.jpg", // sword on rock (circle)
    "/higgsfield-assets/moodboard-collage-b-4.jpg", // pink-hair girl
  ],
  [
    "/higgsfield-assets/moodboard-collage-c-1.jpg", // striped fabric
    "/higgsfield-assets/moodboard-collage-c-2.jpg", // snowy street
    "/higgsfield-assets/moodboard-collage-c-3.jpg", // snowy mountains (circle)
    "/higgsfield-assets/moodboard-collage-c-4.jpg", // white goat
  ],
];

/** Official preset art, published on Higgsfield's own static CDN (soul-v2 library). */
export const hf = (name: string) =>
  `https://static.higgsfield.ai/soul-v2/${name}.webp`;

export const asset = (n: string) => `/higgsfield-assets/${n}.jpg`;

/**
 * Preset list in the same order/names as the live site (read from screenshots).
 * `src` = the real thumbnail you save into /public/higgsfield-assets/.
 * `fallback` = a public official image used only until that file exists.
 */
export const moodboardPresets: Preset[] = [
  { name: "General", src: soulStyle },
  { name: "Warm ambient", src: hf("library-1-2") },
  { name: "Y2K studio", src: hf("library-2-4") },
  { name: "Swag era", src: hf("library-2-1") },
  { name: "Theatrical light", src: hf("library-2-5") },
  // row 2
  {
    name: "Y2K street",
    src: asset("moodboard-y2k-street"),
    fallback: hf("library-2-2"),
  },
  {
    name: "Flash editorial",
    src: asset("moodboard-flash-editorial"),
    fallback: hf("library-1-4"),
  },
  {
    name: "Old smartphone",
    src: asset("moodboard-old-smartphone"),
    fallback: hf("library-1-5"),
  },
  {
    name: "Street photography",
    src: asset("moodboard-street-photography"),
    fallback: hf("library-1-3"),
  },
  {
    name: "Retro BW",
    src: asset("moodboard-retro-bw"),
    fallback: hf("library-1-1"),
  },
  // later rows
  {
    name: "Mystique city",
    src: asset("moodboard-mystique-city"),
    fallback: hf("library-1-1"),
  },
  {
    name: "Candy pop",
    src: asset("moodboard-candy-pop"),
    fallback: hf("library-1-6"),
  },
  {
    name: "Double exposure",
    src: asset("moodboard-double-exposure"),
    fallback: hf("library-2-3"),
  },
  {
    name: "2000s band",
    src: asset("moodboard-2000s-band"),
    fallback: hf("library-2-6"),
  },
  {
    name: "Frutiger aero",
    src: asset("moodboard-frutiger-aero"),
    fallback: hf("library-1-6"),
  },
  { name: "Drain", src: asset("moodboard-drain"), fallback: hf("library-1-1") },
  {
    name: "Extraterrestrial",
    src: asset("moodboard-extraterrestrial"),
    fallback: hf("library-2-4"),
  },
  {
    name: "Editorial street style",
    src: asset("moodboard-editorial-street-style"),
    fallback: hf("library-1-3"),
  },
  {
    name: "Nature light",
    src: asset("moodboard-nature-light"),
    fallback: hf("library-2-3"),
  },
  {
    name: "New Indie",
    src: asset("moodboard-new-indie"),
    fallback: hf("library-1-5"),
  },
];

export const moodboardCollageFallbacks: string[][] = [
  [hf("library-2-1"), hf("library-1-1"), hf("library-2-4")],
  [hf("library-1-3"), hf("library-2-5"), hf("library-1-6")],
  [hf("library-2-6"), hf("library-2-3"), hf("library-1-2")],
  [hf("library-1-4"), hf("library-1-5"), hf("library-2-2")],
];

export const COLLAGE_SHOW_MS = 2800;
export const COLLAGE_OUT_MS = 450;
export const COLLAGE_GAP_MS = 250;
export const COLLAGE_IN_MS = 600;
export const COLLAGE_STAGGER_MS = 70;

export const models: ModelOption[] = [
  {
    id: "soul-2",
    name: "Higgsfield Soul 2.0",
    short: "Soul 2.0",
    desc: "Next generation ultra-realistic fashion visuals",
    icon: "snake",
  },
  {
    id: "soul-cinema",
    name: "Higgsfield Soul Cinema",
    short: "Soul Cinema",
    desc: "Cinema-grade visual creation",
    icon: "snakeDim",
  },
  {
    id: "gpt-sunburst",
    name: "GPT Image 2.5 Sunburst",
    short: "GPT Sunburst",
    desc: "Exceptional quality, precise edits",
    badge: "PREMIUM",
    icon: "gpt",
  },
  {
    id: "gpt-flare",
    name: "GPT Image 2.5 Flare",
    short: "GPT Flare",
    desc: "Stunning everyday images, fast",
    badge: "PREMIUM",
    icon: "gpt",
  },
  {
    id: "nano-banana-21",
    name: "Nano Banana 2.1",
    short: "Nano Banana 2.1",
    desc: "Google's next-gen flagship image model",
    badge: "NEW",
    icon: "google",
  },
  {
    id: "seedream-5-pro",
    name: "Seedream 5.0 Pro",
    short: "Seedream 5.0 Pro",
    desc: "Logically consistent images with intelligent visual reasoning",
    badge: "PREMIUM",
    icon: "seedream",
  },
  {
    id: "seedream-5-flash",
    name: "Seedream 5.0 Flash",
    short: "Seedream 5.0 Flash",
    desc: "Fast image generation with intelligent visual reasoning",
    badge: "PREMIUM",
    icon: "seedream",
  },
  {
    id: "seedream-5-lite",
    name: "Seedream 5.0 lite",
    short: "Seedream 5.0 lite",
    desc: "Intelligent visual reasoning",
    icon: "seedream",
  },
  {
    id: "seedream-45",
    name: "Seedream 4.5",
    short: "Seedream 4.5",
    desc: "ByteDance's next-gen 4K image model",
    badge: "PREMIUM",
    icon: "seedream",
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    short: "Nano Banana Pro",
    desc: "Google's flagship generation model",
    icon: "google",
  },
];

export const aspects: Aspect[] = [
  { id: "9:16", w: 9, h: 16 },
  { id: "3:4", w: 3, h: 4 },
  { id: "2:3", w: 2, h: 3 },
  { id: "1:1", w: 1, h: 1 },
  { id: "4:3", w: 4, h: 3 },
  { id: "16:9", w: 16, h: 9 },
  { id: "3:2", w: 3, h: 2 },
];

export const qualities: Quality[] = [
  { id: "1.5k", desc: "Fastest and cheapest" },
  { id: "2k", desc: "Best visual fidelity" },
];

/** Credits charged per generated image. */
export const CREDITS_PER_IMAGE = 0.125;

export const shineCss = `
@keyframes ct-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes ct-glow {
  0%, 100% { opacity: .55; }
  50% { opacity: 1; }
}
@keyframes mb-card-in {
  from { opacity: 0; transform: translateY(10px) scale(.97); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ct-ring, .ct-glow { animation: none !important; }
  .mb-card, .cycle-img { animation: none !important; transition: none !important; }
}
`;

export const panelClass =
  "fixed z-30 overflow-hidden rounded-[22px] border border-white/10 bg-[#181a1c] shadow-[0_24px_80px_#000]";

export const panelStyle = {
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 150,
  width: "min(880px, calc(100vw - 24px))",
  height: 474,
} as const;

export const fade = (visible: boolean) =>
  ({
    opacity: visible ? 1 : 0,
    translate: visible ? "0 0" : "0 12px",
    transition: "opacity 200ms ease, translate 220ms ease",
    pointerEvents: visible ? "auto" : "none",
  }) as const;
