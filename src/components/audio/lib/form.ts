import { DEFAULT_ADVANCED, LANGUAGES, MAX_BATCH_SIZE } from "../config";
import type {
  AdvancedSettings,
  AudioFormState,
  AudioGenerationRequest,
  AudioMode,
  AudioModelId,
} from "../types";

export type FormAction =
  | { type: "patch"; patch: Partial<Omit<AudioFormState, "advanced" | "files">> }
  | { type: "advanced"; patch: Partial<AdvancedSettings> }
  | { type: "resetAdvanced" }
  | { type: "addFiles"; files: File[]; max: number }
  | { type: "removeFile"; index: number }
  | { type: "clearFiles" };

export const createInitialState = (modelId: AudioModelId): AudioFormState => ({
  files: [],
  voiceReferences: [],
  script: "",
  voiceDetails: "",
  modelId,
  batchSize: 1,
  voiceId: "",
  language: LANGUAGES[0].id,
  lipSync: true,
  advanced: DEFAULT_ADVANCED,
});

export function formReducer(
  state: AudioFormState,
  action: FormAction,
): AudioFormState {
  switch (action.type) {
    case "patch": {
      const next = { ...state, ...action.patch };
      next.batchSize = Math.min(Math.max(next.batchSize, 1), MAX_BATCH_SIZE);
      return next;
    }
    case "advanced":
      return { ...state, advanced: { ...state.advanced, ...action.patch } };
    case "resetAdvanced":
      return { ...state, advanced: DEFAULT_ADVANCED };
    case "addFiles":
      return {
        ...state,
        files: [...state.files, ...action.files].slice(0, action.max),
      };
    case "removeFile":
      return {
        ...state,
        files: state.files.filter((_, index) => index !== action.index),
      };
    case "clearFiles":
      return { ...state, files: [] };
    default:
      return state;
  }
}

export function canSubmit(mode: AudioMode, state: AudioFormState): boolean {
  if (mode === "tts") return state.script.trim().length > 0;
  if (mode === "voice-change") return state.files.length > 0 && Boolean(state.voiceId);
  return state.files.length > 0 && Boolean(state.language);
}

export function buildGenerationRequest(
  mode: AudioMode,
  state: AudioFormState,
): AudioGenerationRequest {
  if (mode === "tts") {
    return {
      mode,
      script: state.script.trim(),
      modelId: state.modelId,
      voiceDetails: state.voiceDetails.trim(),
      batchSize: state.batchSize,
      references: state.files,
      voices: state.voiceReferences,
      settings: state.advanced,
    };
  }
  if (mode === "voice-change") {
    return {
      mode,
      source: state.files[0],
      voiceId: state.voiceId,
      batchSize: state.batchSize,
    };
  }
  return {
    mode,
    source: state.files[0],
    language: state.language,
    lipSync: state.lipSync,
    batchSize: state.batchSize,
  };
}
