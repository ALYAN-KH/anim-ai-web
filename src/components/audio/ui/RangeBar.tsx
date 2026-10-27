"use client";
import { clamp } from "../lib/format";

interface RangeBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  ticks?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  compact?: boolean;
}

export function RangeBar({
  label,
  value,
  min,
  max,
  step = 1,
  ticks = 9,
  format = String,
  onChange,
  compact = false,
}: RangeBarProps) {
  const pct = clamp(((value - min) / (max - min)) * 100, 0, 100);
  const tickPositions = Array.from({ length: ticks }, (_, index) => ((index + 1) / (ticks + 1)) * 100);

  return (
    <div className={`relative flex w-full items-center overflow-hidden rounded-xl bg-white/5 focus-within:ring-2 focus-within:ring-white/25 ${compact ? "h-9" : "h-12"}`}>
      <div className="absolute inset-y-0 left-0 bg-white/10" style={{ width: `${pct}%` }} />
      {tickPositions
        .filter((position) => position > pct + 1)
        .map((position) => (
          <span
            key={position}
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/20"
            style={{ left: `${position}%` }}
          />
        ))}
      <span
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white ${compact ? "h-full w-px" : "h-5 w-1.5 rounded-full"}`}
        style={{ left: `clamp(6px, ${pct}%, calc(100% - 6px))` }}
      />
      {!compact && <span className="relative z-10 px-4 text-sm font-semibold text-white">{label}</span>}
      {!compact && <span className="relative z-10 ml-auto px-4 text-sm font-semibold tabular-nums text-white">
        {format(value)}
      </span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
