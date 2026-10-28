"use client";

import { useRef, useState, type ReactNode } from "react";
import { GENJUTSU_MODES, genjutsuItems, type GenjutsuItem, type GenjutsuSource } from "../assets/genjutsu-library";
import { ExpandIcon } from "../shared/icons";
import { GenjutsuDetail } from "./genjutsu-detail";
import { MotionTransferIcon, ObjectsSwapIcon } from "./genjutsu-panel";

const INTRO_VIDEO = "https://static.higgsfield.ai/genjutsu/genjutsu-intro.mp4";
const INTRO_POSTER = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fstatic.higgsfield.ai%2Fgenjutsu%2Fgenjutsu-intro-poster.webp&w=384&q=85";

const stroke = (d: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const SOURCES: { id: GenjutsuSource; label: string; icon: ReactNode }[] = [
  { id: "higgsfield", label: "Higgsfield", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m20.35 11.844-.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z" /></svg> },
  { id: "trending", label: "Community trending", icon: stroke("M15.75 6.75H21.25V12.25M20.7361 7.275L13.7071 14.2939C13.3165 14.684 12.6837 14.6837 12.2934 14.2934L9.70711 11.7071C9.31658 11.3166 8.68342 11.3166 8.29289 11.7071L2.75 17.25") },
  { id: "new", label: "Community new", icon: stroke("M12 7.75V12L14.75 14.75M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z") },
];

const ROUND_BTN = "relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[.12] text-white backdrop-blur-md transition hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const SHOW_ON_HOVER = "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100";

function LibraryCard({ item, onRecreate, onExpand, onSignup }: { item: GenjutsuItem; onRecreate: (item: GenjutsuItem) => void; onExpand: (item: GenjutsuItem) => void; onSignup: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [menu, setMenu] = useState(false);
  const [ratio, setRatio] = useState("9 / 16");
  const [playing, setPlaying] = useState(false);

  const play = () => { setPlaying(true); ref.current?.play().catch(() => undefined); };
  const stop = () => { setPlaying(false); setMenu(false); ref.current?.pause(); };

  return <article onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop} className="group relative mb-3 w-full break-inside-avoid overflow-hidden rounded-xl bg-white/[.04]" style={{ aspectRatio: ratio }}>
    <img alt="" loading="lazy" decoding="async" src={item.poster} onLoad={event => { const { naturalWidth: w, naturalHeight: h } = event.currentTarget; if (w && h) setRatio(`${w} / ${h}`); }} className="pointer-events-none absolute inset-0 size-full object-cover" />
    <video ref={ref} src={item.url} poster={item.poster} loop muted playsInline disablePictureInPicture preload="none" aria-label={item.name} className={`pointer-events-none absolute inset-0 size-full object-cover transition-opacity ${playing ? "opacity-100" : "opacity-0"}`} />
    <button type="button" aria-label={`Open ${item.name}`} onClick={() => onExpand(item)} className="absolute inset-0 z-10 cursor-pointer" />
    <div className={`pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 text-xs font-semibold text-white drop-shadow-sm ${SHOW_ON_HOVER}`}>{item.mode === "swap" ? <ObjectsSwapIcon /> : <MotionTransferIcon />}{GENJUTSU_MODES[item.mode]}</div>
    <div className={`absolute right-3 top-3 z-20 flex flex-col items-end gap-2 ${SHOW_ON_HOVER}`}>
      <button type="button" aria-label="Expand example" onClick={() => onExpand(item)} className={ROUND_BTN}><ExpandIcon className="size-4" /></button>
      <button type="button" aria-label="More options" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(value => !value)} className={ROUND_BTN}><svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="4" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="20" cy="12" r="1.5" /></svg></button>
    {menu && <div role="menu" className="absolute right-0 top-10 z-30"><button type="button" role="menuitem" onClick={() => setMenu(false)} className="flex h-10 w-32 items-center gap-2 rounded-xl border border-white/10 bg-[#2a2d30]/95 px-3 text-sm font-medium text-white shadow-xl backdrop-blur-md hover:bg-[#35393c]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.75 21V4.75m0 0h11.5l-2.5 4.25 2.5 4.25H5.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Report</button></div>}
    </div>
    <div className={`absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-2 ${SHOW_ON_HOVER}`}>
      <button type="button" aria-label="Like" onClick={onSignup} className="flex h-8 min-w-8 items-center gap-1 rounded-full border border-white/10 bg-white/[.12] px-2 text-[13px] font-semibold text-white backdrop-blur-xl"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="M15.1424 6.625C15.1424 10.5781 9.48962 13.5 8.97575 13.5C8.46188 13.5 2.80908 10.5781 2.80908 6.625C2.80908 3.875 4.52204 2.5 6.23501 2.5C7.94795 2.5 8.97575 3.53125 8.97575 3.53125C8.97575 3.53125 10.0035 2.5 11.7165 2.5C13.4295 2.5 15.1424 3.875 15.1424 6.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>{item.likes}</button>
      <button type="button" aria-label="Recreate this example" onClick={() => onRecreate(item)} className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-lime px-2.5 text-[13px] font-semibold text-black transition hover:brightness-90"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.75 7.75V4.75C7.75 4.19772 8.19772 3.75 8.75 3.75H19.25C19.8023 3.75 20.25 4.19772 20.25 4.75V15.26C20.25 15.8123 19.8023 16.26 19.25 16.26H16.25M3.75 8.75V19.25C3.75 19.8023 4.19772 20.25 4.75 20.25H15.25C15.8023 20.25 16.25 19.8023 16.25 19.25V8.75C16.25 8.19772 15.8023 7.75 15.25 7.75H4.75C4.19772 7.75 3.75 8.19772 3.75 8.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Recreate</button>
    </div>
  </article>;
}

export function GenjutsuLibraryContent({ onRecreate, onSignup }: { onRecreate: (item: GenjutsuItem) => void; onSignup: () => void }) {
  const [source, setSource] = useState<GenjutsuSource>("trending");
  const [expanded, setExpanded] = useState<GenjutsuItem | null>(null);
  const items = genjutsuItems(source);

  return <div className="flex flex-col">
    <section className="flex flex-col-reverse items-center gap-6 px-4 pb-5 pt-3 @3xl:flex-row xl:flex-row xl:justify-between xl:gap-12">
      <div className="flex w-full max-w-md flex-1 flex-col items-start gap-2.5 py-4">
        <h1 className="w-full font-grotesk text-[32px] font-bold uppercase leading-[1.1] text-white [text-shadow:0_4px_12px_rgba(21,45,59,0.08)]">Turn one video into many</h1>
        <p className="text-sm leading-5 text-white/50">Take the motion and recast it with your characters, locations, and products, or swap specific elements while keeping the rest untouched.</p>
      </div>
      <div className="relative aspect-video w-full max-w-[470px] shrink-0 overflow-hidden rounded-lg xl:order-2 xl:h-[264px] xl:w-[470px]">
        <video src={INTRO_VIDEO} poster={INTRO_POSTER} autoPlay muted loop playsInline disablePictureInPicture preload="none" aria-label="Genjutsu example video" className="size-full object-cover" />
      </div>
    </section>

    <div className="sticky top-0 z-30 flex justify-center bg-[#0f1113] px-4 py-1">
      <div role="tablist" aria-label="Preset source" className="flex h-10 gap-2 rounded-full border border-white/10 p-[3px]">
        {SOURCES.map(item => <button key={item.id} type="button" role="tab" aria-selected={source === item.id} onClick={() => setSource(item.id)} className={`flex items-center gap-1.5 rounded-full px-4 text-sm font-medium transition ${source === item.id ? "bg-white text-black" : "text-white/60 hover:text-white"}`}>{item.icon}{item.label}</button>)}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full h-5 bg-gradient-to-b from-[#0f1113] to-transparent" />
    </div>

    <div className="columns-2 gap-3 p-4 md:columns-3 xl:columns-4">
      {items.map(item => <LibraryCard key={`${source}:${item.id}`} item={item} onRecreate={onRecreate} onExpand={setExpanded} onSignup={onSignup} />)}
    </div>
    {expanded && <GenjutsuDetail item={expanded} onClose={() => setExpanded(null)} onSignup={onSignup} onRecreate={item => { setExpanded(null); onRecreate(item); }} />}
  </div>;
}
