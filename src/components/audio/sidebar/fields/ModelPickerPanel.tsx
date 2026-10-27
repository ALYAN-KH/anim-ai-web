"use client";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { AUDIO_MODELS } from "../../config";
import type { AudioModelId } from "../../types";
import { CheckIcon } from "../../ui/Icons";
import { ModelLogo } from "../../ui/ModelLogo";
import { FieldPopover } from "../../ui/FieldPopover";

interface ModelPickerPanelProps {
  anchor: DOMRect;
  selectedId: AudioModelId;
  onSelect: (id: AudioModelId) => void;
  onClose: () => void;
}
const names: Partial<Record<AudioModelId, string>> = { elevenlabs_v4: "ElevenLabs v4", elevenlabs_v4_turbo: "ElevenLabs v4 Turbo", elevenlabs: "ElevenLabs v3", qwen_audio: "Qwen Audio 3.0 TTS" };
export function ModelPickerPanel({ anchor, selectedId, onSelect, onClose }: ModelPickerPanelProps) {
  const [query, setQuery] = useState("");
  const models = AUDIO_MODELS.filter(model => `${names[model.id] ?? model.name} ${model.description}`.toLowerCase().includes(query.toLowerCase()));
  return <FieldPopover anchor={anchor} onClose={onClose} label="Choose model" width={368}>
    <label className="flex h-10 items-center gap-2 border-b border-white/5 px-3 text-white/45"><Search className="size-4" /><input aria-label="Search models" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45" /></label>
    <p className="flex items-center gap-2 px-4 py-2 text-xs text-white/45"><Sparkles className="size-4 fill-white text-white" />Featured models</p>
    <ul role="listbox" aria-label="Models" className="space-y-1 px-3 pb-3">{models.map(model => <li key={model.id} role="option" aria-selected={model.id === selectedId}><button type="button" onClick={() => onSelect(model.id)} className={`flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-white/5 ${model.id === selectedId ? "bg-white/[.06]" : ""}`}><span className={`grid size-10 shrink-0 place-items-center rounded-lg bg-white/5 shadow-[inset_0_2px_5px_rgba(255,255,255,.04)] ${model.id === selectedId ? "text-lime" : "text-white"}`}><ModelLogo model={model} className="size-5" /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white">{names[model.id] ?? model.name}{model.badge && <span className="-skew-x-12 rounded-sm bg-lime px-1 text-[10px] font-bold uppercase text-black">New</span>}</span><span className="mt-1 block text-[10px] leading-[14px] text-white/45">{model.description}</span></span>{model.id === selectedId && <CheckIcon className="size-4 shrink-0 text-lime" />}</button></li>)}</ul>
    {models.length === 0 && <p className="p-4 text-sm text-white/50">No models found</p>}
  </FieldPopover>;
}
