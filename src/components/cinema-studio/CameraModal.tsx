"use client";
import { useMemo, useRef, useState } from "react";
import { CAMERA_ITEMS, MOVEMENTS, type CameraCol, type Movement as Move } from "./data";
import { wrap } from "./film-wheels";
import type { Setup } from "./state";
import { Modal, Toolbar } from "./ui";

const COLS: { id: CameraCol; label: string }[] = [{ id: "camera", label: "CAMERA" }, { id: "lens", label: "LENS" }, { id: "aperture", label: "APERTURE" }];
const STEP = 120;
const FADE = "linear-gradient(transparent 0px, rgba(0, 0, 0, 0.08) 27px, rgba(0, 0, 0, 0.28) 57px, rgba(0, 0, 0, 0.58) 93px, rgba(0, 0, 0, 0.85) 123px, black 150px, black calc(100% - 150px), rgba(0, 0, 0, 0.85) calc(100% - 123px), rgba(0, 0, 0, 0.58) calc(100% - 93px), rgba(0, 0, 0, 0.28) calc(100% - 57px), rgba(0, 0, 0, 0.08) calc(100% - 27px), transparent 100%)";
const BTN_RING = "linear-gradient(rgba(197, 197, 197, 0.3) 30%, rgba(129, 129, 129, 0.5) 50%, rgba(255, 255, 255, 0.035) 75%)";
const BTN_MASK = "linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0px) content-box exclude, linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0px)";

function WheelBtn({ label, up, onClick }: { label: string; up?: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="relative flex h-6 w-10 cursor-pointer items-center justify-center rounded-full shadow-[inset_0_-0.3px_5.4px_0_rgba(185,185,185,0.35)] mix-blend-luminosity backdrop-blur-[2px] transition-[background-color,scale] duration-150 ease-out hover:bg-white/[0.08] active:scale-[.96]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ mask: BTN_MASK, WebkitMask: BTN_MASK, padding: 1, background: BTN_RING }} />
      <svg className={`size-3.5 text-white${up ? " rotate-180" : ""}`} aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.75 9.5L12 15.75L18.25 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}

function Column({ id, label, value, onPick }: { id: CameraCol; label: string; value: string; onPick: (v: string) => void }) {
  const items = CAMERA_ITEMS[id];
  const n = items.length;
  const i = Math.max(0, items.findIndex((it) => it.name === value));
  const { drag, bind } = useVDrag(STEP, i, n, (k) => onPick(items[k].name));
  const lock = useRef(0);
  const go = (d: number) => onPick(items[wrap(i + d, n)].name);
  const t = drag ? "none" : "transform .35s cubic-bezier(.22,1,.36,1)";
  return (
    <div className="group/wheel relative flex min-w-0 flex-col items-center pt-2">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/[0.04] opacity-0 transition-opacity duration-200 group-hover/wheel:opacity-100" />
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-wide text-[#8d8e93]">{label}</span>
      <div className="relative min-h-0 w-full flex-1">
        <div role="listbox" tabIndex={0} aria-orientation="vertical" className="relative size-full cursor-grab select-none overflow-hidden outline-none active:cursor-grabbing" style={{ touchAction: "none", maskImage: FADE, WebkitMaskImage: FADE }} {...bind}
          onWheel={(e) => { const now = Date.now(); if (now - lock.current < 220) return; lock.current = now; go(e.deltaY > 0 ? 1 : -1); }}
          onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); go(1); } else if (e.key === "ArrowUp") { e.preventDefault(); go(-1); } }}>
          {[-3, -2, -1, 0, 1, 2, 3].map((off) => {
            const item = items[wrap(i + off, n)];
            const sel = off === 0;
            return (
              <div key={off} role="option" aria-selected={sel} {...(sel ? { "data-selected": "true" } : {})} onClick={() => !sel && go(off)} className="group/wheel-row absolute inset-x-0 top-1/2 -mt-[60px] flex items-center justify-center" style={{ height: STEP, transform: `translateY(${(off - drag) * STEP}px)`, transition: t }}>
                <div className={`relative flex h-[calc(120px-20px)] w-[156px] max-w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-full ring-[1.5px] ring-inset transition-opacity duration-150 ${sel ? "opacity-100 ring-white" : "opacity-60 ring-white/30"}`}>
                  {item.image ? (
                    <>
                      <div className="absolute inset-1.5 overflow-hidden rounded-[inherit]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={item.name} loading="eager" decoding="async" draggable={false} src={item.image} className="absolute inset-0 size-full object-cover" />
                        <div className="absolute inset-0 bg-black/25" />
                      </div>
                      <span className="absolute inset-x-0 bottom-3 truncate px-3 text-center text-xs font-medium text-white">{item.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-1.5 rounded-[inherit] bg-white/10" />
                      <div className="relative flex size-8 items-center justify-center text-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" draggable={false} className="size-full object-contain" src={item.auto} />
                      </div>
                      <span className="relative max-w-full truncate px-3 text-xs font-medium text-white">{item.name}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center"><div className="pointer-events-auto opacity-0 transition-opacity duration-150 group-hover/wheel:opacity-100"><WheelBtn label="Previous" up onClick={() => go(-1)} /></div></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center"><div className="pointer-events-auto opacity-0 transition-opacity duration-150 group-hover/wheel:opacity-100"><WheelBtn label="Next" onClick={() => go(1)} /></div></div>
      </div>
    </div>
  );
}

/** Vertical drag: exposes fractional movement in steps and snaps to the nearest index on release. */
function useVDrag(step: number, index: number, count: number, onSnap: (i: number) => void) {
  const [drag, setDrag] = useState(0);
  const st = useRef<{ y: number; moved: boolean } | null>(null);
  const bind = {
    onPointerDown: (e: React.PointerEvent) => { st.current = { y: e.clientY, moved: false }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); },
    onPointerMove: (e: React.PointerEvent) => {
      if (!st.current) return;
      const d = e.clientY - st.current.y;
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

const MOVE_FADE = "linear-gradient(black 0px, black calc(100% - 36px), rgba(0, 0, 0, 0.85) calc(100% - 29.52px), rgba(0, 0, 0, 0.58) calc(100% - 22.32px), rgba(0, 0, 0, 0.28) calc(100% - 13.68px), rgba(0, 0, 0, 0.08) calc(100% - 6.48px), rgba(0, 0, 0, 0) calc(100% + 1px))";

/** Move preview: the video only loads and plays while the card is hovered or focused. */
function MoveCard({ move, onPut }: { move: Move; onPut: (name: string) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const play = () => { const v = ref.current; if (!v) return; v.muted = true; v.play().catch(() => {}); };
  const stop = () => { const v = ref.current; if (!v) return; v.pause(); v.currentTime = 0; };
  return (
    <button type="button" onClick={() => onPut(move.name)} onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop} className="group flex cursor-pointer flex-col items-center gap-2">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.04] bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-[border-color] duration-150 group-hover:border-white/15">
        <video ref={ref} src={move.video} poster={move.poster} loop muted playsInline disablePictureInPicture preload="none" aria-label={move.name} className="size-full object-cover" />
        <span className="pointer-events-none absolute inset-x-2 bottom-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="block w-full rounded-full bg-[#d1fe17] py-1 text-[12px] font-semibold text-black shadow-[0_4px_12px_rgba(0,0,0,0.4)]">Put on prompt</span>
        </span>
      </div>
      <span className="w-full truncate text-center text-[12px] font-medium text-white">{move.name}</span>
    </button>
  );
}

function Movement({ onPut }: { onPut: (name: string) => void }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Default");
  const list = useMemo(() => {
    const l = MOVEMENTS.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    const by = (a: Move, b: Move) => a.name.localeCompare(b.name);
    return sort === "A–Z" ? [...l].sort(by) : sort === "Z–A" ? [...l].sort((a, b) => by(b, a)) : l;
  }, [search, sort]);
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-3">
      <div className="mb-3 flex shrink-0 items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-white">Direct a camera move</h3>
          <p className="text-[13px] leading-[1.35] text-[#8d8e93]">Adds to the prompt box, or type <b className="text-[#d1fe17]">#</b> there.<br />Several per shot; order matters.</p>
        </div>
        <Toolbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} sorts={["Default", "A–Z", "Z–A"]} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ maskImage: MOVE_FADE, WebkitMaskImage: MOVE_FADE }}>
        <div className="grid grid-cols-4 gap-x-2 gap-y-3 pb-1">
          {list.map((m) => <MoveCard key={m.name} move={m} onPut={onPut} />)}
        </div>
        {!list.length && <p className="py-10 text-center text-sm text-[#8d8e93]">No movements found</p>}
      </div>
    </div>
  );
}

const TAB_ON = "bg-white/5 text-white";
const TAB_OFF = "text-[#8d8e93] hover:bg-white/5 hover:text-white";
const TAB_ICONS = {
  setup: <svg className="size-5 shrink-0" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 4.75C2.75 4.19772 3.19772 3.75 3.75 3.75H20.25C20.8023 3.75 21.25 4.19772 21.25 4.75V19.25C21.25 19.8023 20.8023 20.25 20.25 20.25H3.75C3.19772 20.25 2.75 19.8023 2.75 19.25V4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M15.25 12C15.25 13.7949 13.7949 15.25 12 15.25C10.2051 15.25 8.75 13.7949 8.75 12C8.75 10.2051 10.2051 8.75 12 8.75C13.7949 8.75 15.25 10.2051 15.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M17.5 7.5V7.49M17.75 7.5C17.75 7.63807 17.6381 7.75 17.5 7.75C17.3619 7.75 17.25 7.63807 17.25 7.5C17.25 7.36193 17.3619 7.25 17.5 7.25C17.6381 7.25 17.75 7.36193 17.75 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  movement: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 5.5 2.47-2.47a.75.75 0 0 1 1.06 0L15 5.5M5.5 9l-2.47 2.47a.75.75 0 0 0 0 1.06L5.5 15m13-6 2.47 2.47a.75.75 0 0 1 0 1.06L18.5 15M15 18.5l-2.47 2.47a.75.75 0 0 1-1.06 0L9 18.5M12 4v8m0 0v8m0-8H4m8 0h8" /></svg>,
};

export function CameraModal({ tab, setTab, setup, update, onPut, onClose }: { tab: "setup" | "movement"; setTab: (t: "setup" | "movement") => void; setup: Setup; update: (p: Partial<Setup>) => void; onPut: (n: string) => void; onClose: () => void }) {
  const TabBtn = ({ id, label }: { id: "setup" | "movement"; label: string }) => (
    <button type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg py-2 pl-2 pr-3 transition-[background-color,color] duration-150 ease-out ${tab === id ? TAB_ON : TAB_OFF}`}>
      {TAB_ICONS[id]}
      <span className="min-w-0 flex-1 truncate text-left text-[14px] font-medium">{label}</span>
      {id === "setup" && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#d1fe17]" />}
    </button>
  );
  return (
    <Modal title="Camera" onClose={onClose} onReset={() => update({ camera: "Auto", lens: "Auto", aperture: "Auto" })} contentHeight={452}>
      <div role="tablist" className="flex h-full w-[184px] shrink-0 flex-col gap-0.5 bg-white/5 p-3">
        <TabBtn id="setup" label="Setup" />
        <TabBtn id="movement" label="Movement" />
      </div>
      {tab === "setup" ? (
        <div className="relative grid min-w-0 flex-1 overflow-hidden bg-white/5" style={{ height: 452, gridTemplateColumns: "repeat(3, minmax(0px, 1fr))" }}>
          {COLS.map((c) => <Column key={c.id} id={c.id} label={c.label} value={setup[c.id]} onPick={(v) => update({ [c.id]: v })} />)}
        </div>
      ) : <Movement onPut={onPut} />}
    </Modal>
  );
}
