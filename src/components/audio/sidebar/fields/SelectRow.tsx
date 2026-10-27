"use client";
import { useId, useState, type ReactNode } from "react";
import type { SelectOption } from "../../types";
import { CheckIcon, RightChevronIcon } from "../../ui/Icons";
import { FieldPopover } from "../../ui/FieldPopover";

interface SelectRowProps<T extends string | number> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  icon?: ReactNode;
}

export function SelectRow<T extends string | number>({
  label,
  value,
  options,
  onChange,
  icon,
}: SelectRowProps<T>) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={event => { setAnchor(event.currentTarget.getBoundingClientRect()); setOpen(current => !current); }}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-white/5 px-3 text-left transition-colors hover:bg-white/[0.08]"
      >
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          {icon}
          {selected?.label}
          <RightChevronIcon
            className="size-4 text-white/60"
          />
        </span>
      </button>
      {open && anchor && (
        <FieldPopover anchor={anchor} label={label} onClose={() => setOpen(false)} width={220}>
        <p className="px-4 pb-1 pt-3 text-xs text-white/50">{label}</p>
        <ul id={listId} role="listbox" aria-label={label} className="flex flex-col gap-0.5 p-1.5">
          {options.map((option) => (
            <li key={String(option.value)} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {option.label}
                {option.value === value && <CheckIcon className="size-4 text-lime" />}
              </button>
            </li>
          ))}
        </ul>
        </FieldPopover>
      )}
    </div>
  );
}
