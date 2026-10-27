"use client";
import { useEffect, useRef } from "react";

interface LoopingVideoProps {
  src: string;
  label: string;
}

export function LoopingVideo({ src, label }: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.play().catch(() => undefined);
        else node.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      aria-label={label}
      loop
      muted
      playsInline
      disablePictureInPicture
      preload="metadata"
      className="size-full object-cover"
    />
  );
}
