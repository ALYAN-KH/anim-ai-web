"use client";

import { useEffect, useRef, useState } from "react";
import { CropIcon, ExpandIcon } from "../shared/icons";
import { LOADING_MS, LoadingGrid } from "./generations-panel";
import { communityVideoPresets, type VideoPreset, type VideoSelection } from "./preset-videos";

import { VideoCropDialog } from "./video-crop-dialog";
import { VideoPreviewDialog } from "./video-preview-dialog";

type Selection = VideoSelection;

function PlayIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true"><path d="M8 5.5a1 1 0 0 1 1.52-.85l10 6.5a1 1 0 0 1 0 1.7l-10 6.5A1 1 0 0 1 8 18.5v-13Z" /></svg>;
}

function PresetCard({ preset, onSelect, onPreview, onCrop }: { preset: VideoPreset; onSelect: () => void; onPreview: () => void; onCrop: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-xl bg-white/[.06]"
      onPointerEnter={() => { setHovering(true); videoRef.current?.play().catch(() => undefined); }}
      onPointerLeave={() => { setHovering(false); videoRef.current?.pause(); }}
    >
      <video ref={videoRef} src={preset.url} poster={preset.poster} muted loop playsInline preload="none" className="size-full object-contain" aria-hidden="true" />
      <button type="button" onClick={onSelect} aria-label={`Select ${preset.name}`} className="absolute inset-0 grid place-items-center text-white drop-shadow-lg">
        {!hovering && <PlayIcon />}
      </button>
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button type="button" aria-label={`Expand ${preset.name}`} onClick={onPreview} className="grid size-6 place-items-center rounded-full bg-[#333739]/60 text-white/90 backdrop-blur-sm transition-colors hover:bg-[#55595b]/75"><ExpandIcon /></button>
        <button type="button" aria-label={`Crop ${preset.name}`} onClick={onCrop} className="grid size-6 place-items-center rounded-full bg-[#333739]/60 text-white/90 backdrop-blur-sm transition-colors hover:bg-[#55595b]/75">
          <CropIcon />
        </button>
      </div>
    </div>
  );
}

export function PresetVideosPanel({ onSelect, presets, title }: { onSelect?: (selection: Selection) => void; presets?: readonly VideoPreset[]; title?: string }) {
  const [category, setCategory] = useState<"higgsfield" | "community">("higgsfield");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<VideoPreset | null>(null);
  const [crop, setCrop] = useState<VideoPreset | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [category]);

  const chooseCategory = (next: "higgsfield" | "community") => {
    if (next === category) return;
    setLoading(true);
    setCategory(next);
  };

  useEffect(() => {
    if (!preview && !crop) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setPreview(null); setCrop(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, crop]);

  const select = (selection: Selection) => { onSelect?.(selection); setPreview(null); setCrop(null); };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/10 p-2">
        {presets ? <span className="px-3 text-xs font-semibold text-white/70">{title ?? "Presets"}</span> : <><button type="button" onClick={() => chooseCategory("higgsfield")} className={`rounded-full px-3 py-2 text-xs font-semibold ${category === "higgsfield" ? "bg-white/10 text-white" : "text-white/50"}`}>Higgsfield Presets</button>
        <button type="button" onClick={() => chooseCategory("community")} className={`rounded-full px-3 py-2 text-xs font-semibold ${category === "community" ? "bg-white/10 text-white" : "text-white/50"}`}>Community Trending</button></>}
      </div>
      {loading ? <LoadingGrid label="Loading presets" /> : (
        <div className="grid min-h-0 flex-1 grid-cols-4 auto-rows-max gap-3 overflow-y-auto p-4">
          {(presets ?? communityVideoPresets).map((preset) => <PresetCard key={preset.name} preset={preset} onSelect={() => onSelect ? select(preset) : setPreview(preset)} onPreview={() => setPreview(preset)} onCrop={() => setCrop(preset)} />)}
        </div>
      )}
      {preview && <VideoPreviewDialog variant="preset" preset={preview} onClose={() => setPreview(null)} />}
      {crop && <VideoCropDialog key={crop.name} preset={crop} onClose={() => setCrop(null)} onConfirm={select} />}
    </div>
  );
}
