import { Fragment } from "react";
import { HOW_IT_WORKS } from "../config";
import type { AudioMode } from "../types";
import { LoopingVideo } from "../ui/LoopingVideo";

interface HowItWorksProps {
  mode: AudioMode;
}

const titleClass =
  "text-center font-grotesk text-[28px] font-bold uppercase leading-9 tracking-[-1px] text-white sm:text-[40px] sm:leading-[48px] sm:tracking-[-1.6px]";
const subtitleClass =
  "text-center text-base font-medium leading-6 text-white/50 sm:text-[18px] sm:leading-7";

export function HowItWorks({ mode }: HowItWorksProps) {
  const content = HOW_IT_WORKS[mode];

  if (content.variant === "hero") {
    return (
      <div className="flex flex-col items-center rounded-xl border border-white/5 bg-[#131416] px-4 pb-10 pt-8 sm:px-8 sm:pt-[54px] lg:min-h-[680px]">
        <div className="relative h-60 w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/[0.04] sm:h-[340px]">
          <LoopingVideo src={content.videoSrc} label={content.videoLabel} />
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 sm:mt-[92px]">
          <h2 className={titleClass}>
            {content.title.split("\n").map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          <p className={subtitleClass}>{content.subtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-[#131416] px-4 pb-8 pt-7 sm:px-8 sm:pt-10 lg:min-h-[640px]">
      <div className="flex flex-col items-center gap-2">
        <h2 className={titleClass}>{content.title}</h2>
        <p className={subtitleClass}>{content.subtitle}</p>
      </div>

      <div className="mt-8 flex w-full flex-col gap-5 sm:mt-[38px] md:flex-row">
        {content.cards.map((card) => (
          <article
            key={card.title}
            className="flex min-w-0 flex-1 flex-col justify-center gap-6 overflow-hidden rounded-3xl border border-white/[0.04] bg-[#17181a] px-4 pb-4 pt-5"
          >
            <div className="flex w-full flex-col gap-2 px-2">
              <h3 className="text-[22px] font-medium leading-7 tracking-[-0.4px] text-white sm:text-[24px]">
                {card.title}
              </h3>
              <p
                className="text-base font-medium leading-6 text-[#828282]"
                style={{ maxWidth: card.descriptionMaxWidth }}
              >
                {card.description}
              </p>
            </div>
            <div className="relative h-[240px] w-full overflow-hidden rounded-xl sm:h-[300px]">
              <LoopingVideo src={card.videoSrc} label={card.videoLabel} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
