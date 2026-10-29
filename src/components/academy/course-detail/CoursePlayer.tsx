"use client";

import { useEffect, useRef, useState } from "react";
import icons from "../course-detail-icons.json";
import styles from "./course-detail.module.css";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
// Control icons are the originals from the Academy hero player.
const pauseIcon = <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 4.5a1 1 0 0 0-1 1v13a1 1 0 0 0 2 0v-13a1 1 0 0 0-1-1Zm8 0a1 1 0 0 0-1 1v13a1 1 0 0 0 2 0v-13a1 1 0 0 0-1-1Z" fill="currentColor" /></svg>;
const playIcon = <span dangerouslySetInnerHTML={{ __html: icons.play }} style={{ display: "contents" }} />;
const mutedIcon = <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6.24645 7.59227L5.84216 6.96057L5.84216 6.96057L6.24645 7.59227ZM12.25 3.75H13C13 3.47592 12.8505 3.22366 12.6101 3.09208C12.3696 2.9605 12.0766 2.97055 11.8457 3.1183L12.25 3.75ZM12.25 20.25L11.8457 20.8817C12.0766 21.0294 12.3696 21.0395 12.6101 20.9079C12.8505 20.7763 13 20.5241 13 20.25H12.25ZM6.24645 16.4077L6.65074 15.776L6.65074 15.776L6.24645 16.4077ZM22.0303 10.5303C22.3232 10.2374 22.3232 9.76256 22.0303 9.46967C21.7374 9.17678 21.2626 9.17678 20.9697 9.46967L22.0303 10.5303ZM16.727 13.7123C16.4341 14.0052 16.4341 14.4801 16.727 14.773C17.0199 15.0659 17.4948 15.0659 17.7877 14.773L16.727 13.7123ZM17.7877 9.46967C17.4948 9.17678 17.0199 9.17678 16.727 9.46967C16.4341 9.76256 16.4341 10.2374 16.727 10.5303L17.7877 9.46967ZM20.9697 14.773C21.2626 15.0659 21.7374 15.0659 22.0303 14.773C22.3232 14.4801 22.3232 14.0052 22.0303 13.7123L20.9697 14.773ZM2.75 8.5H5.7074V7H2.75V8.5ZM6.65074 8.22397L12.6543 4.3817L11.8457 3.1183L5.84216 6.96057L6.65074 8.22397ZM11.5 3.75V20.25H13V3.75H11.5ZM12.6543 19.6183L6.65074 15.776L5.84216 17.0394L11.8457 20.8817L12.6543 19.6183ZM5.7074 15.5H2.75V17H5.7074V15.5ZM2.5 15.25V8.75H1V15.25H2.5ZM6.65074 15.776C6.36912 15.5958 6.04176 15.5 5.7074 15.5V17C5.75516 17 5.80193 17.0137 5.84216 17.0394L6.65074 15.776ZM5.7074 8.5C6.04176 8.5 6.36912 8.40421 6.65074 8.22397L5.84216 6.96057C5.80193 6.98632 5.75516 7 5.7074 7V8.5ZM2.75 15.5C2.61193 15.5 2.5 15.3881 2.5 15.25H1C1 16.2165 1.7835 17 2.75 17V15.5ZM2.75 7C1.7835 7 1 7.7835 1 8.75H2.5C2.5 8.61193 2.61193 8.5 2.75 8.5V7ZM20.9697 9.46967L18.8483 11.591L19.909 12.6517L22.0303 10.5303L20.9697 9.46967ZM18.8483 11.591L16.727 13.7123L17.7877 14.773L19.909 12.6517L18.8483 11.591ZM16.727 10.5303L18.8483 12.6517L19.909 11.591L17.7877 9.46967L16.727 10.5303ZM18.8483 12.6517L20.9697 14.773L22.0303 13.7123L19.909 11.591L18.8483 12.6517Z" fill="currentColor" /></svg>;
const volumeIcon = <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.25 3.75v16.5l-6-3.842a1.5 1.5 0 0 0-.8-.2H2.75a.25.25 0 0 1-.25-.25V8.75a.25.25 0 0 1 .25-.25h2.7a1.5 1.5 0 0 0 .8-.23zM16.5 9a4.2 4.2 0 0 1 0 6m2.7-8.5a8 8 0 0 1 0 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const fullscreenIcon = <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.25 3.75H4.75C4.19772 3.75 3.75 4.19772 3.75 4.75V8.25M15.75 3.75H19.25C19.8023 3.75 20.25 4.19772 20.25 4.75V8.25M20.25 15.75V19.25C20.25 19.8023 19.8023 20.25 19.25 20.25H15.75M8.25 20.25H4.75C4.19772 20.25 3.75 19.8023 3.75 19.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function CoursePlayer({ src, poster, title, autoPlay = false }: { src: string; poster: string | null; title: string; autoPlay?: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === frame.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);
  // Lesson changes reuse the element: reset to the poster state.
  useEffect(() => { setStarted(false); setPaused(true); setTime(0); setFailed(false); }, [src]);
  useEffect(() => { if (autoPlay) start(); }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  // Metadata may arrive before hydration, so read it once on mount as well.
  useEffect(() => { const d = video.current?.duration; if (d && Number.isFinite(d)) setDuration(d); }, [src]);

  const start = () => {
    setStarted(true);
    video.current?.play().catch(() => setFailed(true));
  };
  const toggle = () => { const v = video.current; if (v) v.paused ? v.play().catch(() => {}) : v.pause(); };
  const pct = duration ? (time / duration) * 100 : 0;

  return <div ref={frame} className={`group relative aspect-video w-full overflow-hidden rounded-2xl border-qc-border-subtle bg-black rounded-q-600 border-0 ${styles.player}`} data-video-player="">
    <video
      ref={video} src={src} poster={poster ?? undefined} playsInline preload="metadata" aria-label={title}
      className="cursor-pointer absolute inset-0 size-full object-contain"
      onClick={toggle}
      onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onEnded={() => setPaused(true)}
      onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
      onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
      onDurationChange={e => setDuration(e.currentTarget.duration || 0)}
      onVolumeChange={e => { setVolume(e.currentTarget.volume); setMuted(e.currentTarget.muted); }}
      onError={() => setFailed(true)}
    />
    {!started && <button type="button" aria-label={`Play ${title}`} onClick={start} className="group/poster absolute inset-0 z-20 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-qc-brand-primary">
      {poster && /* eslint-disable-next-line @next/next/no-img-element */ <img alt="" src={poster} loading="eager" decoding="async" className={`object-cover md:transition-transform md:duration-200 md:ease-out md:group-hover/poster:scale-102 motion-reduce:transition-none ${styles.poster}`} />}
      <span aria-hidden="true" className="absolute inset-0 bg-black/20 md:transition-colors md:duration-200 md:group-hover/poster:bg-black/30 motion-reduce:transition-none" />
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-qc-brand-primary text-qc-text-inverse shadow-lg md:transition-transform md:duration-200 md:ease-out md:group-hover/poster:scale-105 md:group-active/poster:scale-95 motion-reduce:transition-none" dangerouslySetInnerHTML={{ __html: icons.play }} />
    </button>}
    {failed && <p role="alert" className={styles.playerError}>This video could not be played.</p>}
    {started && <div className={styles.controls}>
      <div className={styles.seek}>
        <span className={styles.seekTrack}><span style={{ width: `${pct}%` }} /></span>
        <span className={styles.seekKnob} style={{ left: `${pct}%` }} aria-hidden="true" />
        <input aria-label="Video progress" type="range" min={0} max={duration || 0} step={0.01} value={time} onChange={e => { if (video.current) video.current.currentTime = Number(e.target.value); }} />
      </div>
      <div className={styles.controlRow}>
        <button type="button" aria-label={paused ? "Play video" : "Pause video"} onClick={toggle}>{paused ? playIcon : pauseIcon}</button>
        <div className={styles.volume}>
          <button type="button" aria-label={muted || !volume ? "Unmute video" : "Mute video"} onClick={() => { const v = video.current; if (!v) return; v.muted = !v.muted; if (!v.muted && !v.volume) v.volume = 1; }}>{muted || !volume ? mutedIcon : volumeIcon}</button>
          <input aria-label="Video volume" type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={e => { const v = video.current; if (!v) return; v.volume = Number(e.target.value); v.muted = v.volume === 0; }} />
        </div>
        <time>{fmt(time)} / {fmt(duration)}</time>
        <span style={{ flex: 1 }} />
        <button type="button" aria-label="Fullscreen video" aria-pressed={fullscreen} onClick={() => { (document.fullscreenElement ? document.exitFullscreen() : frame.current?.requestFullscreen())?.catch(() => {}); }}>{fullscreenIcon}</button>
      </div>
    </div>}
  </div>;
}
