"use client";

import { AssetsPicker } from "@/components/video-studio/assets/assets-picker";
import { PresetVideosPanel } from "@/components/video-studio/assets/preset-videos-panel";
import type { VideoSelection } from "@/components/video-studio/assets/preset-videos";
import { KATANA_PRESETS, type KatanaPreset } from "./data";
import type { KatanaAsset } from "./useKatanaMedia";

/** Katana supplies selections to the same picker used by the video studio. */
export function MediaPicker({ kind, anchor, assets, likedIds, onSelect, onPreset, onUpload, onClose, error }: {
  kind: "video" | "image"; anchor: DOMRect; assets: KatanaAsset[]; likedIds: string[];
  onSelect: (asset: KatanaAsset) => void; onPreset: (preset: KatanaPreset, selection?: VideoSelection) => void;
  onUpload: (files: FileList) => boolean; onClose: () => void; error?: string | null;
}) {
  const presetGrid = (presets: KatanaPreset[]) => <PresetVideosPanel title="Katana presets" presets={presets.filter(item => item.video).map(item => ({ name: item.title, url: item.video!, poster: item.poster ?? item.image }))} onSelect={selection => {
    const preset = KATANA_PRESETS.find(item => item.video === selection.url);
    if (preset) { onPreset(preset, selection); onClose(); }
  }} />;
  return <AssetsPicker anchor={anchor} onClose={onClose} modal label={kind === "video" ? "Choose reference video" : "Choose your characters"}
    tabs={kind === "video" ? ["uploads", "presets", "videos", "liked"] : ["uploads", "influencer", "images", "liked"]}
    pickerWidth={600} multiple={kind === "image"} uploadLabel="Upload media" error={error}
    accept={kind === "video" ? "video/mp4,video/quicktime,video/webm" : "image/png,image/jpeg,image/webp"}
    onFilesSelected={files => { if (onUpload(files)) onClose(); }}
    panels={kind === "video" ? { presets: presetGrid(KATANA_PRESETS), ...(likedIds.length > 0 ? { liked: presetGrid(KATANA_PRESETS.filter(item => likedIds.includes(item.id))) } : {}) } : undefined}
    renderUploads={({ scope, sort, media }) => {
      const listed = assets.filter(item => item.kind === kind && item.source === "upload")
        .filter(item => scope === "all" || item.createdAt >= Date.now() - 30 * 86400000)
        .filter(item => media === "all" || media === (kind === "video" ? "videos" : "images"))
        .sort((a, b) => sort === "first-created" ? a.createdAt - b.createdAt : sort === "last-created" ? b.createdAt - a.createdAt : b.usedAt - a.usedAt);
      return <>{listed.map(item => <button key={item.id} type="button" aria-label={"Select " + item.name} onClick={() => { onSelect(item); onClose(); }} className="overflow-hidden rounded-xl bg-black/30 text-left outline-none focus-visible:ring-2 focus-visible:ring-lime">
        {item.kind === "video" ? <video src={item.url} muted playsInline preload="metadata" className="aspect-square w-full object-cover" /> : <img src={item.url} alt="" className="aspect-square w-full object-cover" />}<span className="block truncate p-2 text-xs">{item.name}</span>
      </button>)}</>;
    }} />;
}
