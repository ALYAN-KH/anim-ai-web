"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GenerationsPanel } from "../video-studio/assets/generations-panel";
import { AvatarsPanel, NewAvatarDialog, type Avatar } from "./avatars-panel";

const TABS = [
  { id: "uploads", label: "Uploads" },
  { id: "generations", label: "Generations" },
  { id: "liked", label: "Liked" },
  { id: "products", label: "Products" },
] as const;
type TabId = (typeof TABS)[number]["id"] | "avatars";

export interface PickedProduct { url: string; name: string }

const GRID = "grid auto-rows-max content-start gap-3 grid-cols-[repeat(auto-fill,minmax(178px,178px))]";

function UploadTile({ label, onFiles }: { label: string; onFiles: (files: FileList) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
        className="flex aspect-[178/176] cursor-pointer flex-col items-center justify-center gap-2 rounded-[0.625rem] border border-dashed border-white/10 bg-white/5 outline-none transition-colors hover:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-q-border-focus"
      >
        <span className="flex size-[54px] items-center justify-center rounded-full border border-[rgba(197,197,197,0.3)] bg-white/5 text-white shadow-[inset_0_-0.3px_5.36px_rgba(185,185,185,0.35),0_5.06px_5.65px_rgba(0,0,0,0.1),0_20.53px_10.27px_rgba(0,0,0,0.09),0_46.42px_13.99px_rgba(0,0,0,0.05)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.5 19.062a5.17 5.17 0 0 0 3.75-4.99c0-2.86-2.294-5.18-5.125-5.18-.559 0-1.097.091-1.6.258-1.096-2.587-3.639-4.4-6.6-4.4C4.962 4.75 1.75 7.996 1.75 12a7.26 7.26 0 0 0 3.75 6.372m9-2.122-2.5-2.5-2.5 2.5M12 20v-5.75" />
          </svg>
        </span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) onFiles(e.target.files); e.target.value = ""; }} />
    </>
  );
}

function Thumb({ item, onPick }: { item: PickedProduct; onPick: (p: PickedProduct) => void }) {
  return (
    <button type="button" aria-label={item.name} onClick={() => onPick(item)} className="relative aspect-[178/176] overflow-hidden rounded-[0.625rem] bg-white/5 outline-none ring-white transition-shadow hover:ring-2 focus-visible:ring-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={item.url} draggable={false} className="absolute inset-0 size-full object-cover" />
    </button>
  );
}

/** `avatars` adds the Avatars tab (only for templates that can swap a person) and opens on it. */
export function ProductPicker({ onClose, onSelect, avatars = false, onSelectAvatar }: { onClose: () => void; onSelect: (p: PickedProduct) => void; avatars?: boolean; onSelectAvatar?: (a: Avatar) => void }) {
  const tabs: readonly { id: TabId; label: string }[] = avatars ? [...TABS, { id: "avatars", label: "Avatars" }] : TABS;
  const [tab, setTab] = useState<TabId>(avatars ? "avatars" : "products");
  const [myAvatars, setMyAvatars] = useState<Avatar[]>([]);
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [uploads, setUploads] = useState<PickedProduct[]>([]);
  const [products, setProducts] = useState<PickedProduct[]>([]);
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const made = urls.current;
    return () => { document.removeEventListener("keydown", onKey); made.forEach((u) => URL.revokeObjectURL(u)); };
  }, [onClose]);

  const toItems = (files: FileList): PickedProduct[] => Array.from(files).filter((f) => f.type.startsWith("image/")).map((f) => {
    const url = URL.createObjectURL(f); urls.current.push(url); return { url, name: f.name.replace(/\.[^.]+$/, "") };
  });
  const addUploads = (files: FileList) => setUploads((l) => [...toItems(files), ...l]);
  const addProducts = (files: FileList) => setProducts((l) => [...toItems(files), ...l]);
  const addLink = () => {
    const url = link.trim(); if (!/^https?:\/\//i.test(url)) return;
    setProducts((l) => [{ url, name: url.split("/").pop()?.split("?")[0] || "Product" }, ...l]); setLink(""); setLinkOpen(false); setTab("products");
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Select product" className="flex h-[min(745px,calc(100vh-32px))] w-[min(1200px,100%)] flex-col rounded-[2rem] border border-white/10 bg-[#1d1f20] shadow-2xl">
        <div className="flex h-[72px] shrink-0 items-center justify-between gap-3 px-6">
          <div role="tablist" aria-label="Media sources" className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {tabs.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-1 focus-visible:ring-q-border-focus ${tab === t.id ? "bg-white text-black" : "text-white/50 hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {linkOpen ? (
              <input autoFocus value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addLink(); if (e.key === "Escape") { e.stopPropagation(); setLinkOpen(false); } }} placeholder="Paste image link…"
                className="h-10 w-64 rounded-full bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30" />
            ) : (
              <button type="button" onClick={() => setLinkOpen(true)} className="h-10 rounded-full bg-white/10 px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-q-border-focus">Upload from link</button>
            )}
            <button type="button" aria-label="Close" onClick={onClose} className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-q-border-focus">
              <svg className="size-4" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-2 pt-0">
          <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] bg-[#28292b]">
            {tab === "avatars" && (
              <AvatarsPanel myAvatars={myAvatars} pinned={pinned} onCreate={() => setCreating(true)} onSelect={(a) => onSelectAvatar?.(a)}
                onPin={(id) => setPinned((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; })} />
            )}
            {tab === "generations" && <GenerationsPanel key="generations" kind="image" />}
            {tab === "liked" && <GenerationsPanel key="liked" kind="liked" />}
            {tab === "uploads" && (
              <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
                <div className={GRID}>
                  <UploadTile label="Upload file" onFiles={addUploads} />
                  {uploads.map((u) => <Thumb key={u.url} item={u} onPick={onSelect} />)}
                </div>
              </div>
            )}
            {tab === "products" && (
              <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
                <div className={GRID}>
                  <UploadTile label="Add product" onFiles={addProducts} />
                  {products.map((p) => <Thumb key={p.url} item={p} onPick={onSelect} />)}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      {creating && <NewAvatarDialog onClose={() => setCreating(false)} onCreated={(a) => { setMyAvatars((l) => [a, ...l]); setCreating(false); }} />}
    </div>,
    document.body,
  );
}
