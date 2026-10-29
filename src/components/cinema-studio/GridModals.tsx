"use client";
import { useMemo, useRef, useState } from "react";
import { LIGHTING, PALETTES, type LightingPreset } from "./data";
import { LightingEditor, lightsThumb, newLight, type Light } from "./LightingEditor";
import { Modal, Toolbar } from "./ui";

function Header({ title, sub, search, setSearch, sort, setSort, sorts }: { title: string; sub: string } & React.ComponentProps<typeof Toolbar>) {
  return (
    <div className="flex items-start justify-between px-5 pt-4">
      <div><h3 className="text-[15px] font-semibold text-white">{title}</h3><p className="text-[13px] text-[#8d8e93]">{sub}</p></div>
      <Toolbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} sorts={sorts} />
    </div>
  );
}

type Palette = { name: string; image?: string; colors: string[] };
const SCROLL_FADE = "linear-gradient(rgba(0, 0, 0, 0) -1px, rgba(0, 0, 0, 0.08) 6.48px, rgba(0, 0, 0, 0.28) 13.68px, rgba(0, 0, 0, 0.58) 22.32px, rgba(0, 0, 0, 0.85) 29.52px, black 36px, black calc(100% - 36px), rgba(0, 0, 0, 0.85) calc(100% - 29.52px), rgba(0, 0, 0, 0.58) calc(100% - 22.32px), rgba(0, 0, 0, 0.28) calc(100% - 13.68px), rgba(0, 0, 0, 0.08) calc(100% - 6.48px), rgba(0, 0, 0, 0) calc(100% + 1px))";
const NEUTRAL = ["12,12,12", "30,30,31", "48,48,50", "66,66,68", "84,84,87", "102,102,106", "120,120,125", "138,138,143", "156,156,161", "174,174,180", "198,198,204", "222,222,228"].map((c) => `rgb(${c})`);

export function PaletteModal({ value, onPick, onClose }: { value: string | null; onPick: (v: string | null) => void; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Default");
  const [custom, setCustom] = useState<Palette[]>([]);
  const list = useMemo(() => {
    const l = [...PALETTES, ...custom].filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return sort === "A–Z" ? [...l].sort((a, b) => a.name.localeCompare(b.name)) : l;
  }, [custom, search, sort]);
  const add = () => {
    const name = window.prompt("Name your palette")?.trim();
    if (!name) return;
    setCustom((c) => [...c, { name, colors: NEUTRAL }]);
    onPick(name);
  };
  return (
    <Modal title="Color palette" onClose={onClose} onReset={() => onPick(null)} contentHeight={452}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white/5 p-3">
        <div className="flex shrink-0 items-start gap-2 px-1 pb-3 pt-1">
          <div className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-[14px] font-medium text-white">Set up color palette</span><span className="text-[12px] text-[#8d8e93]">Palette the color grade should follow</span></div>
          <Toolbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} sorts={["Default", "A–Z"]} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ maskImage: SCROLL_FADE, WebkitMaskImage: SCROLL_FADE }}>
          <div className="grid gap-3 pb-1" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}>
            <button type="button" onClick={add} className="group/new flex cursor-pointer flex-col items-center gap-2">
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),inset_0_-0.298px_5.356px_rgba(185,185,185,0.35)] transition-[background-color] duration-150 ease-out group-hover/new:bg-white/[0.08]">
                <span className="flex size-7 min-w-7 items-center justify-center rounded-full border border-[rgba(197,197,197,0.3)] bg-white/5 p-1.5 text-white shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_-0.298px_5.356px_rgba(185,185,185,0.35)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 5.25V12m0 0v6.75M12 12H5.25M12 12h6.75" /></svg>
                </span>
              </div>
              <span className="w-full truncate text-center text-[12px] font-medium text-white">New palette</span>
            </button>
            {list.map((p) => {
              const sel = p.name === value;
              return (
                <div key={p.name} className="min-w-0">
                  <div role="button" tabIndex={0} aria-pressed={sel} onClick={() => onPick(sel ? null : p.name)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(sel ? null : p.name); } }} className="group/card flex cursor-pointer flex-col items-center gap-2">
                    <div className={`relative flex aspect-video w-full flex-col overflow-hidden rounded-xl transition-shadow ${sel ? "ring-2 ring-white" : ""}`}>
                      <div className="relative min-h-0 w-full flex-1 overflow-hidden" style={{ backgroundColor: p.colors[11] }}>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${p.colors.join(", ")})` }} />
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={p.name} loading="lazy" decoding="async" draggable={false} src={p.image} className="absolute inset-0 size-full object-cover" />
                        )}
                      </div>
                      <div className="flex w-full" style={{ height: 22 }}>{p.colors.map((c, k) => <span key={k} className="min-w-0 flex-1" style={{ backgroundColor: c }} />)}</div>
                    </div>
                    <span className={`w-full truncate text-center text-[12px] transition-colors duration-150 ${sel ? "font-medium text-white" : "text-[#8d8e93] group-hover/card:text-white"}`}>{p.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {!list.length && <p className="py-10 text-center text-sm text-[#8d8e93]">No palettes found</p>}
        </div>
      </div>
    </Modal>
  );
}

/** Preset card: still image with the video fading in on hover; saved custom presets fall back to their CSS thumbnail. */
function LightCard({ preset, sel, onPick }: { preset: LightingPreset; sel: boolean; onPick: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [hot, setHot] = useState(false);
  const enter = () => { setHot(true); const v = ref.current; if (v) { v.muted = true; v.play().catch(() => {}); } };
  const leave = () => { setHot(false); const v = ref.current; if (v) { v.pause(); v.currentTime = 0; } };
  return (
    <div role="button" tabIndex={0} aria-pressed={sel} onClick={onPick} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(); } }} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave} className="group/card flex cursor-pointer flex-col items-center gap-2 outline-none">
      <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-[#4a4b4e] transition-[filter] duration-150 ease-out group-hover/card:brightness-125 ${sel ? "ring-2 ring-white" : ""}`} style={preset.css ? { background: preset.css } : undefined}>
        {preset.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={preset.name} loading="lazy" decoding="async" draggable={false} src={preset.image} className="absolute inset-0 size-full object-cover" />
        )}
        {preset.video && <video ref={ref} src={preset.video} poster={preset.image} loop muted playsInline disablePictureInPicture preload="none" className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${hot ? "opacity-100" : "opacity-0"}`} />}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_4px_6px_16px_0_rgba(255,255,255,0.3)]" />
      </div>
      <span className="w-full truncate text-center text-[12px] font-medium text-white">{preset.name}</span>
    </div>
  );
}

export function LightingModal({ value, onPick, onClose }: { value: string; onPick: (v: string) => void; onClose: () => void }) {
  const [view, setView] = useState<"grid" | "editor">("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Default");
  const [custom, setCustom] = useState<LightingPreset[]>([]);
  const [lights, setLights] = useState<Light[]>([newLight()]);
  const list = useMemo(() => {
    const l = [...LIGHTING, ...custom].filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return sort === "A–Z" ? [...l].sort((a, b) => a.name.localeCompare(b.name)) : l;
  }, [custom, search, sort]);
  const save = () => {
    const name = window.prompt("Name your lighting preset")?.trim();
    if (!name) return;
    setCustom((c) => [...c, { name, css: lightsThumb(lights) }]);
    onPick(name);
    setView("grid");
  };
  if (view === "editor") {
    return (
      <Modal title="New lighting preset" onClose={onClose} onBack={() => setView("grid")} onReset={() => setLights([newLight()])} contentHeight={452}>
        <LightingEditor lights={lights} setLights={setLights} onApply={() => { onPick("Custom"); onClose(); }} onSave={save} />
      </Modal>
    );
  }
  return (
    <Modal title="Lighting" onClose={onClose} onReset={() => onPick("Auto")}>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Set up lighting" sub="Pick a scheme or place your own lights" search={search} setSearch={setSearch} sort={sort} setSort={setSort} sorts={["Default", "A–Z"]} />
        <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-x-5 gap-y-3 overflow-y-auto px-5 pb-6 pt-4">
          <button type="button" onClick={() => setView("editor")} className="group/card flex cursor-pointer flex-col items-center gap-2">
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-white/5 shadow-[inset_0_-0.298px_5.356px_0_rgba(185,185,185,0.35),0_0_0_1px_rgba(255,255,255,0.02)] transition-colors duration-150 ease-out group-hover/card:bg-white/10">
              <span className="flex size-8 items-center justify-center rounded-full border border-[#c5c5c5]/30 bg-white/5 shadow-[0_20.533px_20.533px_0_rgba(0,0,0,0.09),inset_0_-0.298px_5.356px_0_rgba(185,185,185,0.35)]">
                <svg className="size-4 shrink-0 text-white" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6.75V12M12 12V17.25M12 12H6.75M12 12H17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </span>
            </div>
            <span className="w-full truncate text-center text-[12px] font-medium text-white">New lighting preset</span>
          </button>
          {list.map((l) => <LightCard key={l.name} preset={l} sel={l.name === value} onPick={() => onPick(l.name)} />)}
        </div>
      </div>
    </Modal>
  );
}
