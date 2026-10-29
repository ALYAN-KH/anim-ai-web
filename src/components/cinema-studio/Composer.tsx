"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DURATIONS, IMAGE_RESOLUTIONS, RATIOS, RESOLUTIONS, type Mode, type ModelEntry } from "./data";
import { ModelDropdown } from "./ModelDropdown";
import type { ModalState, ModeState, Setup } from "./state";
import { IconChevron } from "./ui";

const Higgs = () => <svg aria-hidden width="20" height="20" viewBox="4 0 24 24" className="shrink-0"><path fill="#D1FE17" d="m26.02 11.805-.02-.216c-.18-2.068-1.484-5.958-5.102-5.958-2.685 0-4.713 2.734-6.502 5.145-1.428 1.93-2.666 3.586-4.027 3.586-.362-.04-.828-.225-1.114-.647-.257-.382-.324-.872-.19-1.46.209-.93 1.409-1.793 2.675-2.714.694-.49 1.409-1.01 1.904-1.51 1.428-1.42 2.151-2.449 2.151-4.105s-.885-2.48-1.628-2.832C12.682.389 10.502.8 9.112 2.035c-.209.196-.419.382-.61.558C7.104 3.877 6.163 4.75 4 4.083v2.685c2.865 1.303 5.274-1.186 6.188-2.332.704-.755 1.447-1.196 2-1.196h.028c.248.01.457.108.61.284.247.294.342.637.294 1.02-.104.803-.913 1.744-2.399 2.773-1.742 1.205-4.655 3.223-4.884 5.762-.17 1.822.743 3.645 2.171 4.35 3.332 1.627 5.36-1.176 7.511-4.135 1.647-2.283 3.208-4.449 5.38-4.449 1.95 0 2.674 1.666 2.674 2.715v.205l-.19.04c-4.732.862-7.312 5.428-7.312 7.535s1.733 3.91 3.865 3.91c2.495 0 5.58-2.195 6.074-8.368l.02-.226H28v-2.851zm-2.58 3.165c-.38 3.694-2.218 5.418-3.332 5.418-.505 0-1.21-.43-1.21-1.234 0-.902 1.305-3.636 4.237-4.449l.343-.088z" /></svg>;
const sm = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ic = (d: ReactNode) => <svg width="16" height="16" viewBox="0 0 24 24" {...sm} className="shrink-0">{d}</svg>;
// Toolbar controls: 28px tall, 13px semibold — measured from the reference composer.
const TOOL = "flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-white/[0.06] px-2 text-[13px] font-semibold text-white transition hover:bg-white/10";

function Popover({ options, value, onPick, onClose }: { options: string[]; value: string; onPick: (v: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute bottom-full left-0 z-40 mb-2 min-w-[96px] rounded-xl border border-white/10 bg-[#2a2b2e] p-1 shadow-xl">
      {options.map((o) => <button key={o} onClick={() => { onPick(o); onClose(); }} className={`block w-full rounded-lg px-3 py-1.5 text-left text-[13px] font-medium hover:bg-white/10 ${o === value ? "text-[#d1fe17]" : "text-white"}`}>{o}</button>)}
    </div>
  );
}
function Pill({ icon, label, options, value, onPick }: { icon: ReactNode; label?: string; options: string[]; value: string; onPick: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button type="button" aria-label={label} onClick={() => setOpen((o) => !o)} className={TOOL}>{icon}{value}</button>
      {open && <Popover options={options} value={value} onPick={onPick} onClose={() => setOpen(false)} />}
    </div>
  );
}

const ART: Record<string, ReactNode> = {
  film: <svg width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="cs-film" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f2ef" /><stop offset="1" stopColor="#9a9a96" /></linearGradient></defs><rect width="32" height="32" fill="url(#cs-film)" /><rect x="5" y="8" width="22" height="16" rx="2" fill="#6d6d69" opacity=".55" />{[10, 16, 22].map((y) => <g key={y}><rect x="2" y={y - 1.5} width="2.5" height="3" rx=".6" fill="#555" /><rect x="27.5" y={y - 1.5} width="2.5" height="3" rx=".6" fill="#555" /></g>)}</svg>,
  camera: <svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0a0a0d" /><circle cx="16" cy="16" r="12" fill="#121216" stroke="#2a2d3a" strokeWidth="1.5" /><circle cx="16" cy="16" r="8.5" fill="none" stroke="#3b4a9a" strokeWidth="2.2" /><circle cx="16" cy="16" r="5.5" fill="#1b2457" /><circle cx="16" cy="16" r="2.4" fill="#05060f" /><circle cx="13.2" cy="13.2" r="1.2" fill="#9aa8ff" opacity=".8" /></svg>,
  palette: <svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#5a6a2a" /><rect width="32" height="12" fill="#8a9a4a" /><rect x="7" y="11" width="13" height="9" fill="#c8b24a" /><rect x="18" y="18" width="11" height="8" fill="#3a4a1f" /><rect x="20" y="3" width="9" height="8" fill="#d8c8a0" opacity=".8" /></svg>,
  lighting: <svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#16264a" /><rect x="5" y="7" width="22" height="15" rx="2" fill="#2f5fb0" /><rect x="7" y="9" width="18" height="11" rx="1" fill="#8fb4ee" opacity=".5" /><rect x="13" y="24" width="6" height="2" fill="#6a8ab8" /></svg>,
};
function Chip({ label, value, art, onClick }: { label: string; value: string; art?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-12 min-w-0 items-center gap-2 rounded-xl bg-white/[0.05] px-2 text-left transition hover:bg-white/[0.08]">
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#303134] text-[#d9dadd] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]">
        {art ? ART[art] : <svg width="16" height="16" viewBox="0 0 24 24" {...sm}><path d="M12 6v12M6 12h12" /></svg>}
      </span>
      <span className="min-w-0"><span className="cs-mono block truncate text-[10px] leading-3 text-[#85868b]">{label}</span><span className="block truncate text-[14px] font-semibold leading-5 text-white">{value}</span></span>
    </button>
  );
}

interface Props {
  mode: Mode; setMode: (m: Mode) => void; ms: ModeState; patch: (p: Partial<ModeState>) => void; setup: Setup;
  open: (m: ModalState) => void; onGenerate: () => void; refInput: React.RefObject<HTMLInputElement>;
}
export function Composer({ mode, setMode, ms, patch, setup, open, onGenerate, refInput }: Props) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const pick = (m: ModelEntry) => { patch({ model: m.id, modelName: m.name }); setMenu(false); };
  // Adding references needs an account, so these entry points go to sign-up.
  const toSignup = () => router.push("/signup");
  const video = mode === "video";

  const model = (
    <div className="relative shrink-0">
      <button type="button" onClick={() => setMenu((o) => !o)} className={`${TOOL} gap-1.5 pl-1.5`}><Higgs />{ms.modelName}<IconChevron s={14} /></button>
      {menu && <ModelDropdown mode={mode} value={ms.model} onPick={pick} onClose={() => setMenu(false)} />}
    </div>
  );
  const ratio = <Pill label="Aspect ratio" icon={ic(<rect x="3" y="6.5" width="18" height="11" rx="2.5" />)} options={RATIOS} value={ms.ratio} onPick={(ratio) => patch({ ratio })} />;
  const res = <Pill label="Resolution" icon={ic(<path d="M12 3l8 6-8 12L4 9z" />)} options={video ? RESOLUTIONS : IMAGE_RESOLUTIONS} value={ms.res} onPick={(res) => patch({ res })} />;

  return (
    <div className="mx-auto flex w-[878px] max-w-full items-end gap-2">
      <div className="flex w-[70px] shrink-0 flex-col gap-1 rounded-[22px] bg-[#1b1c1f] p-1.5">
        {(["image", "video"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`flex h-[52px] flex-col items-center justify-center gap-1 rounded-2xl text-[12px] font-semibold capitalize transition ${mode === m ? "bg-[#2c2d31] text-white" : "text-[#85868b] hover:text-white"}`}>
            {m === "image" ? ic(<><rect x="4" y="4" width="16" height="16" rx="2.5" /><circle cx="9" cy="9" r="1.5" /><path d="M20 15l-4.5-4.5L6 20" /></>) : ic(<><rect x="3" y="6.5" width="13" height="11" rx="2.5" /><path d="M16 11l5-3v8l-5-3" /></>)}{m}
          </button>
        ))}
      </div>

      <div className="min-w-0 flex-1 rounded-3xl bg-[#1b1c1f] p-2 shadow-[0_20px_50px_rgba(0,0,0,.35)]">
        {video && (
          <div className="mb-1.5 grid grid-cols-[128px_repeat(4,minmax(0,1fr))] gap-1">
            <Chip label="References" value={`${ms.refs}/50`} onClick={toSignup} />
            <Chip label="Film setup" value={filmValue(setup)} art="film" onClick={() => open({ kind: "film", tab: "genre" })} />
            <Chip label="Camera" value={cameraValue(setup)} art="camera" onClick={() => open({ kind: "camera", tab: "setup" })} />
            <Chip label="Color palette" value={setup.palette ?? "Auto"} art="palette" onClick={() => open({ kind: "palette" })} />
            <Chip label="Lighting" value={setup.lighting} art="lighting" onClick={() => open({ kind: "lighting" })} />
          </div>
        )}
        <div className="flex gap-2 rounded-2xl bg-[#232427] p-2.5">
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
            <textarea value={ms.prompt} onChange={(e) => patch({ prompt: e.target.value })} rows={2} placeholder={video ? "Describe your scene - use @ to add characters & locations" : "Describe what you want to create..."} className="h-10 w-full resize-none bg-transparent px-1 text-[14px] leading-5 text-white outline-none placeholder:text-[#85868b]" />
            <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              {video ? (
                <div className="flex h-7 shrink-0 items-center rounded-lg bg-white/[0.06] text-[#c8c9cc]">
                  <button type="button" aria-label="Add references" onClick={toSignup} className="flex h-full w-7 items-center justify-center rounded-l-lg hover:bg-white/10 hover:text-white">{ic(<path d="M12 6v12M6 12h12" />)}</button>
                  <span className="h-3.5 w-px bg-white/15" />
                  <button type="button" aria-label="Mention" onClick={() => patch({ prompt: ms.prompt + "@" })} className="flex h-full w-7 items-center justify-center rounded-r-lg text-[14px] font-semibold hover:bg-white/10 hover:text-white">@</button>
                </div>
              ) : (
                <button type="button" aria-label="Add reference" onClick={toSignup} className={`${TOOL} w-7 justify-center px-0 text-[#c8c9cc]`}>{ic(<path d="M12 6v12M6 12h12" />)}</button>
              )}
              {video && <button type="button" aria-label="Start frame" onClick={() => refInput.current?.click()} className={`${TOOL} w-7 justify-center px-0 text-[#c8c9cc]`}>{ic(<><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" /><circle cx="12" cy="12" r="3" /></>)}</button>}
              {model}
              {video ? <>
                {res}{ratio}
                <Pill label="Duration" icon={ic(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>)} options={DURATIONS} value={ms.duration} onPick={(duration) => patch({ duration })} />
                <button type="button" onClick={() => patch({ audio: !ms.audio })} className={TOOL} aria-pressed={ms.audio}>
                  {ic(<path d="M4 9.5v5h3.5l5 4v-13l-5 4zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" opacity={ms.audio ? 1 : 0.4} />)}{ms.audio ? "On" : "Off"}
                </button>
                <div className="flex h-7 shrink-0 items-center gap-2 rounded-lg bg-white/[0.06] px-2 text-[13px] font-semibold text-white">
                  <button aria-label="Fewer" disabled={ms.batch <= 1} onClick={() => patch({ batch: ms.batch - 1 })} className="text-[#85868b] enabled:hover:text-white">−</button>
                  <span>{ms.batch}<span className="text-[#85868b]">/4</span></span>
                  <button aria-label="More" disabled={ms.batch >= 4} onClick={() => patch({ batch: ms.batch + 1 })} className="text-[#85868b] enabled:hover:text-white">+</button>
                </div>
              </> : <>
                {ratio}{res}
                <button type="button" aria-label="More settings" className={`${TOOL} ml-auto w-7 justify-center px-0`}><IconChevron s={14} /></button>
              </>}
            </div>
          </div>
          {!video && (
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => open({ kind: "character" })} className="relative flex h-[78px] w-20 shrink-0 items-end overflow-hidden rounded-2xl bg-gradient-to-b from-[#4a4b4e] to-[#26272a] p-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_6px_14px_rgba(0,0,0,.35)] transition hover:brightness-110">
                <span className="absolute left-2 top-2 flex size-6 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white">{ic(<path d="M12 7v10M7 12h10" />)}</span>
                <span className="whitespace-nowrap font-['Space_Grotesk',Inter,sans-serif] text-[13px] font-bold uppercase tracking-[-0.02em] text-white">Character</span>
              </button>
              <button type="button" onClick={() => open({ kind: "camera", tab: "setup" })} className="relative flex h-[78px] w-[120px] shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-b from-[#3d3e41] to-[#26272a] p-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_6px_14px_rgba(0,0,0,.35)] transition hover:brightness-110">
                <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#0a0a0d] shadow-[0_0_0_1px_rgba(255,255,255,.08)]"><span className="size-4 rounded-full bg-[radial-gradient(circle_at_40%_40%,#5a6ad0,#1b2457_55%,#05060f)]" /></span>
                <span className="text-[12px] font-semibold leading-4 text-white">Camera</span><span className="truncate text-[10px] leading-4 text-[#9a9ba0]">Lens · {setup.lens}</span>
              </button>
            </div>
          )}
          <button type="button" onClick={onGenerate} className={`cs-generate flex shrink-0 flex-col items-center justify-center self-stretch rounded-2xl text-[13px] font-bold uppercase ${video ? "w-[126px]" : "w-[120px]"}`} style={{ minHeight: video ? 76 : 78 }}>
            Generate<span className="mt-0.5 flex items-center gap-1 text-[13px] font-semibold normal-case">✦ {video ? 80 : "0.125"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const cameraValue = (s: Setup) => (s.camera === "Auto" && s.lens === "Auto" && s.aperture === "Auto" ? "Auto" : [s.camera, s.lens, s.aperture].filter((v) => v !== "Auto").join(", "));
const filmValue = (s: Setup) => (s.genre === "General" && s.era === "Auto" && s.tempo === "Auto" ? "Auto" : [s.genre !== "General" ? s.genre : null, s.era !== "Auto" ? s.era : null, s.tempo !== "Auto" ? s.tempo : null].filter(Boolean).join(", "));
