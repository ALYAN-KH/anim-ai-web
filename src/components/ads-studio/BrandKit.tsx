"use client";

import Link from "next/link";
import refinements from "./ads-refinements.module.css";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { HeroShader } from "./HeroShader";

const BADGE_ICON = "m20.35 11.844-.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z";
const ICONS = {
  selling: <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m10-6.403a.75.75 0 0 1 .75.75v.864c.857.166 1.612.614 2.084 1.266a.75.75 0 0 1-1.216.88c-.283-.392-.87-.718-1.618-.718h-.286c-1.011 0-1.533.63-1.533 1.077v.078c0 .343.25.77.845 1.009l2.505 1.002c1.019.407 1.788 1.3 1.788 2.4 0 1.42-1.212 2.397-2.569 2.612v.836a.75.75 0 0 1-1.5 0v-.864c-.857-.166-1.612-.614-2.083-1.266a.75.75 0 1 1 1.215-.88c.283.392.87.718 1.618.718h.187c1.067 0 1.632-.665 1.632-1.155 0-.343-.25-.77-.845-1.009l-2.505-1.002c-1.019-.407-1.788-1.3-1.788-2.4v-.079c0-1.41 1.226-2.364 2.569-2.546v-.823a.75.75 0 0 1 .75-.75" />,
  aesthetics: <path fill="currentColor" d="M5 16c.099 0 .187.064.216.16l.202.657c.26.844.92 1.505 1.765 1.765l.658.202a.226.226 0 0 1 0 .432l-.658.202c-.844.26-1.505.92-1.765 1.765l-.202.658a.226.226 0 0 1-.432 0l-.202-.658a2.67 2.67 0 0 0-1.765-1.765l-.658-.202a.226.226 0 0 1 0-.432l.658-.202a2.67 2.67 0 0 0 1.765-1.765l.202-.658A.23.23 0 0 1 5 16m8-14c.297 0 .56.194.648.478l.607 1.974a8 8 0 0 0 5.293 5.293l1.975.607a.678.678 0 0 1 0 1.296l-1.975.607a8 8 0 0 0-5.293 5.293l-.607 1.975a.678.678 0 0 1-1.296 0l-.607-1.975a8 8 0 0 0-5.293-5.293l-1.974-.607a.678.678 0 0 1 0-1.296l1.974-.607a8 8 0 0 0 5.293-5.293l.607-1.974A.68.68 0 0 1 13 2" />,
  fonts: <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M19 20h1a.5.5 0 0 1 0 1h-4.75a.5.5 0 0 1 0-1h1.121l-1.953-6H7.956l-1.953 6H7a.5.5 0 0 1 0 1H4a.5.5 0 0 1 0-1h.95l5.198-15.964A1.5 1.5 0 0 1 11.575 3h.802a1.5 1.5 0 0 1 1.426 1.036zM8.281 13h5.81l-2.667-8.194a.25.25 0 0 0-.475 0z" />,
  audience: <path fill="currentColor" d="M12 12a6 6 0 0 1 6 6v.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5V18a6 6 0 0 1 6-6M7.103 13A6.98 6.98 0 0 0 5 18v1H1a1 1 0 0 1-1-1 5 5 0 0 1 5-5zM19 13a5 5 0 0 1 5 5 1 1 0 0 1-1 1h-4v-1c0-1.96-.805-3.73-2.102-5zM5 6.75a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M19 6.75a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M12 3.75a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7" />,
  description: <path fill="currentColor" d="M3.5 5a.5.5 0 0 0 0 1h17a.5.5 0 0 0 0-1zM17.447 10.276a.5.5 0 0 0-.894 0l-1.426 2.851-2.85 1.426a.5.5 0 0 0 0 .894l2.85 1.426 1.426 2.85a.5.5 0 0 0 .894 0l1.426-2.85 2.85-1.426a.5.5 0 0 0 0-.894l-2.85-1.426zM3.5 11.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zM3.5 18a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />,
};

const BLOCK = "relative flex shrink-0 flex-col overflow-hidden rounded-2xl max-md:rounded-3xl border border-white/10 bg-white/5 shadow-[0_2px_2px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.05)] backdrop-blur-[12px] max-md:backdrop-blur-none transition-[background-color,scale] duration-200 ease-out hover:bg-white/10 focus-within:z-10 focus-within:scale-[1.02] focus-within:bg-white/10 motion-reduce:focus-within:scale-100 ads-block-in gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_56%,rgba(255,255,255,0.07)_100%)] p-[25px] max-md:p-6 cursor-pointer";
const HINT = "text-sm tracking-[0.1px] text-white/40";

type Field = "selling" | "aesthetics" | "fonts" | "audience" | "description" | "socials";
type Kit = { name: string; site: string; logo: string | null; colors: string[]; selling: string[]; aesthetics: string[]; fontDisplay: string; fontBody: string; audience: string; description: string; socials: string };

/* ---------- colour helpers ---------- */
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
function hsvToHex(h: number, s: number, v: number) {
  const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return "#" + [f(5), f(3), f(1)].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}
function hexToHsv(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = 0;
  if (d) h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, max ? d / max : 0, max];
}
const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

function ColorPicker({ value, anchor, onChange, onClose }: { value: string; anchor: DOMRect; onChange: (hex: string) => void; onClose: () => void }) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [text, setText] = useState(value);
  const box = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const hue = useRef<HTMLDivElement>(null);
  const emit = (n: [number, number, number]) => { setHsv(n); const hex = hsvToHex(...n); setText(hex); onChange(hex); };
  const drag = (el: HTMLDivElement | null, fn: (x: number, y: number) => void) => (e: React.PointerEvent<HTMLDivElement>) => {
    const target = el ?? e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const move = (ev: { clientX: number; clientY: number }) => { const r = target.getBoundingClientRect(); fn(clamp((ev.clientX - r.left) / r.width), clamp((ev.clientY - r.top) / r.height)); };
    move(e);
    const mv = (ev: PointerEvent) => move(ev);
    const up = () => { target.removeEventListener("pointermove", mv); target.removeEventListener("pointerup", up); };
    target.addEventListener("pointermove", mv); target.addEventListener("pointerup", up);
  };
  useEffect(() => {
    const down = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) onClose(); };
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const t = setTimeout(() => document.addEventListener("mousedown", down), 0);
    document.addEventListener("keydown", key);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [onClose]);
  const eyedropper = typeof window !== "undefined" ? (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper : undefined;
  const pick = async () => { if (!eyedropper) return; try { const r = await new eyedropper().open(); setText(r.sRGBHex); setHsv(hexToHsv(r.sRGBHex)); onChange(r.sRGBHex); } catch { /* cancelled */ } };
  const left = Math.max(8, Math.min(anchor.left + anchor.width / 2 - 100, window.innerWidth - 208));
  return (
    <div ref={box} role="dialog" aria-label="Color picker" data-ads-color-picker="true" style={{ position: "fixed", left, top: Math.max(248, Math.min(anchor.top - 8, window.innerHeight - 8)), transform: "translateY(-100%)" }} className="z-50 flex w-[250px] flex-col gap-3 rounded-2xl border border-white/10 bg-[#1b1c1e] p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div ref={area} onPointerDown={drag(area.current, (x, y) => emit([hsv[0], x, 1 - y]))} className="relative h-[190px] w-full cursor-crosshair touch-none rounded-lg" style={{ backgroundColor: `hsl(${hsv[0]} 100% 50%)`, backgroundImage: "linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent)" }}>
        <span className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" style={{ left: `${hsv[1] * 100}%`, top: `${(1 - hsv[2]) * 100}%`, backgroundColor: hsvToHex(...hsv) }} />
      </div>
      <div ref={hue} onPointerDown={drag(hue.current, x => emit([x * 360, hsv[1], hsv[2]]))} className="relative mx-1 h-4 cursor-pointer touch-none rounded-full" style={{ background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}>
        <span className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${(hsv[0] / 360) * 100}%`, backgroundColor: `hsl(${hsv[0]} 100% 50%)` }} />
      </div>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Pick color from screen" disabled={!eyedropper} title={eyedropper ? "Eyedropper" : "Eyedropper is not supported in this browser"} onClick={pick} className="grid size-8 shrink-0 place-items-center rounded-lg text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="m15 5 4 4M4 20l1-4 9.5-9.5a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L8 19zM13 7l4 4" /></svg>
        </button>
        <input aria-label="Hex color" value={text} spellCheck={false} onChange={e => { let v = e.target.value; if (v && v[0] !== "#") v = "#" + v; setText(v); if (isHex(v)) { setHsv(hexToHsv(v)); onChange(v.toLowerCase()); } }} onBlur={() => setText(isHex(text) ? text : hsvToHex(...hsv))} className="h-10 min-w-0 flex-1 rounded-lg border border-lime bg-transparent px-3 text-sm text-white outline-none" />
      </div>
    </div>
  );
}

/* ---------- modals ---------- */
function Modal({ title, onClose, children, wide, footer }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} data-ads-editor="true" className={`flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-4 rounded-3xl border border-white/10 bg-[#141516] p-5 text-white shadow-[0_16px_64px_rgba(0,0,0,0.6)] ${wide ? "max-w-[44rem]" : "max-w-[37.5rem]"}`}>
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><CloseBtn onClick={onClose} /></div>
        {children}
        {footer}
      </div>
    </div>
  );
}
function CloseBtn({ onClick }: { onClick: () => void }) {
  return <button type="button" aria-label="Close" onClick={onClick} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-lime"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m7.75 7.75 8.5 8.5m0-8.5-8.5 8.5" /></svg></button>;
}
function SaveBtn({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="h-14 w-full rounded-xl bg-white text-lg font-semibold text-black outline-none transition hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-lime">Save</button>;
}

function ChipsEditor({ title, items, onSave, onClose }: { title: string; items: string[]; onSave: (v: string[]) => void; onClose: () => void }) {
  const [list, setList] = useState(items);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const commit = () => { const v = draft.trim(); if (v) setList(l => [...l, v]); setDraft(""); setAdding(false); };
  return (
    <Modal title={title} onClose={onClose} footer={<SaveBtn onClick={() => { const v = draft.trim(); onSave(v ? [...list, v] : list); }} />}>
      <div className="flex min-h-[4.75rem] flex-wrap items-center gap-2 rounded-xl bg-white/5 p-3">
        {list.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1 pl-3 pr-1 text-sm text-white">{t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => setList(l => l.filter((_, j) => j !== i))} className="grid size-5 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3.5"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m7.75 7.75 8.5 8.5m0-8.5-8.5 8.5" /></svg></button>
          </span>
        ))}
        {adding
          ? <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }} className="h-8 min-w-[8rem] rounded-lg border border-white/20 bg-transparent px-2 text-sm text-white outline-none" />
          : <button type="button" onClick={() => setAdding(true)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-sm text-white/50 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-lime"><span className="text-base leading-none">+</span> Add</button>}
      </div>
    </Modal>
  );
}

function TextEditor({ title, value, placeholder, multiline, onSave, onClose }: { title: string; value: string; placeholder: string; multiline?: boolean; onSave: (v: string) => void; onClose: () => void }) {
  const [v, setV] = useState(value);
  const cls = "w-full resize-none rounded-xl bg-white/5 p-4 text-base text-white outline-none placeholder:text-white/40 focus:bg-white/[0.08]";
  return (
    <Modal title={title} onClose={onClose} footer={<SaveBtn onClick={() => onSave(v.trim())} />}>
      {multiline ? <textarea autoFocus rows={5} value={v} placeholder={placeholder} onChange={e => setV(e.target.value)} className={cls} /> : <input autoFocus value={v} placeholder={placeholder} onChange={e => setV(e.target.value)} onKeyDown={e => e.key === "Enter" && onSave(v.trim())} className={`${cls} h-14`} />}
    </Modal>
  );
}

function FontsEditor({ display, body, onSave, onClose }: { display: string; body: string; onSave: (d: string, b: string) => void; onClose: () => void }) {
  const [d, setD] = useState(display), [b, setB] = useState(body);
  const row = "flex flex-col gap-1 rounded-lg px-3 py-1";
  const inp = "w-full bg-transparent text-base text-white outline-none placeholder:text-white/40";
  return (
    <Modal title="Fonts" onClose={onClose} footer={<SaveBtn onClick={() => onSave(d.trim(), b.trim())} />}>
      <div className="flex flex-col gap-3 rounded-xl bg-white/5 p-3">
        <label className={row}><span className="text-sm font-semibold text-white/60">Display</span><input autoFocus value={d} onChange={e => setD(e.target.value)} placeholder="Font name" className={inp} /></label>
        <label className={row}><span className="text-sm font-semibold text-white/60">Body</span><input value={b} onChange={e => setB(e.target.value)} placeholder="Font name" className={inp} /></label>
      </div>
    </Modal>
  );
}

function MediaDialog({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState("Uploads");
  const [range, setRange] = useState("Recent");
  const [uploads, setUploads] = useState<string[]>([]);
  const [newestFirst, setNewestFirst] = useState(true);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [onClose]);
  const onFile = (f?: File) => { if (f && f.type.startsWith("image/")) { const u = URL.createObjectURL(f); setUploads(l => [u, ...l]); onPick(u); } };
  const pill = (on: boolean) => `h-10 rounded-full px-4 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-lime ${on ? "bg-white text-black" : "text-white/60 hover:text-white"}`;
  const shown = tab === "Uploads" ? (newestFirst ? uploads : [...uploads].reverse()) : [];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Select media" data-ads-logo-picker="true" className="flex h-[min(46.5rem,calc(100dvh-2rem))] w-full max-w-[75rem] flex-col gap-2 rounded-[2rem] border border-white/10 bg-[#202123] p-2 text-white shadow-[0_16px_64px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between p-2">
          <div role="tablist" className="flex items-center gap-1">{["Uploads", "Generations", "Liked"].map(t => <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className={pill(tab === t)}>{t}</button>)}</div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-[#27282a]">
          <div className="flex items-center justify-between border-b border-white/5 p-2">
            <div className="flex items-center gap-1">{["Recent", "All"].map(t => <button key={t} type="button" onClick={() => setRange(t)} className={pill(range === t).replace("bg-white text-black", "bg-white/10 text-white")}>{t}</button>)}</div>
            <button type="button" onClick={() => setNewestFirst(v => !v)} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-white/60 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-lime">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h12M4 11h8M4 16h5M17 10v9m0 0-3-3m3 3 3-3" /></svg>Sort by
            </button>
          </div>
          <div className="flex flex-wrap content-start gap-3 overflow-y-auto p-3">
            {tab === "Uploads" && (
              <button type="button" onClick={() => file.current?.click()} className="flex size-[11.25rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/5 text-sm font-semibold outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime">
                <span className="grid size-14 place-items-center rounded-full bg-white/10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5M12 21v-8m0 0-3 3m3-3 3 3" /></svg></span>Upload media
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {shown.map(u => <button key={u} type="button" onClick={() => onPick(u)} className="size-[11.25rem] overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-lime"><img src={u} alt="" className="size-full object-cover" /></button>)}
            {tab !== "Uploads" && <p className="p-4 text-sm text-white/40">{tab} are available once you are signed in.</p>}
          </div>
        </div>
        <input ref={file} type="file" accept="image/*" hidden onChange={e => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export function BrandKit({ initialSite = "" }: { initialSite?: string }) {
  const router = useRouter();
  const [kit, setKit] = useState<Kit>({ name: "", site: initialSite, logo: null, colors: ["#888888"], selling: [], aesthetics: [], fontDisplay: "", fontBody: "", audience: "", description: "", socials: "" });
  const [edit, setEdit] = useState<Field | null>(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [picker, setPicker] = useState<{ i: number; rect: DOMRect } | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  const closePicker = useCallback(() => setPicker(null), []);
  const closeEdit = useCallback(() => setEdit(null), []);
  const closeMedia = useCallback(() => setMediaOpen(false), []);
  const set = <K extends keyof Kit>(k: K, v: Kit[K]) => setKit(p => ({ ...p, [k]: v }));
  const saved = (text: string, ph: string) => text ? <p className="text-base tracking-[0.1px] text-white/80 break-words">{text}</p> : <p className={HINT + " break-words"}>{ph}</p>;
  const icon = (k: keyof typeof ICONS) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-7 shrink-0 text-lime">{ICONS[k]}</svg>;
  const block = (field: Field, label: string, delay: number, body: ReactNode, ic?: keyof typeof ICONS) => (
    <section data-ads-bento-block={field} className={BLOCK} style={{ animationDelay: `${delay}ms` }}>
      <button type="button" aria-label={`Edit ${label.toLowerCase()}`} onClick={() => setEdit(field)} className="absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-inset" />
      <div className="flex flex-col items-start gap-2">{ic && icon(ic)}<h3 className="text-xs font-medium text-white/60">{label}</h3></div>
      {body}
    </section>
  );
  const fonts = [kit.fontDisplay, kit.fontBody].filter(Boolean).join(" · ");

  return (
    <div data-ads-brand="true" className={`${refinements.brand} flex h-[calc(100dvh-52px)] bg-[#0d0f10] p-2 text-white`}>
      <main data-ads-brand-research="true" className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#101113]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><HeroShader reference /></div>
        <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-12 shrink-0 items-center gap-6 bg-gradient-to-b from-[#101113] via-[#101113]/80 to-transparent px-2 py-2">
          <Link href="/ads-studio" className="pointer-events-auto inline-flex h-8 items-center gap-1 rounded-lg px-2 text-base font-semibold text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 18.25 8.25 12l6.25-6.25" /></svg><span>Ads Studio</span></Link>
        </header>
        <div data-ads-brand-scroll="true" className="hide-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-none pb-20 pt-12">
          <div data-ads-brand-research-manual="true" className="flex w-full shrink-0 flex-col items-center gap-6 px-20 pb-4 pt-4 max-md:gap-0 max-md:px-0 max-md:pt-0">
            <span className="relative inline-flex h-7 select-none items-center rounded-lg bg-white/[0.01] px-2 py-1 shadow-[inset_0_2px_8px_0_rgba(217,255,102,0.25)] ring-1 ring-inset ring-lime/40">
              <span className="flex items-center gap-1 px-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3 shrink-0 text-lime"><path fill="currentColor" d={BADGE_ICON} /></svg><span className="font-grotesk text-[11px] font-bold uppercase tracking-[-0.04em]">Ads Studio</span></span>
            </span>
            <header className="flex flex-col items-center gap-2 text-center">
              <h1 style={{ backgroundImage: "linear-gradient(to bottom, #fff 8.9%, rgba(255,255,255,0.6) 90.2%)", WebkitBackgroundClip: "text" }} className="text-balance bg-clip-text font-grotesk text-[clamp(1.75rem,4vw,2.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.04em] text-transparent">Create your brand kit</h1>
              <p className="text-base text-white/50">Everything here shapes your ads</p>
            </header>
            <div data-ads-brand-kit-bento="true" className="flex w-[42.5rem] max-w-full shrink-0 flex-col gap-4 max-md:w-full max-md:gap-2 max-md:px-2 max-md:py-3">
              <section data-ads-bento-block="hero" style={{ animationDelay: "0ms" }} className="relative flex min-h-[320px] shrink-0 flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_56%,rgba(255,255,255,0.07)_100%)] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.12),inset_0_0_36px_0_rgba(255,255,255,0.05)] backdrop-blur-[12px] transition-[background-color,scale] duration-200 ease-out ads-block-in hover:bg-white/10 max-md:min-h-0 max-md:backdrop-blur-none">
                <div className="flex w-full flex-col gap-3">
                  <div className="flex w-full items-start gap-4 max-md:flex-col">
                    <div className="flex min-w-0 flex-1 flex-col gap-2 py-2 max-md:w-full max-md:flex-none max-md:py-0">
                      <input aria-label="Brand name" placeholder="Your brand name" spellCheck={false} value={kit.name} onChange={e => set("name", e.target.value)} className="w-full min-w-0 truncate bg-transparent font-grotesk text-[2rem] font-bold uppercase leading-tight tracking-[-0.04em] text-white/80 outline-none placeholder:text-white/30 max-md:text-2xl" />
                      <div className="flex min-w-0 items-center gap-1.5 text-sm text-white/50">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4 shrink-0"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m9.5 14.5 5-5M9.287 5.751l1.395-1.395a6.337 6.337 0 1 1 8.962 8.962l-1.395 1.395M5.75 9.287l-1.395 1.395a6.337 6.337 0 1 0 8.962 8.962l1.395-1.395" /></svg>
                        <input aria-label="Website" placeholder="www.yourbrand.com" spellCheck={false} value={kit.site} onChange={e => set("site", e.target.value)} className="w-full min-w-0 truncate bg-transparent outline-none placeholder:text-white/30" />
                      </div>
                    </div>
                    <div data-ads-bento-logo="true" className="relative shrink-0 max-md:order-first">
                      <button type="button" aria-label="Upload logo" data-ads-brand-logo={kit.logo ? "filled" : "empty"} onClick={() => setMediaOpen(true)} className="relative flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-[0_2px_2px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.05)] outline-none backdrop-blur-[12px] transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-lime max-md:h-[4.5rem] max-md:w-[7.5rem]">
                        {kit.logo
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={kit.logo} alt="Brand logo" className="size-full object-contain p-2" />
                          : <svg aria-hidden="true" data-ads-logo-placeholder="true" className="size-10 text-white/40" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 20.0001L8.63073 12.4789C8.23871 12.0787 7.59452 12.0787 7.20238 12.4786L3.75 16.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11.75C15.2426 11.75 16.25 10.7426 16.25 9.5C16.25 8.25736 15.2426 7.25 14 7.25C12.7574 7.25 11.75 8.25736 11.75 9.5C11.75 10.7426 12.7574 11.75 14 11.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2" />
                <ul data-ads-bento-palette="true" className="flex w-full items-start gap-2 max-md:grid max-md:grid-cols-3">
                  {kit.colors.map((c, i) => (
                    <li key={i} className="min-w-0 flex-1">
                      <div className="group relative">
                        <button type="button" aria-label={`Edit color ${c}`} aria-haspopup="dialog" aria-expanded={picker?.i === i} onClick={e => setPicker({ i, rect: e.currentTarget.getBoundingClientRect() })} style={{ backgroundColor: c }} className="relative flex h-16 w-full cursor-pointer flex-col items-start justify-end rounded-lg border-2 border-white/10 p-2 text-left shadow-[0_4px_6px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-lime">
                          <span className="text-xs font-medium text-white">{i === 0 ? "Main" : `Color ${i + 1}`}</span>
                          <span className="text-[10px] font-medium tracking-[0.0125em] text-white/50">{c}</span>
                        </button>
                        {(
                          <button type="button" aria-label="Remove color" onClick={() => { setKit(p => ({ ...p, colors: p.colors.filter((_, j) => j !== i) })); setPicker(null); }} className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/30 text-white/70 opacity-0 outline-none transition-opacity focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-lime group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 max-md:size-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m7.75 7.75 8.5 8.5m0-8.5-8.5 8.5" /></svg>
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {kit.colors.length < 6 && (
                    <li className="h-16 min-w-0 max-w-24 flex-1 max-md:max-w-none">
                      <button type="button" aria-label="Add color" onClick={() => setKit(p => ({ ...p, colors: [...p.colors, "#888888"] }))} className="flex size-full items-center justify-center rounded-lg border border-dashed border-white/20 text-white/50 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-lime">
                        <svg aria-hidden="true" className="size-4" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6.75V12M12 12V17.25M12 12H6.75M12 12H17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                    </li>
                  )}
                </ul>
              </section>
              {block("selling", "Selling points", 70, kit.selling.length ? saved(kit.selling.join(", "), "") : <p className={HINT}>Main reason to buy, e.g., Free shipping over $50</p>, "selling")}
              <div className="grid w-full grid-cols-2 items-stretch gap-4 max-md:grid-cols-1 max-md:gap-2">
                <div className="flex min-w-0 flex-col gap-3 max-md:gap-2 [&>*]:grow">
                  {block("aesthetics", "Aesthetics", 140, <div className="flex w-full flex-col gap-1">{kit.aesthetics.length ? saved(kit.aesthetics.join(", "), "") : <p className={HINT}>Look and feel, e.g., Minimal, muted colors, natural light</p>}</div>, "aesthetics")}
                  {block("fonts", "Fonts", 350, fonts ? saved(fonts, "") : <p className={HINT}>Display and body fonts, e.g., Playfair Display and Inter</p>, "fonts")}
                </div>
                <div className="flex min-w-0 flex-col gap-3 max-md:gap-2 [&>*]:grow">
                  {block("audience", "Audience", 280, saved(kit.audience, "Who the ads are for"), "audience")}
                </div>
              </div>
              {block("description", "Description", 420, saved(kit.description, "What the brand sells, who it's for and what makes it different"), "description")}
              {block("socials", "Socials", 560, saved(kit.socials, "Instagram, TikTok or other profile link"))}
            </div>
          </div>
        </div>
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-20 shrink-0 items-center justify-between bg-gradient-to-t from-[#101113] via-[#101113]/80 to-transparent p-4 [&>*]:pointer-events-auto">
          <button type="button" onClick={() => router.push("/ads-studio/brand-research")} className="inline-flex h-12 items-center gap-1 rounded-xl px-4 text-xl font-semibold text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime max-md:hidden"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 18.25 8.25 12l6.25-6.25" /></svg><span>Back</span></button>
          <button type="button" onClick={() => setAuthMode("login")} className="inline-flex h-12 items-center justify-center rounded-xl bg-lime px-5 text-xl font-semibold text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.25),inset_0_-3px_0_rgba(0,0,0,0.12)] outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-white max-md:w-full max-md:rounded-full max-md:text-sm">Continue</button>
        </footer>
        {picker && <ColorPicker value={kit.colors[picker.i]} anchor={picker.rect} onChange={hex => setKit(p => ({ ...p, colors: p.colors.map((c, j) => (j === picker.i ? hex : c)) }))} onClose={closePicker} />}
      </main>
      {mediaOpen && <MediaDialog onClose={closeMedia} onPick={u => { set("logo", u); setMediaOpen(false); }} />}
      {edit === "selling" && <ChipsEditor title="Selling points" items={kit.selling} onClose={closeEdit} onSave={v => { set("selling", v); setEdit(null); }} />}
      {edit === "aesthetics" && <ChipsEditor title="Aesthetics" items={kit.aesthetics} onClose={closeEdit} onSave={v => { set("aesthetics", v); setEdit(null); }} />}
      {edit === "fonts" && <FontsEditor display={kit.fontDisplay} body={kit.fontBody} onClose={closeEdit} onSave={(d, b) => { setKit(p => ({ ...p, fontDisplay: d, fontBody: b })); setEdit(null); }} />}
      {edit === "audience" && <TextEditor title="Audience" value={kit.audience} placeholder="Who the ads are for" multiline onClose={closeEdit} onSave={v => { set("audience", v); setEdit(null); }} />}
      {edit === "description" && <TextEditor title="Description" value={kit.description} placeholder="What the brand sells, who it's for and what makes it different" multiline onClose={closeEdit} onSave={v => { set("description", v); setEdit(null); }} />}
      {edit === "socials" && <TextEditor title="Socials" value={kit.socials} placeholder="Instagram, TikTok or other profile link" onClose={closeEdit} onSave={v => { set("socials", v); setEdit(null); }} />}
      {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
    </div>
  );
}
