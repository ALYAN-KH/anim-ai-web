"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { GENJUTSU_MODES, type GenjutsuItem } from "../assets/genjutsu-library";
import { CloseIcon } from "../assets/video-preview-dialog";

const PROMPTS = {
  motion: "replace the faces only from @Image 1 and @Image 2 from the faces of the people in @Video 1 and make the people from @Video 1 make them wear gangster rap clothes with jewelry on and make the face from @Image 1 that is going on the person in @Video 1 make @Image 1 face slightly skinnier and less chubby witha good jawline but not very far from where it is right now just a little bit better but besides that keep the movement and everything from @Video 1 the same just replacign the faces like i said and changing the clothing",
  swap: "swap the person in @Video 1 with the character from @Image 1 and keep the background, camera movement and lighting from @Video 1 exactly the same",
};

const icon = (d: ReactNode, className = "size-5") => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{d}</svg>;
const RECREATE_ICON = icon(<path d="M17 2.5l3.5 3.5L17 9.5M3.5 11V9.5A3.5 3.5 0 0 1 7 6h13.5M7 21.500L3.5 18 7 14.500M20.500 13v1.500A3.5 3.5 0 0 1 17 18H3.5" />);
const DOWNLOAD_ICON = icon(<path d="M12 3.5v11m0 0L8 10.500m4 4 4-4M4 16.5V19a1.500 1.500 0 0 0 1.500 1.500h13A1.500 1.500 0 0 0 20 19v-2.500" />);
const HEART_ICON = icon(<path d="M12 20.500c-.3 0-8.500-4.400-8.500-10.600C3.5 6.600 5.800 4.500 8.300 4.500c1.700 0 3 .9 3.700 2 .7-1.100 2-2 3.700-2 2.500 0 4.800 2.100 4.800 5.400 0 6.200-8.200 10.600-8.500 10.600Z" />);
const SHARE_ICON = icon(<path d="M14.500 4.500l6 6-6 6V13c-5 0-8 1.500-10 5 .5-6 4-9.5 10-9.5V4.500Z" />);
const PLAY_ICON = icon(<path d="M7 4.500v15l12-7.500-12-7.500Z" fill="currentColor" />);
const PAUSE_ICON = icon(<path d="M7.500 4.500v15m9-15v15" strokeWidth="2.500" />);
const VOLUME_ICON = icon(<path d="M4 9.5h3l5-4v13l-5-4H4v-5Zm12 .500a3.5 3.5 0 0 1 0 4m2-6.5a7 7 0 0 1 0 9" />);
const MUTED_ICON = icon(<path d="M4 9.5h3l5-4v13l-5-4H4v-5Zm12 0 5 5m0-5-5 5" />);
const FULLSCREEN_ICON = icon(<path d="M4 9V5.500A1.500 1.500 0 0 1 5.500 4H9M15 4h3.5A1.500 1.500 0 0 1 20 5.500V9M20 15v3.5a1.500 1.500 0 0 1-1.500 1.500H15M9 20H5.500A1.500 1.500 0 0 1 4 18.500V15" />);

const LIME = "#d1fe17";
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const RANGE = "h-1 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:size-0 [&::-moz-range-thumb]:border-0";
const rangeBg = (fraction: number) => ({ background: `linear-gradient(to right, ${LIME} ${fraction * 100}%, rgba(255,255,255,.25) ${fraction * 100}%)` });

function Player({ item }: { item: GenjutsuItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const toggle = () => { const v = ref.current; if (v) (v.paused ? v.play() : (v.pause(), undefined))?.catch?.(() => undefined); };
  const seek = (value: number) => { if (ref.current) ref.current.currentTime = value; setTime(value); };
  const setVol = (value: number) => { setVolume(value); setMuted(value === 0); if (ref.current) { ref.current.volume = value; ref.current.muted = value === 0; } };
  const toggleMute = () => { const next = !muted; setMuted(next); if (ref.current) ref.current.muted = next; };
  const ctl = "grid size-8 place-items-center rounded-md text-white hover:bg-white/10";
  return <div className="relative flex max-h-full max-w-full flex-col items-center justify-center">
    <video ref={ref} key={item.url} src={item.url} poster={item.poster} autoPlay loop playsInline onClick={toggle} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onLoadedMetadata={event => setDuration(event.currentTarget.duration)} className="max-h-[calc(100vh-110px)] max-w-full cursor-pointer rounded-lg object-contain" />
    <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-xs text-white">
      <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle} className={ctl}>{playing ? PAUSE_ICON : PLAY_ICON}</button>
      <span className="tabular-nums">{fmt(time)} / {fmt(duration)}</span>
      <input type="range" aria-label="Seek" min={0} max={duration || 1} step="any" value={time} onChange={event => seek(+event.target.value)} className={`${RANGE} min-w-0 flex-1`} style={rangeBg(duration ? time / duration : 0)} />
      <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute} className={ctl}>{muted || volume === 0 ? MUTED_ICON : VOLUME_ICON}</button>
      <input type="range" aria-label="Volume" min={0} max={1} step="0.05" value={muted ? 0 : volume} onChange={event => setVol(+event.target.value)} className={`${RANGE} w-20`} style={rangeBg(muted ? 0 : volume)} />
      <button type="button" aria-label="Fullscreen" onClick={() => ref.current?.requestFullscreen?.()} className={ctl}>{FULLSCREEN_ICON}</button>
    </div>
  </div>;
}

const GRAY_BTN = "flex h-11 items-center justify-center gap-2 rounded-xl bg-white/[.08] text-sm font-semibold text-white transition hover:bg-white/[.14]";

/** Renders @Image / @Video mentions as lime chips. */
function PromptText({ text }: { text: string }) {
  return <>{text.split(/(@(?:Image|Video) \d)/g).map((part, index) => /^@(Image|Video) \d$/.test(part)
    ? <span key={index} className="rounded bg-lime/15 px-1 text-lime">{part}</span>
    : part)}</>;
}

export function GenjutsuDetail({ item, onClose, onSignup, onRecreate }: { item: GenjutsuItem; onClose: () => void; onSignup: () => void; onRecreate: (item: GenjutsuItem) => void }) {
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={item.name} className="fixed inset-0 z-[200] flex flex-col bg-[#14110f]/95 backdrop-blur-2xl lg:flex-row">
      <div className="relative flex min-h-0 flex-1 items-center justify-center p-3">
        <Player item={item} />
      </div>
      <aside className="flex max-h-[60vh] w-full shrink-0 flex-col gap-3 overflow-y-auto rounded-2xl border border-white/[.08] bg-[#0f1113] p-3 lg:m-3 lg:max-h-none lg:w-[336px]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white/10 text-sm font-semibold uppercase">{item.name.slice(0, 1)}</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="text-xs text-white/50">Author</p></div>
          <button type="button" aria-label="Close" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-white/[.08] hover:bg-white/[.14]"><CloseIcon /></button>
        </div>
        <section className="rounded-xl bg-white/[.04] p-3">
          <div className="mb-3 flex items-center justify-between text-xs font-medium tracking-wide text-white/55">PROMPT
            <button type="button" onClick={() => navigator.clipboard?.writeText(PROMPTS[item.mode]).catch(() => undefined)} className="rounded-md border border-white/10 px-2 py-1 text-white hover:bg-white/10">Copy</button>
          </div>
          <p className="text-sm leading-5 text-white"><PromptText text={PROMPTS[item.mode]} /></p>
        </section>
        <section className="rounded-xl bg-white/[.04] p-3">
          <p className="mb-3 text-xs font-medium tracking-wide text-white/55">DETAILS</p>
          <dl className="space-y-2 text-sm"><div className="flex justify-between gap-4"><dt className="text-white/55">Model</dt><dd className="text-right font-medium">Higgsfield Genjutsu - {GENJUTSU_MODES[item.mode].replace("Motion transfer", "Motion Transfer").replace("Objects swap", "Objects Swap")}</dd></div><div className="flex justify-between"><dt className="text-white/55">Quality</dt><dd className="font-medium">720p</dd></div></dl>
        </section>
        <div className="mt-auto flex flex-col gap-2">
          <button type="button" onClick={() => onRecreate(item)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-lime text-sm font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,.43)] hover:brightness-90">{RECREATE_ICON}Recreate</button>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            <button type="button" onClick={onSignup} className={GRAY_BTN}>{DOWNLOAD_ICON}Download</button>
            <button type="button" aria-label="Like" onClick={onSignup} className={`${GRAY_BTN} w-14`}>{HEART_ICON}</button>
            <button type="button" aria-label="Share" onClick={onSignup} className={`${GRAY_BTN} w-14`}>{SHARE_ICON}</button>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
