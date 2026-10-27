"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AssetsPicker, type AssetsPickerTabId } from "../../assets/assets-picker";
import { ChangeButton } from "../../shared/change-button";
import { useToast } from "../../shared/tool-toast";
import { ToolToggle } from "../../shared/tool-toggle";
import {
  AtIcon,
  Chevron,
  ImageOutlineIcon,
  MusicOutlineIcon,
  REFERENCE_PICKER_TABS,
  UploadCircle,
  VIDEO_PICKER_TABS,
} from "../edit-video/edit-tool-form";
import { VideoSourceArea, useVideoSource } from "../shared/video-source";

const HERO_VIDEO =
  "https://static.higgsfield.ai/seedance-2.5/video-banner-general.mp4";

const GENERATE_COST = 80;

const PROMPT_PLACEHOLDER =
  'Describe what happens next — e.g. "she turns and walks away" or "the camera pulls back". Add reference images or elements using @…';

interface SettingOption {
  value: string;
  description?: string;
}

const SETTING_OPTIONS = {
  Direction: [
    { value: "Sequel", description: "Continue after the end" },
    { value: "Prequel", description: "Build before the start" },
  ],
  Duration: [
    { value: "5s" },
    { value: "10s" },
    { value: "15s" },
    { value: "30s" },
  ],
  Quality: [{ value: "480p" }, { value: "720p" }, { value: "1080p" }],
  Bitrate: [
    { value: "High", description: "Less compression · larger size" },
    { value: "Standard", description: "More compression · smaller size" },
  ],
} satisfies Record<string, SettingOption[]>;

type SettingKind = keyof typeof SETTING_OPTIONS;

function SparkleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2c.5 5.6 1.7 8.7 10 10-8.3 1.3-9.5 4.4-10 10-.5-5.6-1.7-8.7-10-10C10.3 10.7 11.5 7.6 12 2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-lime"
      aria-hidden="true"
    >
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SettingPopoverProps {
  anchor: DOMRect;
  title: string;
  options: readonly SettingOption[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

function SettingPopover({
  anchor,
  title,
  options,
  value,
  onSelect,
  onClose,
}: SettingPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    const height = ref.current?.offsetHeight ?? 0;
    const fitsBelow = window.innerHeight - anchor.bottom >= height + 32;
    const fitsAbove = anchor.top >= height + 32;
    setTop(
      fitsBelow || !fitsAbove ? anchor.bottom + 12 : anchor.top - height - 12,
    );
  }, [anchor]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={title}
      style={{
        left: anchor.left - 2,
        minWidth: anchor.width + 22,
        top: top ?? anchor.bottom + 12,
        visibility: top === null ? "hidden" : "visible",
      }}
      className="fixed z-50 rounded-2xl border border-white/[.06] bg-[#15181b] p-2 shadow-2xl"
    >
      <p className="px-3 pb-2 pt-2 text-sm font-medium text-white/55">
        {title}
      </p>
      <div className="flex flex-col gap-0.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime ${selected ? "bg-white/[.06]" : ""
                }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">
                  {option.value}
                </span>
                {option.description && (
                  <span className="block text-xs text-white/55">
                    {option.description}
                  </span>
                )}
              </span>
              {selected && <CheckIcon />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface ExtendToolFormProps {
  onChangeTool: () => void;
  onSignup?: () => void;
  selectedModelId?: string;
  onModelChange?: (id: string) => void;
}

export function ExtendToolForm({ onChangeTool, onSignup }: ExtendToolFormProps) {
  const [prompt, setPrompt] = useState("");
  const {
    video: videoUpload,
    select: selectVideoFile,
    set: setVideo,
    clear: clearVideo,
  } = useVideoSource();
  const [referenceName, setReferenceName] = useState("");
  const [audio, setAudio] = useState(true);
  const [settings, setSettings] = useState<Record<SettingKind, string>>({
    Direction: "Sequel",
    Duration: "5s",
    Quality: "1080p",
    Bitrate: "High",
  });
  const [settingMenu, setSettingMenu] = useState<{
    kind: SettingKind;
    anchor: DOMRect;
  } | null>(null);
  const { showToast, toast } = useToast();
  const [picker, setPicker] = useState<{
    kind: "video" | "reference";
    anchor: DOMRect;
    initialTab?: AssetsPickerTabId;
  } | null>(null);

  const selectVideo = (files: FileList) => {
    selectVideoFile(files);
    setPicker(null);
  };

  const selectReferences = (files: FileList) => {
    setReferenceName(files[0]?.name ?? "");
    setPicker(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoUpload) { showToast("Video is required"); return; }
    onSignup?.();
  };

  const renderSetting = (kind: SettingKind) => (
    <button
      key={kind}
      type="button"
      aria-haspopup="menu"
      aria-expanded={settingMenu?.kind === kind}
      onClick={(event) =>
        setSettingMenu({
          kind,
          anchor: event.currentTarget.getBoundingClientRect(),
        })
      }
      className={`flex h-[54px] w-full items-center justify-between rounded-xl border bg-white/[.05] px-3 text-left transition-colors hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime ${settingMenu?.kind === kind ? "border-lime" : "border-white/[.04]"
        }`}
    >
      <span>
        <span className="block text-xs font-medium text-white/55">{kind}</span>
        <span className="block text-sm font-semibold text-white">
          {settings[kind]}
        </span>
      </span>
      <Chevron />
    </button>
  );

  return (
    <>
      <form
        onSubmit={submit}
        className="flex min-h-0 flex-1 flex-col rounded-b-2xl bg-[#0f1113] p-2"
      >
        <div className="shrink-0 px-3 pt-3 md:px-0 md:pt-0">
          <figure className="group relative h-[130px] w-full select-none overflow-hidden rounded-xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="metadata"
              src={HERO_VIDEO}
              className="pointer-events-none absolute inset-0 size-full object-cover"
            >
              Your browser does not support the video.
            </video>
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/60 ring-1 ring-inset ring-white/10" />
            <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
              <h2 className="w-full truncate font-grotesk text-[18px] font-bold uppercase leading-tight text-lime">
                Extend Video
              </h2>
              <p className="text-xs text-white/80">Generate a continuation</p>
            </figcaption>
            <div className="absolute right-1.5 top-1.5 z-20">
              <ChangeButton onClick={onChangeTool} />
            </div>
          </figure>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-2 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-2">
            <VideoSourceArea
              video={videoUpload}
              label="Add video to extend"
              duration="Duration 2 - 30s"
              onOpen={(anchor) => setPicker({ kind: "video", anchor })}
              onRemove={clearVideo}
            />

            <div className="relative flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[.035] p-4">
              <button
                type="button"
                onClick={(event) =>
                  setPicker({
                    kind: "reference",
                    anchor: event.currentTarget.getBoundingClientRect(),
                  })
                }
                className="absolute inset-0 z-10 rounded-[inherit]"
                aria-label="Add elements or references"
              />
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex items-center">
                  <UploadCircle>
                    <ImageOutlineIcon />
                  </UploadCircle>
                  <span className="-ml-1">
                    <UploadCircle>
                      <MusicOutlineIcon />
                    </UploadCircle>
                  </span>
                </div>
                <p className="max-w-[245px] truncate text-sm font-medium text-white/65">
                  {referenceName || "Add elements or references"}
                </p>
                <p className="text-xs font-medium text-white/60">
                  Up to 50 image or audio
                </p>
              </div>
            </div>

            {renderSetting("Direction")}

            <div className="min-h-40 overflow-hidden rounded-xl bg-white/[.05]">
              <label
                htmlFor="extend-video-prompt"
                className="block px-3 pt-3 text-sm font-medium text-white"
              >
                Prompt
              </label>
              <textarea
                id="extend-video-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={PROMPT_PLACEHOLDER}
                className="min-h-[108px] w-full resize-none bg-transparent px-3 pb-2 pt-2 text-sm text-white outline-none placeholder:text-white/40"
              />
              <div className="flex items-center gap-1.5 p-3 pt-2">
                <button
                  type="button"
                  onClick={(event) => {
                    const form = event.currentTarget.closest("form");
                    if (!form) return;
                    const formRect = form.getBoundingClientRect();
                    const buttonRect =
                      event.currentTarget.getBoundingClientRect();
                    setPicker({
                      kind: "reference",
                      initialTab: "elements",
                      anchor: new DOMRect(
                        formRect.right - 16,
                        buttonRect.top,
                        0,
                        buttonRect.height,
                      ),
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[.05] px-1.5 py-1 text-xs font-semibold text-white hover:bg-white/[.08]"
                >
                  <AtIcon />
                  Elements
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {renderSetting("Duration")}
              {renderSetting("Quality")}
            </div>

            {renderSetting("Bitrate")}

            <button
              type="button"
              role="switch"
              aria-checked={audio}
              onClick={() => setAudio((current) => !current)}
              className="flex h-[54px] w-full items-center justify-between rounded-xl bg-white/[.05] px-3 text-sm font-semibold text-white transition-colors hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"
            >
              Audio
              <ToolToggle checked={audio} />
            </button>
          </div>
        </div>

        <div className="shrink-0 px-3 py-3 md:px-0 md:pb-0 md:pt-3">
          {toast}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[radial-gradient(circle_at_50%_0%,#effe17_0%,#d1fe17_55%)] px-6 text-sm font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,.43)] transition hover:brightness-90 active:brightness-75"
          >
            Generate
            <span className="inline-flex items-center gap-1 text-base">
              <SparkleIcon />
              {GENERATE_COST}
            </span>
          </button>
        </div>

        {picker && (
          <AssetsPicker
            anchor={picker.anchor}
            initialTab={picker.initialTab}
            onClose={() => setPicker(null)}
            tabs={
              picker.kind === "video"
                ? VIDEO_PICKER_TABS
                : REFERENCE_PICKER_TABS
            }
            accept={picker.kind === "video" ? "video/*" : "image/*,audio/*"}
            multiple={picker.kind === "reference"}
            onFilesSelected={
              picker.kind === "video" ? selectVideo : selectReferences
            }
            onPresetSelected={(selection) => {
              setVideo(selection);
              setPicker(null);
            }}
          />
        )}
      </form>

      {settingMenu && (
        <SettingPopover
          anchor={settingMenu.anchor}
          title={settingMenu.kind}
          options={SETTING_OPTIONS[settingMenu.kind]}
          value={settings[settingMenu.kind]}
          onSelect={(value) =>
            setSettings((current) => ({
              ...current,
              [settingMenu.kind]: value,
            }))
          }
          onClose={() => setSettingMenu(null)}
        />
      )}
    </>
  );
}
