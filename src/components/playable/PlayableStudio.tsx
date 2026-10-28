"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { buildClaudeUrl } from "@/components/mcp/lib/chatgpt-url";
import { Composer, useAttachments, type ComposerProps, type Dimension, type GenerateMode } from "./composer";
import { HERO_POSTER, HERO_VIDEO, PLAYABLE_GAMES, type PlayableCategory, type PlayableGame } from "./data";
import { PlayableGallery, prefersLightMedia, tablistKeys, type CategoryFilter } from "./gallery";
import { HeadingFilters, Icon } from "./icons";

const PlayerDialog = dynamic(() => import("./PlayerDialog"), { ssr: false });

type View = "explore" | "mine";
const VIEWS: View[] = ["explore", "mine"];
const MODES: GenerateMode[] = ["claude", "here"];

/** Gradient fill plus a masked inner stroke, layered in one grid cell like the source heading. */
function HeadingText({ children, dim = false }: { children: ReactNode; dim?: boolean }) {
  return <span className="grid">
    <span className={`col-start-1 row-start-1 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent [filter:url(#playable-ads-heading-inner-shadow)] ${dim ? "opacity-70" : ""}`}>{children}</span>
    <span aria-hidden="true" className={`col-start-1 row-start-1 text-white [filter:url(#playable-ads-heading-inner-stroke)] [mask-image:linear-gradient(to_bottom,transparent,black)] ${dim ? "opacity-[.28]" : "opacity-40"}`}>{children}</span>
  </span>;
}

function HeroBackdrop() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!matchMedia("(prefers-reduced-motion: reduce)").matches && !prefersLightMedia());
  }, []);
  useEffect(() => {
    const node = video.current;
    if (!motion || !node || !box.current) return;
    const sync = (visible: boolean) => (visible && !document.hidden ? node.play().catch(() => undefined) : node.pause());
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => sync((visible = entry.isIntersecting)));
    observer.observe(box.current);
    const onVisibility = () => sync(visible);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motion]);

  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate rounded-t-2xl bg-[#0d0f10]">
    <div ref={box} className="absolute inset-x-0 top-0 h-[412px] overflow-hidden rounded-t-2xl max-md:max-h-full">
      <div className="absolute inset-0 opacity-70">
        <img src={HERO_POSTER} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
        {motion && <video ref={video} src={HERO_VIDEO} poster={HERO_POSTER} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 size-full object-cover" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[17%] to-[#0d0f10]" />
    </div>
    <div className="absolute inset-0 rounded-t-2xl border border-white/50 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
  </div>;
}

export function PlayableStudio() {
  const [view, setView] = useState<View>("explore");
  const [mode, setMode] = useState<GenerateMode>("claude");
  const [prompt, setPrompt] = useState("");
  const [dimension, setDimension] = useState<Dimension>("3D");
  const [genre, setGenre] = useState<PlayableCategory | null>(null);
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [game, setGame] = useState<PlayableGame | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const attachments = useAttachments();
  const returnFocus = useRef<HTMLElement | null>(null);
  const pushedPlayer = useRef(false);

  useEffect(() => {
    const sync = () => {
      const id = new URL(window.location.href).searchParams.get("preset");
      setGame(PLAYABLE_GAMES.find(item => (item.presetId || item.id) === id) || null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const generate = () => {
    if (mode === "here") {
      // On-site generation needs an account; this uses the app's existing sign-up flow.
      setAuthMode("signup");
      return;
    }
    const files = [attachments.reference?.name, ...attachments.images.map(image => image.name)].filter(Boolean);
    const brief = [
      `Use Higgsfield to make a playable ${dimension} game about: ${prompt.trim()}`,
      genre && `Genre: ${genre}`,
      files.length > 0 && `I'll attach my reference files in this chat: ${files.join(", ")}.`,
    ].filter(Boolean).join("\n");
    window.open(buildClaudeUrl(brief), "_blank", "noopener,noreferrer");
  };

  const openGame = useCallback((next: PlayableGame, trigger: HTMLElement | null) => {
    returnFocus.current = trigger;
    const url = new URL(window.location.href);
    url.searchParams.set("preset", next.presetId || next.id);
    window.history.pushState(window.history.state, "", url);
    pushedPlayer.current = true;
    setGame(next);
  }, []);
  const closeGame = useCallback(() => {
    setGame(null);
    if (pushedPlayer.current) {
      window.history.back();
      pushedPlayer.current = false;
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("preset");
      window.history.replaceState(window.history.state, "", url);
    }
    requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true }));
  }, []);
  const closeAuth = useCallback(() => setAuthMode(null), []);

  const composer: ComposerProps = { mode, prompt, onPrompt: setPrompt, dimension, onDimension: setDimension, genre, onGenre: setGenre, attachments, onGenerate: generate };
  const claude = mode === "claude";
  const viewTab = (value: View, label: string, icon: "explore" | "myPlayables") => <button type="button" role="tab" id={`playable-tab-${value}`} aria-selected={view === value} aria-controls={`playable-panel-${value}`} tabIndex={view === value ? 0 : -1} onClick={() => setView(value)} className={`relative inline-flex h-12 items-center gap-1.5 pe-3 ps-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 ${view === value ? "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-white" : "text-white/55 hover:text-white"}`}>
    <Icon name={icon} className="size-5" />{label}
  </button>;
  const modeTab = (value: GenerateMode, label: string, icon: "claude" | "higgsfield") => <button type="button" role="tab" aria-selected={mode === value} tabIndex={mode === value ? 0 : -1} onClick={() => setMode(value)} className={`relative inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${mode === value ? "bg-white/[.06] text-white shadow-[inset_0_1px_0_rgb(255_255_255/.06)]" : "text-white/55 hover:text-white"}`}>
    <Icon name={icon} className={`size-4 ${icon === "claude" ? "text-[#d97757]" : ""}`} />{label}
  </button>;

  return <div data-theme="default-dark" className="relative min-h-[calc(100svh-37px)] w-full bg-[#0d0f10] text-white">
    <HeadingFilters />
    <div role="tablist" aria-label="Page view" onKeyDown={tablistKeys(VIEWS, view, setView)} className="sticky top-[37px] z-[60] flex h-12 w-full shrink-0 justify-center gap-1 bg-[#0d0f10]">
      {viewTab("explore", "Explore", "explore")}
      {viewTab("mine", "My playables", "myPlayables")}
    </div>

    {view === "explore" ? <div id="playable-panel-explore" role="tabpanel" aria-labelledby="playable-tab-explore" className="flex flex-col">
      <section className="relative z-[2] mx-3">
        <HeroBackdrop />
        <div className="relative flex flex-col items-center gap-8 px-4 pb-16 pt-[52px] text-center">
          <div className="flex flex-col items-center gap-5">
            <div role="tablist" aria-label="Generate with" onKeyDown={tablistKeys(MODES, mode, setMode)} className="inline-flex gap-0.5 rounded-full border border-white/10 bg-black/10 p-[3px] backdrop-blur-2xl">
              {modeTab("claude", "Generate in Claude", "claude")}
              {modeTab("here", "Generate here", "higgsfield")}
            </div>
            <hgroup className="flex flex-col items-center gap-2.5">
              {/* Both headlines share one grid cell so switching modes keeps the hero height stable. */}
              <h1 className="grid font-grotesk text-[28px] font-bold uppercase leading-[1.05] tracking-[-0.01em] md:text-[40px]">
                <span aria-hidden={!claude} className={`col-start-1 row-start-1 flex flex-col items-center justify-center ${claude ? "" : "invisible"}`}>
                  <HeadingText>Create games that bring players in</HeadingText>
                  <span className="flex flex-wrap items-center justify-center gap-x-2.5">
                    <HeadingText dim>Inside</HeadingText>
                    <Icon name="claude" className="size-7 shrink-0 text-[#d97757] md:size-10" />
                    <HeadingText dim>Claude with Higgsfield MCP</HeadingText>
                  </span>
                </span>
                <span aria-hidden={claude} className={`col-start-1 row-start-1 flex flex-col items-center justify-center ${claude ? "invisible" : ""}`}>
                  <HeadingText>Create games<br />that bring players in</HeadingText>
                </span>
              </h1>
              <p className="text-sm text-white/50">Describe your game, upload your assets, and get a playable game</p>
            </hgroup>
          </div>
          <Composer {...composer} />
        </div>
      </section>
      <PlayableGallery category={category} onCategory={setCategory} onPlay={openGame} />
    </div> : <section id="playable-panel-mine" role="tabpanel" aria-labelledby="playable-tab-mine" className="flex min-h-[calc(100svh-85px)] flex-col items-center justify-between gap-10 px-4 pb-6 pt-24">
      <div role="status" className="text-center">
        <h2 className="text-base font-semibold leading-6">No playables yet</h2>
        <p className="mt-2 text-sm leading-5 text-white/50">Games you generate will appear here.</p>
      </div>
      <div className="sticky bottom-4 z-[2] flex w-full justify-center"><Composer {...composer} docked /></div>
    </section>}

    {game && <PlayerDialog key={game.id} game={game} onClose={closeGame} />}
    {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
  </div>;
}
