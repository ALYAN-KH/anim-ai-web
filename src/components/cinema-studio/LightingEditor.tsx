"use client";
import { useId, useRef, useState } from "react";

const STATIC = "https://static.higgsfield.ai/public/cinematic/v40/";
const R = 100; // handle travel in px: half the 200px globe ellipses
const SLABS = Array.from({ length: 23 }, (_, k) => 11 - k); // translateZ 11 .. -11, the box body

export type Vec = [number, number, number];
export interface Light { color: string; brightness: number; diffuse: number; v: Vec }
export const newLight = (): Light => ({ color: "#FFFFFF", brightness: 50, diffuse: 50, v: [0, 0, 1] });

const QUICK: { name: string; v: Vec }[] = [
  { name: "Top", v: [0, 1, 0] }, { name: "Front", v: [0, 0, 1] },
  { name: "Right", v: [1, 0, 0] }, { name: "Left", v: [-1, 0, 0] },
  { name: "Back", v: [0, 0, -1] }, { name: "Bottom", v: [0, -1, 0] },
];
const same = (a: Vec, b: Vec) => a.every((n, i) => Math.abs(n - b[i]) < 0.02);
const quickName = (v: Vec) => QUICK.find((q) => same(q.v, v))?.name.toLowerCase() ?? "custom";
const rgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`; };

/** CSS thumbnail for a saved preset: a glow of the first light's colour placed where the light sits. */
export const lightsThumb = (lights: Light[]) => {
  const glows = lights.map((l) => `radial-gradient(circle at ${50 + l.v[0] * 38}% ${50 - l.v[1] * 38}%, rgba(${rgb(l.color)}, ${0.35 + l.brightness / 160}) 0, transparent ${30 + l.diffuse * 0.5}%)`);
  return [...glows, "linear-gradient(135deg,#2a2b2e,#141516)"].join(",");
};

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const at = (x: number) => { const r = ref.current!.getBoundingClientRect(); onChange(Math.round(Math.min(1, Math.max(0, (x - r.left) / r.width)) * 100)); };
  return (
    <div ref={ref} role="slider" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} tabIndex={0}
      onPointerDown={(e) => { e.stopPropagation(); drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e.clientX); }}
      onPointerMove={(e) => drag.current && at(e.clientX)}
      onPointerUp={() => { drag.current = false; }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") onChange(Math.min(100, value + 5)); else if (e.key === "ArrowLeft") onChange(Math.max(0, value - 5)); }}
      className="relative h-8 w-full shrink-0 cursor-ew-resize touch-none select-none overflow-hidden rounded-lg bg-white/5">
      <div className="absolute inset-y-0 left-0 rounded-lg bg-white/10" style={{ width: `${value}%` }} />
      <div className="absolute top-2 h-4 w-0.5 rounded-full bg-white" style={{ left: "clamp(4px, calc(" + value + "% - 6px), calc(100% - 6px))" }} />
      <div className="relative flex h-full items-center justify-between gap-2 px-2">
        <span className="min-w-0 truncate text-[12px] font-medium text-[#8d8e93]">{label}</span>
        <span className="shrink-0 text-right text-[12px] font-medium text-white">{value}%</span>
      </div>
    </div>
  );
}

/** The 3D light fixture: a stack of slabs that always turns its face toward the globe centre. */
function Fixture({ light }: { light: Light }) {
  const az = (Math.atan2(light.v[0], light.v[2]) * 180) / Math.PI;
  const el = (Math.asin(Math.max(-1, Math.min(1, light.v[1]))) * 180) / Math.PI;
  const glow = `radial-gradient(circle, rgba(${rgb(light.color)}, ${(light.brightness / 100) * 0.848}), transparent ${44 + light.diffuse * 0.56}%)`;
  const slab = `${glow}, linear-gradient(rgb(74, 75, 77) 0%, rgb(58, 59, 61) 45%, rgb(42, 43, 45) 100%)`;
  return (
    <div className="absolute left-1/2 top-1/2 z-[2]" style={{ transform: "translate(-50%, -50%)", perspective: 650 }}>
      <div className="relative" style={{ width: 116, height: 86, transformStyle: "preserve-3d", transform: `rotateX(${-el - 10}deg) rotateY(${-az - 20}deg)`, transition: "transform .2s ease-out" }}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(12px)", borderRadius: 14, background: "rgb(67, 68, 70)", boxShadow: "rgba(185, 185, 185, 0.35) 0px -0.27px 5.5px 0px inset" }}>
          <svg className="size-5 text-white/60" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3 4.75C3 3.7835 3.7835 3 4.75 3H19.25C20.2165 3 21 3.7835 21 4.75V19.25C21 20.2165 20.2165 21 19.25 21H4.75C3.7835 21 3 20.2165 3 19.25V4.75ZM4.75 4.5C4.61193 4.5 4.5 4.61193 4.5 4.75V14.4393L6.76256 12.1768C7.44598 11.4934 8.55402 11.4934 9.23744 12.1768L16.5607 19.5H19.25C19.3881 19.5 19.5 19.3881 19.5 19.25V4.75C19.5 4.61193 19.3881 4.5 19.25 4.5H4.75ZM14.4393 19.5L8.17678 13.2374C8.07915 13.1398 7.92085 13.1398 7.82322 13.2374L4.5 16.5607V19.25C4.5 19.3881 4.61193 19.5 4.75 19.5H14.4393Z" fill="currentColor" /><path d="M13.4255 8.53727C13.4738 8.51308 13.5131 8.47385 13.5373 8.42546L14.2764 6.94721C14.3685 6.76295 14.6315 6.76295 14.7236 6.94721L15.4627 8.42546C15.4869 8.47385 15.5262 8.51308 15.5745 8.53727L17.0528 9.27639C17.237 9.36852 17.237 9.63148 17.0528 9.72361L15.5745 10.4627C15.5262 10.4869 15.4869 10.5262 15.4627 10.5745L14.7236 12.0528C14.6315 12.237 14.3685 12.237 14.2764 12.0528L13.5373 10.5745C13.5131 10.5262 13.4738 10.4869 13.4255 10.4627L11.9472 9.72361C11.763 9.63148 11.763 9.36852 11.9472 9.27639L13.4255 8.53727Z" fill="currentColor" /></svg>
          <div aria-hidden="true" className="absolute inset-0 mix-blend-screen" style={{ background: glow, borderRadius: 14 }} />
        </div>
        <div aria-hidden="true" className="absolute inset-0" style={{ transform: "rotateY(180deg) translateZ(12px)", borderRadius: 14, background: "rgb(47, 48, 50)" }}>
          <div className="absolute inset-0 mix-blend-screen" style={{ background: glow, borderRadius: 14 }} />
        </div>
        {SLABS.map((z) => <div key={z} aria-hidden="true" className="absolute inset-0" style={{ borderRadius: 14, background: slab, transform: `translateZ(${z}px)` }} />)}
      </div>
    </div>
  );
}

export function LightingEditor({ lights, setLights, onApply, onSave }: { lights: Light[]; setLights: (l: Light[]) => void; onApply: () => void; onSave: () => void }) {
  const [active, setActive] = useState(0);
  const uid = useId().replace(/:/g, "");
  const stage = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const cur = lights[Math.min(active, lights.length - 1)];
  const idx = Math.min(active, lights.length - 1);
  const patch = (p: Partial<Light>) => setLights(lights.map((l, i) => (i === idx ? { ...l, ...p } : l)));

  const aim = (cx: number, cy: number) => {
    const r = stage.current!.getBoundingClientRect();
    let x = (cx - (r.left + r.width / 2)) / R, y = -(cy - (r.top + r.height / 2)) / R;
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    patch({ v: [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))] });
  };
  const stop = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden rounded-[20px] bg-white/5 p-4">
        <div aria-hidden="true" className="pointer-events-none absolute h-[356px] w-[1168px] bg-cover bg-bottom bg-no-repeat opacity-20 mix-blend-screen" style={{ left: "calc(50% - 584px)", top: "calc(50% - 178px)", backgroundImage: `url(${STATIC}lighting-grid.png)` }} />
        <div className="relative z-[2] mx-auto flex shrink-0 items-center gap-1 pt-1">
          {lights.map((_, i) => (
            <button key={i} type="button" onClick={() => setActive(i)} className={`flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium transition-colors ${i === idx ? "bg-white/10 text-white" : "text-[#8d8e93] hover:text-white"}`}>Light {i + 1}</button>
          ))}
          {lights.length < 4 && (
            <button type="button" onClick={() => { setLights([...lights, newLight()]); setActive(lights.length); }} className="flex h-6 items-center gap-1 rounded-full px-2 text-[12px] font-medium text-[#8d8e93] transition-colors hover:text-white">
              <svg className="size-3" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6.75V12M12 12V17.25M12 12H6.75M12 12H17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Add Light
            </button>
          )}
        </div>
        <div data-testid="v40-lighting-stage" aria-label={`Light ${idx + 1}: ${quickName(cur.v)}`} className="relative z-[1] mx-auto flex min-h-0 w-full flex-1 cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing"
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); aim(e.clientX, e.clientY); }}
          onPointerMove={(e) => dragging.current && aim(e.clientX, e.clientY)}
          onPointerUp={() => { dragging.current = false; }}>
          <div className="absolute inset-y-0 left-0 z-10 flex items-center"><div onPointerDown={stop} className="flex w-[180px] cursor-auto flex-col gap-1">
            <div className="flex items-center gap-2 self-stretch py-0.5"><span className="text-[10px] font-medium leading-3.5 text-[#8d8e93]">Light {idx + 1}</span></div>
            <button type="button" onClick={() => picker.current?.click()} className="relative flex h-8 w-full cursor-pointer items-center justify-between rounded-lg bg-white/5 px-2 transition-colors hover:bg-white/10">
              <span className="text-[12px] font-medium text-[#8d8e93]">Color</span>
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full ring-1 ring-inset ring-white/20" style={{ backgroundColor: cur.color }} />
                <span className="text-[12px] font-medium uppercase text-white">{cur.color}</span>
              </span>
              <input ref={picker} type="color" value={cur.color} onChange={(e) => patch({ color: e.target.value.toUpperCase() })} aria-label="Light color" className="pointer-events-none absolute inset-0 size-full opacity-0" tabIndex={-1} />
            </button>
            <Slider label="Brightness" value={cur.brightness} onChange={(brightness) => patch({ brightness })} />
            <Slider label="Diffuse" value={cur.diffuse} onChange={(diffuse) => patch({ diffuse })} />
          </div></div>
          <div className="absolute inset-y-0 right-0 z-10 flex items-center"><div onPointerDown={stop} className="flex w-[180px] cursor-auto flex-col gap-1">
            <div className="flex items-center gap-2 self-stretch py-0.5"><span className="text-[10px] font-medium leading-3.5 text-[#8d8e93]">Quick select</span></div>
            <div className="grid grid-cols-2 gap-1">
              {QUICK.map((q) => (
                <button key={q.name} type="button" onClick={() => patch({ v: q.v })} className={`h-8 w-[88px] rounded-lg bg-white/10 text-[14px] font-medium text-white transition-[background-color,scale] duration-150 hover:bg-white/15 active:scale-[.96] ${same(q.v, cur.v) ? "border-2 border-white" : "border-2 border-transparent"}`}>{q.name}</button>
              ))}
            </div>
          </div></div>
          <div ref={stage} className="pointer-events-none absolute inset-0 m-auto size-[272px]">
            <div aria-hidden="true" className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url(${STATIC}lighting-globe.webp)` }} />
            <svg aria-hidden="true" className="absolute inset-0 z-[1] m-auto" width="16" height="200"><defs><linearGradient id={`${uid}-meridian`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0.15" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs><ellipse cx="8" cy="100" rx="5.25" ry="97.25" fill="none" stroke={`url(#${uid}-meridian)`} strokeWidth="5.5" /></svg>
            <svg aria-hidden="true" className="absolute inset-0 z-[1] m-auto" width="200" height="46"><defs><linearGradient id={`${uid}-parallel`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.2" /></linearGradient></defs><ellipse cx="100" cy="23" rx="97.25" ry="20.25" fill="none" stroke={`url(#${uid}-parallel)`} strokeWidth="5.5" /></svg>
            <Fixture light={cur} />
            {lights.map((l, i) => (
              <div key={i} className="pointer-events-auto absolute" style={{ left: `calc(50% + ${l.v[0] * R}px)`, top: `calc(50% - ${l.v[1] * R}px)`, transform: "translate(-50%, -50%)", zIndex: l.v[2] < 0 ? 1 : 4, opacity: l.v[2] < 0 ? 0.55 : i === idx ? 1 : 0.6, transition: dragging.current ? "none" : "0.2s ease-out" }}>
                <div onPointerDown={() => setActive(i)} className={`size-[24.7px] rounded-full ring-2 ring-offset-2 ring-offset-[#141414] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_6px_rgba(255,255,255,0.6),0_0_18px_rgba(190,240,80,0.45)] ${i === idx ? "ring-[#d1fe17]" : "ring-white/30"}`} style={{ background: `radial-gradient(circle, rgba(${rgb(l.color)}, 0.5) 0%, rgba(${rgb(l.color)}, 0.7) 58%, rgba(${rgb(l.color)}, 0.95) 100%)` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-[2] flex shrink-0 items-center justify-center gap-1 pb-4">
          <button type="button" onClick={onApply} className="h-8 rounded-lg bg-[#d1fe17] px-4 text-[14px] font-medium text-black transition-[filter,scale] duration-150 hover:brightness-110 active:scale-[.96]">Apply</button>
          <button type="button" onClick={onSave} className="h-8 rounded-lg bg-white px-4 text-[14px] font-medium text-black transition-[filter,scale] duration-150 hover:brightness-95 active:scale-[.96]">Save as preset</button>
        </div>
      </div>
    </div>
  );
}
