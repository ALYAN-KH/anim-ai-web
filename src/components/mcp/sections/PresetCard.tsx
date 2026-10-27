"use client";
import { PRESET_CATEGORIES, SITE } from "../config";
import { buildChatGptUrl } from "../lib/chatgpt-url";
import type { PresetDefinition } from "../types";
import { CategoryIcon, ChatGptIcon } from "../ui/Icons";
import { LoopingVideo } from "../ui/LoopingVideo";
import { Reveal } from "../ui/Reveal";

interface PresetCardProps {
  preset: PresetDefinition;
  agentParam: string;
}

export function PresetCard({ preset, agentParam }: PresetCardProps) {
  const learnMore = `${SITE}/mcp/${preset.slug}?tab=${agentParam}`;
  const tags = PRESET_CATEGORIES.filter((category) => preset.categories.includes(category.id));
  const { media } = preset;

  return (
    <Reveal>
      <article className="grid gap-5 md:grid-cols-[minmax(0,550px)_1fr] md:gap-9">
        <a
          href={learnMore}
          aria-label={preset.title}
          className="relative block aspect-[550/310] w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#1b1c1f] to-[#101112]"
        >
          {media.src && media.kind === "video" && (
            <LoopingVideo src={media.src} poster={media.poster} label={`${preset.title} preview`} />
          )}
          {media.src && media.kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.src}
              alt={`${preset.title} preview`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          )}
        </a>

        <div className="flex min-w-0 flex-col justify-between gap-6 md:min-h-[310px]">
          <div className="flex flex-col gap-3">
            <h3 className="flex flex-wrap items-center gap-2.5 text-[28px] font-semibold leading-8 tracking-tight text-white">
              {preset.title}
              {preset.isNew && (
                <span className="rounded-md bg-[#d1fe17]/20 px-1.5 py-0.5 text-xs font-bold text-[#d1fe17]">New</span>
              )}
            </h3>
            <p className="max-w-[640px] text-lg font-medium leading-[25px] text-white/50">{preset.description}</p>
            <ul className="mt-1 flex flex-wrap gap-2">
              <li className="inline-flex h-[34px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white">
                <span className="text-white/60">/</span>
                {preset.command}
              </li>
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className="inline-flex h-[34px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white"
                >
                  <CategoryIcon name={tag.icon} className="size-4" />
                  {tag.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={buildChatGptUrl(preset.prompt, preset.references)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:brightness-95"
            >
              <ChatGptIcon className="size-4" />
              Try in ChatGPT
            </a>
            <a
              href={learnMore}
              className="inline-flex h-10 items-center rounded-lg bg-[#17181a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#222427]"
            >
              Learn more
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
