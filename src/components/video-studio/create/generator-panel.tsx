"use client";

import { useEffect, useRef, useState } from "react";
import { AssetsPicker, type AssetsPickerTabId } from "../assets/assets-picker";
import { videoTabs, type VideoTab } from "../data";
import { ModelPicker } from "../models/model-picker";
import { getPresets } from "../models/preset-browser";
import { ChangeButton } from "../shared/change-button";
import { GenerateSparkle, MixIcon, SpeakerWaveIcon } from "./panel-icons";
import { PILL_BUTTON_CLASS } from "./panel-styles";
import {
  ModelField,
  SettingsFields,
  type SettingKind,
} from "./settings-fields";
import {
  DurationPopover,
  OptionPopover,
  QUALITIES,
  type Quality,
} from "./settings-popovers";
import {
  FramesDropzone,
  InputModeTabs,
  ReferencesDropzone,
  type FrameSlotId,
  type InputMode,
} from "./source-inputs";

type PickerTarget = FrameSlotId | "references";

const FRAME_TABS: readonly AssetsPickerTabId[] = ["uploads", "images"];

const FRAME_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";

const ORIGINAL_CREDITS_PER_SECOND_AT_1080 = 5.6;

const DISCOUNT_RATIO = 18 / 28;

function getCredits(duration: number, quality: string) {
  const height = parseInt(quality, 10) || 1080;
  const original = Math.max(
    1,
    Math.round(
      ORIGINAL_CREDITS_PER_SECOND_AT_1080 * duration * (height / 1080),
    ),
  );
  const discounted = Math.max(1, Math.round(original * DISCOUNT_RATIO));
  return { original, discounted };
}

export interface GeneratorPanelProps {
  tab: VideoTab;
  onTabChange: (tab: VideoTab) => void;
  onGenerate: () => void;
  model?: string;
  onModelChange?: (model: string) => void;
  onOpenPresets?: () => void;
  onHowItWorks?: () => void;
}

export function GeneratorPanel({
  tab,
  onTabChange,
  onGenerate,
  model: modelProp,
  onModelChange,
  onOpenPresets,
}: GeneratorPanelProps) {
  const [inputMode, setInputMode] = useState<InputMode>("references");
  const [internalModel, setInternalModel] = useState("Wan 3.0");
  const model = modelProp ?? internalModel;
  const setModel = (m: string) => {
    setInternalModel(m);
    onModelChange?.(m);
  };
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState<Quality>("1080p");
  const [popover, setPopover] = useState<{
    kind: SettingKind;
    anchor: DOMRect;
  } | null>(null);
  const [picker, setPicker] = useState<{
    anchor: DOMRect;
    target: PickerTarget;
  } | null>(null);
  const [frames, setFrames] = useState<{ start?: string; end?: string }>({});

  const modelBtn = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const framesRef = useRef(frames);
  framesRef.current = frames;

  useEffect(() => {
    return () => {
      Object.values(framesRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const { original: originalCredits, discounted: finalCredits } = getCredits(
    duration,
    quality,
  );

  const updateFrame = (slot: FrameSlotId, url?: string) => {
    const previous = frames[slot];
    if (previous) URL.revokeObjectURL(previous);
    setFrames((current) => {
      const next = { ...current, [slot]: url };
      if (slot === "start" && !url) next.end = undefined;
      return next;
    });
    if (slot === "start" && !url && frames.end) {
      URL.revokeObjectURL(frames.end);
    }
  };

  const openAssetsPicker = (target: PickerTarget) => {
    setPopover(null);
    setAnchor(null);
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) setPicker({ anchor: rect, target });
  };

  const togglePicker = () => {
    setPopover(null);
    setPicker(null);
    setAnchor((a) =>
      a ? null : (modelBtn.current?.getBoundingClientRect() ?? null),
    );
  };

  const openPopover = (kind: SettingKind, el: HTMLElement) => {
    setAnchor(null);
    setPicker(null);
    setPopover({ kind, anchor: el.getBoundingClientRect() });
  };

  const handleFilesSelected = (files: FileList) => {
    if (!picker) return;
    if (picker.target === "references") {
      setPicker(null);
      onGenerate();
      return;
    }
    const file = files[0];
    if (file) updateFrame(picker.target, URL.createObjectURL(file));
    setPicker(null);
  };

  const copy =
    tab === "edit"
      ? { title: "Edit video", prompt: "Describe the edits you want to make" }
      : tab === "motion"
        ? {
          title: "Motion Control",
          prompt: "Describe the character motion and camera movement",
        }
        : {
          title: getPresets(model)[0].title,
          prompt:
            "Describe the video. Refer to inputs as Image 1, Video 1, or Audio 1",
        };

  const isFramePicker = picker !== null && picker.target !== "references";

  return (
    <aside
      ref={panelRef}
      className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-[#0f1113] lg:h-full"
    >
      <nav className="flex shrink-0 gap-3 overflow-x-auto px-4 pt-3 [scrollbar-width:none]">
        {videoTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`h-9 shrink-0 whitespace-nowrap border-b-2 text-[14px] font-medium transition ${tab === item.id
                ? "border-white text-white"
                : "border-transparent text-white/55 hover:text-white"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <form
        data-tour-anchor="tour-video-form"
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="generate-form generate-form--asset relative z-10 flex flex-1 flex-col overflow-hidden rounded-none! border-0! max-h-[calc(100vh-3rem)] min-h-0"
      >
        <div
          data-prompt-column="true"
          className="flex-1 space-y-2 overflow-x-visible overflow-y-auto p-2 min-h-0 hide-scrollbar [--prompt-max-height:0px]"
        >
          <fieldset>
            <figure
              tabIndex={-1}
              role="button"
              className="group relative h-32.5 w-full select-none overflow-hidden rounded-xl"
            >
              <video
                loop
                playsInline
                disablePictureInPicture
                preload="none"
                autoPlay
                muted
                src={getPresets(model)[0].video}
                className="size-full rounded-md object-cover object-contain"
              >
                Your browser does not support the video.
              </video>
              <div className="preload preload-transition preload-fade-out preload-gradient-0 opacity-0!" />
              <div className="absolute inset-0 bg-[image:linear-gradient(rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_50%)]" />
              <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
                <p className="w-full truncate font-grotesk text-brand-h-xxs-bold uppercase text-font-brand">
                  {copy.title}
                </p>
                <p className="text-xs text-white/80">{model}</p>
              </figcaption>
              <div className="z-2 absolute right-1.5 top-1.5 flex gap-1">
                <button
                  type="button"
                  className={`${PILL_BUTTON_CLASS} hidden! backdrop-blur-[4.5px]`}
                >
                  <MixIcon />
                  Mix
                </button>
                <span className="contents [&>*]:backdrop-blur-[4.5px]">
                  <ChangeButton
                    onClick={() => {
                      setPopover(null);
                      setAnchor(null);
                      setPicker(null);
                      if (onOpenPresets) onOpenPresets();
                      else togglePicker();
                    }}
                  />
                </span>
              </div>
            </figure>
          </fieldset>

          <div className="relative flex flex-col">
            <InputModeTabs
              value={inputMode}
              onChange={(mode) => {
                setInputMode(mode);
                setPicker(null);
              }}
            />

            <div className="relative mt-2 flex flex-col gap-2">
              {inputMode === "frames" ? (
                <FramesDropzone
                  start={frames.start}
                  end={frames.end}
                  onPick={openAssetsPicker}
                  onRemove={(slot) => updateFrame(slot, undefined)}
                />
              ) : (
                <ReferencesDropzone
                  onAdd={() => openAssetsPicker("references")}
                />
              )}

              <div
                data-prompt-field="true"
                className="flex max-h-64 min-h-40 w-full flex-col"
              >
                <div className="relative grid w-full flex-1 grid-rows-1 overflow-y-auto rounded-b-none rounded-t-xl border-0! bg-white-5!">
                  <p className="absolute left-3 top-3 text-sm font-medium text-q-label-sm-medium! text-q-text-primary!">
                    Prompt
                  </p>
                  <textarea
                    aria-label="Prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={copy.prompt}
                    className="size-full h-auto! min-h-full resize-none select-text self-start whitespace-pre-wrap bg-transparent p-3 pt-9 text-sm text-white [word-break:break-word] placeholder:text-font-secondary focus:outline-none"
                    rows={3}
                  />
                </div>
                <div className="flex flex-wrap gap-1 rounded-b-xl rounded-t-none bg-white-5! p-3 pt-2">
                  <div className="flex items-center gap-1.5">
                    <label className="flex w-fit cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white-5! px-1.5 py-1 text-white transition-colors hover:bg-white-8!">
                      <span>
                        <SpeakerWaveIcon />
                      </span>
                      <span className="text-caption-m font-medium">
                        {enhancePrompt ? "On" : "Off"}
                      </span>
                      <input
                        className="sr-only"
                        type="checkbox"
                        checked={enhancePrompt}
                        onChange={(e) => setEnhancePrompt(e.target.checked)}
                        name="enhancePrompt"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <ModelField
              model={model}
              open={!!anchor}
              buttonRef={modelBtn}
              onToggle={togglePicker}
            />

            <SettingsFields
              duration={duration}
              quality={quality}
              activeKind={popover?.kind}
              onOpen={openPopover}
            />
          </div>
        </div>

        <div className="relative bottom-0 w-full shrink-0 rounded-b-2xl px-2 pb-3 pt-0">
          <div className="z-1 relative">
            <div className="relative" data-tour-anchor="tour-generate-button">
              <button
                type="submit"
                className="relative inline-grid h-12 w-full max-w-full grid-flow-col items-center justify-center gap-2 rounded-xl border-none bg-btn-accent-bg bg-radial from-[#EFFE17] from-40% to-btn-accent-bg px-6 pb-0.5 text-sm font-semibold text-btn-accent-text shadow-[inset_0px_-3px_rgba(0,0,0,0.43)] transition hover:opacity-80 active:scale-97 active:opacity-60 disabled:bg-button-disabled! disabled:text-font-disabled!"
                aria-busy="false"
              >
                Generate
                <div className="flex items-center gap-1">
                  <GenerateSparkle />
                  <span className="relative opacity-50" translate="no">
                    {originalCredits}
                    <span className="absolute left-[-2px] right-[-2px] top-1/2 rotate-30 border-t-[1.5px] border-current" />
                  </span>
                  <span translate="no">{finalCredits}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>

      {picker && (
        <AssetsPicker
          anchor={picker.anchor}
          tabs={isFramePicker ? FRAME_TABS : undefined}
          accept={isFramePicker ? FRAME_ACCEPT : undefined}
          multiple={!isFramePicker}
          onClose={() => setPicker(null)}
          onFilesSelected={handleFilesSelected}
        />
      )}
      {anchor && (
        <ModelPicker
          anchor={anchor}
          selected={model}
          onSelect={setModel}
          onClose={() => setAnchor(null)}
        />
      )}
      {popover?.kind === "duration" && (
        <DurationPopover
          anchor={popover.anchor}
          value={duration}
          onChange={setDuration}
          onClose={() => setPopover(null)}
        />
      )}
      {popover?.kind === "quality" && (
        <OptionPopover
          anchor={popover.anchor}
          title="Quality"
          options={QUALITIES}
          value={quality}
          onSelect={setQuality}
          onClose={() => setPopover(null)}
        />
      )}
    </aside>
  );
}
