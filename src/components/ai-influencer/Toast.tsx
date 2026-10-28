"use client";

import { Info, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const notify = useCallback((text: string) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 4000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { message, notify, dismiss: () => setMessage(null) };
}

/**
 * Top-left notification pill matching the reference. Rendered into <body> with inline layout,
 * because the app-wide reference stylesheets restyle direct children of <main>.
 */
export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  if (!message || typeof document === "undefined") return null;
  return createPortal(
    <div
      aria-live="polite"
      className="rounded-[14px] border border-white/10 bg-[#1f2124] text-base font-medium leading-6 text-white shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
      style={{ position: "fixed", left: 24, top: 24, right: "auto", zIndex: 200, display: "flex", flexDirection: "row", alignItems: "center", gap: 12, width: "auto", maxWidth: "calc(100vw - 48px)", padding: "12px 14px 12px 12px" }}
    >
      <span className="grid size-[26px] shrink-0 place-items-center rounded-full border border-lime/30 bg-lime/15 text-lime">
        <Info className="size-3.5" strokeWidth={2} />
      </span>
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="ml-1 grid size-5 shrink-0 place-items-center text-white/70 hover:text-white">
        <X className="size-3.5" />
      </button>
    </div>,
    document.body,
  );
}
