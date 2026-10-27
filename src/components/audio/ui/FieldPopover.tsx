"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function FieldPopover({ anchor, onClose, children, label, width = 260 }: { anchor: DOMRect; onClose: () => void; children: ReactNode; label: string; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);
  const actualWidth = Math.min(width, window.innerWidth - 24);
  useLayoutEffect(() => { setTop(Math.max(12, Math.min(anchor.top, window.innerHeight - (ref.current?.offsetHeight ?? 0) - 12))); }, [anchor, children]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) onClose(); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); onClose(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", key); };
  }, [onClose]);
  return createPortal(<div ref={ref} role="dialog" aria-label={label} style={{ left: Math.max(12, Math.min(anchor.right + 8, window.innerWidth - actualWidth - 12)), top: top ?? 12, width: actualWidth, visibility: top === null ? "hidden" : "visible", maxHeight: window.innerHeight - 24 }} className="hide-scrollbar fixed z-[150] overflow-y-auto rounded-2xl border border-white/[.06] bg-[#222527]/95 text-white shadow-2xl backdrop-blur-2xl">{children}</div>, document.body);
}
