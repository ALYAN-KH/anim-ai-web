"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DEMOS, MODEL_ICONS } from "../config";
import { buildPromptText } from "../lib/chatgpt-url";
import { copyText } from "../lib/clipboard";
import type { AgentId } from "../types";
import { CheckIcon, CopyIcon, VolumeIcon } from "../ui/Icons";
import { LoopingVideo } from "../ui/LoopingVideo";
import { TryButton } from "./TryButton";

interface DemoShowcaseProps {
  agentId?: AgentId;
}

/** Offset of slide `index` from the active one, wrapped into [-n/2, n/2]. */
function wrapOffset(index: number, active: number, count: number) {
  const half = Math.floor(count / 2);
  return ((((index - active + half) % count) + count) % count) - half;
}

/** Mirrors the live slider: pill tabs with an auto-advance progress fill + perspective-tilted panels. */
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

  const advance = () => select(DEMOS[(activeIndex + 1) % DEMOS.length].id);

  const handleCopy = async () => {
    const text = isClaude ? demo.prompt : buildPromptText(demo.prompt);
    if (await copyText(text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section aria-label="Demos" className="mcp-demos">
      <div className="mcp-demo-root">
        <div role="tablist" aria-label="Explore Higgsfield demos" className="mcp-demo-tabs">
          {DEMOS.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={item.label}
                data-active={active ? "" : undefined}
                onClick={() => select(item.id)}
                onAnimationEnd={active ? advance : undefined}
                className="mcp-demo-tab"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.poster} alt="" width={22} height={22} className="mcp-demo-thumb" />
                <span className="relative">{item.label}</span>
                {item.isNew && <span className="mcp-demo-new relative">New</span>}
              </button>
            );
          })}
        </div>

        <div className="mcp-demo-track" role="region" aria-label="Demo slides">
          {DEMOS.map((item, index) => {
            const offset = wrapOffset(index, activeIndex, DEMOS.length);
            const active = offset === 0;
            const neighbor = Math.abs(offset) === 1;
            return (
              <div
                key={item.id}
                role="tabpanel"
                aria-hidden={!active && !neighbor}
                // React 18 only forwards `inert` as a string attribute.
                inert={active || neighbor ? undefined : ("" as unknown as boolean)}
                data-active={active ? "" : undefined}
                data-hidden={active || neighbor ? undefined : ""}
                style={{ "--o": offset, "--a": Math.min(1, Math.abs(offset)) } as CSSProperties}
                className="mcp-demo-panel"
              >
                <div ref={active ? videoContainerRef : undefined} className="mcp-demo-media">
                  {item.videoSrc && active ? (
                    <LoopingVideo src={item.videoSrc} poster={item.poster} label={`${item.title} demo`} muted={muted} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.poster} alt="" width={721} height={382} loading="lazy" />
                  )}
                  {active && item.videoSrc && (
                    <button
                      type="button"
                      aria-label={muted ? "Unmute video" : "Mute video"}
                      aria-pressed={!muted}
                      onClick={() => setMuted((value) => !value)}
                      className="mcp-demo-sound"
                    >
                      <VolumeIcon muted={muted} />
                    </button>
                  )}
                </div>

                {active && (
                  <div className="mcp-demo-content">
                    <div className="mcp-demo-desc">
                      <h3 className="mcp-demo-title">{item.title}</h3>
                      <div className="mcp-demo-promptwrap">
                        <p id="mcp-demo-prompt" className="mcp-demo-prompt" data-expanded={expanded ? "" : undefined}>
                          {!isClaude && <span>@Higgsfield </span>}
                          {item.prompt}
                        </p>
                        {item.prompt.length > 150 && (
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls="mcp-demo-prompt"
                            onClick={() => setExpanded((value) => !value)}
                            className="mcp-demo-more"
                          >
                            {expanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mcp-demo-actions">
                      <TryButton agentId={agentId} prompt={item.prompt} className="mcp-demo-try" />
                      <button type="button" onClick={handleCopy} className="mcp-demo-copy">
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        {copied ? "Copied" : "Copy prompt"}
                      </button>
                    </div>
                  </div>
                )}

                {active && item.models && (
                  <ul aria-label="Featured models" className="mcp-demo-models">
                    {item.models.map((model) => (
                      <li key={model}>
                        <span className="mcp-demo-model">
                          {MODEL_ICONS[model] && (
                            <span aria-hidden="true" className="inline-flex" dangerouslySetInnerHTML={{ __html: MODEL_ICONS[model] }} />
                          )}
                          {model}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {neighbor && (
                  <button type="button" aria-label={`Show ${item.label}`} onClick={() => select(item.id)} className="mcp-demo-preview" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
