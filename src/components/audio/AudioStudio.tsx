"use client";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_MODEL_ID, DEMO_NOTICE, NOTICE_DURATION_MS } from "./config";
import { useAudioForm } from "./hooks/useAudioForm";
import { useAudioRoute } from "./hooks/useAudioRoute";
import { useViewportOffset } from "./hooks/useViewportOffset";
import { buildGenerationRequest, canSubmit } from "./lib/form";
import { AudioSidebar } from "./sidebar";
import type { AudioHistoryItem, GenerateHandler } from "./types";
import { AudioWorkspace } from "./workspace";

interface AudioStudioProps {
  onGenerate?: GenerateHandler;
}

export function AudioStudio({ onGenerate }: AudioStudioProps) {
  const rootRef = useViewportOffset<HTMLDivElement>();
  const { mode, modelParam, setMode } = useAudioRoute();
  const form = useAudioForm(modelParam ?? DEFAULT_MODEL_ID);
  const { patch } = form;
  const [history, setHistory] = useState<AudioHistoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (modelParam) patch({ modelId: modelParam });
  }, [modelParam, patch]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), NOTICE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setNotice("");
    try {
      if (!onGenerate) {
        setNotice(DEMO_NOTICE);
        return;
      }
      const created = await onGenerate(buildGenerationRequest(mode, form.state));
      if (created && created.length > 0) setHistory((current) => [...created, ...current]);
    } catch {
      setNotice("Generation failed. Check your settings and try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form.state, mode, onGenerate]);

  return (
    <div
      role="main"
      ref={rootRef}
      className="relative flex w-full flex-col gap-4 bg-[#0d0f10] p-3 text-white lg:h-[calc(100dvh-var(--audio-top,0px))] lg:flex-row lg:gap-5 lg:overflow-hidden lg:p-5"
    >
      <AudioSidebar
        mode={mode}
        onModeChange={setMode}
        form={form}
        canSubmit={canSubmit(mode, form.state)}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
      <AudioWorkspace mode={mode} history={history} />
      {notice && (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-50 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-lg bg-black/85 px-4 py-2.5 text-sm text-zinc-200 shadow-lg"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
