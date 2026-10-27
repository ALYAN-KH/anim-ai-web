"use client";

import { useEffect, useRef, useState } from "react";

type Item = { title: string; text: string; image: string };

export function SoulUseCases({ items }: { items: Item[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(items.length - 1);
  const indexRef = useRef(0);
  const maxIndexRef = useRef(items.length - 1);
  const stepRef = useRef(0);
  const maxOffRef = useRef(0);

  const apply = (i: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    const off = Math.min(i * stepRef.current, maxOffRef.current);
    track.style.transition = animate
      ? "transform 600ms cubic-bezier(.22,.8,.24,1)"
      : "none";
    track.style.transform = `translate3d(${-off}px,0,0)`;
  };

  const go = (i: number) => {
    const n = Math.min(maxIndexRef.current, Math.max(0, i));
    if (n === indexRef.current) return;
    indexRef.current = n;
    setIndex(n);
    apply(n, true);
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
      stepRef.current = step;
      // last card ends with the same margin on the right as the first one has on the left
      maxOffRef.current = Math.max(
        0,
        track.scrollWidth - gap + left - section.clientWidth,
      );
      const mi = step ? Math.ceil(maxOffRef.current / step - 1e-6) : 0;
      maxIndexRef.current = mi;
      setMaxIndex(mi);
      if (indexRef.current > mi) {
        indexRef.current = mi;
        setIndex(mi);
      }
      apply(indexRef.current, false);
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
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    section.addEventListener("touchstart", onStart, { passive: true });
    section.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      section.removeEventListener("touchstart", onStart);
      section.removeEventListener("touchend", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const Arrow = ({ dir, disabled }: { dir: -1 | 1; disabled: boolean }) => (
    <button
      type="button"
      aria-label={dir === 1 ? "Next" : "Previous"}
      disabled={disabled}
      onClick={() => go(indexRef.current + dir)}
      className={`flex h-[60px] w-[60px] items-center justify-center rounded-full transition ${
        disabled
          ? "cursor-default bg-[#f5f5f5] text-[#d0d0d0]"
          : "bg-[#ececec] text-[#666] hover:bg-[#e2e2e2]"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
      </svg>
    </button>
  );

  return (
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-white pb-[110px] pt-[56px] text-black [container-type:inline-size] [--cw:80cqw] [--l:6cqw] md:[--cw:calc((73.9cqw_-_20px)/2)] md:[--l:calc((100cqw_-_73.9cqw)/2_-_75px)]"
    >
      <div className="pl-[var(--l)]">
        <h2 className="font-grotesk text-[clamp(30px,2.84cqw,64px)] font-bold uppercase leading-[.92] tracking-[-.045em] text-[#111]">
          Use cases
        </h2>
        <p className="mt-3 text-[clamp(16px,1.26cqw,26px)] leading-[1.3] text-[#111]">
          Your next photoshoot starts with a prompt
        </p>
      </div>

      <div
        ref={trackRef}
        className="mt-[52px] flex w-max pl-[var(--l)] will-change-transform"
      >
        {items.map((item) => (
          <article
            key={item.title}
            className="mr-[20px] w-[var(--cw)] shrink-0"
          >
            <div className="aspect-[5/3] overflow-hidden rounded-[22px] bg-[#eee] md:rounded-[30px]">
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-[21px] max-w-[80%] text-[16px] leading-[1.4] text-[#767676] md:text-[clamp(15px,.945cqw,18px)]">
              <strong className="font-medium text-[#111]">
                {item.title.trim().endsWith(".")
                  ? item.title
                  : `${item.title}.`}
              </strong>{" "}
              {item.text}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14 flex justify-center gap-[13px]">
        <Arrow dir={-1} disabled={index <= 0} />
        <Arrow dir={1} disabled={index >= maxIndex} />
      </div>
    </section>
  );
}
