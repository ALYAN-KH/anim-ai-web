"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { editVideoMedia } from "../../data";
import { ChangeButton } from "../../shared/change-button";

const circleShadow =
  "0 128.852px 36.007px transparent, 0 82.429px 33.031px rgba(0,0,0,.01), 0 46.422px 27.972px rgba(0,0,0,.05), 0 20.533px 20.533px rgba(0,0,0,.09), 0 5.059px 11.308px rgba(0,0,0,.1), inset 0 -.298px 5.356px rgba(185,185,185,.35)";

function UploadCircle({ children }: { children: ReactNode }) {
  return (
    <span
      className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[.04] text-white/65 backdrop-blur-sm"
      style={{ boxShadow: circleShadow }}
    >
      {children}
    </span>
  );
}

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-white/45"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.46967 7.46967C9.76256 7.17678 10.2374 7.17678 10.5303 7.46967L14.1768 11.1161C14.6649 11.6043 14.6649 12.3957 14.1768 12.8839L10.5303 16.5303C10.2374 16.8232 9.76256 16.8232 9.46967 16.5303C9.17678 16.2374 9.17678 15.7626 9.46967 15.4697L12.9393 12L9.46967 8.53033C9.17678 8.23744 9.17678 7.76256 9.46967 7.46967Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PromptMethodIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.75 18.25h3.5M3.75 12h5.5M3.75 5.75h16.5M17 10.5l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DrawMethodIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.746 13.5c8.172-8.078 11.542-11.22 13.521-9.114 2.814 2.993-11.639 12.076-7.64 14.382 3.331 1.92 8.708-8.556 10.916-5.869 1.302 1.583-3.276 5.092-2.057 6.838.836 1.198 2.627.057 3.76-.966"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.25 6.75A2.25 2.25 0 1 0 14.25 11.25 2.25 2.25 0 0 0 14.25 6.75Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4.75A1.75 1.75 0 0 1 4.75 3h14.5A1.75 1.75 0 0 1 21 4.75v14.5A1.75 1.75 0 0 1 19.25 21H4.75A1.75 1.75 0 0 1 3 19.25V4.75Zm16.5 13.689-4.616-4.616a1.25 1.25 0 0 0-1.768 0l-.939.94a.25.25 0 0 1-.354 0l-2.95-2.95a1.25 1.25 0 0 0-1.74-.027L4.5 14.264V4.75a.25.25 0 0 1 .25-.25h14.5a.25.25 0 0 1 .25.25v13.689Z"
      />
    </svg>
  );
}

function MusicOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.184 3.835a.25.25 0 0 1 .318.24v9.075a4.18 4.18 0 0 0-2.25-.65c-1.937 0-3.75 1.333-3.75 3.25S15.315 19 17.252 19s3.75-1.333 3.75-3.25V4.076a1.75 1.75 0 0 0-2.23-1.683L10.269 4.822A1.75 1.75 0 0 0 9 6.504v9.646a4.18 4.18 0 0 0-2.25-.65C4.813 15.5 3 16.833 3 18.75S4.813 22 6.75 22s3.75-1.333 3.75-3.25V6.504a.25.25 0 0 1 .181-.24l8.503-2.429Z"
      />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface EditToolFormProps {
  onChangeTool: () => void;
}

export function EditToolForm({ onChangeTool }: EditToolFormProps) {
  const [method, setMethod] = useState<"prompt" | "draw">("prompt");
  const [, setDrawMode] = useState<"video" | "edit">("edit");
  const [, setDrawOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [videoUpload, setVideoUpload] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [referenceName, setReferenceName] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const videoInput = useRef<HTMLInputElement>(null);
  const referenceInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (videoUpload) URL.revokeObjectURL(videoUpload.url);
    };
  }, [videoUpload]);

  const readName = (
    event: ChangeEvent<HTMLInputElement>,
    setName: (name: string) => void,
  ) => {
    setName(event.currentTarget.files?.[0]?.name ?? "");
  };

  const selectVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setVideoUpload((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return { name: file.name, url: URL.createObjectURL(file) };
    });
    event.currentTarget.value = "";
  };

  const submit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <form
      onSubmit={submit}
      className="flex min-h-0 flex-1 flex-col rounded-b-2xl bg-[#0f1113] p-4 md:py-2"
    >
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pt-3 [scrollbar-width:none] md:px-0 md:pt-0 [&::-webkit-scrollbar]:hidden">
        {/* Hero Figure */}
        <figure className="group relative h-[130px] w-full shrink-0 select-none overflow-hidden rounded-xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            poster={editVideoMedia.heroPoster}
            preload="metadata"
            src={editVideoMedia.hero}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          >
            Your browser does not support the video.
          </video>
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/60 ring-1 ring-inset ring-white/10" />
          <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
            <h2 className="w-full truncate font-grotesk text-[18px] font-bold uppercase leading-tight text-lime">
              Edit Video
            </h2>
            <p className="text-xs text-white/80">
              Make targeted changes with a prompt
            </p>
          </figcaption>
          <div className="absolute right-1.5 top-1.5 z-20">
            <ChangeButton onClick={onChangeTool} />
          </div>
        </figure>

        <div className="flex flex-col gap-2">
          {/* Method selector: Prompt vs Draw */}
          <div
            role="radiogroup"
            aria-label="Edit method"
            className="grid grid-cols-2 rounded-xl bg-white/[.05] p-1"
          >
            {(["prompt", "draw"] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={method === item}
                onClick={() => {
                  setMethod(item);
                  if (item === "draw") {
                    setDrawMode("edit");
                    setDrawOpen(true);
                  }
                }}
                className={`relative flex h-8 items-center justify-center gap-2 rounded-lg text-xs font-medium capitalize transition ${method === item
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:text-white"
                  }`}
              >
                {item === "prompt" ? <PromptMethodIcon /> : <DrawMethodIcon />}
                {item}
              </button>
            ))}
          </div>

          {/* Video upload slot */}
          <input
            ref={videoInput}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={selectVideo}
          />
          <div className="relative flex h-40 flex-col items-center justify-center overflow-hidden rounded-xl bg-white/[.05] p-4">
            {videoUpload && (
              <video
                src={videoUpload.url}
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 size-full object-cover opacity-45"
              />
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-1 rounded-lg border border-dashed border-white/10"
            />
            <button
              type="button"
              aria-label="Add a video to edit"
              onClick={() => videoInput.current?.click()}
              className="absolute inset-0 z-10 rounded-[inherit]"
            />
            <UploadCircle>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 5.75A1.75 1.75 0 0 1 3.75 4h10.5A1.75 1.75 0 0 1 16 5.75v3.037l4.191-2.096A1.25 1.25 0 0 1 22 7.809v8.382a1.25 1.25 0 0 1-1.809 1.118L16 15.214v3.036A1.75 1.75 0 0 1 14.25 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75Zm14 7.787 4.5 2.25V8.214l-4.5 2.25v3.073Z"
                />
              </svg>
            </UploadCircle>
            <div className="relative mt-3 text-center text-sm font-medium text-white">
              <p className="max-w-[245px] truncate">
                {videoUpload?.name || "Add a video to edit"}
              </p>
              <p className="mt-0.5 text-xs text-white/45">Up to 30s</p>
            </div>
          </div>

          {/* Reference upload slot */}
          <input
            ref={referenceInput}
            type="file"
            accept="image/*,audio/*"
            multiple
            className="sr-only"
            onChange={(event) => readName(event, setReferenceName)}
          />
          <div className="relative flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[.035] p-4">
            <button
              type="button"
              onClick={() => referenceInput.current?.click()}
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

          {/* Prompt field */}
          <div className="min-h-40 overflow-hidden rounded-xl bg-white/[.05]">
            <label
              htmlFor="edit-video-prompt"
              className="block px-3 pt-3 text-sm font-medium text-white"
            >
              Prompt
            </label>
            <textarea
              id="edit-video-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe what to change in the video. Add reference images or elements using @…"
              className="min-h-[108px] w-full resize-none bg-transparent px-3 pb-2 pt-2 text-sm text-white outline-none placeholder:text-white/40"
            />
            <div className="flex items-center gap-1.5 p-3 pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/[.05] px-1.5 py-1 text-xs font-semibold text-white hover:bg-white/[.08]"
              >
                <AtIcon />
                Elements
              </button>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/[.05] px-1.5 py-1 text-xs font-medium text-white hover:bg-white/[.08]">
                <input
                  type="checkbox"
                  checked={enhancePrompt}
                  onChange={(event) => setEnhancePrompt(event.target.checked)}
                  className="sr-only"
                />
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M19.248 4.752A10.22 10.22 0 0 1 22.25 12a10.22 10.22 0 0 1-3.002 7.248M15.889 8.111A5.48 5.48 0 0 1 17.5 12a5.48 5.48 0 0 1-1.611 3.89M2.75 7.75h2.957a1 1 0 0 0 .539-.158L12.25 3.75v16.5l-6.004-3.842a1 1 0 0 0-.539-.158H2.75a1 1 0 0 1-1-1v-6.5a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {enhancePrompt ? "On" : "Off"}
              </label>
            </div>
          </div>

          {/* Model trigger */}
          <button
            type="button"
            className="grid min-h-[54px] w-full grid-cols-[1fr_auto] items-center gap-2 rounded-xl bg-white/[.05] px-3 py-2 text-left hover:bg-white/[.08]"
          >
            <span className="min-w-0">
              <span className="block text-xs font-medium leading-4 text-white/55">
                Model
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-white">
                Seedance 2.5 Edit
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="text-lime"
                  aria-hidden="true"
                >
                  <path
                    d="m3.154 12.154-2.62.655V1.2l2.62.655v10.3Zm12.668.679-2.626.656V.519l2.627.65v11.664Zm-8.509-.325-2.622.656v-6.84l2.622.655v5.53ZM9.025 5.31l2.627-.656v6.84l-2.627-.656V5.31Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </span>
            <Chevron />
          </button>

          {/* Quality & Bitrate fields */}
          <fieldset className="grid grid-cols-2 gap-2">
            {[
              { label: "Quality", value: "1080p" },
              { label: "Bitrate", value: "High" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex h-[54px] items-center justify-between gap-2 rounded-xl bg-white/[.05] px-3 py-2 text-left hover:bg-white/[.08]"
              >
                <span>
                  <span className="block text-xs font-medium leading-4 text-white/55">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </span>
                <Chevron />
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      {/* Submit Button */}
      <div className="shrink-0 px-3 py-3 md:px-0 md:pb-0 md:pt-3">
        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-[radial-gradient(circle_at_50%_0%,#effe17_0%,#d1fe17_55%)] px-6 text-sm font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,.43)] transition hover:brightness-90 active:brightness-75"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
