"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { ERAS, ERA_HUES, ERA_MEDIA, GENRES, TEMPOS } from "./data";
import { FrameCard, GenreWheel, Media, NavBtn, TempoWheel, useDrag, wrap } from "./film-wheels";
import { DEFAULT_SETUP, type Setup } from "./state";
import { Modal } from "./ui";

type Tab = "genre" | "era" | "tempo";
const ico = (d: ReactNode) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="size-5 shrink-0">{d}</svg>;
// Tab icons are the original SVGs from the Film setup markup.
const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "genre", label: "Genre", icon: ico(<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.5 5.75h2.75a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1H17.5m-11 0H3.75a1 1 0 0 1-1-1V6.75a1 1 0 0 1 1-1H6.5m10-2h-9a1 1 0 0 0-1 1v14.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4.75a1 1 0 0 0-1-1" />) },
  { id: "era", label: "Era", icon: ico(<><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M4.75 2.75h14.5M4.75 21.25h14.5M5.75 3v3.75c0 2.645 1.956 4.886 4.5 5.25M5.75 21v-3.75c0-2.644 1.955-4.885 4.498-5.25M18.25 3v3.75c0 2.645-1.956 4.886-4.5 5.25M18.248 21v-3.75c0-2.644-1.955-4.885-4.498-5.25" /><path fill="currentColor" d="M15.351 19H8.65A.65.65 0 0 1 8 18.351c0-.794.54-1.486 1.31-1.679L12 16l2.69.672a1.73 1.73 0 0 1 1.31 1.68c0 .357-.29.648-.649.648" /></>) },
  { id: "tempo", label: "Tempo", icon: ico(<><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 11.75v-7a1 1 0 0 0-1-1H4.75a1 1 0 0 0-1 1v14.5a1 1 0 0 0 1 1h7" /><path stroke="currentColor" strokeWidth="1.5" d="M4 8.75h16M8.25 8.75l2-5M13.75 8.75l2-5" /><path fill="currentColor" d="m19.24 16.185-.696-1.812a.582.582 0 0 0-1.088 0l-.697 1.812a1 1 0 0 1-.574.575l-1.812.696a.582.582 0 0 0 0 1.088l1.812.697a1 1 0 0 1 .575.574l.696 1.812a.582.582 0 0 0 1.088 0l.697-1.812a1 1 0 0 1 .574-.575l1.812-.696a.582.582 0 0 0 0-1.088l-1.812-.697a1 1 0 0 1-.575-.574" /></>) },
];
const TITLES: Record<Tab, [string, string]> = {
  genre: ["Select genre", "Story conventions the model should follow"],
  era: ["Select era", "The period the film belongs to"],
  tempo: ["Select tempo", "Pacing of the montage"],
};
const DEFAULTS: Record<Tab, string> = { genre: DEFAULT_SETUP.genre, era: "Auto", tempo: "Auto" };
const LISTS: Record<Tab, string[]> = { genre: GENRES, era: ERAS, tempo: TEMPOS };

const TICK = 15; // 2px tick + 13px gap
const PER = 4;

function EraPicker({ value, onPick }: { value: string; onPick: (v: string) => void }) {
  const n = ERAS.length;
  const i = ERAS.indexOf(value);
  const left = ERAS[wrap(i + 1, n)]; // timeline reads newest (left) to oldest (right)
  const right = ERAS[wrap(i - 1, n)];
  // Dragging right reveals newer eras (lower index), hence the negative step.
  const { drag, bind } = useDrag(-PER * TICK, i, n, (k) => onPick(ERAS[k]));
  const shift = (12 + (i + drag) * PER) * TICK + 1;
  return (
    <div className="flex min-h-0 flex-1 select-none flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-center"><FrameCard w={330} h={190}><Media key={value} image={ERA_MEDIA[value]?.image} video={ERA_MEDIA[value]?.video} alt={value} active={!drag} hues={ERA_HUES} /></FrameCard></div>
      <div className="relative -mx-3 mb-4 h-10 cursor-grab touch-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)] active:cursor-grabbing" {...bind}
        onWheel={(e) => onPick(ERAS[wrap(i + (e.deltaY > 0 ? -1 : 1), n)])}>
        <div className="absolute left-1/2 top-0 flex items-end gap-[13px]" style={{ transform: `translateX(${-shift}px)`, transition: drag ? "none" : "transform .35s cubic-bezier(.22,1,.36,1)" }}>
          {Array.from({ length: n * PER + 24 }).map((_, k) => {
            const idx = k - 12;
            const cur = idx === i * PER;
            return <i key={k} onClick={() => idx >= 0 && idx < n * PER && onPick(ERAS[Math.round(idx / PER)])} className={`cs-tick block w-[2px] shrink-0 rounded-full ${cur ? "h-10 bg-[#d1fe17]" : idx % PER === 0 ? "h-6 bg-white/30" : "h-3.5 bg-white/20"}`} />;
          })}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-center gap-5 pb-4">
        <button onClick={() => onPick(left)} className="w-24 text-right text-[19px] font-bold text-white/35 transition hover:text-white/70">{left}</button>
        <NavBtn dir="left" label="Newer era" onClick={() => onPick(left)} />
        <span className="min-w-[110px] text-center text-[30px] font-bold leading-none text-[#d1fe17]">{value}</span>
        <NavBtn dir="right" label="Older era" onClick={() => onPick(right)} />
        <button onClick={() => onPick(right)} className="w-24 text-left text-[19px] font-bold text-white/35 transition hover:text-white/70">{right}</button>
      </div>
    </div>
  );
}

export function FilmSetupModal({ tab, setTab, setup, update, onClose }: { tab: Tab; setTab: (t: Tab) => void; setup: Setup; update: (p: Partial<Setup>) => void; onClose: () => void }) {
  const ref = useRef({ tab, setup });
  ref.current = { tab, setup };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const { tab: t, setup: s } = ref.current;
      const list = LISTS[t];
      const cur = list.indexOf(s[t]);
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) update({ [t]: list[wrap(cur + (t === "era" ? -dir : dir), list.length)] });
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [update]);

  const header = (
    <div className="flex min-w-0 flex-col gap-1"><span className="text-[14px] font-medium text-white">{TITLES[tab][0]}</span><span className="text-[12px] text-[#8d8e93]">{TITLES[tab][1]}</span></div>
  );
  return (
    <Modal title="Film setup" onClose={onClose} onReset={() => update({ genre: DEFAULTS.genre, era: DEFAULTS.era, tempo: DEFAULTS.tempo })} contentHeight={452}>
      <div role="tablist" className="flex h-full w-[184px] shrink-0 flex-col gap-0.5 bg-white/5 p-3">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg py-2 pl-2 pr-3 transition-[background-color,color] duration-150 ${tab === t.id ? "bg-white/5 text-white" : "text-[#8d8e93] hover:bg-white/5 hover:text-white"}`}>
            {t.icon}<span className="min-w-0 flex-1 truncate text-left text-[14px] font-medium">{t.label}</span>
            {setup[t.id] !== DEFAULTS[t.id] && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[#d1fe17]" />}
          </button>
        ))}
      </div>
      {tab === "genre" ? (
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white/5">
          <div className="z-10 px-4 pt-4">{header}</div>
          <GenreWheel value={setup.genre} onPick={(genre) => update({ genre })} />
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white/5 p-3">
          <div className="px-1 pt-1">{header}</div>
          {tab === "era" ? <EraPicker value={setup.era} onPick={(era) => update({ era })} /> : (
            <div className="flex min-h-0 flex-1 select-none flex-col"><TempoWheel value={setup.tempo} onPick={(tempo) => update({ tempo })} /></div>
          )}
        </div>
      )}
    </Modal>
  );
}
