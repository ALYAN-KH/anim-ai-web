"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Ban, Share2, PictureInPicture2 } from "lucide-react";
import { KatanaVideo } from "./KatanaVideo";
import { KATANA_CATEGORIES, KATANA_IMAGE_SIZES, KATANA_PRESETS, type KatanaCategory, type KatanaPreset } from "./data";
import { HeartIcon, KatanaIcon } from "./icons";

export type CategoryFilter = KatanaCategory | "All";
const FILTERS: CategoryFilter[] = ["All", ...KATANA_CATEGORIES];
const GAP = 16;

/** Lay out captured cards without copying virtualized offsets or leaving empty gaps. */
function toColumns(presets: KatanaPreset[], count: number, columnWidth: number) {
  const columns: KatanaPreset[][] = Array.from({ length: count }, () => []);
  const heights = new Array(count).fill(0);
  presets.forEach(preset => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(preset);
    heights[shortest] += preset.height / preset.width * columnWidth + GAP;
  });
  return columns;
}

const control = "grid size-6 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md outline-none transition hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white md:size-7 [&_svg]:size-3 md:[&_svg]:size-4";

function PresetCard({ preset, selected, liked, onLike, onReport, onOpen, onRecreate }: { preset: KatanaPreset; selected: boolean; liked: boolean; onLike: (id: string) => void; onReport: () => void; onOpen: (preset: KatanaPreset, trigger: HTMLElement | null) => void; onRecreate: (preset: KatanaPreset) => void }) {
  const root = useRef<HTMLElement>(null);
  const expand = useRef<HTMLButtonElement>(null);
  const [muted, setMuted] = useState(true);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pipError, setPipError] = useState("");

  useEffect(() => {
    if (!menu) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof PointerEvent && root.current?.querySelector("[data-card-menu]")?.contains(event.target as Node)) return;
      setMenu(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menu]);

  useEffect(() => {
    if (menu) root.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [menu]);

  const share = async () => {
    const url = new URL("/katana", window.location.origin);
    url.searchParams.set("preset", preset.id);
    try {
      if (navigator.share) await navigator.share({ title: preset.title, url: url.href });
      else {
        await navigator.clipboard.writeText(url.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        try { await navigator.clipboard.writeText(url.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
        catch { window.prompt("Share this preset", url.href); }
      }
    }
    setMenu(false);
  };

  const pictureInPicture = async () => {
    const node = root.current?.querySelector("video");
    if (!node) return;
    setPipError("");
    try {
      if (document.pictureInPictureElement === node) await document.exitPictureInPicture();
      else {
        await node.play();
        await node.requestPictureInPicture();
      }
    } catch { setPipError("Picture-in-picture is unavailable. Use Expand to open the video preview."); }
  };

  return <article ref={root} className={`group relative overflow-hidden rounded-xl bg-white/5 ${selected ? "ring-2 ring-lime" : ""}`}>
    <button type="button" aria-label={`View ${preset.title}`} onClick={event => onOpen(preset, event.currentTarget)} className="relative block w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white" style={{ aspectRatio: `${preset.width} / ${preset.height}` }}>
      <img src={preset.poster ?? preset.image} sizes={KATANA_IMAGE_SIZES} alt="" width={preset.width} height={preset.height} loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 size-full object-cover" />
      {preset.video && <KatanaVideo src={preset.video} poster={preset.poster ?? preset.image} label={`Preview ${preset.title}`} muted={muted} interactive={false} className="pointer-events-none absolute inset-0 size-full" />}
    </button>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100" />
    <div className="absolute right-1.5 top-1.5 z-20 flex flex-row gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:right-2 md:top-2 md:flex-col md:gap-2 [@media(hover:none)]:opacity-100">
      <div data-card-menu className="relative">
        <button type="button" aria-haspopup="menu" aria-expanded={menu} aria-label="More options" onClick={() => setMenu(open => !open)} className={control}><KatanaIcon name="more" className="size-4" /></button>
        {menu && <div role="menu" aria-label={`${preset.title} options`} onKeyDown={event => {
          if (event.key === "Escape") { setMenu(false); root.current?.querySelector<HTMLButtonElement>('[aria-label="More options"]')?.focus(); }
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
          const index = items.indexOf(document.activeElement as HTMLButtonElement);
          items[(index + (event.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus();
        }} className="absolute right-0 top-full z-30 mt-1 w-40 rounded-xl border border-white/10 bg-[#1b1d1f] p-1 text-[13px] shadow-2xl">
          <button type="button" role="menuitem" onClick={() => { setMenu(false); onReport(); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-white/90 outline-none hover:bg-white/10 focus:bg-white/10"><Ban size={16} />Report</button>
          <button type="button" role="menuitem" onClick={share} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-white/90 outline-none hover:bg-white/10 focus:bg-white/10"><Share2 size={16} />Share</button>
        </div>}
        {copied && <span role="status" className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] text-white md:right-full md:top-0 md:mr-1 md:mt-0">Link copied</span>}
      </div>
      <button ref={expand} type="button" aria-label="Expand example" onClick={event => onOpen(preset, event.currentTarget)} className={control}><KatanaIcon name="expand" className="size-4" /></button>
      {preset.video && <button type="button" aria-label={muted ? "Unmute video" : "Mute video"} aria-pressed={!muted} onClick={() => setMuted(value => !value)} className={control}><KatanaIcon name={muted ? "unmute" : "mute"} className="size-4" /></button>}
      {preset.video && <button type="button" aria-label="Picture in picture" onClick={pictureInPicture} className={control}><PictureInPicture2 size={16} /></button>}
    </div>
    {pipError && <p role="status" className="absolute inset-x-2 top-2 z-30 rounded-lg bg-black/80 p-2 text-xs text-white">{pipError}<button type="button" onClick={() => setPipError("")} className="ml-2 underline">Dismiss</button></p>}
    <div className="absolute inset-x-1.5 bottom-1.5 z-20 flex items-center justify-between gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:inset-x-2 md:bottom-2 md:gap-2 [@media(hover:none)]:opacity-100">
      <button type="button" aria-label="Like" aria-pressed={liked} onClick={() => onLike(preset.id)} className="inline-flex h-7 min-w-6 shrink-0 items-center gap-0.5 rounded-full bg-white/[.08] px-1.5 text-[10px] font-semibold text-white outline-none backdrop-blur-[2rem] focus-visible:ring-2 focus-visible:ring-white md:h-8 md:min-w-8 md:gap-1 md:px-2 md:text-xs [&_svg]:size-3 md:[&_svg]:size-4" style={{ boxShadow: "rgba(255,255,255,.3) -0.5px -0.5px 1px 0px inset, rgba(255,255,255,.6) 0.8px 0.5px 0.5px 0px inset" }}>
        <HeartIcon filled={liked} />{(preset.likes ?? 0) + (liked ? 1 : 0)}
      </button>
      <button type="button" onClick={() => onRecreate(preset)} className="katana-recreate inline-flex h-7 shrink-0 items-center gap-1 rounded-lg bg-lime px-2 text-[10px] font-semibold text-black outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white md:h-8 md:px-2.5 md:text-xs"><KatanaIcon name="recreate" className="size-3 md:size-4" />Recreate</button>
    </div>
  </article>;
}

export function KatanaGallery({ selectedId, likedIds, onLike, onReport, onOpen, onRecreate }: { selectedId: string | null; likedIds: string[]; onLike: (id: string) => void; onReport: () => void; onOpen: (preset: KatanaPreset, trigger: HTMLElement | null) => void; onRecreate: (preset: KatanaPreset) => void }) {
  const grid = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(4);
  const [width, setWidth] = useState(1200);
  const [category, setCategory] = useState<CategoryFilter>("All");

  useEffect(() => {
    const node = grid.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setWidth(width);
      setCount(width < 520 ? 2 : width < 1080 ? 3 : 4);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const categoryKnown = category === "All" || KATANA_PRESETS.some(preset => preset.category === category);
  const presets = category === "All" || !categoryKnown ? KATANA_PRESETS : KATANA_PRESETS.filter(preset => preset.category === category);
  const columns = useMemo(() => toColumns(presets, count, (width - GAP * (count - 1)) / count), [presets, count, width]);

  return <section id="katana-presets" aria-label="Katana presets" className="px-3">
    <div className="katana-gallery-heading mb-3 flex min-w-0 flex-col items-start justify-between gap-3 md:flex-row md:flex-wrap md:items-center">
      <h2 className="pl-2 text-sm font-semibold">Community presets</h2>
      <div role="group" aria-label="Preset category" className="katana-categories flex w-full min-w-0 max-w-full gap-1 overflow-x-auto pb-2 md:w-auto md:pb-0">
        {FILTERS.map(filter => <button key={filter} type="button" aria-pressed={category === filter} onClick={event => { setCategory(filter); event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" }); }} className={`inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[10px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 md:px-2.5 md:text-xs ${category === filter ? "bg-white text-black" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
          <KatanaIcon name={filter} className="size-3 md:size-3.5" /><span>{filter}</span>
        </button>)}
      </div>
    </div>
    {!categoryKnown && <p role="status" className="mb-3 px-2 text-xs text-white/50">Category information is unavailable for the captured presets. Showing all available presets.</p>}
    <div ref={grid} className="flex w-full items-start" style={{ gap: GAP }}>
      {presets.length === 0 ? <p role="status" className="w-full py-16 text-center text-sm text-white/50">No presets in this category yet.</p>
        : columns.map((column, index) => <div key={index} className="flex min-w-0 flex-1 flex-col" style={{ gap: GAP }}>
          {column.map(preset => <PresetCard key={preset.id} preset={preset} selected={preset.id === selectedId} liked={likedIds.includes(preset.id)} onLike={onLike} onReport={onReport} onOpen={onOpen} onRecreate={onRecreate} />)}
        </div>)}
    </div>
  </section>;
}
