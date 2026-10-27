import {
  Check,
  Search
} from "lucide-react";
import {
  aspects,
  models,
  qualities
} from "../data";
import { AspectIcon, ModelGlyph } from "./icons";

export function ModelPicker({
  selectedId,
  query,
  onQueryChange,
  onSelect,
}: {
  selectedId: string;
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (id: string) => void;
}) {
  const visibleModels = models.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="soul-model-menu">
      <label className="flex h-[52px] shrink-0 items-center gap-3 border-b border-white/5 px-4 text-zinc-400">
        <Search size={18} />
        <input
          autoFocus
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-zinc-400"
        />
      </label>
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 sb">
        <p className="flex items-center gap-2 px-2 pb-2 pt-1 text-xs font-medium text-zinc-400">
          <span className="grid size-4 place-items-center text-lime">✦</span>
          Featured models
        </p>
        {visibleModels.map((m) => {
          const selected = m.id === selectedId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left ${selected ? "bg-white/[0.08]" : "hover:bg-white/5"}`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#2b2e31]">
                <ModelGlyph icon={m.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  {m.name}
                  {m.badge && (
                    <span className="rounded-md bg-lime px-1.5 py-px text-[9px] font-extrabold italic text-black">
                      {m.badge}
                    </span>
                  )}
                </span>
                <span className="block truncate text-xs text-zinc-500">
                  {m.desc}
                </span>
              </span>
              {selected && (
                <Check size={16} className="mr-2 shrink-0 text-lime" />
              )}
            </button>
          );
        })}
        {visibleModels.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            No models found
          </p>
        )}
      </div>
    </div>
  );
}

export interface MenuPosition {
  left: number;
  bottom: number;
}

export function AspectMenu({
  value,
  pos,
  onSelect,
}: {
  value: string;
  pos: MenuPosition;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{ left: pos.left, bottom: pos.bottom }}
      className="absolute z-50 w-[140px] rounded-xl border border-white/10 bg-[#1f2123] p-1.5 shadow-[0_16px_50px_#000]"
    >
      <p className="px-2.5 pb-1 pt-1.5 text-xs font-medium text-zinc-400">
        Aspect ratio
      </p>
      {aspects.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onSelect(a.id)}
          className={`flex h-[34px] w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-semibold text-white ${a.id === value ? "bg-white/[0.08]" : "hover:bg-white/5"}`}
        >
          <AspectIcon w={a.w} h={a.h} />
          <span className="flex-1 text-left">{a.id}</span>
          {a.id === value && <Check size={14} />}
        </button>
      ))}
    </div>
  );
}

export function QualityMenu({
  value,
  pos,
  onSelect,
}: {
  value: string;
  pos: MenuPosition;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{ left: pos.left, bottom: pos.bottom }}
      className="absolute z-50 w-[300px] rounded-xl border border-white/10 bg-[#1f2123] p-1.5 shadow-[0_16px_50px_#000]"
    >
      <p className="px-2.5 pb-1 pt-1.5 text-xs font-medium text-zinc-400">
        Quality
      </p>
      {qualities.map((q) => (
        <button
          key={q.id}
          type="button"
          onClick={() => onSelect(q.id)}
          className={`flex w-full items-center rounded-lg px-2.5 py-2 text-left ${q.id === value ? "bg-white/[0.08]" : "hover:bg-white/5"}`}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-white">
              {q.id}
            </span>
            <span className="block text-xs text-zinc-400">{q.desc}</span>
          </span>
          {q.id === value && <Check size={14} className="text-white" />}
        </button>
      ))}
    </div>
  );
}
