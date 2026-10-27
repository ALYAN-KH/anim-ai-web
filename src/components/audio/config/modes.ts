import type { AudioMode } from "../types";

export interface ModeDefinition {
  id: AudioMode;
  label: string;
  param: string;
}

export const AUDIO_MODES: ModeDefinition[] = [
  { id: "tts", label: "Text to Speech", param: "voiceover" },
  { id: "voice-change", label: "Voice Change", param: "change-voice" },
  { id: "translate", label: "Translate", param: "translate" },
];

export const DEFAULT_MODE: AudioMode = "tts";

export const modeFromParam = (param: string | null): AudioMode =>
  AUDIO_MODES.find((mode) => mode.param === param)?.id ?? DEFAULT_MODE;

export const paramFromMode = (id: AudioMode): string =>
  AUDIO_MODES.find((mode) => mode.id === id)?.param ?? AUDIO_MODES[0].param;

export const modeLabel = (id: AudioMode): string =>
  AUDIO_MODES.find((mode) => mode.id === id)?.label ?? "";
