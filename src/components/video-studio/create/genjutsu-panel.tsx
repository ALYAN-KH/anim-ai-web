"use client";

import { X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AssetsPicker, type AssetsPickerTabId } from "../assets/assets-picker";
import type { GenjutsuMode } from "../assets/genjutsu-library";
import type { VideoSelection } from "../assets/preset-videos";
import { videoTabs } from "../data";
import { Chevron } from "../edit/shared/form-icons";
import { UploadCircle, VideoSourceArea } from "../edit/shared/video-source";
import { MODEL_ICONS } from "../models/model-icons";
import { ModelPicker } from "../models/model-picker";
import { getPresets } from "../models/preset-browser";
import { ChangeButton } from "../shared/change-button";
import { ToggleTrack } from "../shared/toggle-track";
import { useToast } from "../shared/tool-toast";
import type { GeneratorPanelProps } from "./generator-panel";
import { GenerateSparkle } from "./panel-icons";
import { OptionPopover } from "./settings-popovers";

export const GENJUTSU_MODEL = "Higgsfield Genjutsu";
const MAX_IMAGES = 30;
const VIDEO_TABS: readonly AssetsPickerTabId[] = ["uploads", "videos"];
const IMAGE_TABS: readonly AssetsPickerTabId[] = ["uploads", "influencer", "images"];
const FIELD_CLASS = "flex min-h-[50px] w-full items-center justify-between rounded-xl border border-white/[.04] bg-white/[.05] px-3 py-1.5 text-left hover:bg-white/[.08]";

export const MotionTransferIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path stroke="currentColor" strokeWidth="1.5" d="M15 19.25a7.25 7.25 0 1 0 0-14.5 7.25 7.25 0 0 0 0 14.5Z" />
    <path stroke="currentColor" strokeDasharray="0.01 2.5" strokeLinecap="round" strokeWidth="1.5" d="M9 19.25a7.25 7.25 0 1 0 0-14.5 7.25 7.25 0 0 0 0 14.5Z" />
  </svg>
);
export const ObjectsSwapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.25 8.75h2a1 1 0 0 1 1 1v2m-6.5-3h-5a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h10.5a1 1 0 0 0 1-1v-5m-6.5-11.5a1 1 0 0 1 1-1h10.5a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1H9.75a1 1 0 0 1-1-1z" />
  </svg>
);

const MODES: { id: GenjutsuMode; label: string; icon: ReactNode }[] = [
  { id: "motion", label: "Motion transfer", icon: <MotionTransferIcon /> },
  { id: "swap", label: "Objects swap", icon: <ObjectsSwapIcon /> },
];

const glyph = (path: ReactNode) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{path}</svg>;
const SUBJECT_ICONS = [
  glyph(<><circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3-6 7-6s7 2 7 6z" /></>),
  glyph(<path d="M8 3 2 6l2 5 3-1v11h10V10l3 1 2-5-6-3c-.5 1.7-2 2.5-4 2.5S8.5 4.7 8 3Z" />),
  glyph(<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 2.3L5.5 8 12 11.7 18.5 8 12 4.3Z" />),
];

export type GenjutsuPanelProps = GeneratorPanelProps & {
  mode: GenjutsuMode;
  onModeChange: (mode: GenjutsuMode) => void;
  video: VideoSelection | null;
  onVideoChange: (video: VideoSelection | null) => void;
};

export function GenjutsuPanel({ tab, onTabChange, onGenerate, onModelChange, onOpenPresets, mode, onModeChange, video, onVideoChange }: GenjutsuPanelProps) {
  const { showToast, toast } = useToast();
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [promptOn, setPromptOn] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [picker, setPicker] = useState<{ kind: "video" | "images"; anchor: DOMRect } | null>(null);
  const [modelAnchor, setModelAnchor] = useState<DOMRect | null>(null);
  const [qualityAnchor, setQualityAnchor] = useState<DOMRect | null>(null);

  useEffect(() => () => { if (video?.url.startsWith("blob:")) URL.revokeObjectURL(video.url); }, [video]);

  const filesSelected = (files: FileList) => {
    if (picker?.kind === "video") {
      const file = files[0];
      if (!file || !file.type.startsWith("video/")) { showToast("Please choose a video file"); return; }
      onVideoChange({ name: file.name, url: URL.createObjectURL(file) });
    } else {
      const next = Array.from(files).filter(file => file.type.startsWith("image/")).slice(0, MAX_IMAGES - images.length);
      if (!next.length) { showToast("Please choose image files"); return; }
      setImages(current => [...current, ...next.map(file => ({ name: file.name, url: URL.createObjectURL(file) }))]);
    }
    setPicker(null);
  };
  const removeImage = (url: string) => {
    URL.revokeObjectURL(url);
    setImages(current => current.filter(image => image.url !== url));
  };
  const chooseModel = (name: string) => {
    setModelAnchor(null);
    onModelChange?.(name);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!video) { showToast("Reference video is required"); return; }
    onGenerate();
  };

  return <aside className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-[#0f1113] text-white lg:h-full">
    <nav className="flex shrink-0 gap-3 overflow-x-auto px-4 pt-3 [scrollbar-width:none]">{videoTabs.map(item => <button key={item.id} type="button" onClick={() => onTabChange(item.id)} className={`h-9 shrink-0 whitespace-nowrap border-b-2 text-[14px] font-medium transition ${tab === item.id ? "border-white text-white" : "border-transparent text-white/55 hover:text-white"}`}>{item.label}</button>)}</nav>
    <form data-genjutsu-form="true" onSubmit={submit} className="relative flex min-h-0 flex-1 flex-col">
      <div className="hide-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
        <figure className="relative h-32.5 w-full shrink-0 overflow-hidden rounded-xl">
          <video src={getPresets(GENJUTSU_MODEL)[0].video} autoPlay muted loop playsInline disablePictureInPicture preload="none" className="pointer-events-none absolute inset-0 size-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_50%)]" />
          <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5"><p className="w-full truncate font-grotesk text-brand-h-xxs-bold uppercase text-font-brand">Higgsfield Genjutsu</p><p className="text-xs text-white/80">Reality manipulation</p></figcaption>
          <div className="absolute right-1.5 top-1.5 z-20"><ChangeButton onClick={() => onOpenPresets?.()} /></div>
        </figure>

        <div role="tablist" aria-label="Genjutsu mode" className="grid h-10 grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {MODES.map(item => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} onClick={() => onModeChange(item.id)} className={`flex items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold transition ${mode === item.id ? "border border-white/10 bg-white/10 text-white" : "border border-transparent text-white/50 hover:text-white"}`}>{item.icon}{item.label}</button>)}
        </div>

        <VideoSourceArea emphasizeLabel wrapLabel accent video={video} label="Add a reference video to extract motion" duration="Video duration: 4 to 30 seconds" onOpen={anchor => setPicker({ kind: "video", anchor })} onRemove={() => onVideoChange(null)} />

        <div className="relative flex min-h-40 flex-col items-center justify-center rounded-xl bg-white/[.05] p-3 text-center">
          <span aria-hidden="true" className="pointer-events-none absolute inset-1 rounded-lg border border-dashed border-white/10" />
          {images.length > 0 && <ul className="relative z-10 mb-2 flex flex-wrap justify-center gap-1.5">{images.map(image => <li key={image.url} className="group relative size-12 overflow-hidden rounded-lg"><img src={image.url} alt={image.name} className="size-full object-cover" /><button type="button" aria-label={`Remove ${image.name}`} onClick={() => removeImage(image.url)} className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"><X className="size-4" /></button></li>)}</ul>}
          <button type="button" disabled={images.length >= MAX_IMAGES} onClick={event => setPicker({ kind: "images", anchor: event.currentTarget.getBoundingClientRect() })} className="relative z-10 flex flex-col items-center gap-2 px-2 py-3">
            <span className="flex -space-x-2">{SUBJECT_ICONS.map((icon, index) => <UploadCircle key={index}>{icon}</UploadCircle>)}</span>
            <span className="text-sm font-semibold leading-5">Add your characters,<br />products, or clothes</span>
            <span className="text-xs text-white/45">Up to {MAX_IMAGES} images</span>
          </button>
        </div>

        <div className={`rounded-xl border border-white/[.04] bg-white/[.05] ${promptOn ? "p-3" : ""}`}>
          <label className={`flex cursor-pointer items-center justify-between text-sm font-medium ${promptOn ? "" : "min-h-[50px] px-3"}`}>Prompt<input type="checkbox" role="switch" className="sr-only" checked={promptOn} onChange={event => setPromptOn(event.target.checked)} /><ToggleTrack checked={promptOn} size="medium" /></label>
          {promptOn && <textarea aria-label="Prompt" value={prompt} onChange={event => setPrompt(event.target.value)} rows={4} placeholder="Describe how the scene should change" className="mt-2 w-full resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-white/45" />}
        </div>

        <button type="button" aria-label="Model" aria-haspopup="menu" aria-expanded={Boolean(modelAnchor)} onClick={event => setModelAnchor(event.currentTarget.getBoundingClientRect())} className={FIELD_CLASS}><span className="min-w-0"><span className="block text-xs text-white/55">Model</span><span className="flex items-center gap-1.5 text-sm font-medium"><span className="truncate">{GENJUTSU_MODEL}</span><span className="shrink-0 text-lime">{MODEL_ICONS.genjutsu({ className: "size-4" })}</span><span className="rounded-md bg-lime/15 px-1.5 text-xs font-semibold text-lime">New</span></span></span><Chevron /></button>
        <button type="button" aria-label="Quality" aria-haspopup="menu" aria-expanded={Boolean(qualityAnchor)} onClick={event => setQualityAnchor(event.currentTarget.getBoundingClientRect())} className={FIELD_CLASS}><span><span className="block text-xs text-white/55">Quality</span><span className="text-sm font-medium">{quality}</span></span><Chevron /></button>
      </div>
      <div className="shrink-0 px-2 pb-3"><button type="submit" className="relative inline-grid h-12 w-full grid-flow-col items-center justify-center gap-2 rounded-xl border-none bg-btn-accent-bg bg-radial from-[#EFFE17] from-40% to-btn-accent-bg px-6 pb-0.5 text-sm font-semibold text-btn-accent-text shadow-[inset_0px_-3px_rgba(0,0,0,0.43)] transition hover:opacity-80 active:scale-97 active:opacity-60">Generate<span className="flex items-center gap-1"><GenerateSparkle />{quality === "1080p" ? 45 : 30}</span></button></div>
    </form>
    {toast}
    {picker && <AssetsPicker motionUploadStyle anchor={picker.anchor} onClose={() => setPicker(null)} tabs={picker.kind === "video" ? VIDEO_TABS : IMAGE_TABS} accept={picker.kind === "video" ? "video/*" : "image/jpeg,image/png,image/webp"} multiple={picker.kind === "images"} onFilesSelected={filesSelected} onPresetSelected={selection => { onVideoChange(selection); setPicker(null); }} />}
    {modelAnchor && <ModelPicker anchor={modelAnchor} selected={GENJUTSU_MODEL} onSelect={chooseModel} onClose={() => setModelAnchor(null)} />}
    {qualityAnchor && <OptionPopover anchor={qualityAnchor} title="Quality" value={quality} options={["720p", "1080p"]} onSelect={setQuality} onClose={() => setQualityAnchor(null)} />}
  </aside>;
}
