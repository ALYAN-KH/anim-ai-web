"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ReferencePicker, useFactoryReference, type FactoryReference } from "./ReferencePicker";
import { useTypingPlaceholder } from "@/components/shared/useTypingPlaceholder";
import { ContentFactoryGenerations } from "./ContentFactoryGenerations";
import { CONNECT_URL, CONTENT_FACTORY_STYLES, type ContentFactoryStyle } from "./data";

// SVG paths below are copied verbatim from the page markup.
const CLAUDE = "#d97757";
const CLAUDE_PATH = "m5.924 15.296 3.934-2.206.066-.192-.066-.106h-.192l-.658-.04-2.249-.061-1.949-.081-1.888-.101-.476-.102L2 11.82l.046-.293.4-.268.572.05 1.266.086 1.898.132 1.377.08 2.041.213h.324l.046-.131-.112-.081-.086-.081-1.964-1.33L5.68 8.79l-1.114-.81-.602-.41-.304-.384-.132-.84.547-.602.734.05.187.051.745.572 1.59 1.23 2.076 1.527.303.253.122-.086.015-.06-.137-.228-1.129-2.04L7.377 4.94l-.536-.86-.142-.517a2.5 2.5 0 0 1-.086-.607l.622-.845L7.58 2l.83.111.35.304.516 1.179.835 1.857 1.297 2.524.38.749.202.693.076.213h.131v-.122l.107-1.421.197-1.746.193-2.246.065-.633.314-.759.623-.41.486.233.4.572-.055.37-.238 1.542-.466 2.419-.304 1.619h.177l.203-.203.82-1.087 1.377-1.72.608-.684.709-.753.455-.36h.861l.633.941-.284.972-.886 1.123-.734.951-1.053 1.417-.658 1.133.06.091.158-.015 2.38-.506 1.285-.233 1.535-.263.693.324.076.329-.273.673-1.64.405-1.925.384-2.866.678-.035.025.04.051 1.292.121.551.03h1.352l2.517.188.658.435.395.531-.066.405-1.012.516-1.368-.324-3.19-.759-1.093-.273h-.152v.091l.911.89 1.671 1.508 2.091 1.943.107.48-.269.38-.283-.04-1.838-1.381-.709-.623-1.605-1.35h-.106v.141l.37.542 1.954 2.934.1.9-.14.294-.507.177-.557-.101-1.144-1.604-1.18-1.806-.952-1.62-.117.067-.562 6.046-.263.308-.607.233-.507-.384-.268-.623.268-1.23.324-1.603.264-1.275.238-1.584.141-.526-.01-.035-.116.015-1.195 1.64-1.818 2.453-1.438 1.538-.344.137-.598-.309.056-.551.334-.491 1.99-2.53 1.2-1.568.775-.906-.005-.132h-.046l-5.286 3.43-.942.122-.405-.38.05-.622.193-.202 1.59-1.093z";
const HF_PATH = "m20.35 11.844-.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z";
const INSTAGRAM = "M12 4.212c2.537 0 2.837.01 3.839.055a5.3 5.3 0 0 1 1.763.327c.413.153.786.395 1.093.711.316.307.558.68.71 1.093.21.564.32 1.16.328 1.763.046 1.002.055 1.303.055 3.839s-.01 2.837-.055 3.839a5.3 5.3 0 0 1-.327 1.763 3.15 3.15 0 0 1-1.804 1.804c-.564.209-1.16.32-1.763.327-1.002.046-1.303.055-3.839.055s-2.837-.01-3.839-.055a5.3 5.3 0 0 1-1.764-.327 2.94 2.94 0 0 1-1.092-.711 2.94 2.94 0 0 1-.71-1.093 5.3 5.3 0 0 1-.328-1.763c-.046-1.002-.055-1.303-.055-3.839s.01-2.837.055-3.839a5.3 5.3 0 0 1 .327-1.763c.153-.413.395-.786.711-1.093.307-.316.68-.558 1.093-.71a5.3 5.3 0 0 1 1.763-.328c1.002-.046 1.303-.055 3.839-.055M12 2.5c-2.58 0-2.904.011-3.917.057a7 7 0 0 0-2.306.441 4.66 4.66 0 0 0-1.683 1.097 4.66 4.66 0 0 0-1.096 1.683 7 7 0 0 0-.44 2.305C2.51 9.096 2.5 9.42 2.5 12s.011 2.903.057 3.917c.016.788.165 1.567.441 2.306a4.66 4.66 0 0 0 1.097 1.683 4.66 4.66 0 0 0 1.683 1.096 7 7 0 0 0 2.305.44c1.013.048 1.337.058 3.917.058s2.903-.011 3.917-.057a7 7 0 0 0 2.306-.441 4.86 4.86 0 0 0 2.779-2.78 7 7 0 0 0 .44-2.305c.048-1.014.058-1.337.058-3.917s-.011-2.904-.057-3.917a7 7 0 0 0-.441-2.306 4.66 4.66 0 0 0-1.097-1.683 4.66 4.66 0 0 0-1.683-1.096 7 7 0 0 0-2.305-.44C14.903 2.51 14.58 2.5 12 2.5m0 4.621a4.879 4.879 0 1 0 0 9.758 4.879 4.879 0 0 0 0-9.758m0 8.046a3.167 3.167 0 1 1 0-6.334 3.167 3.167 0 0 1 0 6.334m5.071-9.378a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28";
const EYE = "M12 4c4.01 0 7.91 2.477 10.43 7.2a1.71 1.71 0 0 1 0 1.6C19.91 17.524 16.01 20 12 20s-7.91-2.477-10.43-7.2a1.71 1.71 0 0 1 0-1.6C4.09 6.476 7.99 4 12 4m-3.625 8a3.625 3.625 0 1 1 7.25 0 3.625 3.625 0 0 1-7.25 0";
const HEART = "M12 4.328A7.021 7.021 0 0 1 16.111 3c1.487 0 2.972.598 4.081 1.785C21.305 5.975 22 7.715 22 9.938c0 3.316-2.351 6.087-4.607 7.957a22 22 0 0 1-3.257 2.233c-.47.26-.887.467-1.22.611q-.252.109-.456.174A1.6 1.6 0 0 1 12 21a1.6 1.6 0 0 1-.46-.087 5 5 0 0 1-.455-.174c-.334-.144-.752-.35-1.22-.611a22 22 0 0 1-3.258-2.233C4.351 16.025 2 13.254 2 9.938c0-2.223.695-3.962 1.808-5.153A5.57 5.57 0 0 1 7.888 3 7.02 7.02 0 0 1 12 4.328";
const SPARKLE_A = "M11.7452 4.66559C11.7023 4.28675 11.382 4.00039 11.0008 4C10.6195 3.99961 10.2986 4.28532 10.2549 4.66407C9.97088 7.12691 9.23453 8.85871 8.04662 10.0466C6.85871 11.2345 5.12691 11.9709 2.66407 12.2549C2.28532 12.2986 1.99961 12.6195 2 13.0008C2.00039 13.382 2.28675 13.7023 2.66559 13.7452C5.08772 14.0196 6.85633 14.7556 8.07245 15.9498C9.28399 17.1394 10.0357 18.8708 10.2529 21.3164C10.2873 21.7037 10.612 22.0004 11.0008 22C11.3897 21.9996 11.7137 21.7021 11.7472 21.3147C11.9554 18.9094 12.7064 17.1415 13.924 15.924C15.1415 14.7064 16.9094 13.9554 19.3147 13.7472C19.7021 13.7137 19.9996 13.3897 20 13.0008C20.0004 12.612 19.7037 12.2873 19.3164 12.2529C16.8708 12.0357 15.1394 11.284 13.9498 10.0724C12.7556 8.85633 12.0196 7.08772 11.7452 4.66559Z";
const SPARKLE_B = "M19.7898 1.25884C19.7731 1.11151 19.6486 1.00015 19.5003 1C19.352 0.999849 19.2272 1.11096 19.2103 1.25825C19.0998 2.21602 18.8134 2.8895 18.3515 3.35146C17.8895 3.81343 17.216 4.09979 16.2582 4.21025C16.111 4.22724 15.9998 4.35203 16 4.5003C16.0002 4.64857 16.1115 4.77313 16.2588 4.78981C17.2008 4.89651 17.8886 5.18275 18.3615 5.64713C18.8327 6.10977 19.125 6.7831 19.2095 7.73414C19.2229 7.88476 19.3491 8.00017 19.5003 8C19.6515 7.99983 19.7775 7.88413 19.7906 7.73349C19.8716 6.79809 20.1636 6.11059 20.6371 5.6371C21.1106 5.16361 21.7981 4.87155 22.7335 4.79058C22.8841 4.77754 22.9998 4.65154 23 4.50033C23.0002 4.34912 22.8848 4.22286 22.7341 4.20948C21.7831 4.125 21.1098 3.83266 20.6471 3.36151C20.1827 2.88857 19.8965 2.20078 19.7898 1.25884Z";
const SOUND_BODY = "M12.25 3.75H13a.75.75 0 0 0-1.154-.632zm0 16.5-.404.632A.75.75 0 0 0 13 20.25zM2.75 8.5h2.957V7H2.75zm3.9-.276 6.004-3.842-.808-1.264-6.004 3.843zM11.5 3.75v16.5H13V3.75zm1.154 15.868-6.003-3.842-.809 1.263 6.004 3.843zM5.707 15.5H2.75V17h2.957zM2.5 15.25v-6.5H1v6.5zm4.15.526a1.75 1.75 0 0 0-.943-.276V17a.25.25 0 0 1 .135.04zM5.708 8.5c.335 0 .662-.096.944-.276l-.809-1.263A.25.25 0 0 1 5.707 7zm-2.957 7a.25.25 0 0 1-.25-.25H1c0 .966.784 1.75 1.75 1.75zm0-8.5A1.75 1.75 0 0 0 1 8.75h1.5a.25.25 0 0 1 .25-.25z";
const SOUND_X = "m21.97 9.97-2.122 2.121 1.061 1.06 2.121-2.12zm-2.122 2.121-2.121 2.121 1.06 1.061 2.122-2.121zm-2.121-1.06 2.121 2.12 1.061-1.06-2.121-2.121zm2.121 2.12 2.122 2.122 1.06-1.06-2.121-2.122z";

const Svg = ({ children, className = "size-4" }: { children: ReactNode; className?: string }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>{children}</svg>;
const stroke = (d: string, className?: string) => <Svg className={className}><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
const fill = (d: string, className?: string, evenOdd = false) => <Svg className={className}><path d={d} fill="currentColor" fillRule={evenOdd ? "evenodd" : undefined} clipRule={evenOdd ? "evenodd" : undefined} /></Svg>;

type ComposerProps = { variant: "inline" | "floating"; mode: "claude" | "here"; prompt: string; onPrompt: (value: string) => void; reference: FactoryReference | null; onReference: (value: FactoryReference) => void; onClear: () => void };

function Composer({ variant, mode, prompt, onPrompt, reference, onReference, onClear }: ComposerProps) {
  const floating = variant === "floating";
  const placeholder = useTypingPlaceholder("What if cats ruled the world", !prompt);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.open(CONNECT_URL, "_blank", "noopener,noreferrer");
  };
  const chip = "inline-flex h-6 items-center gap-1 rounded-full bg-white/5 px-1.5 text-xs font-medium text-white backdrop-blur-[2.5rem] hover:bg-white/10";
  const id = `content-factory-prompt-${variant}`;
  const claude = mode === "claude";

  return <form onSubmit={submit} className={`relative flex w-full flex-col items-center ${floating ? "max-w-[740px]" : "max-w-[36.875rem] gap-6"}`}>
    <div className={`w-full border border-white/10 backdrop-blur-xl ${floating ? "rounded-3xl bg-[#1a1a1a]/95 p-1 shadow-2xl" : "rounded-2xl bg-white/[.04] p-1"}`}>
      {floating && claude && <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center justify-center gap-1.5 text-sm font-medium text-white/85 hover:text-white">{fill(HF_PATH, "size-4")}Connect Higgsfield MCP to generate<span aria-hidden="true" className="text-white/60">›</span></a>}
      <div className={`flex gap-2 rounded-xl bg-white/[.04] p-2 md:items-stretch ${floating ? "" : "flex-col md:flex-row"}`}>
        <div className="flex min-w-0 flex-1 items-center gap-2 max-md:min-h-24">
          <div className={`relative shrink-0 ${floating ? "w-[78px]" : "size-[72px]"}`}>
            <ReferencePicker inputId={`${id}-files`} mode={mode} reference={reference} onChange={onReference} onClear={onClear} tall={floating} />
          </div>
          <span aria-hidden="true" className="h-[72px] w-px shrink-0 bg-white/10" />
          <fieldset className="m-0 flex h-full min-w-0 flex-1 flex-col justify-between gap-1 border-0 px-2 py-0.5 text-left">
            <div className="flex flex-col gap-1">
              <label htmlFor={id} className="text-xs text-white/45">Make a video about…</label>
              <textarea id={id} rows={1} maxLength={2000} value={prompt} onChange={event => onPrompt(event.target.value)} placeholder={placeholder} autoComplete="off" className="block w-full resize-none border-0 bg-transparent p-0 text-base font-semibold leading-6 text-white caret-lime outline-none placeholder:text-white/50" />
            </div>
            <div className="flex gap-1.5">
              <button type="button" aria-label="Add images or videos" onClick={() => document.getElementById(`${id}-files`)?.click()} className={chip}>{stroke("M12 5.25V12m0 0v6.75M12 12H5.25M12 12h6.75", "size-3")}</button>
              <button type="button" aria-label="Length: 30 sec" className={chip}>{stroke("M12 7.75V12l2.75 2.75m6.5-2.75a9.25 9.25 0 1 1-18.5 0 9.25 9.25 0 0 1 18.5 0", "size-3")}<span className="px-1.5">30 sec</span></button>
              <button type="button" aria-label="Episodes: 1 episode" className={chip}>{stroke("M4.75 3.75a1 1 0 0 1 1-1h12.5a1 1 0 0 1 1 1v16.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1z", "size-3")}<span className="px-1.5">1 episode</span></button>
            </div>
          </fieldset>
        </div>
        <button type="submit" className={`flex items-center justify-center rounded-xl px-3 text-center font-semibold leading-4 transition hover:brightness-110 max-md:min-h-12 max-md:w-full ${floating ? "w-[108px] font-grotesk text-xs uppercase tracking-wide" : "min-h-14 text-sm md:w-28"}`} style={{ background: claude ? `linear-gradient(180deg, #e8906f, ${CLAUDE})` : "linear-gradient(180deg,#effe17,#d1fe17)", color: claude ? "#fff" : "#000", boxShadow: "inset 0 -3px rgba(0,0,0,.25)" }}>{claude ? "Generate in Claude" : "Generate"}</button>
      </div>
    </div>
    {!floating && claude && <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 self-center rounded-full border border-white/15 px-3 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white">{fill(HF_PATH, "size-4")}Connect Higgsfield MCP to generate</a>}
  </form>;
}

function StyleCard({ style, selected, onUse }: { style: ContentFactoryStyle; selected: boolean; onUse: (style: ContentFactoryStyle) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const play = () => { ref.current?.play().catch(() => undefined); };
  const stop = () => { ref.current?.pause(); };
  return <li onMouseEnter={play} onMouseLeave={stop} className={`group relative aspect-[9/16] overflow-hidden rounded-xl bg-white/[.04] ${selected ? "ring-2 ring-lime" : ""}`}>
    <video ref={ref} src={style.video} poster={style.poster} muted={muted} loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2 pt-8 text-[13px] font-medium text-white">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="flex items-center gap-1">{fill(EYE, "size-5 shrink-0 text-white max-md:size-4", true)}<span aria-hidden="true">{style.views}</span><span className="sr-only">Views: {style.views}</span></span>
        <span className="flex min-w-0 items-center gap-1">{fill(HEART, "size-5 shrink-0 text-[#ff4d4f] max-md:size-4")}<span aria-hidden="true" className="truncate">{style.likes}</span><span className="sr-only">Likes: {style.likes}</span></span>
      </div>
      {style.instagram && <a href={style.instagram} target="_blank" rel="noopener noreferrer" aria-label="Open original on Instagram" className="relative z-10 -m-1 shrink-0 rounded-full p-1 text-white">{fill(INSTAGRAM, "size-5 max-md:size-4")}</a>}
    </div>
    <button type="button" aria-label={`Open ${style.title}`} onClick={() => onUse(style)} className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white" />
    <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
      <button type="button" aria-pressed={selected} aria-label={`Use ${style.title} as reference`} onClick={() => onUse(style)} className="pointer-events-auto flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-lime text-sm font-semibold text-black transition hover:brightness-90"><Svg className="size-5"><path d={SPARKLE_A} fill="currentColor" /><path d={SPARKLE_B} fill="currentColor" /></Svg>Use as reference</button>
    </div>
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted} onClick={() => setMuted(value => !value)} className="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-[2.5rem] transition-opacity focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"><Svg className="size-4"><path d={muted ? `${SOUND_BODY}${SOUND_X}` : SOUND_BODY} fill="currentColor" /></Svg></button>
  </li>;
}

export function ContentFactoryStudio() {
  const [view, setView] = useState<"explore" | "mine">("explore");
  const [mode, setMode] = useState<"claude" | "here">("claude");
  const { reference, setReference } = useFactoryReference();
  const [prompt, setPrompt] = useState("");
  const [floating, setFloating] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Pin the composer to the bottom of the viewport once the inline one has scrolled away.
  useEffect(() => {
    const node = anchorRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(node);
    return () => observer.disconnect();
  }, [view]);

  const tabClass = (active: boolean) => `relative inline-flex h-12 items-center gap-1.5 border-b-2 px-4 text-sm font-medium transition ${active ? "border-white text-white" : "border-transparent text-white/55 hover:text-white"}`;
  const composer = { mode, prompt, onPrompt: setPrompt, reference, onReference: setReference, onClear: () => setReference(null) };

  return <div role="main" data-theme="default-dark" className={`relative min-h-screen w-full text-white ${view === "mine" ? "bg-black" : "bg-[#0b0c0d] [background-image:radial-gradient(circle,#191b1d_1px,transparent_1px)] [background-size:20px_20px]"}`}>
    <div role="tablist" aria-label="Content Factory views" className="sticky top-[37px] z-[60] flex justify-center border-b border-white/[.06] bg-[#0b0c0d]">
      <button type="button" role="tab" aria-selected={view === "explore"} onClick={() => setView("explore")} className={tabClass(view === "explore")}><Svg><path d="M16.465 17.153a1 1 0 0 0 .687-.687l3.6-12.6a.5.5 0 0 0-.618-.619l-12.6 3.6a1 1 0 0 0-.687.687l-3.6 12.6a.5.5 0 0 0 .618.619z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /><path d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /></Svg>Explore</button>
      <button type="button" role="tab" aria-selected={view === "mine"} onClick={() => setView("mine")} className={tabClass(view === "mine")}>{stroke("M15.25 8.75v-5a1 1 0 0 0-1-1H3.75a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h5M3.1 11.9l2.347-1.538a1 1 0 0 1 1.103.005l1.829 1.219M6 6.25h.5m8 8.75h.5M6.75 6.25a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m7 6.95v3.6l2.8-1.8zm6.5 8.05H9.75a1 1 0 0 1-1-1V9.75a1 1 0 0 1 1-1h10.5a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1")}My generations</button>
    </div>

    {view === "mine" ? <ContentFactoryGenerations {...composer} /> : <div className="relative flex flex-col items-center gap-6 px-4 pb-32 pt-12 md:pt-20">
      <div className="flex flex-col items-center gap-5 text-center">
        <div role="tablist" aria-label="Generate with" className="inline-flex h-10 gap-1 rounded-full border border-white/10 bg-white/5 p-[3px]">
          <button type="button" role="tab" aria-selected={mode === "claude"} onClick={() => setMode("claude")} className={`inline-flex items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition ${mode === "claude" ? "bg-white/15 text-white" : "text-white/55 hover:text-white"}`}><Svg><path d={CLAUDE_PATH} fill={CLAUDE} /></Svg>Generate in Claude</button>
          <button type="button" role="tab" aria-selected={mode === "here"} onClick={() => setMode("here")} className={`inline-flex items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition ${mode === "here" ? "bg-white/15 text-white" : "text-white/55 hover:text-white"}`}>{fill(HF_PATH)}Generate here</button>
        </div>
        <h1 className="flex flex-col items-center gap-0.5 font-grotesk text-[28px] font-bold uppercase leading-[1.1] md:text-[34px]">
          <span>Generate viral faceless short videos</span>
          <span className="flex flex-wrap items-center justify-center gap-x-2.5"><span className="opacity-70">Inside</span><Svg className="size-7 shrink-0 md:size-10"><path d={CLAUDE_PATH} fill={CLAUDE} /></Svg><span className="opacity-70">Claude with Higgsfield MCP</span></span>
        </h1>
      </div>
      <div ref={anchorRef} className="flex w-full justify-center"><Composer variant="inline" {...composer} /></div>

      <section aria-labelledby="content-factory-styles" className="flex w-full max-w-[1500px] flex-col items-center gap-4 px-3 pb-6 pt-6 md:pt-12">
        <h2 id="content-factory-styles" className="text-center text-base font-medium text-white max-md:sr-only">Pick a trending style to start from</h2>
        <ul className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {CONTENT_FACTORY_STYLES.map(style => <StyleCard key={style.title} style={style} selected={reference?.title === style.title} onUse={setReference} />)}
        </ul>
      </section>
    </div>}

    {view === "explore" && floating && <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"><div className="pointer-events-auto w-full max-w-[740px]"><Composer variant="floating" {...composer} /></div></div>}
  </div>;
}
