import type { VoicePreset } from "./config/voice-library";
import type { FlagCode } from "./ui/Flag";
export type AudioMode = "tts" | "voice-change" | "translate";
export type WorkspaceTab = "history" | "how-it-works";
export type OutputFormat = "mp3" | "wav" | "flac";
export type TileKey = "speed" | "pitch" | "volume";

export type AudioModelId =
  | "seed_audio"
  | "elevenlabs_v4"
  | "elevenlabs_v4_turbo"
  | "elevenlabs"
  | "qwen_audio"
  | "minimax"
  | "seed_speech";

export interface AudioModel {
  id: AudioModelId;
  name: string;
  description: string;
  logo: string;
  badge?: "new";
  expressive: boolean;
}

export interface AdvancedSettings {
  expression: number;
  mood: number;
  speed: number;
  pitch: number;
  volume: number;
  format: OutputFormat;
  sampleRate: number;
  saveSettings: boolean;
}

export interface AudioLanguage {
  id: string;
  label: string;
  flag: FlagCode;
}

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

export interface AudioFormState {
  voiceReferences: VoicePreset[];
  files: File[];
  script: string;
  voiceDetails: string;
  modelId: AudioModelId;
  batchSize: number;
  voiceId: string;
  language: string;
  lipSync: boolean;
  advanced: AdvancedSettings;
}

export type AudioGenerationRequest =
  | {
      mode: "tts";
      script: string;
      modelId: AudioModelId;
      voiceDetails: string;
      batchSize: number;
      references: File[];
      voices: VoicePreset[];
      settings: AdvancedSettings;
    }
  | {
      mode: "voice-change";
      source: File;
      voiceId: string;
      batchSize: number;
    }
  | {
      mode: "translate";
      source: File;
      language: string;
      lipSync: boolean;
      batchSize: number;
    };

export interface AudioHistoryItem {
  id: string;
  mode: AudioMode;
  title: string;
  createdAt: number;
  status: "processing" | "ready" | "failed";
  audioUrl?: string;
  liked?: boolean;
  downloaded?: boolean;
}

export type DatePreset = "all" | "today" | "7d" | "30d";

export interface HistoryFilters {
  date: DatePreset | { from: number; to: number };
  activity: "all" | "liked" | "downloaded";
}

export interface HowItWorksCardContent {
  title: string;
  description: string;
  descriptionMaxWidth: number;
  videoSrc: string;
  videoLabel: string;
}

export type HowItWorksContent =
  | {
      variant: "cards";
      title: string;
      subtitle: string;
      cards: HowItWorksCardContent[];
    }
  | {
      variant: "hero";
      title: string;
      subtitle: string;
      videoSrc: string;
      videoLabel: string;
    };

export type GenerateHandler = (
  request: AudioGenerationRequest,
) => Promise<AudioHistoryItem[] | void>;
