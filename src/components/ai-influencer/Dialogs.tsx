"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SHEET_GROUPS, TIER_SECTION, type InfluencerPreset } from "./data";
import { Icon } from "./Icon";
import { optionLabel } from "./selection";
import { LIME_BUTTON } from "./Sidebar";

/** Full-screen preview dialog: blurred backdrop, media on the left, glass parameter panel on the right. */
export function DialogShell({ label, backdrop, media, panelTitle, onClose, children, footer }: { label: string; backdrop?: string; media: ReactNode; panelTitle?: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; previous?.focus(); };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[100] bg-black/80">
      <div className="relative size-full gap-0 overflow-y-auto md:grid md:grid-cols-[1fr_23rem] md:overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {backdrop && <img alt="" draggable={false} src={backdrop} className="absolute inset-0 size-full [transform:scale(1.25)] object-cover opacity-50 blur-3xl" />}
        </div>
        <div className="relative flex h-[65dvh] min-w-0 items-center justify-center p-3 md:h-full" onClick={(e) => e.target === e.currentTarget && onClose()}>{media}</div>
        <section className="size-full p-2">
          <div className="relative grid size-full min-h-0 grid-rows-[auto_1fr_auto] gap-2 overflow-hidden rounded-3xl border border-white/5 bg-[rgba(28,30,33,0.72)] p-2 backdrop-blur-2xl">
            <header className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="min-w-0 truncate pl-1 text-lg font-semibold text-white" title={panelTitle}>{panelTitle}</h2>
              <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className="m-1 grid size-8 place-items-center rounded-full bg-white/5 text-white hover:bg-white/10">
                <Icon name="close" className="size-5" />
              </button>
            </header>
            <div className="min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none]">{children}</div>
            <div className="flex flex-col gap-2">{footer}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function PanelSection({ icon, title, action, children }: { icon: string; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-xl bg-white/5 p-2">
      <div className="flex h-7 w-full items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Icon name={icon} className="size-4 text-[#898a8b]" />
          <p className="text-xs font-medium uppercase leading-4 text-[#898a8b]">{title}</p>
        </div>
        {action}
      </div>
      <div className="w-full rounded-lg bg-white/5 p-3 text-sm text-[#898a8b]">{children}</div>
    </div>
  );
}

function Chips({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((label, i) => <span key={`${label}-${i}`} className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white">{label}</span>)}
    </div>
  );
}

export function CharacterSheetDialog({ preset, onClose, onRecreate }: { preset: InfluencerPreset; onClose: () => void; onRecreate: () => void }) {
  const [all, setAll] = useState(false);
  const tierLabel = TIER_SECTION.options.find((o) => o.id === preset.tier)?.label ?? preset.tier;
  const groups = SHEET_GROUPS.map((g) => ({
    ...g,
    labels: g.sections.flatMap((s) => (s === "tier" ? [tierLabel] : (preset.selection[s] ?? []).map((id) => optionLabel(s, id)))),
  })).filter((g) => g.labels.length);
  const [first, ...rest] = groups;
  return (
    <DialogShell
      label={preset.name}
      panelTitle={preset.name}
      backdrop={preset.sheet.thumb}
      onClose={onClose}
      media={
        <div className="relative size-full shrink-0 overflow-hidden rounded-2xl">
          <img alt="" src={preset.sheet.thumb} className="absolute inset-0 size-full object-contain" />
          <img alt={preset.name} width={preset.sheet.width} height={preset.sheet.height} src={preset.sheet.url} className="relative size-full object-contain" />
        </div>
      }
      footer={
        <button type="button" onClick={onRecreate} className={`flex h-11 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold ${LIME_BUTTON}`}>
          <Icon name="recreate" className="size-4" /> Recreate
        </button>
      }
    >
      {first && (
        <PanelSection icon="groupCharacter" title={first.label}>
          <div className="flex flex-col gap-3">
            <Chips labels={first.labels} />
            {all && rest.map((g) => (
              <div key={g.label} className="flex flex-col gap-3">
                <div className="h-px w-full bg-white/5" />
                <div className="flex items-center gap-1"><Icon name={g.icon} className="size-4 text-[#898a8b]" /><span className="text-sm font-semibold text-[#898a8b]">{g.label}</span></div>
                <Chips labels={g.labels} />
              </div>
            ))}
          </div>
          {rest.length > 0 && (
            <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)} className="-mx-3 -mb-3 mt-3 flex w-[calc(100%+24px)] items-center justify-between border-t border-white/5 px-3 py-2 text-sm text-[#898a8b] hover:text-white">
              {all ? "Show less" : "See all"}
              <Icon name="seeAll" className={`size-4 transition-transform ${all ? "[transform:rotate(180deg)]" : ""}`} />
            </button>
          )}
        </PanelSection>
      )}
    </DialogShell>
  );
}
