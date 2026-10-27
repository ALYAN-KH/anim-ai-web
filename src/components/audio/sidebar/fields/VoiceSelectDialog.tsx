"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { VoicePreset } from "../../config/voice-library";
import { CloseIcon } from "../../ui/Icons";
import { VoiceLibrary } from "./VoiceLibrary";

interface VoiceSelectDialogProps {
  anchor: DOMRect;
  selectedId: string;
  onSelect: (voice: VoicePreset) => void;
  onCreateCustom: () => void;
  onClose: () => void;
}

const WIDTH = 820;
const HEIGHT = 760;
const MIN_HEIGHT = 520;
const GAP = 32;
const ASSET_BASE = "https://static.higgsfield.ai/public/audio/voice-picker";
const BAR_HEIGHTS = [28, 50, 36, 72, 44, 90, 55, 100, 62, 84, 40, 66, 30, 48, 24];
// Each avatar is drawn twice: a blurred glow underneath and the crisp portrait on top.
const AVATARS = [
  { src: "avatar-1", size: 28, left: 201, top: 8 },
  { src: "avatar-2", size: 32, left: 13, top: 93 },
  { src: "avatar-3", size: 22, left: 222, top: 103 },
  { src: "avatar-4", size: 22, left: 58, top: 5 },
];
// Collapse once the list has clearly scrolled, and expand only back at the top, so the header doesn't flicker.
const COLLAPSE_AT = 24;
const EXPAND_AT = 4;

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="size-4" aria-hidden="true">
      <path
        d="m11.852 4.217-.13-.978a.476.476 0 0 0-.943 0l-.13.978A6.41 6.41 0 0 1 5.14 9.724l-.978.13a.476.476 0 0 0 0 .943l.978.13a6.41 6.41 0 0 1 5.507 5.508l.13.978a.476.476 0 0 0 .944 0l.13-.978a6.41 6.41 0 0 1 5.508-5.507l.977-.13a.476.476 0 0 0 0-.944l-.977-.13a6.41 6.41 0 0 1-5.508-5.507Zm-7.2 10.54.169-.549a.188.188 0 0 1 .36 0l.168.549a2.222 2.222 0 0 0 1.47 1.47l.549.169a.188.188 0 0 1 0 .36l-.549.168a2.222 2.222 0 0 0-1.47 1.47l-.169.549a.188.188 0 0 1-.36 0l-.168-.548a2.222 2.222 0 0 0-1.47-1.47l-.549-.17a.188.188 0 0 1 0-.36l.548-.168a2.222 2.222 0 0 0 1.47-1.47Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CreateVoiceButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[radial-gradient(circle,#effe17_40%,#d1fe17)] px-4 pb-0.5 text-sm font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,0.43)] transition hover:opacity-80 active:opacity-60"
    >
      <SparkleIcon />
      <span>{label}</span>
    </button>
  );
}

function Waveform({ heights }: { heights: number[] }) {
  return (
    <div aria-hidden="true" className="flex h-full flex-1 items-center justify-center gap-1">
      {heights.map((height, index) => (
        <span key={index} className="w-0.5 shrink-0 rounded-full bg-white/30" style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function RecordingIllustration() {
  return (
    <div aria-hidden="true" className="relative hidden items-center justify-center pr-6 md:flex">
      <div className="relative shrink-0" style={{ width: 260, height: 152 }}>
        <div className="absolute inset-x-0 top-1/2 flex h-[62px] -translate-y-1/2 items-center justify-between gap-2">
          <Waveform heights={BAR_HEIGHTS} />
          <span className="w-[84px] shrink-0" />
          <Waveform heights={[...BAR_HEIGHTS].reverse()} />
        </div>
        <div
          className="absolute left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.4px] border-black/80 shadow-[0_0_40px_rgba(209,254,23,0.45)]"
          style={{ top: "calc(50% - 15.78px)", backgroundImage: "linear-gradient(135deg, #fecc17 0%, #d1fe17 100%)" }}
        >
          <img alt="" className="size-[50px]" src={`${ASSET_BASE}/mic-glyph.svg`} />
        </div>
        {AVATARS.map(({ src, size, left, top }) => (
          <span key={src}>
            <span
              className="pointer-events-none absolute rounded-full opacity-15 blur-[6px]"
              style={{ width: size + 6, height: size + 6, left: left - 3, top: top - 3 }}
            >
              <img alt="" className="size-full rounded-full object-cover" src={`${ASSET_BASE}/${src}.webp`} />
            </span>
            <span className="absolute overflow-hidden rounded-full" style={{ width: size, height: size, left, top }}>
              <img alt="" className="size-full object-cover" src={`${ASSET_BASE}/${src}.webp`} />
            </span>
          </span>
        ))}
        <span
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-[0.6px] border-white/5 bg-[#202325] py-1 pl-1.5 pr-2.5"
          style={{ top: 114.28 }}
        >
          <span className="size-3 shrink-0 rounded-full bg-[#ff3b30]" />
          <span className="whitespace-nowrap text-[11px] font-medium leading-4 text-white">Recording your voice</span>
        </span>
      </div>
    </div>
  );
}

export function VoiceSelectDialog({ anchor, selectedId, onSelect, onCreateCustom, onClose }: VoiceSelectDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onMouseDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [onClose]);

  const handleScroll = (scrollTop: number) =>
    setCollapsed((current) => (scrollTop > COLLAPSE_AT ? true : scrollTop < EXPAND_AT ? false : current));

  const width = Math.min(WIDTH, window.innerWidth - 16);
  // Sit beside the sidebar, top-aligned with it, and only move up when the window is too short.
  const top = Math.max(16, Math.min(anchor.top, window.innerHeight - MIN_HEIGHT - 16));
  const height = Math.min(HEIGHT, window.innerHeight - top - 16);
  const left = Math.max(8, Math.min(anchor.right + GAP, window.innerWidth - width - 8));
  const reveal = "grid shrink-0 transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none";

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Select or add a voice"
      style={{ left, top, width, height }}
      className="fixed z-50 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121516] shadow-2xl"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <CloseIcon className="size-4" />
      </button>

      <div aria-hidden={collapsed} className={`${reveal} ${collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="grid w-full grid-cols-1 items-center gap-6 py-8 md:h-[196px] md:grid-cols-2 md:py-0">
            <div className="flex w-full flex-col items-start pl-6 pr-16 md:pr-0">
              <h3 className="mb-2 font-grotesk text-[24px] font-bold uppercase leading-8 tracking-[-0.5px] text-white sm:whitespace-nowrap sm:text-[32px] sm:leading-10">
                Select or Add a Voice
              </h3>
              <p className="mb-6 max-w-[260px] text-sm font-medium text-white/50">
                Select from presets, record your own, or upload an audio.
              </p>
              <CreateVoiceButton label="Create custom voice" onClick={onCreateCustom} />
            </div>
            <RecordingIllustration />
          </div>
        </div>
      </div>

      <div aria-hidden={!collapsed} className={`${reveal} ${collapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="flex h-[72px] items-center justify-center gap-4 pl-4 pr-16">
            <p className="hidden text-base font-medium text-white/50 sm:block">Clone your own voice or choose a preset</p>
            <CreateVoiceButton label="Create Voice" onClick={onCreateCustom} />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-1 pb-1">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px]">
          <VoiceLibrary selected={selectedId ? [selectedId] : []} onSelect={onSelect} onScroll={handleScroll} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
