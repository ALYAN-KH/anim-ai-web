"use client";
import Link from "next/link";
import { useState } from "react";
import { CHAR_TABS } from "./data";
import { IconClose, IconSearch, Modal } from "./ui";

// Promo artwork supplied with the reference (public/cinema-studio/characters).
const FACES = [
  { src: "/cinema-studio/characters/1.png", rot: -7, w: 124, x: 0, y: 30 },
  { src: "/cinema-studio/characters/2.png", rot: 5, w: 124, x: 104, y: 14 },
  { src: "/cinema-studio/characters/3.png", rot: 0, w: 116, x: 214, y: 26, round: true },
  { src: "/cinema-studio/characters/4.png", rot: 6, w: 124, x: 316, y: 4 },
];

// Characters live in the user's account; there is no characters API wired here, so the list is always empty.
export function CharacterModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const characters: { name: string; family: string }[] = [];
  const shown = characters.filter((c) => (tab === "All" || c.family === tab) && c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal onClose={onClose} width={960} height={700}>
      <div className="relative flex min-w-0 flex-1 flex-col bg-[#1d1e20]">
        <button aria-label="Close" onClick={onClose} className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"><IconClose s={18} /></button>
        <div className="relative flex shrink-0 items-start justify-between overflow-hidden px-8 pb-7 pt-8">
          <div className="max-w-[420px]">
            <h2 className="cs-heading !bg-none !text-white text-[32px] leading-none [-webkit-text-fill-color:#fff]">Make your own character</h2>
            <p className="mt-3 text-[15px] leading-snug text-[#b4b5ba]">Upload photos from multiple angles to train your character. Then use the same consistent character across new images and videos.</p>
            <Link href="/character/upload" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#d1fe17] px-5 text-[16px] font-semibold text-black shadow-[0_3px_0_#8fb30a] transition hover:brightness-105 active:translate-y-[2px] active:shadow-none">Create character <span aria-hidden>✦</span></Link>
          </div>
          <div className="relative -mr-8 mt-0 hidden h-[170px] w-[440px] md:block">
            {FACES.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={f.src} alt="" draggable={false} className={`absolute border-2 border-white/15 object-cover shadow-[0_12px_30px_rgba(0,0,0,.5)] ${f.round ? "rounded-full" : "rounded-2xl"}`} style={{ left: f.x, top: f.y, width: f.w, height: f.w, transform: `rotate(${f.rot}deg)`, zIndex: i }} />
            ))}
          </div>
        </div>
        <div className="mx-2 mb-2 flex min-h-0 flex-1 flex-col rounded-[22px] bg-[#232427]">
          <div className="flex items-center justify-between gap-3 p-2.5">
            <div className="flex gap-1">
              {CHAR_TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`h-9 rounded-xl px-4 text-[14px] font-semibold transition ${tab === t ? "bg-[#37383c] text-white" : "text-[#9a9ba0] hover:text-white"}`}>{t}</button>
              ))}
            </div>
            <label className="flex h-10 w-[300px] items-center gap-2 rounded-xl border border-white/[0.06] bg-[#2a2b2e] px-3 text-[#8d8e93]">
              <IconSearch s={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#8d8e93]" />
            </label>
          </div>
          <div className="flex flex-1 items-center justify-center pb-16 text-[17px] text-[#c6c7cb]">
            {shown.length ? null : q || tab !== "All" ? "No characters found." : "No characters yet. Create your first one!"}
          </div>
        </div>
      </div>
    </Modal>
  );
}
