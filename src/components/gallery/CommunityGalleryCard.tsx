"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useNearViewport } from "@/hooks/useNearViewport";
import { previewPoster, previewVideo } from "@/lib/videoPreview";

export type CommunityGalleryItem = {
  image: string;
  video?: string;
  label: string;
  creator: string;
  avatar?: string;
  likes: number;
  aspectRatio: string | number;
};

export function CommunityGalleryCard({ item, href, className = "", playOnHoverOnly = false }: { item: CommunityGalleryItem; href: string; className?: string; playOnHoverOnly?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: cardRef, isNearViewport } = useNearViewport<HTMLElement>();
  const [playing, setPlaying] = useState(false);
  const isGptImageCard = className.includes("group/gpt-image");
  const video = previewVideo(item.video);
  const image = item.image || previewPoster(item.video);
  const reveal = "-translate-y-1 opacity-0 transition-all duration-200 group-hover/community:translate-y-0 group-hover/community:opacity-100 group-focus-within/community:translate-y-0 group-focus-within/community:opacity-100";

  const play = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    void videoRef.current.play().catch(() => setPlaying(false));
  };
  const pause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item.video || playOnHoverOnly || !isNearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => setPlaying(false));
        else video.pause();
      },
      { threshold: 0.08 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [isNearViewport, item.video, playOnHoverOnly]);

  return (
    <article
      ref={cardRef}
      className={`community-gallery-card group/community ${className}`}
      style={{ aspectRatio: item.aspectRatio }}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      {image && <img className={`community-card-media ${isGptImageCard ? "group-hover/gpt-image:!brightness-[0.7] group-hover/gpt-image:!scale-[1.012] group-focus-within/gpt-image:!brightness-[0.7] group-focus-within/gpt-image:!scale-[1.012]" : ""}`} src={image} alt="" loading="lazy" decoding="async" />}
      {video && (
        <video
          ref={videoRef}
          className={`community-card-media transition-opacity duration-200 ${playing ? "opacity-100" : "opacity-0"}`}
          src={isNearViewport ? video : undefined}
          muted
          loop
          playsInline
          preload={!isNearViewport ? "none" : playOnHoverOnly ? "metadata" : "auto"}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-hidden="true"
        />
      )}
      <Link href={href} aria-label={`Open ${item.label}`} className="absolute inset-0 z-10 rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime" />
      <span aria-hidden="true" className="community-card-shade" />
      <span aria-hidden="true" className={`pointer-events-none absolute left-3 top-3 z-20 flex min-w-0 items-center gap-2 ${reveal}`}>
        {item.avatar ? <img src={item.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-white/30" /> : <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-600 text-[10px] font-bold text-white">{item.creator.charAt(0).toUpperCase()}</span>}
        <span className="max-w-[170px] truncate text-xs font-semibold text-white drop-shadow">{item.creator}</span>
      </span>
      <span aria-hidden="true" className={`pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md ${reveal}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M15.1424 6.625C15.1424 10.5781 9.48962 13.5 8.97575 13.5C8.46188 13.5 2.80908 10.5781 2.80908 6.625C2.80908 3.875 4.52204 2.5 6.23501 2.5C7.94795 2.5 8.97575 3.53125 8.97575 3.53125C8.97575 3.53125 10.0035 2.5 11.7165 2.5C13.4295 2.5 15.1424 3.875 15.1424 6.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        {item.likes}
      </span>
    </article>
  );
}


