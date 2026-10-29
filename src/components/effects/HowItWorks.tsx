"use client";

import { useState } from "react";

const CDN = "https://cdn.higgsfield.ai/viral_hub_how_it_works";
const STEPS = [
  { title: "UPLOAD IMAGE", text: "Select a PNG or JPG from your device.", thumb: `${CDN}/7dd8245b-c852-4218-a851-32b969a32444.webp`, video: `${CDN}/6dd87945-f860-47e5-a459-4dc8a780e973.mp4` },
  { title: "GENERATE YOUR VIDEO", text: "Turn your uploaded image into a video using the selected preset.", thumb: `${CDN}/ca6b426b-b982-485b-943d-d98cb62c106f.webp`, video: `${CDN}/04fb809d-334a-4070-945b-f685c831fa81.mp4` },
  { title: "DOWNLOAD YOUR VIDEO", text: "Save it, share it with the world, and get ready to go viral.", thumb: `${CDN}/189738ca-651d-47ac-a7e6-7b378b3c24ba.webp` },
];
const arrow = "grid size-8 shrink-0 place-items-center rounded-full border-2 border-white/[0.08] text-white transition hover:border-white/10 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-lime active:scale-[0.97] absolute inset-y-0 my-auto";

export function HowItWorks() {
  const [i, setI] = useState(1);
  const step = STEPS[i];
  const go = (d: number) => setI(n => (n + d + STEPS.length) % STEPS.length);
  return (
    <section aria-label="How it works steps" className="grid size-full min-h-0 place-items-center" tabIndex={0} onKeyDown={e => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}>
      <div className="flex size-full max-h-[49.5rem] min-h-0 flex-col items-center justify-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-4">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <figure className="relative h-full max-h-[38.5rem] w-auto max-w-full overflow-hidden rounded-2xl bg-white/5" style={{ aspectRatio: "600 / 750" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={step.thumb} alt="" className="absolute inset-0 size-full object-cover" />
            {step.video && <video key={step.video} src={step.video} poster={step.thumb} autoPlay loop muted playsInline disablePictureInPicture preload="auto" className="absolute inset-0 size-full object-cover" />}
          </figure>
        </div>
        <div className="flex w-full shrink-0 flex-col items-center gap-2 text-center">
          <h2 className="font-grotesk text-lg font-bold uppercase text-white">{step.title}</h2>
          <p className="line-clamp-2 min-h-10 w-full max-w-[36.875rem] text-sm text-white/50">{step.text}</p>
        </div>
        <div className="relative flex h-10 max-w-full shrink-0 items-center justify-center" style={{ inlineSize: "16.625rem" }}>
          <button type="button" aria-label="Previous step" onClick={() => go(-1)} className={`${arrow} start-0`}><svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M14.9998 20L7.70696 12.7071C7.31643 12.3166 7.31643 11.6834 7.70695 11.2929L14.9998 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <div className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-full border border-white/5 bg-white/10 px-2" style={{ inlineSize: "11.625rem" }}>
            {STEPS.map((s, n) => (
              <button key={s.title} type="button" aria-label={`Show ${s.title}`} aria-current={n === i ? "step" : undefined} onClick={() => setI(n)} className={`shrink-0 overflow-hidden rounded-full transition-[border-color] duration-150 focus-visible:outline-2 focus-visible:outline-lime ${n === i ? "h-10 w-20 border-[1.5px] border-white p-1" : "h-6 w-10 border border-white/[0.12]"}`}>
                <span className="relative block size-full overflow-hidden rounded-full bg-white/5">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={s.thumb} alt={s.title} className="size-full object-cover" /></span>
              </button>
            ))}
          </div>
          <button type="button" aria-label="Next step" onClick={() => go(1)} className={`${arrow} end-0`}><svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M9 4L16.2929 11.2929C16.6834 11.6834 16.6834 12.3166 16.2929 12.7071L9 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        </div>
      </div>
    </section>
  );
}
