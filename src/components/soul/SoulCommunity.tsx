"use client";

import { useEffect, useRef } from "react";

export type Review = { name: string; initials: string; text: string };

const COPIES = 3; // list repeated 3× so the loop never runs out
const START = 1; // 2nd review sits at the left margin, 1st peeks in on the left
const AUTOPLAY_MS = 5000; // set to 0 to turn autoplay off

const MASK =
  "linear-gradient(90deg, rgba(0,0,0,.3) 0, #000 140px, #000 calc(100% - 140px), rgba(0,0,0,.2) 100%)";

function Star() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.2l2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.2 6.1 20.4l1.2-6.6L2.4 9.2l6.7-.9L12 2.2z" />
    </svg>
  );
}

export function SoulCommunity({
  reviews,
  avatars,
}: {
  reviews: Review[];
  avatars: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const n = reviews.length;
  const idxRef = useRef(n + START);
  const stepRef = useRef(0);
  const lockRef = useRef(false);
  const hoverRef = useRef(false);

  const apply = (animate: boolean) => {
    const t = trackRef.current;
    if (!t) return;
    t.style.transition = animate
      ? "transform 600ms cubic-bezier(.22,.8,.24,1)"
      : "none";
    t.style.transform = `translate3d(${-idxRef.current * stepRef.current}px,0,0)`;
    if (!animate) void t.offsetWidth;
  };

  const go = (dir: 1 | -1) => {
    if (lockRef.current) return;
    lockRef.current = true;
    idxRef.current += dir;
    apply(true);
    setTimeout(() => (lockRef.current = false), 620);
  };

  // after a slide ends, silently jump back into the middle copy (seamless loop)
  const onEnd = (e: React.TransitionEvent) => {
    if (e.target !== trackRef.current) return;
    if (idxRef.current >= 2 * n) idxRef.current -= n;
    else if (idxRef.current < n) idxRef.current += n;
    apply(false);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const measure = () => {
      const k = track.children;
      stepRef.current =
        (k[1] as HTMLElement).offsetLeft - (k[0] as HTMLElement).offsetLeft;
      apply(false);
    };

    let sx = 0,
      sy = 0;
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
        go(dx < 0 ? 1 : -1);
    };
    const enter = () => (hoverRef.current = true);
    const leave = () => (hoverRef.current = false);

    measure();
    const t = setTimeout(measure, 300);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const auto =
      AUTOPLAY_MS && !reduce
        ? setInterval(() => {
            if (!hoverRef.current && !document.hidden) go(1);
          }, AUTOPLAY_MS)
        : undefined;

    window.addEventListener("resize", measure);
    section.addEventListener("touchstart", onStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });
    section.addEventListener("mouseenter", enter);
    section.addEventListener("mouseleave", leave);
    return () => {
      clearTimeout(t);
      if (auto) clearInterval(auto);
      window.removeEventListener("resize", measure);
      section.removeEventListener("touchstart", onStart);
      section.removeEventListener("touchend", onTouchEnd);
      section.removeEventListener("mouseenter", enter);
      section.removeEventListener("mouseleave", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const Arrow = ({ dir }: { dir: 1 | -1 }) => (
    <button
      type="button"
      aria-label={dir === 1 ? "Next review" : "Previous review"}
      onClick={() => go(dir)}
      className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#1f2122] text-[#8a8c8e] transition hover:bg-[#2a2c2e] hover:text-white"
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
      className="overflow-x-clip bg-[#17191a] pb-[88px] pt-[100px] text-white [container-type:inline-size] [--cw:82cqw] [--gap:16px] [--l:9cqw] md:pt-[124px] md:[--cw:424px] md:[--gap:24px] md:[--l:calc((100cqw_-_min(1310px,92cqw))/2_+_16px)]"
    >
      <div className="mx-auto flex w-[90cqw] items-end justify-between gap-6 md:w-[min(1310px,92cqw)]">
        <div>
          <h2 className="font-grotesk text-[clamp(26px,4.5vw,49px)] font-bold uppercase leading-[.92] tracking-[-.045em]">
            Community over 25 million users
          </h2>
          <p className="mt-4 max-w-[500px] text-[15px] leading-6 text-[#6b6e70] md:text-[16px]">
            Join a global creative network where people generate AI images,
            share ideas, and inspire each other every day.
          </p>
        </div>
        <div className="hidden shrink-0 gap-5 md:flex">
          <Arrow dir={-1} />
          <Arrow dir={1} />
        </div>
      </div>

      <div
        className="mt-[56px] md:mt-[80px]"
        style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      >
        <div
          ref={trackRef}
          onTransitionEnd={onEnd}
          className="flex w-max pl-[var(--l)] will-change-transform"
        >
          {Array.from({ length: COPIES }).flatMap((_, c) =>
            reviews.map((r, i) => (
              <article
                key={`${c}-${i}`}
                aria-hidden={c !== 1}
                className="mr-[var(--gap)] flex w-[var(--cw)] shrink-0 flex-col rounded-[28px] border border-white/[.07] bg-[#1b1d1e] md:h-[343px] md:rounded-[32px]"
              >
                <div className="flex h-[70px] shrink-0 items-center justify-between pl-[26px] pr-[28px]">
                  <div className="flex min-w-0 items-center gap-[13px]">
                    <span className="flex h-[37px] w-[37px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#2b2d2f] text-[13px] font-bold text-white">
                      {r.initials}
                    </span>
                    <span className="truncate whitespace-nowrap text-[17px] font-medium md:text-[19px]">
                      {r.name}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-[10px] text-[#c2c3c4]">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} />
                    ))}
                  </div>
                </div>
                <div className="m-[10px] mt-0 flex-1 overflow-hidden rounded-[22px] border border-white/[.04] bg-[#151617] px-6 py-6">
                  <p className="text-[16px] font-semibold leading-6 text-white md:text-[17.6px]">
                    {r.text}
                  </p>
                </div>
              </article>
            )),
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-5 md:hidden">
        <Arrow dir={-1} />
        <Arrow dir={1} />
      </div>

      <div className="mt-[60px] flex items-center justify-center gap-3 md:mt-[103px]">
        <div className="flex">
          {avatars.slice(0, 4).map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-[28px] w-[28px] rounded-full border-2 border-white object-cover"
              style={{ marginLeft: i ? -6 : 0 }}
            />
          ))}
        </div>
        <span className="text-[15px] text-[#8b8d8f] md:text-[16px]">
          Trusted by 5.000+ people worldwide
        </span>
      </div>
    </section>
  );
}
