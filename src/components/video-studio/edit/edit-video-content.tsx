"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WorkflowGuide, WorkflowStepCard } from "../shared/workflow-guide";
import { editVideoMedia, editWorkflowSteps } from "../data";

export const tutorials = [
  {
    title: "Relight & Atmosphere",
    description:
      "Change daytime to dusk or add cinematic lighting. The model understands 3D geometry to adjust light and shadow",
    image: editVideoMedia.relightPoster,
    video: editVideoMedia.relight,
  },
  {
    title: "Draw to Edit",
    description:
      "Draw over the part of the video you want to change, then describe the edit in your prompt.",
    image: editVideoMedia.draw,
    video: editVideoMedia.drawVideo,
  },
  {
    title: "Precise Object Swap",
    description: "Replace objects while keeping the rest of the scene intact.",
    image: editVideoMedia.swap,
    video: editVideoMedia.swapVideo,
  },
  {
    title: "Re-frame & Composition",
    description: "Change the framing of your video for a new format.",
    image: editVideoMedia.reframe,
    video: editVideoMedia.reframeVideo,
  },
  {
    title: "Smart Clean Up",
    description: "Remove distractions from your footage.",
    image: editVideoMedia.cleanup,
    video: editVideoMedia.cleanupVideo,
  },
  {
    title: "Recolor & Restyle",
    description: "Give your footage a new visual treatment.",
    image: editVideoMedia.recolor,
    video: editVideoMedia.recolorVideo,
  },
] as const;

export interface EditHistoryGuideProps {
  view?: "list" | "grid";
}

export function EditHistoryGuide({
  view: _view = "grid",
}: EditHistoryGuideProps) {
  return <WorkflowGuide title="From concept to final cut in seconds">{editWorkflowSteps.map(item => <WorkflowStepCard key={item.step} step={item.step} title={item.title} description={item.description} src={item.src} srcSet={item.srcSet} />)}</WorkflowGuide>;
}

export interface EditVideoContentProps {
  pageTab: "history" | "how";
  view?: "list" | "grid";
}

/** Auto-playing video that restarts whenever the src changes. */
function TutorialVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.load();
    const start = () => el.play().catch(() => undefined);
    el.addEventListener("canplay", start, { once: true });
    start();
    return () => el.removeEventListener("canplay", start);
  }, [src]);

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      poster={poster}
      muted
      loop
      autoPlay
      preload="auto"
      playsInline
      disablePictureInPicture
      className="absolute inset-0 size-full object-cover"
    />
  );
}

export function EditVideoContent({
  pageTab,
  view = "grid",
}: EditVideoContentProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = tutorials[activeIndex];

  if (pageTab === "history") {
    return <EditHistoryGuide view={view} />;
  }

  return (
    <section className="mx-4 mt-1 flex min-h-[calc(100%-0.25rem)] flex-col items-center rounded-t-[28px] border border-white/[.08] bg-[#111315] px-4 pb-4 pt-4 max-md:pb-16">
      <div className="flex w-full flex-col items-center gap-6">
        {/* The official layout uses a large active video, with the controls below it. */}
        <div className="relative aspect-video w-full max-w-[700px] shrink-0 overflow-hidden rounded-2xl bg-black">
          <TutorialVideo src={active.video} poster={active.image} />
        </div>

        <div className="flex shrink-0 flex-col items-center gap-4 max-md:w-full">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h1 className="font-grotesk text-[28px] font-bold uppercase leading-tight text-white max-lg:text-[22px]">
              {active.title}
            </h1>
            <p className="max-w-[590px] text-[15px] leading-6 text-white/75 max-md:text-sm max-md:leading-[22px]">
              {active.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 px-4 max-md:w-full max-md:gap-2 max-md:px-0">
            <button
              type="button"
              aria-label="Previous tutorial"
              onClick={() =>
                setActiveIndex(
                  (i) => (i - 1 + tutorials.length) % tutorials.length,
                )
              }
              className="grid size-12 shrink-0 place-items-center rounded-full max-md:size-11 border border-white/[.08] bg-black/10 text-white/60 transition hover:bg-white/[.05] hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex h-15 items-center gap-2 rounded-full border border-white/[.08] bg-black/10 px-3 py-0 [scrollbar-width:none] max-md:min-w-0 max-md:flex-1 max-md:overflow-x-auto max-md:scroll-smooth max-md:px-2">
              {tutorials.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={item.title}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`${index === activeIndex ? "h-12 w-20 border-[1.5px] p-1" : "size-8 border"} shrink-0 overflow-hidden rounded-full transition ${index === activeIndex
                      ? "border-white opacity-100"
                      : "border-white/10 opacity-80 hover:opacity-100"
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full rounded-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next tutorial"
              onClick={() => setActiveIndex((i) => (i + 1) % tutorials.length)}
              className="grid size-12 shrink-0 place-items-center rounded-full max-md:size-11 border border-white/[.08] bg-black/10 text-white/60 transition hover:bg-white/[.05] hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
