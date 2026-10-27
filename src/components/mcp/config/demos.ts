import type { DemoDefinition } from "../types";
import { STATIC } from "./links";

/** Demo carousel, taken from higgsfield.ai/mcp (data/extracted/chatgpt.json + the live DOM). */
export const DEMOS: DemoDefinition[] = [
  {
    id: "genjutsu",
    label: "Genjutsu",
    isNew: true,
    poster: `${STATIC}/genjutsu/genjutsu-intro-poster.webp`,
    videoSrc: `${STATIC}/genjutsu/genjutsu-intro.mp4`,
    title: "Genjutsu",
    prompt:
      "Use Genjutsu to remake my reference video with my own characters, locations and products while preserving the original motion, camera movement and timing. Ask me to upload my reference video and images before starting.",
  },
  {
    id: "generate-video",
    label: "Generate video",
    poster: `${STATIC}/landing/gpt-skills/demos/20261016-audio/video-generation-poster.webp`,
    videoSrc: `${STATIC}/landing/gpt-skills/demos/20261016-audio/video-generation.mp4`,
    title: "Generate a video",
    prompt:
      "Make a 14-second video of a young woman with dark hair in a pixie cut, wearing a green crop top and a grey midi skirt. She walks in slow motion through a busy vintage office. The camera tracks alongside her as papers fly through the air. Dim, green-tinted lighting creates a moody, cinematic atmosphere. She stops at a desk and answers a ringing black rotary phone with a serious expression.",
  },
  {
    id: "generate-image",
    label: "Generate image",
    poster: `${STATIC}/landing/gpt-skills/20261016-assets/demos/fashion.webp`,
    title: "Generate an image",
    prompt:
      "Create a fashion editorial photo of a young woman standing between pink architectural frames against lime-green walls, her hands resting on the vertical beams. She wears a sculptural ivory gown with floral ruffles, pearl detailing, and a layered skirt, her black hair styled into two exceptionally long braids with a flower beside her temple. Use soft studio lighting, saturated colors, and the natural grain of 35mm film.",
    models: ["Nano Banana Pro","GPT-Image 2.5","Seedream 5.0"],
  },
  {
    id: "edit-photo",
    label: "Edit a photo",
    poster: `${STATIC}/landing/gpt-skills/demos/20261017-photo-swap/photo-original.webp`,
    title: "Edit a photo",
    prompt:
      "Edit my photo: replace the oversized lavender music player and studio background with a grassy ledge overlooking rolling green hills beneath a pale blue sky. Swap the giant disc and headphones for a quilted pink backpack with a fluffy pom-pom and a pink water bottle with a cream cap. Use soft natural daylight and realistic contact shadows, keeping my face, pose, hair, outfit, white sneakers, and camera framing exactly the same.",
  },
  {
    id: "video-edit",
    label: "Video edit",
    poster: `${STATIC}/landing/gpt-skills/katana/20261016/test_v2-poster.webp`,
    videoSrc: `${STATIC}/landing/gpt-skills/katana/20261016/test_v2.mp4`,
    title: "Edit a video",
    prompt:
      "/katana Recreate this aura edit using my subject. Match the reference’s pacing, camera movement, transitions, color grade, and graphic effects, and adapt the scenes and on-screen text to my subject. Keep the reference soundtrack unless I request a different track. Ask me for the reference video and a photo or clip of my subject before starting.",
  },
];
