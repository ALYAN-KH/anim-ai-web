"use client";
import { useState } from "react";
import { CLAUDE_ICON, MCP_SERVER_URL } from "../config";
import { copyText } from "../lib/clipboard";
import type { AgentDefinition } from "../types";
import { AGENT_ICONS, CheckIcon, CopyIcon, HiggsfieldMark } from "../ui/Icons";
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

  const claudeStyle = agent.id === "claude";
  const primaryClass = `inline-flex h-12 items-center gap-2 rounded-xl px-4 text-base font-semibold transition hover:brightness-95 active:translate-y-px active:shadow-none ${
    claudeStyle
      ? "bg-[#d97757] text-white shadow-[0_3px_0_0_#a85a40]"
      : "bg-white text-black shadow-[0_3px_0_0_#b9b9b9]"
  }`;
  const primaryIcon = claudeStyle ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={CLAUDE_ICON} alt="" className="size-5 brightness-0 invert" />
  ) : (
    <Icon className="size-6" />
  );

  return (
    <section className="relative hidden bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1.2px)] bg-[length:14px_14px] h-[565px] flex-col items-center justify-center px-6 pt-8 text-center md:flex">
      <h1 className="font-grotesk text-[44px] font-bold uppercase leading-[1.02] tracking-[-0.03em] text-white lg:text-[48px] lg:leading-[56px]">
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

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {copyMode ? (
          <button type="button" onClick={handleCopy} className={primaryClass}>
            {copied ? <CheckIcon className="size-6" /> : primaryIcon}
            {copied ? "Copied" : agent.primaryCta.label}
          </button>
        ) : (
          <a href={agent.primaryCta.href} target="_blank" rel="noreferrer" className={primaryClass}>
            {primaryIcon}
            {agent.primaryCta.label}
          </a>
        )}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setDialog(true)}
          className="inline-flex h-12 items-center rounded-xl bg-white/10 px-4 text-base font-semibold text-white transition-colors hover:bg-[#222427]"
        >
          How to connect?
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy connector URL"
        className="mt-3 inline-flex h-10 items-center gap-2 px-3 text-sm font-medium text-white/35 transition-colors hover:text-white/70"
      >
        <CopyIcon className="size-4" />
        {MCP_SERVER_URL}
      </button>

      <ConnectDialog agent={agent} open={dialog} onClose={() => setDialog(false)} />
    </section>
  );
}
