"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { ChangeButton } from "../../shared/change-button";
import { useToast } from "../../shared/tool-toast";
import { CloseIcon, VideoPlusIcon } from "../../shared/media-icons";
import { MediaPicker } from "../../shared/media-picker";
import { Select } from "../reframe/select-field";
import { CreativityField } from "./creativity-field";
import { ModelField } from "./model-field";
import { MODELS, RESOLUTIONS } from "./settings-data";
import { pendingToolVideo } from "../../assets/video-tool-handoff";

export const HERO_VIDEO =
  "https://static.higgsfield.ai/video-edit-form/v2/tools-hero/upscale.mp4";

export const HERO_POSTER =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fstatic.higgsfield.ai%2Fvideo-edit-form%2Fv2%2Ftools-hero%2Fupscale-poster.webp&w=800&q=85";

export const MAX_DURATION = 20;

export type UpscaleParams = {
  file: File;
  resolution: string;
  creativity: string;
  prompt: string;
  model: string;
  duration: number;
};

export type UpscalePanelProps = {
  onGenerate: (params: UpscaleParams) => void;
  onChangeTool?: () => void;
};

export function UpscalePanel({ onGenerate, onChangeTool }: UpscalePanelProps) {
  const { showToast, toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resolution, setResolution] = useState("2K");
  const [creativity, setCreativity] = useState("precise");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openPicker = useCallback(() => {
    const el = dropRef.current;
    if (el && window.innerWidth >= 1024) {
      const rect = el.getBoundingClientRect();
      const panel = el.closest("aside");
      const left = panel ? panel.getBoundingClientRect().right : rect.right;
      setAnchor({ left, top: rect.top });
    } else {
      setAnchor(null);
    }
    setPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => setPickerOpen(false), []);

  const reset = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setDuration(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const acceptFile = useCallback((next: File | undefined) => {
    if (!next) return;

    if (!next.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }

    const url = URL.createObjectURL(next);
    const probe = document.createElement("video");
    probe.preload = "metadata";

    probe.onloadedmetadata = () => {
      const d = probe.duration;
      if (!Number.isFinite(d) || d <= 0 || d > MAX_DURATION) {
        URL.revokeObjectURL(url);
        setError(`Video must be ${MAX_DURATION} seconds or shorter.`);
        return;
      }
      setError(null);
      setFile(next);
      setDuration(d);
      setPreviewUrl(url);
      setPickerOpen(false);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError("This video couldn't be read. Try another file.");
    };
    probe.src = url;
  }, []);

  useEffect(() => {
    const selected = pendingToolVideo();
    if (!selected) return;
    const controller = new AbortController();
    const source = selected.url.startsWith("blob:") ? selected.url : `/api/video-download?${new URLSearchParams({ url: selected.url, name: selected.name })}`;
    fetch(source, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Video unavailable");
      return response.blob();
    }).then(blob => { if (!controller.signal.aborted) acceptFile(new File([blob], selected.name, { type: blob.type || "video/mp4" })); }).catch(() => { if (!controller.signal.aborted) setError("Could not load the selected video. Please upload it again."); });
    return () => controller.abort();
  }, [acceptFile]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleGenerate = () => {
    if (!file || duration === null) {
      showToast("Video is required");
      return;
    }
    onGenerate({
      file,
      resolution,
      creativity,
      prompt: prompt.trim(),
      model,
      duration,
    });
  };

  return (
    <section
      aria-labelledby="upscale-title"
      className="flex min-h-0 flex-1 flex-col gap-3 px-2 pt-2"
    >
      <figure className="group relative h-[130px] w-full shrink-0 select-none overflow-hidden rounded-xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          poster={HERO_POSTER}
          src={HERO_VIDEO}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        >
          Your browser does not support the video.
        </video>

        <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/60 ring-1 ring-inset ring-white/10" />

        <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
          <h2
            id="upscale-title"
            className="w-full truncate text-lg font-bold uppercase tracking-wide text-[#EFFE17]"
          >
            Upscale
          </h2>
          <p className="text-xs text-white/80">
            Increase resolution and sharpen details
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
              id="video-edit-tool-upscale-upload"
              aria-busy="false"
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className="relative flex w-full flex-col items-center justify-center self-stretch rounded-xl bg-white/[.05] p-1"
            >
              <div className="relative flex h-40 flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-lg p-4">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 rounded-lg border border-dashed transition-colors ${dragging ? "border-[#EFFE17]/70" : "border-white/10"
                    }`}
                />

                {previewUrl ? (
                  <>
                    <video
                      src={previewUrl}
                      controls
                      playsInline
                      className="absolute inset-0 size-full rounded-lg bg-black object-contain"
                    />
                    <button
                      type="button"
                      onClick={reset}
                      aria-label="Remove video"
                      className="absolute right-1.5 top-1.5 z-20 inline-flex size-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      <CloseIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="Add a video to upscale"
                      onClick={openPicker}
                      className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#EFFE17]"
                    />
                    <div className="pointer-events-none w-full text-center">
                      <div className="grid justify-center">
                        <div
                          aria-hidden="true"
                          className="grid size-9 items-center justify-center rounded-full border border-white/10 bg-white/[.04] text-white/60 backdrop-blur-sm"
                        >
                          <VideoPlusIcon className="size-4" />
                        </div>
                      </div>
                      <div className="mt-3 whitespace-nowrap text-sm font-medium text-white">
                        <p>Add a video to upscale</p>
                        <p className="mt-0.5 hidden whitespace-pre-line text-xs font-medium text-white/50 md:block">
                          Up to {MAX_DURATION}s
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="sr-only"
                tabIndex={-1}
                onChange={handleInput}
              />
            </div>

            {error && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select
                label="Output resolution"
                value={resolution}
                options={RESOLUTIONS}
                onChange={setResolution}
              />
              <CreativityField value={creativity} onChange={setCreativity} />
            </div>
            <div className="flex gap-2">
              <textarea
                aria-label="Prompt"
                placeholder="Describe details to preserve or enhance"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-[120px] w-full resize-none rounded-xl border border-white/10 bg-white/[.03] p-3 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus-visible:border-white/30"
              />
            </div>
          </div>

          <ModelField value={model} onChange={setModel} />
        </div>

        <div className="shrink-0 pt-6">
          <button
            type="button"
            onClick={handleGenerate}
            aria-busy="false"
            className="h-14 w-full rounded-xl bg-[radial-gradient(circle_at_center,#EFFE17_40%,#d9e612_100%)] px-6 pb-0.5 text-base font-semibold text-black shadow-[inset_0px_-3px_rgba(0,0,0,0.43)] transition hover:opacity-80 active:scale-[.97] active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]/50"
          >
            Generate
          </button>
        </div>
      </div>

      {toast}
      {pickerOpen && (
        <MediaPicker
          anchor={anchor}
          onClose={closePicker}
          onUploadClick={() => inputRef.current?.click()}
        />
      )}
    </section>
  );
}
