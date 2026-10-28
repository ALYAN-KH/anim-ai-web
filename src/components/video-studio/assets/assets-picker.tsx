"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SortIcon, FilterIcon } from "../shared/icons";
import { AiInfluencerBanner } from "./ai-influencer-banner";
import { ElementsPanel } from "./elements-panel";
import { FilterMenu, type MediaFilter, type SortKey } from "./filter-menu";
import { GenerationsPanel, LOADING_MS, LoadingGrid, type GenerationKind } from "./generations-panel";
import type { VideoSelection } from "./preset-videos";
import { PresetVideosPanel } from "./preset-videos-panel";

const TABS = [
  { id: "voices", label: "Voices" },
  { id: "uploads", label: "Uploads" },
  { id: "presets", label: "Presets" },
  { id: "influencer", label: "AI Influencer" },
  { id: "elements", label: "Elements" },
  { id: "images", label: "Image Generations", kind: "image" },
  { id: "videos", label: "Video Generations", kind: "video" },
  { id: "audios", label: "Audio Generations", kind: "audio" },
  { id: "liked", label: "Liked", kind: "liked" },
] as const;

export type AssetsPickerTabId = (typeof TABS)[number]["id"];

const GENERATION_KINDS: Record<
  Exclude<AssetsPickerTabId, "voices" | "uploads" | "presets" | "influencer" | "elements">,
  GenerationKind
> = {
  images: "image",
  videos: "video",
  audios: "audio",
  liked: "liked",
};

const PICKER_HEIGHT = 520;

const ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif,video/*,video/mp4,video/webm,video/ogg,video/quicktime,audio/*,audio/wav,audio/x-wav,audio/mpeg,audio/x-mpeg,audio/vnd.wave,audio/webm,audio/ogg,audio/mp4,audio/aac,audio/x-m4a,audio/mp3,audio/x-mp3";

export interface AssetsPickerProps {
  anchor: DOMRect;
  onClose: () => void;
  onFilesSelected: (files: FileList) => void;
  tabs?: readonly AssetsPickerTabId[];
  accept?: string;
  multiple?: boolean;
  initialTab?: AssetsPickerTabId;
  onPresetSelected?: (selection: VideoSelection) => void;
  motionUploadStyle?: boolean;
  voicesPanel?: ReactNode;
  pickerWidth?: number;
  tabCounts?: Partial<Record<AssetsPickerTabId, number>>;
  /** Optional project-specific media, while retaining the shared picker and panels. */
  panels?: Partial<Record<AssetsPickerTabId, ReactNode>>;
  renderUploads?: (filters: { scope: "recent" | "all"; sort: SortKey; media: MediaFilter }) => ReactNode;
  label?: string;
  uploadLabel?: string;
  error?: string | null;
  modal?: boolean;
}

export function AssetsPicker({
  anchor,
  onClose,
  onFilesSelected,
  tabs,
  accept = ACCEPT,
  multiple = true,
  initialTab,
  onPresetSelected,
  motionUploadStyle = false,
  voicesPanel,
  pickerWidth,
  tabCounts,
  panels,
  renderUploads,
  label = "Assets",
  uploadLabel = "Upload file",
  error,
  modal = false,
}: AssetsPickerProps) {
  const visibleTabs = tabs ? TABS.filter((t) => tabs.includes(t.id)) : TABS.filter(t => t.id !== "voices");
  const [activeId, setActiveId] = useState<AssetsPickerTabId>(
    initialTab && visibleTabs.some((t) => t.id === initialTab)
      ? initialTab
      : (visibleTabs[0]?.id ?? "uploads"),
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("last-created");
  const [media, setMedia] = useState<MediaFilter>("all");
  const [uploadScope, setUploadScope] = useState<"recent" | "all">("recent");
  const [uploadsLoading, setUploadsLoading] = useState(true);

  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLButtonElement>('[role="tab"]')?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || document.querySelector("[data-preset-dialog]")) return;
      const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]), [role="button"][tabindex="0"], a[href], select') ?? []);
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { document.removeEventListener("keydown", trap); previous?.focus(); };
  }, [modal]);

  useEffect(() => {
    if (activeId !== "uploads") return;
    const timer = window.setTimeout(() => setUploadsLoading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [activeId, uploadScope]);

  useEffect(() => {
    tabListRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
  }, [activeId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.querySelector("[data-preset-dialog]")) return;
      if (e.key === "Escape" && !menuOpen) onClose();
    };
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).closest("[data-preset-dialog]")) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [onClose, menuOpen]);

  const width = Math.min(pickerWidth ?? (motionUploadStyle ? 600 : 750), window.innerWidth - 16);
  const left = Math.max(
    8,
    Math.min(anchor.right + 6, window.innerWidth - width - 8),
  );
  const active = visibleTabs.find((t) => t.id === activeId) ?? visibleTabs[0];
  const height = Math.min(PICKER_HEIGHT, window.innerHeight - 32);
  const top = Math.max(
    16,
    Math.min(anchor.top, window.innerHeight - height - 16),
  );

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={label}
      aria-modal={modal || undefined}
      style={{ left, top, height, width, ...(modal ? { zIndex: 100, backgroundColor: "#1d1f20" } : {}), ...(motionUploadStyle ? { backgroundColor: voicesPanel ? "#121516" : "#232628" } : {}) }}
      className="fixed z-50 flex max-h-[calc(100vh-16px)] w-[min(750px,calc(100vw-16px))] flex-col rounded-3xl border border-white/10 bg-[#1b1d1f]/95 shadow-2xl backdrop-blur-2xl"
    >
      <div className="flex h-[42px] shrink-0 items-center justify-between gap-2 pl-3 pr-4 pt-3">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Media sources"
          onKeyDown={event => {
            const index = visibleTabs.findIndex(tab => tab.id === activeId);
            const next = { ArrowRight: (index + 1) % visibleTabs.length, ArrowLeft: (index - 1 + visibleTabs.length) % visibleTabs.length, Home: 0, End: visibleTabs.length - 1 }[event.key];
            if (next === undefined) return;
            event.preventDefault(); setActiveId(visibleTabs[next].id);
            tabListRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
          }}
          className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none]"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeId === tab.id}
              tabIndex={activeId === tab.id ? 0 : -1}
              onClick={() => {
                if (tab.id === "uploads") setUploadsLoading(true);
                setActiveId(tab.id);
                setMenuOpen(false);
              }}
              className={`h-8 shrink-0 whitespace-nowrap rounded-full px-4 text-xs font-semibold outline-none transition-colors focus-visible:ring-1 focus-visible:ring-q-border-focus ${tab.id === "influencer"
                  ? `text-lime ${activeId === tab.id
                    ? "bg-lime/10 ring-1 ring-inset ring-lime"
                    : "bg-lime/15 hover:bg-lime/20"
                  }`
                  : activeId === tab.id
                    ? "bg-white text-black"
                    : motionUploadStyle && tab.id === "videos" ? "bg-white/5 text-white hover:bg-white/10" : "text-white hover:bg-white/10"
                }`}
            >
              {voicesPanel && tab.id === "images" ? "Image generations" : voicesPanel && tab.id === "audios" ? "Audio generations" : motionUploadStyle ? tab.label : tab.id === "videos" || tab.id === "images" ? "Generations" : tab.label}
              {!!tabCounts?.[tab.id] && (
                <span className={`ml-2 inline-grid size-5 place-items-center rounded-full text-[11px] font-semibold ${activeId === tab.id ? "bg-black/10 text-black" : "bg-white/10 text-white"}`}>
                  {tabCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-q-border-focus"
        >
          <svg
            className="size-4"
            aria-hidden="true"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-2 pt-3">
        <section
          data-assets-picker-frame="true"
          style={motionUploadStyle ? { backgroundColor: voicesPanel ? "#202325" : "#303334" } : undefined}
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--assets-picker-block-radius,1rem)] bg-[var(--assets-picker-block-bg,var(--color-neutral-primary-reverted-5))]"
        >
          {panels?.[active.id] ?? (active.id === "voices" ? voicesPanel : active.id === "presets" ? (
            <PresetVideosPanel onSelect={onPresetSelected} />
          ) : active.id === "influencer" ? (
            <AiInfluencerBanner />
          ) : active.id === "elements" ? (
            <ElementsPanel />
          ) : active.id !== "uploads" ? (
            <GenerationsPanel
              key={active.id}
              kind={GENERATION_KINDS[active.id]}
            />
          ) : (
            <>
              {error && <p role="alert" className="px-3 py-2 text-xs text-red-300">{error}</p>}
              <div className="flex h-11 shrink-0 items-center gap-2 p-2 shadow-[inset_0_-1px_0_var(--color-neutral-primary-20)]">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {motionUploadStyle ? <span className="px-1.5 text-xs font-semibold text-white/45">Uploads</span> : (["recent", "all"] as const).map((scope) => (
                    <button key={scope} type="button" onClick={() => { if (scope !== uploadScope) { setUploadsLoading(true); setUploadScope(scope); } }} className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${uploadScope === scope ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>
                      {scope}
                    </button>
                  ))}
                </div>
                <button
                  ref={filterBtnRef}
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  data-state={menuOpen ? "open" : "closed"}
                  aria-label={motionUploadStyle ? "Filter" : "Sort by"}
                  style={motionUploadStyle ? { backgroundColor: "rgba(255,255,255,.05)" } : undefined}
                  className="flex h-7 items-center justify-center rounded-[10px] bg-neutral-primary-reverted-5 transition-colors hover:bg-neutral-primary-reverted-10 hover:text-icon-primary data-[state=open]:bg-neutral-primary-reverted-10 data-[state=open]:text-icon-primary w-auto min-w-0 gap-1.5 px-2.5 text-white"
                >
                  {motionUploadStyle ? <FilterIcon /> : <SortIcon />}
                  <span className="truncate text-[12px] font-medium leading-4 tracking-normal text-current">
                    {motionUploadStyle ? "Filter" : "Sort by"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid shrink-0 overflow-hidden transition-[width] duration-150 w-0"
                  />
                </button>
              </div>

              {uploadsLoading ? <LoadingGrid label="Loading uploads" /> : <div className="relative flex min-h-0 flex-1 overflow-hidden">
                <div className="contents">
                  <div className="hide-scrollbar overflow-y-auto h-full min-h-0 flex-1 overflow-x-hidden p-2 pr-1">
                    <div className="grid auto-rows-max content-start gap-3 pr-1 grid-cols-[repeat(var(--assets-picker-grid-columns,auto-fill),minmax(var(--assets-picker-grid-min-column-width,130px),1fr))]">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => inputRef.current?.click()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            inputRef.current?.click();
                          }
                        }}
                        className="relative overflow-hidden col-span-1! aspect-square min-h-0! border rounded-[0.625rem] border-dashed border-q-border-default bg-q-transparent-light-05 cursor-pointer"
                        style={motionUploadStyle ? { borderColor: "rgba(255,255,255,.08)" } : undefined}
                      >
                        <div className="absolute inset-0 flex flex-col rounded-[0.625rem] backdrop-blur-[var(--hf-space-1000)]">
                          <div className="flex flex-1 flex-col items-center justify-center gap-2">
                            <span className="relative flex shrink-0 items-center justify-center overflow-hidden border text-q-icon-primary border-[rgba(197,197,197,0.3)] shadow-[inset_0_-0.3px_5.36px_rgba(185,185,185,0.35),0_5.06px_5.65px_rgba(0,0,0,0.1),0_20.53px_10.27px_rgba(0,0,0,0.09),0_46.42px_13.99px_rgba(0,0,0,0.05)] size-10 rounded-full bg-q-transparent-light-05">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5 [&_path]:stroke-[1.5]"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M18.5 19.062a5.17 5.17 0 0 0 3.75-4.99c0-2.86-2.294-5.18-5.125-5.18-.559 0-1.097.091-1.6.258-1.096-2.587-3.639-4.4-6.6-4.4C4.962 4.75 1.75 7.996 1.75 12a7.26 7.26 0 0 0 3.75 6.372m9-2.122-2.5-2.5-2.5 2.5M12 20v-5.75"
                                />
                              </svg>
                            </span>
                            <span className="text-q-caption-sm-medium text-q-text-primary" style={motionUploadStyle ? { fontSize: 12, fontWeight: 600 } : undefined}>
                              {uploadLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <input
                        ref={inputRef}
                        accept={accept}
                        multiple={multiple}
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) onFilesSelected(files);
                          e.target.value = "";
                        }}
                      />
                      {renderUploads?.({ scope: uploadScope, sort, media })}
                      <div className="h-1" />
                    </div>
                    {!renderUploads && <div className="flex min-h-0 flex-1 items-center justify-center p-6">
                      <p className="text-sm-medium text-font-secondary">
                        No uploads found
                      </p>
                    </div>}
                  </div>
                </div>
              </div>}
              {menuOpen && (
                <FilterMenu
                  sort={sort}
                  media={media}
                  onSortChange={setSort}
                  onMediaChange={setMedia}
                  onClose={() => setMenuOpen(false)}
                  triggerRef={filterBtnRef}
                />
              )}
            </>
          ))}
        </section>
      </div>
    </div>,
    document.body,
  );
}
