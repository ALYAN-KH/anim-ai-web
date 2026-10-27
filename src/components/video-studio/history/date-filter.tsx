"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import type { DateRange } from "./history-state";
import { MENU_CLASS, ROW_CLASS, SELECTED_CLASS } from "./menu-primitives";
import { ViewCheckIcon } from "./view-icons";

const PRESETS = ["All Period", "Today", "Last 7 days", "Last 30 days"] as const;
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parse = (date: string) => new Date(`${date}T12:00:00`);
const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1, 12);

export function DateFilter({ value, onChange }: { value: DateRange | null; onChange: (range: DateRange | null) => void }) {
  const today = iso(new Date());
  const [month, setMonth] = useState(() => firstOfMonth(value ? parse(value.start) : new Date()));
  const [draft, setDraft] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const first = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay(), 12);
  const days = Array.from({ length: 42 }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index, 12));
  const title = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const custom = value && !PRESETS.some(label => label === value.label) ? value : null;
  const start = draft ? (hovered && hovered < draft ? hovered : draft) : custom?.start;
  const end = draft ? (hovered && hovered > draft ? hovered : draft) : custom?.end;
  const selectPreset = (label: typeof PRESETS[number]) => {
    setDraft(null); setHovered(null);
    if (label === "All Period") { onChange(null); return; }
    const from = parse(today);
    if (label === "Last 7 days") from.setDate(from.getDate() - 6);
    if (label === "Last 30 days") from.setDate(from.getDate() - 29);
    onChange({ label, start: iso(from), end: today });
    setMonth(firstOfMonth(new Date()));
  };
  const selectDay = (date: string) => {
    if (!draft) { setDraft(date); setHovered(null); return; }
    const from = date < draft ? date : draft;
    const to = date < draft ? draft : date;
    onChange({ label: from === to ? from : `${from} – ${to}`, start: from, end: to });
    setDraft(null); setHovered(null);
  };
  const navigateDay = (event: KeyboardEvent<HTMLButtonElement>, day: Date) => {
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const delta = offsets[event.key];
    if (delta === undefined) return;
    event.preventDefault(); event.stopPropagation();
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + delta, 12);
    if (iso(next) > today) return;
    setMonth(firstOfMonth(next));
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso(next)}"]`)?.focus());
  };

  return <div role="group" aria-label="Date range" className="space-y-1">
    <div className={MENU_CLASS}>
      <p className="px-2 pb-2 pt-2 text-xs text-white/50">Date</p>
      {PRESETS.map(label => {
        const selected = (value?.label ?? "All Period") === label;
        return <button key={label} type="button" aria-pressed={selected} onClick={() => selectPreset(label)} className={`${ROW_CLASS} ${selected ? SELECTED_CLASS : ""}`}>{label}{selected && <ViewCheckIcon className="ml-auto size-5" />}</button>;
      })}
    </div>
    <div className={`${MENU_CLASS} px-4 pb-4 pt-3`}>
      <p className="mb-5 text-xs text-white/50">Custom range</p>
      <div className="mb-2 flex h-[34px] items-center justify-between rounded-full border border-white/10 px-2">
        <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))} className="grid size-6 place-items-center rounded-full text-white/45 hover:bg-white/5 hover:text-white"><ChevronLeft className="size-3" /></button>
        <span aria-live="polite" className="text-xs font-semibold text-white">{title}</span>
        <button type="button" aria-label="Next month" disabled={iso(month).slice(0, 7) >= today.slice(0, 7)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))} className="grid size-6 place-items-center rounded-full text-white/45 hover:bg-white/5 hover:text-white disabled:opacity-30"><ChevronRight className="size-3" /></button>
      </div>
      <div ref={gridRef} role="grid" aria-label={title} className="grid grid-cols-7 text-center" onMouseLeave={() => setHovered(null)}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={index} role="columnheader" className="grid h-8 place-items-center text-xs font-medium text-white/45">{day}</span>)}
        {days.map(day => {
          const date = iso(day), currentMonth = day.getMonth() === month.getMonth(), future = date > today;
          const endpoint = date === start || date === end;
          const inside = Boolean(start && end && date >= start && date <= end);
          return <button key={date} type="button" role="gridcell" data-date={date} aria-label={day.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} aria-selected={inside} aria-current={date === today ? "date" : undefined} disabled={future} onClick={() => selectDay(date)} onMouseEnter={() => { if (draft) setHovered(date); }} onKeyDown={event => navigateDay(event, day)} className={`relative grid h-[34px] place-items-center text-sm font-semibold outline-none transition-colors focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/60 ${inside ? "bg-white/10" : "hover:bg-white/5"} ${endpoint ? "rounded-[9px] bg-white/15" : inside ? "rounded-none" : "rounded-[9px]"} ${future ? "text-white/15" : currentMonth ? "text-white" : "text-white/30"}`}>
            <span className={`grid size-8 place-items-center rounded-[9px] ${date === today && !inside ? "bg-white/10" : ""}`}>{day.getDate()}</span>
          </button>;
        })}
      </div>
      <span className="sr-only" role="status">{draft ? "Select the end date" : "Select a start date and an end date"}</span>
    </div>
  </div>;
}
