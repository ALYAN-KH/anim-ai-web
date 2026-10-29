"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COLLAPSE, COMMUNITY, ELEMENTS, FAVORITES, HOME, LOGIN, LOGO, PLUS, PRICING, SEARCH, SORT } from "./svg-markup";

const Raw = ({ html, className = "" }: { html: string; className?: string }) => (
  <span aria-hidden className={`inline-flex ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
);

// Gradient tile backgrounds are taken from the original markup.
const NAV = [
  { label: "Home", icon: HOME, bg: "linear-gradient(135deg,#222221 3.87%,#3B3C3A 93.45%)", href: "/generate" },
  { label: "My elements", icon: ELEMENTS, bg: "linear-gradient(135deg,#4188BE 3.87%,#0E2772 93.45%)", href: "/generate/elements" },
  { label: "My favorites", icon: FAVORITES, bg: "linear-gradient(135deg,#E251B4 3.87%,#8D1237 93.45%)", href: "/generate/favorites" },
  { label: "Community", icon: COMMUNITY, bg: "linear-gradient(135deg,#A5A5A5 3.87%,#3D3D3D 93.45%)", href: "/" },
];

function NavTile({ icon, bg }: { icon: string; bg: string }) {
  return (
    <span className="relative block size-6 shrink-0">
      <span className="absolute inset-0 rounded-lg shadow-[0_4px_2px_0_rgba(0,0,0,0.08),inset_0_2px_4px_0_rgba(255,255,255,0.24)]" style={{ background: bg }} />
      <span className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(255,255,255,0.2)_100%)] mix-blend-overlay" />
      <span className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(255,255,255,0.32)_100%)] mix-blend-hard-light" />
      <span className="pointer-events-none absolute inset-0 rounded-lg border border-[rgba(197,197,197,0.24)]" />
      <Raw html={icon} className="absolute inset-0 items-center justify-center" />
    </span>
  );
}

const PROMO_POSTER = "https://static.higgsfield.ai/academy/video-1-thumbnail.webp";
const PROMO_LESSON = "https://d3awfikwcji12s.cloudfront.net/assets/ai-creation__introduction__video__lesson-video.738f244e.mp4";

/** Pop-up player for the full lesson; the video is only mounted (and so only loaded) while it is open. */
function VideoPopup({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    ref.current?.play().catch(() => {}); // blocked autoplay just leaves the controls to start it
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return createPortal(
    <div className="cs-scope fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-6 backdrop-blur-[3px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label="Learn to make movies" className="relative w-full max-w-[960px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,.6)]">
        <button type="button" aria-label="Close video" onClick={onClose} className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80">
          <svg className="size-5" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <video ref={ref} src={PROMO_LESSON} poster={PROMO_POSTER} controls autoPlay playsInline preload="auto" className="aspect-video w-full bg-black" />
      </div>
    </div>,
    document.body,
  );
}

const HF_MARK = <svg width="36" height="36" viewBox="0 0 36 36" className="size-4" aria-hidden="true"><path fill="currentColor" d="m33.03 17.717-.03-.312c-.271-2.997-2.228-8.634-7.654-8.634-4.027 0-7.069 3.962-9.753 7.455-2.143 2.797-3.999 5.197-6.04 5.197-.544-.057-1.243-.327-1.671-.937-.386-.554-.486-1.264-.286-2.116.314-1.35 2.113-2.599 4.012-3.934 1.043-.71 2.114-1.462 2.856-2.186 2.143-2.059 3.228-3.55 3.228-5.95 0-2.399-1.328-3.592-2.442-4.103-2.228-1.022-5.498-.426-7.583 1.363-.314.284-.628.554-.914.81C4.655 6.23 3.242 7.493 0 6.527v3.89c4.298 1.889 7.911-1.718 9.282-3.38 1.057-1.092 2.17-1.732 3-1.732h.042c.371.015.685.157.914.412.372.427.514.924.443 1.477-.157 1.165-1.371 2.528-3.599 4.018-2.613 1.747-6.983 4.672-7.326 8.35-.257 2.641 1.114 5.282 3.256 6.304 4.998 2.357 8.04-1.704 11.267-5.992 2.47-3.308 4.812-6.446 8.068-6.446 2.928 0 4.013 2.413 4.013 3.933v.298l-.286.057c-7.097 1.25-10.967 7.867-10.967 10.92 0 3.052 2.6 5.665 5.798 5.665 3.741 0 8.368-3.18 9.11-12.126l.029-.327H36v-4.132h-2.97Zm-3.87 4.586c-.571 5.353-3.328 7.852-4.998 7.852-.757 0-1.814-.624-1.814-1.789 0-1.306 1.957-5.267 6.355-6.446l.514-.128-.057.511Z" /></svg>;
const CHEVRON_D = ["M5.85459 0.800205C6.04399 0.617147 6.04399 0.320351 5.85459 0.137293C5.66518 -0.0457647 5.35809 -0.0457647 5.16868 0.137293L2.99664 2.23652L0.827959 0.140547C0.638552 -0.0425103 0.331462 -0.0425097 0.142055 0.140549C-0.0473518 0.323607 -0.0473521 0.620403 0.142056 0.80346L2.65369 3.23089C2.8431 3.41395 3.15019 3.41395 3.3396 3.23089L5.85459 0.800205Z", "M0.145444 9.1998C-0.0439625 9.38285 -0.0439617 9.67965 0.145446 9.86271C0.334853 10.0458 0.641943 10.0458 0.83135 9.86271L3.00339 7.76347L5.17204 9.85942C5.36145 10.0425 5.66854 10.0425 5.85794 9.85942C6.04735 9.67636 6.04735 9.37956 5.85794 9.19651L3.34635 6.7691C3.25539 6.68119 3.13203 6.63181 3.00339 6.63181C2.87476 6.63181 2.7514 6.68119 2.66044 6.7691L0.145444 9.1998Z"];

/** Space switcher: the dropdown row sits in the flow (like the original) and Higgsfield AI leads back to the explore page. */
function Switcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <div ref={ref} className={`flex min-w-0 flex-1 flex-col rounded-xl transition-colors duration-150 ${open ? "bg-white/5" : "bg-transparent"}`}>
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)} className="flex h-9 w-full items-center justify-between gap-0.5 rounded-xl bg-white/5 pl-2.5 pr-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] transition-colors duration-150 hover:bg-white/10">
        <span className="flex min-w-0 items-center gap-2"><Raw html={LOGO} className="shrink-0" /><span className="truncate text-sm font-semibold text-white/90">Cinema Studio</span></span>
        <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
          <svg className="size-2.5 text-white/50" viewBox="0 0 6 10">
            {CHEVRON_D.map((d, k) => <path key={k} d={d} fillRule="evenodd" clipRule="evenodd" className="fill-current" style={{ transformBox: "fill-box", transformOrigin: "center", transition: "transform 180ms cubic-bezier(0.77,0,0.175,1)", transform: open ? "none" : "scaleY(-1)" }} />)}
          </svg>
        </span>
      </button>
      <div aria-hidden={!open} className={`grid transition-[grid-template-rows,opacity] duration-[180ms] ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div role="menu" className="mt-0.5">
            <Link href="/" role="menuitem" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="flex h-9 w-full items-center gap-1.5 rounded-xl pl-2.5 pr-3 transition-colors duration-150 hover:bg-white/5">
              <span className="flex size-5 shrink-0 items-center justify-center text-white/50">{HF_MARK}</span>
              <span className="truncate text-sm font-medium text-white/50">Higgsfield AI</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [promo, setPromo] = useState(true);
  const [find, setFind] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [q, setQ] = useState("");
  const hide = collapsed ? "hidden" : "";
  return (
    <>
    {playing && <VideoPopup onClose={() => setPlaying(false)} />}
    <aside style={{ width: collapsed ? 56 : 231 }} className="relative z-30 hidden h-full shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.04] bg-[#18191C] transition-[width] duration-200 md:flex">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden hide-scrollbar">
        <div className={`sticky top-0 z-10 flex min-h-[52px] shrink-0 items-start gap-1 bg-[#18191C] p-2 ${collapsed ? "flex-col items-center" : ""}`}>
          {!collapsed && <Switcher />}
          <button type="button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed((c) => !c)} className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#c8c9cc] transition-colors hover:bg-white/10">
            <Raw html={COLLAPSE} />
          </button>
        </div>

        <nav className="flex shrink-0 flex-col gap-0.5 p-2 pt-1">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className={`flex h-9 items-center gap-2 rounded-xl p-1.5 text-left transition-colors hover:bg-white/5 ${pathname === n.href ? "bg-white/5" : ""}`}>
              <NavTile icon={n.icon} bg={n.bg} />
              <span className={`truncate text-sm font-medium text-white ${hide}`}>{n.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 flex-col px-2 pb-2">
          <div className={`relative flex h-9 items-center px-1.5 pt-4 ${hide}`} style={{ marginTop: 10, height: 36 }}>
            {find ? (
              <div className="flex h-9 w-full items-center gap-1.5 rounded-xl border border-white/10 bg-[#202225] px-1.5">
                <Raw html={SEARCH} className="text-[#8b8c91]" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find project.." className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-[#8b8c91]" />
                <button aria-label="Close search" onClick={() => { setFind(false); setQ(""); }} className="text-[#8b8c91] hover:text-white">×</button>
              </div>
            ) : (
              <>
                <p className="flex-1 truncate text-[12px] font-medium text-[#8b8c91]">Projects</p>
                <button aria-label="Search projects" onClick={() => setFind(true)} className="flex size-6 items-center justify-center rounded-lg text-[#8b8c91] hover:bg-white/5 hover:text-white"><Raw html={SEARCH} /></button>
                <button aria-label="Sort projects" className="flex size-6 items-center justify-center rounded-lg text-[#8b8c91] hover:bg-white/5 hover:text-white"><Raw html={SORT} /></button>
              </>
            )}
          </div>
          <Link href="/signup" className={`mt-1.5 flex h-9 w-full items-center gap-2 rounded-xl px-1.5 text-left text-[14px] font-medium text-[#8b8c91] transition-colors hover:text-white ${collapsed ? "justify-center px-0" : ""}`}>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[rgba(197,197,197,0.3)] bg-white/[0.08] shadow-[inset_0_-0.3px_5.36px_rgba(185,185,185,0.35),0_5.06px_5.65px_rgba(0,0,0,0.1)]"><Raw html={PLUS} /></span>
            <span className={`truncate ${hide}`}>New project</span>
          </Link>
        </div>

        {promo && !collapsed && (
          <div className="relative mx-2 mb-2 shrink-0 rounded-2xl bg-[#232427] p-3 pb-2.5">
            <button aria-label="Dismiss" onClick={() => setPromo(false)} className="absolute right-2.5 top-2 text-[#8b8c91] hover:text-white">×</button>
            <p className="text-[12px] text-[#9a9ba0]">Learn to make movies</p>
            <p className="mt-1.5 text-[15px] font-semibold leading-tight text-white">Practical workflows from working AI filmmakers</p>
            <button type="button" aria-label="Play: Learn to make movies" onClick={() => setPlaying(true)} className="group relative mt-3 block h-[105px] w-full overflow-hidden rounded-lg border border-white/10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PROMO_POSTER} alt="" draggable={false} className="size-full object-cover" />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30">
                <span className="flex size-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm"><svg className="ml-0.5 size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg></span>
              </span>
            </button>
            <Link href="/academy" className="mt-3 flex h-10 w-full items-center justify-center rounded-lg bg-white text-[14px] font-medium text-black transition hover:bg-white/90">Learn more</Link>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1 border-t border-white/[0.06] p-2">
        <Link href="/pricing" className="flex h-9 items-center gap-2 rounded-xl px-2.5 text-[14px] font-medium text-white transition hover:bg-white/5">
          <span className="text-[#ff2d78]"><Raw html={PRICING} /></span>
          <span className={hide}>Pricing</span>
          <span className={`ml-auto rounded-full bg-[#ff1f6d] px-1.5 py-[1px] text-[9px] font-bold tracking-wide text-white ${hide}`}>30% OFF</span>
        </Link>
        <Link href="/signup" aria-label="Log in" className="flex h-9 items-center gap-2 rounded-xl border-[1.5px] border-lime bg-lime px-3 text-sm font-medium text-black transition-colors hover:border-[#c5f015] hover:bg-[#c5f015]">
          <Raw html={LOGIN} /><span className={hide}>Log in</span>
        </Link>
      </div>
    </aside>
    </>
  );
}
