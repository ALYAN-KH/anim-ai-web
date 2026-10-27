import type { AudioModel, AudioModelId } from "../types";

const LOGO_BASE = "https://static.higgsfield.ai/public/speech";

export const AUDIO_MODELS: AudioModel[] = [
  {
    id: "seed_audio",
    name: "Seed Audio 1.0",
    description: "Multi-speaker scenes with speech and ambience",
    logo: `${LOGO_BASE}/seed-speech.svg`,
    expressive: true,
  },
  {
    id: "elevenlabs_v4",
    name: "Eleven v4",
    description: "Expressive narration with stability and similarity controls",
    logo: `${LOGO_BASE}/elevenlabs.svg`,
    badge: "new",
    expressive: true,
  },
  {
    id: "elevenlabs_v4_turbo",
    name: "Eleven v4 Turbo",
    description: "Fast expressive speech with stability and similarity controls",
    logo: `${LOGO_BASE}/elevenlabs.svg`,
    badge: "new",
    expressive: true,
  },
  {
    id: "elevenlabs",
    name: "Eleven v3",
    description: "Emotion and delivery control via inline tags",
    logo: `${LOGO_BASE}/elevenlabs.svg`,
    expressive: false,
  },
  {
    id: "qwen_audio",
    name: "Qwen Audio 3.0",
    description: "Natural speech with voice, style, and emotion control",
    logo: `${LOGO_BASE}/qwen-audio.svg`,
    expressive: false,
  },
  {
    id: "minimax",
    name: "MiniMax Speech 2.8 HD",
    description: "High-fidelity single-voice narration",
    logo: `${LOGO_BASE}/minimax.svg`,
    expressive: false,
  },
  {
    id: "seed_speech",
    name: "Seed Speech",
    description: "Multilingual speech across 30+ languages",
    logo: `${LOGO_BASE}/seed-speech.svg`,
    expressive: false,
  },
];

export const DEFAULT_MODEL_ID: AudioModelId = "seed_audio";

export const getModel = (id: AudioModelId): AudioModel =>
  AUDIO_MODELS.find((model) => model.id === id) ?? AUDIO_MODELS[0];

export const modelIdFromParam = (param: string | null): AudioModelId | null =>
  AUDIO_MODELS.find((model) => model.id === param)?.id ?? null;
