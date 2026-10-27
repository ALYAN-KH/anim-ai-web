"use client";

import { CalendarDays, Check, ChevronRight, Download, EyeOff, Heart, Search, Sparkles } from "lucide-react";
import { useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MODEL_ICONS } from "../models/model-icons";
import { DateFilter } from "./date-filter";
import { HISTORY_MODELS, type HistoryState } from "./history-state";
import { HistoryToggle, MENU_CLASS, ROW_CLASS, SELECTED_CLASS, menuPosition, useHistoryMenu } from "./menu-primitives";

export function HistoryFilterMenu({ anchor, trigger, state, onClose }: { anchor: DOMRect; trigger: RefObject<HTMLButtonElement>; state: HistoryState; onClose: () => void }) {
  const [submenu, setSubmenu] = useState<"models" | "dates" | null>(null);
  const [search, setSearch] = useState("");
  const ref = useHistoryMenu(onClose, trigger);
  const position = menuPosition(anchor, 220, 280);
  const width = Math.min(submenu === "models" ? 256 : 268, window.innerWidth - 16);
  const left = position.left >= width + 16 ? position.left - width - 8 : Math.min(position.left + position.width + 8, window.innerWidth - width - 8);
  const top = Math.max(8, Math.min(position.top + 44, window.innerHeight - (submenu === "dates" ? 540 : 464)));
  const { filters, setFilters } = state;
  const matches = HISTORY_MODELS.filter(model => model.name.toLowerCase().includes(search.toLowerCase()));
  const modelLabel = filters.models.length === 1 ? filters.models[0] : filters.models.length ? `${filters.models.length} models` : "All models";

  return createPortal(<div ref={ref} className="fixed z-[150]" style={position}>
    <div role="menu" aria-label="History filters" className={MENU_CLASS}>
      <p className="px-2 pb-1 pt-2 text-xs text-white/50">Type</p>
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={submenu === "models"} onMouseEnter={() => setSubmenu("models")} onClick={() => setSubmenu("models")} className={`${ROW_CLASS} ${submenu === "models" || filters.models.length ? SELECTED_CLASS : ""}`}><Sparkles className="size-5 shrink-0" /><span className="min-w-0 flex-1 truncate">{modelLabel}</span><ChevronRight className="size-4 shrink-0" /></button>
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={submenu === "dates"} onMouseEnter={() => setSubmenu("dates")} onClick={() => setSubmenu("dates")} className={`${ROW_CLASS} ${submenu === "dates" || filters.date ? SELECTED_CLASS : ""}`}><CalendarDays className="size-5 shrink-0" /><span className="min-w-0 flex-1 truncate">{filters.date?.label ?? "Date range"}</span><ChevronRight className="size-4 shrink-0" /></button>
      <button type="button" role="switch" aria-label="Hide failed" aria-checked={filters.hideFailed} onMouseEnter={() => setSubmenu(null)} onClick={() => state.toggle("hideFailed")} className={`${ROW_CLASS} ${filters.hideFailed ? SELECTED_CLASS : ""}`}><EyeOff className="size-5 shrink-0" />Hide failed<HistoryToggle checked={filters.hideFailed} /></button>
      <div className="my-1 h-px bg-white/[.04]" /><p className="px-2 py-2 text-xs text-white/50">Activity</p>
      <button type="button" role="menuitemcheckbox" aria-checked={filters.liked} onMouseEnter={() => setSubmenu(null)} onClick={() => state.toggle("liked")} className={`${ROW_CLASS} ${filters.liked ? SELECTED_CLASS : ""}`}><Heart className="size-5" />Liked{filters.liked && <Check className="ml-auto size-4" />}</button>
      <button type="button" role="menuitemcheckbox" aria-checked={filters.downloaded} onMouseEnter={() => setSubmenu(null)} onClick={() => state.toggle("downloaded")} className={`${ROW_CLASS} ${filters.downloaded ? SELECTED_CLASS : ""}`}><Download className="size-5" />Downloaded{filters.downloaded && <Check className="ml-auto size-4" />}</button>
    </div>
    {submenu && <div className={`${submenu === "models" ? MENU_CLASS + " max-h-[min(456px,calc(100dvh-16px))]" : "max-h-[calc(100dvh-16px)]"} fixed overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`} style={{ left, top, width }}>
      {submenu === "models" ? <div role="menu" aria-label="Filter models">
        <p className="px-2 py-2 text-xs text-white/50">Models</p>
        <div className="relative mb-1"><input type="search" aria-label="Search models" placeholder="Search models" value={search} onChange={event => setSearch(event.target.value)} className="h-10 w-full rounded-xl bg-white/[.05] pl-3 pr-8 text-sm outline-none placeholder:text-white/45 focus:ring-1 focus:ring-white/20" /><Search className="pointer-events-none absolute right-3 top-3 size-3.5 text-white/45" /></div>
        <button type="button" role="menuitemcheckbox" aria-checked={!filters.models.length} onClick={() => setFilters(current => ({ ...current, models: [] }))} className={`${ROW_CLASS} ${!filters.models.length ? SELECTED_CLASS : ""}`}>All models{!filters.models.length && <Check className="ml-auto size-4" />}</button>
        {matches.map(model => {
          const selected = filters.models.includes(model.name);
          return <button key={model.name} type="button" role="menuitemcheckbox" aria-checked={selected} onClick={() => state.toggleModel(model.name)} className={`${ROW_CLASS} ${selected ? SELECTED_CLASS : ""}`}><span className="shrink-0">{MODEL_ICONS[model.icon]({ className: "size-5" })}</span><span className="min-w-0 flex-1">{model.name}</span><span className={`grid size-[18px] shrink-0 place-items-center rounded-md border ${selected ? "border-white/50 bg-white/15" : "border-white/10"}`}>{selected && <Check className="size-3" />}</span></button>;
        })}
        {!matches.length && <p className="px-2 py-4 text-xs text-white/45">No models found</p>}
      </div> : <DateFilter value={filters.date} onChange={date => setFilters(current => ({ ...current, date }))} />}
    </div>}
  </div>, document.body);
}
