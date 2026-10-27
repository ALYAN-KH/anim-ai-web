"use client";

import {
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "../../shared/media-icons";

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceAbove = rect.top - 12;
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const openUp = spaceAbove >= spaceBelow;
    setPos({
      left: rect.left,
      width: rect.width,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
      maxHeight: Math.max(120, openUp ? spaceAbove : spaceBelow),
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
        listRef.current?.contains(target)
      )
        return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      close();
    };
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <div className="relative min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={toggle}
        className="flex h-[54px] w-full min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 text-left transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]"
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[11px] font-medium text-white/50">
            {label}
          </span>
          <span className="text-sm font-medium text-white">{value}</span>
        </span>
        <ChevronIcon className="shrink-0 text-white/50" />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label}
            style={{
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
            }}
            className="fixed z-[110] overflow-y-auto rounded-xl border border-white/10 bg-[#16181b] p-1 shadow-xl"
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected}
                  tabIndex={0}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange(opt);
                      setOpen(false);
                    }
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition hover:bg-white/[.08] focus-visible:bg-white/[.08] ${selected ? "bg-white/[.08] text-white" : "text-white/70"
                    }`}
                >
                  {opt}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
