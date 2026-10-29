"use client";
import { useEffect, useState } from "react";
import { CAROUSEL } from "./data";

// Per-offset geometry measured from the reference (CSS px, 5 cards visible, centre card largest).
const SLOT: Record<number, { x: number; w: number; h: number; o: number; z: number }> = {
  [-2]: { x: -390, w: 200, h: 112, o: 0, z: 1 },
  [-1]: { x: -232, w: 224, h: 126, o: 1, z: 2 },
  0: { x: 0, w: 268, h: 150, o: 1, z: 4 },
  1: { x: 232, w: 224, h: 126, o: 1, z: 3 },
  2: { x: 390, w: 200, h: 112, o: 0, z: 1 },
};

export function Carousel() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = CAROUSEL.length;
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 7000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div className="relative mx-auto h-[168px] w-[820px] max-w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {CAROUSEL.map((item, k) => {
        const off = ((((k - active + 1) % n) + n) % n) - 1; // -1 | 0 | 1 : only three cards are ever visible
        const s = SLOT[off];
        return (
          <button
            key={item.t}
            type="button"
            aria-label={item.t}
            onClick={() => off !== 0 && setActive(k)}
            className={`cs-card absolute left-1/2 top-1/2 overflow-hidden rounded-[14px] border bg-black text-left shadow-[0_18px_40px_rgba(0,0,0,.45)] ${off === 0 ? "border-white/30" : "border-white/15"}`}
            style={{ width: s.w, height: s.h, opacity: s.o, zIndex: s.z, transform: `translate(calc(-50% + ${s.x}px), -50%)`, cursor: off === 0 ? "default" : "pointer", }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.poster} alt={item.t} draggable={false} className="absolute inset-0 size-full object-cover" />
            {off === 0 && <video key={item.video} src={item.video} poster={item.poster} muted loop playsInline autoPlay preload="none" className="absolute inset-0 size-full object-cover" />}
                      </button>
        );
      })}
    </div>
  );
}
