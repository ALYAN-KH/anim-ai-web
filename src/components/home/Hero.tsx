"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import data from "@/data/content";
import { Tile } from "@/components/gallery/Tile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActive, setPaused } from "@/store";

export function Hero() {
  const dispatch = useAppDispatch();
  const { active, paused } = useAppSelector((state) => state.hero);
  const rowRef = useRef<HTMLDivElement>(null);
  const ignoreScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const slideCount = data.hero.length;

  useEffect(() => {
    if (paused || active >= slideCount - 1 || slideCount < 2) return;
    const timer = setInterval(() => {
      dispatch(setActive(active + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [active, paused, slideCount, dispatch]);

  useEffect(() => {
    const row = rowRef.current;
    const card = row?.children[active] as HTMLElement | undefined;
    if (!row || !card) return;

    ignoreScrollRef.current = true;
    row.scrollTo({
      left: card.offsetLeft - (row.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 750);

    return () => clearTimeout(releaseTimerRef.current);
  }, [active]);

  useEffect(() => {
    return () => {
      clearTimeout(scrollTimerRef.current);
      clearTimeout(releaseTimerRef.current);
    };
  }, []);

  const syncActiveSlide = () => {
    if (ignoreScrollRef.current) return;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const row = rowRef.current;
      if (!row) return;
      const cards = Array.from(row.children) as HTMLElement[];
      const firstOffset = cards[0]?.offsetLeft ?? 0;
      const nearest =
        row.scrollLeft + row.clientWidth >= row.scrollWidth - 2
          ? cards.length - 1
          : cards.reduce(
              (best, card, index) =>
                Math.abs(card.offsetLeft - firstOffset - row.scrollLeft) <
                Math.abs(cards[best].offsetLeft - firstOffset - row.scrollLeft)
                  ? index
                  : best,
              0,
            );
      if (nearest !== active) dispatch(setActive(nearest));
    }, 120);
  };

  const goTo = (index: number) => {
    dispatch(setActive(Math.min(Math.max(index, 0), slideCount - 1)));
  };

  return (
    <section
      className="group/hero-carousel relative"
      aria-label="Featured Higgsfield announcements"
      aria-roledescription="carousel"
      onMouseEnter={() => dispatch(setPaused(true))}
      onMouseLeave={() => dispatch(setPaused(false))}
      onFocusCapture={(event) => {
        // Only pause for keyboard focus, not mouse clicks
        if (event.target.matches(":focus-visible")) dispatch(setPaused(true));
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          dispatch(setPaused(false));
      }}
    >
      <div
        ref={rowRef}
        onScroll={syncActiveSlide}
        onPointerDown={() => dispatch(setPaused(true))}
        onPointerUp={() => dispatch(setPaused(false))}
        className="sb flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain gap-[22px] px-5 pt-4 pb-1 [scroll-padding-inline:20px] max-[639px]:gap-3 max-[639px]:px-3 max-[639px]:pt-3 max-[639px]:[scroll-padding-inline:12px]"
      >
        {data.hero.map((slide, index) => (
          <Link
            key={slide.t}
            href={slide.href}
            className="group block w-[calc((100%_-_70px)_/_3.2)] shrink-0 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-lime max-[1023px]:w-[min(72vw,560px)] max-[639px]:w-[85vw]"
            aria-label={`${slide.t}: ${slide.sub}`}
          >
            <div className="aspect-video overflow-hidden rounded-[10px]">
              <Tile
                it={slide}
                i={index}
                r=""
                showInfo={false}
                hoverEffects={false}
              />
            </div>
            <h2 className="mt-4 text-[14px] font-bold uppercase leading-tight text-white max-[639px]:mt-[10px] max-[639px]:text-xs">
              {slide.t}
            </h2>
            <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[#94979c] max-[639px]:text-xs">
              {slide.sub}
            </p>
          </Link>
        ))}
      </div>
      {slideCount > 1 && (
        <>
          {active > 0 && (
            <button
              type="button"
              aria-label="Previous featured slide"
              onClick={() => goTo(active - 1)}
              className="absolute left-2 top-[clamp(100px,9.4vw,180px)] z-[5] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[rgba(49,52,55,0.92)] text-[#f7f7f7] transition-[background,opacity] duration-200 hover:bg-[#51555a] focus-visible:bg-[#51555a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2 max-[639px]:top-[calc(85vw*9/32+12px)] max-[639px]:h-9 max-[639px]:w-9 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/hero-carousel:pointer-events-auto [@media(hover:hover)]:group-hover/hero-carousel:opacity-100 [@media(hover:hover)]:focus-visible:pointer-events-auto [@media(hover:hover)]:focus-visible:opacity-100"
            >
              <ChevronLeft aria-hidden="true" size={25} />
            </button>
          )}
          {active < slideCount - 1 && (
            <button
              type="button"
              aria-label="Next featured slide"
              onClick={() => goTo(active + 1)}
              className="absolute right-2 top-[clamp(100px,9.4vw,180px)] z-[5] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[rgba(49,52,55,0.92)] text-[#f7f7f7] transition-[background,opacity] duration-200 hover:bg-[#51555a] focus-visible:bg-[#51555a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2 max-[639px]:top-[calc(85vw*9/32+12px)] max-[639px]:h-9 max-[639px]:w-9 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/hero-carousel:pointer-events-auto [@media(hover:hover)]:group-hover/hero-carousel:opacity-100 [@media(hover:hover)]:focus-visible:pointer-events-auto [@media(hover:hover)]:focus-visible:opacity-100"
            >
              <ChevronRight aria-hidden="true" size={25} />
            </button>
          )}
          <div
            className="hidden justify-center gap-[6px] mt-[14px] max-[639px]:flex"
            aria-label="Choose featured slide"
          >
            {data.hero.map((slide, index) => (
              <button
                key={slide.t}
                type="button"
                aria-label={`Show ${slide.t}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => goTo(index)}
                className="h-[6px] w-[6px] rounded-full bg-[#5b5d60] transition-[width,background] duration-200 aria-[current=true]:w-[22px] aria-[current=true]:bg-lime"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}


