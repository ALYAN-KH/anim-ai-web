import type { AudioHistoryItem, DatePreset, HistoryFilters } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_FILTERS: HistoryFilters = { date: "all", activity: "all" };

export const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "all", label: "All period" },
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

export const startOfDay = (time: number) => {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export function activeFilterCount(filters: HistoryFilters) {
  return Number(filters.date !== "all") + Number(filters.activity !== "all");
}

function dateBounds(date: HistoryFilters["date"], now = Date.now()): [number, number] {
  if (typeof date === "object") return [startOfDay(date.from), startOfDay(date.to) + DAY_MS - 1];
  const today = startOfDay(now);
  if (date === "today") return [today, Infinity];
  if (date === "7d") return [today - 6 * DAY_MS, Infinity];
  if (date === "30d") return [today - 29 * DAY_MS, Infinity];
  return [-Infinity, Infinity];
}

export function applyHistoryFilters(items: AudioHistoryItem[], filters: HistoryFilters) {
  const [from, to] = dateBounds(filters.date);
  return items.filter(
    (item) =>
      item.createdAt >= from &&
      item.createdAt <= to &&
      (filters.activity === "all" ||
        (filters.activity === "liked" ? item.liked : item.downloaded)),
  );
}
