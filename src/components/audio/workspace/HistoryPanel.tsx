import { modeLabel } from "../config";
import { activeFilterCount, applyHistoryFilters } from "../lib/history-filters";
import type { AudioHistoryItem, AudioMode, HistoryFilters } from "../types";
import { FilterIcon } from "../ui/Icons";
import { HowItWorks } from "./HowItWorks";

interface HistoryPanelProps {
  mode: AudioMode;
  items: AudioHistoryItem[];
  filters: HistoryFilters;
  cardSize: number;
  onClearFilters: () => void;
}

const STATUS_LABEL: Record<AudioHistoryItem["status"], string> = {
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

export function HistoryPanel({ mode, items, filters, cardSize, onClearFilters }: HistoryPanelProps) {
  const filtered = activeFilterCount(filters) > 0;
  const visible = applyHistoryFilters(items, filters);

  if (items.length === 0 && !filtered) return <HowItWorks mode={mode} />;

  if (visible.length === 0) {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="mb-1 grid size-12 place-items-center rounded-full bg-white/5 text-white/50">
          <FilterIcon className="size-5" />
        </span>
        <p className="text-lg font-semibold text-white">No generations match these filters</p>
        <p className="max-w-[460px] text-base font-medium text-white/50">
          Try a wider date range, or clear the filters to see your whole history.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-3 rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <ul
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.round(220 + cardSize * 3)}px, 1fr))` }}
    >
      {visible.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#131416] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-white/50">
                {modeLabel(item.mode)} · {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70">
              {STATUS_LABEL[item.status]}
            </span>
          </div>
          {item.audioUrl && <audio controls src={item.audioUrl} className="w-full" />}
        </li>
      ))}
    </ul>
  );
}
