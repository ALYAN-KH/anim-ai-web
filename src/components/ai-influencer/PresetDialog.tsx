"use client";

import { Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MOTION_MODEL, type MotionPreset } from "./data";
import { variantLabel } from "./Cards";
import { DialogShell, PanelSection } from "./Dialogs";
import { Icon } from "./Icon";
import { LIME_BUTTON } from "./Sidebar";

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Player({ preset, variant, onVariant }: { preset: MotionPreset; variant: number; onVariant: (i: number) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [now, setNow] = useState(0);
  const [duration, setDuration] = useState(0);
  const media = preset.variants[variant]?.media ?? preset.original;

  useEffect(() => { video.current?.play().catch(() => setPlaying(false)); }, [media.url]);
  const toggle = () => { const v = video.current; if (v) (v.paused ? v.play().catch(() => undefined) : v.pause()); };
  const seek = (value: number) => { if (video.current) video.current.currentTime = value; };
  const full = () => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen())?.catch(() => undefined);

  return (
    <div ref={box} role="region" aria-label="Video Player" className="relative flex size-full min-h-0 flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/20">
      <video
        ref={video}
        key={media.url}
        src={media.main ?? media.url}
        poster={media.thumb}
        loop
        playsInline
        muted={muted}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => { setDuration(e.currentTarget.duration); e.currentTarget.volume = volume; }}
        className="min-h-0 w-auto max-w-full flex-1 cursor-pointer object-contain"
      />
      {preset.variants.length > 1 && (
        <div className="absolute bottom-16 left-1/2 z-10 flex [transform:translateX(-50%)] items-center gap-3">
          {preset.variants.map((v, i) => (
            <button key={v.type} type="button" aria-label={variantLabel(v.type, i)} aria-pressed={i === variant} onClick={() => onVariant(i)} className={`size-8 overflow-hidden rounded-full border border-white shadow-[0_6px_12px_rgba(0,0,0,0.4)] transition hover:brightness-125 ${i === variant ? "ring-2 ring-white ring-offset-2 ring-offset-black/40" : "opacity-80"}`}>
              <img alt="" src={v.media.thumb ?? preset.original.thumb} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),transparent)] px-5 pb-4 pt-8 text-white">
        <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle} className="grid size-7 place-items-center">
          {playing ? <Pause className="size-6 fill-white" /> : <Icon name="play" className="size-6" />}
        </button>
        <span className="shrink-0 text-sm font-medium tabular-nums">{time(now)} / {time(duration)}</span>
        <input aria-label="Seek" type="range" min={0} max={duration || 0} step={0.05} value={now} onChange={(e) => seek(Number(e.target.value))} className="h-1 min-w-0 flex-1 cursor-pointer accent-[#d1fe17]" />
        <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)} className={`grid size-7 place-items-center ${muted ? "opacity-60" : ""}`}>
          <Icon name="mute" className="size-6" />
        </button>
        <input aria-label="Volume" type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={(e) => { const v = Number(e.target.value); setVolume(v); setMuted(v === 0); if (video.current) video.current.volume = v; }} className="h-1 w-20 cursor-pointer accent-[#d1fe17] max-md:hidden" />
        <button type="button" aria-label="Fullscreen" onClick={full} className="grid size-7 place-items-center"><Icon name="fullscreen" className="size-6" /></button>
      </div>
    </div>
  );
}

type Props = { preset: MotionPreset; initialVariant: number; onClose: () => void; onRecreate: () => void; notify: (message: string) => void };

export function PresetDialog({ preset, initialVariant, onClose, onRecreate, notify }: Props) {
  const [variant, setVariant] = useState(initialVariant);
  const [promptOpen, setPromptOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const generation = preset.variants.find((v) => v.type === "generation");
  const media = preset.variants[variant]?.media ?? preset.original;
  const model = `${MOTION_MODEL} - ${preset.mode === "swap" ? "Objects Swap" : "Motion Transfer"}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(preset.prompt ?? ""); notify("Prompt copied"); } catch { notify("Couldn't copy the prompt"); }
  };
  const share = async () => {
    const url = `${location.origin}/ai-influencer-studio?preset=${preset.id}`;
    try {
      if (navigator.share) await navigator.share({ title: preset.title, url });
      else { await navigator.clipboard.writeText(url); notify("Link copied"); }
    } catch {
      // Share sheet dismissed.
    }
  };
  const download = `/api/video-download?url=${encodeURIComponent(media.main ?? media.url)}&name=${encodeURIComponent(preset.title)}`;

  return (
    <DialogShell
      label={preset.title}
      backdrop={media.thumb ?? preset.original.thumb}
      onClose={onClose}
      media={<Player preset={preset} variant={variant} onVariant={setVariant} />}
      footer={
        <>
          <button type="button" onClick={onRecreate} className={`flex h-11 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold ${LIME_BUTTON}`}>
            <Icon name="recreateRepeat" className="size-4" /> Recreate
          </button>
          <div className="grid grid-cols-2 gap-2">
            <a href={download} download className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white/5 text-sm font-semibold text-white hover:bg-white/10">
              <Icon name="download" className="size-4" /> Download
            </a>
            <button type="button" aria-label="Share" onClick={share} className="flex h-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10"><Icon name="share" className="size-4" /></button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {preset.prompt && (
          <PanelSection icon="promptIcon" title="Prompt" action={<button type="button" onClick={copy} className="flex h-6 items-center gap-1 rounded-md bg-white/5 px-2 text-xs font-semibold text-white hover:bg-white/10"><Icon name="copy" className="size-3.5" />Copy</button>}>
            {generation && generation.inputs.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {generation.inputs.map((a) => <img key={a.url} alt="Reference input" src={a.thumb ?? a.url} className="size-[72px] rounded-lg border border-white/10 object-cover" />)}
              </div>
            )}
            <p className={`text-sm font-medium leading-5 text-white ${promptOpen ? "" : "line-clamp-6 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"}`}>{preset.prompt}</p>
            <button type="button" aria-expanded={promptOpen} onClick={() => setPromptOpen((v) => !v)} className="mt-2 flex items-center gap-1 text-sm text-[#898a8b] hover:text-white">
              {promptOpen ? "Show less" : "See all"}<Icon name="seeAll" className={`size-3.5 ${promptOpen ? "[transform:rotate(180deg)]" : ""}`} />
            </button>
          </PanelSection>
        )}
        <PanelSection icon="detailsIcon" title="Details" action={<button type="button" aria-label="Toggle details" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((v) => !v)} className="text-[#898a8b] hover:text-white"><Icon name="seeAll" className={`size-4 ${detailsOpen ? "[transform:rotate(180deg)]" : ""}`} /></button>}>
          {detailsOpen && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <dt>Model</dt><dd className="text-right text-xs font-medium leading-5 text-white">{model}</dd>
              {preset.resolution && <><dt>Quality</dt><dd className="text-right font-medium text-white">{preset.resolution}</dd></>}
            </dl>
          )}
        </PanelSection>
      </div>
    </DialogShell>
  );
}
