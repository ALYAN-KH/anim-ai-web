"use client";
import { useEffect, useRef, useState } from "react";
import { ChangeButton } from "../../../video-studio/shared/change-button";
import type { VoicePreset } from "../../config/voice-library";

interface SelectedVoiceCardProps {
  voice: VoicePreset;
  onChange: (anchor: DOMRect) => void;
  onRemove: () => void;
}

export function SelectedVoiceCard({ voice, onChange, onRemove }: SelectedVoiceCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
  }, [voice.id]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <div className="relative h-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/25">
      <img
        src={voice.image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full scale-[2.2] object-cover blur-2xl"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(0,0,0,0.75),transparent_60%),linear-gradient(to_top,rgba(0,0,0,0.35),transparent_55%)]" />
      <audio
        ref={audioRef}
        src={voice.url}
        preload="none"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
      />

      <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Remove ${voice.name}`}
          onClick={onRemove}
          className="grid size-10 place-items-center rounded-lg border border-white/10 bg-black/30 text-white backdrop-blur-[4.5px] transition hover:bg-black/50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
        <ChangeButton
          aria-haspopup="dialog"
          onClick={(event) => onChange((event.currentTarget.closest("aside") ?? event.currentTarget).getBoundingClientRect())}
          className="!h-10 !border-white/10 !bg-white/15 !px-3 !text-base hover:!bg-lime"
        />
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-3">
        <button
          type="button"
          aria-label={`${playing ? "Pause" : "Play"} ${voice.name}`}
          onClick={togglePlay}
          className={`grid size-12 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition hover:text-white ${
            playing ? "border-2 border-[#e8b23a]" : "border border-white/10"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {playing ? (
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            ) : (
              <path d="M7.66 2.28C6.49 1.57 5 2.41 5 3.78v16.45c0 1.36 1.49 2.2 2.66 1.5l13.57-8.23c1.12-.68 1.12-2.31 0-2.99L7.66 2.28Z" />
            )}
          </svg>
        </button>
        <span className="flex flex-col">
          <span className="text-xl font-medium leading-6 text-white">{voice.name}</span>
          <span className="text-sm leading-4 text-white/50">{voice.gender}</span>
        </span>
      </div>
    </div>
  );
}
