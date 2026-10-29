import reference from "./reference.json";
import media from "./media.json";

const cache = media as Record<string, string>;
export const source = (url?: string) => url ? cache[url] || url : undefined;
export const poster = (video?: string, image?: string) => source(image) || (video ? cache[`${video}#poster`] : undefined);
export const quickPoster = (video?: string, image?: string) => (video ? cache[`${video}#preview`] : undefined) || source(image);
export const slides = reference.slides;
export const presets = reference.cards;
export type Preset = typeof presets[number];
export const quickLinks = reference.quick;
export const icons = reference.icons;

/** Connect the reference's mobile URLs to the equivalent existing local tools. */
export function destination(href: string) {
  const url = new URL(href, "https://higgsfield.ai");
  if (url.pathname === "/start/genjutsu") return "/ai/video?model=genjutsu";
  if (url.pathname === "/start/agent") {
    const model = url.searchParams.get("model");
    return url.searchParams.get("mode") === "image" ? "/ai/image?model=soul-v2" : `/ai/video${model ? `?model=${model}` : ""}`;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
