"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GENRES, GENRE_HUES, GENRE_MEDIA, TEMPO_ITEMS, type Tempo } from "./data";
import { Flutes } from "./ui";

export const wrap = (i: number, n: number) => ((i % n) + n) % n;
const CTRL = "border border-[rgba(197,197,197,0.3)] bg-white/5 shadow-[inset_0_-0.3px_5.4px_0_rgba(185,185,185,0.35),0_20.5px_10.3px_rgba(0,0,0,0.09)] transition-[background-color,scale] duration-150 ease-out hover:bg-white/10 active:scale-95";

export function NavBtn({ dir, label, onClick }: { dir: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={`relative flex size-8 cursor-pointer items-center justify-center rounded-full ${CTRL}`}>
      <svg className="size-5 text-white" aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={dir === "left" ? "M14.5 18.25L8.25 12L14.5 5.75" : "M9.5 18.25L15.75 12L9.5 5.75"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
export const LabelPill = ({ children }: { children: ReactNode }) => (
  <div className={`relative flex h-8 min-w-24 items-center justify-center rounded-full px-4 ${CTRL}`}><span className="truncate text-[14px] font-medium text-white">{children}</span></div>
);
export const Controls = ({ label, onPrev, onNext, prevLabel, nextLabel }: { label: string; onPrev: () => void; onNext: () => void; prevLabel: string; nextLabel: string }) => (
  <div className="flex shrink-0 items-center justify-center gap-1.5 pb-4 pt-3"><NavBtn dir="left" label={prevLabel} onClick={onPrev} /><LabelPill>{label}</LabelPill><NavBtn dir="right" label={nextLabel} onClick={onNext} /></div>
);

/** Frosted frame used by every card in the film-setup carousels. */
export function FrameCard({ children, w, h, onClick }: { children: ReactNode; w: number; h: number; onClick?: () => void }) {
  return (
    <div role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} onClick={onClick} className={`relative rounded-3xl bg-[#303134] p-1 shadow-[0_-2.6px_5.2px_0_rgba(0,0,0,0.08),inset_0_-1.3px_1.3px_0_rgba(255,255,255,0.12),inset_0_1.3px_2.6px_0_rgba(0,0,0,0.04)] ${onClick ? "cursor-pointer" : ""}`} style={{ width: w, height: h }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)", mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)", padding: 1, background: "conic-gradient(rgba(255,255,255,.4) 0%,rgba(255,255,255,.12) 25%,rgba(255,255,255,.32) 50%,rgba(255,255,255,.12) 75%,rgba(255,255,255,.4) 100%)" }} />
      <div className="relative size-full overflow-hidden rounded-[20px] bg-[#4a4b4e]">
        {children}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_4px_6px_16px_0_rgba(255,255,255,0.16)]" />
      </div>
    </div>
  );
}
const Cover = ({ src, alt }: { src: string; alt: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 size-full object-cover" />
);

/** Card media: poster image (or animated gradient), plus a video that only loads and plays while the card is active. */
export function Media({ image, video, alt, active, hues }: { image?: string; video?: string; alt: string; active: boolean; hues?: [string, string, string] }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // set as a property: React does not reliably apply the muted attribute, which autoplay policies require
    if (active) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
  }, [active, video]);
  return (
    <>
      {image ? <Cover src={image} alt={alt} /> : hues ? <Flutes hues={hues} /> : null}
      {video && <video ref={ref} src={active ? video : undefined} poster={image} loop muted playsInline disablePictureInPicture preload="none" className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />}
    </>
  );
}

/** Horizontal drag: exposes fractional movement in steps and snaps to the nearest index on release. */
export function useDrag(step: number, index: number, count: number, onSnap: (i: number) => void) {
  const [drag, setDrag] = useState(0);
  const st = useRef<{ x: number; moved: boolean } | null>(null);
  const bind = {
    onPointerDown: (e: React.PointerEvent) => { st.current = { x: e.clientX, moved: false }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); },
    onPointerMove: (e: React.PointerEvent) => {
      if (!st.current) return;
      const d = e.clientX - st.current.x;
      if (Math.abs(d) > 4) st.current.moved = true;
      if (st.current.moved) setDrag(-d / step);
    },
    onPointerUp: () => {
      if (!st.current) return;
      const moved = st.current.moved;
      st.current = null;
      if (moved) onSnap(wrap(Math.round(index + drag), count));
      setDrag(0);
    },
    onClickCapture: (e: React.MouseEvent) => { if (st.current?.moved) { e.stopPropagation(); e.preventDefault(); } },
  };
  return { drag, bind };
}

export function GenreWheel({ value, onPick }: { value: string; onPick: (g: string) => void }) {
  const n = GENRES.length;
  const i = GENRES.indexOf(value);
  const { drag, bind } = useDrag(120, i, n, (k) => onPick(GENRES[k]));
  const pos = i + drag;
  return (
    <>
      <div className="relative min-h-0 flex-1 cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing" {...bind}
        onWheel={(e) => onPick(GENRES[wrap(i + (e.deltaY + e.deltaX > 0 ? 1 : -1), n)])}>
        <div aria-hidden className="pointer-events-none absolute left-1/2 rounded-full border-[0.86px] border-white/20" style={{ width: 1080, height: 1080, top: "min(579.5px, calc(45% + 457px))", transform: "translate(-50%,-50%)", background: "linear-gradient(rgba(255,255,255,.04),rgba(255,255,255,0))", boxShadow: "rgba(255,255,255,.04) 0 16px 48px 0 inset" }} />
        <div className="absolute left-1/2 size-0" style={{ top: "min(619.5px, calc(45% + 497px))", transform: "rotate(-90deg)" }}>
          {GENRES.map((g, k) => {
            let d = k - pos;
            d -= n * Math.round(d / n);
            const a = Math.abs(d);
            const opacity = a >= 2 ? 0 : 1 - 0.45 * Math.min(a, 1);
            const scale = 1 + 0.4 * Math.max(0, 1 - a);
            const t = drag ? "none" : "transform .45s cubic-bezier(.22,1,.36,1), opacity .45s";
            return (
              <div key={g} className="absolute" style={{ width: 230, height: 129, left: -115, top: -64.5, transform: `rotate(${90 + d * 45}deg) translateY(-425px)`, opacity, transition: t, pointerEvents: a < 1.5 ? "auto" : "none" }}>
                <div style={{ transform: `scale(${scale})`, transition: t }}>
                  <FrameCard w={230} h={129} onClick={a >= 0.5 ? () => onPick(g) : undefined}>
                    <Media image={GENRE_MEDIA[g]?.image} video={GENRE_MEDIA[g]?.video} alt={g} active={a < 0.5 && !drag} hues={GENRE_HUES[g]} />
                  </FrameCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10"><Controls label={value} prevLabel="Previous genre" nextLabel="Next genre" onPrev={() => onPick(GENRES[wrap(i - 1, n)])} onNext={() => onPick(GENRES[wrap(i + 1, n)])} /></div>
    </>
  );
}

function Segments({ item, active }: { item: Tempo; active: boolean }) {
  if (!item.segments) return null;
  let t = 0;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-4 bottom-3 z-10 flex gap-1">
      {item.segments.map((g, k) => {
        const delay = t;
        t += g;
        return (
          <span key={k} className="relative h-1 min-w-0 basis-0 overflow-hidden rounded-full bg-white/30" style={{ flexGrow: g }}>
            <span key={String(active)} className="absolute inset-y-0 left-0 w-full origin-left bg-[#d1fe17]" style={{ transform: "scaleX(0)", animation: active ? `cs-fill ${g}s linear ${delay}s forwards` : undefined }} />
          </span>
        );
      })}
    </div>
  );
}

export function TempoWheel({ value, onPick }: { value: string; onPick: (t: string) => void }) {
  const n = TEMPO_ITEMS.length;
  const i = TEMPO_ITEMS.findIndex((t) => t.name === value);
  const { drag, bind } = useDrag(300, i, n, (k) => onPick(TEMPO_ITEMS[k].name));
  const lock = useRef(0);
  const t = drag ? "none" : "transform .45s cubic-bezier(.22,1,.36,1), scale .45s, opacity .45s";
  return (
    <>
      <div className="relative -mx-3 min-h-0 flex-1">
        <div role="listbox" aria-orientation="horizontal" tabIndex={0} className="relative size-full cursor-grab touch-none select-none overflow-hidden outline-none active:cursor-grabbing" {...bind}
          onWheel={(e) => { const now = Date.now(); if (now - lock.current < 280) return; lock.current = now; onPick(TEMPO_ITEMS[wrap(i + (e.deltaY + e.deltaX > 0 ? 1 : -1), n)].name); }}>
          {[-3, -2, -1, 0, 1, 2, 3].map((off) => {
            // Items repeat modularly around the selection, so Dynamic/Calm show on both sides of Auto like the original.
            const item = TEMPO_ITEMS[wrap(i + off, n)];
            const dist = off - drag;
            const abs = Math.min(Math.abs(dist), 1);
            const sel = off === 0;
            return (
              <div key={off} role="option" aria-selected={sel} className="absolute inset-y-0 left-1/2 flex items-center justify-center" style={{ width: 300, marginLeft: -150, transform: `translateX(${dist * 300}px)`, transition: t }}>
                <div style={{ width: 330, height: 190, scale: 1 - 0.32 * abs, opacity: 1 - 0.25 * abs, transition: t }}>
                  <FrameCard w={330} h={190} onClick={!sel ? () => onPick(item.name) : undefined}>
                    <Media image={item.image} video={item.video} alt={item.name} active={sel && !drag} />
                    <Segments item={item} active={sel} />
                  </FrameCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Controls label={value} prevLabel="Previous tempo" nextLabel="Next tempo" onPrev={() => onPick(TEMPO_ITEMS[wrap(i - 1, n)].name)} onNext={() => onPick(TEMPO_ITEMS[wrap(i + 1, n)].name)} />
    </>
  );
}
