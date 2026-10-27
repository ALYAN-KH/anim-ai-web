"use client";

import { useState } from "react";
import { FEATURED_MODELS, MODEL_GROUPS, type ModelIconKey } from "../models/model-data";

export type HistoryLayout = "list" | "grid" | "masonry";
export type DateRange = { label: string; start: string; end: string };
export type HistoryFilters = { models: string[]; date: DateRange | null; hideFailed: boolean; liked: boolean; downloaded: boolean };
export const EMPTY_FILTERS: HistoryFilters = { models: [], date: null, hideFailed: false, liked: false, downloaded: false };

const referenceModels: { name: string; icon: ModelIconKey }[] = [
  { name: "Cinema Studio 2.5", icon: "higgsfield" },
  { name: "Cinema Studio 3.0", icon: "higgsfield" },
  { name: "Cinema Studio 3.5", icon: "higgsfield" },
  { name: "Cinema Studio Video 4.0", icon: "higgsfield" },
  { name: "FLUX.3 Video", icon: "flux" },
  { name: "FLUX.3 Video Edit", icon: "flux" },
  { name: "Gemini Omni Flash", icon: "google" },
  { name: "Gemini Omni Flash 1.1", icon: "google" },
  { name: "Google Veo 3", icon: "google" },
];
export const HISTORY_MODELS = [...new Map([
  ...referenceModels,
  ...FEATURED_MODELS.map(model => ({ name: model.name, icon: model.icon ?? "higgsfield" as ModelIconKey })),
  ...MODEL_GROUPS.flatMap(group => group.models.map(model => ({ name: model.name, icon: model.icon ?? group.icon }))),
].map(model => [model.name, model])).values()];

export function useHistoryState() {
  const [filters, setFilters] = useState<HistoryFilters>(EMPTY_FILTERS);
  const [layout, setLayout] = useState<HistoryLayout>("masonry");
  const [splitByDate, setSplitByDate] = useState(true);
  const [cardSize, setCardSize] = useState(4);
  const active = filters.models.length > 0 || Boolean(filters.date) || filters.hideFailed || filters.liked || filters.downloaded;
  const toggleModel = (name: string) => setFilters(current => ({ ...current, models: current.models.includes(name) ? current.models.filter(model => model !== name) : [...current.models, name] }));
  const toggle = (key: "hideFailed" | "liked" | "downloaded") => setFilters(current => ({ ...current, [key]: !current[key] }));
  const clear = () => setFilters(EMPTY_FILTERS);
  return { filters, setFilters, layout, setLayout, splitByDate, setSplitByDate, cardSize, setCardSize, active, toggleModel, toggle, clear };
}

export type HistoryState = ReturnType<typeof useHistoryState>;
