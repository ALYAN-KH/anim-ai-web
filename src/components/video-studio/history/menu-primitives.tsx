"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ToggleTrack } from "../shared/toggle-track";

export const MENU_CLASS = "rounded-[14px] border border-white/[.06] bg-[#111315] p-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,.2)]";
export const ROW_CLASS = "flex min-h-9 w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80";
export const SELECTED_CLASS = "bg-white/[.06]";

export function HistoryToggle({ checked }: { checked: boolean }) {
  return <span style={{ display: "inline-flex", marginLeft: "auto", flexShrink: 0 }}><ToggleTrack checked={checked} /></span>;
}

export function useHistoryMenu(onClose: () => void, trigger: RefObject<HTMLButtonElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [role="slider"]') ?? []);
    focusable()[0]?.focus();
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) onClose(); };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); trigger.current?.focus(); }
      if (event.key === "Tab") {
        const items = focusable(), index = items.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && (document.activeElement as HTMLElement)?.tagName === "BUTTON") {
        const items = focusable(), index = items.indexOf(document.activeElement as HTMLElement);
        event.preventDefault(); items[(index + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", key); };
  }, [onClose, trigger]);
  return ref;
}

export function menuPosition(anchor: DOMRect, width: number, height: number) {
  return { left: Math.max(8, Math.min(anchor.right - width, window.innerWidth - width - 8)), top: Math.max(8, Math.min(anchor.bottom + 8, window.innerHeight - height - 8)), width: Math.min(width, window.innerWidth - 16) };
}
