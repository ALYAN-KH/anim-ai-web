"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { VideoPreset } from "./preset-videos";
import { ShowcasePlayer } from "./showcase-player";
import { ShowcaseIcon } from "./showcase-icons";
import { useToast } from "../shared/tool-toast";
import { openVideoTool } from "./video-tool-handoff";

export function CloseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export function VideoPreviewDialog({ preset, onClose, variant = "details" }: { preset: VideoPreset & { start?: number; end?: number }; onClose: () => void; variant?: "details" | "preset" }) {
  const { showToast, toast } = useToast(4000, "error");
  const [controls, setControls] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
      if (event.key === "Tab") {
        const buttons = Array.from(closeRef.current?.closest('[role="dialog"]')?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), video') ?? []);
        const index = buttons.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => { abortRef.current?.abort(); document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey, true); previous?.focus(); };
  }, [onClose]);

  const download = async () => {
    if (downloading) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setDownloading(true);
    setError("");
    try {
      const source = preset.url.startsWith("blob:") ? preset.url : `/api/video-download?${new URLSearchParams({ url: preset.url, name: preset.name })}`;
      const response = await fetch(source, { signal: controller.signal });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${preset.name.replace(/[^a-z0-9_-]/gi, "-")}.${blob.type.includes("webm") ? "webm" : "mp4"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      if (!controller.signal.aborted) setError("Download failed. Please try again.");
    } finally {
      if (!controller.signal.aborted) setDownloading(false);
    }
  };

  const extractFrame = () => showToast("Failed to extract video frames");
  const tool = async (name: "edit" | "upscale") => {
    try { await openVideoTool(preset, name); onClose(); }
    catch { setError("Could not open this video. Please try again."); }
  };
  const buttonClass = "flex h-10 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-white/10 bg-[#2c2f31] text-[13px] font-semibold text-white shadow-[inset_0_2px_4px_rgba(255,255,255,.06)] transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime disabled:opacity-50";
  const format = /\.webm(?:[?#]|$)/i.test(preset.url + preset.name) ? "WEBM" : /\.mov(?:[?#]|$)/i.test(preset.url + preset.name) ? "MOV" : "MP4";
  if (variant === "preset") return createPortal(
    <div data-preset-dialog role="dialog" aria-modal="true" aria-label={`Preview ${preset.name}`} className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm" onMouseDown={event => { event.stopPropagation(); if (event.target === event.currentTarget) onClose(); }}>
      <video src={preset.url} poster={preset.poster} autoPlay loop playsInline controls={controls} tabIndex={0} onPointerEnter={() => setControls(true)} onPointerLeave={() => setControls(false)} onFocus={() => setControls(true)} className="block h-auto max-h-[calc(100dvh-92px)] w-auto max-w-[calc(100vw-48px)] rounded-lg object-contain outline-none" />
      <div className="absolute right-5 top-5 flex gap-2.5 text-white/85">
        <button type="button" disabled={downloading} aria-label="Download video" onClick={download} className="grid size-[52px] place-items-center rounded-xl border border-lime/5 bg-[#141618] hover:bg-[#292b2d]"><ShowcaseIcon name="Download" /></button>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close preview" className="grid size-[52px] place-items-center rounded-xl border border-lime/5 bg-[#141618] hover:bg-[#292b2d]"><CloseIcon /></button>
      </div>
      {error && <p role="alert" className="absolute right-5 top-20 rounded-lg bg-[#303234] px-3 py-2 text-sm text-white">{error}</p>}
    </div>, document.body,
  );
  return createPortal(
    <div data-preset-dialog role="dialog" aria-modal="true" aria-label={`Preview ${preset.name}`} className="fixed inset-0 z-[3000] grid grid-rows-[minmax(0,1fr)_minmax(240px,40dvh)] overflow-hidden bg-[#050505] text-white md:grid-cols-[minmax(0,1fr)_23rem] md:grid-rows-1" onMouseDown={event => event.stopPropagation()}>
      {toast}
      <ShowcasePlayer preset={preset} videoRef={videoRef} />
      <aside className="m-2 flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/[.06] bg-[#1b1e20] p-2 backdrop-blur-2xl">
        <header className="flex shrink-0 justify-end pb-2"><button ref={closeRef} type="button" onClick={onClose} aria-label="Close preview" className="m-1 grid size-8 place-items-center rounded-full bg-white/5 text-white hover:bg-white/10"><ShowcaseIcon name="Close" /></button></header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <section className="rounded-2xl bg-white/5 p-2">
            <h2 className="mb-2 flex h-7 items-center gap-2 px-1 text-xs font-medium uppercase text-white/45"><ShowcaseIcon name="Details" />Details</h2>
            <dl className="space-y-1 rounded-lg bg-white/5 p-3 text-sm leading-5">{[["Source", "Original Upload"], ["Type", "Video"], ["Format", format]].map(([label, value]) => <div key={label} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3"><dt className="text-white/45">{label}</dt><dd className="text-right">{value}</dd></div>)}</dl>
          </section>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 p-2">
          <button type="button" onClick={() => tool("edit")} className="col-span-2 flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-lime text-sm font-medium text-black shadow-[inset_0_-3px_rgba(0,0,0,.3)] hover:brightness-90"><ShowcaseIcon name="Edit" />Edit</button>
          <button type="button" onClick={() => extractFrame()} className={buttonClass}><ShowcaseIcon name="Extract Start Frame" />Extract Start Frame</button>
          <button type="button" onClick={() => extractFrame()} className={buttonClass}><ShowcaseIcon name="Extract End Frame" />Extract End Frame</button>
          <button type="button" onClick={() => tool("upscale")} className={buttonClass}><ShowcaseIcon name="Upscale" />Upscale</button>
          <button type="button" disabled={downloading} aria-label={downloading ? "Downloading video" : "Download video"} aria-busy={downloading} onClick={download} className={buttonClass}><ShowcaseIcon name="Download" />{downloading ? "Downloading…" : "Download"}</button>
        </div>
        {error && <p role="alert" className="px-2 pb-2 text-xs text-red-300">{error}</p>}
      </aside>
    </div>, document.body,
  );
}

