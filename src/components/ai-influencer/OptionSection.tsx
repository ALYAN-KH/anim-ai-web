"use client";

import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { CardStyle, CharacterOption, CharacterSection } from "./data";
import { Icon } from "./Icon";

const FRAME = "group/option relative min-w-0 w-full overflow-hidden text-left text-xs font-medium leading-4 transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime motion-safe:active:[transform:scale(0.96)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40";
const TILE = `${FRAME} flex rounded-2xl border-2 p-1 hover:bg-white/5`;
const TILE_STATE = (on: boolean) => (on ? "border-lime text-lime" : "border-white/[0.08] text-[#898a8b]");

type CardProps = { option: CharacterOption; style: CardStyle; pressed: boolean; blocked?: string; onClick: () => void };

export function OptionCard({ option, style, pressed, blocked, onClick }: CardProps) {
  const common = { type: "button" as const, "aria-pressed": pressed, "aria-label": option.label, title: blocked ?? option.label, disabled: Boolean(blocked), onClick };
  if (style === "tier")
    return (
      <button {...common} className={`${FRAME} flex h-[104px] items-end justify-center rounded-lg bg-white p-1 text-[#1a1a1a] ${pressed ? "shadow-[inset_0_0_0_4px_#d1fe17]" : ""}`}>
        <img alt="" loading="lazy" decoding="async" src={option.image} className="absolute left-1/2 top-3 size-[68px] [transform:translateX(-50%)] object-contain" />
        <span className="relative w-full rounded px-1 py-0.5 text-center text-xs font-medium text-[#1a1a1a] drop-shadow-sm backdrop-blur-md">{option.label}</span>
      </button>
    );
  if (style === "color")
    return (
      <button {...common} className={`${FRAME} flex h-20 flex-col items-stretch gap-1 rounded-xl border-2 p-1 ${pressed ? "border-lime bg-lime/10" : "border-transparent hover:bg-white/5"}`}>
        <span aria-hidden="true" className="flex h-12 w-full items-center justify-center rounded-lg" style={{ background: option.swatch }}>
          {pressed && <CircleCheck className="size-5 text-[#1a1a1a] [filter:drop-shadow(0_0_1px_#d1fe17)]" strokeWidth={1.75} />}
        </span>
        <span className="w-full text-center text-xs font-medium leading-4 text-white">{option.label}</span>
      </button>
    );
  if (style === "text")
    return (
      <button {...common} className={`${TILE} h-10 items-center justify-center ${TILE_STATE(pressed)}`}>
        <span className="relative w-full">{option.label}</span>
      </button>
    );
  if (style === "corner")
    return (
      <button {...common} className={`${TILE} aspect-square items-end justify-start ${TILE_STATE(pressed)}`}>
        <img alt="" loading="lazy" decoding="async" src={option.image} className="absolute right-1.5 top-1.5 size-10 object-contain" />
        <span className="relative w-full">{option.label}</span>
      </button>
    );
  return (
    <button {...common} className={`${TILE} aspect-square items-end justify-start ${TILE_STATE(pressed)}`}>
      <img alt="" loading="lazy" decoding="async" src={option.image} className="absolute inset-0 size-full object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7),transparent)] transition-opacity duration-150 group-hover/option:opacity-100 group-focus-visible/option:opacity-100 [@media(hover:hover)]:opacity-0" />
      <span className="relative w-full text-white drop-shadow-sm transition-opacity duration-150 group-hover/option:opacity-100 group-focus-visible/option:opacity-100 [@media(hover:hover)]:opacity-0">{option.label}</span>
    </button>
  );
}

type SectionProps = {
  section: CharacterSection;
  open: boolean;
  onToggleOpen: () => void;
  isPressed: (optionId: string) => boolean;
  blockedReason: (optionId: string) => string | undefined;
  onPick: (optionId: string) => void;
  /** Extra controls rendered before the options (the style-reference upload). */
  lead?: ReactNode;
};

/** One sidebar accordion: trigger with icon, label and count, and its option grid. */
export function OptionSection({ section, open, onToggleOpen, isPressed, blockedReason, onPick, lead }: SectionProps) {
  const panelId = `influencer-panel-${section.id}`;
  return (
    <div className="shrink-0 overflow-clip rounded-[20px] bg-white/5 p-1">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggleOpen}
          className="flex min-h-10 w-full items-center gap-2 rounded-2xl px-3 py-1 text-left text-sm font-medium leading-5 tracking-[0.1px] text-[#898a8b] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime md:min-h-7"
        >
          <Icon markup={section.icon} className="size-4 text-white" />
          <span className="min-w-0 flex-1 truncate">
            {section.label}
            <span aria-hidden="true"> ⋅ {section.options.length}</span>
          </span>
          <Icon name="chevron" className={`size-4 text-[#828282] transition-transform duration-200 ${open ? "[transform:rotate(180deg)]" : ""}`} />
        </button>
      </h3>
      {open && (
        <div id={panelId} className="pt-1">
          <div role="group" aria-label={section.label} className="grid grid-cols-3 gap-2 rounded-2xl bg-[#1c1e21] p-2 shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
            {lead}
            {section.options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                style={section.style}
                pressed={isPressed(option.id)}
                blocked={blockedReason(option.id)}
                onClick={() => onPick(option.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
