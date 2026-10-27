"use client";
import { InfoIcon } from "../../ui/Icons";

interface ScriptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ScriptField({ value, onChange }: ScriptFieldProps) {
  return (
    <section className="relative flex h-40 w-full shrink-0 flex-col gap-1 rounded-xl border border-white/5 bg-white/5 p-3 transition-colors focus-within:border-white/10">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="audio-script" className="text-sm font-medium text-white/50">
          Script
        </label>
        <span
          title="Write exactly what the voice will read out loud"
          className="flex size-[18px] shrink-0 items-center justify-center text-white/50 transition-colors hover:text-white"
        >
          <InfoIcon className="size-[18px]" />
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        <textarea
          id="audio-script"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck
          className="hide-scrollbar size-full resize-none bg-transparent text-xs leading-[18px] text-white outline-none"
        />
        {value.length === 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 whitespace-pre-line text-xs leading-[18px] text-white/50"
          >
            {"Write exactly what the voice will read out loud.\nType @ to reference attachments"}
          </div>
        )}
      </div>
    </section>
  );
}
