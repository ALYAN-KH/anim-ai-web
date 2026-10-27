"use client";
import { Toggle } from "../../ui/Toggle";

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  muted?: boolean;
}

export function ToggleRow({ label, checked, onChange, muted = false }: ToggleRowProps) {
  return (
    <div className="flex h-14 w-full items-center justify-between gap-2 rounded-xl bg-white/5 px-4">
      <span className={`text-sm font-semibold ${muted && !checked ? "text-white/40" : "text-white"}`}>
        {label}
      </span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
