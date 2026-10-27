"use client";
import { useMemo, useState } from "react";
import { PRESETS, PRESET_CATEGORIES } from "../config";
import { filterPresets } from "../lib/filter";
import { CategoryIcon, SearchIcon } from "../ui/Icons";
import { PresetCard } from "./PresetCard";

interface PresetsSectionProps {
  agentParam: string;
}

export function PresetsSection({ agentParam }: PresetsSectionProps) {
  const [categoryId, setCategoryId] = useState("popular");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => filterPresets(PRESETS, categoryId, query), [categoryId, query]);
  const main = PRESET_CATEGORIES.filter((category) => category.group === "main");
  const plugins = PRESET_CATEGORIES.filter((category) => category.group === "plugins");

  const renderCategory = (category: (typeof PRESET_CATEGORIES)[number]) => {
    const active = category.id === categoryId && !query;
    return (
      <li key={category.id}>
        <button
          type="button"
          aria-pressed={active}
          onClick={() => {
            setCategoryId(category.id);
            setQuery("");
          }}
          className={`flex h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-lg font-semibold transition-colors ${
            active ? "text-[#d1fe17]" : "text-white hover:text-[#d1fe17]/80"
          }`}
        >
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${
              active ? "bg-[#d1fe17] text-black" : "bg-[#2a2c2f] text-white/80"
            }`}
          >
            <CategoryIcon name={category.icon} className="size-5" />
          </span>
          {category.label}
        </button>
      </li>
    );
  };

  return (
    <section aria-labelledby="mcp-presets-title" className="mx-auto w-full max-w-[1720px] px-4 pb-28 sm:px-7 lg:px-[109px]">
      <h2
        id="mcp-presets-title"
        className="mb-10 text-center font-grotesk text-4xl font-bold uppercase leading-10 tracking-[-0.03em] text-white sm:text-5xl"
      >
        Discover what you can create
      </h2>

      <div className="grid gap-8 lg:grid-cols-[424px_1fr] lg:gap-[65px]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <label className="relative block">
            <span className="sr-only">Search presets</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search presets"
              className="h-11 w-full rounded-2xl bg-[#17181a] pl-12 pr-4 text-base font-medium text-white placeholder:text-white/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            />
          </label>
          <nav aria-label="Preset categories" className="hide-scrollbar mt-5 overflow-x-auto lg:overflow-visible">
            <ul className="flex gap-2 lg:flex-col lg:gap-0">{main.map(renderCategory)}</ul>
            <div className="my-3 hidden border-t border-white/5 lg:block" />
            <ul className="mt-2 flex gap-2 lg:mt-0 lg:flex-col lg:gap-0">{plugins.map(renderCategory)}</ul>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-14">
          {visible.length === 0 ? (
            <p className="py-16 text-center text-lg font-medium text-white/45">
              {query ? `No presets match “${query}”.` : "No presets in this category yet."}
            </p>
          ) : (
            visible.map((preset) => <PresetCard key={preset.id} preset={preset} agentParam={agentParam} />)
          )}
        </div>
      </div>
    </section>
  );
}
