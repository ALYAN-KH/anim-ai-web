"use client";
import type { VoicePreset } from "../../config/voice-library";
import { VOICE_PICK_RULE } from "../../config";
import { VoicePickIcon } from "./MediaIcons";

interface VoiceSelectCardProps {
  voice?: VoicePreset;
  onClick: (anchor: DOMRect) => void;
}

export function VoiceSelectCard({ voice, onClick }: VoiceSelectCardProps) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={(event) => onClick((event.currentTarget.closest("aside") ?? event.currentTarget).getBoundingClientRect())}
        aria-haspopup="dialog"
        className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 pb-5 pt-6 transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {voice ? (
          <>
            <img src={voice.image} alt="" className="size-14 rounded-full object-cover shadow-lg" />
            <span className="flex flex-col items-center gap-1 text-center">
              <span className="text-base font-medium text-white">{voice.name}</span>
              <span className="text-sm font-medium text-white/50">{voice.gender}</span>
            </span>
          </>
        ) : (
          <>
            <span className="flex items-start">
              <VoicePickIcon />
            </span>
            <span className="flex w-full flex-col items-center gap-1 text-center">
              <span className="text-base font-medium text-white">{VOICE_PICK_RULE.title}</span>
              <span className="w-full truncate text-sm font-medium text-white/50">
                {VOICE_PICK_RULE.hint}
              </span>
            </span>
          </>
        )}
      </button>
      <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-xl bg-white/5 px-2 py-1 text-[11px] font-medium text-white/50">
        {VOICE_PICK_RULE.badge}
      </span>
    </div>
  );
}
