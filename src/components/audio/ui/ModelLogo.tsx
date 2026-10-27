import type { AudioModel } from "../types";
import { SeedMark } from "./Icons";

interface ModelLogoProps {
  model: AudioModel;
  className?: string;
}

export function ModelLogo({ model, className = "size-4" }: ModelLogoProps) {
  if (model.id === "seed_audio" || model.id === "seed_speech") {
    return <SeedMark className={className} />;
  }
  return <img src={model.logo} alt="" aria-hidden="true" className={className} />;
}
