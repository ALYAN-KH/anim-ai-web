"use client";

import { ChevronDown, Expand, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AssetsPicker, type AssetsPickerTabId } from "../assets/assets-picker";
import { type GeneratorPanelProps } from "../create/generator-panel";
import { GenerateSparkle } from "../create/panel-icons";
import { OptionPopover } from "../create/settings-popovers";
import { videoTabs } from "../data";
import { Chevron } from "../edit/shared/form-icons";
import { UploadCircle, VideoSourceArea, useVideoSource } from "../edit/shared/video-source";
import { ModelPicker } from "../models/model-picker";
import { MODEL_ICONS } from "../models/model-icons";
import { BookIcon } from "../shared/icons";
import { useToast } from "../shared/tool-toast";
import { MOTION_FEATURED, MOTION_GROUPS, MOTION_MODELS, motionModelSlug } from "./motion-models";
import { CharacterPreview, SceneControlNotice, SceneSettings, SourceTabs, type SceneSource } from "./scene-settings";

const CHARACTER_TABS: readonly AssetsPickerTabId[] = ["uploads", "influencer", "images"];
const MOTION_VIDEO_TABS: readonly AssetsPickerTabId[] = ["uploads", "videos"];
const FIELD_CLASS = "flex min-h-[50px] w-full items-center justify-between rounded-xl border border-white/[.04] bg-white/[.05] px-3 py-1.5 text-left hover:bg-white/[.08]";

type MotionControlPanelProps = GeneratorPanelProps & { motionVideoSource?: ReturnType<typeof useVideoSource> };

export function MotionControlPanel({ onTabChange, onGenerate, onModelChange, onHowItWorks, motionVideoSource }: MotionControlPanelProps) {
  const localVideoSource = useVideoSource();
  const { video, select, set: setVideo, clear } = motionVideoSource ?? localVideoSource;
  const { showToast, toast } = useToast();
  const [character, setCharacter] = useState<{ name: string; url: string } | null>(null);
  const [characterPreview, setCharacterPreview] = useState(false);
  const [model, setModel] = useState(MOTION_MODELS[0].name);
  const [quality, setQuality] = useState("720p");
  const [sceneEnabled, setSceneEnabled] = useState(true);
  const [sceneSource, setSceneSource] = useState<SceneSource>("Video");
  const [orientation, setOrientation] = useState<SceneSource>("Video");
  const [advanced, setAdvanced] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [lockedAnchor, setLockedAnchor] = useState<DOMRect | null>(null);
  const [modelAnchor, setModelAnchor] = useState<DOMRect | null>(null);
  const [qualityAnchor, setQualityAnchor] = useState<DOMRect | null>(null);
  const [picker, setPicker] = useState<{ kind: "video" | "character"; anchor: DOMRect } | null>(null);

  useEffect(() => {
    const sync = () => setModel(new URLSearchParams(window.location.search).get("model") === "kling-motion-control" ? MOTION_MODELS[1].name : MOTION_MODELS[0].name);
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => () => { if (character?.url.startsWith("blob:")) URL.revokeObjectURL(character.url); }, [character?.url]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setCharacterPreview(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const chooseModel = (name: string) => {
    if (!MOTION_MODELS.some(option => option.name === name)) {
      onModelChange?.(name);
      onTabChange(name.includes("Edit") ? "edit" : "create");
      return;
    }
    setModel(name);
    const url = new URL(window.location.href);
    url.searchParams.set("model", motionModelSlug(name));
    window.history.replaceState(null, "", url);
  };
  const filesSelected = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    if (picker?.kind === "video") {
      if (!file.type.startsWith("video/")) { showToast("Please choose a video file"); return; }
      select(files);
    } else {
      if (!file.type.startsWith("image/")) { showToast("Please choose a character image"); return; }
      setCharacter({ name: file.name, url: URL.createObjectURL(file) });
    }
    setPicker(null);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!video) { showToast("Video is required"); return; }
    onGenerate();
  };

  return <aside className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-[#0f1113] text-white">
    <nav className="flex shrink-0 gap-3 overflow-x-auto px-4 pt-1 [scrollbar-width:none]">{videoTabs.map(tab => <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} className={`h-11 shrink-0 whitespace-nowrap border-b-2 text-[14px] font-medium transition ${tab.id === "motion" ? "border-white text-white" : "border-transparent text-white/55 hover:text-white"}`}>{tab.label}</button>)}</nav>
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col p-4 pt-2">
      <div className="hide-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pb-4">
        <figure data-selected-option={motionModelSlug(model)} className="relative mb-3 h-[130px] w-full shrink-0 overflow-hidden rounded-xl">
          <video src="https://static.higgsfield.ai/v2-fnf-web-kmc-preset.mp4" poster="https://static.higgsfield.ai/v2-fnf-web-kmc-preset.webp" autoPlay muted loop playsInline disablePictureInPicture className="pointer-events-none absolute inset-0 size-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button type="button" onClick={onHowItWorks} className="absolute right-3 top-3 flex h-6 items-center gap-1 rounded-lg border border-white/10 bg-black/60 px-2 text-xs font-medium backdrop-blur-sm transition hover:bg-lime hover:text-black"><BookIcon className="size-3.5" />How it works</button>
          <figcaption className="absolute inset-x-3 bottom-3"><h2 className="font-grotesk text-[18px] font-bold uppercase leading-tight text-lime">Motion Control</h2><p className="truncate text-xs text-white/65">Control motion with video references</p></figcaption>
        </figure>

        <div className="flex flex-col gap-2">
          <VideoSourceArea emphasizeLabel video={video} label="Add motion to copy" duration="Video duration: 3–30 seconds" onOpen={anchor => setPicker({ kind: "video", anchor })} onRemove={clear} />
          <div className="group relative flex h-40 flex-col items-center justify-center rounded-xl bg-white/[.05] text-center">
            {!character && <span aria-hidden="true" className="pointer-events-none absolute inset-1 rounded-lg border border-dashed border-white/10" />}
            {character ? <>
              <img src={character.url} alt={character.name} className="absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-xl object-cover" />
              <button type="button" aria-label="Preview character" onClick={() => setCharacterPreview(true)} className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"><span className="rounded-full bg-white/15 p-1.5 backdrop-blur-sm"><Expand className="size-3.5" /></span></button>
              <button type="button" aria-label="Remove character" onClick={() => setCharacter(null)} className="absolute right-1 top-1 grid size-6 place-items-center rounded-lg bg-white/15 opacity-0 backdrop-blur-sm group-hover:opacity-100 group-focus-within:opacity-100"><X className="size-4" /></button>
            </> : <button type="button" onClick={event => setPicker({ kind: "character", anchor: event.currentTarget.getBoundingClientRect() })} className="flex size-full flex-col items-center justify-center gap-2 px-2"><UploadCircle><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M4 21a2 2 0 0 1-2-2c0-4 3-7 6-7l4 4 4-4c3 0 6 3 6 7a2 2 0 0 1-2 2H4Z" /></svg></UploadCircle><span className="text-sm font-semibold">Add your character</span><span className="whitespace-pre-line text-xs leading-[18px] text-white/45">Image with visible face and body</span></button>}
          </div>
        </div>

        <button type="button" aria-label="Model" aria-haspopup="menu" aria-expanded={Boolean(modelAnchor)} onClick={event => setModelAnchor(event.currentTarget.getBoundingClientRect())} className={FIELD_CLASS}><span className="min-w-0"><span className="block text-xs text-white/55">Model</span><span className="flex items-center gap-1 text-sm font-medium"><span className="truncate">{model}</span><span className="shrink-0 text-lime">{MODEL_ICONS.kling({ className: "size-4" })}</span></span></span><Chevron /></button>
        <button type="button" aria-label="Quality" aria-haspopup="menu" aria-expanded={Boolean(qualityAnchor)} onClick={event => setQualityAnchor(event.currentTarget.getBoundingClientRect())} className={FIELD_CLASS}><span><span className="block text-xs text-white/55">Quality</span><span className="text-sm font-medium">{quality}</span></span><Chevron /></button>
        <SceneSettings enabled={sceneEnabled} onToggle={() => { setSceneEnabled(value => !value); setLockedAnchor(null); }} source={sceneSource} onSourceChange={setSceneSource} />

        <div className="pb-2 pt-4"><button type="button" aria-expanded={advanced} aria-controls="motion-advanced-settings" onMouseEnter={event => { if (sceneEnabled) setLockedAnchor(event.currentTarget.getBoundingClientRect()); }} onFocus={event => { if (sceneEnabled) setLockedAnchor(event.currentTarget.getBoundingClientRect()); }} onClick={() => setAdvanced(value => !value)} className="flex w-full items-center justify-between py-2 text-sm font-semibold">Advanced settings<ChevronDown className={`size-3 transition-transform ${advanced ? "rotate-180" : ""}`} /></button>
          {advanced && <div id="motion-advanced-settings" className="space-y-3 pt-2">
            <div className="relative rounded-xl border border-white/[.06] bg-white/[.05] p-3"><label htmlFor="motion-prompt" className="block text-xs text-white/50">Prompt</label><textarea id="motion-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} readOnly={sceneEnabled} placeholder={'Describe background and scene details — e.g., "A corgi runs in" or "Snowy park setting". Motion is controlled by your reference video'} className={`mt-2 h-[138px] w-full resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-white/45 ${sceneEnabled ? "text-white/45" : "text-white"}`} />{sceneEnabled && <button type="button" aria-label="Unlock prompt settings" onClick={event => setLockedAnchor(event.currentTarget.getBoundingClientRect())} className="absolute inset-0 rounded-xl" />}</div>
            <div className="relative space-y-2"><p className="text-xs text-white/50">Orientation</p><SourceTabs value={orientation} onChange={setOrientation} disabled={sceneEnabled} /><p className="text-xs leading-[18px] text-white/45">When Character Orientation matches the video, complex motions perform better; when it matches the image, camera movements are better supported.</p>{sceneEnabled && <button type="button" aria-label="Unlock orientation settings" onClick={event => setLockedAnchor(event.currentTarget.getBoundingClientRect())} className="absolute inset-0 rounded-xl" />}</div>
          </div>}
        </div>
      </div>
      <div className="shrink-0 pt-3"><button type="submit" className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[radial-gradient(circle_at_50%_0%,#effe17_0%,#d1fe17_55%)] text-base font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,.43)] transition hover:brightness-90 active:brightness-75">Generate<span className="flex items-center gap-1"><GenerateSparkle />21</span></button></div>
    </form>
    {toast}
    {picker && <AssetsPicker motionUploadStyle anchor={picker.anchor} onClose={() => setPicker(null)} tabs={picker.kind === "video" ? MOTION_VIDEO_TABS : CHARACTER_TABS} accept={picker.kind === "video" ? "video/*" : "image/jpeg,image/png,image/webp"} multiple={false} onFilesSelected={filesSelected} onPresetSelected={selection => { setVideo(selection); setPicker(null); }} />}
    {modelAnchor && <ModelPicker anchor={modelAnchor} selected={model} onSelect={chooseModel} onClose={() => setModelAnchor(null)} groups={MOTION_GROUPS} featured={MOTION_FEATURED} />}
    {qualityAnchor && <OptionPopover anchor={qualityAnchor} title="Quality" value={quality} options={["720p", "1080p"]} onSelect={setQuality} onClose={() => setQualityAnchor(null)} />}
    {sceneEnabled && lockedAnchor && <SceneControlNotice anchor={lockedAnchor} onClose={() => setLockedAnchor(null)} onTurnOff={() => { setSceneEnabled(false); setLockedAnchor(null); }} />}
    {characterPreview && character && <CharacterPreview url={character.url} onClose={() => setCharacterPreview(false)} />}
  </aside>;
}
