// Exact content, links, and artwork from the supplied Audio dropdown HTML.
export const audioMenuGroups = [
  {
    "title": "Features",
    "items": [
      {
        "label": "Text to Speech",
        "description": "Generate speech from text",
        "href": "/audio?voiceMode=voiceover",
        "icon": "audio-reference-0"
      },
      {
        "label": "Voice Change",
        "description": "Swap voices in any video",
        "href": "/audio?voiceMode=change-voice",
        "icon": "audio-reference-1"
      },
      {
        "label": "Translate",
        "description": "Translate and lip-sync your video into a new language",
        "href": "/audio?voiceMode=translate",
        "icon": "audio-reference-2"
      }
    ]
  },
  {
    "title": "Models",
    "items": [
      {
        "label": "Seed Audio 1.0",
        "description": "Multi-speaker scenes with speech and ambience",
        "href": "/audio?voiceMode=voiceover&audioModel=seed_audio",
        "icon": "audio-reference-3"
      },
      {
        "label": "Eleven v4",
        "description": "Expressive narration with stability and similarity controls",
        "href": "/audio?voiceMode=voiceover&audioModel=elevenlabs_v4",
        "icon": "audio-reference-4",
        "badge": "new"
      },
      {
        "label": "Eleven v4 Turbo",
        "description": "Fast expressive speech with stability and similarity controls",
        "href": "/audio?voiceMode=voiceover&audioModel=elevenlabs_v4_turbo",
        "icon": "audio-reference-5",
        "badge": "new"
      },
      {
        "label": "Eleven v3",
        "description": "Emotion and delivery control via inline tags",
        "href": "/audio?voiceMode=voiceover&audioModel=elevenlabs",
        "icon": "audio-reference-6"
      },
      {
        "label": "Qwen Audio 3.0",
        "description": "Natural speech with voice, style, and emotion control",
        "href": "/audio?voiceMode=voiceover&audioModel=qwen_audio",
        "icon": "audio-reference-7"
      },
      {
        "label": "MiniMax Speech 2.8 HD",
        "description": "High-fidelity single-voice narration",
        "href": "/audio?voiceMode=voiceover&audioModel=minimax",
        "icon": "audio-reference-8"
      },
      {
        "label": "Seed Speech",
        "description": "Multilingual speech across 30+ languages",
        "href": "/audio?voiceMode=voiceover&audioModel=seed_speech",
        "icon": "audio-reference-9"
      }
    ]
  }
];

export const audioMenuIcons: Record<string,string> = {
  "audio-reference-0": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"fill-none\"><path d=\"M12.5 2.52746C12.3358 2.50932 12.169 2.5 12 2.5C9.51472 2.5 7.5 4.51472 7.5 7V12C7.5 14.4853 9.51472 16.5 12 16.5C13.9593 16.5 15.6262 15.2478 16.2439 13.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M11.9999 19.5C15.4494 19.5 18.3551 17.1712 19.2303 14M11.9999 19.5C8.55038 19.5 5.64478 17.1712 4.76953 14M11.9999 19.5V21.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M17.2405 5.18518L16.5436 3.37334C16.4571 3.14842 16.241 3 16 3C15.759 3 15.5429 3.14842 15.4564 3.37334L14.7595 5.18518C14.658 5.44927 14.4493 5.65797 14.1852 5.75955L12.3733 6.45641C12.1484 6.54292 12 6.75901 12 7C12 7.24099 12.1484 7.45708 12.3733 7.54359L14.1852 8.24045C14.4493 8.34203 14.658 8.55073 14.7595 8.81482L15.4564 10.6267C15.5429 10.8516 15.759 11 16 11C16.241 11 16.4571 10.8516 16.5436 10.6267L17.2405 8.81482C17.342 8.55073 17.5507 8.34203 17.8148 8.24045L19.6267 7.54359C19.8516 7.45708 20 7.24099 20 7C20 6.75901 19.8516 6.54292 19.6267 6.45641L17.8148 5.75955C17.5507 5.65797 17.342 5.44927 17.2405 5.18518Z\" fill=\"currentColor\"></path></svg>",
  "audio-reference-1": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M20.75 8.75V10.75\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M17.25 3.75V15.75\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M13.75 6.75V10.75\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M10.25 4.75V7.25\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M7 18.25C4.92893 18.25 3.25 16.5711 3.25 14.5C3.25 14.3305 3.26125 14.1636 3.28304 14M7 10.75C9.07107 10.75 10.75 12.4289 10.75 14.5C10.75 14.6695 10.7388 14.8364 10.717 15\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path><path d=\"M7.56932 12.9773V8.87921C7.56932 8.37012 6.95381 8.11517 6.59383 8.47515L4.54481 10.5242C4.32165 10.7474 4.32165 11.1092 4.54481 11.3323L6.59383 13.3814C6.95381 13.7413 7.56932 13.4864 7.56932 12.9773Z\" fill=\"currentColor\"></path><path d=\"M6.43091 20.5485V16.4504C6.43091 15.9414 7.04642 15.6864 7.4064 16.0464L9.45542 18.0954C9.67858 18.3186 9.67858 18.6804 9.45542 18.9035L7.4064 20.9525C7.04642 21.3125 6.43091 21.0576 6.43091 20.5485Z\" fill=\"currentColor\"></path></svg>",
  "audio-reference-2": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M7.25 10C7.66421 10 8 10.3358 8 10.75V11.5H11.75C12.1642 11.5 12.5 11.8358 12.5 12.25C12.5 12.6642 12.1642 13 11.75 13H10.9004C10.5628 15.0903 9.84711 16.8048 8.6543 18.1357C8.5895 18.208 8.52237 18.278 8.45508 18.3477C9.20236 18.8512 10.0918 19.2437 11.1475 19.5254C11.5477 19.6322 11.7855 20.0432 11.6787 20.4434C11.5719 20.8436 11.1609 21.0814 10.7607 20.9746C9.41834 20.6164 8.25625 20.0841 7.27637 19.3506C6.20809 20.0977 4.92269 20.6311 3.41992 20.9805C3.01651 21.0742 2.61337 20.8233 2.51953 20.4199C2.42576 20.0165 2.67669 19.6134 3.08008 19.5195C4.29484 19.2372 5.30137 18.8337 6.13184 18.3105C5.30213 17.396 4.68064 16.2889 4.24316 14.9893C4.11105 14.5967 4.32229 14.1712 4.71484 14.0391C5.1074 13.907 5.5329 14.1182 5.66504 14.5107C6.05792 15.6779 6.60385 16.62 7.30957 17.375C7.3878 17.2964 7.46448 17.2169 7.53809 17.1348C8.44954 16.1177 9.06 14.77 9.37793 13H2.75C2.33579 13 2 12.6642 2 12.25C2 11.8358 2.33579 11.5 2.75 11.5H6.5V10.75C6.5 10.3358 6.83579 10 7.25 10Z\" fill=\"currentColor\"></path><path d=\"M17.75 3C18.1642 3 18.5 3.33579 18.5 3.75V15.75C18.5 16.1642 18.1642 16.5 17.75 16.5C17.3358 16.5 17 16.1642 17 15.75V3.75C17 3.33579 17.3358 3 17.75 3Z\" fill=\"currentColor\"></path><path d=\"M21.25 8C21.6642 8 22 8.33579 22 8.75V10.75C22 11.1642 21.6642 11.5 21.25 11.5C20.8358 11.5 20.5 11.1642 20.5 10.75V8.75C20.5 8.33579 20.8358 8 21.25 8Z\" fill=\"currentColor\"></path><path d=\"M14.25 6C14.6642 6 15 6.33579 15 6.75V8.75C15 9.16421 14.6642 9.5 14.25 9.5C13.8358 9.5 13.5 9.16421 13.5 8.75V6.75C13.5 6.33579 13.8358 6 14.25 6Z\" fill=\"currentColor\"></path><path d=\"M10.75 4C11.1642 4 11.5 4.33579 11.5 4.75V7.25C11.5 7.66421 11.1642 8 10.75 8C10.3358 8 10 7.66421 10 7.25V4.75C10 4.33579 10.3358 4 10.75 4Z\" fill=\"currentColor\"></path></svg>",
  "audio-reference-3": "<img alt=\"Seed Audio 1.0\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/seed-speech.svg\">",
  "audio-reference-4": "<img alt=\"ElevenLabs\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/elevenlabs.svg\">",
  "audio-reference-5": "<img alt=\"ElevenLabs\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/elevenlabs.svg\">",
  "audio-reference-6": "<img alt=\"ElevenLabs\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/elevenlabs.svg\">",
  "audio-reference-7": "<img alt=\"Qwen Audio 3.0\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/qwen-audio.svg\">",
  "audio-reference-8": "<img alt=\"MiniMax\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/minimax.svg\">",
  "audio-reference-9": "<img alt=\"Seed Speech\" class=\"size-6\" src=\"https://static.higgsfield.ai/public/speech/seed-speech.svg\">"
};
