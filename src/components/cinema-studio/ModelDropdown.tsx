"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CINEMA_MODELS, FEATURED_MODELS, IMAGE_MODELS, type Mode, type ModelEntry } from "./data";
import { LOGO } from "./svg-markup";
import { IconSearch } from "./ui";

const BadgeEl = ({ b }: { b: "TOP" | "NEW" }) => (
  <span className={`rounded-[4px] px-1.5 py-px text-[11px] font-bold italic leading-4 ${b === "TOP" ? "bg-gradient-to-r from-[#3a7bff] to-[#a24bff] text-white" : "bg-[#d1fe17] text-black"}`} style={{ fontFamily: "Space Grotesk,sans-serif", transform: "skewX(-8deg)" }}>{b}</span>
);
const ModelIcon = ({ cinema }: { cinema?: boolean }) => (
  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-[#a2a3a8]">
    {cinema ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 16c3-9 7-9 9-4s4 4 7-3" /></svg>
      : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="9" width="3" height="8" rx="1" /><rect x="10.5" y="5" width="3" height="12" rx="1" /><rect x="16" y="11" width="3" height="6" rx="1" /></svg>}
  </span>
);
const Chip = ({ children, gem }: { children: React.ReactNode; gem?: boolean }) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[12px] font-medium text-[#a2a3a8]">
    {gem && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 6-8 12L4 9z" /></svg>}{children}
  </span>
);

export function ModelDropdown({ mode, value, onPick, onClose }: { mode: Mode; value: string; onPick: (m: ModelEntry) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", d); window.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); window.removeEventListener("keydown", k); };
  }, [onClose]);
  const match = (m: ModelEntry) => m.name.toLowerCase().includes(q.toLowerCase());
  const groups = useMemo(() => (mode === "video"
    ? [{ title: "", items: CINEMA_MODELS.filter(match) }, { title: "Featured models", items: FEATURED_MODELS.filter(match) }]
    : [{ title: "", items: IMAGE_MODELS.filter(match) }]), [mode, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const row = (m: ModelEntry) => (
    <button key={m.id} onClick={() => onPick(m)} className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.07] ${m.id === value ? "bg-white/[0.07]" : ""}`}>
      <ModelIcon cinema={m.cinema} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[15px] font-semibold text-white">{m.name}{m.badge && <BadgeEl b={m.badge} />}</span>
        {m.desc && <span className="block truncate text-[13px] text-[#8d8e93]">{m.desc}</span>}
        {m.res && <span className="mt-1 flex gap-1.5"><Chip gem>{m.res}</Chip><Chip>◷ {m.dur}</Chip></span>}
      </span>
    </button>
  );
  return (
    <div ref={ref} className="cs-scope absolute bottom-full left-0 z-50 mb-3 w-[400px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#26272a]/95 shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop-blur-xl">
      <label className="flex h-[52px] items-center gap-3 border-b border-white/[0.06] px-4 text-[#9a9ba0]">
        <IconSearch s={20} />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full bg-transparent text-[16px] text-white outline-none placeholder:text-[#8d8e93]" />
      </label>
      <div className="max-h-[360px] overflow-y-auto p-2">
        {groups.map((g) => g.items.length > 0 && (
          <div key={g.title || "main"}>
            {g.title && <div className="flex items-center gap-2 px-2 pb-1 pt-3 text-[14px] font-medium text-[#8d8e93]"><span className="text-[15px]">✦</span>{g.title}</div>}
            {g.items.map(row)}
          </div>
        ))}
        {groups.every((g) => !g.items.length) && <p className="py-8 text-center text-sm text-[#8d8e93]">No models found</p>}
      </div>
    </div>
  );
}
export const ModelLogo = ({ size = 18 }: { size?: number }) => (
  <span aria-hidden className="inline-flex shrink-0 [&>svg]:size-full" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: LOGO }} />
);
