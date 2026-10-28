"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiggsSnake } from "@/components/ui/HiggsSnake";
import { bg } from "@/components/gallery/Tile";
import { previewVideo } from "@/lib/videoPreview";

type Props = {
  title: string;
  by: string;
  href: string;
  poster?: string;
  avatar?: string;
  video?: string;
  hue: number;
};

function SnakeSeal() {
  return (
    <span className="relative inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center text-black">
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 h-full w-full text-lime"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 1.5l2.4 1.7 2.9-.3 1.2 2.7 2.7 1.2-.3 2.9L22.5 12l-1.7 2.4.3 2.9-2.7 1.2-1.2 2.7-2.9-.3L12 22.5l-2.4-1.7-2.9.3-1.2-2.7-2.7-1.2-1.2-2.7-2.9.3L1.5 12l1.7-2.4-.3-2.9 2.7-1.2 1.2-2.7 2.9.3L12 1.5Z"
        />
      </svg>
      <HiggsSnake className="relative h-[9px] w-[9px]" />
    </span>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3Z" />
    </svg>
  );
}

export function ProjectCard({ title, by, href, poster, avatar, video, hue }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!previewActive || !el || !video) return;
    el.muted = true;
    void el.play().catch(() => setPlaying(false));
  }, [previewActive, video]);

  const stopVideo = () => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      if (el.readyState > 0) el.currentTime = 0;
    }
    setPlaying(false);
    setPreviewActive(false);
  };

  return (
    <Link
      href={href}
      aria-label={`${title} by ${by}`}
      onMouseEnter={() => setPreviewActive(true)}
      onMouseLeave={stopVideo}
      onFocus={() => setPreviewActive(true)}
      onBlur={stopVideo}
      className="block rounded-2xl border border-white/10 bg-[#111] p-[5px] transition-colors duration-200 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
    >
      <div
        className="relative aspect-[343/195] overflow-hidden rounded-xl"
        style={{ background: bg(hue) }}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {video && (
          <video
            ref={videoRef}
            src={previewActive ? previewVideo(video) : undefined}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setPlaying(false);
            }}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div className="flex items-center gap-2 px-[9px] pb-2 pt-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lime text-black" aria-hidden="true">
          {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" loading="lazy" /> : <HiggsSnake className="h-3 w-3" />}
        </span>

        <span className="flex min-w-0 flex-1 items-center gap-1.5 text-xs leading-none">
          <span className="min-w-0 truncate">
            <strong className="font-semibold text-white">{title}</strong>
            <span className="text-zinc-400"> by {by}</span>
          </span>

          <SnakeSeal />
        </span>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-[#1f1f1f] px-2.5 py-1.5 text-xs font-medium leading-none text-white">
          <GlobeIcon />
          Public
        </span>
      </div>
    </Link>
  );
}


