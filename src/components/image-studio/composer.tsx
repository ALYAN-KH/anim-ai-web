import { soulStyle } from "@/data/imageStudio";
import {
  ChevronLeft,
  ChevronRight,
  Diamond,
  Pencil,
  Plus,
  WandSparkles
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ColorTransferButton, Control, CountStepper } from "./composer/controls";
import { AspectIcon, ModelGlyph } from "./composer/icons";
import {
  type Aspect,
  type MenuName,
  type ModelOption,
  type Preset
} from "./data";
import { SafeImage } from "./panels";
export { ColorTransferButton, Control, CountStepper } from "./composer/controls";
export { AspectIcon, ModelGlyph, OpenAILogo, SeedreamLogo } from "./composer/icons";
export { AspectMenu, ModelPicker, QualityMenu } from "./composer/menus";

export interface ControlsBarProps {
  selectedModel: ModelOption;
  modelOpen: boolean;
  onToggleModel: () => void;
  aspect: Aspect;
  quality: string;
  menu: MenuName | null;
  onOpenMenu: (name: MenuName, el: HTMLElement) => void;
  enhance: boolean;
  onToggleEnhance: () => void;
  count: number;
  onCountChange: (n: number) => void;
  advanced: boolean;
  onToggleAdvanced: () => void;
  onCharacterClick: () => void;
  characterActive: boolean;
}

export function ControlsBar({
  selectedModel,
  modelOpen,
  onToggleModel,
  aspect,
  quality,
  menu,
  onOpenMenu,
  enhance,
  onToggleEnhance,
  count,
  onCountChange,
  advanced,
  onToggleAdvanced,
  onCharacterClick,
  characterActive,
}: ControlsBarProps) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = controlsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  const scrollControlsTo = (toEnd: boolean) => {
    const el = controlsRef.current;
    if (!el) return;
    el.scrollTo({ left: toEnd ? el.scrollWidth : 0, behavior: "smooth" });
  };

  const maskStops = [
    canScrollLeft ? "rgba(0,0,0,.25) 0, #000 100px" : "#000 0",
    canScrollRight
      ? "#000 calc(100% - 100px), rgba(0,0,0,.25) calc(100% - 40px)"
      : "#000 100%",
  ].join(", ");
  const mask = `linear-gradient(to right, ${maskStops})`;

  return (
    <><div className="absolute bottom-3.5 left-[16px] right-[352px] flex h-8 items-center gap-[6px]">
      <Control className="!w-8 !px-0" aria-label="Add">
        <Plus size={16} strokeWidth={2} />
      </Control>
      <Control
        className={`min-w-[128px] ${modelOpen ? "bg-[#3a3d40]" : ""}`}
        onClick={onToggleModel}
        aria-label="Select model"
        aria-expanded={modelOpen}
        aria-haspopup="listbox"
      >
        <span className="grid size-4 place-items-center">
          <ModelGlyph icon={selectedModel.icon} size={20} />
        </span>
        <span className="truncate">{selectedModel.short}</span>
        <ChevronRight size={12} className="text-[#a4a7ab]" />
      </Control>

      <div className="relative h-8 min-w-0 flex-1">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollControlsTo(false)}
            className="absolute left-0 top-0.5 z-20 grid size-7 place-items-center rounded-lg bg-[#26292c] text-zinc-300"
            aria-label="Previous settings"
          >
            <ChevronLeft size={14} />
          </button>
        )}
        <div
          ref={controlsRef}
          onScroll={updateScrollButtons}
          style={{ maskImage: mask, WebkitMaskImage: mask }}
          className="flex h-8 items-center gap-[6px] overflow-hidden sb"
        >
          {!advanced && (
            <>
              <Control
                active={menu === "aspect"}
                onClick={(e) => onOpenMenu("aspect", e.currentTarget)}
                aria-label="Aspect ratio"
                aria-expanded={menu === "aspect"}
                aria-haspopup="listbox"
              >
                <AspectIcon w={aspect.w} h={aspect.h} />
                {aspect.id}
              </Control>
              <Control
                active={menu === "quality"}
                onClick={(e) => onOpenMenu("quality", e.currentTarget)}
                aria-label="Quality"
                aria-expanded={menu === "quality"}
                aria-haspopup="listbox"
              >
                <Diamond size={14} className="text-[#a4a7ab]" />
                {quality}
              </Control>
              <Control
                onClick={onToggleEnhance}
                aria-label="Enhance"
                aria-pressed={enhance}
              >
                <WandSparkles size={14} className="text-[#a4a7ab]" />
                {enhance ? "On" : "Off"}
              </Control>
              <CountStepper value={count} onChange={onCountChange} />
              <button
                type="button"
                onClick={onToggleAdvanced}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#26292c] text-white"
                aria-label="Advanced settings"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          {advanced && (
            <>
              <Control
                className="flex items-center gap-2 rounded-lg border border-[#4a4d50] bg-[#2f3235] px-3 text-[13px] font-semibold text-white"
                onClick={(e) => onOpenMenu("aspect", e.currentTarget)}
                aria-label="Back to basic"
              >
                <ChevronLeft size={12} className="text-[#a4a7ab]" />
                <span className="text-zinc-400">Off</span>
              </Control>
              <CountStepper value={count} onChange={onCountChange} />
              <ColorTransferButton />
            </>
          )}
        </div>
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollControlsTo(true)}
            className="absolute right-0 top-0.5 z-20 grid size-7 place-items-center rounded-lg bg-[#26292c] text-zinc-200"
            aria-label="More settings"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
      {/* Align all three cards to the same composer baseline. */}
      <button
        type="button"
        onClick={onCharacterClick}
        className="absolute bottom-3.5 right-[268px] flex h-20 w-20 shrink-0 flex-col items-center justify-end rounded-xl bg-[#2a2c2f] px-2"
        aria-label="Character"
        aria-pressed={characterActive}
      >
        <span className="absolute left-2 top-2 z-10 grid size-6 place-items-center rounded-md bg-white/5">
          <Plus size={12} strokeWidth={2.5} />
        </span>
        <span className="mb-2 text-[11px] font-bold uppercase text-[#c9cbce]">
          CHARACTER
        </span>
      </button>
    </>
  );
}

export function MoodboardButton({
  preset,
  onClick,
}: {
  preset: Preset;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="absolute bottom-3.5 right-[140px] h-20 w-[120px] cursor-pointer overflow-hidden rounded-xl border-2 border-white/80"
    >
      <SafeImage
        key={preset.name}
        src={preset.src}
        fallbackSrc={preset.fallback ?? soulStyle}
        alt={`${preset.name} moodboard`}
        className="h-full w-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-1 pt-3">
        <strong className="block max-w-full truncate text-center text-[13px] font-extrabold uppercase leading-none tracking-tight text-lime">
          {preset.name}
        </strong>
      </span>
      <span className="absolute right-1.5 top-1.5 flex h-[22px] items-center gap-1 rounded-lg bg-zinc-500/60 px-2 text-[11px] font-semibold text-white backdrop-blur-md">
        <Pencil size={11} />
        Change
      </span>
    </div>
  );
}

export function GenerateButton({ cost }: { cost: number }) {
  return (
    <button
      type="submit"
      className="absolute bottom-3.5 right-3.5 flex h-20 w-[120px] flex-col items-center justify-center rounded-xl bg-lime text-xs font-extrabold uppercase text-black shadow-[0_3px_0_#839700]"
    >
      Generate
      <span className="mt-0.5 text-[11px]">✦ {cost}</span>
    </button>
  );
}
