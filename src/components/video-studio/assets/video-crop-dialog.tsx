"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { VideoCrop, VideoSelection } from "./preset-videos";
import { CloseIcon } from "./video-preview-dialog";

const FULL_CROP: VideoCrop = { x: 0, y: 0, width: 1, height: 1 };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const format = (value: number) => `${Math.floor(value / 60).toString().padStart(2, "0")}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
const HANDLES = ["nw", "n", "ne", "w", "e", "sw", "s", "se"] as const;
type Drag = { direction: string; x: number; y: number; crop: VideoCrop; width: number; height: number };

export function VideoCropDialog({ preset, onClose, onConfirm }: { preset: VideoSelection; onClose: () => void; onConfirm: (selection: VideoSelection) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ratio, setRatio] = useState(9 / 16);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(preset.start ?? 0);
  const [end, setEnd] = useState(preset.end ?? 0);
  const [time, setTime] = useState(preset.start ?? 0);
  const [crop, setCrop] = useState<VideoCrop>(preset.crop ?? FULL_CROP);
  const [playing, setPlaying] = useState(true);
  const [error, setError] = useState(false);
  const width = Math.min(size.width, size.height * ratio);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const dialog = stageRef.current?.closest<HTMLElement>('[role="dialog"]');
    dialog?.querySelector<HTMLElement>('button')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
      if (event.key === "Tab" && dialog) {
        const buttons = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]'));
        const index = buttons.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }
    };
    document.addEventListener("keydown", keydown, true);
    return () => { document.body.style.overflow = overflow; previous?.focus(); document.removeEventListener("keydown", keydown, true); };
  }, [onClose]);

  const beginCrop = (event: PointerEvent<HTMLElement>, direction: string) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { direction, x: event.clientX, y: event.clientY, crop: { ...crop }, width: rect.width, height: rect.height };
  };
  const moveCrop = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = (event.clientX - drag.x) / drag.width;
    const dy = (event.clientY - drag.y) / drag.height;
    const initial = drag.crop;
    if (drag.direction === "move") {
      setCrop({ ...initial, x: clamp(initial.x + dx, 0, 1 - initial.width), y: clamp(initial.y + dy, 0, 1 - initial.height) });
      return;
    }
    let left = initial.x, right = initial.x + initial.width, top = initial.y, bottom = initial.y + initial.height;
    if (drag.direction.includes("w")) left = clamp(left + dx, 0, right - .08);
    if (drag.direction.includes("e")) right = clamp(right + dx, left + .08, 1);
    if (drag.direction.includes("n")) top = clamp(top + dy, 0, bottom - .08);
    if (drag.direction.includes("s")) bottom = clamp(bottom + dy, top + .08, 1);
    setCrop({ x: left, y: top, width: right - left, height: bottom - top });
  };

  const seek = (value: number) => { if (videoRef.current) videoRef.current.currentTime = value; setTime(value); };
  const trim = (which: "start" | "end", value: number) => {
    if (which === "start") { const next = clamp(value, 0, end - .1); setStart(next); seek(next); }
    else { const next = clamp(value, start + .1, duration); setEnd(next); if (time > next) seek(start); }
  };
  const timelinePosition = (event: PointerEvent<HTMLElement>) => {
    const rect = timelineRef.current!.getBoundingClientRect();
    return clamp((event.clientX - rect.left) / rect.width, 0, 1) * duration;
  };

  return createPortal(
    <div data-preset-dialog role="dialog" aria-modal="true" aria-labelledby="crop-title" className="fixed inset-0 z-[3001] grid place-items-center bg-black/65 p-4" onMouseDown={(event) => event.stopPropagation()}>
      <div className="flex h-[min(744px,calc(100dvh-48px))] w-[min(1000px,calc(100vw-32px))] flex-col rounded-[32px] bg-[#202224] p-2.5 text-white shadow-2xl">
        <header className="flex h-[58px] shrink-0 items-center justify-between px-2.5 pb-2">
          <h2 id="crop-title" className="text-xl font-semibold tracking-tight">Edit reference</h2>
          <button type="button" aria-label="Close crop" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-white/[.05] text-white/55 hover:bg-white/10 hover:text-white"><CloseIcon /></button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] bg-[#141719]">
          <div ref={stageRef} className="relative m-4 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div ref={frameRef} className="relative shrink-0" style={{ width, height: width / ratio }}>
              <video ref={videoRef} src={preset.url} poster={preset.poster} autoPlay muted playsInline preload="auto" onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                setRatio(video.videoWidth / video.videoHeight);
                if (Number.isFinite(video.duration)) { setDuration(video.duration); setEnd(Math.min(preset.end ?? video.duration, video.duration)); }
                video.currentTime = preset.start ?? 0;
              }} onTimeUpdate={(event) => {
                const video = event.currentTarget;
                if (end > start && video.currentTime >= end) video.currentTime = start;
                setTime(video.currentTime);
              }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} className="block size-full object-contain" />
              <div className="absolute cursor-move touch-none border border-white/90" style={{ left: `${crop.x * 100}%`, top: `${crop.y * 100}%`, width: `${crop.width * 100}%`, height: `${crop.height * 100}%`, boxShadow: "0 0 0 2000px rgba(0,0,0,.45)" }} onPointerDown={(event) => beginCrop(event, "move")} onPointerMove={moveCrop} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
                <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">{Array.from({ length: 9 }, (_, index) => <span key={index} className="border-[.5px] border-white/15" />)}</div>
                {HANDLES.map((direction) => <button key={direction} type="button" aria-label={`Resize crop ${direction}`} onPointerDown={(event) => beginCrop(event, direction)} onPointerMove={moveCrop} onPointerUp={(event) => { event.stopPropagation(); dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} onKeyDown={(event) => {
                  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
                  event.preventDefault();
                  const amount = event.shiftKey ? .05 : .01;
                  setCrop((value) => {
                    let left = value.x, top = value.y, right = left + value.width, bottom = top + value.height;
                    if (direction.includes("w") && /Left|Right/.test(event.key)) left = clamp(left + (event.key === "ArrowRight" ? amount : -amount), 0, right - .08);
                    if (direction.includes("e") && /Left|Right/.test(event.key)) right = clamp(right + (event.key === "ArrowRight" ? amount : -amount), left + .08, 1);
                    if (direction.includes("n") && /Up|Down/.test(event.key)) top = clamp(top + (event.key === "ArrowDown" ? amount : -amount), 0, bottom - .08);
                    if (direction.includes("s") && /Up|Down/.test(event.key)) bottom = clamp(bottom + (event.key === "ArrowDown" ? amount : -amount), top + .08, 1);
                    return { x: left, y: top, width: right - left, height: bottom - top };
                  });
                }} className="absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 touch-none rounded-[4px] bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime" style={{ left: direction.includes("w") ? 0 : direction.includes("e") ? "100%" : "50%", top: direction.includes("n") ? 0 : direction.includes("s") ? "100%" : "50%", cursor: `${direction}-resize` }} />)}
              </div>
            </div>
          </div>
          <div className="relative z-10 flex h-[90px] shrink-0 items-center gap-3 border-t border-white/[.03] bg-[#141719] px-3 py-3">
            <button type="button" aria-label={playing ? "Pause preview" : "Play preview"} onClick={() => { const video = videoRef.current; if (!video) return; if (video.paused) video.play().catch(() => setError(true)); else video.pause(); }} className="grid size-[60px] shrink-0 place-items-center rounded-2xl bg-[#2d3032] hover:bg-[#393c3e]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden="true">{playing ? <path d="M5 4h5v16H5zm9 0h5v16h-5z" /> : <path d="m7 3 15 9-15 9z" />}</svg>
            </button>
            <div ref={timelineRef} className="relative h-[60px] min-w-0 flex-1 touch-none" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); seek(clamp(timelinePosition(event), start, end)); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(clamp(timelinePosition(event), start, end)); }}>
              <div className="absolute inset-0 flex overflow-hidden rounded-lg opacity-70">{Array.from({ length: 12 }, (_, index) => <video key={index} src={preset.url} muted playsInline preload="metadata" onLoadedMetadata={(event) => { event.currentTarget.currentTime = event.currentTarget.duration * index / 12; }} className="h-full min-w-0 flex-1 object-cover" aria-hidden="true" />)}</div>
              <div className="pointer-events-none absolute inset-y-0 left-0 bg-black/50" style={{ width: `${start / (duration || 1) * 100}%` }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 bg-black/50" style={{ width: `${(1 - end / (duration || 1)) * 100}%` }} />
              <div className="pointer-events-none absolute inset-y-0 rounded-lg border-y-[3px] border-lime" style={{ left: `${start / (duration || 1) * 100}%`, right: `${(1 - end / (duration || 1)) * 100}%` }} />
              {(["start", "end"] as const).map((which) => <button key={which} type="button" role="slider" aria-label={`Trim ${which}`} aria-valuemin={which === "start" ? 0 : start + .1} aria-valuemax={which === "start" ? Math.max(0, end - .1) : duration} aria-valuenow={which === "start" ? start : end} aria-valuetext={format(which === "start" ? start : end)} onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) { event.stopPropagation(); trim(which, timelinePosition(event)); } }} onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); trim(which, (which === "start" ? start : end) + (event.key === "ArrowRight" ? .1 : -.1)); }
              }} className="absolute inset-y-0 z-20 flex w-2.5 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center rounded-md bg-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" style={{ left: `${(which === "start" ? start : end) / (duration || 1) * 100}%` }}><span className="h-5 w-[3px] rounded bg-black/70" /></button>)}
              <span className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white" style={{ left: `${time / (duration || 1) * 100}%` }}><span className="absolute -left-[6px] -top-2 size-0 border-x-[7px] border-t-[8px] border-x-transparent border-t-white" /></span>
              <span className="pointer-events-none absolute bottom-1 left-3 rounded bg-black/60 px-1 text-[11px]">{format(end - start)}</span>
            </div>
          </div>
          {error && <p role="status" className="relative z-10 bg-[#141719] px-4 pb-2 text-xs text-white/60">Unable to load video.</p>}
        </div>
        <footer className="flex shrink-0 justify-end pb-1 pt-4"><button type="button" disabled={!duration || error} onClick={() => onConfirm({ ...preset, start, end, crop })} className="rounded-xl bg-white px-6 py-3 text-base font-medium text-black hover:bg-white/90 disabled:opacity-40">Confirm</button></footer>
      </div>
    </div>, document.body,
  );
}
