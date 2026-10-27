"use client";
import { useState, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Download, Heart, LayoutGrid } from "lucide-react";
import { DATE_PRESETS, startOfDay } from "../lib/history-filters";
import type { HistoryFilters } from "../types";
import { CheckIcon } from "../ui/Icons";

interface HistoryFilterMenuProps {
  value: HistoryFilters;
  onChange: (value: HistoryFilters) => void;
}

const ACTIVITY = [
  { id: "all", label: "All", Icon: LayoutGrid },
  { id: "liked", label: "Liked", Icon: Heart },
  { id: "downloaded", label: "Downloaded", Icon: Download },
] as const;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const cardClass =
  "rounded-2xl border border-white/5 bg-[#1b1d1f] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]";

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="px-2.5 pb-1.5 pt-2 text-xs font-medium text-white/50">{children}</p>;
}

function Option({ checked, onSelect, icon, children }: { checked: boolean; onSelect: () => void; icon?: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-sm font-semibold text-white transition-colors hover:bg-white/5"
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {checked && <CheckIcon className="size-4 shrink-0" />}
    </button>
  );
}

function RangeCalendar({ value, onChange }: { value: HistoryFilters["date"]; onChange: (range: { from: number; to: number }) => void }) {
  const range = typeof value === "object" ? value : null;
  const [month, setMonth] = useState(() => {
    const date = new Date(range?.from ?? Date.now());
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [pending, setPending] = useState<number | null>(null);
  const today = startOfDay(Date.now());
  const first = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
  const days = Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + i));
  const [from, to] = pending !== null ? [pending, pending] : range ? [range.from, range.to] : [null, null];

  const pick = (day: number) => {
    if (pending === null) {
      setPending(day);
      return;
    }
    onChange({ from: Math.min(pending, day), to: Math.max(pending, day) });
    setPending(null);
  };

  const shiftMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <div className="px-1.5 pb-1.5">
      <div className="flex h-9 items-center justify-between rounded-full border border-white/5 bg-white/[0.03] px-1">
        <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)} className="grid size-7 place-items-center rounded-full text-white/50 hover:bg-white/5 hover:text-white">
          <ChevronLeft className="size-3.5" />
        </button>
        <span className="text-sm font-semibold text-white">
          {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)} className="grid size-7 place-items-center rounded-full text-white/50 hover:bg-white/5 hover:text-white">
          <ChevronRight className="size-3.5" />
        </button>
      </div>
      <div role="grid" className="mt-2 grid grid-cols-7 gap-y-0.5 text-center">
        {WEEKDAYS.map((day, index) => (
          <span key={index} className="grid h-9 place-items-center text-sm font-semibold text-white/50">{day}</span>
        ))}
        {days.map((date) => {
          const time = date.getTime();
          const outside = date.getMonth() !== month.getMonth();
          const edge = time === from || time === to;
          const inside = from !== null && to !== null && time > from && time < to;
          return (
            <button
              key={time}
              type="button"
              aria-pressed={edge || inside}
              aria-label={date.toDateString()}
              onClick={() => pick(time)}
              className={`grid h-10 place-items-center rounded-xl text-base font-semibold transition-colors ${
                edge
                  ? "bg-white text-black"
                  : inside
                    ? "bg-white/10 text-white"
                    : time === today
                      ? "bg-white/10 text-white"
                      : outside
                        ? "text-white/25 hover:bg-white/5"
                        : "text-white hover:bg-white/5"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HistoryFilterMenu({ value, onChange }: HistoryFilterMenuProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const custom = typeof value.date === "object";

  return (
    <div className="absolute right-0 top-full z-40 mt-2.5 flex items-start gap-3">
      {dateOpen && (
        <div className="flex w-[310px] flex-col gap-3">
          <div role="menu" aria-label="Date" className={cardClass}>
            <SectionLabel>Date</SectionLabel>
            {DATE_PRESETS.map((preset) => (
              <Option key={preset.id} checked={value.date === preset.id} onSelect={() => onChange({ ...value, date: preset.id })}>
                {preset.label}
              </Option>
            ))}
          </div>
          <div className={cardClass}>
            <SectionLabel>Custom range</SectionLabel>
            <RangeCalendar value={value.date} onChange={(range) => onChange({ ...value, date: range })} />
          </div>
        </div>
      )}
      <div role="menu" aria-label="Filters" className={`w-[310px] ${cardClass}`}>
        <SectionLabel>Date</SectionLabel>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={dateOpen}
          onClick={() => setDateOpen((open) => !open)}
          className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-sm font-semibold text-white transition-colors hover:bg-white/5 ${dateOpen ? "bg-white/5" : ""}`}
        >
          <CalendarDays className="size-4 shrink-0 text-white/50" />
          <span className="flex-1">Date range</span>
          {value.date !== "all" && (
            <span className="truncate text-xs font-medium text-white/50">
              {custom ? "Custom" : DATE_PRESETS.find((preset) => preset.id === value.date)?.label}
            </span>
          )}
          <ChevronRight className="size-3.5 shrink-0 text-white/50" />
        </button>
        <div className="mx-2.5 my-1.5 h-px bg-white/5" />
        <SectionLabel>Activity</SectionLabel>
        {ACTIVITY.map(({ id, label, Icon }) => (
          <Option
            key={id}
            checked={value.activity === id}
            onSelect={() => onChange({ ...value, activity: id })}
            icon={<Icon className="size-4 shrink-0 text-white/50" />}
          >
            {label}
          </Option>
        ))}
      </div>
    </div>
  );
}
