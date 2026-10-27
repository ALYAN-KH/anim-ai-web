"use client";

import {
  useEffect,
  type ComponentProps,
  type RefObject
} from "react";
import { MediaPicker } from "../../shared/media-picker";

export type DepthMapColorMap =
  | "grayscale"
  | "turbo"
  | "inferno"
  | "magma"
  | "viridis";

export type DepthMapResolution = "auto" | "360p" | "480p" | "720p" | "1080p";

export type DepthMapParams = {
  file: File;
  colorMap: DepthMapColorMap;
  resolution: DepthMapResolution;
  maxFrames: number;
  sideBySide: boolean;
  duration: number;
};

export type DepthMapPanelProps = {
  onGenerate: (params: DepthMapParams) => void;
  onChangeTool?: () => void;
};

export type PickerAnchor = NonNullable<ComponentProps<typeof MediaPicker>["anchor"]>;

export type Placement = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
};

export const HERO_VIDEO =
  "https://static.higgsfield.ai/video-edit-form/v2/tools-hero/depth-map.mp4";

export const HERO_POSTER =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fstatic.higgsfield.ai%2Fvideo-edit-form%2Fv2%2Ftools-hero%2Fdepth-map-poster.webp&w=800&q=85";

export const COLOR_MAP_BASE =
  "https://static.higgsfield.ai/video-edit-form/v2/color-map";

export const MAX_BYTES = 200 * 1024 * 1024;

export const DEFAULT_FRAMES = "539";

export const COLOR_MAPS: { value: DepthMapColorMap; label: string }[] = [
  { value: "grayscale", label: "Grayscale" },
  { value: "turbo", label: "Turbo" },
  { value: "inferno", label: "Inferno" },
  { value: "magma", label: "Magma" },
  { value: "viridis", label: "Viridis" },
];

export const RESOLUTIONS: { value: DepthMapResolution; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "360p", label: "360p" },
  { value: "480p", label: "480p" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
];

export const POPOVER_CLASS =
  "fixed z-[110] rounded-xl border border-white/10 bg-[#1c1c1e] shadow-[0_16px_40px_rgba(0,0,0,.5)]";

export const FIELD_CLASS =
  "flex h-[54px] min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 text-left transition hover:bg-white/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17] motion-reduce:transition-none";

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 10.5H12v5m9.5-3.5a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.25"
        d="M12 8.125a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75Z"
      />
    </svg>
  );
}

export function placePopover(
  trigger: HTMLElement,
  width: number,
  height: number,
): Placement {
  const rect = trigger.getBoundingClientRect();
  const gap = 6;
  const w = Math.min(width, window.innerWidth - 16);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - w - 8));
  const below = window.innerHeight - rect.bottom - gap;
  const above = rect.top - gap;
  if (below < height && above > below) {
    return { left, width: w, bottom: window.innerHeight - rect.top + gap };
  }
  return { left, width: w, top: rect.bottom + gap };
}

export function useDismiss(
  open: boolean,
  onClose: () => void,
  triggerRef: RefObject<HTMLElement | null>,
  popRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (popRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
      triggerRef.current?.focus();
    };
    const onScroll = (event: Event) => {
      if (popRef.current?.contains(event.target as Node)) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, onClose, triggerRef, popRef]);
}

export function normalizeFrames(text: string): string {
  const value = parseInt(text, 10);
  return Number.isFinite(value) && value >= 1 ? String(value) : DEFAULT_FRAMES;
}
