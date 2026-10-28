"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Pause, Play } from "lucide-react";
import { prefersLightMedia } from "@/components/playable/gallery";

export const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

/** Whether decorative video may start on its own: false for reduced-motion or data-saver visitors, null before mount. */
export function useAutoplayAllowed() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!query.matches && !prefersLightMedia());
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return allowed;
}

/** Plays the video only while `target` is on screen and the tab is visible. Calls `onBlocked` if the browser refuses playback. */
export function usePlayWhileVisible(video: RefObject<HTMLVideoElement>, target: RefObject<Element>, enabled: boolean, onBlocked?: () => void) {
  const blocked = useRef(onBlocked);
  blocked.current = onBlocked;
  useEffect(() => {
    const node = video.current;
    const root = target.current ?? node;
    if (!enabled || !node || !root) return;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden) return node.pause();
      node.play().catch((error: DOMException) => {
        // AbortError only means a pause() interrupted the request.
        if (error?.name === "NotAllowedError") blocked.current?.();
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      node.pause();
    };
  }, [video, target, enabled]);
}

type Mode = "auto" | "play" | "pause";

/**
 * Muted looping demo. The poster stays underneath until frames arrive (and on failure); playback follows
 * visibility. When autoplay is suppressed or refused, a play button starts it explicitly.
 */
export function DemoVideo({ src, poster, label, fit = "cover", className = "", buttonClassName = "right-2 top-2" }: { src: string; poster?: string; label: string; fit?: "cover" | "contain"; className?: string; buttonClassName?: string }) {
  const autoplay = useAutoplayAllowed();
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("auto");
  const [blocked, setBlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const wanted = mode === "play" || (mode === "auto" && autoplay === true && !blocked);
  const [mounted, setMounted] = useState(false);
  if (wanted && !mounted) setMounted(true);

  useEffect(() => {
    setMode("auto");
    setBlocked(false);
    setReady(false);
    setFailed(false);
  }, [src]);

  usePlayWhileVisible(video, root, wanted && mounted && !failed, useCallback(() => setBlocked(true), []));

  const toggle = () => {
    if (playing) {
      setMode("pause");
      video.current?.pause();
      return;
    }
    setBlocked(false);
    setMode("play");
    video.current?.play().catch(() => setBlocked(true));
  };

  const fitClass = fit === "cover" ? "object-cover" : "object-contain";
  return <div ref={root} className={`group/demo relative size-full overflow-hidden ${className}`}>
    {poster && <img src={poster} alt="" aria-hidden="true" decoding="async" className={`absolute inset-0 size-full ${fitClass}`} />}
    {mounted && !failed && <video ref={video} src={src} poster={poster} muted loop playsInline disablePictureInPicture preload="auto" aria-label={label}
      onLoadedData={() => setReady(true)} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}
      className={`absolute inset-0 size-full ${fitClass} transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} />}
    {!failed && autoplay !== null && <button type="button" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${label}`} aria-pressed={playing}
      className={`absolute z-20 grid size-7 place-items-center rounded-full bg-black/55 text-white outline-none backdrop-blur-md transition-opacity hover:bg-black/75 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white ${buttonClassName} ${playing ? "opacity-0 group-hover/demo:opacity-100" : "opacity-100"}`}>
      {playing ? <Pause className="size-3.5" fill="currentColor" /> : <Play className="ml-0.5 size-3.5" fill="currentColor" />}
    </button>}
  </div>;
}

export type LocalMedia = { id: string; url: string; name: string; kind: "video" | "image"; file: File; addedAt: number };

/** Files the visitor picked this session. Object URLs live until the page unmounts so earlier uploads stay pickable. */
export function useMediaLibrary() {
  const [items, setItems] = useState<LocalMedia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const urls = useRef(new Set<string>());
  const counter = useRef(0);

  useEffect(() => {
    const live = urls.current;
    return () => live.forEach(url => URL.revokeObjectURL(url));
  }, []);

  const add = useCallback((files: FileList | File[], kind: LocalMedia["kind"]) => {
    const picked = Array.from(files);
    const types = kind === "video" ? VIDEO_TYPES : IMAGE_TYPES;
    const valid = picked.filter(file => types.includes(file.type));
    setError(valid.length < picked.length ? (kind === "video" ? "Reference must be an MP4, MOV or WebM video." : "Only PNG, JPG and WebP images are supported.") : null);
    const created = valid.map(file => {
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      counter.current += 1;
      return { id: `upload-${counter.current}`, url, name: file.name, kind, file, addedAt: Date.now() + counter.current };
    });
    if (created.length) setItems(current => [...created, ...current]);
    return created;
  }, []);

  return { items, error, add, clearError: useCallback(() => setError(null), []) };
}
export type MediaLibrary = ReturnType<typeof useMediaLibrary>;
