"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { VideoSelection } from "./preset-videos";
import { ShowcaseIcon } from "./showcase-icons";

const time = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
export function ShowcasePlayer({ preset, videoRef }: { preset: VideoSelection; videoRef: RefObject<HTMLVideoElement> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(preset.start ?? 0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [timeFormat, setTimeFormat] = useState<"standard" | "timecode">("standard");
  const [timeOpen, setTimeOpen] = useState(false);
  const timeMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!timeOpen) return;
    const outside = (event: PointerEvent) => { if (!timeMenuRef.current?.contains(event.target as Node)) setTimeOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [timeOpen]);
  const displayTime = (value: number) => timeFormat === "standard" ? time(value) : `${Math.floor(value / 3600).toString().padStart(2, "0")}:${Math.floor(value / 60 % 60).toString().padStart(2, "0")}:${Math.floor(value % 60).toString().padStart(2, "0")}:${Math.floor(value % 1 * 1000).toString().padStart(3, "0")}`;
  const [error, setError] = useState("");
  const start = preset.start ?? 0;
  const source = preset.url.startsWith("https:") ? `/api/video-download?${new URLSearchParams({ url: preset.url, name: preset.name, inline: "1" })}` : preset.url;
  const length = Math.max(0, (preset.end ?? duration) - start);
  const elapsed = Math.max(0, current - start);
  const progress = length ? Math.min(100, elapsed / length * 100) : 0;
  const control = "grid size-8 shrink-0 place-items-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40";
  const togglePlay = () => { const video = videoRef.current; if (!video) return; if (video.paused) video.play().catch(() => setError("Playback could not start. Please try again.")); else video.pause(); };
  const fullscreen = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined); else stageRef.current?.requestFullscreen?.().catch(() => undefined); };

  return <div ref={stageRef} className="relative grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] bg-[#050505] pb-3 pl-2 pt-3">
    <div className="relative flex min-h-0 items-center justify-center overflow-hidden">
      <video ref={videoRef} src={source} poster={preset.poster} crossOrigin="anonymous" autoPlay loop playsInline preload="metadata" muted={muted} onClick={togglePlay} onDoubleClick={fullscreen} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onWaiting={() => setLoading(true)} onPlaying={() => { setLoading(false); setError(""); }} onCanPlay={() => setLoading(false)} onError={() => { setLoading(false); setError("Video could not load. Please try again."); }} onLoadedMetadata={event => { setDuration(event.currentTarget.duration); event.currentTarget.currentTime = start; }} onTimeUpdate={event => { const video = event.currentTarget; if (preset.end && video.currentTime >= preset.end) video.currentTime = start; setCurrent(video.currentTime); if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1)); }} className="h-full w-full object-contain" />
      {loading && <span aria-label="Loading video" className="pointer-events-none absolute size-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />}
      {error && <p role="alert" className="absolute rounded-lg bg-black/80 p-3 text-sm">{error}</p>}
    </div>
    <div className="z-20 flex w-full flex-col px-3 pt-3 text-white">
      <div className="relative flex h-3 items-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-lg bg-white/10"><span className="absolute inset-y-0 left-0 rounded-lg bg-white/25" style={{ width: `${length ? Math.min(100, (buffered - start) / length * 100) : 0}%` }} /><span className="absolute inset-y-0 left-0 rounded-lg bg-lime" style={{ width: `max(0px, ${progress}% - 6px)` }} /></div>
        <span aria-hidden="true" className="pointer-events-none absolute h-3 w-1 -translate-x-1/2 rounded-lg bg-white" style={{ left: `${progress}%` }} />
        <input aria-label="Video progress" type="range" min="0" max={length || 1} step="0.01" value={Math.min(elapsed, length || 1)} onChange={event => { if (videoRef.current) videoRef.current.currentTime = start + Number(event.target.value); }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-0.5">
          <button type="button" aria-label={playing ? "Pause video" : "Play video"} onClick={togglePlay} className={control}>{playing ? <ShowcaseIcon name="Pause video" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m6 3 15 9-15 9V3Z" /></svg>}</button>
          <div className="relative"><button type="button" aria-label="Playback speed" aria-haspopup="menu" aria-expanded={speedOpen} onClick={() => setSpeedOpen(value => !value)} className={`${control} text-sm font-medium`}>{speed}×</button>
            {speedOpen && <div role="menu" aria-label="Playback speed" className="absolute bottom-10 left-0 rounded-xl border border-white/10 bg-[#232628] p-1 shadow-xl">{[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(value => <button type="button" role="menuitemradio" aria-checked={speed === value} key={value} onClick={() => { if (videoRef.current) videoRef.current.playbackRate = value; setSpeed(value); setSpeedOpen(false); }} className="block w-20 rounded-lg px-3 py-1.5 text-sm hover:bg-white/10">{value}×</button>)}</div>}
          </div>
          <div className="group/volume flex h-8 max-w-8 items-center overflow-hidden rounded-[10px] transition-[max-width,background-color] hover:max-w-28 hover:bg-white/10 focus-within:max-w-28 focus-within:bg-white/10">
            <button type="button" aria-label={muted ? "Unmute video" : "Mute video"} onClick={() => setMuted(value => !value)} className={`${control} relative`}><ShowcaseIcon name="Mute video" />{muted && <span aria-hidden="true" className="absolute h-0.5 w-5 -rotate-45 bg-white" />}</button>
            <input aria-label="Video volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={event => { const value = Number(event.target.value); setVolume(value); setMuted(value === 0); if (videoRef.current) videoRef.current.volume = value; }} className="mr-4 h-1.5 w-14 shrink-0 cursor-pointer accent-lime" />
          </div>
        </div>
        <div ref={timeMenuRef} className="relative flex items-center gap-1"><time className="text-sm font-medium tabular-nums text-white/90">{displayTime(elapsed)} / {displayTime(length)}</time><button type="button" aria-label="Time format" aria-haspopup="menu" aria-expanded={timeOpen} onClick={() => { setTimeOpen(value => !value); setSpeedOpen(false); }} className={`grid size-5 place-items-center rounded text-white/60 hover:bg-white/10 ${timeOpen ? "bg-white/10" : ""}`}><ShowcaseIcon name="Time format" /></button>
          {timeOpen && <div role="menu" aria-label="Time format" className="absolute bottom-9 right-0 w-[200px] rounded-xl border border-white/[.04] bg-[#28292c]/80 p-2 shadow-2xl backdrop-blur-2xl" onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setTimeOpen(false); } }}>
            <p className="px-2 py-2 text-xs font-semibold text-white/45">Time format</p>
            {([['standard', 'Standard', '1:23'], ['timecode', 'Timecode', '00:01:23:456']] as const).map(([value, label, example]) => <button key={value} type="button" role="menuitemradio" aria-checked={timeFormat === value} onClick={() => { setTimeFormat(value); setTimeOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-white/5 ${timeFormat === value ? "bg-white/[.07]" : ""}`}><span><span className="block font-semibold">{label}</span><span className="block text-xs text-white/45">{example}</span></span>{timeFormat === value && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4 10-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}</button>)}
          </div>}
        </div>
        <div className="flex justify-end"><button type="button" aria-label="Fullscreen video" onClick={fullscreen} className={`${control} !size-10`}><ShowcaseIcon name="Fullscreen video" /></button></div>
      </div>
    </div>
  </div>;
}
