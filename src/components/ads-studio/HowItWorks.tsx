"use client";

import { useEffect, useRef, useState } from "react";
import { STEPS } from "./data";

const arrowBtn = "grid size-8 place-items-center rounded-full border border-white/15 text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime";

export function HowItWorks() {
  const [i, setI] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const step = STEPS[i];
  const go = (d: number) => setI(n => (n + d + STEPS.length) % STEPS.length);
  useEffect(() => {
    video.current?.play().catch(() => {});
  }, [i]);
  return (
    <section data-ads-how-it-works-island="1" className="relative flex w-full flex-col items-center gap-6">
      <h2 className="text-xs font-semibold uppercase text-white/50">How it works</h2>
      <div className="h-36 w-64 shrink-0 overflow-hidden rounded-2xl bg-white/5">
        <video ref={video} key={step.video} loop muted playsInline autoPlay preload="metadata" poster={step.poster} className="size-full object-cover"><source src={step.video} type="video/mp4" /></video>
      </div>
      <div aria-live="polite" className="grid w-full text-center">
        {STEPS.map((s, n) => (
          <div key={s.title} aria-hidden={n !== i} className={`col-start-1 row-start-1 flex w-full flex-col items-center gap-1 transition-opacity duration-300 ${n === i ? "opacity-100" : "invisible opacity-0"}`}>
            <h3 className="font-grotesk text-2xl font-bold uppercase tracking-[-0.06rem] text-white max-md:text-xl">{s.title}</h3>
            <p className="min-h-[2lh] max-w-[34.25rem] text-base text-[#898a8b]">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Previous step" onClick={() => go(-1)} className={arrowBtn}><svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 18.25 8.25 12l6.25-6.25" /></svg></button>
        <div className="flex h-10 w-[14.25rem] items-center gap-1 rounded-full bg-black/10 px-2 ring-[0.78px] ring-inset ring-[rgba(217,217,217,0.04)] max-[374px]:w-[12.75rem]">
          {STEPS.map((s, n) => (
            <button key={s.title} type="button" data-ads-how-it-works-pill={n + 1} aria-label={`Step ${n + 1}: ${s.title}`} aria-current={n === i ? "step" : undefined} onClick={() => setI(n)} className={`shrink-0 overflow-hidden rounded-full outline-none transition-[width,height,padding,border-width,border-color] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-lime motion-reduce:transition-none ${n === i ? "h-10 w-20 border-[1.5px] border-white p-[2.5px]" : "h-6 w-10 border border-white/[0.12] hover:border-white/40 max-[374px]:w-8"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" draggable={false} src={s.poster} className="size-full rounded-full object-cover" />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Next step" onClick={() => go(1)} className={arrowBtn}><svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 18.25 15.75 12 9.5 5.75" /></svg></button>
      </div>
    </section>
  );
}
