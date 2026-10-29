"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface Avatar { id: string; name: string; url: string; gender?: "male" | "female" }

const img = (id: string, w = 640) => `https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=${w},quality=85/https://cdn.higgsfield.ai/marketing_studio_avatar/${id}.webp`;
const make = (name: string, id: string, gender: "male" | "female"): Avatar => ({ id, name, gender, url: img(id) });

// Taken from the live avatar list; the rest of the list wasn't in the pasted markup.
export const AVATARS: Avatar[] = [
  make("Jayden", "ee72d8eb-a5e0-4092-a830-34bba04e47ea", "male"),
  make("Stefan", "638f1fc1-7010-47ae-b016-e83fc55d91a5", "male"),
  make("Mei", "81618a7c-9c70-4885-8b02-6b0d12837205", "female"),
  make("Yuna", "4c6df1c6-a407-46b4-85e9-889f28f2a601", "female"),
  make("Adriana", "ad239596-46ae-476c-8967-bbbc1af3c622", "female"),
  make("Clara", "657f6c77-f196-456e-8d38-c822faafe993", "female"),
  make("Maria", "cfca7330-6317-4217-9f02-0b76a2d49f6b", "female"),
  make("Sofia", "cd4c64ff-555d-4387-bedb-73ee12629a2b", "female"),
  make("Valentina", "67d87b01-e3c3-4e39-8a94-ed9b23f3c232", "female"),
  make("Jia", "8d5948e6-db10-46b2-b48f-9728fba0b6c4", "female"),
  make("Lily", "c7f92e84-48fb-43ea-b718-5fbec457e52f", "female"),
];

type Cat = "all" | "pinned" | "my_avatars" | "ai_influencers";

const PIN_PATH = "M8.37498 15.625L12.7982 20.0483C13.3374 20.5874 14.2574 20.3491 14.4669 19.6159L16.3881 12.8915C16.4598 12.6405 16.6269 12.4275 16.8535 12.298L20.6132 10.1496C21.1857 9.82246 21.2904 9.04049 20.8242 8.57425L15.4258 3.17581C14.9595 2.70956 14.1776 2.81428 13.8504 3.38678L11.702 7.1465C11.5725 7.37315 11.3595 7.54017 11.1085 7.61189L4.38411 9.53313C3.65096 9.74261 3.41256 10.6626 3.95172 11.2018L8.37498 15.625ZM8.37498 15.625L8.38233 15.6177M8.37498 15.625L3.74998 20.25";

function PinIcon({ className = "size-4" }: { className?: string }) {
  return <svg className={className} aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={PIN_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const NAV: { id: Cat; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="size-4 shrink-0">
      <path fill="currentColor" d="M19.67 1.415a.75.75 0 0 0-1.34 0l-.972 1.943-1.943.971a.75.75 0 0 0 0 1.342l1.943.971.971 1.943a.75.75 0 0 0 1.342 0l.971-1.943 1.943-.971a.75.75 0 0 0 0-1.342l-1.943-.971z" />
      <path fill="currentColor" fillRule="evenodd" d="M4.5 4.75a.25.25 0 0 1 .25-.25h6.5a.75.75 0 0 0 0-1.5h-6.5A1.75 1.75 0 0 0 3 4.75v14.5c0 .966.784 1.75 1.75 1.75h14.5A1.75 1.75 0 0 0 21 19.25v-6.5a.75.75 0 0 0-1.5 0v6.5a.25.25 0 0 1-.25.25h-1.84a5.501 5.501 0 0 0-10.82 0H4.75a.25.25 0 0 1-.25-.25z" clipRule="evenodd" />
      <path fill="currentColor" d="M12 7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
    </svg>) },
  { id: "pinned", label: "Pinned", icon: <PinIcon className="size-4 shrink-0" /> },
  { id: "my_avatars", label: "My avatars", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="size-4 shrink-0">
      <path stroke="currentColor" strokeWidth="1.5" d="M13.986 7.75h.028a.25.25 0 0 1 .233.16l1.344 3.494a1.75 1.75 0 0 0 1.005 1.005l3.494 1.344a.25.25 0 0 1 .16.233v.028a.25.25 0 0 1-.16.233l-3.494 1.344a1.75 1.75 0 0 0-.93.836l-.075.169-1.344 3.494a.25.25 0 0 1-.233.16h-.028a.25.25 0 0 1-.233-.16l-1.344-3.494a1.75 1.75 0 0 0-.836-.93l-.169-.075-3.494-1.344a.25.25 0 0 1-.16-.233v-.028a.25.25 0 0 1 .16-.233l3.494-1.344a1.75 1.75 0 0 0 1.005-1.005l1.344-3.494a.25.25 0 0 1 .233-.16ZM7.541 5.454A1.75 1.75 0 0 0 8.546 6.46L9.95 7l-1.405.541A1.75 1.75 0 0 0 7.54 8.546L7 9.95l-.541-1.405A1.75 1.75 0 0 0 5.454 7.54L4.048 7l1.406-.541A1.75 1.75 0 0 0 6.46 5.454L7 4.048z" />
    </svg>) },
  { id: "ai_influencers", label: "AI Influencers", icon: (
    <svg aria-hidden="true" className="size-4 shrink-0" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.25 15.75L4.75 20.25M7.25 10.75L2.75 15.25M16.25 15.75L11.75 20.25M13.0718 4.98976L9.88977 5.72672C9.52262 5.81176 9.37795 6.25699 9.625 6.5416L11.7661 9.00817C11.8549 9.11041 11.8984 9.24428 11.8867 9.37917L11.6043 12.6332C11.5717 13.0087 11.9504 13.2838 12.2975 13.1368L15.305 11.8627C15.4296 11.8099 15.5704 11.8099 15.695 11.8627L18.7025 13.1368C19.0496 13.2838 19.4283 13.0087 19.3957 12.6332L19.1133 9.37917C19.1016 9.24428 19.1451 9.11041 19.2339 9.00817L21.375 6.5416C21.6221 6.25699 21.4774 5.81176 21.1102 5.72672L17.9282 4.98976C17.7963 4.95921 17.6824 4.87648 17.6126 4.76047L15.9284 1.96191C15.7341 1.639 15.2659 1.639 15.0716 1.96191L13.3874 4.76047C13.3176 4.87648 13.2037 4.95921 13.0718 4.98976Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>) },
];
const TITLES: Record<Cat, string> = { all: "All avatars", pinned: "Pinned avatars", my_avatars: "My avatars", ai_influencers: "AI Influencers" };

function CreateTile({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex min-w-0 flex-col items-center gap-2 text-sm font-medium text-white outline-none">
      <span className="relative flex aspect-[211/252] w-full items-center justify-center overflow-hidden rounded-xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors group-hover:bg-white/10 group-focus-visible:ring-2 group-focus-visible:ring-white/40">
        <span className="relative flex h-11 w-8 rotate-[4deg] items-center justify-center rounded-lg border border-white/20 bg-white/5 shadow-[0_1.25rem_0.625rem_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="size-4 text-white"><path d="M7.49951 13.334V8.5H2.6665C2.39036 8.5 2.1665 8.27614 2.1665 8C2.16668 7.72401 2.39047 7.5 2.6665 7.5H7.49951V2.66699C7.49951 2.39096 7.72352 2.16717 7.99951 2.16699C8.27565 2.16699 8.49951 2.39085 8.49951 2.66699V7.5H13.3335L13.4341 7.51074C13.6617 7.55742 13.8333 7.75859 13.8335 8C13.8335 8.24158 13.6619 8.44356 13.4341 8.49023L13.3335 8.5H8.49951V13.334C8.49934 13.61 8.27555 13.834 7.99951 13.834C7.72363 13.8338 7.49969 13.6099 7.49951 13.334Z" fill="currentColor" /></svg>
        </span>
      </span>
      <span className="max-w-full truncate">Create avatar</span>
    </button>
  );
}

function AvatarCard({ a, pinned, onPin, onSelect }: { a: Avatar; pinned: boolean; onPin: () => void; onSelect: () => void }) {
  return (
    <div className="group relative flex min-w-0 flex-col gap-2">
      <div className="relative aspect-[211/252] w-full shrink-0">
        <button type="button" aria-label={`Select avatar ${a.name}`} onClick={onSelect} className="relative flex size-full overflow-hidden rounded-xl border-2 border-transparent text-left outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#d1fe17]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={a.name} loading="lazy" decoding="async" src={a.url} className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />
        </button>
        <button type="button" aria-label={pinned ? "Unpin avatar" : "Pin avatar"} onClick={onPin} className={`absolute left-2 top-2 z-20 flex size-7 items-center justify-center rounded-full border border-white/[0.06] bg-black/40 text-white backdrop-blur-[2px] outline-none transition-opacity duration-200 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#d1fe17] ${pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}>
          <PinIcon />
        </button>
        <button type="button" onClick={onSelect} className="absolute inset-x-2 bottom-2 z-20 flex h-7 translate-y-1 items-center justify-center whitespace-nowrap rounded-full border border-[#d1fe17] bg-[#d1fe17] px-2 text-xs font-semibold text-[#131416] opacity-0 outline-none transition-all duration-200 hover:brightness-95 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">Select avatar</button>
      </div>
      <p className="max-w-full truncate text-center text-sm font-medium text-white">{a.name}</p>
    </div>
  );
}

export function AvatarsPanel({ myAvatars, pinned, onPin, onSelect, onCreate }: { myAvatars: Avatar[]; pinned: Set<string>; onPin: (id: string) => void; onSelect: (a: Avatar) => void; onCreate: () => void }) {
  const router = useRouter();
  const [cat, setCat] = useState<Cat>("all");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const pool = cat === "all" ? [...myAvatars, ...AVATARS] : cat === "my_avatars" ? myAvatars : cat === "pinned" ? [...myAvatars, ...AVATARS].filter((a) => pinned.has(a.id)) : [];
  const list = gender ? pool.filter((a) => !a.gender || a.gender === gender) : pool;
  return (
    <div className="flex min-h-0 flex-1 gap-px overflow-hidden rounded-2xl">
      <aside className="flex w-46 shrink-0 flex-col bg-white/5 p-3" style={{ width: 184 }}>
        <nav aria-label="Avatar categories" className="flex w-40 flex-col gap-0.5">
          {NAV.map((n) => (
            <button key={n.id} type="button" value={n.id} aria-pressed={cat === n.id} onClick={() => setCat(n.id)} className={`flex h-9 w-full items-center gap-2 rounded-lg py-2 pl-2 pr-3 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-1 focus-visible:ring-white/40 ${cat === n.id ? "bg-white/5 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              {n.icon}<span className="min-w-0 flex-1 truncate">{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white/5 p-3">
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-1">
          <header className="flex shrink-0 items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-white/50">{TITLES[cat]}</h2>
            {cat !== "ai_influencers" && (
              <div className="flex items-center gap-1">
                {(["male", "female"] as const).map((g) => (
                  <button key={g} type="button" aria-pressed={gender === g} onClick={() => setGender(gender === g ? null : g)} className={`h-8 rounded-full border px-3 text-xs font-semibold capitalize outline-none transition-colors focus-visible:ring-1 focus-visible:ring-white/40 ${gender === g ? "border-white bg-white text-black" : "border-white/10 bg-[#1d1f20] text-white hover:bg-white/10"}`}>{g}</button>
                ))}
              </div>
            )}
          </header>
          {cat === "ai_influencers" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-24">
              <p className="text-base font-medium text-white/50">No AI influencers yet</p>
              <button type="button" onClick={() => router.push("/ai-influencer-studio")} className="h-10 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/40">Create an AI influencer</button>
            </div>
          ) : (
            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
              <div className="grid grid-cols-5 gap-x-2 gap-y-3">
                <CreateTile onClick={onCreate} />
                {list.map((a) => <AvatarCard key={a.id} a={a} pinned={pinned.has(a.id)} onPin={() => onPin(a.id)} onSelect={() => onSelect(a)} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const ACCENT = { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "-0.04em" };
const BACK = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path d="M10 6l-6 6 6 6M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const SPARK = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path d="M13.986 7.75h.028a.25.25 0 0 1 .233.16l1.344 3.494a1.75 1.75 0 0 0 1.005 1.005l3.494 1.344a.25.25 0 0 1 .16.233v.028a.25.25 0 0 1-.16.233l-3.494 1.344a1.75 1.75 0 0 0-.93.836l-.075.169-1.344 3.494a.25.25 0 0 1-.233.16h-.028a.25.25 0 0 1-.233-.16l-1.344-3.494a1.75 1.75 0 0 0-.836-.93l-.169-.075-3.494-1.344a.25.25 0 0 1-.16-.233v-.028a.25.25 0 0 1 .16-.233l3.494-1.344a1.75 1.75 0 0 0 1.005-1.005l1.344-3.494a.25.25 0 0 1 .233-.16Z" fill="currentColor" /></svg>;
const CLOUD = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.5 19.062a5.17 5.17 0 0 0 3.75-4.99c0-2.86-2.294-5.18-5.125-5.18-.559 0-1.097.091-1.6.258-1.096-2.587-3.639-4.4-6.6-4.4C4.962 4.75 1.75 7.996 1.75 12a7.26 7.26 0 0 0 3.75 6.372m9-2.122-2.5-2.5-2.5 2.5M12 20v-5.75" /></svg>;
const PHOTO = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /><path d="m4 17 4.5-4.5 3 3L15 12l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;

/** "New avatar" flow: choose Generate or Upload, then the matching form. */
export function NewAvatarDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (a: Avatar) => void }) {
  const [view, setView] = useState<"choose" | "generate" | "upload">("choose");
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const ready = !!photo && name.trim().length > 0;
  const collage = [AVATARS[7], AVATARS[1], AVATARS[0], AVATARS[2]];
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="New avatar" className="flex h-[min(752px,calc(100vh-32px))] w-[min(1116px,100%)] flex-col rounded-[2rem] border border-white/10 bg-[#1d1f20] p-8 pt-6 shadow-2xl" style={{ background: view === "generate" ? "#16181a" : "#1d1f20" }}>
        <div className="relative flex h-10 shrink-0 items-center justify-center">
          {view !== "choose" && <button type="button" aria-label="Back" onClick={() => setView("choose")} className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20">{BACK}</button>}
          <h2 className={`text-base font-semibold text-white ${view === "choose" ? "absolute left-0" : ""}`}>New avatar</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="absolute right-0 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white outline-none transition-colors hover:bg-white/20">
            <svg className="size-4" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          {view === "choose" && (
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
              {([["generate", "Generate", "From a text prompt"], ["upload", "Upload", "Turn any photo into an avatar"]] as const).map(([id, t, s]) => (
                <button key={id} type="button" onClick={() => setView(id)} className="group flex flex-col items-center justify-end gap-1 rounded-2xl bg-white/[0.06] pb-8 text-center outline-none transition-colors hover:bg-white/[0.09] focus-visible:ring-1 focus-visible:ring-white/40">
                  <span className="mb-auto mt-[38%] flex flex-col items-center">
                    <span className="mb-[-8px] flex gap-1 opacity-30"><span className="h-10 w-9 -rotate-3 rounded-lg border border-dashed border-white" /><span className="h-12 w-9 rotate-3 rounded-lg border border-dashed border-white" /></span>
                    <span className="flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-[#2a2c2e] px-4 text-base text-white/80 shadow-xl">
                      {id === "generate" ? <>Young UGC creator<span className="ml-6 text-white/50">{SPARK}</span></> : <>{PHOTO}Uploaded photo</>}
                    </span>
                  </span>
                  <span className="text-lg font-semibold text-white">{t}</span>
                  <span className="text-lg text-white/60">{s}</span>
                </button>
              ))}
            </div>
          )}
          {view === "generate" && (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="pointer-events-none absolute inset-0 grid grid-cols-4 grid-rows-2 gap-2 opacity-60">{Array.from({ length: 8 }, (_, i) => <span key={i} className="rounded-2xl bg-white/[0.03]" />)}</div>
              <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
                <div className="flex items-center">
                  {collage.map((a, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={a.id} alt="" src={a.url} className={`object-cover shadow-xl ${i === 0 ? "z-0 size-[220px] rounded-full" : "h-[230px] w-[140px] rounded-2xl"} ${["", "-ml-3 rotate-[-2deg]", "-ml-3 rotate-[1deg] z-10", "-ml-3 rotate-[3deg]"][i]}`} />
                  ))}
                </div>
                <h3 className="mt-4 text-[34px] leading-9 text-white" style={ACCENT}>Generate your avatar</h3>
                <p className="text-base font-medium text-white/50">Describe who you want to generate - age, style, vibe</p>
              </div>
              <div className="relative flex h-[76px] shrink-0 items-center gap-3 rounded-2xl bg-white/[0.06] p-2 pl-5">
                <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your avatar" className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/50" />
                <button type="button" disabled={!prompt.trim()} className="flex h-[52px] shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#e6336f] to-[#b81f58] px-4 text-sm font-bold uppercase text-white outline-none transition-opacity disabled:opacity-90" style={ACCENT}>Generate {SPARK} 0.5</button>
              </div>
            </div>
          )}
          {view === "upload" && (
            <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,428px)_minmax(0,1fr)] gap-6">
              <div role="button" tabIndex={0} onClick={() => file.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.current?.click(); } }} className="relative flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.08] outline-none transition-colors hover:bg-white/[0.11]">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" src={photo} className="absolute inset-0 size-full object-cover" />
                ) : (
                  <>
                    <span className="mb-2 flex size-[50px] items-center justify-center rounded-full border border-white/20 bg-white/5 text-white">{CLOUD}</span>
                    <span className="text-base font-semibold text-white">Upload from device</span>
                    <span className="text-sm text-white/60">Upload photo to create avatar</span>
                  </>
                )}
                <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); e.target.value = ""; }} />
              </div>
              <div className="flex min-h-0 flex-col gap-2">
                <label htmlFor="ms2-avatar-name" className="text-base font-medium text-white/60">Name Avatar</label>
                <div className="flex h-[52px] items-center gap-2 rounded-xl border border-white/10 bg-[#1d1f20] px-4 text-white/60 focus-within:border-white/30">
                  <span>@</span>
                  <input id="ms2-avatar-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Avatar name" maxLength={40} className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/50" />
                </div>
                <button type="button" disabled={!ready} onClick={() => { if (ready) onCreated({ id: `mine-${Date.now()}`, name: name.trim(), url: photo! }); }} className="mt-auto h-[70px] rounded-xl bg-white/[0.08] text-lg font-semibold text-white/60 outline-none transition-colors enabled:bg-[#d1fe17] enabled:text-black enabled:hover:brightness-95 disabled:cursor-not-allowed">Create Avatar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
