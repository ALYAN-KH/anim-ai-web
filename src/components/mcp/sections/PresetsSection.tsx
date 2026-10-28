"use client";
import { useMemo, useState } from "react";
import { PRESETS, PRESET_CATEGORIES } from "../config";
import { filterPresets } from "../lib/filter";
import { CategoryGlyph } from "../ui/CategoryGlyph";
import { SearchIcon } from "../ui/Icons";
import type { AgentId } from "../types";
import { PresetCard } from "./PresetCard";

interface PresetsSectionProps {
  agentParam: string;
  agentId: AgentId;
}

export function PresetsSection({ agentParam, agentId }: PresetsSectionProps) {
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
          className={`mcp-filter ${active ? "is-active" : ""}`}
        >
          <span className="mcp-filter-icon">
            <CategoryGlyph label={category.label} />
          </span>
          {category.label}
        </button>
      </li>
    );
  };

  return (
    <section aria-labelledby="mcp-presets-title" className="mx-auto w-full max-w-[1700px] px-4 pb-28 sm:px-7 lg:px-10">
      <h2
        id="mcp-presets-title"
        className="sr-only"
      >
        Discover what you can create
      </h2>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[424px_1fr] lg:gap-[50px]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <label className="flex h-[45px] w-full items-center gap-2.5 rounded-[15px] bg-white/10 p-2.5 text-white/50 focus-within:outline focus-within:outline-2 focus-within:outline-[#d1fe17]">
            <span className="sr-only">Search presets</span>
            <SearchIcon className="size-[22px] shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search presets"
              className="h-full min-w-0 flex-1 bg-transparent text-[17.5px] font-normal text-white placeholder:text-white/45 focus:outline-none"
            />
          </label>
          <nav aria-label="Preset categories" className="hide-scrollbar mt-5 overflow-x-auto lg:overflow-visible">
            <ul className="flex gap-2 lg:flex-col lg:gap-[2.5px]">{main.map(renderCategory)}</ul>
            <div className="my-3 hidden border-t border-white/5 lg:block" />
            <ul className="mt-2 flex gap-2 lg:mt-0 lg:flex-col lg:gap-[2.5px]">{plugins.map(renderCategory)}</ul>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-[35px]">
          {visible.length === 0 ? (
            <p className="py-16 text-center text-lg font-medium text-white/45">
              {query ? `No presets match “${query}”.` : "No presets in this category yet."}
            </p>
          ) : (
            visible.map((preset) => <PresetCard key={preset.id} preset={preset} agentParam={agentParam} agentId={agentId} />)
          )}
        </div>
      </div>
    </section>
  );
}
