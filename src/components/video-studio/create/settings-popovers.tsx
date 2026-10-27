"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const ASPECT_RATIOS = [
  "Auto",
  "16:9",
  "4:3",
  "1:1",
  "3:4",
  "9:16",
] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const QUALITIES = ["480p", "720p", "1080p"] as const;

export type Quality = (typeof QUALITIES)[number];

/** Duration slider stops, evenly spaced on the track (as in the source UI). */
const STOPS = [2, 10, 15, 20, 30] as const;

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-lime"
    >
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface SidePopoverProps {
  anchor: DOMRect;
  onClose: () => void;
  width: number;
  children: ReactNode;
}

/** Fixed popover shown to the right of its trigger, bottom-aligned with it. */
export function SidePopover({
  anchor,
  onClose,
  width,
  children,
}: SidePopoverProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const left = Math.min(anchor.right + 10, window.innerWidth - width - 12);
  const bottom = Math.max(12, window.innerHeight - anchor.bottom);

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fixed overflow-hidden rounded-xl border border-white/[.06] bg-[#1a1c1f] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        style={{ left, bottom, width }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export interface OptionPopoverProps<T extends string> {
  anchor: DOMRect;
  title: string;
  options: readonly T[];
  value: T;
  onSelect: (v: T) => void;
  onClose: () => void;
}

export function OptionPopover<T extends string>({
  anchor,
  title,
  options,
  value,
  onSelect,
  onClose,
}: OptionPopoverProps<T>) {
  return (
    <SidePopover anchor={anchor} onClose={onClose} width={200}>
      <div role="menu" aria-label={title} className="p-2">
        <p className="px-2 pb-1.5 pt-2 text-sm font-medium text-white/55">
          {title}
        </p>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              onClick={() => {
                onSelect(opt);
                onClose();
              }}
              className={`flex h-11 w-full items-center justify-between rounded-lg px-2.5 text-left text-[15px] font-semibold text-white transition-colors ${selected ? "bg-white/[.08]" : "hover:bg-white/[.05]"
                }`}
            >
              {opt}
              {selected && <CheckIcon />}
            </button>
          );
        })}
      </div>
    </SidePopover>
  );
}

const toPos = (v: number) => {
  const c = Math.min(30, Math.max(2, v));
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (c <= STOPS[i + 1]) {
      return (
        (i + (c - STOPS[i]) / (STOPS[i + 1] - STOPS[i])) / (STOPS.length - 1)
      );
    }
  }
  return 1;
};

const fromPos = (t: number) => {
  const x = Math.min(STOPS.length - 1, Math.max(0, t * (STOPS.length - 1)));
  const i = Math.min(STOPS.length - 2, Math.floor(x));
  return Math.round(STOPS[i] + (x - i) * (STOPS[i + 1] - STOPS[i]));
};

export interface DurationPopoverProps {
  anchor: DOMRect;
  value: number;
  onChange: (v: number) => void;
  onClose: () => void;
}

export function DurationPopover({
  anchor,
  value,
  onChange,
  onClose,
}: DurationPopoverProps) {
  const pos = toPos(value) * 100;

  return (
    <SidePopover anchor={anchor} onClose={onClose} width={330}>
      <div className="px-3.5 pb-2 pt-3">
        <p className="text-sm font-medium text-white/55">Total duration</p>
        <p className="mt-1 text-xl font-semibold text-white">{value}s</p>
      </div>
      <div className="p-1">
        <div className="relative rounded-lg border border-[#EFFE17] p-1.5 pb-1">
          <div className="relative h-10 rounded-md bg-white/[.04]">
            <div
              className="absolute inset-y-0 left-0 rounded-md bg-white/25"
              style={{ width: `max(14px, ${pos}%)` }}
            />
            <div className="absolute inset-y-0 left-2 right-2">
              {STOPS.map((s, i) => (
                <span
                  key={s}
                  aria-hidden="true"
                  className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
                  style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
                />
              ))}
            </div>
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#EFFE17]"
              style={{ left: `calc(${pos}% * 0.9 + 8px)` }}
            />
            <input
              type="range"
              aria-label="Total duration (seconds)"
              aria-valuetext={`${value}s`}
              min={0}
              max={1000}
              value={Math.round(toPos(value) * 1000)}
              onChange={(e) => onChange(fromPos(Number(e.target.value) / 1000))}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </div>
          <div className="relative mx-2 mt-1 h-4 text-[11px] text-white/45">
            {STOPS.map((s, i) => (
              <span
                key={s}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SidePopover>
  );
}
