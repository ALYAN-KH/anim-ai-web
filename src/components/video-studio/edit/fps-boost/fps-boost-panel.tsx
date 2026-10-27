"use client";
import { ChangeButton } from "../../shared/change-button";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useToast } from "../../shared/tool-toast";
import { ChevronIcon, CloseIcon, VideoPlusIcon } from "../../shared/media-icons";
import { MediaPicker } from "../../shared/media-picker";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

const FPS_OPTIONS = [
  { value: "24", label: "24" },
  { value: "30", label: "30" },
  { value: "60", label: "60" },
  { value: "90", label: "90" },
  { value: "120", label: "120" },
];

const HERO_SRC =
  "https://static.higgsfield.ai/video-edit-form/v2/tools-hero/fps-booster.mp4";

const HERO_POSTER =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fstatic.higgsfield.ai%2Fvideo-edit-form%2Fv2%2Ftools-hero%2Ffps-booster-poster.webp&w=800&q=85";

export type FpsBoostParams = {
  file: File;
  fps: number;
  duration: number;
};

export type FpsBoostPanelProps = {
  onGenerate: (params: FpsBoostParams) => void;
  onChangeTool?: () => void;
};

type PickerAnchor = { left: number; top: number } | null;

export function FpsBoostPanel({ onGenerate, onChangeTool }: FpsBoostPanelProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [anchor, setAnchor] = useState<PickerAnchor>(null);
  const [fps, setFps] = useState("60");
  const [fpsOpen, setFpsOpen] = useState(false);
  const { showToast, toast } = useToast();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const acceptFile = useCallback((next: File | undefined) => {
    if (!next) return;
    if (!next.type.startsWith("video/")) {
      setError("Please choose a video file");
      return;
    }
    if (next.size > MAX_FILE_BYTES) {
      setError("Video must be 100 MB or smaller");
      return;
    }
    setError(null);
    setDuration(0);
    setFile(next);
  }, []);

  const openPicker = () => {
    const drop = dropRef.current;
    const aside = drop?.closest("aside");
    if (drop && aside && window.innerWidth >= 1024) {
      const dropRect = drop.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      setAnchor({ left: asideRect.right, top: dropRect.top });
    } else {
      setAnchor(null);
    }
    setPickerOpen(true);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
    setPickerOpen(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setFile(null);
    setDuration(0);
    setError(null);
  };

  const handleGenerate = () => {
    if (!file) {
      showToast("Video is required");
      return;
    }
    onGenerate({ file, fps: Number(fps), duration });
  };

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-0 flex-1 flex-col gap-3 px-2 pt-2"
    >
      <figure className="relative h-[130px] w-full shrink-0 select-none overflow-hidden rounded-xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          poster={HERO_POSTER}
          src={HERO_SRC}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/60 ring-1 ring-inset ring-white/10" />
        <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
          <h2
            id={titleId}
            className="w-full truncate text-lg font-bold uppercase tracking-wide text-[#EFFE17]"
          >
            FPS Boost
          </h2>
          <p className="text-xs text-white/80">
            Increase frame rate with interpolation
          </p>
        </figcaption>
        <div className="absolute right-1.5 top-1.5 z-20 flex gap-1">
          <ChangeButton onClick={onChangeTool} />
        </div>
      </figure>

      <div className="flex min-h-0 flex-1 flex-col pb-4">
        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          <div className="shrink-0">
            <div
              ref={dropRef}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className="relative flex w-full flex-col items-center justify-center rounded-xl bg-white/[.05] p-1"
            >
              <div
                className={`relative flex h-40 flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-lg border border-dashed p-4 transition motion-reduce:transition-none ${dragging ? "border-[#EFFE17]" : "border-white/10"
                  }`}
              >
                {file && previewUrl ? (
                  <>
                    <video
                      src={previewUrl}
                      muted
                      playsInline
                      controls
                      onLoadedMetadata={(event) =>
                        setDuration(event.currentTarget.duration || 0)
                      }
                      className="absolute inset-0 size-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove video"
                      className="absolute right-2 top-2 z-20 inline-flex size-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]"
                    >
                      <CloseIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="Add video to change fps"
                      onClick={openPicker}
                      className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFFE17]"
                    />
                    <div className="pointer-events-none text-center">
                      <div
                        aria-hidden="true"
                        className="mx-auto grid size-9 place-items-center rounded-full border border-white/10 bg-white/[.06] text-white/60"
                      >
                        <VideoPlusIcon className="size-4" />
                      </div>
                      <p className="mt-3 whitespace-nowrap text-sm font-medium text-white">
                        Add video to change fps
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-white/50">
                        Up to 100 MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {error ? (
              <p role="alert" className="mt-2 text-xs text-red-400">
                {error}
              </p>
            ) : null}
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              tabIndex={-1}
              className="sr-only"
              onChange={onInputChange}
            />
          </div>

          <button
            type="button"
            aria-expanded={fpsOpen}
            onClick={() => setFpsOpen((v) => !v)}
            className={`flex h-[54px] w-full min-w-0 items-center gap-2 rounded-xl border bg-white/[.03] px-3 py-2 text-left transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17] motion-reduce:transition-none ${fpsOpen ? "border-[#EFFE17]" : "border-white/10"
              }`}
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[11px] font-medium text-white/50">
                Frame rate
              </span>
              <span className="text-sm font-medium text-white">{fps} FPS</span>
            </span>
            <ChevronIcon
              className={`shrink-0 text-white/50 transition-transform motion-reduce:transition-none ${fpsOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {fpsOpen && (
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[.03] p-3">
              <span className="text-[11px] font-medium text-white/50">Frame rate (FPS)</span>
              <div className="flex gap-2">
                {FPS_OPTIONS.map((opt) => {
                  const selected = fps === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setFps(opt.value); setFpsOpen(false); }}
                      className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17] motion-reduce:transition-none ${selected
                          ? "bg-[#EFFE17] text-black"
                          : "bg-white/[.06] text-white hover:bg-white/[.10]"
                        }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 pt-6">
          <button
            type="button"
            onClick={handleGenerate}
            className="h-14 w-full rounded-xl bg-[radial-gradient(ellipse_at_50%_0%,#F6FF6B_0%,#EFFE17_70%)] text-base font-semibold text-black shadow-[inset_0_-4px_0_rgba(0,0,0,.18)] transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[.97] motion-reduce:transition-none"
          >
            Generate
          </button>
        </div>
      </div>

      {pickerOpen && (
        <MediaPicker
          anchor={anchor}
          onClose={() => setPickerOpen(false)}
          onUploadClick={() => inputRef.current?.click()}
        />
      )}
      {toast}
    </section>
  );
}
