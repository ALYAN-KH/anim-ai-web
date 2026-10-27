import type { AudioMode, HowItWorksContent } from "../types";

const VIDEO_BASE = "https://static.higgsfield.ai/voice/how-to-use";

export const HOW_IT_WORKS: Record<AudioMode, HowItWorksContent> = {
  tts: {
    variant: "cards",
    title: "Turn text into speech",
    subtitle: "Lifelike speech from any script — ready for your projects",
    cards: [
      {
        title: "Pick or clone a voice",
        description: "Choose a preset, clone your own, or pick a model",
        descriptionMaxWidth: 266,
        videoSrc: `${VIDEO_BASE}/tts-left.mp4`,
        videoLabel: "Voice presets carousel",
      },
      {
        title: "Write, describe and generate",
        description: "Type your script, describe how it sounds, and create",
        descriptionMaxWidth: 328,
        videoSrc: `${VIDEO_BASE}/tts-right.mp4`,
        videoLabel: "Text to speech form with a script prompt",
      },
    ],
  },
  "voice-change": {
    variant: "hero",
    title: "Swap the voice,\nkeep the performance",
    subtitle: "Replace the voice, keep the delivery",
    videoSrc: `${VIDEO_BASE}/voice-change.mp4`,
    videoLabel: "Video clip with a carousel of voices to swap in",
  },
  translate: {
    variant: "hero",
    title: "Your video, in any language",
    subtitle: "Translate and lip-sync your video into a new language",
    videoSrc: `${VIDEO_BASE}/dubbing.mp4`,
    videoLabel: "Speaker dubbed into another language",
  },
};

export const HELP_TEXT =
  "Audio turns scripts into lifelike speech, swaps the voice in any clip, and translates videos with lip-sync. Pick a tool on the left and your results appear in History.";
