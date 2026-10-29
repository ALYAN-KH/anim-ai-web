"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { buildChatGptUrl } from "@/components/mcp/lib/chatgpt-url";
import { CHATGPT_PLUGIN_INSTALL_URL } from "@/components/mcp/config/links";
import { ASPECTS, DEFAULT_EFFECT, EFFECTS, RESOLUTIONS, type Effect, type EffectSlot } from "./data";
import { HowItWorks } from "./HowItWorks";
import { BadgeSpark, ChangeIcon, ChatGptIcon, ChevronIcon, CloseIcon, EffectsIcon, GenerateIcon, HistoryIcon, SearchIcon, SlotIcon, SparkIcon } from "./icons";

const FREE_GENS = 1;
const glass = "bg-white/[0.05]";

function useOutside(ref: React.RefObject<HTMLElement>, onOut: () => void, active: boolean, extra?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active) return;
    const down = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && !extra?.current?.contains(e.target as Node) && onOut();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onOut();
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [ref, extra, onOut, active]);
}

function AspectGlyph({ value }: { value: string }) {
  if (value === "Auto") return <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 3.75h3M3.75 5.5v3M20.25 5.5v13a1.75 1.75 0 0 1-1.75 1.75h-13A1.75 1.75 0 0 1 3.75 18.5v-5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M9 2.5c0 1.7-.8 2.5-2.5 2.5C8.2 5 9 5.8 9 7.5 9 5.8 9.8 5 11.5 5 9.8 5 9 4.2 9 2.5Z" fill="currentColor" /></svg>;
  const [w, h] = value.split(":").map(Number);
  const scale = 16 / Math.max(w, h);
  return <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x={12 - (w * scale) / 2} y={12 - (h * scale) / 2} width={w * scale} height={h * scale} rx="2.5" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Dropdown({ label, value, options, onChange, title, side: side_, renderOption }: { label: string; value: string; options: string[]; onChange: (v: string) => void; title?: string; side?: boolean; renderOption?: (o: string) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<React.CSSProperties>({});
  const close = useCallback(() => setOpen(false), []);
  useOutside(ref, close, open, menuRef);
  const toggle = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) {
      const side = side_ && window.innerWidth >= 768;
      setPos(side ? { left: r.right + 20, bottom: window.innerHeight - r.bottom - 8, width: 300 } : { left: Math.max(8, Math.min(r.left, window.innerWidth - 264)), bottom: window.innerHeight - r.top + 8, width: 256 });
    }
    setOpen(o => !o);
  };
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open, close]);
  return (
    <div ref={ref} className="relative min-w-0">
      <button type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={toggle} className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition active:scale-[0.98] ${glass} ${open ? "border-white/10" : "border-white/5 hover:border-white/10"}`}>
        <span className="flex min-w-0 flex-col gap-0.5"><span className="whitespace-nowrap text-xs font-medium text-white/50">{label}</span><span className="truncate text-sm font-medium text-white">{value}</span></span>
        <ChevronIcon />
      </button>
      {open && createPortal(
        <div ref={menuRef} role="menu" style={pos} className="fixed z-50 rounded-2xl border border-white/10 bg-[#2a2827]/95 p-2 shadow-2xl backdrop-blur-xl">
          {title && <div className="px-3 pb-2 pt-1.5 text-xs font-medium text-white/50">{title}</div>}
          {options.map(o => (
            <button key={o} type="button" role="menuitemradio" aria-checked={o === value} onClick={() => { onChange(o); close(); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold text-white transition hover:bg-white/10 ${o === value ? "bg-white/10" : ""}`}>
              {renderOption?.(o)}
              <span className="flex-1">{o}</span>
              {o === value && <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

function UploadSlot({ slot, files, onFiles, onRemove, className = "" }: { slot: EffectSlot; files: { name: string; url: string }[]; onFiles: (f: FileList) => void; onRemove: (i: number) => void; className?: string }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={`relative flex h-40 min-h-[8.5rem] min-w-0 items-center justify-center overflow-hidden rounded-2xl ${glass} ${className}`}>
      <div className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border border-dashed border-white/10 transition-colors" />
      {files.length > 0 ? (
        <div className={`grid size-full gap-1 p-1 ${files.length > 1 ? "grid-cols-2" : ""}`}>
          {files.map((f, i) => (
            <div key={f.url} className="group/thumb relative min-h-0 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.name} className="size-full object-cover" />
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => onRemove(i)} className="absolute right-1.5 top-1.5 z-20 grid size-6 place-items-center rounded-full bg-black/60 text-white outline-none hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white"><CloseIcon /></button>
            </div>
          ))}
          {slot.multiple && files.length < 4 && <button type="button" onClick={() => input.current?.click()} className="grid place-items-center rounded-xl border border-dashed border-white/10 text-xs text-white/50 hover:bg-white/5">+ Add</button>}
        </div>
      ) : (
        <button type="button" aria-label={`Upload ${slot.label}`} onClick={() => input.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); onFiles(e.dataTransfer.files); }} className="absolute inset-0 flex min-w-0 items-center justify-center overflow-hidden px-4 text-center outline-none hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-white/40">
          <span className="flex flex-col items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-[rgba(197,197,197,0.3)] bg-white/[0.05] text-white/70 shadow-[inset_0_-0.3px_5px_rgba(185,185,185,0.35)]"><SlotIcon name={slot.key} /></span>
            <span className="flex min-w-0 flex-col items-center gap-1">
              <span className="max-w-full truncate text-sm font-medium text-white">{slot.label}</span>
              <span className="text-xs font-medium text-white/50">Select a PNG or JPG from your device</span>
            </span>
          </span>
          {slot.optional && <span className="absolute right-2 top-2 whitespace-nowrap rounded-xl bg-white/[0.05] px-2 py-1 text-[11px] font-medium text-white/50">Optional</span>}
        </button>
      )}
      <input ref={input} hidden type="file" accept="image/png,image/jpeg,image/webp" multiple={slot.multiple} onChange={e => { if (e.target.files?.length) onFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}

function EffectCard({ effect, selected, onSelect }: { effect: Effect; selected: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  const play = effect.video && (hover || selected);
  return (
    <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ aspectRatio: `${effect.ratio[0]} / ${effect.ratio[1]}` }} className="group/card relative isolate mb-2 w-full break-inside-avoid overflow-hidden rounded-2xl bg-white/5 [transform:translateZ(0)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={effect.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      {play && <video key={effect.video} src={effect.video} poster={effect.poster} autoPlay loop muted playsInline preload="metadata" disablePictureInPicture aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-cover" />}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-12 bg-gradient-to-t from-black/90 to-transparent" />
      <button type="button" aria-label={effect.title} aria-pressed={selected} data-preset-id={effect.id} onClick={onSelect} className="absolute inset-0 z-[2] rounded-2xl outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime" />
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[4] rounded-[inherit] ring-2 ring-inset ring-lime transition-opacity duration-150 ${selected ? "opacity-100" : "opacity-0"}`} />
      {selected && <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 z-[5] grid size-6 place-items-center rounded-full bg-lime text-ink"><svg className="size-3.5" viewBox="0 0 16 16" fill="none"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
      <span className="pointer-events-none absolute inset-x-3 bottom-3 z-[5] truncate font-grotesk text-sm font-bold uppercase text-white">{effect.title}</span>
    </article>
  );
}

function ChatGptModal({ effect, onClose }: { effect: Effect; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, onClose, true);
  const prompt = `Apply the Higgsfield "${effect.title}" effect to the photo I upload.`;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Connect Higgsfield to ChatGPT">
      <div ref={ref} className="relative w-full max-w-[600px] rounded-3xl border border-white/10 bg-[#1b1c1d] p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium">Connect Higgsfield to ChatGPT</h2>
          <button type="button" aria-label="Close" autoFocus onClick={onClose} className="grid size-8 place-items-center rounded-full bg-white/10 outline outline-2 outline-offset-0 outline-lime hover:bg-white/20"><CloseIcon /></button>
        </div>
        <p className="mt-8 font-grotesk text-3xl font-bold uppercase leading-tight">Create effects in ChatGPT</p>
        <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.04] p-6">
          <span className="grid size-8 place-items-center rounded-full bg-white/10 text-sm font-semibold">1</span>
          <h3 className="mt-6 flex items-center gap-2 text-lg font-medium">Add <span className="grid size-6 place-items-center rounded-md bg-lime text-ink"><svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" /></svg></span> Higgsfield plugin to ChatGPT</h3>
          <p className="mt-2 text-[15px] text-white/50">Find Higgsfield in the Plugins Directory or click the button below. Then click Add and sign in</p>
          <a href={CHATGPT_PLUGIN_INSTALL_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-[15px] font-medium hover:bg-white/15">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.5 5.25h5.25v5.25M18.5 5.5 10.75 13.25M17 14.25v3.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Add Higgsfield plugin
          </a>
          <hr className="my-6 border-white/10" />
          <span className="grid size-8 place-items-center rounded-full bg-white/10 text-sm font-semibold">2</span>
          <h3 className="mt-6 text-lg font-medium">Connect and start creating</h3>
          <p className="mt-2 text-[15px] text-white/50">Upload a photo and ask ChatGPT to apply a Higgsfield effect.</p>
          <a href={buildChatGptUrl(prompt)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-[15px] font-semibold text-ink hover:brightness-95"><ChatGptIcon />Start creating</a>
        </div>
      </div>
    </div>
  );
}

export function EffectsStudio({ initialId }: { initialId?: string }) {
  const router = useRouter();
  const start = EFFECTS.find(e => e.id === initialId) ?? EFFECTS.find(e => e.id === DEFAULT_EFFECT) ?? EFFECTS[0];
  const [selectedId, setSelectedId] = useState(start.id);
  const [tab, setTab] = useState<"effects" | "history">("effects");
  const [query, setQuery] = useState("");
  const [promptOn, setPromptOn] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("720p");
  const [aspect, setAspect] = useState("9:16");
  const [useFree, setUseFree] = useState(true);
  const [chatGpt, setChatGpt] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [uploads, setUploads] = useState<Record<string, { name: string; url: string }[]>>({});
  const urls = useRef(new Set<string>());
  const effect = EFFECTS.find(e => e.id === selectedId) ?? start;

  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);
  const select = (e: Effect) => {
    setSelectedId(e.id);
    setUploads({});
    window.history.replaceState(null, "", `/effects/use/${e.id}`);
  };
  const addFiles = (slot: EffectSlot, list: FileList) => {
    const added = Array.from(list).filter(f => /^image\/(png|jpeg|webp)$/.test(f.type)).slice(0, slot.multiple ? 4 : 1).map(f => {
      const url = URL.createObjectURL(f);
      urls.current.add(url);
      return { name: f.name, url };
    });
    if (added.length) setUploads(u => ({ ...u, [slot.key]: slot.multiple ? [...(u[slot.key] ?? []), ...added].slice(0, 4) : added }));
  };
  const removeFile = (slot: EffectSlot, i: number) => setUploads(u => ({ ...u, [slot.key]: (u[slot.key] ?? []).filter((_, j) => j !== i) }));
  const filtered = useMemo(() => EFFECTS.filter(e => e.title.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const missing = effect.slots.filter(s => !s.optional && !uploads[s.key]?.length);
  const [error, setError] = useState("");
  const generate = () => {
    if (missing.length) return setError(`Add ${missing.map(s => s.label).join(", ")} to continue`);
    setError("");
    // Generation requires an account; no public generation endpoint exists here.
    setAuthMode("signup");
  };
  useEffect(() => setError(""), [selectedId, uploads]);
  const closeAuth = useCallback(() => setAuthMode(null), []);

  const rows = [effect.slots.filter(s => s.key !== "products"), effect.slots.filter(s => s.key === "products")].filter(r => r.length);

  return (
    <main className="min-h-[calc(100dvh-44px)] bg-[#0d0f10] p-2 text-white sm:px-3 sm:pb-3 md:h-[calc(100dvh-44px)] md:overflow-hidden md:pt-1">
      <div className="grid min-h-full grid-cols-1 gap-3 md:h-full md:min-h-0 md:grid-cols-[21.875rem_minmax(0,1fr)]">
        <aside className="flex min-h-[40rem] flex-col gap-3 rounded-[1.25rem] bg-white/[0.05] p-2 pb-3 ring-1 ring-inset ring-white/10 md:h-full md:min-h-0">
          <div className="relative isolate aspect-video w-full shrink-0 overflow-hidden rounded-xl [transform:translateZ(0)]">
            {effect.video ? <video key={effect.id} src={effect.video} poster={effect.poster} autoPlay loop muted playsInline preload="metadata" disablePictureInPicture aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-cover" />
              // eslint-disable-next-line @next/next/no-img-element
              : <img src={effect.poster} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <button type="button" aria-label={`Open ${effect.title} settings`} onClick={() => setTab("effects")} className="absolute inset-0 z-[1] outline-none focus-visible:outline-2 focus-visible:outline-lime" />
            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-2.5">
              <div className="absolute right-2.5 top-2.5 flex justify-end">
                <button type="button" onClick={() => { setTab("effects"); document.getElementById("effects-grid")?.scrollIntoView({ block: "nearest" }); }} className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25"><ChangeIcon />Change</button>
              </div>
              <h1 className="w-full truncate px-8 text-center font-grotesk text-[1.375rem] font-bold uppercase text-lime">{effect.title}</h1>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-contain pb-12 [mask-image:linear-gradient(black,black_calc(100%-40px),transparent_calc(100%+1px))]">
              {rows.map(row => (
                <div key={row[0].key} className={`grid gap-3 *:min-w-0 ${row.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {row.map(slot => <UploadSlot key={slot.key} slot={slot} files={uploads[slot.key] ?? []} onFiles={f => addFiles(slot, f)} onRemove={i => removeFile(slot, i)} />)}
                </div>
              ))}
              <div className={`overflow-hidden rounded-xl ring-1 ring-inset ring-white/10 transition-shadow hover:ring-white/20 ${glass}`}>
                <label className="flex h-11 cursor-pointer items-center gap-2 p-2">
                  <span className="min-w-0 flex-1 px-1 text-sm font-medium text-white/50">Prompt</span>
                  <Switch checked={promptOn} onChange={setPromptOn} label="Toggle prompt" />
                </label>
                <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${promptOn ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="min-h-0 overflow-hidden" {...(!promptOn && { inert: "" as unknown as undefined })}>
                    <div className="h-px w-full bg-white/10" />
                    <label className="block h-32 cursor-text p-3">
                      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} maxLength={500} aria-label="Prompt" placeholder="Describe your changes, e.g. add neon glow or change outfit to black suit" className="hide-scrollbar h-26 w-full resize-none overflow-y-auto bg-transparent text-sm text-white outline-none placeholder:text-white/50" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 *:min-w-0">
                <Dropdown label="Resolution" value={resolution} options={RESOLUTIONS} onChange={setResolution} />
                <Dropdown label="Aspect Ratio" value={aspect} options={ASPECTS} onChange={setAspect} title="Aspect Ratio" side renderOption={o => <AspectGlyph value={o} />} />
              </div>
            </div>

            <div className="mt-auto w-full shrink-0">
              <div className={`mb-3 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 ${glass}`}>
                <span className="flex min-w-0 items-center text-sm font-medium text-white/50">Use free gens
                  <span className="ml-1 flex items-center gap-1 rounded-md bg-lime/15 p-1 text-lime"><SparkIcon />{FREE_GENS}</span>
                </span>
                <Switch checked={useFree} onChange={setUseFree} label="Use free gens" />
              </div>
              <div className={`flex w-full flex-col overflow-hidden rounded-xl border border-white/10 ${glass}`}>
                <button type="button" onClick={() => setChatGpt(true)} data-viral-hub-chatgpt-form-badge="desktop" className="flex w-full items-center justify-between px-3 pb-4 pt-2.5 text-sm font-medium text-white outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/50"><ChatGptIcon /><span className="min-w-0 flex-1 text-center">Try in ChatGPT</span><ChevronIcon className="size-5 shrink-0" /></button>
                <button type="button" onClick={generate} aria-label={useFree ? "Generate for free instead of 84 credits" : "Generate for 84 credits"} className="-mb-px flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-lime text-base font-semibold text-ink shadow-[0_3px_0_rgba(0,0,0,0.25)] transition hover:brightness-95 active:translate-y-px">
                  <GenerateIcon />
                  <span className="flex items-center">Generate
                    <span className="ml-1.5 flex h-[1.375rem] items-center justify-center gap-1 rounded-full bg-[#111613] py-0.5 pl-1.5 pr-2 text-lime">
                      {useFree ? <><BadgeSpark /><span className="font-grotesk text-xs font-bold uppercase leading-[1.125rem] tracking-[-0.03rem]">{FREE_GENS} free left</span></> : <span className="font-grotesk text-xs font-bold uppercase leading-[1.125rem]">84 credits</span>}
                    </span>
                  </span>
                </button>
              </div>
              {error && <p role="alert" className="mt-2 text-center text-xs text-red-400">{error}</p>}
            </div>
          </div>
        </aside>

        <section id="effects-grid" aria-label="Effects" className="relative isolate grid min-h-[40rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-[#0d0f10] sm:grid-rows-[3.25rem_minmax(0,1fr)] md:h-full md:min-h-0 md:rounded-2xl md:border md:border-white/10">
          <span aria-hidden="true" data-viral-hub-editor-pattern="true" className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:0.5rem_0.5rem] [mask-image:radial-gradient(circle_at_50%_48%,black_0%,black_38%,transparent_78%)]" />
          <header className="relative z-[1] flex min-w-0 flex-col gap-2 px-3 py-2 sm:h-[3.25rem] sm:flex-row sm:items-center sm:justify-between sm:py-1">
            <div role="tablist" aria-label="Effect views" className="relative -ml-1.5 flex items-center gap-1">
              {([["effects", "Effects", <EffectsIcon key="e" />], ["history", "History", <HistoryIcon key="h" />]] as const).map(([id, label, icon]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold transition ${tab === id ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>{icon}{label}</button>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1 md:ml-auto">
              {tab === "effects" && <label className="relative min-w-0 flex-1 md:w-32 md:flex-none lg:w-50">
                <span className="sr-only">Search</span>
                <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-white/50 [&>svg]:block [&>svg]:size-4"><SearchIcon /></span>
                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" className="h-8 w-full rounded-[0.625rem] border border-transparent bg-white/10 pl-8 pr-2 text-sm text-white outline-none transition-colors placeholder:text-white/50 hover:bg-white/[0.12] focus:bg-white/[0.12] lg:w-[12.5rem]" />
              </label>}
              <button type="button" aria-label="Close" aria-keyshortcuts="Escape" onClick={() => router.push("/")} className="group/close hidden size-8 shrink-0 place-items-center rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-lime md:grid"><span className="grid size-6 place-items-center rounded-full bg-white/10 text-white transition-colors group-hover/close:bg-white/20"><CloseIcon /></span></button>
            </div>
          </header>
          <div className={`hide-scrollbar relative z-[1] min-h-0 min-w-0 touch-pan-y overflow-x-hidden overscroll-contain px-3 pb-12 pt-2 ${tab === "effects" ? "overflow-y-auto [mask-image:linear-gradient(black,black_calc(100%-40px),transparent_calc(100%+1px))]" : "overflow-hidden"}`}>
            {tab === "effects" ? (
              filtered.length ? (
                <div role="list" className="columns-2 gap-2 sm:columns-3 lg:columns-4 xl:columns-5">
                  {filtered.map(e => <div role="listitem" key={e.id}><EffectCard effect={e} selected={e.id === selectedId} onSelect={() => select(e)} /></div>)}
                </div>
              ) : <p className="grid h-60 place-items-center text-sm text-white/50">No effects match “{query}”</p>
            ) : (
              <HowItWorks />
            )}
          </div>
        </section>
      </div>
      {chatGpt && <ChatGptModal effect={effect} onClose={() => setChatGpt(false)} />}
      {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
    </main>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={e => { e.preventDefault(); onChange(!checked); }} className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-lime" : "bg-white/25"}`}>
      <span style={{ transform: checked ? "translateX(16px)" : undefined }} className={`absolute left-0.5 top-0.5 block size-4 rounded-full shadow transition-transform ${checked ? "bg-ink" : "bg-white"}`} />
    </button>
  );
}
