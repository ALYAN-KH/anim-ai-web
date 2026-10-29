"use client";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const IconClose = ({ s = 20 }: { s?: number }) => (<svg width={s} height={s} viewBox="0 0 24 24" {...p}><path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" /></svg>);
export const IconChevron = ({ dir = "right", s = 16 }: { dir?: "left" | "right" | "up" | "down"; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" {...p} style={{ transform: `rotate(${{ right: 0, down: 90, left: 180, up: 270 }[dir]}deg)` }}><path d="M6 3.5L10.5 8 6 12.5" /></svg>
);
export const IconSearch = ({ s = 18 }: { s?: number }) => (<svg className="shrink-0" aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20L16.1265 16.1265M16.1265 16.1265C17.4385 14.8145 18.25 13.002 18.25 11C18.25 6.99594 15.0041 3.75 11 3.75C6.99594 3.75 3.75 6.99594 3.75 11C3.75 15.0041 6.99594 18.25 11 18.25C13.002 18.25 14.8145 17.4385 16.1265 16.1265Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
export const IconSort = ({ s = 18 }: { s?: number }) => (<svg className="shrink-0" aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 5.75H18.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.75 12H11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.75 18.25H9.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 10.75V18.5M14.75 15.75L18 19L21.25 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);

export function Modal({ title, onClose, onReset, onBack, children, width = 800, height = 504, contentHeight }: {
  title?: string; onClose: () => void; onReset?: () => void; onBack?: () => void; children: ReactNode; width?: number; height?: number; contentHeight?: number;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return createPortal(
    <div className="cs-scope fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-[3px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label={title} className="cs-modal flex flex-col overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#212225] p-2 shadow-[0_24px_80px_rgba(0,0,0,.6)]" style={contentHeight ? { width: `min(${width}px,94vw)` } : { width: `min(${width}px,94vw)`, height: `min(${height}px,92vh)` }}>
        {title && (
          <div className={`flex h-12 shrink-0 items-center justify-between pr-1 ${onBack ? "pl-1" : "pl-3"}`}>
            <div className="flex min-w-0 items-center gap-2">{onBack && <button aria-label="Back" onClick={onBack} className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"><IconChevron dir="left" s={18} /></button>}<h2 className="truncate text-[16px] font-semibold text-white">{title}</h2></div>
            <div className="flex items-center gap-2">
              {onReset && <button onClick={onReset} className="h-9 rounded-full bg-white/10 px-4 text-[14px] font-semibold text-white transition hover:bg-white/15">Reset all</button>}
              <button aria-label="Close" onClick={onClose} className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"><IconClose s={18} /></button>
            </div>
          </div>
        )}
        <div className={`relative flex min-h-0 overflow-hidden ${contentHeight ? "gap-px rounded-[20px]" : "flex-1 rounded-[22px] bg-[#27282b]"}`} style={contentHeight ? { height: contentHeight } : undefined}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function Flutes({ hues, tall }: { hues: [string, string, string]; tall?: boolean }) {
  return (
    <div className={`cs-flutes ${tall ? "cs-flutes-tall" : ""}`} style={{ ["--h1" as string]: hues[0], ["--h2" as string]: hues[1], ["--h3" as string]: hues[2] }}>
      <i /><i /><i /><b />
    </div>
  );
}

export function Toolbar({ search, setSearch, sort, setSort, sorts }: { search: string; setSearch: (v: string) => void; sort: string; setSort: (v: string) => void; sorts: string[] }) {
  return (
    <div className="relative flex items-center gap-1 text-[#9a9ba0]">
      <SortMenu sort={sort} setSort={setSort} sorts={sorts} />
      <SearchBox search={search} setSearch={setSearch} />
    </div>
  );
}
function SortMenu({ sort, setSort, sorts }: { sort: string; setSort: (v: string) => void; sorts: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[14px] font-medium hover:text-white"><IconSort s={16} />Sort by</button>
      {open && (
        <div className="absolute right-0 top-9 z-10 min-w-[150px] rounded-xl border border-white/10 bg-[#303135] p-1 shadow-xl">
          {sorts.map((s) => (
            <button key={s} onClick={() => { setSort(s); setOpen(false); }} className={`block w-full rounded-lg px-3 py-1.5 text-left text-[13px] hover:bg-white/10 ${s === sort ? "text-lime" : "text-white"}`}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}
function SearchBox({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  if (!open && !search) return <button aria-label="Search" onClick={() => setOpen(true)} className="flex size-8 items-center justify-center rounded-lg hover:text-white"><IconSearch s={16} /></button>;
  return (
    <div className="flex h-8 items-center gap-1 rounded-lg bg-white/10 px-2 text-white">
      <IconSearch s={14} />
      <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} onBlur={() => !search && setOpen(false)} placeholder="Search…" className="w-28 bg-transparent text-[13px] outline-none placeholder:text-[#8a8b90]" />
    </div>
  );
}
