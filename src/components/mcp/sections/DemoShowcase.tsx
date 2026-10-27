"use client";
import { useEffect, useRef, useState } from "react";
import { DEMOS } from "../config";
import { buildChatGptUrl, buildPromptText } from "../lib/chatgpt-url";
import { copyText } from "../lib/clipboard";
import { ChatGptIcon, CheckIcon, CopyIcon, VolumeIcon } from "../ui/Icons";
import { LoopingVideo } from "../ui/LoopingVideo";

export function DemoShowcase() {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const demo = DEMOS.find((item) => item.id === activeId) ?? DEMOS[0];

  useEffect(() => {
    const video = videoContainerRef.current?.querySelector("video");
    if (video) video.muted = muted;
  }, [muted, activeId]);

  const handleCopy = async () => {
    if (await copyText(buildPromptText(demo.prompt))) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section aria-label="Demos" className="pb-24">
      <div
        role="tablist"
        aria-label="Choose a demo"
        className="hide-scrollbar mx-auto flex max-w-full items-center gap-1 overflow-x-auto px-4 pb-4 md:justify-center"
      >
        {DEMOS.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveId(item.id);
                setCopied(false);
              }}
              className={`flex h-[54px] shrink-0 items-center gap-2.5 rounded-full pl-2 pr-4 text-lg font-semibold transition-colors ${
                active ? "bg-[#17181a] text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.poster} alt="" className="size-[34px] rounded-full object-cover" />
              {item.label}
              {item.isNew && (
                <span className="rounded-full bg-[#d1fe17] px-2 py-0.5 text-xs font-bold text-black">New</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-7">
        <div
          key={demo.id}
          className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#101112] sm:aspect-[16/9] lg:aspect-[1700/820]"
        >
          {demo.videoSrc ? (
            <div ref={videoContainerRef} className="size-full">
              <LoopingVideo src={demo.videoSrc} poster={demo.poster} label={`${demo.title} demo`} muted={muted} />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={demo.poster} alt={`${demo.title} demo`} className="size-full object-cover" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute left-5 top-6 max-w-[460px] sm:left-10 sm:top-10">
            <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-[34px]">{demo.title}</h3>
            <p className="mt-5 text-lg font-medium leading-[25px] text-white/70">
              <span className="text-[#d1fe17]">@Higgsfield</span> {demo.prompt}
            </p>
          </div>

          <div className="absolute bottom-6 left-5 flex items-center gap-2.5 sm:bottom-10 sm:left-10">
            <a
              href={buildChatGptUrl(demo.prompt)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[50px] items-center gap-2 rounded-xl bg-white px-5 text-lg font-semibold text-black shadow-[0_3px_0_0_#b9b9b9] transition hover:brightness-95"
            >
              <ChatGptIcon className="size-6" />
              Try in ChatGPT
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-[50px] items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 text-lg font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {copied ? <CheckIcon className="size-5" /> : <CopyIcon className="size-5" />}
              {copied ? "Copied" : "Copy prompt"}
            </button>
          </div>

          {demo.videoSrc && (
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              aria-pressed={!muted}
              onClick={() => setMuted((value) => !value)}
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/65 sm:right-7 sm:top-7"
            >
              <VolumeIcon muted={muted} className="size-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
