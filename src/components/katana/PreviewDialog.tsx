"use client";

import { useEffect, useRef } from "react";
import type { KatanaPreset } from "./data";
import { KatanaIcon } from "./icons";
import { KatanaVideo } from "./KatanaVideo";

export default function PreviewDialog({ preset, onClose, onRecreate }: { preset: KatanaPreset; onClose: () => void; onRecreate: (preset: KatanaPreset) => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = `katana-preview-${preset.id}`;

  const close = () => {
    onClose();
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    closeButton.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, [href], video[controls]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const portrait = preset.height > preset.width;

  return <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6">
    <div aria-hidden="true" onClick={close} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141617] text-white shadow-2xl ${portrait ? "max-w-[480px]" : "max-w-[1100px]"}`}>
      <header className="flex items-center gap-3 px-4 py-3">
        <h2 id={titleId} className="min-w-0 flex-1 truncate text-base font-semibold leading-6">{preset.title}</h2>
        <button type="button" onClick={() => {
          onRecreate(preset);
          close();
        }} className="inline-flex h-8 items-center gap-1 rounded-lg bg-lime px-2.5 text-xs font-semibold text-black outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white"><KatanaIcon name="recreate" className="size-4" />Recreate</button>
        <button ref={closeButton} type="button" onClick={close} aria-label="Close" className="grid size-9 place-items-center rounded-full bg-white/5 text-white/80 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5 rotate-45"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 5.25V12m0 0v6.75M12 12H5.25M12 12h6.75" /></svg>
        </button>
      </header>
      <div className="relative w-full bg-black" style={{ aspectRatio: `${preset.width} / ${preset.height}`, maxHeight: "calc(100svh - 120px)" }}>
        {preset.video ? <KatanaVideo key={preset.id} src={preset.video} poster={preset.poster ?? preset.image} label={preset.title} controls className="absolute inset-0 size-full" />
          : <img src={preset.image} alt={preset.title} className="absolute inset-0 size-full object-contain" />}
        {!preset.video && <p role="status" className="absolute inset-x-0 bottom-0 bg-black/75 p-3 text-center text-xs text-white/70">Only a poster is available in the captured reference for this preset.</p>}
      </div>
    </div>
  </div>;
}
