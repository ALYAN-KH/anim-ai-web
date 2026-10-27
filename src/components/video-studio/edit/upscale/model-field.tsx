"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { VideoPlusIcon } from "../../shared/media-icons";
import { CheckIcon, DownChevronIcon, SearchIcon } from "./model-icons";
import { MODELS } from "./settings-data";

export function ModelField({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{
    left: number;
    bottom: number;
    maxHeight: number;
  } | null>(null);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = MODELS.find((m) => m.id === value) ?? MODELS[0];
  const visible = MODELS.filter((m) =>
    m.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const trigger = triggerRef.current;
    const rect = trigger?.getBoundingClientRect();
    if (!trigger || !rect) return;
    const panel = trigger.closest("aside");
    const left = Math.max(
      8,
      panel ? panel.getBoundingClientRect().left : rect.left - 12,
    );
    setPos({
      left,
      bottom: window.innerHeight - rect.top + 8,
      maxHeight: Math.max(200, rect.top - 24),
    });
    setQuery("");
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
    if (open) searchRef.current?.focus();
  }, [open]);

  const choose = (id: string) => {
    onChange(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Model"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className="grid h-[54px] w-full grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3 py-1.5 text-left transition hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]"
      >
        <div className="grid min-w-0 auto-rows-min items-center">
          <span className="text-[11px] font-medium leading-4 text-white/50">
            Model
          </span>
          <div className="flex min-w-0 items-center gap-1">
            <p className="min-w-0 truncate text-sm font-medium text-white">
              {selected.title}
            </p>
            <span className="size-4 shrink-0 text-[#EFFE17]">
              <selected.Icon className="size-full" />
            </span>
          </div>
        </div>
        <DownChevronIcon className="size-4 -rotate-90 text-white/50" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label="Choose model"
            style={{
              left: pos.left,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
              width: `min(400px, calc(100vw - ${pos.left + 8}px))`,
            }}
            className="fixed z-[110] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e] shadow-[0_24px_64px_rgba(0,0,0,.6)]"
          >
            <label className="flex h-11 shrink-0 items-center gap-2 border-b border-white/[.06] px-3 text-white/60">
              <SearchIcon className="size-5 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search models"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
              />
            </label>

            <div className="flex shrink-0 items-center gap-1.5 px-3.5 pb-1 pt-2.5 text-xs font-medium text-white/50">
              <VideoPlusIcon className="size-3.5" />
              All models
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
              {visible.map(({ id, title, description, Icon, accent }) => {
                const isSelected = id === value;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => choose(id)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center gap-3 rounded-xl p-2 text-left outline-none transition hover:bg-white/[.05] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFFE17] ${isSelected ? "bg-white/[.06]" : ""
                        }`}
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-lg bg-white/[.06] ${accent ? "text-[#EFFE17]" : "text-white/60"
                          }`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-semibold text-white">
                          {title}
                        </span>
                        <span className="truncate text-xs text-white/50">
                          {description}
                        </span>
                      </span>
                      {isSelected && (
                        <CheckIcon className="mr-1 size-5 shrink-0 text-[#EFFE17]" />
                      )}
                    </button>
                  </li>
                );
              })}
              {visible.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-white/50">
                  No models found
                </li>
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
