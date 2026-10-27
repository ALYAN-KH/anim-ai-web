"use client";

import { BytedanceIcon, FluxIcon, ModelIcon, TopazIcon } from "./model-icons";

export const RESOLUTIONS = ["1K", "2K", "4K"];

export const CREATIVITY = ["precise", "creative"];

export const MODELS: {
  id: string;
  title: string;
  description: string;
  Icon: ModelIcon;
  accent: boolean;
}[] = [
    {
      id: "flux-3-upscale",
      title: "FLUX.3 Upscale",
      description: "Preserve the original or creatively enhance detail",
      Icon: FluxIcon,
      accent: true,
    },
    {
      id: "topaz-starlight-precise",
      title: "Topaz Starlight Precise",
      description: "Recover natural detail in faces, textures, and text",
      Icon: TopazIcon,
      accent: false,
    },
    {
      id: "bytedance-upscale",
      title: "ByteDance Upscale",
      description: "High-fidelity upscaling up to 8K with scene presets",
      Icon: BytedanceIcon,
      accent: false,
    },
    {
      id: "topaz-video",
      title: "Topaz Video",
      description: "Enhance and upscale low- to medium-quality footage",
      Icon: TopazIcon,
      accent: false,
    },
  ];
