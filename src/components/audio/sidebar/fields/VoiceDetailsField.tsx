"use client";
import { MAX_VOICE_DETAILS } from "../../config";

interface VoiceDetailsFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function VoiceDetailsField({ value, onChange }: VoiceDetailsFieldProps) {
  return (
    <section className="relative flex w-full shrink-0 flex-col gap-1 rounded-xl border border-white/5 bg-white/5 p-3 transition-colors focus-within:border-white/10">
      <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-xl bg-white/5 px-2 py-1 text-[11px] font-medium text-white/50">
        Optional
      </span>
      <label htmlFor="audio-voice-details" className="text-sm font-medium text-white/50">
        Voice details
      </label>
      <textarea
        id="audio-voice-details"
        value={value}
        maxLength={MAX_VOICE_DETAILS}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. Young female voice with british accent, soft and loud. Excited, giggling"
        className="hide-scrollbar h-[52px] w-full resize-none bg-transparent text-xs leading-[18px] text-white outline-none placeholder:text-white/50"
      />
      <span className="mt-0.5 self-end text-[11px] font-medium tabular-nums text-white/40">
        {value.length}/{MAX_VOICE_DETAILS}
      </span>
    </section>
  );
}
