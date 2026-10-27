"use client";

import { fmt } from "./plan-data";

export function Slider({
  steps,
  si,
  setSi,
}: {
  steps: number[];
  si: number;
  setSi: (n: number) => void;
}) {
  const last = steps.length - 1;
  const pct = last > 0 ? (si / last) * 100 : 0;

  const pick = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setSi(Math.round(ratio * last));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        role="slider"
        tabIndex={0}
        aria-label="Credits per month"
        aria-valuemin={0}
        aria-valuemax={last}
        aria-valuenow={si}
        aria-valuetext={`${fmt(steps[si])} credits per month`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pick(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) pick(e.clientX, e.currentTarget);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp")
            setSi(Math.min(last, si + 1));
          if (e.key === "ArrowLeft" || e.key === "ArrowDown")
            setSi(Math.max(0, si - 1));
        }}
        className="relative mx-2 flex h-6 cursor-pointer touch-none select-none items-center outline-none"
      >
        <div className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-white/20" />
        <div
          className="pointer-events-none absolute left-0 h-1 rounded-full bg-white transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
        <div
          className="pointer-events-none absolute flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-[left] duration-150"
          style={{ left: `calc(${pct}% - 10px)` }}
        >
          <svg
            className="h-4 w-4 text-black"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="currentColor"
              d="M14.4696 7.46967C14.7624 7.17678 15.2373 7.17678 15.5302 7.46967L18.9999 10.9393C19.5857 11.5251 19.5857 12.4749 18.9999 13.0607L15.5302 16.5303C15.2373 16.8232 14.7624 16.8232 14.4696 16.5303C14.1767 16.2374 14.1767 15.7626 14.4696 15.4697L17.9392 12L14.4696 8.53033C14.1767 8.23744 14.1767 7.76256 14.4696 7.46967ZM9.53022 7.46967C9.82311 7.76256 9.82311 8.23744 9.53022 8.53033L6.06055 12L9.53022 15.4697C9.82311 15.7626 9.82311 16.2374 9.53022 16.5303C9.23732 16.8232 8.76245 16.8232 8.46956 16.5303L4.99989 13.0607C4.4141 12.4749 4.4141 11.5251 4.99989 10.9393L5.53022 11.4697L4.99989 10.9393L8.46956 7.46967C8.76245 7.17678 9.23732 7.17678 9.53022 7.46967Z"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-between">
        {steps.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setSi(i)}
            className={`flex cursor-pointer items-center gap-1 text-xs ${i === si ? "font-semibold text-white" : "text-white/40"}`}
          >
            {fmt(s)}
          </button>
        ))}
      </div>
    </div>
  );
}
