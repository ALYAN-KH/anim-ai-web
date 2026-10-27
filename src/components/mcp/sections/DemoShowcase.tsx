"use client";
import { useEffect, useRef, useState } from "react";
import { CLAUDE_ICON, DEMOS } from "../config";
import { buildChatGptUrl, buildClaudeUrl, buildPromptText } from "../lib/chatgpt-url";
import { copyText } from "../lib/clipboard";
import type { AgentId } from "../types";
import { ChatGptIcon, CheckIcon, CopyIcon, VolumeIcon } from "../ui/Icons";
import { LoopingVideo } from "../ui/LoopingVideo";

interface DemoShowcaseProps {
  agentId?: AgentId;
}

export function DemoShowcase({ agentId = "chatgpt" }: DemoShowcaseProps) {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    DEMOS.findIndex((item) => item.id === activeId),
  );
  const demo = DEMOS[activeIndex];
  const isClaude = agentId === "claude" || agentId === "claude-code";

  useEffect(() => {
    const video = videoContainerRef.current?.querySelector("video");
    if (video) video.muted = muted;
  }, [muted, activeId]);

  const select = (id: string) => {
    setActiveId(id);
    setCopied(false);
    setExpanded(false);
  };

  const handleCopy = async () => {
    const text = isClaude ? demo.prompt : buildPromptText(demo.prompt);
    if (await copyText(text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section aria-label="Demos" className="overflow-hidden pb-24">
      <div
        role="tablist"
        aria-label="Explore Higgsfield demos"
        className="hide-scrollbar mx-auto mb-5 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white/[0.06] p-1 backdrop-blur-xl"
      >
        {DEMOS.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={item.label}
              onClick={() => select(item.id)}
              className={`flex h-[46px] shrink-0 items-center gap-2.5 rounded-full pl-1.5 pr-4 text-lg font-semibold transition-all duration-300 ${
                active ? "bg-[#17181a] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" : "text-white/55 hover:text-white"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.poster} alt="" className="size-[34px] rounded-full object-cover" />
              {item.label}
              {item.isNew && (
                <span className="rounded-full bg-[#d1fe17] px-2 py-0.5 text-xs font-bold leading-4 text-black">New</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mx-auto w-full max-w-[1700px] px-4 sm:px-7">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[1700/820]">
          {DEMOS.map((item, index) => {
            const offset = index - activeIndex;
            const active = offset === 0;
            const near = Math.abs(offset) <= 1;
            return (
              <div
                key={item.id}
                role="tabpanel"
                aria-hidden={!active}
                inert={!active}
                onClick={!active && near ? () => select(item.id) : undefined}
                style={{
                  transform: `translateX(calc(${offset} * (100% + 28px)))`,
                  opacity: active ? 1 : near ? 0.35 : 0,
                }}
                className={`absolute inset-0 isolate overflow-hidden rounded-[32px] border border-white/10 bg-[#101112] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  !active && near ? "cursor-pointer" : ""
                }`}
              >
                <div ref={active ? videoContainerRef : undefined} className="size-full">
                  {item.videoSrc && active ? (
                    <LoopingVideo src={item.videoSrc} poster={item.poster} label={`${item.title} demo`} muted={muted} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.poster} alt={active ? item.title : ""} className="size-full object-cover" />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

                {active && (
                  <>
                    <div className="absolute left-5 top-6 max-w-[460px] sm:left-10 sm:top-10">
                      <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-[34px]">{item.title}</h3>
                      <p
                        id="mcp-demo-prompt"
                        className={`mt-5 text-lg font-medium leading-[25px] text-white/70 ${expanded ? "" : "line-clamp-6"}`}
                      >
                        {!isClaude && <span className="text-[#d1fe17]">@Higgsfield </span>}
                        {item.prompt}
                      </p>
                      {item.prompt.length > 230 && (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls="mcp-demo-prompt"
                          onClick={() => setExpanded((value) => !value)}
                          className="mt-1 text-base font-semibold text-white/90 underline-offset-4 hover:underline"
                        >
                          {expanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>

                    <div className="absolute bottom-6 left-5 sm:bottom-10 sm:left-10">
                      <div className="flex items-center gap-2.5">
                        <a
                          href={isClaude ? buildClaudeUrl(item.prompt) : buildChatGptUrl(item.prompt)}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex h-[50px] items-center gap-2 rounded-xl px-5 text-lg font-semibold transition hover:brightness-95 ${
                            isClaude
                              ? "bg-[#d97757] text-white shadow-[0_3px_0_0_#a85a40]"
                              : "bg-white text-black shadow-[0_3px_0_0_#b9b9b9]"
                          }`}
                        >
                          {isClaude ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={CLAUDE_ICON} alt="" className="size-5 brightness-0 invert" />
                          ) : (
                            <ChatGptIcon className="size-6" />
                          )}
                          {isClaude ? "Try in Claude" : "Try in ChatGPT"}
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
                      {item.models && (
                        <ul aria-label="Featured models" className="mt-4 flex flex-wrap gap-2">
                          {item.models.map((model) => (
                            <li
                              key={model}
                              className="inline-flex items-center rounded-lg border border-white/10 bg-white/10 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-md"
                            >
                              {model}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {item.videoSrc && (
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
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
