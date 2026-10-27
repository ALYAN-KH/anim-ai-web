import type { ReactNode } from "react";
import type { SourceIconName } from "./shared/SourceIcon";

export type VideoTab = "create" | "edit" | "motion";

export type GlyphKind = "wan" | "kling" | "grok" | "wave" | "tri";

export type VideoModel = {
  id: string;
  name: string;
  res: string;
  dur: string;
  badge?: "NEW" | "PREMIUM";
  glyph?: GlyphKind;
};

export type VideoModelFamily = {
  id: string;
  name: string;
  desc: string;
  glyph: GlyphKind;
  items: VideoModel[];
};

export type EditWorkflowStep = {
  step: string;
  title: string;
  description: string;
  source: string;
  src: string;
  srcSet: string;
};

export type EditTool = {
  id: string;
  title: string;
  description: string;
  icon: SourceIconName;
  isNew?: boolean;
};

export type PickerModel = {
  name: string;
  sound?: boolean;
  premium?: boolean;
  quality?: string;
  duration?: string;
};

export type PickerProvider = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  models: PickerModel[];
};

export type Preset = {
  id: string;
  title: string;
  video: string;
};

export type ModelTab = {
  label: string;
  icon:
  | "seedance"
  | "swirl"
  | "flux"
  | "kling"
  | "grok"
  | "google"
  | "minimax"
  | "wan"
  | "happyhorse"
  | "none";
  isNew?: boolean;
};

export type VideoStudioProps = {
  initialTab?: VideoTab;
};
