const S = "https://static.higgsfield.ai/ads-studio";

const WIDTHS = [64, 52, 64, 64, 68, 104, 64, 52, 64, 88, 52, 52, 66, 56, 66];
const SHADOWED = new Set([1, 2, 4, 8, 13, 14]);
export const STRIP = WIDTHS.map((width, i) => ({ width, src: `${S}/home/hero-strip-${i + 1}.webp`, shadow: SHADOWED.has(i) }));

export type AdsTool = { id: "static" | "multiplier"; title: string; text: string; cta: string; video: string; poster: string };
export const TOOLS: AdsTool[] = [
  { id: "static", title: "Create performing static ads", text: "On-brand ads for every product at scale", cta: "Create ads", video: `${S}/hero/carousel-video.mp4`, poster: `${S}/hero/carousel-video-poster.webp` },
  { id: "multiplier", title: "Ad multiplier", text: "Recreate ad with your products, characters", cta: "Try ad multiplier", video: `${S}/home/ad-multiplier-card.mp4`, poster: `${S}/home/ad-multiplier-card-poster.webp` },
];

// Steps 2-4 media follow the same video-N / video-N-poster naming as step 1.
export const STEPS = [
  { title: "Your brand kit is created from your website", text: "Enter your website. Your logo, colors, brand voice, and selling points load automatically. Edit anything" },
  { title: "Your products are imported automatically", text: "We pick them up from your site with names, images and prices. Missing one? Upload it and it joins the list" },
  { title: "Fresh ads for any product, anytime", text: "Variations for each product in 1:1, 4:5, and 9:16, with headlines and CTAs" },
  { title: "Every ad is shaped by market insights", text: "Each ad is built on what is actually working for your product" },
].map((s, i) => ({ ...s, video: `${S}/empty-state/video-${i + 1}.mp4`, poster: `${S}/empty-state/video-${i + 1}-poster.webp` }));
