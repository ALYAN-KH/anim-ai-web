"use client";
import { ToggleTrack } from "../../video-studio/shared/toggle-track";
interface ToggleProps { checked: boolean; onChange: (checked: boolean) => void; label: string; }
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="relative z-10 inline-flex h-8 min-w-11 shrink-0 touch-manipulation items-center justify-end rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"><span className="pointer-events-none"><ToggleTrack checked={checked} size="audio" onColor="#d1fe17" /></span></button>;
}
