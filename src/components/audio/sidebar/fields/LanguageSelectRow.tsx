"use client";
import { useRef, useState } from "react";
import { Search } from "lucide-react";
import type { AudioLanguage } from "../../types";
import { FieldPopover } from "../../ui/FieldPopover";
import { Flag } from "../../ui/Flag";
import { CheckIcon, RightChevronIcon } from "../../ui/Icons";

interface LanguageSelectRowProps {
  label?: string;
  value: string;
  options: AudioLanguage[];
  onChange: (id: string) => void;
}

export function LanguageSelectRow({
  label = "Language",
  value,
  options,
  onChange,
}: LanguageSelectRowProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.id === value);
  const visible = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const close = () => {
    setAnchor(null);
    setQuery("");
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={anchor !== null}
        // Keep the popover's outside-click handler from closing it right before this toggle runs.
        onPointerDown={(event) => event.nativeEvent.stopPropagation()}
        onClick={() => (anchor ? close() : setAnchor(buttonRef.current?.getBoundingClientRect() ?? null))}
        className={`flex h-14 w-full shrink-0 items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors hover:bg-white/[0.08] ${
          anchor ? "border-white/80 bg-white/[0.08]" : "border-white/5 bg-white/5 hover:border-white/10"
        }`}
      >
        <span className="flex min-w-0 flex-col items-start gap-1">
          <span className="text-xs font-medium text-white/50">{label}</span>
          <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-white">
            {selected && <Flag code={selected.flag} />}
            <span className="truncate">{selected?.label}</span>
          </span>
        </span>
        <RightChevronIcon className="size-4 shrink-0 text-white opacity-60" />
      </button>
      {anchor && (
        <FieldPopover anchor={anchor} onClose={close} label={label} width={460}>
          <label className="flex h-14 items-center gap-2 border-b border-white/5 px-4 text-white/45">
            <Search className="size-4" />
            <input
              autoFocus
              aria-label="Search languages"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45"
            />
          </label>
          <ul role="listbox" aria-label={label} className="hide-scrollbar flex max-h-[348px] flex-col gap-0.5 overflow-y-auto p-2.5">
            {visible.map((option) => {
              const active = option.id === value;
              return (
                <li key={option.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      close();
                    }}
                    className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl px-2.5 text-left text-base font-semibold text-white transition-colors hover:bg-white/5 ${
                      active ? "bg-white/[0.06]" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Flag code={option.flag} className="h-[18px] w-[26px]" />
                      {option.label}
                    </span>
                    {active && <CheckIcon className="size-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
          {visible.length === 0 && <p className="px-4 pb-4 text-sm text-white/50">No languages found</p>}
        </FieldPopover>
      )}
    </>
  );
}
