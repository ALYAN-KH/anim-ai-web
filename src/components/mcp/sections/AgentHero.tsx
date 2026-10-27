"use client";
import { useState } from "react";
import { MCP_SERVER_URL } from "../config";
import { copyText } from "../lib/clipboard";
import type { AgentDefinition } from "../types";
import { AGENT_ICONS, CheckIcon, HiggsfieldMark } from "../ui/Icons";
import { ConnectDialog } from "./ConnectDialog";

interface AgentHeroProps {
  agent: AgentDefinition;
}

export function AgentHero({ agent }: AgentHeroProps) {
  const [dialog, setDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const Icon = AGENT_ICONS[agent.id];
  const copyMode = agent.primaryCta.href === "#copy";

  const handleCopy = async () => {
    if (await copyText(agent.guide.code ?? MCP_SERVER_URL)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const primaryClass =
    "inline-flex h-14 items-center gap-2.5 rounded-2xl bg-white px-5 text-lg font-semibold text-black shadow-[0_3px_0_0_#b9b9b9] transition hover:brightness-95 active:translate-y-px active:shadow-none";

  return (
    <section className="relative hidden min-h-[640px] flex-col items-center justify-center px-6 py-28 text-center md:flex lg:min-h-[696px]">
      <h1 className="font-grotesk text-[44px] font-bold uppercase leading-[1.02] tracking-[-0.03em] text-white lg:text-[72px]">
        Generate <span className="text-[#d1fe17]">Images &amp; Videos</span>
        <br />
        in{" "}
        <span
          className={`mx-1 inline-flex size-[0.78em] translate-y-[0.1em] items-center justify-center rounded-[0.2em] align-baseline ${agent.badgeClass}`}
        >
          <Icon className="size-[68%]" />
        </span>{" "}
        {agent.headlineName} with <HiggsfieldMark className="mx-1 size-[0.78em] translate-y-[0.1em] align-baseline" />{" "}
        Higgsfield
      </h1>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {copyMode ? (
          <button type="button" onClick={handleCopy} className={primaryClass}>
            {copied ? <CheckIcon className="size-6" /> : <Icon className="size-6" />}
            {copied ? "Copied" : agent.primaryCta.label}
          </button>
        ) : (
          <a href={agent.primaryCta.href} target="_blank" rel="noreferrer" className={primaryClass}>
            <Icon className="size-6" />
            {agent.primaryCta.label}
          </a>
        )}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setDialog(true)}
          className="inline-flex h-14 items-center rounded-2xl bg-[#17181a] px-5 text-lg font-semibold text-white transition-colors hover:bg-[#222427]"
        >
          How to connect?
        </button>
      </div>

      <p className="mt-6 select-all text-lg font-medium text-white/35">{MCP_SERVER_URL}</p>

      <ConnectDialog agent={agent} open={dialog} onClose={() => setDialog(false)} />
    </section>
  );
}
