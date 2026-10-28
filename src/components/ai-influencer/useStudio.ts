"use client";

import { useEffect, useReducer, useState } from "react";
import { DEFAULT_TIER, type ExploreFeed, MOTION_MODEL, QUALITIES, type InfluencerPreset, type MotionMode, type MotionPreset, type Quality, type SectionId, type Selection, type TierId } from "./data";
import { normalize, randomSelection, toggleOption } from "./selection";

export type CreationMode = "create" | "motion";
export type WorkspaceView = "explore" | "history";

export type MotionSettings = {
  mode: MotionMode;
  model: string;
  quality: Quality;
  promptOn: boolean;
  prompt: string;
  /** Reference video and images chosen from a preset (uploads live in useUploads). */
  presetVideo?: { url: string; thumb?: string; title: string };
  presetImages: { url: string; thumb?: string }[];
};

export type StudioState = {
  mode: CreationMode;
  tier: TierId;
  selection: Selection;
  open: string[];
  batch: number;
  view: WorkspaceView;
  feed: ExploreFeed;
  motion: MotionSettings;
};

export type StudioAction =
  | { type: "mode"; mode: CreationMode }
  | { type: "tier"; tier: TierId }
  | { type: "toggle"; section: SectionId; option: string }
  | { type: "reset" }
  | { type: "randomize" }
  | { type: "recreateInfluencer"; preset: InfluencerPreset }
  | { type: "recreateMotion"; preset: MotionPreset }
  | { type: "accordion"; id: string }
  | { type: "batch"; value: number }
  | { type: "view"; view: WorkspaceView }
  | { type: "feed"; feed: ExploreFeed }
  | { type: "motion"; patch: Partial<MotionSettings> }
  | { type: "hydrate"; state: Partial<StudioState> };

export const BATCH_MIN = 1;
export const BATCH_MAX = 4;

export const initialState: StudioState = {
  mode: "create",
  tier: DEFAULT_TIER,
  selection: {},
  open: ["tier"],
  batch: 1,
  view: "explore",
  feed: "influencers",
  motion: { mode: "transfer", model: MOTION_MODEL, quality: "720p", promptOn: false, prompt: "", presetImages: [] },
};

function reducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case "mode": return { ...state, mode: action.mode };
    case "tier": return { ...state, tier: action.tier, selection: normalize(state.selection, action.tier) };
    case "toggle": return { ...state, selection: toggleOption(state.selection, state.tier, action.section, action.option) };
    case "reset": return { ...state, selection: {}, batch: 1 };
    case "randomize": return { ...state, selection: randomSelection(state.tier, state.selection.gender) };
    case "recreateInfluencer": {
      const { tier, selection } = action.preset;
      return { ...state, mode: "create", tier, selection: normalize(selection, tier), open: state.open.includes("tier") ? state.open : ["tier", ...state.open] };
    }
    case "recreateMotion": {
      const p = action.preset;
      const generation = p.variants.find((v) => v.type === "generation");
      return {
        ...state,
        mode: "motion",
        motion: {
          ...state.motion,
          mode: p.mode,
          quality: (QUALITIES as readonly string[]).includes(p.resolution ?? "") ? (p.resolution as Quality) : "720p",
          promptOn: Boolean(p.prompt),
          prompt: p.prompt ?? "",
          presetVideo: { url: p.original.url, thumb: p.original.thumb, title: p.title },
          presetImages: (generation?.inputs ?? []).map((a) => ({ url: a.url, thumb: a.thumb })),
        },
      };
    }
    case "accordion": return { ...state, open: state.open.includes(action.id) ? state.open.filter((id) => id !== action.id) : [...state.open, action.id] };
    case "batch": return { ...state, batch: Math.min(BATCH_MAX, Math.max(BATCH_MIN, action.value)) };
    case "view": return { ...state, view: action.view };
    case "feed": return { ...state, view: "explore", feed: action.feed };
    case "motion": return { ...state, motion: { ...state.motion, ...action.patch } };
    case "hydrate": {
      const motion = { ...state.motion, ...action.state.motion };
      if (!(QUALITIES as readonly string[]).includes(motion.quality)) motion.quality = "720p";
      return { ...state, ...action.state, motion };
    }
  }
}

const STORAGE_KEY = "hf-ai-influencer-studio:v1";

/** Studio state, persisted across visits like the reference (uploads are not persisted). */
export function useStudio() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Saving waits for the stored state to be read, so defaults never overwrite it.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Partial<StudioState> | null;
      if (saved) dispatch({ type: "hydrate", state: { ...saved, selection: normalize(saved.selection ?? {}, saved.tier ?? DEFAULT_TIER) } });
    } catch {
      // Unreadable storage: keep defaults.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked: persistence is a convenience only.
    }
  }, [state, ready]);

  return [state, dispatch] as const;
}
