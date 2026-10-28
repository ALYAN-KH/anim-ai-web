import previews from "@/data/homeVideoPreviews.json";

// Local, transcoded previews of the remote homepage videos.
// Regenerate with `npm run optimize:videos` while the app is running.
const map: Record<string, { video: string; poster: string }> = previews;

export function previewVideo(url?: string) {
  return (url && map[url]?.video) || url;
}

export function previewPoster(url?: string) {
  return url ? map[url]?.poster : undefined;
}
