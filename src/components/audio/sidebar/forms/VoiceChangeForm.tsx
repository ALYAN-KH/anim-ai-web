"use client";
import { useState } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { UPLOAD_RULES } from "../../config";
import { voiceLibrary } from "../../config/voice-library";
import type { AudioFormApi } from "../../hooks/useAudioForm";
import {
  ClipAssetsPicker,
  ClipUploadIcons,
  SelectedVoiceCard,
  UploadMediaCard,
  VoiceSelectCard,
  VoiceSelectDialog,
} from "../fields";

interface VoiceChangeFormProps {
  form: AudioFormApi;
}

export function VoiceChangeForm({ form }: VoiceChangeFormProps) {
  const { state, patch, addFiles, removeFile } = form;
  const rules = UPLOAD_RULES["voice-change"];
  const voice = voiceLibrary.find((item) => item.id === state.voiceId);
  const [voiceAnchor, setVoiceAnchor] = useState<DOMRect | null>(null);
  const [clipAnchor, setClipAnchor] = useState<DOMRect | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <>
      {voice ? (
        <SelectedVoiceCard voice={voice} onChange={setVoiceAnchor} onRemove={() => patch({ voiceId: "" })} />
      ) : (
        <VoiceSelectCard onClick={setVoiceAnchor} />
      )}
      <UploadMediaCard
        files={state.files}
        max={rules.max}
        accept={rules.accept}
        title={rules.title}
        hint={rules.hint}
        badge={rules.badge}
        icons={<ClipUploadIcons />}
        onAdd={(files) => addFiles(files, rules.max)}
        onRemove={removeFile}
        onOpen={setClipAnchor}
      />
      {voiceAnchor && (
        <VoiceSelectDialog
          anchor={voiceAnchor}
          selectedId={state.voiceId}
          onSelect={(selected) => {
            patch({ voiceId: selected.id });
            setVoiceAnchor(null);
          }}
          onCreateCustom={() => {
            setVoiceAnchor(null);
            setAuthMode("login");
          }}
          onClose={() => setVoiceAnchor(null)}
        />
      )}
      {clipAnchor && (
        <ClipAssetsPicker
          anchor={clipAnchor}
          accept={rules.accept}
          onClose={() => setClipAnchor(null)}
          onFiles={(files) => {
            addFiles(files, rules.max);
            setClipAnchor(null);
          }}
        />
      )}
      {authMode && (
        <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />
      )}
    </>
  );
}
