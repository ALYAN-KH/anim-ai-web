"use client";

import type { ReactNode } from "react";
import { HISTORY_EMPTY } from "./data";
import { Icon } from "./Icon";
import type { WorkspaceView } from "./useStudio";

export type HistoryJob = { id: string; kind: "influencer" | "motion"; createdAt: number; summary: string };

const GLASS = "border border-white/5 bg-[linear-gradient(148.9deg,rgba(255,255,255,0.04)_22.6%,rgba(255,255,255,0.06)_51.3%,rgba(255,255,255,0.02)_79.9%),linear-gradient(90deg,rgba(35,38,42,0.75),rgba(35,38,42,0.75))] shadow-[0_2px_2px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.05)]";

/** Empty "Your characters" card: portrait, glow and tilted trait chips, scaled with container units. */
function EmptyHistory() {
  return (
    <div className="my-auto flex w-full shrink-0 flex-col items-center">
      <p className="text-[10px] leading-[14px] text-[#626262]">Your characters</p>
      <div className="relative mt-4 w-full max-w-[calc(58.5rem-6.75rem)] overflow-hidden rounded-2xl border border-white/5" style={{ aspectRatio: "1.77778 / 1" }}>
        <div className="absolute inset-0 isolate flex flex-col overflow-hidden bg-[#131517] pb-4 sm:pb-[2.625rem]">
          <figure aria-hidden="true" className="pointer-events-none relative min-h-0 w-full flex-1 select-none [container-type:size]">
            <div className="absolute inset-0 flex items-end justify-center text-[min(1rem,1.937cqw,4.48179cqh)]">
              <div className="relative h-[22.3125em] w-[51.625em] shrink-0">
                <img alt="" src={HISTORY_EMPTY.glowWide} className="absolute -top-[20.125em] left-1/2 h-[38.125em] w-[48.6875em] [transform:translateX(-50%)] object-cover" />
                <img alt="" src={HISTORY_EMPTY.glowTall} className="absolute -top-[13.25em] left-1/2 h-[36.125em] w-[30.0625em] [transform:translateX(-50%)] object-cover" />
                <img alt="" src={HISTORY_EMPTY.portrait} className="absolute left-1/2 top-[0.125em] h-[21.8125em] w-[14.4375em] [transform:translateX(-50%)] object-cover" />
                <div className="absolute left-1/2 top-[17.8125em] flex w-[19.5em] [transform:translateX(-50%)] items-center">
                  {HISTORY_EMPTY.chips.map((chip) => (
                    <div key={chip.label} className="relative -ml-[0.375em] flex aspect-square min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-[0.5625em] border-[0.125em] border-white/5 bg-[#1c1e21] p-[0.4375em] shadow-[0_0_2.5em_rgba(0,0,0,0.24)] first:ml-0" style={{ transform: chip.transform }}>
                      <img alt="" src={chip.image} className={chip.corner ? "absolute right-[0.4375em] top-[0.4375em] size-[1.5625em] object-cover" : "absolute inset-0 size-full object-cover"} />
                      {!chip.corner && <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_10%,transparent_50%)]" />}
                      <span className="relative text-[0.65625em] font-medium leading-normal text-white">{chip.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </figure>
          <div className="relative mt-2 flex shrink-0 flex-col items-center gap-1 px-4 text-center sm:mt-4 sm:gap-2">
            <h2 className="text-lg font-semibold text-white max-sm:text-sm">Create new character from settings</h2>
            <p className="text-sm text-[#898a8b] max-sm:text-xs">Your influencers will show up here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryList({ jobs }: { jobs: HistoryJob[] }) {
  return (
    <ul className="mx-auto flex w-full max-w-[58.5rem] flex-col gap-2">
      {jobs.map((job) => (
        <li key={job.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm">
          <span className="min-w-0 truncate text-white">{job.summary}</span>
          <span className="shrink-0 text-xs text-[#898a8b]">Queued · {new Date(job.createdAt).toLocaleTimeString()}</span>
        </li>
      ))}
    </ul>
  );
}

type Props = { view: WorkspaceView; onView: (view: WorkspaceView) => void; jobs: HistoryJob[]; explore: ReactNode };

export function Workspace({ view, onView, jobs, explore }: Props) {
  return (
    <section aria-label="AI Influencer workspace" className="flex h-[48rem] min-h-[400px] min-w-0 flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#131517] md:h-full md:min-h-0">
      <header className="flex min-h-[60px] shrink-0 flex-wrap items-center justify-between gap-2 p-3">
        <div role="tablist" aria-label="Page view" className="flex gap-1">
          {(["explore", "history"] as const).map((id) => (
            <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => onView(id)} className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime max-md:min-h-11 ${view === id ? `text-white ${GLASS}` : "border border-transparent text-white/50 hover:text-white"}`}>
              <Icon name={id} className="size-4" />
              {id === "explore" ? "Explore" : "History"}
            </button>
          ))}
        </div>
        {view === "history" && (
          <button type="button" aria-label="Filter" disabled={!jobs.length} title={jobs.length ? "Filter" : "No characters to filter yet"} className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/5 disabled:opacity-40">
            <Icon name="filter" className="size-4" />
          </button>
        )}
      </header>
      {view === "explore" ? (
        <div role="tabpanel" aria-label="Explore" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{explore}</div>
      ) : (
        <div role="tabpanel" aria-label="Character history" tabIndex={0} className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 py-4 [scrollbar-width:none] sm:px-8">
          {jobs.length ? <HistoryList jobs={jobs} /> : <EmptyHistory />}
        </div>
      )}
    </section>
  );
}
