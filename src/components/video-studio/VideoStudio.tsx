"use client";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { GeneratorPanel } from "./create/generator-panel";
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

export function VideoStudio({ initialTab = "create" }: VideoStudioProps = {}) {
  const [tab, setTab] = useState<VideoTab>(initialTab);
  const [pageTab, setPageTab] = useState<"history" | "how">(initialTab === "motion" ? "history" : "how");
  const history = useHistoryState();
  const view = history.layout === "list" ? "list" : "grid";
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [showAcademyPrompt, setShowAcademyPrompt] = useState(false);
  const [presetBrowserOpen, setPresetBrowserOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Wan 3.0");
  const [selectedPreset, setSelectedPreset] = useState("general");
  const motionVideoSource = useVideoSource();
  const CreationPanel = tab === "motion" ? MotionControlPanel : GeneratorPanel;

  useEffect(() => {
    const openTool = () => { setTab("edit"); setPageTab("history"); setPresetBrowserOpen(false); };
    window.addEventListener("video-studio-open-tool", openTool);
    return () => window.removeEventListener("video-studio-open-tool", openTool);
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedPreset(getPresets(model)[0].id);
  };

  const mainRef = useRef<HTMLElement>(null);
  const [fitH, setFitH] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.videoStudio = "true";
    return () => { delete document.documentElement.dataset.videoStudio; };
  }, []);

  useEffect(() => {
    if (initialTab) {
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
    setPageTab(nextTab === "motion" ? "history" : "how");
    if (typeof window !== "undefined") {
      const target = nextTab === "edit" ? "/ai/video/edit" : nextTab === "motion" ? "/ai/video/motion?model=kling-3-motion-control" : "/ai/video";
      if (window.location.pathname !== target) {
        window.history.pushState(null, "", target);
      }
    }
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
      <div className="mx-auto grid h-full max-w-[1920px] grid-cols-1 gap-2 px-2 pb-8 sm:px-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:px-4">
        <div className="relative hidden min-h-0 lg:block lg:h-full">
          {tab === "edit" ? (
            <EditVideoPanel
              tab={tab}
              onTabChange={handleTabChange}
              onSignup={() => setAuthMode("signup")}
            />
          ) : (
            <CreationPanel
              {...(tab === "motion" ? { motionVideoSource } : {})}
              onHowItWorks={() => setPageTab("how")}
              tab={tab}
              onTabChange={handleTabChange}
              onGenerate={() => setAuthMode("signup")}
              model={selectedModel}
              onModelChange={handleModelChange}
              onOpenPresets={() => setPresetBrowserOpen(true)}
            />
          )}
        </div>

        <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-[#0f1113]">
          {presetBrowserOpen && tab !== "edit" ? (
            <PresetBrowser
              model={selectedModel}
              onModelChange={handleModelChange}
              selectedPreset={selectedPreset}
              onSelectPreset={(preset, model) => {
                setSelectedPreset(preset.id);
                setSelectedModel(model);
              }}
              onClose={() => setPresetBrowserOpen(false)}
            />
          ) : (
            <>
              {/* Main Panel Toolbar */}
              <header className="flex h-[52px] shrink-0 items-center justify-between px-4">
                <div className="flex items-center gap-1 rounded-[10px]">
                  <button
                    type="button"
                    onClick={() => setPageTab("history")}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition ${pageTab === "history"
                        ? "border border-white/10 bg-white/[.08] text-white"
                        : "border border-transparent text-white/60 hover:text-white"
                      }`}
                  >
                    <FolderIcon className="size-4" /> History
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageTab("how")}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition ${pageTab === "how"
                        ? "border border-white/10 bg-white/[.08] text-white"
                        : "border border-transparent text-white/60 hover:text-white"
                      }`}
                  >
                    <BookIcon className="size-4" /> How it works
                  </button>
                </div>

                {pageTab === "history" && <HistoryControls state={history} />}
              </header>
              {pageTab === "history" && <HistoryFilterChips state={history} />}

              <div
                className={`${tab === "motion" && pageTab === "how" ? `mx-4 mb-14 ${motionStyles.scroll}` : "sb"} min-h-0 flex-1 overflow-y-auto`}
                data-history-layout={history.layout}
                data-history-split-by-date={history.splitByDate}
                data-history-card-size={history.cardSize}
              >
                {tab === "motion" && pageTab === "how" ? <MotionControlContent selectedVideo={motionVideoSource.video} onSelect={motionVideoSource.set} /> : pageTab === "history" && history.active ? <HistoryNoMatches onClear={history.clear} /> : tab === "edit" || tab === "motion" ? (
                  <EditVideoContent pageTab={pageTab} view={view} />
                ) : (
                  <CreateVideoContent view={view} />
                )}
              </div>

              {pageTab === "how" &&
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
          <CreationPanel
            {...(tab === "motion" ? { motionVideoSource } : {})}
            onHowItWorks={() => setPageTab("how")}
            tab={tab}
            onTabChange={handleTabChange}
            onGenerate={() => setAuthMode("signup")}
            model={selectedModel}
            onModelChange={handleModelChange}
            onOpenPresets={() => setPresetBrowserOpen(true)}
          />
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
