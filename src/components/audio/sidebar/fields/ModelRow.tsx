"use client";
import type { AudioModel } from "../../types";
import { RightChevronIcon } from "../../ui/Icons";
import { ModelLogo } from "../../ui/ModelLogo";

interface ModelRowProps {
  model: AudioModel;
  onClick: (anchor: DOMRect) => void;
}

export function ModelRow({ model, onClick }: ModelRowProps) {
  return (
    <button
      type="button"
      onClick={event => onClick(event.currentTarget.getBoundingClientRect())}
      aria-haspopup="dialog"
      className="flex h-14 w-full shrink-0 items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 text-left transition-colors hover:bg-white/[0.08]"
    >
      <span className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-xs font-medium text-white/50">Model</span>
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-white">
          <span className="truncate">{model.name}</span>
          <ModelLogo model={model} className="size-3.5 shrink-0 text-[#d1fe17]" />
        </span>
      </span>
      <RightChevronIcon className="size-4 shrink-0 text-white opacity-60" />
    </button>
  );
}
