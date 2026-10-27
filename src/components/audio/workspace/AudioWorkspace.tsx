"use client";
import { useState } from "react";
import { DEFAULT_FILTERS } from "../lib/history-filters";
import type { AudioHistoryItem, AudioMode, HistoryFilters, WorkspaceTab } from "../types";
import { HelpButton } from "./HelpButton";
import { HistoryPanel } from "./HistoryPanel";
import { HowItWorks } from "./HowItWorks";
import { WorkspaceToolbar } from "./WorkspaceToolbar";

interface AudioWorkspaceProps {
  mode: AudioMode;
  history: AudioHistoryItem[];
}

export function AudioWorkspace({ mode, history }: AudioWorkspaceProps) {
  const [tab, setTab] = useState<WorkspaceTab>("history");
  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);
  const [cardSize, setCardSize] = useState(50);

  return (
    <section
      aria-label="Audio workspace"
      className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:h-full"
    >
      <WorkspaceToolbar
        tab={tab}
        onTabChange={setTab}
        filters={filters}
        onFiltersChange={setFilters}
        cardSize={cardSize}
        onCardSizeChange={setCardSize}
      />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-none [scrollbar-color:#3a3c3f_transparent] [scrollbar-width:thin]">
        {tab === "history" ? (
          <HistoryPanel
            mode={mode}
            items={history}
            filters={filters}
            cardSize={cardSize}
            onClearFilters={() => setFilters(DEFAULT_FILTERS)}
          />
        ) : (
          <HowItWorks mode={mode} />
        )}
        <HelpButton />
      </div>
    </section>
  );
}
