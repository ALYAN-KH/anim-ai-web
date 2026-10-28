"use client";

import { useState } from "react";
import { Clock3, Plus, Smartphone } from "lucide-react";
import { HiggsSnake } from "@/components/ui/HiggsSnake";
import { CONNECT_URL } from "./data";
import { ReferencePicker, type FactoryReference } from "./ReferencePicker";
import { useTypingPlaceholder } from "@/components/shared/useTypingPlaceholder";

type Props = {
  mode: "claude" | "here";
  prompt: string;
  onPrompt: (value: string) => void;
  reference: FactoryReference | null;
  onClear: () => void;
  onReference: (value: FactoryReference) => void;
};

export function ContentFactoryGenerations({ mode, prompt, onPrompt, reference, onClear, onReference }: Props) {
  const placeholder = useTypingPlaceholder("What if cats ruled the world", !prompt);
  const [duration, setDuration] = useState("30");
  const [episodes, setEpisodes] = useState("1");
  const claude = mode === "claude";
  const chip = "relative inline-flex h-7 items-center gap-1.5 rounded-full bg-white/5 px-2 text-xs font-medium text-white hover:bg-white/10";

  return <section aria-label="My generations" className="relative min-h-[calc(100svh-84px)] bg-black pb-[280px]">
    <div className="absolute inset-x-4 top-[48%] -translate-y-1/2 text-center max-md:top-[35%]" role="status">
      <h2 className="text-base font-semibold leading-6 text-white">No What If videos yet</h2>
      <p className="mt-2 text-sm leading-5 text-white/50">Your submitted reels will appear here.</p>
    </div>

    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 max-md:bottom-3">
      <form className="pointer-events-auto flex w-full max-w-[590px] flex-col items-center gap-6" onSubmit={event => {
        event.preventDefault();
        window.open(CONNECT_URL, "_blank", "noopener,noreferrer");
      }}>
        <div className="flex w-full gap-4 rounded-[24px] border-4 border-[#141414] bg-[#222] p-2.5 shadow-2xl max-md:flex-wrap max-md:gap-2.5">
          <div className="relative -mt-6 flex w-[92px] shrink-0 flex-col items-center justify-end gap-2 max-md:-mt-4 max-md:w-[64px]">
            <ReferencePicker inputId="content-factory-generations-files" mode={mode} reference={reference} onChange={onReference} onClear={onClear} tall />
          </div>

          <fieldset className="m-0 flex min-w-0 flex-1 flex-col justify-between gap-6 border-0 px-2 py-1 text-left max-md:gap-4 max-md:px-0">
            <div className="flex flex-col gap-1">
              <label htmlFor="content-factory-prompt-generations" className="text-[10px] font-medium leading-4 text-white/35">Make a video about…</label>
              <textarea id="content-factory-prompt-generations" rows={1} maxLength={2000} value={prompt} onChange={event => onPrompt(event.target.value)} placeholder={placeholder} autoComplete="off" className="block w-full resize-none border-0 bg-transparent p-0 text-base font-semibold leading-6 text-white caret-lime outline-none placeholder:text-white/50 max-md:text-sm" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button type="button" aria-label="Add images or videos" onClick={() => document.getElementById("content-factory-generations-files")?.click()} className={chip}><Plus className="size-3" /></button>
              <label className={chip}><Clock3 className="size-3" /><span>{duration} sec</span>
                <select aria-label="Length" value={duration} onChange={event => setDuration(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0"><option value="15">15 sec</option><option value="30">30 sec</option><option value="60">60 sec</option></select>
              </label>
              <label className={chip}><Smartphone className="size-3" /><span>{episodes} episode{episodes === "1" ? "" : "s"}</span>
                <select aria-label="Episodes" value={episodes} onChange={event => setEpisodes(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0">{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} episode{value === 1 ? "" : "s"}</option>)}</select>
              </label>
            </div>
          </fieldset>
          <button type="submit" className="flex w-28 shrink-0 items-center justify-center rounded-xl px-5 font-grotesk text-xs font-bold uppercase leading-3 transition hover:brightness-110 max-md:min-h-10 max-md:w-full" style={{ background: claude ? "linear-gradient(180deg,#df9278,#d57b5b)" : "linear-gradient(180deg,#effe17,#d1fe17)", color: claude ? "white" : "black", boxShadow: "inset 0 -3px rgba(0,0,0,.25)" }}>{claude ? <>Generate<br />in Claude</> : "Generate"}</button>
        </div>
        {claude && <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/10 px-3 text-sm font-medium text-white/65 hover:text-white max-md:text-xs"><HiggsSnake className="size-4" />Connect Higgsfield MCP to generate</a>}
      </form>
    </div>
  </section>;
}
