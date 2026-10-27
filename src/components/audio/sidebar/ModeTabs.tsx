"use client";
import type { KeyboardEvent } from "react";
import { AUDIO_MODES } from "../config";
import type { AudioMode } from "../types";

interface ModeTabsProps {
  value: AudioMode;
  onChange: (mode: AudioMode) => void;
}

export function tabId(mode: AudioMode) {
  return `audio-tab-${mode}`;
}

export function panelId(mode: AudioMode) {
  return `audio-panel-${mode}`;
}

export function ModeTabs({ value, onChange }: ModeTabsProps) {
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = AUDIO_MODES[(index + step + AUDIO_MODES.length) % AUDIO_MODES.length];
    onChange(next.id);
    document.getElementById(tabId(next.id))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Audio tools"
      className="hide-scrollbar flex shrink-0 items-center gap-5 overflow-x-auto border-b border-white/5 px-4 pt-4"
    >
      {AUDIO_MODES.map((mode, index) => {
        const active = mode.id === value;
        return (
          <button
            key={mode.id}
            id={tabId(mode.id)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId(mode.id)}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(mode.id)}
            onKeyDown={(event) => handleKey(event, index)}
            className={`relative shrink-0 whitespace-nowrap pb-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:text-white ${
              active ? "text-white" : "text-white/55 hover:text-white"
            }`}
          >
            {mode.label}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-white" />}
          </button>
        );
      })}
    </div>
  );
}
