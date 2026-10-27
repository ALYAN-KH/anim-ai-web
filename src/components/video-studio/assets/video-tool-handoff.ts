import type { VideoSelection } from "./preset-videos";

let pending: VideoSelection | null = null;
export function pendingToolVideo() {
  const video = pending;
  // Both responsive composers mount during the same render.
  if (video) queueMicrotask(() => { if (pending === video) pending = null; });
  return video;
}

export async function openVideoTool(video: VideoSelection, tool: "edit" | "upscale") {
  // A new URL keeps a local upload alive when the source composer unmounts.
  pending = video.url.startsWith("blob:") ? { ...video, url: URL.createObjectURL(await (await fetch(video.url)).blob()) } : { ...video };
  window.history.pushState(null, "", `/ai/video/edit?tool=${tool}`);
  window.dispatchEvent(new CustomEvent("video-studio-open-tool"));
  window.dispatchEvent(new PopStateEvent("popstate"));
}
