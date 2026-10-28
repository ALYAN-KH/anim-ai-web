"use client";
import { PRESET_CATEGORIES, SITE } from "../config";
import type { AgentId, PresetDefinition } from "../types";
import { CategoryGlyph } from "../ui/CategoryGlyph";
import { LoopingVideo } from "../ui/LoopingVideo";
import { Reveal } from "../ui/Reveal";
import { TryButton } from "./TryButton";

interface PresetCardProps {
  preset: PresetDefinition;
  agentParam: string;
  agentId?: AgentId;
}

/** Markup mirrors the live page: card > link(cover + body) with absolutely positioned actions. */
export function PresetCard({ preset, agentParam, agentId = "chatgpt" }: PresetCardProps) {
  const learnMore = `${SITE}/mcp/${preset.slug}?tab=${agentParam}`;
  const tags = PRESET_CATEGORIES.filter((category) => preset.categories.includes(category.id));
  const { media } = preset;

  return (
    <Reveal>
      <div className="mcp-card">
        <a href={learnMore} aria-label={preset.title} className="mcp-card-link block max-md:!grid-cols-1">
          <div className="mcp-cover">
            {media.src && media.kind === "video" && (
              <LoopingVideo src={media.src} poster={media.poster} label={`${preset.title} preview`} />
            )}
            {media.src && media.kind === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt={`${preset.title} preview`} loading="lazy" className="size-full object-cover" />
            )}
          </div>

          <div className="mcp-card-body">
            <div className="mcp-card-content">
              <div className="mcp-card-text">
                <h2 className="mcp-card-title">
                  <span className="inline-flex items-center gap-[5px]">
                    {preset.title}
                    {preset.isNew && <span className="mcp-new">New</span>}
                  </span>
                </h2>
                <p className="mcp-desc">{preset.description}</p>
              </div>
              <div className="mcp-tags">
                <span className="mcp-tag mcp-tag-cmd">
                  <b>/</b>
                  {preset.command}
                </span>
                {tags.map((tag) => (
                  <span key={tag.id} className="mcp-tag">
                    <CategoryGlyph label={tag.label} />
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </a>

        <div className="mcp-actions max-md:static max-md:mt-3">
          <TryButton
            agentId={agentId}
            prompt={preset.prompt}
            references={preset.references}
            className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-white px-4 text-[15px] font-semibold text-black transition hover:brightness-95"
          />
          <a
            href={learnMore}
            className="inline-flex h-10 items-center rounded-[10px] bg-white/10 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/20"
          >
            Learn more
          </a>
        </div>
      </div>
    </Reveal>
  );
}
