"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ModelTab, Preset } from "../types";

export type { ModelTab, Preset };

/* -------------------------------------------------------------------------- */
/* SVG Geometry Paths                                                         */
/* -------------------------------------------------------------------------- */

const SVG_PATHS = {
  seedance:
    "m3.154 12.154-2.62.655V1.2l2.62.655v10.3Zm12.668.679-2.626.656V.519l2.627.65v11.664Zm-8.509-.325-2.622.656v-6.84l2.622.655v5.53ZM9.025 5.31l2.627-.656v6.84l-2.627-.656V5.31Z",
  swirl:
    "m13.514 7.896-.01-.115c-.1-1.103-.818-3.178-2.809-3.178-1.477 0-2.593 1.458-3.578 2.744-.786 1.03-1.466 1.913-2.216 1.913a.865.865 0 0 1-.613-.345c-.141-.204-.178-.465-.104-.779.115-.496.775-.956 1.472-1.448.382-.26.775-.538 1.047-.804.786-.758 1.184-1.307 1.184-2.19s-.487-1.322-.895-1.51c-.818-.377-2.017-.157-2.782.501-.115.105-.23.204-.335.298-.77.685-1.289 1.15-2.478.794V5.21c1.577.696 2.902-.632 3.405-1.243.388-.403.796-.638 1.1-.638h.016a.46.46 0 0 1 .335.152c.136.157.189.34.163.543-.058.429-.503.93-1.32 1.48-.96.642-2.562 1.719-2.688 3.072-.094.972.408 1.944 1.194 2.32 1.834.868 2.95-.627 4.134-2.205.906-1.218 1.765-2.373 2.96-2.373 1.073 0 1.472.889 1.472 1.448v.11l-.105.02c-2.604.46-4.024 2.896-4.024 4.02 0 1.123.954 2.085 2.127 2.085 1.373 0 3.07-1.17 3.342-4.463l.011-.12h1.084V7.896h-1.09Zm-1.42 1.688c-.21 1.97-1.22 2.89-1.833 2.89-.278 0-.666-.23-.666-.659 0-.48.718-1.939 2.331-2.372l.19-.047-.022.188Z",
  fluxA:
    "M24 21h-2.122l-9.83-14.736-8.682 12.912h12.22L16.78 21H0L12.024 3 24 21Z",
  fluxB:
    "M20.39 21h-2.122l-4.825-7.252-.906-1.436h2.122L20.39 21Zm-8.146-3.888H8l2.122-3.215 2.122 3.215Zm7.512-4.992 2.17-3.168L24 12.12h-4.244Z",
  kling:
    "m16.752 2.87.066.067.002-.001c1.267 1.318.904 3.968-.934 6.973l3.614 3.748-.155.313a11.1 11.1 0 0 1-2.426 3.246 10.437 10.437 0 0 1-4.605 2.488l-.062.016-.089.022-.064.014-.14.033-.117.024-.088.017c-.093.02-.19.037-.286.054l-.08.012-.06.008-.255.034a9.3 9.3 0 0 1-4.221-.486 9.575 9.575 0 0 1-3.609-2.323l-.06-.06c-1.269-1.319-.91-3.97.93-6.977L.5 6.344l.155-.313a10.97 10.97 0 0 1 2.428-3.244A10.61 10.61 0 0 1 6.57.64c.298-.111.61-.208.916-.29.252-.07.507-.13.765-.178.087-.018.185-.037.28-.053a9.271 9.271 0 0 1 4.425.362 9.542 9.542 0 0 1 3.795 2.389Zm-1.222.16h-.003l.003.003c-1.227-.394-3.176.243-5.236 1.65 1.567-.453 3.083-.219 4.063.798.928.964 1.182 2.427.83 3.964a2.92 2.92 0 0 1-.062.25c1.681-2.638 2.22-5.105 1.154-6.207a.64.64 0 0 0-.055-.056l-.009-.008-.011-.01-.036-.029a.83.83 0 0 0-.047-.037l-.027-.02a1.839 1.839 0 0 0-.564-.297Zm-.842 5.929c-.217 1.34-.932 2.696-2.016 3.818-1.08 1.123-2.39 1.865-3.685 2.092-1.212.212-2.257-.065-2.942-.773-.684-.71-.95-1.79-.746-3.052.217-1.34.93-2.695 2.01-3.816l.005-.007.004-.006c1.083-1.116 2.387-1.856 3.679-2.08 1.212-.212 2.255.064 2.942.773.683.709.95 1.79.745 3.051h.004ZM3.706 3.51a9.99 9.99 0 0 0-2.054 2.652l-.006.001 3.135 3.244c.26-.38.534-.749.82-1.107.102-.125.207-.255.315-.385l.04-.048.15-.173c.004-.004.008-.012.008-.012l.028-.032.014-.018.077-.088c.04-.047.08-.093.122-.138 0-.004.006-.01.006-.01l.067-.077.048-.051a.012.012 0 0 1 .003-.004c.005-.003.005-.006.005-.006a.068.068 0 0 0 .009-.012l.008-.01a.126.126 0 0 0 .02-.022l.013-.012.083-.089a.599.599 0 0 1 .05-.055l.025-.027.016-.019.048-.049.093-.095.031-.034.035-.038a20.74 20.74 0 0 1 2.147-1.943l.1-.075v-.001h.001l.1-.077c.11-.086.223-.17.335-.253.12-.085.24-.168.36-.25 1.629-1.127 3.224-1.802 4.526-1.936a8.41 8.41 0 0 0-6.067-1.137l-.156.03-.03.007A9.626 9.626 0 0 0 3.706 3.51Zm.173 13.142c.174.138.372.242.594.313H4.47c1.236.392 3.177-.247 5.23-1.65-1.566.45-3.079.216-4.058-.8-.924-.96-1.178-2.428-.828-3.965a3.48 3.48 0 0 1 .062-.249c-1.681 2.638-2.218 5.104-1.155 6.207.05.051.103.1.159.144Zm14.467-2.814v.001a10.056 10.056 0 0 1-2.053 2.65 9.633 9.633 0 0 1-4.33 2.303l-.02.005-.054.013c-.06.017-.121.03-.183.041-.04.01-.08.017-.123.024a4.8 4.8 0 0 1-.26.045l-.073.013-.083.011a8.428 8.428 0 0 1-5.65-1.206c1.254-.128 2.78-.763 4.346-1.812l.09-.06.089-.061.121-.085h.001l.235-.166c.114-.083.226-.167.336-.254.069-.05.136-.102.202-.152a21.375 21.375 0 0 0 2.193-1.994l.02-.022a2.82 2.82 0 0 0 .092-.095l.047-.049s.013-.012.015-.019l.018-.018.007-.008.054-.056.042-.045a.797.797 0 0 0 .041-.043l.012-.013a.129.129 0 0 1 .02-.02l.01-.012.008-.01.01-.01.017-.018.017-.019.016-.016a.812.812 0 0 0-.05.06l.039-.042v-.002l.08-.086s0-.006.007-.006c.036-.04.071-.082.106-.123l.07-.08a.064.064 0 0 0 .022-.026l.04-.05.01-.012c.048-.053.095-.108.142-.163l.048-.058c.078-.094.155-.188.232-.284l.094-.115.029-.037.11-.142a21.19 21.19 0 0 0 .669-.915l3.122 3.238Zm0 0c0-.002.001-.004.004-.005v.01l-.004-.004h.001l-.001-.001Z",
  happyhorse:
    "M9.396 9.99c.883-1.177 2.547-2.828 2.598-3.993C12.097 4.487 10.574 3.987 9 4c-1.1.013-2.227.333-2.995.602-2.675.947-4.34 2.445-5.402 4.121C-.51 10.375-.14 11.95 2.215 12c1.805-.077 2.982-.576 4.211-1.203.013 0-3.392.973-4.633.256a.566.566 0 0 1-.308-.46c-.012-.59.973-1.204 1.524-1.396V8.173a3.598 3.598 0 0 0 3.622-.602c.026.09.038.192.026.295H6.9c.025-.269-.115-.474-.115-.474-.218-.358-.615-.345-.615-.345s.205.09.359.307a3.276 3.276 0 0 1-2.125.768 3.1 3.1 0 0 1-.986-.154l.807-.806-.218-.589c1.626-.563 2.982-.998 5.21-1.395l-.512-.371.256-.154c1.344.371 2.227.64 2.176 1.357a2.424 2.424 0 0 1-.128.41c-.384.767-1.55 2.06-2.023 2.598-.307.358-.614.704-.832 1.037-.217.332-.358.652-.37.947.025 2.342 6.885-1.088 8.217-1.997-1.959.845-4.07 1.651-6.4 1.805-.653.038-.576-.307-.205-.82Z",
  grokA:
    "M9.23842 15.4055L17.3051 9.26292C17.7006 8.9618 18.2658 9.07925 18.4543 9.54702C19.446 12.0138 19.0029 14.9784 17.0297 17.0138C15.0566 19.0492 12.3111 19.4955 9.80163 18.4789L7.06027 19.7882C10.9922 22.5604 15.7667 21.8748 18.7504 18.795C21.117 16.3538 21.8499 13.0262 21.1646 10.0254L21.1708 10.0318C20.1769 5.62354 21.4151 3.86151 23.9515 0.258408C23.9702 0.231693 23.9351 0.202703 23.9123 0.226139L20.7939 3.44289V3.43221L9.23842 15.4055Z",
  grokB:
    "M7.65167 7.33217C5.24368 9.81392 4.75711 14.1176 7.57924 16.8984L7.57713 16.9005L0.0792788 23.8097C0.0528384 23.834 0.0162235 23.8015 0.0377551 23.7728C0.487937 23.1707 1.01883 22.595 1.54932 22.0198L1.57777 21.9889C3.28214 20.1411 4.97141 18.3097 3.93926 15.7216C2.55615 12.2552 3.36158 8.19287 5.9228 5.55089C8.58547 2.80639 12.507 2.1144 15.7826 3.5048C16.5072 3.78245 17.1388 4.17758 17.6315 4.54493L14.8964 5.84777C12.3497 4.7457 9.43229 5.49537 7.65167 7.33217Z",
  google:
    "M2.555 6.258A8.33 8.33 0 0 1 10 1.666c2.246 0 4.133.825 5.575 2.17l-2.389 2.39C12.322 5.401 11.224 4.98 10 4.98c-2.17 0-4.008 1.467-4.662 3.436a5.006 5.006 0 0 0-.262 1.583 5 5 0 0 0 .262 1.584c.655 1.97 2.491 3.435 4.662 3.435 1.121 0 2.075-.295 2.822-.795a3.834 3.834 0 0 0 1.663-2.515H10V8.484h7.849c.098.545.151 1.114.151 1.704 0 2.539-.908 4.675-2.485 6.126-1.378 1.273-3.265 2.019-5.515 2.019a8.33 8.33 0 0 1-8.333-8.334c0-1.345.322-2.616.887-3.741Z",
  minimax:
    "M13.565 1.667c.963 0 1.744.772 1.744 1.725V13.81a.616.616 0 0 0 .62.59.616.616 0 0 0 .62-.59V7.582a1.716 1.716 0 0 1 1.725-1.708A1.717 1.717 0 0 1 20 7.584v5.467a.54.54 0 0 1-.75.498.542.542 0 0 1-.337-.498V7.584a.635.635 0 0 0-.639-.632.635.635 0 0 0-.638.632v6.226a1.698 1.698 0 0 1-1.707 1.689 1.697 1.697 0 0 1-1.707-1.689V3.394a.654.654 0 0 0-.656-.628.654.654 0 0 0-.658.627v13.253a1.697 1.697 0 0 1-1.707 1.688 1.698 1.698 0 0 1-1.707-1.689v-1.611a.54.54 0 0 1 .543-.538c.3 0 .544.241.544.538v1.611c0 .22.118.422.31.532a.628.628 0 0 0 .847-.224.612.612 0 0 0 .083-.308V3.392c0-.953.78-1.725 1.744-1.725Zm-4.728 0c.963 0 1.744.772 1.744 1.725v9.603a.539.539 0 0 1-.543.537.54.54 0 0 1-.544-.537V3.392a.654.654 0 0 0-.657-.65.654.654 0 0 0-.658.65V15.07a1.717 1.717 0 0 1-1.725 1.706 1.717 1.717 0 0 1-1.726-1.707V7.584a.635.635 0 0 0-.638-.632.635.635 0 0 0-.638.632v3.166a1.717 1.717 0 0 1-1.726 1.708A1.718 1.718 0 0 1 0 10.75V9.602a.54.54 0 0 1 .543-.538c.3 0 .544.241.544.538v1.148c0 .349.286.631.639.631a.635.635 0 0 0 .638-.63V7.582A1.717 1.717 0 0 1 4.09 5.876a1.717 1.717 0 0 1 1.726 1.707v7.486c0 .35.286.632.64.632a.635.635 0 0 0 .638-.632V3.393c0-.953.78-1.725 1.744-1.725Z",
  wan:
    "m19.936 12.141-2.312-4.046-.271-.478 1.224-2.14a.486.486 0 0 0 0-.478l-1.362-2.38a.473.473 0 0 0-.41-.239h-5.173L10.408.236a.468.468 0 0 0-.41-.239h-2.72a.465.465 0 0 0-.41.239l-2.315 4.05-.272.474H1.832a.465.465 0 0 0-.41.239L.065 7.382a.486.486 0 0 0 0 .478l2.587 4.523-1.225 2.144a.486.486 0 0 0 0 .478l1.362 2.38a.473.473 0 0 0 .41.239h5.17l1.224 2.144a.47.47 0 0 0 .41.239h2.72a.473.473 0 0 0 .41-.239l2.587-4.524h2.449a.465.465 0 0 0 .41-.239l1.361-2.38a.487.487 0 0 0 0-.477l-.003-.007ZM7.277.475 8.64 2.858l-1.362 2.38h10.89l-1.361 2.38H6.459L4.825 4.76 7.277.475Zm.816 16.665H3.194l1.362-2.383h2.721l-5.445-9.52h2.721l1.362 2.38 3.812 6.668-1.634 2.858v-.003Zm8.713-4.763-1.36-2.38-5.444 9.525-1.363-2.38 1.363-2.379 3.811-6.668h3.268l2.449 4.285h-2.724v-.003Z",
};

export type PresetIconKind = ModelTab["icon"];

function ModelIcon({ kind }: { kind: PresetIconKind }) {
  switch (kind) {
    case "seedance":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d={SVG_PATHS.seedance} fill="currentColor" />
        </svg>
      );
    case "swirl":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d={SVG_PATHS.swirl} fill="currentColor" />
        </svg>
      );
    case "happyhorse":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d={SVG_PATHS.happyhorse} fill="currentColor" />
        </svg>
      );
    case "flux":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d={SVG_PATHS.fluxA} fill="currentColor" />
          <path d={SVG_PATHS.fluxB} fill="currentColor" />
        </svg>
      );
    case "kling":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={SVG_PATHS.kling}
            fill="currentColor"
          />
        </svg>
      );
    case "grok":
      return (
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d={SVG_PATHS.grokA} fill="currentColor" />
          <path d={SVG_PATHS.grokB} fill="currentColor" />
        </svg>
      );
    case "google":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d={SVG_PATHS.google} fill="currentColor" />
        </svg>
      );
    case "minimax":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={SVG_PATHS.minimax}
            fill="currentColor"
          />
        </svg>
      );
    case "wan":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d={SVG_PATHS.wan} fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Model Tabs Data                                                            */
/* -------------------------------------------------------------------------- */

export const MODEL_TABS: readonly ModelTab[] = [
  { label: "Seedance 2.5", icon: "seedance", isNew: true },
  { label: "Higgsfield Genjutsu", icon: "swirl", isNew: true },
  { label: "Higgsfield Katana", icon: "swirl", isNew: true },
  { label: "FLUX.3 Video", icon: "flux" },
  { label: "Kling 4.0", icon: "kling" },
  { label: "Kling 3.0", icon: "kling" },
  { label: "Kling 3.0 Turbo", icon: "kling" },
  { label: "Seedance 2.0 Fast", icon: "seedance" },
  { label: "Exclusive Seedance 2.0 Mini", icon: "seedance" },
  { label: "Seedance 2.0", icon: "seedance" },
  { label: "Higgsfield DoP", icon: "swirl" },
  { label: "HappyHorse", icon: "happyhorse" },
  { label: "Kling 3.0 Omni", icon: "kling" },
  { label: "Kling 2.5", icon: "kling" },
  { label: "Kling 2.6", icon: "kling" },
  { label: "Kling O1", icon: "kling" },
  { label: "Grok", icon: "grok" },
  { label: "Grok 1.5 Lite", icon: "grok" },
  { label: "Grok 1.5", icon: "grok" },
  { label: "Google Veo 3.1", icon: "google" },
  { label: "Veo 3.1 Lite", icon: "google" },
  { label: "Gemini Omni Flash 1.1", icon: "google" },
  { label: "MiniMax H3 Max", icon: "minimax" },
  { label: "MiniMax H3", icon: "minimax" },
  { label: "Minimax Hailuo", icon: "minimax" },
  { label: "Wan 2.5", icon: "wan" },
  { label: "Wan 2.6", icon: "wan" },
  { label: "Wan 2.7", icon: "wan" },
  { label: "Wan 3.0", icon: "wan" },
  { label: "Wan 3.0 Prime", icon: "wan" },
  { label: "Wan 2.2", icon: "wan" },
  { label: "Seedance Pro", icon: "seedance" },
  { label: "Seedance 1.5 Pro", icon: "seedance" },
  { label: "Higgsfield", icon: "none" },
];

export const GENERAL_PRESET: Preset = {
  id: "general",
  title: "General",
  video: "https://static.higgsfield.ai/wan27/wan27-motion-preset.mp4",
};

const GENJUTSU_PRESET: Preset = {
  id: "genjutsu",
  title: "Higgsfield Genjutsu",
  video: "https://static.higgsfield.ai/genjutsu/model-preview-20261006/ver-1.mp4",
};

const KLING_PRESET: Preset = {
  id: "general",
  title: "General",
  video: "https://static.higgsfield.ai/kling-4.0/20261021/kling-4.0.mp4",
};

export function getPresets(model: string): Preset[] {
  if (model === "Higgsfield Genjutsu") return [GENJUTSU_PRESET];
  if (model === "Kling 4.0") return [KLING_PRESET];
  return [GENERAL_PRESET];
}

/* -------------------------------------------------------------------------- */
/* Preset Video Preview Component                                             */
/* -------------------------------------------------------------------------- */

function PresetVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || failed) return;
    v.muted = true;
    v.defaultMuted = true;
    v.play()?.catch(() => { });
  }, [src, failed]);

  if (failed) return <div className="size-full bg-white/5" />;

  return (
    <video
      ref={ref}
      loop
      muted
      autoPlay
      playsInline
      disablePictureInPicture
      preload="auto"
      src={src}
      className="size-full object-cover"
      onError={(e) => {
        console.error(
          "[PresetBrowser] video failed to load:",
          src,
          e.currentTarget.error,
        );
        setFailed(true);
      }}
    >
      Your browser does not support the video.
    </video>
  );
}

/* -------------------------------------------------------------------------- */
/* Preset Browser Component                                                   */
/* -------------------------------------------------------------------------- */

export interface PresetBrowserProps {
  model: string;
  onModelChange: (model: string) => void;
  onClose: () => void;
  selectedPreset?: string;
  onSelectPreset?: (preset: Preset, model: string) => void;
}

export function PresetBrowser({
  model,
  onModelChange,
  onClose,
  selectedPreset = "general",
  onSelectPreset,
}: PresetBrowserProps) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const tabs = useMemo(
    () => MODEL_TABS.filter((t) => !q || t.label.toLowerCase().includes(q)),
    [q],
  );

  const allPresets = getPresets(model);
  const presets =
    !q || tabs.length > 0
      ? allPresets
      : allPresets.filter((p) => p.title.toLowerCase().includes(q));
  const nothingFound = q !== "" && tabs.length === 0 && presets.length === 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="size-full min-h-0 overflow-y-auto rounded-2xl border-separator-card bg-page-primary pt-2! lg:p-6 hide-scrollbar">
      {/* Header with model tabs, search, and close */}
      <div className="mb-4 grid grid-cols-[1fr_auto] gap-4">
        {/* Model tabs */}
        <div
          className="flex gap-6 overflow-x-auto hide-scrollbar"
          role="tablist"
          aria-label="Video models"
        >
          {tabs.map((tab) => {
            const active = tab.label === model;
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onModelChange(tab.label)}
                className={`flex shrink-0 items-center gap-2.5 border-b py-2.5 text-body-s font-medium outline-none transition-colors hover:text-white [&_svg]:size-5 ${active
                    ? "border-white text-white"
                    : "border-transparent text-text-secondary"
                  }`}
              >
                <ModelIcon kind={tab.icon} />
                <span>{tab.label}</span>
                {tab.isNew && (
                  <span className="-skew-x-12 rounded-sm bg-font-brand px-1.5 font-grotesk text-xxs font-bold uppercase leading-4 text-font-primary-reverted">
                    New
                  </span>
                )}
              </button>
            );
          })}
          {tabs.length === 0 && (
            <span className="shrink-0 py-2.5 text-body-s font-medium text-text-secondary">
              No models found
            </span>
          )}
        </div>

        {/* Search input and close button */}
        <div className="grid grid-flow-col-dense gap-4">
          <div className="relative grid items-center">
            <input
              type="text"
              aria-label="Search models"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && query) {
                  e.stopPropagation();
                  setQuery("");
                }
              }}
              className="h-10 w-full rounded-xl border border-transparent bg-neutral-surface-subtle px-4 text-body-s font-medium text-text-secondary placeholder:text-text-secondary transition hover:not-focus:border-white-24 focus:border-primary-50 focus:bg-surface"
            />
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="button--fixed inline-grid h-10 w-10 max-w-full grid-flow-col items-center justify-center rounded-xl border border-primary-5 bg-white-1 text-caption-l font-semibold text-text-secondary transition ring-primary-50 hover:not-disabled:not-active:bg-neutral-2-14 focus-visible:ring-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="text-text-primary!"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.81344 3.81246C4.0087 3.6172 4.32528 3.6172 4.52055 3.81246L10.0003 9.29224L15.4801 3.81246C15.6754 3.6172 15.992 3.6172 16.1872 3.81246C16.3825 4.00772 16.3825 4.32431 16.1872 4.51957L10.7074 9.99935L16.1872 15.4791C16.3825 15.6744 16.3825 15.991 16.1872 16.1862C15.992 16.3815 15.6754 16.3815 15.4801 16.1862L10.0003 10.7065L4.52055 16.1862C4.32528 16.3815 4.0087 16.3815 3.81344 16.1862C3.61818 15.991 3.61818 15.6744 3.81344 15.4791L9.29322 9.99935L3.81344 4.51957C3.61818 4.32431 3.61818 4.00772 3.81344 3.81246Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Preset grid */}
      <div className="-mx-1 grid grid-cols-2 overflow-x-hidden pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {presets.map((preset) => {
          const selected = preset.id === selectedPreset;
          return (
            <div key={`${model}-${preset.id}`} className="p-1">
              <figure
                className="group relative z-1 mb-2 h-auto w-full overflow-hidden rounded-2xl"
                style={{ aspectRatio: "0.75 / 1" }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSelectPreset?.(preset, model);
                    onClose();
                  }}
                  aria-pressed={selected}
                  className="absolute inset-0 z-10 flex size-full items-end justify-start rounded-2xl bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_80%)] px-2 pb-2 text-start font-bold uppercase ring-0 ring-inset ring-primary-60"
                >
                  <div className="flex w-full min-w-0 items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 font-grotesk leading-[100%] text-text-primary opacity-100 transition">
                      <h4 className="truncate text-body-s lg:text-body-l">
                        {preset.title}
                      </h4>
                    </div>
                  </div>
                </button>
                <PresetVideo src={preset.video} />
              </figure>
            </div>
          );
        })}
      </div>

      {nothingFound && (
        <p className="py-10 text-center text-body-s font-medium text-text-secondary">
          No results for “{query}”
        </p>
      )}
    </div>
  );
}
