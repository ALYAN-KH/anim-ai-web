import type {
  AdvancedSettings,
  AudioLanguage,
  AudioMode,
  OutputFormat,
  SelectOption,
  TileKey,
} from "../types";

export const MAX_BATCH_SIZE = 4;
export const MAX_VOICE_DETAILS = 500;
export const NOTICE_DURATION_MS = 4000;
export const DEMO_NOTICE = "Demo only — generation backend is not connected.";

export const DEFAULT_ADVANCED: AdvancedSettings = {
  expression: 5,
  mood: 50,
  speed: 1,
  pitch: 0,
  volume: 100,
  format: "mp3",
  sampleRate: 24000,
  saveSettings: false,
};

export const FORMAT_OPTIONS: SelectOption<OutputFormat>[] = [
  { value: "mp3", label: "MP3" },
  { value: "wav", label: "WAV" },
  { value: "flac", label: "FLAC" },
];

export const SAMPLE_RATE_OPTIONS: SelectOption<number>[] = [
  { value: 16000, label: "16 kHz" },
  { value: 24000, label: "24 kHz" },
  { value: 44100, label: "44.1 kHz" },
  { value: 48000, label: "48 kHz" },
];

export interface TileDefinition {
  key: TileKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

export const TILES: TileDefinition[] = [
  {
    key: "speed",
    label: "Speed",
    min: 0.5,
    max: 2,
    step: 0.1,
    format: (value) => `${value.toFixed(1)}x`,
  },
  {
    key: "pitch",
    label: "Pitch",
    min: -12,
    max: 12,
    step: 1,
    format: (value) => String(value),
  },
  {
    key: "volume",
    label: "Volume",
    min: 0,
    max: 200,
    step: 5,
    format: (value) => `${value}%`,
  },
];

export const LANGUAGES: AudioLanguage[] = [
  { id: "en", label: "English", flag: "us" },
  { id: "ar", label: "Arabic", flag: "sa" },
  { id: "zh", label: "Chinese", flag: "cn" },
  { id: "nl", label: "Dutch", flag: "nl" },
  { id: "fr", label: "French", flag: "fr" },
  { id: "de", label: "German", flag: "de" },
  { id: "hi", label: "Hindi", flag: "in" },
  { id: "it", label: "Italian", flag: "it" },
  { id: "ja", label: "Japanese", flag: "jp" },
  { id: "ko", label: "Korean", flag: "kr" },
  { id: "pl", label: "Polish", flag: "pl" },
  { id: "pt", label: "Portuguese", flag: "pt" },
  { id: "ru", label: "Russian", flag: "ru" },
  { id: "es", label: "Spanish", flag: "es" },
  { id: "tr", label: "Turkish", flag: "tr" },
  { id: "ur", label: "Urdu", flag: "pk" },
];

export interface UploadRule {
  max: number;
  accept: string;
  title: string;
  hint: string;
  badge: "Optional" | "Required";
}

export const UPLOAD_RULES: Record<AudioMode, UploadRule> = {
  tts: {
    max: 3,
    accept: "audio/*,image/*",
    title: "Upload media",
    hint: "Up to 3 Voices/Audios or Image",
    badge: "Optional",
  },
  "voice-change": {
    max: 1,
    accept: "video/mp4,video/quicktime",
    title: "Add your clip",
    hint: "Upload the video to change its voice",
    badge: "Required",
  },
  translate: {
    max: 1,
    accept: "video/mp4,video/quicktime",
    title: "Add your clip",
    hint: "Upload the video you want to dub",
    badge: "Required",
  },
};

export const VOICE_PICK_RULE = {
  title: "Pick a voice",
  hint: "Choose a preset or an uploaded voice",
  badge: "Required",
} as const;
