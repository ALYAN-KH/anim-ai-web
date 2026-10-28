"use client";

import { useEffect, useRef, useState, type Dispatch, type ReactNode } from "react";
import { AssetsPicker, type AssetsPickerTabId } from "@/components/video-studio/assets/assets-picker";
import { OptionPopover } from "@/components/video-studio/create/settings-popovers";
import { FEATURED_MODELS, MODEL_GROUPS } from "@/components/video-studio/models/model-data";
import { ModelPicker } from "@/components/video-studio/models/model-picker";
import { GENJUTSU_PREVIEW, QUALITIES, type MotionMode, type Quality } from "./data";
import { Icon } from "./Icon";
import { Segmented } from "./Sidebar";
import { MotionDrop } from "./UploadTile";
import type { Uploads } from "./uploads";
import type { StudioAction, StudioState } from "./useStudio";

const PROMPT_PLACEHOLDER = "Describe your new scene — e.g. 'the character from @image1 dancing on a rooftop' or 'same moves, new location: Tokyo at night'. Mention attached images or videos using @...";

const VIDEO_TABS: readonly AssetsPickerTabId[] = ["uploads", "videos"];
const IMAGE_TABS: readonly AssetsPickerTabId[] = ["uploads", "influencer", "images"];
// AI Influencer motion runs on Genjutsu, so the shared picker is limited to that family.
const GENJUTSU_GROUPS = MODEL_GROUPS.filter((g) => g.id === "genjutsu");
const GENJUTSU_FEATURED = FEATURED_MODELS.filter((m) => m.icon === "genjutsu");

/** Setting row (Model / Quality) styled like the reference; opens the shared Genjutsu popovers. */
function SettingRow({ label, value, trailing, onOpen, open }: { label: string; value: string; trailing?: ReactNode; onOpen: (anchor: DOMRect) => void; open: boolean }) {
  return (
    <button type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())} className="flex h-[54px] w-full items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 text-left transition-colors duration-150 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-lime">
      <span className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-xs font-medium leading-4 text-[#898a8b]">{label}</span>
        <span className="flex min-w-0 items-center gap-1 text-sm font-medium leading-4 text-white"><span className="truncate">{value}</span>{trailing}</span>
      </span>
      <Icon name="settingChevron" className="size-4 text-[#898a8b] [transform:rotate(-90deg)]" />
    </button>
  );
}

type Props = {
  state: StudioState;
  dispatch: Dispatch<StudioAction>;
  video: Uploads;
  images: Uploads;
  invalid: { video?: boolean };
  onBrowsePresets: () => void;
};

export function MotionPanel({ state, dispatch, video, images, invalid, onBrowsePresets }: Props) {
  const motion = state.motion;
  const set = (patch: Partial<StudioState["motion"]>) => dispatch({ type: "motion", patch });
  const banner = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) banner.current?.play().catch(() => undefined);
  }, []);
  const presetVideo = motion.presetVideo && !video.files.length ? [motion.presetVideo] : [];
  const [picker, setPicker] = useState<{ kind: "video" | "images"; anchor: DOMRect } | null>(null);
  const [modelAnchor, setModelAnchor] = useState<DOMRect | null>(null);
  const [qualityAnchor, setQualityAnchor] = useState<DOMRect | null>(null);

  // Files from the shared picker go through the same validation as drag-and-drop.
  const filesSelected = (files: FileList) => {
    if (picker?.kind === "video") {
      void video.add(files, true);
      set({ presetVideo: undefined });
    } else void images.add(files);
    setPicker(null);
  };

  return (
    <form className="flex min-w-0 flex-col gap-4 p-2" onSubmit={(e) => e.preventDefault()}>
      <figure className="group relative h-[130px] w-full select-none overflow-hidden rounded-xl">
        <video ref={banner} src={GENJUTSU_PREVIEW} loop muted playsInline preload="metadata" className="size-full rounded-md object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%)" }} />
        <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
          <p className="w-full truncate font-grotesk text-[18px] font-bold uppercase leading-6 text-lime">Higgsfield Genjutsu</p>
          <p className="text-xs text-white/80">Reality manipulation</p>
        </figcaption>
      </figure>
      <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
        <Segmented<MotionMode> label="Motion mode" size="lg" value={motion.mode} onChange={(mode) => set({ mode })} options={[{ id: "transfer", label: "Motion transfer", icon: "modeMotion" }, { id: "swap", label: "Objects swap", icon: "modeSwap" }]} />
        <div className="relative mt-2 flex flex-col gap-2">
          <MotionDrop
            uploads={video}
            kind="video"
            label="Add a reference video to extract motion"
            title={<>Add a reference video<br />to extract motion</>}
            hint="Video duration: 4 to 30 seconds"
            badges={["badgeVideo"]}
            preset={presetVideo}
            onClearPreset={() => set({ presetVideo: undefined })}
            invalid={invalid.video}
            onOpen={(anchor) => setPicker({ kind: "video", anchor })}
            extra={<button type="button" onClick={onBrowsePresets} className="relative z-20 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-semibold text-white md:hidden"><Icon name="selectPresets" className="size-4" />Select from presets</button>}
          />
          <MotionDrop
            uploads={images}
            kind="image"
            multiple
            label="Add reference images"
            title={<>Add your characters,<br />products, or clothes</>}
            hint="Up to 30 images"
            badges={["badgeHead", "badgeFashion", "badgeBox"]}
            preset={motion.presetImages}
            onClearPreset={() => set({ presetImages: [] })}
            onOpen={(anchor) => setPicker({ kind: "images", anchor })}
          />
          <fieldset aria-label="Video model" className="m-0 min-w-0 border-0 p-0">
            <SettingRow
              label="Model"
              value={motion.model}
              open={Boolean(modelAnchor)}
              onOpen={setModelAnchor}
              trailing={<><Icon name="genjutsuMark" className="size-4 text-lime" /><span className="rounded-sm border border-lime/10 bg-lime/10 px-1 text-xs font-medium text-lime">New</span></>}
            />
          </fieldset>
          <div className="flex flex-col self-stretch overflow-hidden rounded-xl">
            <div className="flex h-11 items-center justify-between gap-2 self-stretch bg-white/5 px-3">
              <span className="text-sm font-medium text-white">Prompt</span>
              <button type="button" role="switch" aria-checked={motion.promptOn} aria-label="Toggle prompt" onClick={() => set({ promptOn: !motion.promptOn })} className={`relative h-4 w-7 rounded-full transition-colors ${motion.promptOn ? "bg-lime" : "bg-white/20"}`}>
                <span className={`absolute top-0.5 size-3 rounded-full transition-[left] ${motion.promptOn ? "left-[14px] bg-[#1a1a1a]" : "left-0.5 bg-white"}`} />
              </button>
            </div>
            <div className={`grid w-full transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${motion.promptOn ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="min-h-0 overflow-hidden" aria-hidden={!motion.promptOn}>
                <div aria-hidden="true" className="h-px w-full" />
                <textarea
                  aria-label="Prompt"
                  tabIndex={motion.promptOn ? 0 : -1}
                  value={motion.prompt}
                  onChange={(e) => set({ prompt: e.target.value })}
                  placeholder={PROMPT_PLACEHOLDER}
                  className="block h-40 w-full resize-none rounded-b-xl border-0 bg-white/5 p-3 text-sm leading-5 text-white outline-none placeholder:text-[#898a8b] [scrollbar-width:none]"
                />
              </div>
            </div>
          </div>
          <SettingRow label="Quality" value={motion.quality} open={Boolean(qualityAnchor)} onOpen={setQualityAnchor} />
        </div>
      </fieldset>
      {picker && (
        <AssetsPicker
          motionUploadStyle
          anchor={picker.anchor}
          onClose={() => setPicker(null)}
          tabs={picker.kind === "video" ? VIDEO_TABS : IMAGE_TABS}
          accept={picker.kind === "video" ? "video/mp4,video/quicktime,video/webm" : "image/jpeg,image/png,image/webp"}
          multiple={picker.kind === "images"}
          onFilesSelected={filesSelected}
          onPresetSelected={(selection) => { video.clear(); set({ presetVideo: { url: selection.url, thumb: selection.poster, title: selection.name } }); setPicker(null); }}
        />
      )}
      {modelAnchor && <ModelPicker anchor={modelAnchor} selected={motion.model} groups={GENJUTSU_GROUPS} featured={GENJUTSU_FEATURED} onSelect={(model) => { set({ model }); setModelAnchor(null); }} onClose={() => setModelAnchor(null)} />}
      {qualityAnchor && <OptionPopover<Quality> anchor={qualityAnchor} title="Quality" value={motion.quality} options={[...QUALITIES]} onSelect={(quality) => set({ quality })} onClose={() => setQualityAnchor(null)} />}
    </form>
  );
}
