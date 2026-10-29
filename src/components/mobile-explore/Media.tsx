"use client";

import { useEffect, useRef, useState } from "react";
import { poster, source } from "./data";
import styles from "./mobile-explore.module.css";

export function Media({ video, image, label = "", enabled = true, posterVisible = false }: { video?: string; image?: string; label?: string; enabled?: boolean; posterVisible?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setNear(entry.isIntersecting && window.innerWidth < 768);
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = player.current;
    if (!element) return;
    if (near && enabled) {
      element.muted = true;
      void element.play().catch(() => setPlaying(false));
    } else element.pause();
  }, [near, enabled]);

  return <div ref={ref} className={styles.media}>
    {poster(video, image) && <img src={poster(video, image)} alt="" loading="lazy" draggable={false} style={{ zIndex: posterVisible ? 2 : undefined }} />}
    {!image && !playing && <div aria-hidden="true" className={`preload preload-transition preload-gradient preload-static preload-gradient-0 ${styles.placeholder}`} />}
    {video && <video ref={player} src={near && enabled ? source(video) : undefined} poster={poster(video, image)} aria-label={label} muted loop playsInline preload="none" disablePictureInPicture onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} style={{ opacity: playing ? 1 : 0 }} />}
  </div>;
}
