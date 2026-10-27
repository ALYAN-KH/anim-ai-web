"use client";

import Link from "next/link";
import { Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import data from "@/data/content";

export function TopBar({ studioCompact = false }: { studioCompact?: boolean }) {
  const [visible, setVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const announcements = data.topBar.items;
  const topBar = announcements[activeIndex];

  useEffect(() => {
    if (announcements.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % announcements.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [announcements.length]);

  if (!visible) return null;

  return (
    <aside className={`relative z-[60] flex items-center gap-3 bg-lime px-4 text-black sm:px-6 ${studioCompact ? "min-h-11 py-1" : "min-h-14 py-2 sm:min-h-[56px]"}`}>
      <div
        key={activeIndex}
        aria-live="polite"
        className={`mx-auto flex min-w-0 w-full max-w-[1920px] flex-1 animate-[topbar-enter_250ms_ease-out] items-center gap-3 ${
          topBar.type === "seedance" ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {topBar.type === "seedance" ? (
            <span className="hidden h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/70 bg-[linear-gradient(180deg,#4294ff_0%,#1554d1_100%)] px-2 text-xs font-semibold text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,.2),0_1px_2px_rgba(0,0,0,.25)] sm:inline-flex">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="m5.943 18.192-3.276.82V4.498l3.276.819zM21.778 19.042l-3.283.819V3.648l3.283.813zM11.14 18.635l-3.276.82v-8.55l3.277.82zM13.282 9.637l3.282-.82v8.55l-3.282-.819z"
                />
              </svg>
              {topBar.badge}
            </span>
          ) : (
            <Tag aria-hidden="true" className="h-4 w-4 shrink-0 fill-black" />
          )}
          <p className={`min-w-0 text-center text-xs font-semibold leading-tight sm:text-left sm:text-sm ${studioCompact ? "md:text-sm" : "md:text-base"}`}>
            {topBar.text}
          </p>
        </div>
        <Link
          href={topBar.href}
          className={`hidden shrink-0 px-3.5 text-xs font-semibold shadow-sm transition sm:inline-flex sm:text-sm ${studioCompact ? "py-1.5" : "py-2"} ${
            topBar.type === "seedance"
              ? "rounded-full bg-[#131416] text-white hover:bg-black"
              : "rounded-lg bg-white hover:bg-zinc-100"
          }`}
        >
          {topBar.cta}
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss discount announcement"
        onClick={() => setVisible(false)}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md transition hover:bg-black/10"
      >
        <X className="h-5 w-5" />
      </button>
    </aside>
  );
}


