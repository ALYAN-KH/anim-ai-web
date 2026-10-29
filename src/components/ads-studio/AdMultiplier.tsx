"use client";

import { useRouter } from "next/navigation";
import refinements from "./ads-refinements.module.css";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { AssetsPicker } from "@/components/video-studio/assets/assets-picker";
import type { VideoSelection } from "@/components/video-studio/assets/preset-videos";
import { TOOLS } from "./data";

const S = "https://static.higgsfield.ai/ads-studio/ad-multiplier";
const BOOK_ICON = "M12 7.75C12 6.09315 13.3431 4.75 15 4.75H21.25C21.8023 4.75 22.25 5.19772 22.25 5.75V18.25C22.25 18.8023 21.8023 19.25 21.25 19.25H15.277C14.5966 19.25 13.9296 19.4142 13.3508 19.7719C12.772 20.1296 12.3043 20.6414 12 21.25M12 7.75C12 6.09315 10.6569 4.75 9 4.75H2.75C2.19772 4.75 1.75 5.19772 1.75 5.75V18.25C1.75 18.8023 2.19772 19.25 2.75 19.25H8.723C9.40341 19.25 10.0704 19.4142 10.6492 19.7719C11.228 20.1296 11.6957 20.6414 12 21.25M12 7.75V21.25";
const FRAME = "M4.29601 20.141L4.6365 19.4727L4.6365 19.4727L4.29601 20.141ZM3.85899 19.704L3.19074 20.0445L3.19074 20.0445L3.85899 19.704ZM20.141 19.704L19.4728 19.3635H19.4728L20.141 19.704ZM19.704 20.141L19.3635 19.4727V19.4727L19.704 20.141ZM20.141 4.29601L19.4728 4.6365L19.4728 4.6365L20.141 4.29601ZM19.704 3.85899L20.0445 3.19074L20.0445 3.19074L19.704 3.85899ZM3.85899 4.29601L3.19074 3.95552L3.19074 3.95552L3.85899 4.29601ZM4.29601 3.85899L3.95552 3.19074L3.95552 3.19074L4.29601 3.85899ZM19.5 5.35V18.65H21V5.35H19.5ZM18.65 19.5H5.35V21H18.65V19.5ZM4.5 18.65V5.35H3V18.65H4.5ZM5.35 4.5H18.65V3H5.35V4.5ZM5.35 19.5C5.0576 19.5 4.8834 19.4994 4.75428 19.4889C4.6339 19.479 4.62011 19.4644 4.6365 19.4727L3.95552 20.8093C4.18582 20.9266 4.419 20.9665 4.63213 20.9839C4.83651 21.0006 5.08235 21 5.35 21V19.5ZM3 18.65C3 18.9176 2.99942 19.1635 3.01612 19.3679C3.03353 19.581 3.07339 19.8142 3.19074 20.0445L4.52725 19.3635C4.5356 19.3799 4.52097 19.3661 4.51113 19.2457C4.50058 19.1166 4.5 18.9424 4.5 18.65H3ZM4.6365 19.4727C4.58946 19.4488 4.55122 19.4105 4.52725 19.3635L3.19074 20.0445C3.35852 20.3738 3.62623 20.6415 3.95552 20.8093L4.6365 19.4727ZM19.5 18.65C19.5 18.9424 19.4994 19.1166 19.4889 19.2457C19.479 19.3661 19.4644 19.3799 19.4728 19.3635L20.8093 20.0445C20.9266 19.8142 20.9665 19.581 20.9839 19.3679C21.0006 19.1635 21 18.9176 21 18.65H19.5ZM18.65 21C18.9177 21 19.1635 21.0006 19.3679 20.9839C19.581 20.9665 19.8142 20.9266 20.0445 20.8093L19.3635 19.4727C19.3799 19.4644 19.3661 19.479 19.2457 19.4889C19.1166 19.4994 18.9424 19.5 18.65 19.5V21ZM19.4728 19.3635C19.4488 19.4105 19.4105 19.4488 19.3635 19.4727L20.0445 20.8093C20.3738 20.6415 20.6415 20.3738 20.8093 20.0445L19.4728 19.3635ZM21 5.35C21 5.08235 21.0006 4.83651 20.9839 4.63213C20.9665 4.419 20.9266 4.18582 20.8093 3.95552L19.4728 4.6365C19.4644 4.62011 19.479 4.6339 19.4889 4.75428C19.4994 4.8834 19.5 5.0576 19.5 5.35H21ZM18.65 4.5C18.9424 4.5 19.1166 4.50058 19.2457 4.51113C19.3661 4.52097 19.3799 4.5356 19.3635 4.52725L20.0445 3.19074C19.8142 3.07339 19.581 3.03353 19.3679 3.01612C19.1635 2.99942 18.9177 3 18.65 3V4.5ZM20.8093 3.95552C20.6415 3.62623 20.3738 3.35852 20.0445 3.19074L19.3635 4.52725C19.4105 4.55122 19.4488 4.58946 19.4728 4.6365L20.8093 3.95552ZM4.5 5.35C4.5 5.0576 4.50058 4.8834 4.51113 4.75428C4.52097 4.6339 4.5356 4.62011 4.52725 4.6365L3.19074 3.95552C3.07339 4.18582 3.03353 4.419 3.01612 4.63213C2.99942 4.83651 3 5.08235 3 5.35H4.5ZM5.35 3C5.08235 3 4.83651 2.99942 4.63213 3.01612C4.419 3.03353 4.18582 3.07339 3.95552 3.19074L4.6365 4.52725C4.62011 4.5356 4.6339 4.52097 4.75428 4.51113C4.8834 4.50058 5.0576 4.5 5.35 4.5V3ZM4.52725 4.6365C4.55122 4.58946 4.58946 4.55122 4.6365 4.52725L3.95552 3.19074C3.62623 3.35852 3.35852 3.62623 3.19074 3.95552L4.52725 4.6365Z";

const BADGE_SHADOW = "shadow-[0_20.5px_20.5px_rgba(0,0,0,0.09),0_5px_11.3px_rgba(0,0,0,0.10),inset_0_-0.3px_5.36px_rgba(185,185,185,0.35)]";
function Badge({ id, children, overlap }: { id: string; children: ReactNode; overlap?: boolean }) {
  return (
    <span className={`relative flex size-9 shrink-0 items-center justify-center ${overlap ? "-ml-2" : ""}`}>
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#1f2123]" />
      <span aria-hidden="true" className={`absolute inset-0 rounded-full border border-[rgba(197,197,197,0.30)] bg-white/[0.04] mix-blend-luminosity backdrop-blur-xs ${BADGE_SHADOW}`} />
      <span className="relative flex">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative size-4 shrink-0">
          <defs><linearGradient id={`gradient-badge-${id}`} x1="12" y1="24" x2="12" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity="0.3" /><stop offset="1" stopColor="#fff" stopOpacity="1" /></linearGradient></defs>
          <g fill={`url(#gradient-badge-${id})`}>{children}</g>
        </svg>
      </span>
    </span>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-5 w-9 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lime ${checked ? "bg-lime" : "bg-white/20"}`}>
      <span className={`absolute left-0.5 top-0.5 size-4 rounded-full transition-transform ${checked ? "translate-x-4 bg-white" : "bg-white"}`} />
    </button>
  );
}

function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return <div className={`grid w-full transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="min-h-0 overflow-hidden" inert={!open}>{children}</div></div>;
}

function Field({ label, open, onToggle, placeholder, value, onChange, tall }: { label: string; open: boolean; onToggle: (v: boolean) => void; placeholder: string; value: string; onChange: (v: string) => void; tall?: boolean }) {
  return (
    <div className="flex flex-col self-stretch overflow-hidden rounded-xl">
      <div className="flex h-11 items-center justify-between gap-2 self-stretch bg-white/5 px-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <Switch checked={open} onChange={onToggle} label={`Toggle ${label.toLowerCase()}`} />
      </div>
      <Collapse open={open}>
        <div aria-hidden="true" className="h-px w-full" />
        <textarea aria-label={label} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={`hide-scrollbar block w-full resize-none overflow-y-auto rounded-b-xl bg-white/5 p-3 text-sm leading-5 text-white outline-none placeholder:text-white/40 ${tall ? "h-40" : "h-24"}`} />
      </Collapse>
    </div>
  );
}

type Character = { id: string; url: string; name: string };
type Tab = "history" | "how";

const SLIDES = [
  { video: TOOLS[1].video, poster: TOOLS[1].poster, eyebrow: "The idea", title: "One ad, many versions", text: "Start with an ad you like and make it yours with a new product, cast, or setting." },
  { video: `${S}/banner.mp4`, poster: `${S}/banner-poster.webp`, eyebrow: "Step 1", title: "Pick a reference ad", text: "Upload a video ad or choose a preset to recreate." },
  { video: TOOLS[0].video, poster: TOOLS[0].poster, eyebrow: "Step 2", title: "Make it yours", text: "Add your characters, products or clothes and write what should change." },
];

const DATE_RANGES = ["Any time", "Today", "Last 7 days", "Last 30 days"];
const QUALITIES = ["720p", "1080p"];

export function AdMultiplier() {
  const router = useRouter();
  const sliderId = useId();
  const [tab, setTab] = useState<Tab>("history");
  const [slide, setSlide] = useState(0);
  const [view, setView] = useState<"list" | "grid">("list");
  const [zoom, setZoom] = useState(5);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);
  const [hideFailed, setHideFailed] = useState(false);
  const [activity, setActivity] = useState<"liked" | "downloaded" | null>(null);
  const [reference, setReference] = useState<VideoSelection | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<(VideoSelection & { id: string })[]>([]);
  const [picker, setPicker] = useState<{ kind: "video" | "image"; anchor: DOMRect } | null>(null);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [promptOpen, setPromptOpen] = useState(true);
  const [hookOpen, setHookOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [hook, setHook] = useState("");
  const [cta, setCta] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [qualityOpen, setQualityOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  const closePicker = useCallback(() => { setPicker(null); setPickerError(null); }, []);

  useEffect(() => {
    if (!filterOpen && !qualityOpen) return;
    const down = (e: MouseEvent) => {
      if (filterOpen && !filterRef.current?.contains(e.target as Node)) { setFilterOpen(false); setDateOpen(false); }
      if (qualityOpen && !qualityRef.current?.contains(e.target as Node)) setQualityOpen(false);
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setFilterOpen(false); setDateOpen(false); setQualityOpen(false); } };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [filterOpen, qualityOpen]);

  const canGenerate = !!reference && characters.length > 0;
  const openPicker = (kind: "video" | "image") => (e: React.MouseEvent<HTMLButtonElement>) => setPicker({ kind, anchor: e.currentTarget.getBoundingClientRect() });

  const onFiles = (files: FileList) => {
    setPickerError(null);
    if (picker?.kind === "image") {
      const imgs = Array.from(files).filter(f => /^image\/(png|jpe?g|webp)$/.test(f.type));
      if (!imgs.length) { setPickerError("Upload PNG, JPG or WebP images."); return; }
      const room = 20 - characters.length;
      if (room <= 0) { setPickerError("You can add up to 20 images."); return; }
      setCharacters(c => [...c, ...imgs.slice(0, room).map(f => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name }))]);
      closePicker();
      return;
    }
    const file = files[0];
    if (!file || !/^video\/(mp4|quicktime|webm)$/.test(file.type)) { setPickerError("Upload an MP4, MOV or WebM video."); return; }
    const url = URL.createObjectURL(file);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      if (probe.duration < 4 || probe.duration > 30) { URL.revokeObjectURL(url); setPickerError("Video duration must be 4-30 seconds."); return; }
      const sel = { id: url, name: file.name, url };
      setUploadedVideos(v => [sel, ...v]);
      setReference(sel);
      closePicker();
    };
    probe.onerror = () => { URL.revokeObjectURL(url); setPickerError("This video could not be read."); };
    probe.src = url;
  };

  const tile = "relative flex flex-col items-center justify-center gap-3 self-stretch rounded-xl bg-white/5 p-1";
  const inner = "relative flex flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-lg p-4 h-40";
  const dashed = <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg border border-dashed border-white/5" />;
  const FILTER_ROW = "flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm font-medium text-white outline-none transition-colors hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-white/30";

  return (
    <div data-ads-multiplier="true" className={`${refinements.multiplier} flex h-[calc(100dvh-52px)] gap-2 bg-[#0d0f10] p-2 text-white max-md:flex-col max-md:overflow-y-auto`}>
      <aside className="flex max-h-full min-h-0 w-80 shrink-0 flex-col self-start overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f10] max-md:w-full">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
            <figure className="relative h-[8.125rem] w-full overflow-hidden rounded-xl p-3 max-md:aspect-[2.3] max-md:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={`${S}/banner-poster.webp`} className="absolute inset-0 size-full object-cover" />
              <video autoPlay loop muted playsInline disablePictureInPicture preload="metadata" src={`${S}/banner.mp4`} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%)" }} />
              <div className="absolute left-3 top-3 z-10">
                <button type="button" onClick={() => router.push("/ads-studio")} className="inline-flex h-6 items-center gap-0.5 rounded-lg border border-white/10 bg-black/40 pl-1 pr-2 text-xs font-semibold text-white outline-none backdrop-blur-sm transition hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-lime">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3.5"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 18.25 8.25 12l6.25-6.25" /></svg><span>Ads Studio</span>
                </button>
              </div>
              <button type="button" onClick={() => setTab("how")} style={{ backdropFilter: "blur(4.5px)" }} className="absolute right-3 top-3 z-10 inline-flex h-6 items-center gap-1 rounded-lg border border-white/[0.06] bg-black/60 px-2 text-xs font-medium text-white outline-none transition hover:bg-lime hover:text-black focus-visible:ring-2 focus-visible:ring-lime">
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" className="size-3.5"><path d={BOOK_ICON} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>How it works
              </button>
              <figcaption className="absolute inset-x-3 bottom-3 z-10 min-w-0">
                <p className="font-grotesk text-xl font-bold uppercase leading-6 tracking-[-0.2px] text-lime">Ad multiplier</p>
                <p title="Recreate any ad with your characters, product and settings" className="truncate text-xs text-white/60">Recreate any ad with your characters, product and settings</p>
              </figcaption>
            </figure>

            <div className="relative mt-2 flex flex-col gap-2">
              <div className={tile}>
                <div className={inner}>
                  {dashed}
                  {reference && (
                    <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
                      <video key={reference.url} src={reference.url} poster={reference.poster} autoPlay loop muted playsInline className="size-full object-cover" />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                  )}
                  <button type="button" aria-label={reference ? "Change reference video" : "Add a reference video to recreate"} onClick={openPicker("video")} className="absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-lime" />
                  {reference && (
                    <button type="button" aria-label="Remove reference video" onClick={() => setReference(null)} className="absolute right-2 top-2 z-20 grid size-6 place-items-center rounded-full bg-black/50 text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-lime"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m7.75 7.75 8.5 8.5m0-8.5-8.5 8.5" /></svg></button>
                  )}
                  <span className="relative isolate flex items-center">
                    <Badge id="video"><path d="M15.75 4.5c.966 0 1.75.784 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75h-12A1.75 1.75 0 0 1 2 17.75V6.25c0-.966.784-1.75 1.75-1.75zM20.443 7.215A1.5 1.5 0 0 1 22.5 8.607v6.786a1.5 1.5 0 0 1-2.057 1.392l-1.943-.777V7.992z" /></Badge>
                  </span>
                  <span className="pointer-events-none flex w-full flex-col items-center gap-1.5 text-center">
                    <span className="text-center text-sm font-semibold text-white">{reference ? reference.name : <>Add a reference video<br />to recreate</>}</span>
                    <span className="text-xs text-white/60">Video duration: 4-30 seconds</span>
                  </span>
                </div>
              </div>

              <div className={tile}>
                <div className={`${inner} ${characters.length ? "justify-start" : ""}`}>
                  {dashed}
                  <button type="button" aria-label="Add reference images" onClick={openPicker("image")} className="absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-lime" />
                  {characters.length ? (
                    <div className="relative z-20 grid w-full grid-cols-4 gap-1.5">
                      {characters.map(c => (
                        <div key={c.id} className="group relative aspect-square overflow-hidden rounded-md bg-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.url} alt={c.name} className="size-full object-cover" />
                          <button type="button" aria-label={`Remove ${c.name}`} onClick={() => setCharacters(l => l.filter(x => x.id !== c.id))} className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-black/60 text-white opacity-0 outline-none transition-opacity focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-2.5"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m7.75 7.75 8.5 8.5m0-8.5-8.5 8.5" /></svg></button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {!characters.length && (
                    <span className="relative isolate flex items-center">
                      <Badge id="head"><path d="M10.962 2C6.567 2 3 5.555 3 9.944c0 1.849.633 3.551 1.695 4.9 1.295 1.647 1.332 3.244 1.312 5.399A1.74 1.74 0 0 0 7.75 22h5.5A1.75 1.75 0 0 0 15 20.25v-1.083a.25.25 0 0 1 .25-.25h2a1.75 1.75 0 0 0 1.75-1.75V14.15a.25.25 0 0 1 .135-.223l.965-.498c.929-.48 1.23-1.66.649-2.527-.937-1.397-1.724-2.624-2.334-4.18C17.162 3.53 14.13 2 10.962 2" /></Badge>
                      <Badge id="fashion" overlap><path d="M9.641 3.524a.75.75 0 0 0-1.044-.448L2.225 6.184a1.75 1.75 0 0 0-.882 2.159l.873 1.956a1.75 1.75 0 0 0 2.377 1.006l.408-.187v8.132c0 .966.784 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75v-8.132l.408.187a1.75 1.75 0 0 0 2.377-1.006l.873-1.956a1.75 1.75 0 0 0-.882-2.159l-6.372-3.108a.75.75 0 0 0-1.044.448c-.404 1.277-1.399 1.863-2.36 1.863s-1.956-.586-2.36-1.863" /></Badge>
                      <Badge id="box" overlap><path d="M11 12.288a.5.5 0 0 1 .25.433v9.096a.5.5 0 0 1-.75.433l-7.252-4.187a1.75 1.75 0 0 1-.875-1.516V8.174a.5.5 0 0 1 .75-.433zM21.627 16.547a1.75 1.75 0 0 1-.875 1.516L13.5 22.25a.5.5 0 0 1-.75-.433V12.72a.5.5 0 0 1 .25-.433l7.877-4.547a.5.5 0 0 1 .75.433zM20.126 5.576a.5.5 0 0 1 0 .866l-7.876 4.547a.5.5 0 0 1-.5 0L3.873 6.443a.5.5 0 0 1 0-.866l7.252-4.187a1.75 1.75 0 0 1 1.75 0z" /></Badge>
                    </span>
                  )}
                  <span className="pointer-events-none flex w-full flex-col items-center gap-1.5 text-center">
                    {!characters.length && <span className="text-center text-sm font-semibold text-white">Add your characters,<br />products, or clothes</span>}
                    <span className="text-xs text-white/60">{characters.length ? `${characters.length} of 20 images` : "Up to 20 images"}</span>
                  </span>
                </div>
              </div>

              <Field label="Prompt" open={promptOpen} onToggle={setPromptOpen} value={prompt} onChange={setPrompt} tall placeholder="Describe your new version — e.g. 'the same ad for the German market with a woman in her 30s' or 'keep the original voice'. Mention attached images using @..." />
              <Field label="Change hook" open={hookOpen} onToggle={setHookOpen} value={hook} onChange={setHook} placeholder="Write your hook — e.g. 'What if your AI videos paid your rent?'" />
              <Field label="Change CTA" open={ctaOpen} onToggle={setCtaOpen} value={cta} onChange={setCta} placeholder="Write your call to action — e.g. 'Start creating for free today'" />

              <div ref={qualityRef} className="relative mt-0">
                <button type="button" aria-label="Quality" aria-haspopup="menu" aria-expanded={qualityOpen} onClick={() => setQualityOpen(o => !o)} className="flex h-[3.375rem] w-full items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 text-left outline-none transition-colors duration-150 hover:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/40">
                  <span className="flex min-w-0 flex-col items-start gap-1"><span className="max-w-full truncate text-xs font-medium text-white/60">Quality</span><span className="max-w-full truncate text-sm font-medium text-white">{quality}</span></span>
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0 -rotate-90 text-white/60"><path fillRule="evenodd" clipRule="evenodd" d="M3.81344 7.97848C4.0087 7.78322 4.32528 7.78322 4.52055 7.97848L10.0003 13.4583L15.4801 7.97848C15.6754 7.78322 15.9919 7.78322 16.1872 7.97848C16.3825 8.17374 16.3825 8.49032 16.1872 8.68558L10.3539 14.5189L10.0003 14.8725L9.64677 14.5189L3.81344 8.68558C3.61818 8.49032 3.61818 8.17374 3.81344 7.97848Z" fill="currentColor" /></svg>
                </button>
                {qualityOpen && (
                  <div role="menu" className="absolute inset-x-0 bottom-full z-30 mb-1 rounded-xl border border-white/10 bg-[#1b1d1f] p-1 shadow-2xl">
                    {QUALITIES.map(q => <button key={q} type="button" role="menuitemradio" aria-checked={q === quality} onClick={() => { setQuality(q); setQualityOpen(false); }} className="flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm font-medium text-white outline-none hover:bg-white/5 focus-visible:bg-white/10">{q}{q === quality && <span aria-hidden="true" className="size-1.5 rounded-full bg-lime" />}</button>)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div data-ad-multiplier-generate="true" className="relative shrink-0 px-2 py-3">
            <button type="button" disabled={!canGenerate} onClick={() => setAuthMode("signup")} className="relative grid h-12 w-full grid-flow-col-dense items-center justify-center gap-2 rounded-xl border-none bg-[radial-gradient(#EFFE17_40%,#d1fe17)] px-6 pb-0.5 text-sm font-semibold text-ink shadow-[inset_0px_-3px_rgba(0,0,0,0.43)] outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] active:opacity-60 disabled:cursor-not-allowed disabled:bg-white/10 disabled:bg-none disabled:text-white/30 disabled:shadow-none disabled:hover:opacity-100 disabled:active:scale-100">Generate</button>
          </div>
        </div>
      </aside>

      <main data-ads-multiplier-main="true" className="relative isolate flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f10] px-4 pb-4 max-md:min-h-[32rem]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(circle, rgb(25,27,29) 1px, transparent 1px), radial-gradient(circle, rgb(25,27,29) 1px, transparent 1px)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px", maskImage: "linear-gradient(to right, #000 78%, transparent 100%), linear-gradient(to top, #000 60%, transparent 100%)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />
        <header className="relative z-10 flex shrink-0 flex-col gap-3 pb-3 pt-2">
          <div className="flex items-center justify-between">
            <div role="tablist" aria-label="Page view" className="flex w-fit shrink-0 items-center gap-1 rounded-xl bg-white/[0.03] p-0.5">
              {([["history", "History", "M2.75 4.75v13.5a1 1 0 0 0 1 1h16.5a1 1 0 0 0 1-1V7.75a1 1 0 0 0-1-1h-7.715a1 1 0 0 1-.832-.445l-1.406-2.11a1 1 0 0 0-.832-.445H3.75a1 1 0 0 0-1 1"], ["how", "How it works", "M12 21.25a3.66 3.66 0 0 0-1.35-1.478 3.64 3.64 0 0 0-1.927-.522H2.75a1 1 0 0 1-1-1V5.75a1 1 0 0 1 1-1H9a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6.25a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1h-5.973a3.64 3.64 0 0 0-1.926.522A3.66 3.66 0 0 0 12 21.25m0-13.5v13.5"]] as const).map(([id, label, d]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-lime ${tab === id ? "bg-white/10 text-white ring-1 ring-inset ring-white/10" : "text-white/60 hover:text-white"}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={d} /></svg>{label}
                </button>
              ))}
            </div>
            {tab === "history" && (
              <div className="flex items-center gap-2">
                <div ref={filterRef} className="relative shrink-0">
                  <button type="button" aria-label="Filter" aria-haspopup="menu" aria-expanded={filterOpen} onClick={() => setFilterOpen(o => !o)} className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[0.625rem] bg-white/[0.02] px-3 py-1 text-white/60 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime">
                    <svg className="size-4" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 4.75C2 4.33579 2.33579 4 2.75 4H21.25C21.6642 4 22 4.33579 22 4.75C22 5.16421 21.6642 5.5 21.25 5.5H2.75C2.33579 5.5 2 5.16421 2 4.75ZM5 12C5 11.5858 5.33579 11.25 5.75 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.4142 18.6642 12.75 18.25 12.75H5.75C5.33579 12.75 5 12.4142 5 12ZM8 19.25C8 18.8358 8.33579 18.5 8.75 18.5H15.25C15.6642 18.5 16 18.8358 16 19.25C16 19.6642 15.6642 20 15.25 20H8.75C8.33579 20 8 19.6642 8 19.25Z" fill="currentColor" /></svg>
                  </button>
                  {filterOpen && (
                    <div role="menu" className="absolute right-0 top-11 z-30 w-[17.5rem] rounded-2xl border border-white/10 bg-[#141516] p-1.5 shadow-2xl">
                      <button type="button" role="menuitem" aria-expanded={dateOpen} onClick={() => setDateOpen(o => !o)} className={`${FILTER_ROW} justify-between bg-white/5`}>
                        <span className="flex items-center gap-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 9.75h16.5M8 3v3m8-3v3M5.75 5h12.5a2 2 0 0 1 2 2v11.25a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" /></svg>{dateRange === DATE_RANGES[0] ? "Date range" : dateRange}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`size-4 transition-transform ${dateOpen ? "rotate-90" : ""}`}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 18.25 15.75 12 9.5 5.75" /></svg>
                      </button>
                      {dateOpen && DATE_RANGES.map(r => <button key={r} type="button" role="menuitemradio" aria-checked={r === dateRange} onClick={() => { setDateRange(r); setDateOpen(false); }} className={`${FILTER_ROW} pl-10 ${r === dateRange ? "text-lime" : ""}`}>{r}</button>)}
                      <div className={`${FILTER_ROW} justify-between`}>
                        <span className="flex items-center gap-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m3 3 18 18M10.6 5.2A9.5 9.5 0 0 1 12 5.1c4.5 0 8 3.6 9.5 6.9a12 12 0 0 1-2.6 3.7M6.6 6.8A12 12 0 0 0 2.5 12c1.5 3.300 5 6.900 9.500 6.900 1.600 0 3.100-.5 4.400-1.200M9.900 9.900a3 3 0 0 0 4.200 4.200" /></svg>Hide failed</span>
                        <Switch checked={hideFailed} onChange={setHideFailed} label="Hide failed" />
                      </div>
                      <p className="px-2.5 pb-1 pt-3 text-xs font-medium text-white/50">Activity</p>
                      {(["liked", "downloaded"] as const).map(a => (
                        <button key={a} type="button" role="menuitemcheckbox" aria-checked={activity === a} onClick={() => setActivity(v => (v === a ? null : a))} className={`${FILTER_ROW} ${activity === a ? "bg-white/10" : ""}`}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">{a === "liked" ? <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 20s-7.5-4.4-7.5-10.2A4.3 4.3 0 0 1 12 7.300a4.300 4.300 0 0 1 7.500 2.500C19.500 15.600 12 20 12 20" /> : <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v11m0 0-4-4m4 4 4-4M4.500 15v3.500a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V15" />}</svg>
                          {a === "liked" ? "Liked" : "Downloaded"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden items-center gap-3 rounded-2xl md:flex">
                  <div className="flex items-center gap-2 pl-0.5 pr-3">
                    <label htmlFor={sliderId} className="grid size-6 place-items-center rounded-md text-white/70"><span className="sr-only">Zoom</span><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" className="size-4"><path fillRule="evenodd" clipRule="evenodd" d="M13.75 3C14.1642 3 14.5 3.33579 14.5 3.75V8.43934L19.7197 3.21967C20.0126 2.92678 20.4874 2.92678 20.7803 3.21967C21.0732 3.51256 21.0732 3.98744 20.7803 4.28033L15.5607 9.5H20.25C20.6642 9.5 21 9.83579 21 10.25C21 10.6642 20.6642 11 20.25 11H13.75C13.3358 11 13 10.6642 13 10.25V3.75C13 3.33579 13.3358 3 13.75 3ZM3.75 14.5C3.33579 14.5 3 14.1642 3 13.75C3 13.3358 3.33579 13 3.75 13H10.25C10.6642 13 11 13.3358 11 13.75V20.25C11 20.6642 10.6642 21 10.25 21C9.83579 21 9.5 20.6642 9.5 20.25V15.5607L4.28033 20.7803C3.98744 21.0732 3.51256 21.0732 3.21967 20.7803C2.92678 20.4874 2.92678 20.0126 3.21967 19.7197L8.43934 14.5H3.75Z" fill="currentColor" /></svg></label>
                    <input id={sliderId} type="range" min={0} max={5} step={1} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-white/10 accent-white [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white" />
                  </div>
                  <div role="tablist" aria-label="Layout" className="flex gap-1 rounded-lg p-0.5">
                    {([["list", "List", <path key="l" d={FRAME} fill="currentColor" />, <path key="l2" d="M20.25 10.5H21V9H20.25V10.5ZM3.75 9H3V10.5H3.75V9ZM3.75 10.5H20.25V9H3.75V10.5Z" fill="currentColor" />], ["grid", "Grid", <path key="g" d={FRAME} fill="currentColor" />, <path key="g2" d="M3.75 12H20.25M12 3.75V20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />]] as const).map(([id, label, a, b]) => (
                      <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)} className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-lime ${view === id ? "border border-white/10 bg-white/[0.08] text-white" : "text-white/60 hover:text-white"}`}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" className="size-4">{a}{b}</svg>{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {tab === "history" ? (
          <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-2xl">
            <div data-ads-empty-history="true" className="relative flex h-[33.125rem] w-full items-center justify-center overflow-hidden max-md:h-80">
              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[32.5rem] w-[min(823px,100%)] -translate-x-1/2 -translate-y-1/2 opacity-10 [background-image:radial-gradient(circle,rgba(255,255,255,0.7)_0.7px,transparent_0.8px)] [background-size:8px_8px] [mask-image:radial-gradient(ellipse_at_center,black_0%,black_34%,transparent_76%)]" />
              <div className="relative flex flex-col items-center gap-5">
                <span className="relative flex size-14 items-center justify-center rounded-full border border-[rgba(197,197,197,0.3)] bg-white/5 text-white shadow-[0_20.5px_10.3px_rgba(0,0,0,0.09),inset_0_-0.3px_5.4px_rgba(185,185,185,0.35)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6"><path stroke="currentColor" strokeWidth="1.5" d="M15 19.25a7.25 7.25 0 1 0 0-14.5 7.25 7.25 0 0 0 0 14.5Z" /><path stroke="currentColor" strokeDasharray="0.01 2.5" strokeLinecap="round" strokeWidth="1.5" d="M9 19.25a7.25 7.25 0 1 0 0-14.5 7.25 7.25 0 0 0 0 14.5Z" /></svg>
                </span>
                <p className="text-base font-semibold leading-5 text-white">No generations yet</p>
              </div>
            </div>
          </div>
        ) : (
          <div data-ads-multiplier-how="true" className="relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto rounded-b-2xl py-6 [scrollbar-color:#6b6d70_transparent]">
            <div className="flex w-full max-w-[38.9rem] shrink-0 flex-col items-center gap-8 px-4">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white/5 md:aspect-auto md:h-[21.875rem]">
                <video key={SLIDES[slide].video} autoPlay loop muted playsInline poster={SLIDES[slide].poster} className="size-full object-cover"><source src={SLIDES[slide].video} type="video/mp4" /></video>
              </div>
              <div aria-live="polite" className="flex w-full flex-col items-center gap-2 text-center">
                <p className="text-sm font-semibold uppercase text-lime">{SLIDES[slide].eyebrow}</p>
                <h2 className="font-grotesk text-4xl font-bold uppercase leading-none tracking-[-0.04em] text-white max-md:text-2xl">{SLIDES[slide].title}</h2>
                <p className="max-w-[34rem] text-lg text-white/60 max-md:text-base">{SLIDES[slide].text}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous step" onClick={() => setSlide(n => (n + SLIDES.length - 1) % SLIDES.length)} className="grid size-8 place-items-center rounded-full border border-white/15 text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime"><svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 18.25 8.25 12l6.25-6.25" /></svg></button>
                <div className="flex h-10 items-center gap-1 rounded-full bg-black/10 px-2 ring-[0.78px] ring-inset ring-[rgba(217,217,217,0.04)]">
                  {[(slide + SLIDES.length - 1) % SLIDES.length, slide, (slide + 1) % SLIDES.length].map(n => { const s = SLIDES[n]; return (
                    <button key={s.title} type="button" aria-label={`Step ${n + 1}: ${s.title}`} aria-current={n === slide ? "step" : undefined} onClick={() => setSlide(n)} className={`shrink-0 overflow-hidden rounded-full outline-none transition-[width,height,padding,border-width,border-color] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-lime motion-reduce:transition-none ${n === slide ? "h-10 w-20 border-[1.5px] border-white p-[2.5px]" : "h-6 w-10 border border-white/[0.12] hover:border-white/40"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" draggable={false} src={s.poster} className="size-full rounded-full object-cover" />
                    </button>
                  ); })}
                </div>
                <button type="button" aria-label="Next step" onClick={() => setSlide(n => (n + 1) % SLIDES.length)} className="grid size-8 place-items-center rounded-full border border-white/15 text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime"><svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 18.25 15.75 12 9.5 5.75" /></svg></button>
              </div>
            </div>
          </div>
        )}
      </main>

      {picker && (
        <AssetsPicker
          anchor={picker.anchor}
          onClose={closePicker}
          modal
          label={picker.kind === "video" ? "Choose reference video" : "Choose your characters"}
          tabs={picker.kind === "video" ? ["uploads", "presets", "videos", "liked"] : ["uploads", "influencer", "images", "liked"]}
          pickerWidth={600}
          multiple={picker.kind === "image"}
          uploadLabel="Upload media"
          error={pickerError}
          accept={picker.kind === "video" ? "video/mp4,video/quicktime,video/webm" : "image/png,image/jpeg,image/webp"}
          onFilesSelected={onFiles}
          onPresetSelected={selection => { setReference(selection); closePicker(); }}
          renderUploads={() => picker.kind === "video"
            ? <>{uploadedVideos.map(v => (
                <button key={v.id} type="button" aria-label={`Select ${v.name}`} onClick={() => { setReference(v); closePicker(); }} className="overflow-hidden rounded-xl bg-black/30 text-left outline-none focus-visible:ring-2 focus-visible:ring-lime">
                  <video src={v.url} muted playsInline preload="metadata" className="aspect-square w-full object-cover" /><span className="block truncate p-2 text-xs">{v.name}</span>
                </button>
              ))}</>
            : <>{characters.map(c => (
                <div key={c.id} className="overflow-hidden rounded-xl bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.url} alt={c.name} className="aspect-square w-full object-cover" /><span className="block truncate p-2 text-xs">{c.name}</span>
                </div>
              ))}</>}
        />
      )}
      {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
    </div>
  );
}
