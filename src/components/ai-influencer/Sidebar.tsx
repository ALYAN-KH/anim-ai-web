"use client";

import { useLayoutEffect, useRef, useState, type Dispatch, type ReactNode } from "react";
import { ICONS, STYLE_REF_ICON, TIER_SECTION, type TierId } from "./data";
import { Icon } from "./Icon";
import { OptionSection } from "./OptionSection";
import { blockedReason, pickedLabels, visibleSections } from "./selection";
import { UploadTile } from "./UploadTile";
import type { Uploads } from "./uploads";
import { BATCH_MAX, BATCH_MIN, type CreationMode, type StudioAction, type StudioState } from "./useStudio";

export const LIME_BUTTON = "bg-[#d1fe17] bg-[linear-gradient(rgba(255,255,20,0)_0%,#ffff14_100%),linear-gradient(90deg,#d1fe17_0%,#d1fe17_100%)] text-[#1a1a1a] shadow-[inset_0_-3px_0_#829b19,0_6px_4px_rgba(0,0,0,0.25),0_32px_24px_rgba(0,0,0,0.15)] transition-[filter,transform] duration-200 hover:brightness-105 active:[transform:scale(0.97)] disabled:cursor-wait disabled:opacity-70";

/** Segmented tabs with a sliding indicator (sidebar modes, motion modes). */
export function Segmented<T extends string>({ value, options, onChange, label, size = "md" }: { value: T; options: { id: T; label: string; icon?: string }[]; onChange: (id: T) => void; label: string; size?: "md" | "lg" }) {
  const index = Math.max(0, options.findIndex((o) => o.id === value));
  const pad = size === "lg" ? 3 : 2;
  const gap = 4;
  const n = options.length;
  const width = `((100% - ${2 * pad}px - ${(n - 1) * gap}px) / ${n})`;
  return (
    <div role="tablist" aria-label={label} className={`relative grid w-full rounded-[10px] bg-[#131416] ${size === "lg" ? "h-[38px]" : "h-11 md:h-9"}`} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, columnGap: gap, padding: pad }}>
      <span
        aria-hidden="true"
        className="absolute rounded-lg border border-white/5 bg-[#1c1e20] transition-[left] duration-200 ease-out motion-reduce:transition-none"
        style={{ top: pad, bottom: pad, width: `calc${width}`, left: `calc(${pad}px + ${index} * (${width} + ${gap}px))` }}
      />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === value}
          onClick={() => onChange(o.id)}
          className={`relative z-[1] flex h-full items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold leading-[18px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${o.id === value ? "text-white" : "text-[#898a8b] hover:text-white"}`}
        >
          {o.icon && <Icon name={o.icon} className="size-4" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PickedSettings({ state, dispatch }: { state: StudioState; dispatch: Dispatch<StudioAction> }) {
  const chips = pickedLabels(state.selection, state.tier);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (el) setOverflows(el.scrollHeight > 58);
  }, [chips.length, expanded]);
  if (!chips.length) return null;
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold leading-[14px] tracking-[0.2px] text-[#898a8b]">Picked settings</span>
        <button type="button" onClick={() => dispatch({ type: "reset" })} className="h-10 text-[10px] font-semibold leading-[14px] tracking-[0.2px] text-[#626262] hover:text-white md:h-3.5">Reset all</button>
      </div>
      <div className="relative min-w-0 overflow-hidden">
        <div ref={box} className={`flex flex-wrap gap-1 ${expanded ? "" : "max-h-[52px]"}`}>
          {chips.map((c) => (
            <button
              key={`${c.section}-${c.id}`}
              type="button"
              title={`Remove ${c.label}`}
              onClick={() => dispatch({ type: "toggle", section: c.section, option: c.id })}
              className="inline-flex h-6 max-w-full shrink-0 items-center rounded-full border border-white/5 bg-white/5 px-2 text-xs font-medium text-[#626262] transition-colors hover:text-white"
            >
              <span className="truncate">{c.label}</span>
            </button>
          ))}
        </div>
        {(overflows || expanded) && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className={`${expanded ? "mt-1" : "absolute bottom-0 right-0 bg-[linear-gradient(90deg,rgba(35,38,42,0),#23262a_40%)] pl-10"} h-6 rounded-full px-2 text-xs font-semibold text-white`}>
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Batch size</span>
        <div className="flex items-center gap-3 text-[#898a8b]">
          <button type="button" aria-label="Decrease batch size" disabled={state.batch <= BATCH_MIN} onClick={() => dispatch({ type: "batch", value: state.batch - 1 })} className="grid size-6 place-items-center rounded-md hover:text-white disabled:opacity-40"><Icon name="batchMinus" className="size-4" /></button>
          <span className="min-w-3 text-center text-base font-semibold text-white" aria-live="polite">{state.batch}</span>
          <button type="button" aria-label="Increase batch size" disabled={state.batch >= BATCH_MAX} onClick={() => dispatch({ type: "batch", value: state.batch + 1 })} className="grid size-6 place-items-center rounded-md hover:text-white disabled:opacity-40"><Icon name="batchPlus" className="size-4" /></button>
        </div>
      </div>
    </>
  );
}

type SidebarProps = {
  state: StudioState;
  dispatch: Dispatch<StudioAction>;
  photo: Uploads;
  styleRefs: Uploads;
  motionPanel: ReactNode;
  pending: boolean;
  onGenerate: () => void;
};

export function Sidebar({ state, dispatch, photo, styleRefs, motionPanel, pending, onGenerate }: SidebarProps) {
  const sections = visibleSections(state.tier);
  const pick = (section: string, option: string) => (section === "tier" ? dispatch({ type: "tier", tier: option as TierId }) : dispatch({ type: "toggle", section: section as never, option }));
  return (
    <aside aria-label="AI Influencer settings" className="flex h-[min(52rem,calc(100dvh-5rem))] min-h-[400px] min-w-0 flex-col overflow-hidden rounded-[20px] bg-[#131517] md:h-full md:min-h-0">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#23262a]">
        <div data-influencer-scroll className="isolate flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-none pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <header className="sticky top-0 z-0 flex shrink-0 flex-col items-center gap-1 bg-[#23262a] p-4 text-center">
            <p className="text-[10px] leading-[14px] tracking-[0.2px] text-white/60">Create your own character with</p>
            <h1 className="bg-[linear-gradient(#fff,rgba(255,255,255,0.5))] bg-clip-text font-grotesk text-[28px] font-bold uppercase leading-8 tracking-[-1.2px] text-transparent">AI Influencer</h1>
          </header>
          <div className="sticky top-0 z-30 shrink-0 bg-[#23262a] p-2">
            <Segmented<CreationMode> label="Creation mode" value={state.mode} onChange={(mode) => dispatch({ type: "mode", mode })} options={[{ id: "create", label: "Create Influencer" }, { id: "motion", label: "Motion" }]} />
          </div>
          <div role="tabpanel" className="relative z-10 flex-auto shrink-0 overflow-clip rounded-[20px] bg-[#131517] bg-[linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05)),radial-gradient(181.55%_134px_at_50%_0%,rgba(255,255,255,0.08),transparent)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
            {state.mode === "create" ? (
              <div className="min-w-0 space-y-4 p-2">
                <UploadTile uploads={photo} label="Upload your photo" icon={ICONS.uploadImage} optional />
                <div className="flex flex-col gap-2">
                  {[TIER_SECTION, ...sections].map((section) => (
                    <OptionSection
                      key={section.id}
                      section={section}
                      open={state.open.includes(section.id)}
                      onToggleOpen={() => dispatch({ type: "accordion", id: section.id })}
                      isPressed={(id) => (section.id === "tier" ? state.tier === id : Boolean(state.selection[section.id]?.includes(id)))}
                      blockedReason={(id) => (section.id === "tier" ? undefined : blockedReason(state.tier, state.selection, section.id, id))}
                      onPick={(id) => pick(section.id, id)}
                      lead={section.id === "aesthetic" ? (
                        <section aria-label="Clothing references" className="col-span-full min-w-0">
                          <UploadTile uploads={styleRefs} label="Add style reference" icon={STYLE_REF_ICON} multiple />
                        </section>
                      ) : undefined}
                    />
                  ))}
                </div>
              </div>
            ) : motionPanel}
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex shrink-0 flex-col gap-3 bg-[#23262a] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            {state.mode === "create" ? (
              <>
                <PickedSettings state={state} dispatch={dispatch} />
                <div className="flex gap-2">
                  <button type="button" aria-label="Randomize" title="Randomize" onClick={() => dispatch({ type: "randomize" })} className="grid size-14 shrink-0 place-items-center rounded-xl bg-white text-[#1a1a1a] transition-transform hover:bg-[#f0f0f0] active:[transform:scale(0.97)]">
                    <Icon name="randomize" className="size-5" />
                  </button>
                  <button type="button" aria-label="Generate" aria-busy={pending} disabled={pending} onClick={onGenerate} className={`flex h-14 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 pb-5 pt-4 text-lg font-semibold leading-6 tracking-[-0.4px] ${LIME_BUTTON}`}>
                    Generate <Icon name="generateSpark" className="size-[18px]" />
                  </button>
                </div>
              </>
            ) : (
              <button type="button" aria-label="Generate" aria-busy={pending} disabled={pending} onClick={onGenerate} className={`h-14 w-full rounded-xl text-lg font-semibold tracking-[-0.4px] ${LIME_BUTTON}`}>
                Generate
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
