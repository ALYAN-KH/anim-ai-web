"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties
} from "react";
import { createPortal } from "react-dom";
import { GenerationsPanel } from "../assets/generations-panel";
import { CalendarClockIcon, CheckIcon, CloseIcon, CloudUploadIcon, HistoryIcon, SortAzIcon, SortIcon } from "./media-icons";

export type PickerTab = "uploads" | "generations" | "liked";

export type PickerRange = "recent" | "all";

export type PickerSort = "last-created" | "last-used" | "first-created";

export const SORT_OPTIONS: {
  id: PickerSort;
  label: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
}[] = [
    { id: "last-created", label: "Last created", Icon: CalendarClockIcon },
    { id: "last-used", label: "Last used", Icon: HistoryIcon },
    { id: "first-created", label: "First created", Icon: SortAzIcon },
  ];

export function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-8 rounded-full px-3 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${active
          ? "bg-white text-black"
          : "text-white/60 hover:bg-white/[.06] hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}

export function MediaPicker({
  anchor,
  onClose,
  onUploadClick,
}: {
  anchor: { left: number; top: number } | null;
  onClose: () => void;
  onUploadClick: () => void;
}) {
  const [tab, setTab] = useState<PickerTab>("uploads");
  const [range, setRange] = useState<PickerRange>("recent");
  const [sort, setSort] = useState<PickerSort>("last-used");
  const [sortOpen, setSortOpen] = useState(false);
  const sortWrapRef = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (sortOpen) {
        setSortOpen(false);
        sortButtonRef.current?.focus();
      } else {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, sortOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!sortWrapRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [sortOpen]);

  useEffect(() => {
    if (sortOpen) itemRefs.current[0]?.focus();
  }, [sortOpen]);

  const chooseSort = (id: PickerSort) => {
    setSort(id);
    setSortOpen(false);
    sortButtonRef.current?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
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
    }
  };

  const style: CSSProperties | undefined = anchor
    ? {
      left: anchor.left,
      top: anchor.top,
      bottom: 16,
      width: `min(600px, calc(100vw - ${anchor.left + 16}px))`,
    }
    : undefined;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close media picker"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-transparent"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose media"
        style={style}
        className={`absolute flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1c] text-white shadow-[0_24px_64px_rgba(0,0,0,.6)] ${anchor ? "" : "inset-x-2 bottom-2 top-16"
          }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-2.5 py-3">
          <div className="flex items-center gap-1">
            <Pill active={tab === "uploads"} onClick={() => setTab("uploads")}>
              Uploads
            </Pill>
            <Pill
              active={tab === "generations"}
              onClick={() => setTab("generations")}
            >
              Generations
            </Pill>
            <Pill active={tab === "liked"} onClick={() => setTab("liked")}>
              Liked
            </Pill>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-full bg-white/[.08] text-white transition hover:bg-white/[.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/[.06] bg-[#242426] px-2.5 py-2">
          <div className="flex items-center gap-1">
            <Pill
              active={range === "recent"}
              onClick={() => setRange("recent")}
            >
              Recent
            </Pill>
            <Pill active={range === "all"} onClick={() => setRange("all")}>
              All
            </Pill>
          </div>
          <div ref={sortWrapRef} className="relative z-20">
            <button
              ref={sortButtonRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((v) => !v)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${sortOpen
                  ? "bg-white/[.12] text-white"
                  : "text-white/60 hover:text-white"
                }`}
            >
              <SortIcon />
              Sort by
            </button>

            {sortOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                aria-label="Sort by"
                onKeyDown={onMenuKeyDown}
                className="absolute right-0 top-full mt-1 flex w-[200px] flex-col gap-0.5 rounded-xl border border-white/10 bg-[#1c1c1e] p-2 shadow-[0_16px_40px_rgba(0,0,0,.5)]"
              >
                {SORT_OPTIONS.map(({ id, label, Icon }, i) => {
                  const checked = sort === id;
                  return (
                    <div
                      key={id}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      role="menuitemcheckbox"
                      aria-checked={checked}
                      tabIndex={-1}
                      onClick={() => chooseSort(id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          chooseSort(id);
                        }
                      }}
                      className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-medium text-white outline-none transition hover:bg-white/[.06] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFFE17] ${checked ? "bg-white/[.06]" : ""
                        }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                      {checked && <CheckIcon className="size-4 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#242426]">
          {tab === "uploads" && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,132px))] gap-3 px-4 py-3.5">
              <button
                type="button"
                onClick={onUploadClick}
                className="relative flex aspect-square flex-col items-center justify-center gap-2.5 rounded-[0.625rem] border border-dashed border-white/10 bg-white/[.05] text-white transition hover:bg-white/[.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="grid size-[42px] place-items-center rounded-full border border-white/10 bg-white/[.08] text-white/80">
                  <CloudUploadIcon className="size-5" />
                </span>
                <span className="text-[13px] font-medium">Upload media</span>
              </button>
            </div>
          )}
          {tab === "generations" && <GenerationsPanel kind="video" />}
          {tab === "liked" && <GenerationsPanel kind="liked" />}
        </div>
      </div>
    </div>,
    document.body,
  );
}
