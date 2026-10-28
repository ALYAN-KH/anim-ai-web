"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GenjutsuExample } from "@/data/genjutsuExamples";
import { useNearViewport } from "@/hooks/useNearViewport";
import { previewVideo } from "@/lib/videoPreview";

type Props = {
  example: GenjutsuExample;
  href: string;
  title: string;
  className: string;
};

export function GenjutsuCard({ example, href, title, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(example.initialVariant ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: cardRef, isNearViewport } = useNearViewport<HTMLElement>();
  const active = example.variants[activeIndex];

  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card || !isNearViewport) return;

    video.muted = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.08, rootMargin: "120px 0px" },
    );

    observer.observe(card);
    return () => {
      observer.disconnect();
      video.pause();
      setIsPlaying(false);
    };
  }, [activeIndex, isNearViewport]);

  const selectVariant = (index: number) => {
    setIsPlaying(false);
    setActiveIndex(index);
  };

  return (
    <article
      ref={cardRef}
      className={className}
    >
      <img className="absolute inset-0 h-full w-full object-cover" src={active.poster} alt="" loading="lazy" />
      <video
        ref={videoRef}
        key={active.video}
        src={isNearViewport ? previewVideo(active.video) : undefined}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${isPlaying ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload={isNearViewport ? "auto" : "none"}
        onPlaying={() => setIsPlaying(true)}
        aria-label={`${title}, ${active.label}`}
      />
      <Link
        href={href}
        aria-label={`Open ${title} in Higgsfield Genjutsu`}
        className="absolute inset-0 z-[1] rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-[-2px]"
      />
      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-between bg-[linear-gradient(180deg,rgba(0,0,0,0.46),transparent_32%,transparent_50%,rgba(0,0,0,0.7))] p-3 text-white opacity-0 max-[767px]:p-2 max-[767px]:opacity-100 transition-opacity duration-200 group-hover/genjutsu-card:opacity-100 group-focus-within/genjutsu-card:opacity-100 [@media(hover:none)]:opacity-100">
        <div className="inline-flex items-center gap-[5px] text-xs font-[650] max-[767px]:text-[10px] max-[767px]:[&_svg]:size-3 [text-shadow:0_1px_5px_#000]">
          <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="8" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 4h10a1 1 0 0 1 1 1v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {example.mode}
        </div>
        <div className="pointer-events-auto flex items-end justify-between gap-2 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-1.5">
          <div className="flex min-w-0 items-center pl-[3px]" aria-label={`Choose ${title} preview`}>
            {example.variants.map((variant, index) => (
              <button
                key={variant.video}
                type="button"
                aria-label={`Show ${variant.label} preview of ${title}`}
                aria-pressed={activeIndex === index}
                onClick={() => selectVariant(index)}
                className="-ml-2 h-[31px] w-[31px] max-[767px]:-ml-[5px] max-[767px]:size-[22px] max-[767px]:border flex-none overflow-hidden rounded-full border-2 border-white bg-[#333] shadow-[0_3px_10px_#0009] transition-transform duration-200 first:ml-0 hover:z-[1] hover:-translate-y-[3px] focus-visible:z-[1] focus-visible:-translate-y-[3px] aria-[pressed=true]:z-[1] aria-[pressed=true]:-translate-y-[3px] aria-[pressed=true]:border-lime"
              >
                <img className="h-full w-full object-cover" src={variant.poster} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <Link className="inline-flex min-h-[35px] max-[767px]:min-h-7 max-[767px]:gap-1 max-[767px]:rounded-md max-[767px]:px-2 max-[767px]:text-[11px] max-[767px]:[&_svg]:size-3 flex-none items-center justify-center gap-[6px] rounded-[9px] bg-lime px-3 text-[13px] font-bold text-[#101010] shadow-[0_4px_0_#9aaa16] transition-[filter] duration-200 hover:brightness-110 focus-visible:brightness-110" href={href} aria-label={`Recreate ${title}`}>
            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="8" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9 4h10a1 1 0 0 1 1 1v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            Recreate
          </Link>
        </div>
      </div>
    </article>
  );
}


