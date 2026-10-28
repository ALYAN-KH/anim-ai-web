"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useTypingPlaceholder } from "@/components/shared/useTypingPlaceholder";
import { COMPOSER_DIVIDER, CONNECT_URL, PLAYABLE_CATEGORIES, type PlayableCategory } from "./data";
import { Icon, type IconName } from "./icons";

export type GenerateMode = "claude" | "here";
export type Dimension = "2D" | "3D";
export const DIMENSIONS: Dimension[] = ["2D", "3D"];
export type Attachment = { url: string; name: string };

// The reference input in the source markup accepts these video types; extra images go through "Add images".
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

/** Local file selections. Object URLs are previews only and are revoked on removal, replacement and unmount. */
export function useAttachments() {
  const [reference, setReference] = useState<Attachment | null>(null);
  const [images, setImages] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const live = useRef(new Set<string>());

  useEffect(() => {
    const urls = live.current;
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, []);

  const create = (file: File): Attachment => {
    const url = URL.createObjectURL(file);
    live.current.add(url);
    return { url, name: file.name };
  };
  const release = (item: Attachment | null) => {
    if (!item) return;
    URL.revokeObjectURL(item.url);
    live.current.delete(item.url);
  };

  return {
    reference,
    images,
    error,
    setReference(files: FileList | null) {
      const file = files?.[0];
      if (!file) return;
      if (!VIDEO_TYPES.includes(file.type)) return setError("Reference must be an MP4, MOV or WebM video.");
      setError(null);
      release(reference);
      setReference(create(file));
    },
    clearReference() {
      release(reference);
      setReference(null);
    },
    addImages(files: FileList | null) {
      const picked = Array.from(files ?? []);
      const valid = picked.filter(file => IMAGE_TYPES.includes(file.type));
      setError(valid.length < picked.length ? "Only PNG, JPG and WebP images are supported." : null);
      if (valid.length) setImages(current => [...current, ...valid.map(create)]);
    },
    removeImage(url: string) {
      release(images.find(image => image.url === url) ?? null);
      setImages(current => current.filter(image => image.url !== url));
    },
  };
}

export type Attachments = ReturnType<typeof useAttachments>;

const chip = "flex h-6 shrink-0 items-center rounded-full bg-white/5 text-xs font-medium text-white transition-colors outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60";
const removeButton = "absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#525557] text-white outline-none hover:bg-[#6a6d70] focus-visible:ring-2 focus-visible:ring-white";

type MenuOption<T extends string> = { value: T; label: string; icon?: IconName };

function ChipMenu<T extends string>({ label, value, options, onSelect, up, children }: { label: string; value: T | null; options: MenuOption<T>[]; onSelect: (value: T) => void; up: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const items = menu.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]');
    items?.[Math.max(0, options.findIndex(option => option.value === value))]?.focus();
    const away = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open, options, value]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = { ArrowDown: (index + 1) % items.length, ArrowUp: (index - 1 + items.length) % items.length, Home: 0, End: items.length - 1 }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      items[next]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === "Tab") close(false);
  };

  return <div className="relative">
    <button ref={trigger} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(current => !current)} onKeyDown={event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
      }
    }} className={`${chip} px-1.5`}><span className="sr-only">{label}: </span>{children}</button>
    {open && <div ref={menu} id={id} role="menu" aria-label={label} onKeyDown={onMenuKey} className={`absolute left-0 z-30 min-w-40 rounded-xl border border-white/10 bg-[#1b1d1f] p-1 text-left shadow-2xl ${up ? "bottom-full mb-2" : "top-full mt-2"}`}>
      {options.map(option => <button key={option.value} type="button" role="menuitemradio" aria-checked={option.value === value} tabIndex={-1} onClick={() => {
        onSelect(option.value);
        close(true);
      }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-white/80 outline-none hover:bg-white/10 focus:bg-white/10 aria-checked:text-lime">
        {option.icon && <Icon name={option.icon} className="size-4 shrink-0" />}{option.label}
      </button>)}
    </div>}
  </div>;
}

const GENRE_OPTIONS: MenuOption<PlayableCategory>[] = PLAYABLE_CATEGORIES.map(category => ({ value: category, label: category, icon: category }));
const DIMENSION_OPTIONS: MenuOption<Dimension>[] = DIMENSIONS.map(value => ({ value, label: value }));

export type ComposerProps = {
  mode: GenerateMode;
  prompt: string;
  onPrompt: (value: string) => void;
  dimension: Dimension;
  onDimension: (value: Dimension) => void;
  genre: PlayableCategory | null;
  onGenre: (value: PlayableCategory | null) => void;
  attachments: Attachments;
  onGenerate: () => void;
};

export function Composer({ mode, prompt, onPrompt, dimension, onDimension, genre, onGenre, attachments, onGenerate, docked = false }: ComposerProps & { docked?: boolean }) {
  const promptId = useId();
  const placeholder = useTypingPlaceholder("A knight fighting a dragon", !prompt);
  const referenceInput = useRef<HTMLInputElement>(null);
  const imagesInput = useRef<HTMLInputElement>(null);
  const claude = mode === "claude";
  const { reference, images, error } = attachments;
  const ready = prompt.trim().length > 0;

  return <div className="flex w-full max-w-[36.875rem] flex-col items-center gap-6">
    <form onSubmit={event => {
      event.preventDefault();
      if (ready) onGenerate();
    }} className={`w-full rounded-[20px] bg-[#0d0f10] p-1 ${docked ? "border border-white/10 shadow-2xl" : ""}`}>
      <div className="flex min-h-28 items-end justify-between gap-2 rounded-2xl bg-white/5 p-2 max-sm:flex-wrap">
        <div className="flex min-w-0 flex-1 items-center gap-2 self-stretch">
          <div className="relative flex h-[88px] w-24 shrink-0 justify-center">
            <input ref={referenceInput} type="file" accept={VIDEO_TYPES.join(",")} className="hidden" onChange={event => {
              attachments.setReference(event.target.files);
              event.target.value = "";
            }} />
            {reference ? <div className="relative flex flex-col items-center gap-2">
              <button type="button" onClick={() => referenceInput.current?.click()} aria-label={`Replace reference video ${reference.name}`} className="h-16 w-11 overflow-hidden rounded-[0.625rem] border border-white/20 outline-none focus-visible:ring-2 focus-visible:ring-white">
                <video src={reference.url} muted playsInline preload="metadata" aria-hidden="true" className="size-full object-cover" />
              </button>
              <button type="button" aria-label="Remove reference video" onClick={attachments.clearReference} className={removeButton}><Icon name="plus" className="size-3 rotate-45" /></button>
              <span className="max-w-24 truncate text-[10px] leading-4 text-white/45">{reference.name}</span>
            </div> : <button type="button" onClick={() => referenceInput.current?.click()} className="group flex flex-col items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <span className="flex h-16 w-11 items-center justify-center rounded-[0.625rem] border border-[rgba(197,197,197,0.3)] bg-white/5 text-white mix-blend-luminosity backdrop-blur-[0.233rem] transition-colors group-hover:bg-white/10" style={{ boxShadow: "inset 0 -0.3px 5.4px rgb(214 214 214 / 35%)" }}><Icon name="plus" className="size-4" /></span>
              <span className="whitespace-nowrap text-[10px] leading-4 text-white/45 transition-colors group-hover:text-white">Add reference</span>
            </button>}
          </div>
          <span aria-hidden="true" className="flex h-full shrink-0 items-center py-0.5"><span className="flex h-[72px] w-0 items-center justify-center"><img className="h-px w-[72px] max-w-none rotate-90" width={72} height={1} alt="" src={COMPOSER_DIVIDER} /></span></span>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 self-stretch px-2 py-0.5 text-left">
            <div className="flex min-h-0 flex-1 flex-col gap-1">
              <label htmlFor={promptId} className="text-[10px] leading-4 text-white/45">Make a game about…</label>
              <textarea id={promptId} rows={1} maxLength={20000} value={prompt} onChange={event => onPrompt(event.target.value)} onKeyDown={event => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && ready) onGenerate();
              }} placeholder={placeholder} className="block max-h-24 w-full min-w-0 resize-none overflow-y-auto border-0 bg-transparent p-0 text-base font-semibold leading-6 text-white caret-lime outline-none [field-sizing:content] placeholder:text-white/50" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <input ref={imagesInput} type="file" accept={IMAGE_TYPES.join(",")} multiple className="hidden" onChange={event => {
                attachments.addImages(event.target.files);
                event.target.value = "";
              }} />
              <button type="button" aria-label="Add images" onClick={() => imagesInput.current?.click()} className={`${chip} size-6 justify-center`}><Icon name="plus" className="size-3" /></button>
              {images.map(image => <span key={image.url} className="relative size-6 shrink-0">
                <img src={image.url} alt={image.name} title={image.name} className="size-6 rounded-md object-cover" />
                <button type="button" aria-label={`Remove ${image.name}`} onClick={() => attachments.removeImage(image.url)} className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-[#525557] text-white outline-none hover:bg-[#6a6d70] focus-visible:ring-2 focus-visible:ring-white"><Icon name="plus" className="size-2.5 rotate-45" /></button>
              </span>)}
              <ChipMenu label="Dimension" value={dimension} options={DIMENSION_OPTIONS} onSelect={onDimension} up={docked}>
                <Icon name="cube" className="size-3" /><span className="whitespace-nowrap px-1.5">{dimension}</span>
              </ChipMenu>
              <div className={`${chip} ${genre ? "pr-1" : ""}`}>
                <ChipMenu label="Game genre" value={genre} options={GENRE_OPTIONS} onSelect={onGenre} up={docked}>
                  <Icon name={genre ?? "gamepad"} className="size-3" /><span className="whitespace-nowrap px-1.5">{genre ?? "Game Genre"}</span>
                </ChipMenu>
                {genre && <button type="button" aria-label="Clear game genre" onClick={() => onGenre(null)} className="grid size-4 place-items-center rounded-full text-white/60 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"><Icon name="plus" className="size-3 rotate-45" /></button>}
              </div>
            </div>
          </div>
        </div>
        <button type="submit" disabled={!ready} className="relative w-28 shrink-0 self-stretch overflow-hidden rounded-xl px-3 font-grotesk text-xs font-bold uppercase leading-[14px] tracking-wide outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 max-sm:min-h-11 max-sm:w-full" style={claude ? { background: "linear-gradient(180deg,rgb(255 255 255/.2),transparent),#d97757", color: "#fff" } : { background: "#d1fe17", color: "#000" }}>
          <span className="mx-auto block max-w-16 whitespace-normal text-center max-sm:max-w-none">{claude ? "Generate in Claude" : "Generate"}</span>
        </button>
      </div>
    </form>
    {error && <p role="alert" className="-mt-4 text-xs text-[#ff8a80]">{error}</p>}
    {/* Both states share one grid cell so switching modes doesn't shift the layout. */}
    <div className="grid justify-items-center *:col-start-1 *:row-start-1">
      <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer" aria-hidden={!claude} tabIndex={claude ? undefined : -1} className={`inline-flex h-7 items-center gap-1.5 self-center rounded-full border border-white/15 px-3 text-xs font-medium text-white/70 outline-none transition hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 ${claude ? "" : "invisible"}`}>
        <Icon name="higgsfield" className="size-4" /><span>Connect Higgsfield MCP to generate</span>
      </a>
    </div>
  </div>;
}
