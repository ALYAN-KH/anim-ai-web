"use client";

import { X, XCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { GLASS_SHADOW } from "../create/panel-styles";
import { FilterIcon, GridIcon } from "../shared/icons";
import { HistoryFilterMenu } from "./filter-menu";
import type { HistoryState } from "./history-state";
import { HistoryViewMenu } from "./view-menu";

export function HistoryControls({ state }: { state: HistoryState }) {
  const [menu, setMenu] = useState<{ kind: "filter" | "view"; anchor: DOMRect } | null>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const viewRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setMenu(null), []);
  const buttonClass = "inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[13px] font-medium transition hover:bg-white/[.07] hover:text-white";
  return <div className="flex items-center gap-2">
    <button ref={filterRef} type="button" aria-label="Filter" aria-haspopup="menu" aria-expanded={menu?.kind === "filter"} onClick={event => setMenu(menu?.kind === "filter" ? null : { kind: "filter", anchor: event.currentTarget.getBoundingClientRect() })} className={`${buttonClass} ${state.active || menu?.kind === "filter" ? "bg-white/[.08] text-white" : "bg-white/[.02] text-white/60"}`}><FilterIcon className="size-4" />Filter</button>
    <button ref={viewRef} type="button" aria-label="View" aria-haspopup="menu" aria-expanded={menu?.kind === "view"} onClick={event => setMenu(menu?.kind === "view" ? null : { kind: "view", anchor: event.currentTarget.getBoundingClientRect() })} className={`${buttonClass} ${menu?.kind === "view" ? "bg-white/[.08] text-white" : "bg-white/[.02] text-white/60"}`}><GridIcon className="size-4" />View</button>
    {menu?.kind === "filter" && <HistoryFilterMenu anchor={menu.anchor} trigger={filterRef} state={state} onClose={close} />}
    {menu?.kind === "view" && <HistoryViewMenu anchor={menu.anchor} trigger={viewRef} state={state} onClose={close} />}
  </div>;
}

export function HistoryFilterChips({ state }: { state: HistoryState }) {
  if (!state.active) return null;
  const { filters, setFilters } = state;
  const chips = [
    ...filters.models.map(model => ({ label: model, remove: () => state.toggleModel(model) })),
    ...(filters.date ? [{ label: filters.date.label, remove: () => setFilters(current => ({ ...current, date: null })) }] : []),
    ...(["hideFailed", "liked", "downloaded"] as const).filter(key => filters[key]).map(key => ({ label: { hideFailed: "Hide failed", liked: "Liked", downloaded: "Downloaded" }[key], remove: () => state.toggle(key) })),
  ];
  return <div aria-label="Selected filters" className="flex shrink-0 flex-wrap items-center gap-1.5 px-4 pb-2 pt-1">
    {chips.map(chip => <span key={chip.label} className="flex h-7 items-center gap-1 rounded-md bg-white/[.05] pl-2.5 pr-1 text-xs font-medium text-white"><span>{chip.label}</span><button type="button" aria-label={`Remove ${chip.label} filter`} onClick={chip.remove} className="grid size-4 place-items-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"><X className="size-3" /></button></span>)}
    <button type="button" onClick={state.clear} className="h-6 rounded-md px-1.5 text-xs text-white/45 hover:text-white">Clear filter</button>
  </div>;
}

export function HistoryNoMatches({ onClear }: { onClear: () => void }) {
  return <div className="flex min-h-full items-center justify-center p-8 text-center">
    <div className="history-no-matches-enter flex flex-col items-center gap-3">
    <span className={`relative isolate mb-1 grid size-12 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[.04] text-white/45 ${GLASS_SHADOW}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl mix-blend-overlay" style={{ background: "linear-gradient(rgba(197, 197, 197, 0.16) 0%, rgba(129, 129, 129, 0) 46.27%, rgba(255, 255, 255, 0.16) 100%)" }} />
      <svg className="relative size-6" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.25 20.25L16.1265 16.1265M16.1265 16.1265C17.4385 14.8145 18.25 13.002 18.25 11C18.25 6.99594 15.0041 3.75 11 3.75C6.99594 3.75 3.75 6.99594 3.75 11C3.75 15.0041 6.99594 18.25 11 18.25C13.002 18.25 14.8145 17.4385 16.1265 16.1265Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
    <h2 className="text-lg font-semibold text-white">No matches</h2><p className="text-sm text-white/45">No videos match your filters</p>
    <button type="button" onClick={onClear} className="flex h-8 items-center gap-2 rounded-xl bg-white/[.05] px-2.5 text-xs font-semibold text-white transition hover:bg-white/10"><XCircle className="size-3.5" />Clear filters</button>
    </div>
  </div>;
}
