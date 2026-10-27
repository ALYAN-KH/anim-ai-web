"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { title: string; text: string; image: string; href?: string };

export function SoulHighlights({
  items,
  href,
}: {
  items: Item[];
  href: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const stepRef = useRef(0);
  const maxRef = useRef(0); // max translate: last card right-aligned, like the official page

  const offsetFor = (i: number) => {
    const last = items.length - 1;
    if (i >= last) return maxRef.current;
    return Math.min(i * stepRef.current, maxRef.current);
  };

  const apply = (i: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate
      ? "transform 700ms cubic-bezier(.22,.8,.24,1)"
      : "none";
    track.style.transform = `translate3d(${-offsetFor(i)}px,0,0)`;
  };

  const go = (i: number) => {
    const n = Math.min(items.length - 1, Math.max(0, i));
    if (n === indexRef.current) return false;
    indexRef.current = n;
    setIndex(n);
    apply(n, true);
    return true;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const measure = () => {
      const k = track.children;
      const first = k[0] as HTMLElement;
      const step =
        k.length > 1 ? (k[1] as HTMLElement).offsetLeft - first.offsetLeft : 0;
      const gap = step - first.offsetWidth;
      const left = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const lastEnd = track.scrollWidth - gap; // right edge of the last card
      stepRef.current = step;
      maxRef.current = Math.max(0, lastEnd + left - section.clientWidth); // same margin on the right as on the left
      apply(indexRef.current, false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;

      const r = section.getBoundingClientRect();
      const inView =
        r.top < window.innerHeight * 0.75 &&
        r.bottom > window.innerHeight * 0.25;
      if (!inView) return;

      const moved = go(indexRef.current + (e.key === "ArrowRight" ? 1 : -1));
      if (moved) e.preventDefault();
    };

    let sx = 0;
    let sy = 0;
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
        go(indexRef.current + (dx < 0 ? 1 : -1));
    };

    measure();
    const t = setTimeout(measure, 300); // re-measure after images/fonts settle
    window.addEventListener("resize", measure);
    window.addEventListener("keydown", onKey);
    section.addEventListener("touchstart", onStart, { passive: true });
    section.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey);
      section.removeEventListener("touchstart", onStart);
      section.removeEventListener("touchend", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      className="overflow-x-clip bg-[#080909] pb-20 pt-24 text-white [container-type:inline-size] [--l:6cqw] [--w:88cqw] md:[--l:calc((100cqw_-_var(--w))/2_-_75px)] md:[--w:73.9cqw]"
    >
      <h2 className="pl-[var(--l)] font-grotesk text-[clamp(30px,2.84cqw,64px)] font-bold uppercase leading-[.92] tracking-[-.045em]">
        Get the highlights
      </h2>

      <div
        ref={trackRef}
        className="mt-8 flex w-max pl-[var(--l)] will-change-transform md:mt-[63px]"
      >
        {items.map((item, i) => (
          <article
            key={item.title}
            aria-hidden={i !== index}
            className="mr-[20px] w-[var(--w)] shrink-0"
          >
            <div className="aspect-[1.75] overflow-hidden rounded-[28px] bg-[#111]">
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-5 flex items-start justify-between gap-6 max-md:flex-col">
              <p className="pt-[2px] text-[clamp(15px,1.15vw,22px)] font-medium leading-[1.3] text-[#8b8d90]">
                <strong className="font-semibold text-white">
                  {item.title.trim().endsWith(".")
                    ? item.title
                    : `${item.title}.`}
                </strong>{" "}
                {item.text}
              </p>
              <Link
                href={item.href ?? href}
                className="inline-flex h-11 shrink-0 items-center gap-2.5 rounded-xl bg-white px-5 text-[15px] font-medium text-black transition hover:scale-[1.03]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M3 12h18M14 5l7 7-7 7" />
                </svg>
                Try now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
