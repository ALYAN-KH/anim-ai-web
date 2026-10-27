"use client";
import { useState } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { AssetsPicker } from "../../../video-studio/assets/assets-picker";
import { VoiceLibrary } from "../fields/VoiceLibrary";
import { UPLOAD_RULES, getModel } from "../../config";
import type { AudioFormApi } from "../../hooks/useAudioForm";
import {
  AdvancedSettings,
  BatchSizeStepper,
  ModelRow,
  SelectedVoiceCard,
  ScriptField,
  TtsUploadIcons,
  UploadMediaCard,
  VoiceDetailsField,
} from "../fields";

interface TextToSpeechFormProps {
  form: AudioFormApi;
  onOpenModelPicker: (anchor: DOMRect) => void;
}

export function TextToSpeechForm({ form, onOpenModelPicker }: TextToSpeechFormProps) {
  const { state, patch, patchAdvanced, resetAdvanced, addFiles, removeFile } = form;
  const rules = UPLOAD_RULES.tts;
  const model = getModel(state.modelId);
  const [pickerAnchor, setPickerAnchor] = useState<DOMRect | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const voice = state.voiceReferences[0];

  return (
    <>
      {voice ? (
        <SelectedVoiceCard voice={voice} onChange={setPickerAnchor} onRemove={() => patch({ voiceReferences: [] })} />
      ) : (
        <UploadMediaCard
          files={state.files}
          max={rules.max}
          accept={rules.accept}
          title={rules.title}
          hint={rules.hint}
          badge={rules.badge}
          icons={<TtsUploadIcons />}
          onAdd={(files) => addFiles(files, rules.max)}
          onRemove={removeFile}
          onOpen={setPickerAnchor}
        />
      )}
      <ScriptField value={state.script} onChange={(script) => patch({ script })} />
      <ModelRow model={model} onClick={onOpenModelPicker} />
      <BatchSizeStepper value={state.batchSize} onChange={(batchSize) => patch({ batchSize })} />
      <VoiceDetailsField
        value={state.voiceDetails}
        onChange={(voiceDetails) => patch({ voiceDetails })}
      />
      <AdvancedSettings
        model={model}
        value={state.advanced}
        onChange={patchAdvanced}
        onReset={resetAdvanced}
      />
      {pickerAnchor && <AssetsPicker anchor={pickerAnchor} onClose={() => setPickerAnchor(null)} tabs={["voices", "uploads", "images", "audios"]} tabCounts={{ voices: state.voiceReferences.length }} initialTab="voices" accept={rules.accept} multiple motionUploadStyle pickerWidth={656} onFilesSelected={files => { addFiles(Array.from(files), rules.max - state.voiceReferences.length); setPickerAnchor(null); }} voicesPanel={<VoiceLibrary selected={state.voiceReferences.map(item => item.id)} onSelect={selected => { patch({ voiceReferences: [selected] }); setPickerAnchor(null); }} onCreateCustom={() => { setPickerAnchor(null); setAuthMode("login"); }} />} />}
      {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />}
    </>
  );
}
