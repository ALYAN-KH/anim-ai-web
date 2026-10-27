"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoPreset, VideoSelection } from "../assets/preset-videos";
import { motionPresets } from "./motion-presets";
import styles from "./motion-control.module.css";

function MotionClip({ preset, selected, onSelect }: { preset: VideoPreset; selected: boolean; onSelect: (video: VideoSelection) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else { video.pause(); video.muted = true; setMuted(true); }
    }, { threshold: 0.05 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, []);

  return <div className={`group relative mb-2 overflow-hidden rounded-xl border bg-white/[.03] ${selected ? "border-lime" : "border-transparent"}`} style={{ aspectRatio: "0.553506 / 1" }}>
    <video ref={ref} src={preset.url} poster={preset.poster} muted={muted} loop playsInline disablePictureInPicture preload="none" className="absolute inset-0 size-full object-cover" aria-label={preset.name} />
    <button type="button" aria-label={`Use ${preset.name}`} aria-pressed={selected} onClick={() => onSelect({ ...preset })} className="absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime" />
    <button type="button" aria-label={`${muted ? "Unmute" : "Mute"} ${preset.name}`} aria-pressed={!muted} onClick={() => setMuted(value => !value)} className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime md:size-10">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        {muted ? <>
          <path d="M11.3333 3.95956V2.81723C11.3333 2.13798 10.5643 1.74407 10.0131 2.14095L6.72353 4.50943C6.5817 4.61155 6.41136 4.66649 6.2366 4.66649H5.16666C4.15415 4.66649 3.33333 5.4873 3.33333 6.49982V9.4998C3.33333 10.1667 3.68936 10.7503 4.22171 11.0712L2.14644 13.1465C1.95118 13.3417 1.95118 13.6583 2.14644 13.8535C2.3417 14.0488 2.65829 14.0488 2.85355 13.8535L13.8535 2.85355C14.0488 2.65829 14.0488 2.34171 13.8535 2.14645C13.6583 1.95119 13.3417 1.95119 13.1465 2.14645L11.3333 3.95956Z" fill="currentColor" />
          <path d="M6.72437 11.4902C6.70604 11.477 6.68717 11.4646 6.66797 11.4529L11.3342 6.78674V13.1824C11.3342 13.8617 10.5652 14.2556 10.0139 13.8587L6.72437 11.4902Z" fill="currentColor" />
        </> : <path d="M11.333 2.817c0-.679-.769-1.073-1.32-.676L6.724 4.51a.83.83 0 0 1-.487.157h-1.07A1.833 1.833 0 0 0 3.333 6.5v3a1.833 1.833 0 0 0 1.834 1.833h1.07a.83.83 0 0 1 .487.157l3.289 2.369c.551.397 1.32.003 1.32-.677V2.817Z" fill="currentColor" />}
      </svg>
    </button>
  </div>;
}

export function MotionControlContent({ selectedVideo, onSelect }: { selectedVideo: VideoSelection | null; onSelect: (video: VideoSelection) => void }) {
  return <div className="space-y-3 pr-0.5">
    <section className="relative flex h-[270px] w-full overflow-hidden rounded-2xl border border-white/[.04] bg-[#111314] px-8 py-6 max-sm:h-auto max-sm:flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg className="absolute -top-[106px] left-8 size-[478px]" viewBox="0 0 477 477" fill="none"><circle cx="238.5" cy="238.5" r="238" stroke="url(#kmc-mesh-gradient)" strokeOpacity=".08" /><defs><radialGradient id="kmc-mesh-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(238.5 238.5) scale(238.5)"><stop stopColor="#D1FE17" stopOpacity=".15" /><stop offset="1" stopColor="#D1FE17" stopOpacity="0" /></radialGradient></defs></svg>
        <div className="absolute right-[52px] top-[70px] h-[200px] w-[432px] bg-[radial-gradient(50%_50%,rgba(209,254,23,0.12)_0%,transparent_100%)]" />
      </div>
      <div className="relative z-10 flex w-full items-center gap-5 pb-2 max-sm:flex-col">
        <header className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          <h2 className="font-grotesk text-[40px] font-bold uppercase leading-[1.2] tracking-[-1.6px] max-xl:text-[32px]">Recreate any <span className={`relative inline-block px-1 text-lime ${styles.motionWord}`}><i /><i /><i /><i />Motion</span><br />with Your Image</h2>
          <p className="max-w-[372px] text-base leading-6 text-white">Copy motion from any video and place your character into the same movement</p>
        </header>
        <div className="relative aspect-video w-[40%] max-w-[380px] shrink-0 overflow-hidden rounded-xl max-sm:w-full lg:mr-4">
          <img alt="Motion control preview" src="https://static.higgsfield.ai/v3-kmc-how-it-works-hero-section.webp" className="absolute inset-0 size-full object-cover" />
        </div>
      </div>
    </section>
    <section className="rounded-2xl border border-white/[.04] bg-[#111314] px-6 py-4">
      <h3 className="mb-4 text-base font-semibold leading-6">Start by copying motion from library</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {motionPresets.map((preset, index) => <MotionClip key={`${index}:${preset.url}`} preset={preset} selected={selectedVideo?.url === preset.url} onSelect={onSelect} />)}
      </div>
    </section>
  </div>;
}
