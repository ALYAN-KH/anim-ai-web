"use client";
import { useState } from "react";
import { LANGUAGES, UPLOAD_RULES } from "../../config";
import type { AudioFormApi } from "../../hooks/useAudioForm";
import { ClipAssetsPicker, ClipUploadIcons, LanguageSelectRow, UploadMediaCard } from "../fields";

interface TranslateFormProps {
  form: AudioFormApi;
}

export function TranslateForm({ form }: TranslateFormProps) {
  const { state, patch, addFiles, removeFile } = form;
  const rules = UPLOAD_RULES.translate;
  const [pickerAnchor, setPickerAnchor] = useState<DOMRect | null>(null);

  return (
    <>
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
        onOpen={setPickerAnchor}
      />
      <LanguageSelectRow
        value={state.language}
        options={LANGUAGES}
        onChange={(language) => patch({ language })}
      />
      {pickerAnchor && (
        <ClipAssetsPicker
          anchor={pickerAnchor}
          accept={rules.accept}
          onClose={() => setPickerAnchor(null)}
          onFiles={(files) => {
            addFiles(files, rules.max);
            setPickerAnchor(null);
          }}
        />
      )}
    </>
  );
}
