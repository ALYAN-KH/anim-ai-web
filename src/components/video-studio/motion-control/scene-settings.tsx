"use client";

import { ImageIcon, VideoIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { ToggleTrack } from "../shared/toggle-track";

export type SceneSource = "Video" | "Image";

export function SourceTabs({ value, onChange, disabled = false }: { value: SceneSource; onChange: (source: SceneSource) => void; disabled?: boolean }) {
  return <div className="flex gap-1 rounded-xl border border-white/[.06] p-1" role="group" aria-label="Scene source">{(["Video", "Image"] as const).map(source => <button key={source} type="button" disabled={disabled} aria-pressed={value === source} onClick={() => onChange(source)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${value === source ? "bg-white/[.08] text-white" : "text-white/45 hover:text-white"} disabled:opacity-50`}>{source === "Video" ? <VideoIcon className="size-4" /> : <ImageIcon className="size-4" />}{source}</button>)}</div>;
}

export function SceneSettings({ enabled, onToggle, source, onSourceChange }: { enabled: boolean; onToggle: () => void; source: SceneSource; onSourceChange: (value: SceneSource) => void }) {
  return <div className="overflow-hidden rounded-xl border border-white/[.06] bg-white/[.05]">
    <div className="flex items-center justify-between gap-2 border-b border-black/20 px-3 py-3"><span className="text-sm font-semibold">Scene control mode</span><button type="button" role="switch" aria-label="Scene control mode" aria-checked={enabled} onClick={onToggle} className="relative z-10 -my-2 inline-flex h-8 min-w-11 shrink-0 touch-manipulation items-center justify-end rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"><span className="pointer-events-none"><ToggleTrack checked={enabled} size="scene" onColor="#d1fe17" /></span></button></div>
    {enabled && <div className="space-y-2 px-3 pb-3 pt-2"><SourceTabs value={source} onChange={onSourceChange} /><p className="text-xs leading-[18px] text-white/50">Choose where the background should come from: the character image or the motion video</p></div>}
  </div>;
}

export function SceneControlNotice({ anchor, onTurnOff, onClose }: { anchor: DOMRect; onTurnOff: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(390);
  useLayoutEffect(() => { if (ref.current) setHeight(ref.current.offsetHeight); }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node) && !(event.target as Element).closest('[aria-controls="motion-advanced-settings"]')) onClose(); };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, [onClose]);
  return createPortal(<div ref={ref} role="dialog" aria-labelledby="scene-control-title" style={{ left: Math.max(8, Math.min(anchor.right + 10, window.innerWidth - 356)), top: Math.max(8, Math.min(anchor.top - 96, window.innerHeight - height - 12)), width: Math.min(344, window.innerWidth - 16), maxHeight: window.innerHeight - 24 }} className="fixed z-[100] overflow-y-auto rounded-2xl border border-white/[.06] bg-[#1c1e20] p-3 text-white shadow-[0_12px_40px_rgba(0,0,0,.5)]">
    <div className="mb-6 rounded-xl bg-[#101214] p-4"><div className="space-y-3 rounded-xl border border-white/[.06] bg-white/[.05] p-3"><div className="flex items-center justify-between text-sm">Scene control mode<button type="button" role="switch" aria-label="Scene control mode in notice" aria-checked="true" onClick={onTurnOff} className="flex h-8 min-w-11 items-center justify-end rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"><span className="pointer-events-none"><ToggleTrack checked size="medium" onColor="#47bb36" /></span></button></div><SourceTabs value="Image" onChange={() => undefined} /><p className="text-xs leading-5 text-white/45">Choose where the background should come from: the character image or the motion video</p></div></div>
    <h2 id="scene-control-title" className="mb-2 text-base font-semibold">Scene control enabled</h2><p className="text-xs leading-5 text-white/50">Advanced settings (Prompt + Orientation) are locked to keep the scene consistent.</p><p className="mt-2 text-xs leading-5 text-white/50">To adjust these settings, turn Scene control mode off.</p>
    <div className="mt-4 flex gap-2"><button type="button" onClick={onTurnOff} className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15">Turn off</button><button type="button" onClick={onClose} className="rounded-lg bg-black/20 px-3 py-2 text-sm text-white/50 hover:text-white">Not now</button></div>
  </div>, document.body);
}

export function CharacterPreview({ url, onClose }: { url: string; onClose: () => void }) {
  return createPortal(<div data-preset-dialog role="dialog" aria-modal="true" aria-label="Character preview" className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-8 backdrop-blur-sm" onClick={onClose}><img src={url} alt="Selected character" className="max-h-[90dvh] max-w-full rounded-xl object-contain" /><button type="button" aria-label="Close character preview" onClick={onClose} className="absolute right-5 top-5 rounded-xl bg-white/10 px-4 py-3 text-white">✕</button></div>, document.body);
}
