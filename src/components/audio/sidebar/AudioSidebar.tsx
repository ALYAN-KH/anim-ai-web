"use client";
import { useState, type FormEvent } from "react";
import type { AudioFormApi } from "../hooks/useAudioForm";
import type { AudioMode } from "../types";
import { GenerateBar, ModelPickerPanel } from "./fields";
import { TextToSpeechForm, TranslateForm, VoiceChangeForm } from "./forms";
import { ModeTabs, panelId, tabId } from "./ModeTabs";

type SidePanel = "model" | null;

interface AudioSidebarProps {
  mode: AudioMode;
  onModeChange: (mode: AudioMode) => void;
  form: AudioFormApi;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

export function AudioSidebar({
  mode,
  onModeChange,
  form,
  canSubmit,
  submitting,
  onSubmit,
}: AudioSidebarProps) {
  const [panel, setPanel] = useState<SidePanel>(null);
  const [modelAnchor, setModelAnchor] = useState<DOMRect | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit && !submitting) onSubmit();
  };

  const handleModeChange = (next: AudioMode) => {
    setPanel(null);
    form.clearFiles();
    onModeChange(next);
  };

  return (
    <aside
      aria-label="Audio generator"
      className="relative flex min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#17181a] lg:h-full lg:w-[394px] lg:shrink-0"
    >
      <ModeTabs value={mode} onChange={handleModeChange} />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <form
          id={panelId(mode)}
          role="tabpanel"
          aria-labelledby={tabId(mode)}
          onSubmit={handleSubmit}
          className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-none px-3 pt-3"
        >
          <div className="flex flex-col gap-3">
            {mode === "tts" && (
              <TextToSpeechForm form={form} onOpenModelPicker={anchor => { setModelAnchor(anchor); setPanel("model"); }} />
            )}
            {mode === "voice-change" && (
              <VoiceChangeForm form={form} />
            )}
            {mode === "translate" && <TranslateForm form={form} />}
          </div>
          <GenerateBar disabled={!canSubmit} loading={submitting} />
        </form>
        {panel === "model" && modelAnchor && mode === "tts" && (
          <ModelPickerPanel
            anchor={modelAnchor}
            selectedId={form.state.modelId}
            onSelect={(modelId) => {
              form.patch({ modelId });
              setPanel(null);
            }}
            onClose={() => setPanel(null)}
          />
        )}
      </div>
    </aside>
  );
}
