"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent
} from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "../../shared/media-icons";

export type HdrFormat = "h265" | "prores" | "exr";

export const FORMATS: { id: HdrFormat; label: string; description: string }[] = [
  {
    id: "h265",
    label: "H.265 10-bit",
    description:
      "Higher fidelity at a similar size, with less playback support than H.264.",
  },
  {
    id: "prores",
    label: "ProRes 10-bit",
    description: "Editing friendly intermediate codec. Much larger files.",
  },
  {
    id: "exr",
    label: "EXR 16-bit",
    description:
      "Uncompressed frame sequence for compositing. Largest files.",
  },
];

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5 13.875 9.2 18 19 7"
      />
    </svg>
  );
}

export function FormatField({
  value,
  onChange,
}: {
  value: HdrFormat;
  onChange: (value: HdrFormat) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{
    left: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listId = useId();

  const selected = FORMATS.find((f) => f.id === value) ?? FORMATS[0];

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceAbove = rect.top - 16;
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const openUp = spaceAbove >= 240 || spaceAbove >= spaceBelow;
    const left = Math.max(8, rect.left);
    setPos({
      left,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + 8 }
        : { top: rect.bottom + 8 }),
      maxHeight: Math.max(160, openUp ? spaceAbove : spaceBelow),
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popRef.current?.contains(target)
      )
        return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    const onScroll = (e: Event) => {
      if (popRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const index = Math.max(
      0,
      FORMATS.findIndex((f) => f.id === value),
    );
    optionRefs.current[index]?.focus();
  }, [open, value]);

  const choose = (id: HdrFormat) => {
    onChange(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onListKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = optionRefs.current.filter(Boolean) as HTMLDivElement[];
    const index = items.indexOf(document.activeElement as HTMLDivElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="relative min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label="Output format"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={toggle}
        className={`flex h-[54px] w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17] ${open
            ? "border-[#EFFE17] bg-white/[.03]"
            : "border-white/10 bg-white/[.03]"
          }`}
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[10px] font-medium text-white/50">
            Output format
          </span>
          <span className="truncate text-sm font-medium text-white">
            {selected.label}
          </span>
        </span>
        <ChevronIcon className="shrink-0 text-white/50" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            style={{
              left: pos.left,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
              width: `min(470px, calc(100vw - ${pos.left + 8}px))`,
            }}
            className="fixed z-[110] flex flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#1c1c1e] p-2 shadow-[0_24px_64px_rgba(0,0,0,.6)]"
          >
            <p className="px-2 pb-2 pt-2.5 text-xs font-medium text-white/60">
              Output format
            </p>
            <div
              id={listId}
              role="listbox"
              aria-label="Output format"
              onKeyDown={onListKeyDown}
              className="flex flex-col gap-0.5"
            >
              {FORMATS.map((format, i) => {
                const checked = format.id === value;
                return (
                  <div
                    key={format.id}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={checked}
                    tabIndex={-1}
                    onClick={() => choose(format.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        choose(format.id);
                      }
                    }}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 outline-none transition hover:bg-white/[.05] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFFE17] ${checked ? "bg-white/[.06]" : ""
                      }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-white">
                        {format.label}
                      </p>
                      <p className="text-sm text-white/60">
                        {format.description}
                      </p>
                    </div>
                    {checked && (
                      <CheckIcon className="mr-1 size-5 shrink-0 text-[#EFFE17]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
