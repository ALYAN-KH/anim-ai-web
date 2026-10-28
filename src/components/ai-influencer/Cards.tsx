"use client";

import { useEffect, useRef, useState } from "react";
import type { InfluencerPreset, MotionPreset } from "./data";
import { Icon } from "./Icon";
import { LIME_BUTTON } from "./Sidebar";

const REVEAL = "opacity-0 transition-opacity duration-150 group-hover/card:opacity-100 group-focus-within/card:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100";

export function RecreateButton({ onClick, label = "Recreate", variant = "lime", className = "" }: { onClick: () => void; label?: string; variant?: "lime" | "white"; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label === "Recreate" ? undefined : label}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`pointer-events-auto inline-flex h-8 shrink-0 touch-manipulation items-center gap-1.5 rounded-lg px-3 pb-2 pt-1.5 text-sm font-medium leading-4 ${variant === "lime" ? LIME_BUTTON : "bg-white text-[#1a1a1a] shadow-[inset_0_-3px_0_#b5b5b5] hover:bg-[#f0f0f0]"} ${className}`}
    >
      <Icon name="recreate" className="size-4" />
      Recreate
    </button>
  );
}

/** AI Influencers feed card: character portrait, opens the sheet, hover Recreate. */
export function InfluencerCard({ preset, onOpen, onRecreate }: { preset: InfluencerPreset; onOpen: () => void; onRecreate: () => void }) {
  return (
    <article aria-label={preset.name} className="group/card relative isolate overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10">
      <div className="relative w-full shrink-0 overflow-hidden rounded-2xl bg-[#23262a]" style={{ aspectRatio: `${preset.preview.width} / ${preset.preview.height}` }}>
        <img alt={preset.name} width={preset.preview.width} height={preset.preview.height} loading="lazy" decoding="async" src={preset.preview.thumb} className="relative size-full object-contain" />
      </div>
      <button type="button" aria-label="View character sheet" onClick={onOpen} className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),transparent)] px-3 pb-3 pt-10">
        <div className="flex min-w-0 items-end justify-end gap-2">
          <RecreateButton onClick={onRecreate} className={`max-md:opacity-100 ${REVEAL}`} />
        </div>
      </div>
    </article>
  );
}

export function variantLabel(type: string, index: number) {
  return type === "original" ? "Show source video" : `Show variant ${index + 1}`;
}

const ASPECT: Record<MotionPreset["aspect"], string> = { "9/16": "9 / 16", "3/4": "3 / 4", "3/2": "3 / 2", "16/9": "16 / 9" };

type PresetCardProps = { preset: MotionPreset; onOpen: (variant: number) => void; onRecreate: () => void; onLike?: () => void };

/** Higgsfield Presets / Community Trends card: looping example with variant switcher. */
export function PresetCard({ preset, onOpen, onRecreate, onLike }: PresetCardProps) {
  const [variant, setVariant] = useState(0);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const media = preset.variants[variant]?.media ?? preset.original;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (visible && !matchMedia("(prefers-reduced-motion: reduce)").matches) el.play().catch(() => undefined);
    else el.pause();
  }, [visible, variant]);

  const swap = preset.mode === "swap";
  return (
    <article ref={box} data-explore-card className="group/card relative isolate w-full min-w-0 cursor-pointer overflow-hidden rounded-xl bg-[#1c1e21]" style={{ aspectRatio: ASPECT[preset.aspect] }}>
      <button type="button" aria-label="Open preset" onClick={() => onOpen(variant)} className="absolute inset-0 z-[16] cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white" />
      <img alt="" loading="lazy" decoding="async" src={media.thumb ?? preset.original.thumb} className="pointer-events-none absolute inset-0 z-[1] size-full object-cover" />
      <video
        ref={video}
        key={media.url}
        src={visible ? media.url : undefined}
        poster={media.thumb}
        loop
        muted
        playsInline
        preload="none"
        aria-label={`${preset.title} example`}
        className={`pointer-events-none absolute inset-0 z-[2] size-full object-cover transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div className={`pointer-events-none absolute left-3 top-3 z-10 hidden items-center gap-1.5 text-xs font-semibold text-white drop-shadow-sm md:flex max-md:opacity-100 ${REVEAL}`}>
        <Icon name={swap ? "modeSwap" : "modeMotion"} className="size-4" />
        {swap ? "Objects swap" : "Motion transfer"}
      </div>
      <div className={`absolute right-3 top-3 z-20 max-md:hidden ${REVEAL}`}>
        <button type="button" aria-label="Expand example" onClick={() => onOpen(variant)} className="relative flex size-8 items-center justify-center rounded-full border border-white/5 bg-white/5 text-white shadow-[inset_0_2px_3px_rgba(255,255,255,0.05),0_2px_4px_-0.5px_rgba(0,0,0,0.12)] backdrop-blur-md hover:brightness-125">
          <Icon name="chipExpand" className="size-4" />
        </button>
      </div>
      <div className={`absolute inset-x-3 bottom-3 z-20 flex min-w-0 items-end justify-between gap-2 max-md:hidden ${REVEAL}`}>
        <div className="flex min-w-0 items-center gap-2">
          {onLike ? (
            <button type="button" aria-label="Like" onClick={onLike} className="inline-flex h-8 min-w-8 shrink-0 items-center gap-1 rounded-full bg-white/[0.08] px-2 text-sm font-semibold text-white shadow-[inset_-0.5px_-0.5px_1px_rgba(255,255,255,0.3),inset_0.8px_0.5px_0.5px_rgba(255,255,255,0.6)] backdrop-blur-[2rem]">
              <Icon name="heart" className="size-4" />
              {preset.likes}
            </button>
          ) : (
            <div className="flex min-w-0 shrink items-center gap-2">
              {preset.variants.map((v, i) => (
                <button key={v.type} type="button" aria-label={variantLabel(v.type, i)} aria-pressed={i === variant} onClick={() => setVariant(i)} className={`relative size-8 shrink-0 rounded-full shadow-[0_6px_12px_rgba(0,0,0,0.4)] transition-[filter] hover:brightness-150 ${i === variant ? "ring-2 ring-white" : ""}`}>
                  <img alt="" loading="lazy" decoding="async" src={v.media.thumb ?? preset.original.thumb} className="size-full rounded-full border border-white object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <RecreateButton onClick={onRecreate} label="Recreate this example" variant={onLike ? "white" : "lime"} />
      </div>
    </article>
  );
}
