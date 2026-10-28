"use client";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import type { GenjutsuItem, GenjutsuMode } from "./assets/genjutsu-library";
import type { VideoSelection } from "./assets/preset-videos";
import { GeneratorPanel } from "./create/generator-panel";
import { GenjutsuLibraryContent } from "./create/genjutsu-library";
import { GENJUTSU_MODEL, GenjutsuPanel } from "./create/genjutsu-panel";
import { CreateVideoContent } from "./create/steps";
import { EditVideoContent } from "./edit/edit-video-content";
import { EditVideoPanel } from "./edit/edit-video-panel";
import { PresetBrowser, getPresets } from "./models/preset-browser";
import { MotionControlPanel } from "./motion-control/motion-control-panel";
import { MotionControlContent } from "./motion-control/motion-control-content";
import motionStyles from "./motion-control/motion-control.module.css";
import { useVideoSource } from "./edit/shared/video-source";
import { AcademyPrompt } from "./shared/academy-prompt";
import { BookIcon, FolderIcon } from "./shared/icons";
import { MoreAboutVideo } from "./shared/more-about-video";
import { HistoryControls, HistoryFilterChips, HistoryNoMatches } from "./history/history-controls";
import { useHistoryState } from "./history/history-state";
import type { VideoStudioProps, VideoTab } from "./types";

const ACADEMY_PROMPT_SESSION_KEY = "video-studio-academy-prompt-seen";

export type { VideoStudioProps };

type PageTab = "history" | "how" | "library";

const LIBRARY_ICON = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.778 4.222 4.222 19.778M21.25 12a9.25 9.25 0 1 1-18.5 0 9.25 9.25 0 0 1 18.5 0m-2.734 6.516c-1.2 1.2-5.089-.745-8.688-4.344-3.598-3.599-5.543-7.488-4.344-8.688 1.2-1.2 5.09.745 8.688 4.344s5.544 7.489 4.344 8.688" /></svg>;

/** Opens the studio on Genjutsu when the header links to /ai/video?model=genjutsu. */
function ModelFromUrl({ onGenjutsu }: { onGenjutsu: () => void }) {
  const model = useSearchParams().get("model");
  useEffect(() => { if (model === "genjutsu") onGenjutsu(); }, [model]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function VideoStudio({ initialTab = "create" }: VideoStudioProps = {}) {
  const [tab, setTab] = useState<VideoTab>(initialTab);
  const [pageTab, setPageTab] = useState<PageTab>(initialTab === "motion" ? "history" : "how");
  const history = useHistoryState();
  const view = history.layout === "list" ? "list" : "grid";
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [showAcademyPrompt, setShowAcademyPrompt] = useState(false);
  const [presetBrowserOpen, setPresetBrowserOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Wan 3.0");
  const [selectedPreset, setSelectedPreset] = useState("general");
  const motionVideoSource = useVideoSource();
  const [genjutsuMode, setGenjutsuMode] = useState<GenjutsuMode>("motion");
  const [genjutsuVideo, setGenjutsuVideo] = useState<VideoSelection | null>(null);
  const isGenjutsu = tab === "create" && selectedModel === GENJUTSU_MODEL;
  const page: PageTab = pageTab === "library" && !isGenjutsu ? "how" : pageTab;
  const CreationPanel = tab === "motion" ? MotionControlPanel : GeneratorPanel;

  useEffect(() => {
    const openTool = () => { setTab("edit"); setPageTab("history"); setPresetBrowserOpen(false); };
    window.addEventListener("video-studio-open-tool", openTool);
    return () => window.removeEventListener("video-studio-open-tool", openTool);
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedPreset(getPresets(model)[0].id);
    setPageTab(current => model === GENJUTSU_MODEL ? "library" : current === "library" ? "how" : current);
  };

  const openGenjutsu = () => { setTab("create"); handleModelChange(GENJUTSU_MODEL); };

  const recreate = (item: GenjutsuItem) => {
    setGenjutsuMode(item.mode);
    setGenjutsuVideo({ name: item.name, url: item.url, poster: item.poster });
  };

  const mainRef = useRef<HTMLElement>(null);
  const previousInitialTab = useRef(initialTab);
  const [fitH, setFitH] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.videoStudio = "true";
    return () => { delete document.documentElement.dataset.videoStudio; };
  }, []);

  useEffect(() => {
    // Initial state already handles the first render. Do not overwrite the
    // Genjutsu library selected by the URL effect during that same mount.
    if (previousInitialTab.current !== initialTab) {
      previousInitialTab.current = initialTab;
      setTab(initialTab);
      setPageTab(initialTab === "motion" ? "history" : "how");
    }
  }, [initialTab]);

  useEffect(() => {
    setShowAcademyPrompt(
      window.sessionStorage.getItem(ACADEMY_PROMPT_SESSION_KEY) !== "true",
    );
  }, []);

  const markAcademyPromptSeen = () => {
    window.sessionStorage.setItem(ACADEMY_PROMPT_SESSION_KEY, "true");
    setShowAcademyPrompt(false);
  };



  useEffect(() => {
    const fit = () => {
      const el = mainRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      setFitH(Math.max(0, Math.floor(window.innerHeight - top)));
    };

    fit();
    window.addEventListener("resize", fit);
    const ro = new ResizeObserver(fit);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("resize", fit);
      ro.disconnect();
    };
  }, []);

  const handleTabChange = (nextTab: VideoTab) => {
    setTab(nextTab);
    setPresetBrowserOpen(false);
    setPageTab(nextTab === "motion" ? "history" : nextTab === "create" && selectedModel === GENJUTSU_MODEL ? "library" : "how");
    if (typeof window !== "undefined") {
      const target = nextTab === "edit" ? "/ai/video/edit" : nextTab === "motion" ? "/ai/video/motion?model=kling-3-motion-control" : "/ai/video";
      if (window.location.pathname !== target) {
        window.history.pushState(null, "", target);
      }
    }
  };

  const renderCreationPanel = () => {
    const common = {
      onHowItWorks: () => setPageTab("how"),
      tab,
      onTabChange: handleTabChange,
      onGenerate: () => setAuthMode("signup"),
      model: selectedModel,
      onModelChange: handleModelChange,
      onOpenPresets: () => setPresetBrowserOpen(true),
    };
    if (isGenjutsu) return <GenjutsuPanel {...common} mode={genjutsuMode} onModeChange={setGenjutsuMode} video={genjutsuVideo} onVideoChange={setGenjutsuVideo} />;
    return <CreationPanel {...(tab === "motion" ? { motionVideoSource } : {})} {...common} />;
  };

  return (
    <main
      ref={mainRef}
      className="bg-[#0f1113] text-white lg:h-[var(--fit-h)] lg:overflow-hidden"
      style={
        {
          "--fit-h": fitH ? `${fitH}px` : "calc(100dvh - 92px)",
        } as CSSProperties
      }
    >
      <Suspense fallback={null}><ModelFromUrl onGenjutsu={openGenjutsu} /></Suspense>
      <div className="mx-auto grid h-full max-w-[1920px] grid-cols-1 gap-2 px-2 pb-8 sm:px-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:px-4">
        <div className="relative hidden min-h-0 lg:block lg:h-full">
          {tab === "edit" ? (
            <EditVideoPanel
              tab={tab}
              onTabChange={handleTabChange}
              onSignup={() => setAuthMode("signup")}
            />
          ) : (
            renderCreationPanel()
          )}
        </div>

        <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-[#0f1113]">
          {presetBrowserOpen && tab !== "edit" ? (
            <PresetBrowser
              model={selectedModel}
              onModelChange={handleModelChange}
              selectedPreset={selectedPreset}
              onSelectPreset={(preset, model) => {
                handleModelChange(model);
                setSelectedPreset(preset.id);
              }}
              onClose={() => setPresetBrowserOpen(false)}
            />
          ) : (
            <>
              {/* Main Panel Toolbar */}
              <header className="flex h-[52px] shrink-0 items-center justify-between px-4 max-md:h-auto max-md:flex-wrap max-md:gap-2 max-md:px-3 max-md:py-2">
                <div className="flex min-w-0 items-center gap-1 rounded-[10px] max-md:max-w-full max-md:overflow-x-auto max-md:[scrollbar-width:none]">
                  <button
                    type="button"
                    onClick={() => setPageTab("history")}
                    className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[13px] font-medium transition max-md:h-11 max-md:px-3 ${page === "history"
                        ? "border border-white/10 bg-white/[.08] text-white"
                        : "border border-transparent text-white/60 hover:text-white"
                      }`}
                  >
                    <FolderIcon className="size-4" /> History
                  </button>
                  {isGenjutsu && (
                    <button
                      type="button"
                      onClick={() => setPageTab("library")}
                      className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[13px] font-medium transition max-md:h-11 max-md:px-3 ${page === "library"
                          ? "border border-white/10 bg-white/[.08] text-white"
                          : "border border-transparent text-white/60 hover:text-white"
                        }`}
                    >
                      {LIBRARY_ICON} Motion Library
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPageTab("how")}
                    className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[13px] font-medium transition max-md:h-11 max-md:px-3 ${page === "how"
                        ? "border border-white/10 bg-white/[.08] text-white"
                        : "border border-transparent text-white/60 hover:text-white"
                      }`}
                  >
                    <BookIcon className="size-4" /> How it works
                  </button>
                </div>

                {page === "history" && <HistoryControls state={history} />}
              </header>
              {page === "history" && <HistoryFilterChips state={history} />}

              <div
                className={`${tab === "motion" && page === "how" ? `mx-4 mb-14 ${motionStyles.scroll}` : "sb"} video-studio-scroll min-h-0 flex-1 overflow-y-auto`}
                data-history-layout={history.layout}
                data-history-split-by-date={history.splitByDate}
                data-history-card-size={history.cardSize}
              >
                {page === "library" ? <GenjutsuLibraryContent onRecreate={recreate} onSignup={() => setAuthMode("signup")} /> : tab === "motion" && page === "how" ? <MotionControlContent selectedVideo={motionVideoSource.video} onSelect={motionVideoSource.set} /> : page === "history" && history.active ? <HistoryNoMatches onClear={history.clear} /> : tab === "edit" || tab === "motion" ? (
                  <EditVideoContent pageTab={page} view={view} />
                ) : (
                  <CreateVideoContent view={view} />
                )}
              </div>

              {page === "how" &&
                (showAcademyPrompt && tab !== "motion" ? (
                  <AcademyPrompt onOpen={markAcademyPromptSeen} />
                ) : (
                  <MoreAboutVideo />
                ))}
            </>
          )}
        </section>
      </div>

      <div className="border-t border-white/10 p-3 lg:hidden">
        {tab === "edit" ? (
          <EditVideoPanel
            tab={tab}
            onTabChange={handleTabChange}
            onSignup={() => setAuthMode("signup")}
          />
        ) : (
          renderCreationPanel()
        )}
      </div>
      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </main>
  );
}
