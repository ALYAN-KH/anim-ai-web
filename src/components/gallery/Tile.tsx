"use client";

import { useRef, useEffect } from "react";
import { useNearViewport } from "@/hooks/useNearViewport";

export type Item = {
  t?: string;
  sub?: string;
  src?: string;
  poster?: string;
  video?: string;
  h?: number;
  tag?: string;
  href?: string;
  recreate?: string;
  author?: string;
  avatar?: string;
  likes?: number;
  aspectRatio?: string;
  festivalBadge?: "laurel" | "higgsfield";
};

const palettes = [
  ["#ff5d8f", "#5b174d", "#111114"],
  ["#d7ff2f", "#3f641e", "#0c1510"],
  ["#37d6ff", "#243b8f", "#10101a"],
  ["#ff9f43", "#8b2f32", "#17100d"],
  ["#b084ff", "#34246b", "#0d0c15"],
  ["#65f0c4", "#126c71", "#0b1215"],
];

export function bg(i: number) {
  const p = palettes[i % palettes.length];
  return `linear-gradient(145deg,${p[0]},${p[1]} 48%,${p[2]})`;
}

export function Tile({
  it,
  i,
  r = "rounded-xl",
  showInfo = true,
  hoverEffects = true,
  playOnHoverOnly = false,
}: {
  it: Item;
  i: number;
  r?: string;
  showInfo?: boolean;
  hoverEffects?: boolean;
  playOnHoverOnly?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: containerRef, isNearViewport } = useNearViewport<HTMLDivElement>();

  const videoUrl = it.video || (it.src?.endsWith(".mp4") ? it.src : undefined);
  const posterUrl =
    it.poster || (!it.src?.endsWith(".mp4") ? it.src : undefined);
  const hasMedia = Boolean(videoUrl || posterUrl);

  // Play video on scroll when in viewport
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !videoUrl || !container || playOnHoverOnly || !isNearViewport) return;

    video.muted = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Handled gracefully if browser restricts
              });
            }
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "80px 0px 80px 0px",
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl, playOnHoverOnly, isNearViewport]);

  // Play video immediately when hovered
  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video && videoUrl) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video && videoUrl && playOnHoverOnly) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative isolate h-full w-full overflow-hidden ${r} bg-[#202225] select-none`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${hoverEffects ? "transition duration-700 group-hover:scale-105" : ""}`}
        style={{ background: bg(i) }}
      />

      {/* Decorative patterns if neither video nor image exists */}
      {!hasMedia && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <span className="absolute -right-[12%] -top-[15%] h-[62%] w-[62%] rounded-full border border-white/30 bg-white/10" />
          <span className="absolute -bottom-[25%] -left-[12%] h-[68%] w-[68%] rotate-12 rounded-[36%] border border-white/20 bg-black/20" />
          <span className="absolute left-[18%] top-[18%] h-[42%] w-[42%] rotate-45 rounded-3xl border border-white/20 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,.35)] transition duration-700 group-hover:rotate-[55deg] group-hover:scale-110" />
          <span className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
      )}

      {/* Video Element: Plays on scroll when visible, and on hover */}
      {videoUrl ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${hoverEffects ? "transition-transform duration-700 group-hover:scale-105" : ""}`}
          src={isNearViewport ? videoUrl : undefined}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload={isNearViewport ? "metadata" : "none"}
        />
      ) : posterUrl ? (
        <img
          className={`absolute inset-0 h-full w-full object-cover ${hoverEffects ? "transition duration-700 group-hover:scale-105" : ""}`}
          src={posterUrl}
          alt={it.t || ""}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {hoverEffects && videoUrl && (
        <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          <svg className="h-3 w-3 fill-lime" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {showInfo && (it.t || it.tag) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-4 pt-14">
          <div className="flex items-end justify-between gap-2">
            {it.t && (
              <div>
                <p className="text-sm font-semibold leading-tight text-white transition-colors group-hover:text-lime">
                  {it.t}
                </p>
                {it.sub && (
                  <p className="mt-1 line-clamp-1 text-[11px] text-white/70">
                    {it.sub}
                  </p>
                )}
              </div>
            )}
            {it.tag && (
              <span className="shrink-0 rounded-md bg-white/15 px-2 py-1 text-[9px] font-bold uppercase text-white backdrop-blur">
                {it.tag}
              </span>
            )}
          </div>
        </div>
      )}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10 ${hoverEffects ? "transition group-hover:ring-lime/50" : ""}`}
      />
    </div>
  );
}


