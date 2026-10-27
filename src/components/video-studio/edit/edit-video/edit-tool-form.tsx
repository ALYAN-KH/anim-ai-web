"use client";

import {
  useState,
  type FormEvent
} from "react";
import { AssetsPicker, type AssetsPickerTabId } from "../../assets/assets-picker";
import { OptionPopover } from "../../create/settings-popovers";
import { editModels } from "../../data";
import { ChangeButton } from "../../shared/change-button";
import { useToast } from "../../shared/tool-toast";
import { DrawToEditDialog } from "../draw/draw-to-edit-dialog";
import { EditModelPicker } from "../shared/edit-model-picker";
import { AtIcon, Chevron, DrawMethodIcon, ImageOutlineIcon, MusicOutlineIcon, PromptMethodIcon } from "../shared/form-icons";
import { REFERENCE_PICKER_TABS, VIDEO_PICKER_TABS } from "../shared/picker-tabs";
import { UploadCircle, VideoSourceArea, useVideoSource } from "../shared/video-source";

export { REFERENCE_PICKER_TABS, VIDEO_PICKER_TABS } from "../shared/picker-tabs";

export { AtIcon, Chevron, ImageOutlineIcon, MusicOutlineIcon } from "../shared/form-icons";

export { UploadCircle } from "../shared/video-source";

export const HERO_VIDEO =
  "https://static.higgsfield.ai/seedance-2.5/video-banner-general.mp4";

export interface EditToolFormProps {
  onChangeTool: () => void;
  onSignup?: () => void;
  selectedModelId: string;
  onModelChange: (id: string) => void;
}

export function EditToolForm({ onChangeTool, onSignup, selectedModelId, onModelChange }: EditToolFormProps) {
  const [method, setMethod] = useState<"prompt" | "draw">("prompt");
  const [drawMode, setDrawMode] = useState<"video" | "edit">("edit");
  const [drawOpen, setDrawOpen] = useState(false);
  const [modelPickerAnchor, setModelPickerAnchor] = useState<DOMRect | null>(null);
  const [prompt, setPrompt] = useState("");
  const { video: videoUpload, select: selectVideoFile, set: setVideo, clear: clearVideo } = useVideoSource();
  const [referenceName, setReferenceName] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [settingMenu, setSettingMenu] = useState<{ kind: "Quality" | "Bitrate"; anchor: DOMRect } | null>(null);
  const [quality, setQuality] = useState("1080p");
  const [bitrate, setBitrate] = useState("High");
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

  return (
    <>
      <form
        onSubmit={submit}
        className="flex min-h-0 flex-1 flex-col rounded-b-2xl bg-[#0f1113] p-2"
      >
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pt-3 [scrollbar-width:none] md:px-0 md:pt-0 [&::-webkit-scrollbar]:hidden">
          <figure className="group relative h-[130px] w-full shrink-0 select-none overflow-hidden rounded-xl">
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
                  {item === "prompt" ? (
                    <PromptMethodIcon />
                  ) : (
                    <DrawMethodIcon />
                  )}
                  {item}
                </button>
              ))}
            </div>

            <VideoSourceArea
              video={videoUpload}
              label="Add a video to edit"
              duration="Up to 30s"
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

            <button
              type="button"
              onClick={(e) => setModelPickerAnchor(e.currentTarget.getBoundingClientRect())}
              className="grid min-h-[54px] w-full grid-cols-[1fr_auto] items-center gap-2 rounded-xl bg-white/[.05] px-3 py-2 text-left hover:bg-white/[.08]"
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium leading-4 text-white/55">
                  Model
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-white">
                  {editModels.find((m) => m.id === selectedModelId)?.name ?? "Seedance 2.5 Edit"}
                </span>
              </span>
              <Chevron />
            </button>

            <fieldset className="grid grid-cols-2 gap-2">
              {(["Quality", "Bitrate"] as const).map(kind => <button key={kind} type="button" aria-label={kind} aria-haspopup="menu" aria-expanded={settingMenu?.kind === kind} onClick={event => setSettingMenu({ kind, anchor: event.currentTarget.getBoundingClientRect() })} className="flex h-[54px] items-center justify-between rounded-xl bg-white/[.05] px-3 text-left hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"><span><span className="block text-xs font-medium text-white/55">{kind}</span><span className="block text-sm font-semibold text-white">{kind === "Quality" ? quality : bitrate}</span></span><Chevron /></button>)}
            </fieldset>
          </div>
        </div>

        <div className="shrink-0 px-3 py-3 md:px-0 md:pb-0 md:pt-3">
          {toast}
          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-[radial-gradient(circle_at_50%_0%,#effe17_0%,#d1fe17_55%)] px-6 text-sm font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,.43)] transition hover:brightness-90 active:brightness-75"
          >
            Generate
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
      {settingMenu && <OptionPopover anchor={settingMenu.anchor} title={settingMenu.kind} options={settingMenu.kind === "Quality" ? ["480p", "720p", "1080p"] : ["Low", "Medium", "High"]} value={settingMenu.kind === "Quality" ? quality : bitrate} onSelect={settingMenu.kind === "Quality" ? setQuality : setBitrate} onClose={() => setSettingMenu(null)} />}
      {modelPickerAnchor && (
        <EditModelPicker
          anchor={modelPickerAnchor}
          selectedId={selectedModelId}
          onSelect={(m) => onModelChange(m.id)}
          onClose={() => setModelPickerAnchor(null)}
        />
      )}
      {drawOpen && (
        <DrawToEditDialog
          defaultTab={drawMode}
          onSignup={onSignup}
          onClose={() => {
            setDrawOpen(false);
            setMethod("prompt");
          }}
        />
      )}

    </>
  );
}
