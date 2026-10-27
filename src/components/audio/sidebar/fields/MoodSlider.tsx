"use client";
import { InfoIcon } from "../../ui/Icons";

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const DOTS = [0, 25, 50, 75, 100];

export function MoodSlider({ value, onChange }: MoodSliderProps) {
  return (
    <div className="rounded-xl border border-white/5 p-3">
      <div className="flex items-center gap-1.5 text-sm font-medium text-white/50">
        Mood
        <span title="Set the emotional tone of the delivery">
          <InfoIcon className="size-3.5" />
        </span>
      </div>
      <div className="relative mt-3 h-9">
        <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 overflow-hidden rounded-lg bg-white/5">
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,#b91c1c_0%,#b5651d_50%,#8fb81c_100%)]"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          />
          {DOTS.map((dot) => (
            <span
              key={dot}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
              style={{ left: `${Math.min(Math.max(dot, 4), 96)}%` }}
            />
          ))}
        </div>
        <span
          className="absolute top-1/2 grid h-9 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-white shadow-md"
          style={{ left: `clamp(12px, ${value}%, calc(100% - 12px))` }}
        >
          <span className="h-3 w-px bg-black/25" />
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          aria-label="Mood"
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-white/50">
        <span>Angry</span>
        <span>Neutral</span>
        <span>Happy</span>
      </div>
    </div>
  );
}
