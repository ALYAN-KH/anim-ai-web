"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { Icon } from "./Icon";
import { ACCEPT, type Uploads } from "./uploads";

const BADGE_SHADOW = "shadow-[0_128.852px_18.004px_rgba(0,0,0,0),0_82.429px_16.516px_rgba(0,0,0,0.01),0_46.422px_13.986px_rgba(0,0,0,0.05),0_20.533px_10.266px_rgba(0,0,0,0.09),0_5.059px_5.654px_rgba(0,0,0,0.1),inset_0_-0.298px_5.356px_rgba(185,185,185,0.35)]";
const DASHED = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect x='0.5' y='0.5' width='calc(100%25 - 1px)' height='calc(100%25 - 1px)' rx='8' ry='8' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1' stroke-dasharray='4 4'/%3E%3C/svg%3E\")";

function useDrop(uploads: Uploads, replace: boolean) {
  const [over, setOver] = useState(false);
  return {
    over,
    handlers: {
      onDragOver: (e: DragEvent) => { e.preventDefault(); setOver(true); },
      onDragLeave: () => setOver(false),
      onDrop: (e: DragEvent) => { e.preventDefault(); setOver(false); void uploads.add(e.dataTransfer.files, replace); },
    },
  };
}

function FileInput({ uploads, kind, multiple, inputRef, replace }: { uploads: Uploads; kind: "image" | "video"; multiple: boolean; inputRef: React.RefObject<HTMLInputElement>; replace: boolean }) {
  return (
    <input
      ref={inputRef}
      type="file"
      hidden
      accept={ACCEPT[kind]}
      multiple={multiple}
      onChange={(e) => { if (e.target.files) void uploads.add(e.target.files, replace); e.target.value = ""; }}
    />
  );
}

function Thumb({ url, kind, label, onRemove }: { url: string; kind: "image" | "video"; label: string; onRemove?: () => void }) {
  return (
    <span className="relative block size-full overflow-hidden rounded-lg bg-white/5">
      {kind === "video" ? <video src={url} muted playsInline loop autoPlay className="size-full object-cover" /> : <img src={url} alt={label} className="size-full object-cover" />}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="absolute right-1 top-1 z-20 grid size-6 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80">
          <Icon name="close" className="size-3.5" />
        </button>
      )}
    </span>
  );
}

/** Sidebar dashed upload tile ("Upload your photo", "Add style reference"). */
export function UploadTile({ uploads, label, icon, optional = false, multiple = false }: { uploads: Uploads; label: string; icon: string; optional?: boolean; multiple?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const { over, handlers } = useDrop(uploads, !multiple);
  const files = uploads.files;
  const open = () => input.current?.click();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div aria-busy={uploads.busy} className="relative rounded-xl bg-white/5 p-1" {...handlers}>
        <div className={`relative flex h-[104px] w-full min-w-0 items-center justify-center overflow-hidden rounded-lg ${over ? "bg-white/[0.08]" : ""}`}>
          <div className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border border-dashed border-white/10" />
          {files.length === 0 ? (
            <>
              <div className="relative flex size-full min-w-0 flex-row items-center justify-center gap-3 p-4 text-left">
                {optional && <span className="absolute right-1 top-1 rounded-xl bg-black/20 px-2 py-1 text-[10px] font-medium leading-[14px] text-[#828282]">Optional</span>}
                <span className={`grid size-9 place-items-center rounded-full border border-white/5 bg-white/[0.04] mix-blend-luminosity backdrop-blur-[4px] ${BADGE_SHADOW}`}>
                  <Icon markup={icon} className="size-4 text-[#898a8b]" />
                </span>
                <span className="max-w-full truncate text-sm font-semibold leading-4 text-white">{uploads.busy ? "Uploading…" : label}</span>
              </div>
              <button type="button" onClick={open} aria-label={label} className="absolute inset-0 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime" />
            </>
          ) : (
            <div className="relative z-[2] flex size-full items-center gap-2 p-2">
              {files.map((f) => (
                <span key={f.id} className="aspect-square h-full">
                  <Thumb url={f.url} kind={f.kind} label={f.file.name} onRemove={() => uploads.remove(f.id)} />
                </span>
              ))}
              <button type="button" onClick={open} className="ml-auto self-end rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                {multiple ? "Add more" : "Replace"}
              </button>
            </div>
          )}
        </div>
      </div>
      {uploads.error && <p role="alert" className="px-1 text-xs text-[#ff6b6b]">{uploads.error}</p>}
      <FileInput uploads={uploads} kind="image" multiple={multiple} inputRef={input} replace={!multiple} />
    </div>
  );
}

function Badge({ icon, first }: { icon: string; first?: boolean }) {
  return (
    <span className={`relative flex size-9 shrink-0 items-center justify-center ${first ? "" : "-ml-2"}`}>
      <span className="absolute inset-0 rounded-full bg-[#131517]" />
      <span className="absolute inset-0 rounded-full border border-[rgba(197,197,197,0.30)] bg-white/[0.04] mix-blend-luminosity shadow-[0_128.9px_36px_rgba(0,0,0,0),0_82.4px_33px_rgba(0,0,0,0.01),0_46.4px_28px_rgba(0,0,0,0.05),0_20.5px_20.5px_rgba(0,0,0,0.09),0_5px_11.3px_rgba(0,0,0,0.10),inset_0_-0.3px_5.36px_rgba(185,185,185,0.35)] backdrop-blur-[4px]" />
      <Icon name={icon} className="relative size-4" />
    </span>
  );
}

type DropProps = {
  uploads: Uploads;
  kind: "image" | "video";
  label: string;
  title: ReactNode;
  hint: string;
  badges: string[];
  multiple?: boolean;
  /** Media chosen from a preset instead of uploaded. */
  preset?: { url: string; thumb?: string }[];
  onClearPreset?: () => void;
  extra?: ReactNode;
  invalid?: boolean;
  /** Opens a media picker anchored to the zone instead of the plain file dialog. */
  onOpen?: (anchor: DOMRect) => void;
};

/** Motion-tab drop zone with the reference's dashed frame and stacked badges. */
export function MotionDrop({ uploads, kind, label, title, hint, badges, multiple = false, preset = [], onClearPreset, extra, invalid, onOpen }: DropProps) {
  const input = useRef<HTMLInputElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const open = () => (onOpen && zone.current ? onOpen(zone.current.getBoundingClientRect()) : input.current?.click());
  const { over, handlers } = useDrop(uploads, !multiple);
  const filled = uploads.files.length > 0 || preset.length > 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`relative flex flex-col items-center justify-center gap-3 self-stretch rounded-xl bg-white/5 p-1 ${invalid ? "ring-1 ring-inset ring-[#ff6b6b]/60" : ""}`} {...handlers}>
        <div ref={zone} className={`relative flex h-40 flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-lg p-4 max-md:h-[180px] ${over ? "bg-white/[0.08]" : ""}`}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg" style={{ backgroundImage: DASHED }} />
          {filled ? (
            <div className="relative z-20 flex size-full items-center gap-2 overflow-x-auto">
              {preset.map((m) => (
                <span key={m.url} className={`h-full shrink-0 ${kind === "video" ? "aspect-[9/16]" : "aspect-square"}`}>
                  <Thumb url={kind === "video" ? m.url : m.thumb || m.url} kind={kind} label="Preset media" onRemove={onClearPreset} />
                </span>
              ))}
              {uploads.files.map((f) => (
                <span key={f.id} className={`h-full shrink-0 ${kind === "video" ? "aspect-[9/16]" : "aspect-square"}`}>
                  <Thumb url={f.url} kind={f.kind} label={f.file.name} onRemove={() => uploads.remove(f.id)} />
                </span>
              ))}
              <button type="button" onClick={open} className="ml-auto shrink-0 self-end rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                {multiple ? "Add more" : "Replace"}
              </button>
            </div>
          ) : (
            <>
              <button type="button" aria-label={label} onClick={open} className="absolute inset-0 z-10 rounded-[inherit] outline-none hover:bg-white/[0.03] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-lime" />
              <span className="isolate flex items-center">{badges.map((b, i) => <Badge key={b} icon={b} first={i === 0} />)}</span>
              <span className="pointer-events-none flex w-full flex-col items-center gap-1.5 text-center">
                <span className="text-center text-sm font-semibold leading-4 text-white">{uploads.busy ? "Uploading…" : title}</span>
                <span className="text-xs leading-4 text-[#898a8b]">{hint}</span>
              </span>
              {extra}
            </>
          )}
        </div>
      </div>
      {uploads.error && <p role="alert" className="px-1 text-xs text-[#ff6b6b]">{uploads.error}</p>}
      <FileInput uploads={uploads} kind={kind} multiple={multiple} inputRef={input} replace={!multiple} />
    </div>
  );
}
