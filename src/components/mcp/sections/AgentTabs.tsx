"use client";
import type { KeyboardEvent } from "react";
import { AGENTS } from "../config";
import type { AgentId } from "../types";
import { AGENT_ICONS, AGENT_ICON_COLOR } from "../ui/Icons";

interface AgentTabsProps {
  value: AgentId;
  onChange: (id: AgentId) => void;
}

export const agentTabId = (id: AgentId) => `mcp-agent-tab-${id}`;
export const agentPanelId = "mcp-agent-panel";

export function AgentTabs({ value, onChange }: AgentTabsProps) {
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = AGENTS[(index + step + AGENTS.length) % AGENTS.length];
    onChange(next.id);
    document.getElementById(agentTabId(next.id))?.focus();
  };

  return (
    <div className="sticky top-9 z-30 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="relative mx-auto flex h-14 max-w-[1920px] items-center px-4 sm:px-7">
        <span className="hidden shrink-0 font-mono text-xs uppercase tracking-wide text-white lg:block">
          For_agents
        </span>
        <div
          role="tablist"
          aria-label="Choose an agent"
          className="hide-scrollbar flex min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto lg:justify-center"
        >
          {AGENTS.map((agent, index) => {
            const active = agent.id === value;
            const Icon = AGENT_ICONS[agent.id];
            return (
              <button
                key={agent.id}
                id={agentTabId(agent.id)}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={agentPanelId}
                tabIndex={active ? 0 : -1}
                onClick={() => onChange(agent.id)}
                onKeyDown={(event) => handleKey(event, index)}
                className={`group relative flex h-14 shrink-0 items-center gap-1.5 px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:text-white ${
                  active ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                <Icon className={`size-4 ${AGENT_ICON_COLOR[agent.id]}`} />
                {agent.label}
                <span
                  className={`absolute inset-x-3 bottom-0 h-0.5 origin-center rounded-full bg-white transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
