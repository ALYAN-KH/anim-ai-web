"use client";
import { useEffect, useRef } from "react";
import { LoopingVideo as SharedLoopingVideo } from "@/components/audio/ui/LoopingVideo";

interface LoopingVideoProps {
  src: string;
  poster?: string;
  label: string;
  muted?: boolean;
  className?: string;
}

/** Autoplays only while on screen; respects prefers-reduced-motion. */
export function LoopingVideo({
  src,
  poster,
  label,
  muted = true,
  className = "size-full object-cover",
}: LoopingVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const video = containerRef.current?.querySelector("video");
    if (!video) return;
    video.poster = poster ?? "";
    video.muted = muted;
  }, [muted, poster, src]);
  return (
    <div ref={containerRef} className={className}>
      <SharedLoopingVideo src={src} label={label} />
    </div>
  );
}
