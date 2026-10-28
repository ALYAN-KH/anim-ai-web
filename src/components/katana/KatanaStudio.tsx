"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { buildClaudeUrl } from "@/components/mcp/lib/chatgpt-url";
import { tablistKeys } from "@/components/playable/gallery";
import { BANNER_POSTER, BANNER_VIDEO, CONNECT_URL, HERO_POSTER, HERO_VIDEO, KATANA_PRESETS, type KatanaPreset } from "./data";
import { KatanaGallery } from "./gallery";
import { KatanaIcon, type KatanaIconName } from "./icons";
import { KatanaVideo } from "./KatanaVideo";
import { MediaPicker } from "./MediaPicker";
import { Instructions } from "./Instructions";
import { HowItWorks } from "./HowItWorks";
import { VideoSourceArea } from "@/components/video-studio/edit/shared/video-source";
import type { VideoSelection } from "@/components/video-studio/assets/preset-videos";
import { useKatanaMedia, type KatanaAsset } from "./useKatanaMedia";
import "./katana.css";

const PreviewDialog = dynamic(() => import("./PreviewDialog"), { ssr: false });

type View = "explore" | "how";
const VIEWS: View[] = ["explore", "how"];
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm";
const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
const DASHED = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect x='0.5' y='0.5' width='calc(100%25 - 1px)' height='calc(100%25 - 1px)' rx='8' ry='8' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1' stroke-dasharray='4 4'/%3E%3C/svg%3E")`;
const ORB_SHADOW = "rgba(0,0,0,0) 0px 128.852px 36.007px 0px, rgba(0,0,0,.01) 0px 82.429px 33.031px 0px, rgba(0,0,0,.05) 0px 46.422px 27.972px 0px, rgba(0,0,0,.09) 0px 20.533px 20.533px 0px, rgba(0,0,0,.1) 0px 5.059px 11.308px 0px, rgba(185,185,185,.35) 0px -0.298px 5.356px 0px inset";
const removeButton = "absolute right-1.5 top-1.5 z-20 grid size-6 place-items-center rounded-full bg-black/60 text-white outline-none hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white";

function Close() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3.5 rotate-45"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 5.25V12m0 0v6.75M12 12H5.25M12 12h6.75" /></svg>;
}

function DropZone({ icon, title, hint, onFiles, onBrowse, accept, multiple, children }: { icon: KatanaIconName; title: string; hint: string; onFiles: (files: FileList) => void; onBrowse: (anchor: DOMRect) => void; accept: string; multiple?: boolean; children?: ReactNode }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const drop = (event: DragEvent) => {
    event.preventDefault();
    setOver(false);
    if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files);
  };
  return <div className="relative flex flex-col gap-3 self-stretch rounded-xl bg-white/[.03] p-1">
    <div onDragOver={event => {
      event.preventDefault();
      setOver(true);
    }} onDragLeave={() => setOver(false)} onDrop={drop} className={`relative flex flex-col items-center justify-center gap-4 self-stretch overflow-hidden rounded-lg p-4 transition-colors md:gap-3 ${children ? "min-h-40" : "h-[11.25rem] md:h-40"} ${over ? "bg-white/5" : ""}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg" style={{ backgroundImage: DASHED }} />
      <input ref={input} type="file" accept={accept} multiple={multiple} className="hidden" onChange={event => {
        if (event.target.files?.length) onFiles(event.target.files);
        event.target.value = "";
      }} />
      {children || <>
        <button type="button" aria-label={title} aria-haspopup="dialog" onClick={event => onBrowse(event.currentTarget.getBoundingClientRect())} className="absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-1 focus-visible:ring-white/60" />
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[.04] text-white mix-blend-luminosity backdrop-blur-[2px]" style={{ boxShadow: ORB_SHADOW }}><KatanaIcon name={icon} className="size-4" /></span>
        <span className="pointer-events-none flex flex-col gap-1.5 text-center">
          <span className="text-sm font-semibold">{title}</span>
          <span className="text-xs text-white/50">{hint}</span>
        </span>
      </>}
      {children && <button type="button" onClick={event => onBrowse(event.currentTarget.getBoundingClientRect())} className="relative z-10 text-xs font-medium text-white/60 underline-offset-2 outline-none hover:text-white hover:underline focus-visible:ring-1 focus-visible:ring-white/60">{multiple ? "Add more" : "Replace"}</button>}
    </div>
  </div>;
}

export function KatanaStudio() {
  const [view, setView] = useState<View>("explore");
  const [preset, setPreset] = useState<KatanaPreset | null>(null);
  const [selection, setSelection] = useState<VideoSelection | null>(null);
  const [instructionsOn, setInstructionsOn] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [previewing, setPreviewing] = useState<KatanaPreset | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("preset");
    const shared = KATANA_PRESETS.find(item => item.id === id);
    if (shared) setPreviewing(shared);
  }, []);
  const attachments = useKatanaMedia();
  const [picker, setPicker] = useState<{ kind: "video" | "image"; anchor: DOMRect } | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("katana-liked-presets") ?? "[]");
      if (Array.isArray(stored)) setLikedIds(stored.filter((id): id is string => typeof id === "string"));
    } catch { /* Likes remain available for this visit. */ }
  }, []);
  const toggleLike = (id: string) => setLikedIds(current => {
    const next = current.includes(id) ? current.filter(value => value !== id) : [...current, id];
    try { localStorage.setItem("katana-liked-presets", JSON.stringify(next)); } catch { /* Session-only likes. */ }
    return next;
  });
  const closePicker = useCallback(() => setPicker(null), []);
  const returnFocus = useRef<HTMLElement | null>(null);
  const aside = useRef<HTMLElement>(null);
  const { reference, images, error } = attachments;
  const ready = Boolean(reference || preset?.video);
  const selectedVideo = preset?.video ? selection : reference ? { name: reference.name, url: reference.url } : null;
  const removeReference = () => { setPreset(null); setSelection(null); attachments.clearReference(); };
  const uploadReference = (files: FileList) => {
    const accepted = attachments.upload(files, "video");
    if (accepted) setPreset(null);
    return accepted;
  };
  const selectAsset = (asset: KatanaAsset) => {
    attachments.select(asset);
    if (asset.kind === "video") setPreset(null);
  };

  const recreate = useCallback((next: KatanaPreset, detail?: VideoSelection) => {
    attachments.clearReference();
    setPreset(next);
    setSelection(detail ?? (next.video ? { name: next.title, url: next.video, poster: next.poster ?? next.image } : null));
    if (matchMedia("(max-width: 767px)").matches) aside.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [attachments]);
  const openPreview = useCallback((next: KatanaPreset, trigger: HTMLElement | null) => {
    returnFocus.current = trigger;
    setPreviewing(next);
  }, []);
  const closePreview = useCallback(() => {
    setPreviewing(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);
  const closeAuth = useCallback(() => setAuthMode(null), []);

  const send = () => {
    if (!ready) return;
    const files = images.map(image => image.name);
    const brief = [
      "Use Higgsfield Katana to recreate this edit with my content. Match the reference's pacing, camera movement, transitions, color grade and effects.",
      preset ? `Reference preset: ${preset.title} — ${preset.video ?? preset.image}` : reference && `Reference video: I'll attach ${reference.name} in this chat.`,
      files.length > 0 && `My characters: I'll attach ${files.join(", ")} in this chat.`,
      instructionsOn && instructions.trim() && `Instructions: ${instructions.trim()}`,
    ].filter(Boolean).join("\n\n");
    window.open(buildClaudeUrl(brief), "_blank", "noopener,noreferrer");
  };

  const tab = (value: View, label: string, icon: KatanaIconName) => <button type="button" role="tab" id={`katana-tab-${value}`} aria-selected={view === value} aria-controls={`katana-panel-${value}`} tabIndex={view === value ? 0 : -1} onClick={() => setView(value)} className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-[11px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 md:h-8 md:gap-1.5 md:px-2.5 md:text-[13px] ${view === value ? "bg-white/10 text-white" : "text-white/55 hover:text-white"}`}>
    <KatanaIcon name={icon} className="size-3 md:size-4" />{label}
  </button>;

  return <div data-theme="default-dark" className="katana-root min-h-0 w-full flex-1 bg-[#0d0f10] text-white">
    <div className="katana-layout mx-auto flex w-full max-w-[1920px] flex-col gap-4 px-3 pb-4 pt-3 md:grid md:h-full md:grid-cols-[20rem_minmax(0,1fr)] md:overflow-hidden md:px-4">
      <aside ref={aside} aria-label="Create with Katana" className="flex min-h-0 shrink-0 flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#121314] md:max-h-full md:self-start">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <figure className="relative h-[8.8125rem] shrink-0 overflow-hidden rounded-xl border-2 border-white/10">
            <KatanaVideo src={BANNER_VIDEO} poster={BANNER_POSTER} label="Higgsfield Katana banner" className="size-full" />
            <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#121212]/90 from-[6.731%] to-[#121212]/0 to-[75.481%] p-2">
              <span className="-mb-0.5 whitespace-nowrap font-grotesk text-lg font-bold uppercase leading-6 tracking-[-0.0125rem] text-lime">Higgsfield Katana</span>
              <span className="text-xs text-white/60">Recreate edits with your content</span>
            </figcaption>
          </figure>

          <fieldset className="m-0 flex min-w-0 shrink-0 flex-col gap-2 border-0 p-0">
            {selectedVideo ? <div className="flex flex-col gap-1">
              <VideoSourceArea video={selectedVideo} label="Add a reference video" duration="Upload the edit you want to recreate"
                onOpen={anchor => setPicker({ kind: "video", anchor })} onRemove={removeReference} />
              <p className="truncate px-2 text-xs text-white/60">{selectedVideo.name}</p>
              <button type="button" onClick={event => setPicker({ kind: "video", anchor: event.currentTarget.getBoundingClientRect() })} className="self-center p-1 text-xs text-white/60 underline">Replace reference</button>
            </div> : <DropZone icon="video" title="Add a reference video" hint="Upload the edit you want to recreate" accept={VIDEO_ACCEPT} onBrowse={anchor => setPicker({ kind: "video", anchor })} onFiles={uploadReference} />}

            <DropZone icon="person" title="Add your characters" hint="Also you can add other details" accept={IMAGE_ACCEPT} multiple onBrowse={anchor => setPicker({ kind: "image", anchor })} onFiles={files => attachments.upload(files, "image")}>
              {images.length > 0 && <ul className="grid w-full grid-cols-3 gap-1.5">
                {images.map(image => <li key={image.url} className="relative aspect-square overflow-hidden rounded-lg bg-black">
                  <img src={image.url} alt={image.name} title={image.name} className="size-full object-cover" />
                  <button type="button" aria-label={`Remove ${image.name}`} onClick={() => attachments.removeImage(image.id)} className={removeButton.replace("size-6", "size-5")}><Close /></button>
                </li>)}
              </ul>}
            </DropZone>
            {error && <p role="alert" className="px-1 text-xs text-[#ff8a80]">{error}</p>}
            {attachments.storageNotice && <p role="status" className="px-1 text-xs text-white/50">{attachments.storageNotice}</p>}

            <Instructions enabled={instructionsOn} onToggle={() => setInstructionsOn(value => !value)} value={instructions} onChange={setInstructions} />
          </fieldset>
        </div>
        <div className="relative shrink-0 px-2 py-3">
          {(reference || images.length > 0) && <p className="mb-2 px-1 text-[11px] leading-4 text-white/50">Attach your uploaded files in Claude after opening the chat. Files aren’t transferred automatically.</p>}
          <button type="button" disabled={!ready} onClick={send} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black outline-none transition hover:brightness-90 focus-visible:ring-2 focus-visible:ring-lime disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-black/60 disabled:hover:brightness-100">
            <KatanaIcon name="claude" className="size-5 text-[#d97757]" /><span>Send &amp; Generate in Claude</span>
          </button>
        </div>
      </aside>

      <section aria-label="Katana workspace" className="relative isolate flex min-h-[70svh] flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0d0f10] md:min-h-0">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(circle, rgb(25,27,29) 1px, transparent 1px), radial-gradient(circle, rgb(25,27,29) 1px, transparent 1px)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px, 20px 20px", maskImage: "linear-gradient(to right, #000 78%, transparent 100%), linear-gradient(to top, #000 60%, transparent 100%)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 p-2 md:flex-nowrap md:gap-3 md:p-3">
          <div role="tablist" aria-label="Page view" onKeyDown={tablistKeys(VIEWS, view, setView)} className="flex min-w-0 max-w-full gap-1 overflow-x-auto">
            {tab("explore", "Explore", "explore")}
            {tab("how", "How it works", "howItWorks")}
          </div>
          <button type="button" onClick={() => setAuthMode("signup")} className="inline-flex h-7 shrink-0 items-center gap-1 rounded-lg bg-white/5 px-2 text-[10px] font-medium text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 md:gap-1.5 md:px-2.5 md:text-xs"><KatanaIcon name="publish" className="size-3 md:size-4" />Publish preset</button>
        </div>

        <div id={`katana-panel-${view}`} role="tabpanel" aria-labelledby={`katana-tab-${view}`} className="min-h-0 flex-1 overflow-y-auto">
          {view === "explore" ? <div className="pb-6">
            <header className="flex flex-col-reverse items-start gap-6 px-6 pb-12 pt-6 md:flex-row md:items-center md:gap-8">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
                <p className="flex items-center gap-1 text-xs text-[#d97757]">Powered by<KatanaIcon name="claude" className="size-4" /> Claude Motion</p>
                <div className="flex flex-col gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold uppercase leading-7 md:text-[28px] md:leading-8">Recreate the edit. Make it yours.</h1>
                  <p className="max-w-96 text-xs leading-4 text-white/50">Turn a reference video into a full edit with your own characters, products, or scenes. Create more variations directly in Claude</p>
                </div>
                <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-white px-2.5 text-xs font-semibold text-black outline-none hover:brightness-90 focus-visible:ring-2 focus-visible:ring-lime"><KatanaIcon name="claude" className="size-4 text-[#d97757]" />Install Higgsfield in Claude</a>
              </div>
              <figure className="aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-white/5 md:w-[30rem] md:max-w-[48%]">
                <KatanaVideo src={HERO_VIDEO} poster={HERO_POSTER} label="Katana motion recreation example" className="size-full" />
              </figure>
            </header>
            <KatanaGallery selectedId={preset?.id ?? null} likedIds={likedIds} onLike={toggleLike} onReport={() => setAuthMode("login")} onOpen={openPreview} onRecreate={recreate} />
          </div> : <HowItWorks onContinue={() => setView("explore")} />}
        </div>
      </section>
    </div>

    {previewing && <PreviewDialog preset={previewing} onClose={closePreview} onRecreate={recreate} />}
    {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
    {picker && <MediaPicker error={error} kind={picker.kind} anchor={picker.anchor} assets={attachments.assets} likedIds={likedIds} onSelect={selectAsset} onPreset={recreate} onUpload={files => picker.kind === "video" ? uploadReference(files) : attachments.upload(files, "image")} onClose={closePicker} />}
  </div>;
}
