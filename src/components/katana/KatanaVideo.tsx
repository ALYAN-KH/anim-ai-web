"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { prefersLightMedia } from "@/components/playable/gallery";

/** Keep the poster until frames arrive; autoplay only in view, with a user-play fallback. */
export function KatanaVideo({ src, poster, label = "Katana video", className = "", muted = true, controls = false, interactive = true }: {
  src: string; poster: string; label?: string; className?: string;
  muted?: boolean; controls?: boolean; interactive?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  // A user play gesture must not restart the effect: its cleanup would immediately pause the video.
  const manual = useRef(false);
  const resume = useRef<() => void>(() => {});
  const [autoStart, setAutoStart] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const node = video.current;
    const element = root.current;
    if (!node || !element) return;
    let disposed = false;
    manual.current = false;
    node.defaultMuted = muted;
    node.muted = muted;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    // The form/hero files are already served locally; a reported slow connection need not block them.
    const local = src.startsWith("/") || src.startsWith("blob:");
    let visible = false;
    const sync = () => {
      if (disposed) return;
      if (document.pictureInPictureElement === node) return;
      if (!visible || document.hidden) { node.pause(); return; }
      const allowed = manual.current || (!reduce.matches && (local || !prefersLightMedia()));
      setAutoStart(allowed);
      if (!allowed) { node.pause(); setBlocked(true); return; }
      node.play().then(() => { if (!disposed) setBlocked(false); }).catch(() => { if (!disposed) setBlocked(true); });
    };
    resume.current = sync;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    node.addEventListener("leavepictureinpicture", sync);
    reduce.addEventListener("change", sync);
    return () => {
      disposed = true;
      resume.current = () => {};
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
      node.removeEventListener("leavepictureinpicture", sync);
      reduce.removeEventListener("change", sync);
      node.pause();
    };
  }, [src]);

  const play = () => {
    const node = video.current;
    if (!node) return;
    manual.current = true;
    setAutoStart(true);
    if (failed) { setFailed(false); node.load(); }
    node.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
  };

  return <div ref={root} className={`relative overflow-hidden bg-[#1d1f20] ${className}`}>
    <img src={poster} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
    <video ref={video} src={src} poster={poster} aria-label={label} muted={muted} loop playsInline autoPlay={autoStart}
      controls={controls} preload={src.startsWith("/media/katana/") ? "metadata" : "none"}
      onCanPlay={() => resume.current()}
      onLoadedData={() => setLoaded(true)} onPlaying={() => { setPlaying(true); setLoaded(true); setBlocked(false); }}
      onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }}
      className={`absolute inset-0 size-full ${controls ? "object-contain" : "object-cover"} ${loaded && !failed ? "opacity-100" : "opacity-0"}`} />
    {interactive && !playing && (blocked || failed || loaded) && <button type="button" onClick={play}
      aria-label={failed ? `Retry ${label}` : `Play ${label}`}
      className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-xs text-white outline-none focus-visible:ring-2 focus-visible:ring-lime">
      {failed ? <RotateCcw size={16} /> : <Play size={16} />} {failed ? "Retry video" : "Play video"}
    </button>}
    {failed && <span role="status" className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/75 px-2 py-1 text-center text-xs text-white">Video unavailable. {interactive ? "Try again." : "Open preview to retry."}</span>}
  </div>;
}
