"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const COPIES = 4;
const START_INDEX = 5;
const SPEED = 45;
const EASE = 3;

export function SoulHero({ images, href }: { images: string[]; href: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderHovered = useRef(false);
  const buttonActive = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pos = 0;
    let vel = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const shouldMove = !sliderHovered.current || buttonActive.current;
      const target = shouldMove && !reduce ? SPEED : 0;
      vel += (target - vel) * Math.min(1, EASE * dt);
      pos += vel * dt;

      const kids = track.children;
      const step =
        (kids[1] as HTMLElement).offsetLeft -
        (kids[0] as HTMLElement).offsetLeft;
      const setW = step * images.length;
      pos %= setW;

      const inset =
        window.innerWidth * (window.innerWidth < 768 ? 0.08 : 0.103);
      track.style.transform = `translate3d(${inset - setW - START_INDEX * step - pos}px,0,0)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [images.length]);

  const enterSlider = () => (sliderHovered.current = true);
  const leaveSlider = () => (sliderHovered.current = false);
  const activateButton = () => (buttonActive.current = true);
  const deactivateButton = () => (buttonActive.current = false);

  return (
    <section className="relative overflow-hidden bg-[#080909] pt-[55px]">
      <div
        className="relative"
        onMouseEnter={enterSlider}
        onMouseLeave={leaveSlider}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: COPIES }).flatMap((_, c) =>
            images.map((src, i) => (
              <img
                key={`${c}-${i}`}
                src={src}
                alt="Soul 2.0 visual"
                draggable={false}
                decoding="async"
                className="aspect-[5/7] w-[58vw] shrink-0 rounded-[20px] object-cover mr-[3vw] md:w-[24.5vw] md:mr-[1.6vw]"
              />
            )),
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <h3 className="mb-[1.6vw] font-grotesk text-[clamp(30px,3.05vw,64px)] font-bold uppercase leading-none tracking-[-.04em] text-white">
            Higgsfield
          </h3>
          <img
            src="/higgsfield-assets/soul2-wordmark.svg"
            alt="Soul 2.0"
            className="w-[86vw] max-w-none md:w-[56.4vw]"
          />
          <Link
            href={href}
            onMouseEnter={activateButton}
            onMouseLeave={deactivateButton}
            onFocus={activateButton}
            onBlur={deactivateButton}
            className="pointer-events-auto mt-[2.15vw] inline-flex h-[clamp(48px,3.4vw,72px)] items-center gap-2 rounded-[clamp(12px,.85vw,18px)] bg-white px-[clamp(24px,2.1vw,44px)] text-[clamp(15px,1.05vw,22px)] font-medium text-black"
          >
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" />
            </svg>
            Start Creating
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 py-[2.2vw] md:flex-row md:items-start md:justify-between md:px-[9vw]">
        <svg
          className="hidden h-7 w-7 text-white md:ml-[1vw] md:block"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 4v16M5 13l7 7 7-7" />
        </svg>
        <p className="max-w-[44vw] text-center text-[15px] font-medium leading-[1.5] text-white md:text-right md:text-[clamp(15px,1.05vw,22px)] max-md:max-w-[520px]">
          Soul 2.0 is a new foundation image model built for creative,
          fashion-aware, culture-native generation. Designed for aesthetics -
          every image has taste built in.
        </p>
      </div>
    </section>
  );
}
