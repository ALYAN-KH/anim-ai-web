import type { Mode } from "./data";

export interface Setup {
  genre: string; era: string; tempo: string;
  camera: string; lens: string; aperture: string;
  palette: string | null; lighting: string;
}
export const DEFAULT_SETUP: Setup = {
  genre: "General", era: "Auto", tempo: "Auto",
  camera: "Auto", lens: "Auto", aperture: "Auto",
  palette: null, lighting: "Auto",
};

export interface ModeState { model: string; modelName: string; ratio: string; res: string; duration: string; audio: boolean; batch: number; prompt: string; refs: number }
export const DEFAULT_MODES: Record<Mode, ModeState> = {
  video: { model: "cinema-4", modelName: "Cinema Studio 4.0", ratio: "16:9", res: "1080p", duration: "5s", audio: true, batch: 1, prompt: "", refs: 0 },
  image: { model: "soul-cinema", modelName: "Higgsfield Soul Cinema", ratio: "16:9", res: "2k", duration: "", audio: false, batch: 1, prompt: "", refs: 0 },
};

export type ModalState =
  | null
  | { kind: "film"; tab: "genre" | "era" | "tempo" }
  | { kind: "camera"; tab: "setup" | "movement" }
  | { kind: "palette" }
  | { kind: "lighting" }
  | { kind: "character" };
