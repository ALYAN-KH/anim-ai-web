"use client";
import { useCallback, useEffect, useReducer, useState } from "react";
import { FORMAT_OPTIONS, SAMPLE_RATE_OPTIONS, TILES } from "../config";
import { createInitialState, formReducer } from "../lib/form";
import type { AdvancedSettings, AudioFormState, AudioModelId } from "../types";

export function useAudioForm(initialModelId: AudioModelId) {
  const [state, dispatch] = useReducer(formReducer, initialModelId, createInitialState);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("audio-studio-settings") ?? "null");
      if (saved?.saveSettings === true) {
        const patch: Partial<AdvancedSettings> = { saveSettings: true };
        for (const tile of TILES) if (typeof saved[tile.key] === "number" && Number.isFinite(saved[tile.key])) patch[tile.key] = Math.max(tile.min, Math.min(tile.max, saved[tile.key]));
        for (const key of ["expression", "mood"] as const) if (typeof saved[key] === "number" && Number.isFinite(saved[key])) patch[key] = Math.max(0, Math.min(key === "mood" ? 100 : 10, saved[key]));
        if (FORMAT_OPTIONS.some(option => option.value === saved.format)) patch.format = saved.format;
        if (SAMPLE_RATE_OPTIONS.some(option => option.value === saved.sampleRate)) patch.sampleRate = saved.sampleRate;
        dispatch({ type: "advanced", patch });
      }
    } catch { /* Storage may be unavailable or contain an old value. */ }
    setSettingsLoaded(true);
  }, []);
  useEffect(() => {
    if (!settingsLoaded) return;
    try { if (state.advanced.saveSettings) localStorage.setItem("audio-studio-settings", JSON.stringify(state.advanced)); else localStorage.removeItem("audio-studio-settings"); } catch { /* Keep the controls usable when storage is unavailable. */ }
  }, [state.advanced, settingsLoaded]);

  const patch = useCallback(
    (value: Partial<Omit<AudioFormState, "advanced" | "files">>) =>
      dispatch({ type: "patch", patch: value }),
    [],
  );
  const patchAdvanced = useCallback(
    (value: Partial<AdvancedSettings>) => dispatch({ type: "advanced", patch: value }),
    [],
  );
  const resetAdvanced = useCallback(() => dispatch({ type: "resetAdvanced" }), []);
  const addFiles = useCallback(
    (files: File[], max: number) => dispatch({ type: "addFiles", files, max }),
    [],
  );
  const removeFile = useCallback(
    (index: number) => dispatch({ type: "removeFile", index }),
    [],
  );
  const clearFiles = useCallback(() => dispatch({ type: "clearFiles" }), []);

  return { state, patch, patchAdvanced, resetAdvanced, addFiles, removeFile, clearFiles };
}

export type AudioFormApi = ReturnType<typeof useAudioForm>;
