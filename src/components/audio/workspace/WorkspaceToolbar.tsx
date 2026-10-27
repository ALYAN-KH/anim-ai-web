"use client";
import { useState } from "react";
import { useDismiss } from "../hooks/useDismiss";
import { activeFilterCount } from "../lib/history-filters";
import type { HistoryFilters, WorkspaceTab } from "../types";
import { BookIcon, FilterIcon, FolderIcon } from "../ui/Icons";
import { HistoryFilterMenu } from "./HistoryFilterMenu";

interface WorkspaceToolbarProps {
  tab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
  cardSize: number;
  onCardSizeChange: (size: number) => void;
}

const TABS = [
  { id: "history", label: "History", Icon: FolderIcon },
  { id: "how-it-works", label: "How it works", Icon: BookIcon },
] as const;

const thumbClass =
  "[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white";

function CardSizeSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <label className="hidden h-8 items-center rounded-[10px] border border-white/5 bg-[#131416] px-3 md:flex">
      <input
        type="range"
        aria-label="Card size"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ background: `linear-gradient(to right, rgba(255,255,255,0.3) ${value}%, rgba(255,255,255,0.1) ${value}%)` }}
        className={`h-1 w-20 cursor-pointer appearance-none rounded-full outline-none ${thumbClass}`}
      />
    </label>
  );
}

export function WorkspaceToolbar({
  tab,
  onTabChange,
  filters,
  onFiltersChange,
  cardSize,
  onCardSizeChange,
}: WorkspaceToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useDismiss<HTMLDivElement>(filtersOpen, () => setFiltersOpen(false));
  const count = activeFilterCount(filters);

  return (
    <div className="flex shrink-0 items-center justify-between gap-3">
      <div
        role="tablist"
        aria-label="Workspace view"
        className="flex h-10 items-center gap-1 rounded-xl border border-white/5 bg-[#131416] p-0.5"
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(id)}
              className={`flex h-8 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border border-white/5 bg-white/[0.08] text-white shadow-[0_2px_2px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.05)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              <span className="px-1">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <CardSizeSlider value={cardSize} onChange={onCardSizeChange} />
        <div ref={filtersRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="Filters"
            aria-haspopup="menu"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((current) => !current)}
            className={`flex h-8 items-center gap-1.5 rounded-[10px] border bg-[#131416] px-2.5 transition-colors hover:text-white ${
              filtersOpen ? "border-white/80 text-white" : "border-white/5 text-white/50"
            }`}
          >
            <FilterIcon className="size-4" />
            <span className="text-xs font-medium">Filters</span>
            {count > 0 && (
              <span className="grid size-4 place-items-center rounded-full bg-white text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </button>
          {filtersOpen && <HistoryFilterMenu value={filters} onChange={onFiltersChange} />}
        </div>
      </div>
    </div>
  );
}
