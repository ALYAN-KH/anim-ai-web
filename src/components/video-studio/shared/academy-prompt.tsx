import Link from "next/link";
import { academyImages } from "../data";

export interface AcademyPromptProps {
  onOpen?: () => void;
}

const CARD_CLASS =
  "absolute overflow-hidden rounded-xl border border-white/15 transition-transform duration-300 ease-in-out motion-reduce:transition-none";

export function AcademyPrompt({ onOpen }: AcademyPromptProps) {
  return (
    <div className="shrink-0">
      <Link
        href="/academy"
        onClick={onOpen}
        className="group/academy-invitation relative mt-auto flex h-[66px] w-full items-center justify-center gap-3 overflow-visible border-t border-white/[.06] bg-white/[.02] px-5 outline-none focus-visible:ring-2 focus-visible:ring-lime"
      >
        <span aria-hidden="true" className="relative hidden h-[76px] w-[252px] shrink-0 -translate-y-1.5 sm:block">
          <span className="absolute inset-x-0 bottom-0 h-[76px] overflow-hidden transition-[height] duration-300 ease-in-out group-hover/academy-invitation:h-[106px]">
            {academyImages.map((src, index) => (
              <span
                key={src}
                className={`${CARD_CLASS} ${index === 0
                    ? "left-9 top-6 z-10 h-[122px] w-[68px] -rotate-[11deg] group-hover/academy-invitation:-translate-x-3 group-hover/academy-invitation:-translate-y-1"
                    : index === 1
                      ? "left-[84px] top-0 z-30 h-[156px] w-[88px]"
                      : "left-[140px] top-4 z-20 h-[122px] w-[68px] rotate-[8.5deg] group-hover/academy-invitation:translate-x-5 group-hover/academy-invitation:translate-y-1"
                  }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                <span className="pointer-events-none absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover/academy-invitation:opacity-0" />
              </span>
            ))}
          </span>
        </span>
        <span className="flex min-w-0 flex-col gap-0.5 pr-3">
          <span className="text-[14px] font-medium text-white">Don’t know where to start?</span>
          <span className="text-[12px] text-white/55">Go to the Academy and start your journey</span>
        </span>
      </Link>
    </div>
  );
}
