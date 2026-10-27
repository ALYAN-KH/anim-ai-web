"use client";

import { useEffect, useState } from "react";

export type GenerationKind = "image" | "video" | "audio" | "liked";

export const LOADING_MS = 2000;

const COPY: Record<GenerationKind, { title: string; hint: string }> = {
  image: {
    title: "Your image generations will appear here",
    hint: "Generate images to see them here",
  },
  video: {
    title: "Your video generations will appear here",
    hint: "Generate videos to see them here",
  },
  audio: {
    title: "Your audio generations will appear here",
    hint: "Generate audio to see them here",
  },
  liked: {
    title: "Your favorite generations will appear here",
    hint: "Mark the ones you like to save them here",
  },
};

const SKELETON_COUNT = 12;

const SKELETON_DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:150ms]",
  "[animation-delay:300ms]",
  "[animation-delay:450ms]",
];

const GRID_CLASS =
  "grid-cols-[repeat(var(--assets-picker-grid-columns,auto-fill),minmax(var(--assets-picker-grid-min-column-width,130px),1fr))]";

export function LoadingGrid({ label = "Loading generations" }: { label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={`grid auto-rows-max content-start gap-3 overflow-hidden p-2 ${GRID_CLASS} min-h-0 flex-1`}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <div key={i} className={`aspect-square animate-pulse rounded-[0.625rem] bg-white/5 ${SKELETON_DELAYS[i % SKELETON_DELAYS.length]}`} />
      ))}
    </div>
  );
}

const ICON_GRADIENT: Record<GenerationKind, string> = {
  image:
    "bg-[linear-gradient(135deg,rgb(93,255,246)_3.87%,rgb(7,85,174)_93.45%)]",
  video:
    "bg-[linear-gradient(135deg,rgb(93,255,246)_3.87%,rgb(7,85,174)_93.45%)]",
  audio:
    "bg-[linear-gradient(135deg,rgb(93,255,246)_3.87%,rgb(7,85,174)_93.45%)]",
  liked:
    "bg-[linear-gradient(135deg,rgb(255,125,165)_3.87%,rgb(185,40,150)_93.45%)]",
};

const REVEAL_BASE =
  "transition-all duration-1000 ease-out motion-reduce:transition-none";

const REVEAL_HIDDEN = "translate-y-3 scale-95 opacity-0 blur-[10px]";

const REVEAL_SHOWN = "translate-y-0 scale-100 opacity-100 blur-[0px]";

function HeartIcon() {
  return (
    <svg
      className="size-6"
      aria-hidden="true"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.32781C12.1935 4.18729 12.4386 4.02609 12.7319 3.86553C13.5214 3.43347 14.6725 3 16.1111 3C17.5979 3 19.0829 3.5977 20.1921 4.78484C21.3047 5.97563 22 7.71515 22 9.9375C22 13.2536 19.6489 16.0247 17.3927 17.8948C16.2446 18.8464 15.0735 19.6049 14.1357 20.1276C13.6669 20.3889 13.2492 20.5954 12.9151 20.7391C12.7487 20.8106 12.5947 20.8702 12.4603 20.9134C12.3511 20.9485 12.1754 21 12 21C11.8246 21 11.6489 20.9485 11.5397 20.9134C11.4053 20.8702 11.2513 20.8106 11.0849 20.7391C10.7508 20.5954 10.3331 20.3889 9.86432 20.1276C8.92652 19.6049 7.75539 18.8464 6.60732 17.8948C4.35114 16.0247 2 13.2536 2 9.9375C2 7.71515 2.69528 5.97563 3.80789 4.78484C4.91708 3.5977 6.40208 3 7.88889 3C9.32752 3 10.4786 3.43347 11.2681 3.86553C11.5614 4.02609 11.8065 4.18729 12 4.32781Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GenerationIcon({ kind }: { kind: GenerationKind }) {
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 overflow-visible size-12"
    >
      <span
        className={`absolute inset-0 rounded-xl overflow-hidden shadow-[0_4px_4px_0_rgba(0,0,0,0.08),inset_0_2px_4px_0_rgba(255,255,255,0.24)] ${ICON_GRADIENT[kind]}`}
      />
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(255,255,255,1)_100%)] opacity-20 mix-blend-overlay" />
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(255,255,255,1)_100%)] opacity-32 mix-blend-hard-light" />
      <span className="pointer-events-none absolute inset-0 rounded-xl border border-white/4" />
      <span className="absolute inset-0 flex items-center justify-center text-white">
        {kind === "liked" ? (
          <HeartIcon />
        ) : (
          <svg
            className="size-6"
            aria-hidden="true"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 3.75C2 2.7835 2.7835 2 3.75 2H14.25C15.2165 2 16 2.7835 16 3.75V8H20.25C21.2165 8 22 8.7835 22 9.75V20.25C22 21.2165 21.2165 22 20.25 22H9.75C8.7835 22 8 21.2165 8 20.25V16H3.75C2.7835 16 2 15.2165 2 14.25V3.75ZM14.5 8V3.75C14.5 3.61193 14.3881 3.5 14.25 3.5H3.75C3.61193 3.5 3.5 3.61193 3.5 3.75V10.7413L5.03616 9.73485C5.62284 9.35047 6.38234 9.35351 6.96593 9.74257L8 10.4319V9.75C8 8.7835 8.7835 8 9.75 8H14.5ZM5 6.25C5 5.55964 5.55964 5 6.25 5C6.94036 5 7.5 5.55964 7.5 6.25C7.5 6.94036 6.94036 7.5 6.25 7.5C5.55964 7.5 5 6.94036 5 6.25ZM13.3906 12.5417C13.6314 12.4102 13.9248 12.4208 14.1556 12.5691L16.9556 14.3691C17.1702 14.5071 17.3 14.7448 17.3 15C17.3 15.2552 17.1702 15.4929 16.9556 15.6309L14.1556 17.4309C13.9248 17.5792 13.6314 17.5898 13.3906 17.4583C13.1498 17.3268 13 17.0744 13 16.8V13.2C13 12.9256 13.1498 12.6732 13.3906 12.5417Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
    </span>
  );
}

export function GenerationsPanel({ kind }: { kind: GenerationKind }) {
  const [loading, setLoading] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [loading]);

  if (loading) {
    return <LoadingGrid />;
  }

  const copy = COPY[kind];
  const reveal = shown ? REVEAL_SHOWN : REVEAL_HIDDEN;

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_25%_15%,rgba(255,140,80,0.07),transparent_55%)] p-6 text-center">
      <div className={`${REVEAL_BASE} ${reveal}`}>
        <GenerationIcon kind={kind} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p
          className={`text-lg font-semibold text-white delay-300 ${REVEAL_BASE} ${reveal}`}
        >
          {copy.title}
        </p>
        <p
          className={`text-sm text-white/50 delay-600 ${REVEAL_BASE} ${reveal}`}
        >
          {copy.hint}
        </p>
      </div>
    </div>
  );
}
