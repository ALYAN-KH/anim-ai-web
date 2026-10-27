import {
  Minus,
  Palette,
  Plus
} from "lucide-react";

export function Control({
  children,
  className = "",
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-[13px] font-semibold text-white ${active ? "bg-[#26292c]" : "bg-[#26292c]"} ${className}`}
    >
      {children}
    </button>
  );
}

export function CountStepper({
  value,
  onChange,
  max = 4,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
}) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#26292c] px-2">
      <button
        type="button"
        disabled={value === 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid size-6 place-items-center disabled:opacity-30 text-zinc-300"
        aria-label="Decrease count"
      >
        <Minus size={14} />
      </button>
      <strong className="w-8 text-center text-[13px] font-semibold text-white">
        {value}
        <span className="text-zinc-500">/{max}</span>
      </strong>
      <button
        type="button"
        disabled={value === max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid size-6 place-items-center disabled:opacity-30 text-zinc-300"
        aria-label="Increase count"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function ColorTransferButton() {
  return (
    <button
      type="button"
      className="flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#4a4d50] bg-[#2f3235] px-3 text-[13px] font-semibold text-white"
    >
      <Palette size={14} className="text-[#a4a7ab]" />
      Color Transfer
      <span className="rounded-md bg-[#2f3a0c] px-1.5 py-0.5 text-[9px] font-bold text-lime">
        New
      </span>
    </button>
  );
}
