"use client";

import { useEffect, useState } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { FEED_URLS, type InfluencerPreset, type MotionPreset } from "./data";
import { CharacterSheetDialog } from "./Dialogs";
import { ExploreView } from "./ExploreView";
import { motionJobType, submitGeneration, type GenerationRequest } from "./generation";
import { MotionPanel } from "./MotionPanel";
import { PresetDialog } from "./PresetDialog";
import { pickedLabels } from "./selection";
import { Sidebar } from "./Sidebar";
import { useUploads } from "./uploads";
import { useStudio } from "./useStudio";
import { Toast, useToast } from "./Toast";
import { Workspace, type HistoryJob } from "./Workspace";

/** Brings the sidebar back to its top so applied settings are in view, as the reference does. */
function scrollSidebarTop() {
  document.querySelector("[data-influencer-scroll]")?.scrollTo({ top: 0, behavior: "smooth" });
}

export function AiInfluencerStudio() {
  const [state, dispatch] = useStudio();
  const photo = useUploads({ kind: "image", max: 1 });
  const styleRefs = useUploads({ kind: "image", max: 4 });
  const motionVideo = useUploads({ kind: "video", max: 1, minSeconds: 4, maxSeconds: 30 });
  const motionImages = useUploads({ kind: "image", max: 30 });
  const [sheet, setSheet] = useState<InfluencerPreset | null>(null);
  const [preset, setPreset] = useState<{ item: MotionPreset; variant: number } | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [pending, setPending] = useState(false);
  const [invalid, setInvalid] = useState<{ video?: boolean }>({});
  const [jobs, setJobs] = useState<HistoryJob[]>([]);
  const toast = useToast();

  // Shared links (?preset=<id>) open that preset once the feed is loaded.
  useEffect(() => {
    const id = new URL(location.href).searchParams.get("preset");
    if (!id) return;
    let cancelled = false;
    Promise.all(Object.values(FEED_URLS).map((url) => fetch(url).then((r) => r.json() as Promise<MotionPreset[]>)))
      .then((lists) => { const found = lists.flat().find((p) => p.id === id); if (found && !cancelled) setPreset({ item: found, variant: 0 }); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { if (motionVideo.files.length || state.motion.presetVideo) setInvalid({}); }, [motionVideo.files.length, state.motion.presetVideo]);

  const recreateInfluencer = (p: InfluencerPreset) => {
    dispatch({ type: "recreateInfluencer", preset: p });
    setSheet(null);
    scrollSidebarTop();
    toast.notify("Character settings applied to the sidebar");
  };
  const recreatePreset = (p: MotionPreset) => {
    dispatch({ type: "recreateMotion", preset: p });
    motionVideo.clear();
    motionImages.clear();
    setPreset(null);
    scrollSidebarTop();
    toast.notify("Preset settings applied to the sidebar");
  };

  const generate = async () => {
    let request: GenerationRequest;
    let summary: string;
    if (state.mode === "create") {
      request = {
        job_set_type: "ai_influencer_sheet",
        params: { tier: state.tier, selection: state.selection, medias: photo.files.map((f) => f.file), style_references: styleRefs.files.map((f) => f.file), batch_size: state.batch },
      };
      summary = pickedLabels(state.selection, state.tier).map((c) => c.label).join(", ") || "Random character";
    } else {
      const video = motionVideo.files[0]?.file ?? state.motion.presetVideo?.url;
      if (!video) {
        setInvalid({ video: true });
        toast.notify("Add a reference video to extract motion");
        return;
      }
      request = {
        job_set_type: motionJobType(state.motion.mode),
        params: {
          model: state.motion.model,
          quality: state.motion.quality,
          prompt: state.motion.promptOn && state.motion.prompt.trim() ? state.motion.prompt.trim() : null,
          reference_video: video,
          reference_images: [...motionImages.files.map((f) => f.file), ...state.motion.presetImages.map((m) => m.url)],
        },
      };
      summary = `${state.motion.mode === "swap" ? "Objects swap" : "Motion transfer"} · ${state.motion.quality}`;
    }
    setPending(true);
    const result = await submitGeneration(request);
    setPending(false);
    if (result.status === "auth_required") setAuthMode("login");
    else if (result.status === "error") toast.notify(result.message);
    else {
      setJobs((list) => [{ id: result.jobId, kind: state.mode === "create" ? "influencer" : "motion", createdAt: Date.now(), summary }, ...list]);
      dispatch({ type: "view", view: "history" });
    }
  };

  return (
    <main className="h-full min-w-0 bg-[#0d0f10] text-white">
      <div className="relative mx-auto grid w-full max-w-[1920px] min-w-0 grid-cols-1 items-start gap-2 px-3 pb-4 md:h-[calc(100dvh-44px)] md:min-h-0 md:grid-cols-[20rem_minmax(0,1fr)] md:pb-2">
        <Sidebar
          state={state}
          dispatch={dispatch}
          photo={photo}
          styleRefs={styleRefs}
          pending={pending}
          onGenerate={generate}
          motionPanel={
            <MotionPanel
              state={state}
              dispatch={dispatch}
              video={motionVideo}
              images={motionImages}
              invalid={invalid}
              onBrowsePresets={() => dispatch({ type: "feed", feed: "presets" })}
            />
          }
        />
        <Workspace
          view={state.view}
          onView={(view) => dispatch({ type: "view", view })}
          jobs={jobs}
          explore={
            <ExploreView
              feed={state.feed}
              onFeed={(feed) => dispatch({ type: "feed", feed })}
              onOpenInfluencer={setSheet}
              onRecreateInfluencer={recreateInfluencer}
              onOpenPreset={(item, variant) => setPreset({ item, variant })}
              onRecreatePreset={recreatePreset}
              onRequireAuth={() => setAuthMode("login")}
            />
          }
        />
      </div>
      {sheet && <CharacterSheetDialog preset={sheet} onClose={() => setSheet(null)} onRecreate={() => recreateInfluencer(sheet)} />}
      {preset && <PresetDialog preset={preset.item} initialVariant={preset.variant} onClose={() => setPreset(null)} onRecreate={() => recreatePreset(preset.item)} notify={toast.notify} />}
      {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />}
      <Toast message={toast.message} onDismiss={toast.dismiss} />
    </main>
  );
}
