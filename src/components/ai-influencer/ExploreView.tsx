"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FEED_URLS, HERO_CLIPS, INFLUENCERS, type ExploreFeed, type InfluencerPreset, type MotionPreset } from "./data";
import { InfluencerCard, PresetCard } from "./Cards";
import { Icon } from "./Icon";
import { Masonry } from "./Masonry";

const PAGE = 20;
const FEEDS: { id: ExploreFeed; label: string; icon: string }[] = [
  { id: "influencers", label: "AI Influencers", icon: "tabInfluencers" },
  { id: "presets", label: "Higgsfield Presets", icon: "tabPresets" },
  { id: "trends", label: "Community Trends", icon: "tabTrends" },
];
const RATIO: Record<MotionPreset["aspect"], number> = { "9/16": 16 / 9, "3/4": 4 / 3, "3/2": 2 / 3, "16/9": 9 / 16 };

/** The fanned, overlapping hero clips; they play while the hero is on screen. */
function HeroFan() {
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = row.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = Array.from(el.querySelectorAll("video"));
    const observer = new IntersectionObserver(([entry]) => videos.forEach((v) => (entry.isIntersecting && !document.hidden ? v.play().catch(() => undefined) : v.pause())));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={row} aria-hidden="true" className="isolate flex w-full max-w-[672px] items-center">
      {HERO_CLIPS.map((clip) => (
        <figure
          key={clip.id}
          className="relative -ml-5 min-w-0 basis-0 overflow-hidden rounded-[0.6944rem] border-[0.7px] border-white/10 bg-[#1c1e21] shadow-[0_0_16.67px_rgba(0,0,0,0.5)] first:ml-0"
          style={{ zIndex: clip.z, flexGrow: clip.ratio[0], aspectRatio: `${clip.ratio[0]} / ${clip.ratio[1]}` }}
        >
          <video src={clip.video} poster={clip.poster} loop muted playsInline disablePictureInPicture preload="metadata" className="absolute inset-0 size-full object-cover" />
        </figure>
      ))}
    </div>
  );
}

function useFeed(feed: Exclude<ExploreFeed, "influencers">, active: boolean) {
  const [items, setItems] = useState<MotionPreset[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!active || items) return;
    let cancelled = false;
    fetch(FEED_URLS[feed])
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: MotionPreset[]) => !cancelled && setItems(data))
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, [active, feed, items]);
  return { items, error, retry: () => { setError(false); setItems(null); } };
}

type Props = {
  feed: ExploreFeed;
  onFeed: (feed: ExploreFeed) => void;
  onOpenInfluencer: (preset: InfluencerPreset) => void;
  onRecreateInfluencer: (preset: InfluencerPreset) => void;
  onOpenPreset: (preset: MotionPreset, variant: number) => void;
  onRecreatePreset: (preset: MotionPreset) => void;
  onRequireAuth: () => void;
};

export function ExploreView({ feed, onFeed, onOpenInfluencer, onRecreateInfluencer, onOpenPreset, onRecreatePreset, onRequireAuth }: Props) {
  const presets = useFeed("presets", feed === "presets");
  const trends = useFeed("trends", feed === "trends");
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [feed]);
  const more = useCallback(() => setShown((n) => n + PAGE), []);
  const motion = feed === "presets" ? presets : feed === "trends" ? trends : null;

  return (
    <section className="flex w-full min-w-0 flex-col self-stretch">
      <div className="flex w-full min-w-0 flex-col items-center gap-6 p-8 max-md:px-4">
        <HeroFan />
        <div className="flex w-full max-w-[560px] flex-col items-center gap-2.5 text-center">
          <h1 className="font-grotesk text-[36px] font-bold uppercase leading-10 tracking-[-0.04em] text-white [text-shadow:0_4px_12px_rgba(21,45,59,0.08)] max-md:text-[28px] max-md:leading-8">
            Your influencer, <br />your viral hit
          </h1>
          <p className="text-sm leading-5 tracking-[0.1px] text-white/50">Build your AI influencer with the face, body, and style you want. Choose a motion preset and watch them perform it in a video ready to share.</p>
        </div>
      </div>
      <div className="sticky top-0 z-30 flex shrink-0 justify-center bg-[#131517] px-3 py-2">
        <div role="tablist" aria-label="Preset source" className="flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none] max-md:w-full">
          {FEEDS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={feed === f.id}
              onClick={() => onFeed(f.id)}
              className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${feed === f.id ? "border border-white/5 bg-white text-[#1a1a1a]" : "text-white/50 hover:text-white"}`}
            >
              <Icon name={f.icon} className="size-4" />
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" aria-label={FEEDS.find((f) => f.id === feed)?.label}>
        {feed === "influencers" ? (
          <Masonry
            items={INFLUENCERS.slice(0, shown)}
            itemKey={(p) => p.id}
            ratio={(p) => p.preview.height / p.preview.width}
            onEnd={shown < INFLUENCERS.length ? more : undefined}
            render={(p) => <InfluencerCard preset={p} onOpen={() => onOpenInfluencer(p)} onRecreate={() => onRecreateInfluencer(p)} />}
          />
        ) : motion?.error ? (
          <div className="flex flex-col items-center gap-3 py-24 text-sm text-white/60">
            Couldn&apos;t load presets.
            <button type="button" onClick={motion.retry} className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/15">Try again</button>
          </div>
        ) : !motion?.items ? (
          <div className="grid grid-cols-4 gap-4 p-3 max-md:grid-cols-2" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-[9/16] animate-pulse rounded-xl bg-white/5" />)}
          </div>
        ) : (
          <Masonry
            items={motion.items.slice(0, shown)}
            itemKey={(p) => p.id}
            ratio={(p) => RATIO[p.aspect]}
            onEnd={shown < motion.items.length ? more : undefined}
            render={(p) => <PresetCard preset={p} onOpen={(v) => onOpenPreset(p, v)} onRecreate={() => onRecreatePreset(p)} onLike={feed === "trends" ? onRequireAuth : undefined} />}
          />
        )}
      </div>
    </section>
  );
}
