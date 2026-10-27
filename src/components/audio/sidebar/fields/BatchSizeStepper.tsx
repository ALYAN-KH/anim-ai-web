"use client";
import { MAX_BATCH_SIZE } from "../../config";
import { MinusIcon, PlusIcon } from "../../ui/Icons";

interface BatchSizeStepperProps {
  value: number;
  onChange: (value: number) => void;
}

export function BatchSizeStepper({ value, onChange }: BatchSizeStepperProps) {
  const buttonClass =
    "flex size-6 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex h-12 w-full shrink-0 items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2">
      <span className="text-sm font-medium text-white">Batch size</span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label="Decrease batch size"
          disabled={value <= 1}
          onClick={() => onChange(value - 1)}
          className={buttonClass}
        >
          <MinusIcon className="size-4" />
        </button>
        <span className="px-1 text-sm font-semibold tabular-nums text-white">
          {value}/{MAX_BATCH_SIZE}
        </span>
        <button
          type="button"
          aria-label="Increase batch size"
          disabled={value >= MAX_BATCH_SIZE}
          onClick={() => onChange(value + 1)}
          className={buttonClass}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
