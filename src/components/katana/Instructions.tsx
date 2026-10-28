"use client";

import { useEffect, useId, useRef } from "react";

export function Instructions({ enabled, onToggle, value, onChange }: {
  enabled: boolean; onToggle: () => void; value: string; onChange: (value: string) => void;
}) {
  const id = useId();
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (enabled) input.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [enabled]);
  return <div className="katana-instructions overflow-hidden rounded-xl bg-white/[.03]">
    <div className="flex h-11 items-center justify-between gap-2 px-3">
      <span id={`${id}-label`} className="text-[13px] font-medium">Instructions <span className="text-white/50">(optional)</span></span>
      <button type="button" role="switch" aria-checked={enabled} aria-expanded={enabled} aria-label="Enable instructions"
        aria-controls={`${id}-panel`} onClick={onToggle} className="katana-instructions-switch" data-checked={enabled}>
        <span aria-hidden="true" />
      </button>
    </div>
    <div id={`${id}-panel`} hidden={!enabled}>
      <textarea ref={input} aria-labelledby={`${id}-label`} maxLength={2000} value={value} onChange={event => onChange(event.target.value)}
        disabled={!enabled} placeholder="Describe anything the model should pay attention to when recreating this video"
        className="block h-40 w-full resize-none border-0 border-t border-solid border-white/5 bg-transparent p-3 text-xs leading-4 text-white outline-none placeholder:text-white/40" />
    </div>
  </div>;
}
