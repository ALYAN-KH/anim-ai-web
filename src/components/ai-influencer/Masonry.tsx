"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const GAP = 16;

function columnsFor(width: number) {
  if (width >= 1100) return 4;
  if (width >= 700) return 3;
  return 2;
}

/**
 * Shortest-column masonry with absolutely positioned items, as the reference grid does.
 * `ratio` is height / width for each item; `onEnd` fires when the sentinel nears the viewport.
 */
export function Masonry<T>({ items, ratio, render, itemKey, onEnd }: { items: T[]; ratio: (item: T) => number; render: (item: T) => ReactNode; itemKey: (item: T) => string; onEnd?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !onEnd) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && onEnd(), { rootMargin: "800px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onEnd, items.length]);

  const cols = columnsFor(width);
  const colWidth = width ? (width - GAP * (cols - 1)) / cols : 0;
  const heights = new Array(cols).fill(0);
  const placed = items.map((item) => {
    const col = heights.indexOf(Math.min(...heights));
    const top = heights[col];
    heights[col] += colWidth * ratio(item) + GAP;
    return { item, left: col * (colWidth + GAP), top };
  });

  return (
    <div className="w-full p-3">
      <div ref={box} className="relative" style={{ height: width ? Math.max(0, Math.max(...heights) - GAP) : undefined }}>
        {width > 0 && placed.map(({ item, left, top }) => (
          <div key={itemKey(item)} className="absolute" style={{ width: colWidth, left, top }}>
            {render(item)}
          </div>
        ))}
      </div>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
    </div>
  );
}
