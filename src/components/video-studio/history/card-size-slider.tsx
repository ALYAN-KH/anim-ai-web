"use client";

import type { PointerEvent } from "react";

export function CardSizeSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const update = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onChange(Math.max(0, Math.min(5, Math.round((event.clientX - rect.left) / rect.width * 5))));
  };
  return <div className="p-1">
    <div role="slider" tabIndex={0} aria-label="Card size" aria-valuemin={0} aria-valuemax={5} aria-valuenow={value} aria-orientation="horizontal" onPointerDown={event => { event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); update(event); }} onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event); }} onKeyDown={event => {
      if (["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault(); event.stopPropagation();
        onChange(event.key === "Home" ? 0 : event.key === "End" ? 5 : Math.max(0, Math.min(5, value + (["ArrowLeft", "ArrowDown"].includes(event.key) ? -1 : 1))));
      }
    }} className="relative flex h-8 w-full cursor-pointer touch-none items-center overflow-hidden rounded-lg bg-white/[.05] outline-none focus-visible:ring-1 focus-visible:ring-white/30 active:cursor-grabbing">
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 rounded-l-lg bg-white/[.1]" style={{ width: `${value * 20}%` }} />
      {[20, 40, 60, 80].map(position => <span key={position} aria-hidden="true" className="pointer-events-none absolute h-1.5 w-px bg-white/25" style={{ left: `${position}%`, top: "calc(50% - 3px)" }} />)}
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-white/40" style={{ left: `calc(${value * 20}% - ${value / 5}px)` }} />
    </div>
  </div>;
}
