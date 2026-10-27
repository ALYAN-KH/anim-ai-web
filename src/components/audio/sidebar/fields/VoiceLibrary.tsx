"use client";
import { useEffect, useRef, useState } from "react";
import { voiceLibrary, type VoicePreset } from "../../config/voice-library";
import { FilterIcon } from "../../ui/Icons";
import { VoicePickIcon } from "./MediaIcons";

function VoiceCard({ voice, selected, playing, onPlay, onSelect }: { voice: VoicePreset; selected: boolean; playing: boolean; onPlay: (next: boolean) => void; onSelect: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const fallback = useRef(false);
  const requested = useRef(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) { requested.current = false; audio.pause(); setLoading(false); }
  }, [playing]);
  useEffect(() => { const audio = audioRef.current; return () => { audio?.pause(); }; }, []);
  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying || loading) { requested.current = false; audio.pause(); setLoading(false); onPlay(false); return; }
    if (error) { fallback.current = false; audio.src = voice.url; audio.load(); }
    setError("");
    setLoading(true);
    if (audio.ended) audio.currentTime = 0;
    requested.current = true;
    onPlay(true);
    // Start in the click handler so the browser retains the user gesture.
    audio.play().catch(error => {
      if (error.name === "AbortError") return;
      if (error.name === "NotAllowedError") { setLoading(false); setError("Click play to enable audio"); }
      else if (!fallback.current) retry();
    });
  };
  const retry = () => {
    const audio = audioRef.current;
    if (!audio || !requested.current) return;
    if (!fallback.current) {
      fallback.current = true;
      setLoading(true);
      audio.src = `/api/audio-preview?${new URLSearchParams({ voice: voice.id })}`;
      audio.load();
      audio.play().catch(error => { if (error.name !== "AbortError") { setLoading(false); setError("Preview unavailable. Click play to retry."); } });
    } else { setLoading(false); setIsPlaying(false); setError("Preview unavailable. Click play to retry."); }
  };
  const bars = Array.from({ length: 52 }, (_, i) => 3 + Math.abs(Math.sin((i + 1) * (voice.name.length + .73)) * Math.cos(i * .19)) * 19);
  return <article className={`overflow-hidden rounded-xl border bg-[#111415] p-1 ${selected ? "border-lime" : "border-white/5"}`}>
    <button type="button" aria-label={`Select ${voice.name}`} aria-pressed={selected} onClick={onSelect} className="flex w-full items-center gap-3 rounded-lg bg-[#25282a] p-2 text-left focus-visible:outline focus-visible:outline-lime"><img src={voice.image} alt={voice.name} className="size-[42px] shrink-0 rounded-full object-cover" /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{voice.name}</span><span className="block text-xs text-white/50">{voice.gender}</span></span></button>
    <div className="flex h-10 items-center gap-1 p-2">
      <audio ref={audioRef} src={voice.url} preload="none" onTimeUpdate={event => { const audio = event.currentTarget; setProgress(audio.duration ? audio.currentTime / audio.duration : 0); }} onEnded={() => { setProgress(0); onPlay(false); }} onError={retry} onPlaying={() => { setLoading(false); setIsPlaying(true); setError(""); }} onPause={() => setIsPlaying(false)} onWaiting={() => setLoading(true)} />
      <button type="button" aria-label={`${isPlaying || loading ? "Pause" : "Play"} ${voice.name}`} aria-busy={loading} onClick={play} className="grid size-6 shrink-0 place-items-center text-white hover:opacity-80"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{isPlaying ? <path d="M5 3h5v18H5zm9 0h5v18h-5z" /> : <path d="M7.65703 2.27884C6.49076 1.57201 5 2.41169 5 3.77543V20.2247C5 21.5884 6.49076 22.4281 7.65703 21.7213L21.2276 13.4966C22.3516 12.8155 22.3516 11.1846 21.2276 10.5035L7.65703 2.27884Z" />}</svg></button>
      <div className="relative h-6 min-w-0 flex-1"><svg viewBox="0 0 156 24" preserveAspectRatio="none" className="size-full" aria-hidden="true">{bars.map((height, index) => <rect key={index} x={index * 3} y={(24 - height) / 2} width="1.8" height={height} rx=".8" fill={index / bars.length <= progress ? "white" : "#36393b"} />)}{playing && <rect x={progress * 154} width="2" height="24" fill="#d1fe17" />}</svg><input type="range" aria-label={`Seek ${voice.name}`} min="0" max="1" step=".01" value={progress} onChange={event => { const audio = audioRef.current; if (audio && Number.isFinite(audio.duration)) audio.currentTime = Number(event.target.value) * audio.duration; }} className="absolute inset-0 w-full cursor-pointer opacity-0" /></div>
    </div>
    {error && <p role="status" className="px-2 pb-1 text-xs text-white/50">{error}</p>}
  </article>;
}

export function VoiceLibrary({ selected, onSelect, onScroll, onCreateCustom }: { selected: readonly string[]; onSelect: (voice: VoicePreset) => void; onScroll?: (scrollTop: number) => void; onCreateCustom?: () => void }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [gender, setGender] = useState("All");
  return <div className="relative flex min-h-0 flex-1 flex-col bg-[#202325]">
    <header className="flex h-11 shrink-0 items-center justify-between px-3"><h3 className="text-sm font-medium text-white/50">Voices</h3><button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen(value => !value)} className="flex h-7 items-center gap-1.5 rounded-xl bg-white/5 px-2.5 text-xs font-semibold text-white"><FilterIcon className="size-4" />Filter</button></header>
    {filterOpen && <div role="group" aria-label="Voice gender" className="absolute right-3 top-10 z-10 flex gap-1 rounded-xl border border-white/10 bg-[#303335] p-1 shadow-xl">{["All", "Female", "Male"].map(value => <button key={value} type="button" aria-pressed={value === gender} onClick={() => { setGender(value); setFilterOpen(false); }} className={`rounded-lg px-3 py-2 text-xs text-white ${value === gender ? "bg-white/10" : "hover:bg-white/5"}`}>{value}</button>)}</div>}
    <div onScroll={event => onScroll?.(event.currentTarget.scrollTop)} className="hide-scrollbar grid min-h-0 flex-1 auto-rows-min grid-cols-2 gap-2.5 overflow-y-auto px-2 pb-2 sm:grid-cols-3">{onCreateCustom && <button type="button" onClick={onCreateCustom} className="flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#111415] p-3 text-sm font-semibold text-white transition-colors hover:bg-[#191c1d]"><VoicePickIcon />Create custom voice</button>}{voiceLibrary.filter(voice => gender === "All" || voice.gender === gender).map(voice => <VoiceCard key={voice.id} voice={voice} selected={selected.includes(voice.id)} playing={playing === voice.id} onPlay={next => setPlaying(next ? voice.id : null)} onSelect={() => onSelect(voice)} />)}</div>
  </div>;
}
