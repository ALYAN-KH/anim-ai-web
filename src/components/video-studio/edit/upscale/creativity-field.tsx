"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "../../shared/media-icons";
import { CREATIVITY } from "./settings-data";

export function CreativityField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{
    left: number;
    top?: number;
    bottom?: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const fitsBelow = rect.bottom + 8 + 140 <= window.innerHeight;
    const maxLeft = Math.max(8, window.innerWidth - 258 - 8);
    setPos({
      left: Math.min(rect.left, maxLeft),
      ...(fitsBelow
        ? { top: rect.bottom + 8 }
        : { bottom: window.innerHeight - rect.top + 8 }),
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popRef.current?.contains(target)
      )
        return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const onRadioKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const index = CREATIVITY.indexOf(value);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(CREATIVITY[(index + 1) % CREATIVITY.length]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(
        CREATIVITY[(index - 1 + CREATIVITY.length) % CREATIVITY.length],
      );
    }
  };

  useEffect(() => {
    if (!open) return;
    popRef.current
      ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ?.focus();
  }, [value, open]);

  return (
    <div className="relative min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label="Creativity"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggle}
        className="flex h-[54px] w-full min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 text-left transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]"
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[11px] font-medium text-white/50">
            Creativity
          </span>
          <span className="text-sm font-medium capitalize text-white">
            {value}
          </span>
        </span>
        <ChevronIcon className="shrink-0 text-white/50" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label="Creativity"
            style={{ left: pos.left, top: pos.top, bottom: pos.bottom }}
            className="fixed z-[110] w-[258px] rounded-2xl border border-white/10 bg-[#1c1c1e] p-4 shadow-[0_16px_40px_rgba(0,0,0,.5)]"
          >
            <p className="mb-3 text-sm font-medium text-white/60">Creativity</p>
            <div
              role="radiogroup"
              aria-label="Creativity"
              onKeyDown={onRadioKeyDown}
              className="grid grid-cols-2 gap-1 rounded-xl bg-white/[.08] p-1"
            >
              {CREATIVITY.map((option) => {
                const checked = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    tabIndex={checked ? 0 : -1}
                    onClick={() => onChange(option)}
                    className={`h-8 rounded-lg text-sm font-semibold text-white outline-none transition focus-visible:ring-2 focus-visible:ring-[#EFFE17] ${checked ? "bg-[#131416]" : "hover:bg-white/[.06]"
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
