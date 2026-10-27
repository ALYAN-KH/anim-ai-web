import { FEATURED_MODELS, MODEL_GROUPS, type ModelGroup, type ModelOption } from "../models/model-data";

export const MOTION_MODELS: ModelOption[] = [
  { name: "Kling 3.0 Motion Control", icon: "kling", resolution: "1080p", duration: "3s-30s", info: { text: "Transfer motion from video to image" } },
  { name: "Kling Motion Control", icon: "kling", resolution: "1080p", duration: "3s-30s", info: { text: "Control motion with video references" } },
];

export const MOTION_FEATURED = [...FEATURED_MODELS.slice(0, 6), MOTION_MODELS[0]];
export const MOTION_GROUPS: ModelGroup[] = [
  { id: "motion-control", name: "Motion control models", description: "Control motion with video references", icon: "kling", models: MOTION_MODELS },
  ...MODEL_GROUPS,
];

export const motionModelSlug = (model: string) => model === MOTION_MODELS[1].name ? "kling-motion-control" : "kling-3-motion-control";
