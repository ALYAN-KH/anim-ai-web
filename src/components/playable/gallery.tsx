"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PLAYABLE_CATEGORIES, PLAYABLE_GAMES, PLAYABLE_IMAGE_SIZES, type PlayableCategory, type PlayableGame } from "./data";
import { Icon } from "./icons";

export type CategoryFilter = PlayableCategory | "All";
const FILTERS: CategoryFilter[] = ["All", ...PLAYABLE_CATEGORIES];

/** Roving-focus keyboard support for a role="tablist" (arrows, Home, End). */
export function tablistKeys<T>(values: readonly T[], current: T, select: (value: T) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    const index = values.indexOf(current);
    const next = { ArrowRight: (index + 1) % values.length, ArrowLeft: (index - 1 + values.length) % values.length, Home: 0, End: values.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(values[next]);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };
}

/** True when the visitor asked for reduced data use or is on a 2G-class connection. */
export function prefersLightMedia() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return connection?.saveData === true || /(^|-)2g$/.test(connection?.effectiveType ?? "");
}

export const categoryIcon = (category: PlayableCategory) => (category === "Shooters" ? "shootersLabel" : category);

// Only one card preview plays at a time.
let playingPreview: HTMLVideoElement | null = null;

function GameCard({ game, eager, onPlay }: { game: PlayableGame; eager: boolean; onPlay: (game: PlayableGame, trigger: HTMLElement | null) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  const stop = () => {
    const node = video.current;
    if (!node) return;
    node.pause();
    if (playingPreview === node) playingPreview = null;
    setPlaying(false);
  };
  const start = (fromPointer: boolean) => {
    const node = video.current;
    if (!node || prefersLightMedia() || (fromPointer && !matchMedia("(hover: hover) and (pointer: fine)").matches)) return;
    if (playingPreview && playingPreview !== node) playingPreview.pause();
    playingPreview = node;
    node.muted = true;
    node.play().catch(() => undefined);
  };

  useEffect(() => {
    if (!game.previewVideo) return;
    const node = root.current;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting || stop());
    if (node) observer.observe(node);
    const onHidden = () => document.hidden && stop();
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
      stop();
    };
  }, [game.previewVideo]);

  const preview = game.previewVideo ? { onPointerEnter: () => start(true), onPointerLeave: stop, onFocus: () => start(false), onBlur: stop } : {};

  return <div ref={root} data-playable-card={game.id} className="flex flex-col gap-2.5" {...preview}>
    <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => onPlay(game, playButton.current)} className="w-full cursor-pointer outline-none">
      <span className="relative block aspect-video overflow-hidden rounded-xl bg-white/5">
        <span className="absolute inset-0 bg-[#16181a]">
          {!broken && <img src={game.image} srcSet={game.srcSet} sizes={PLAYABLE_IMAGE_SIZES} alt="" width={1920} height={1080} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setBroken(true)} className="absolute inset-0 size-full object-cover" />}
          {game.previewVideo && <video ref={video} src={game.previewVideo} loop muted playsInline disablePictureInPicture preload="none" aria-hidden="true" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} className={`pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`} />}
        </span>
      </span>
    </button>
    <div className="flex items-start gap-1 px-1">
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
        <p className="truncate text-sm font-semibold leading-5 text-white">{game.title}</p>
        <span className="flex items-center gap-1 whitespace-nowrap text-xs leading-4 text-white/50"><Icon name={categoryIcon(game.category)} className="size-3 shrink-0 text-white/50" />{game.category}</span>
      </div>
      <button ref={playButton} type="button" aria-label={`Play ${game.title}`} onClick={event => onPlay(game, event.currentTarget)} className="h-6 shrink-0 rounded-full bg-lime px-2.5 text-xs font-semibold text-black outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f10]">Play</button>
    </div>
  </div>;
}

export function PlayableGallery({ category, onCategory, onPlay }: { category: CategoryFilter; onCategory: (value: CategoryFilter) => void; onPlay: (game: PlayableGame, trigger: HTMLElement | null) => void }) {
  const games = category === "All" ? PLAYABLE_GAMES : PLAYABLE_GAMES.filter(game => game.category === category);

  return <section aria-label="Playable games" aria-busy="false" className="relative z-[1] flex w-full flex-col gap-6 px-3 pb-6">
    <div role="tablist" aria-label="Game categories" onKeyDown={tablistKeys(FILTERS, category, onCategory)} className="flex w-full gap-1.5 overflow-x-auto [justify-content:safe_center] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map(filter => {
        const active = filter === category;
        return <button key={filter} type="button" role="tab" aria-selected={active} aria-controls="playable-games" tabIndex={active ? 0 : -1} onClick={() => onCategory(filter)} className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${active ? "border-white/10 bg-white/10 text-white" : "border-transparent text-white/55 hover:bg-white/5 hover:text-white"}`}>
          <Icon name={filter} className="size-4 shrink-0" />{filter}
        </button>;
      })}
    </div>
    <ul id="playable-games" aria-label={`${category === "All" ? "All" : category} games`} className="grid w-full grid-cols-1 gap-x-4 gap-y-6 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map((game, index) => <li key={game.id}><GameCard game={game} eager={index < 4} onPlay={onPlay} /></li>)}
    </ul>
  </section>;
}
