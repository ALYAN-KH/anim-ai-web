"use client";
import { useState } from "react";
import { getAgent } from "../config";
import { buildChatGptUrl, buildClaudeUrl, buildPromptText } from "../lib/chatgpt-url";
import { copyText } from "../lib/clipboard";
import type { AgentId } from "../types";
import { AGENT_ICONS, AGENT_ICON_COLOR, CheckIcon } from "../ui/Icons";

interface TryButtonProps {
  agentId: AgentId;
  prompt: string;
  references?: string[];
  className?: string;
}

/**
 * "Try in {active tab}" CTA: the logo and label follow the selected agent.
 * ChatGPT / Claude open their chat with the prompt; every other agent copies the prompt.
 */
export function TryButton({ agentId, prompt, references = [], className = "" }: TryButtonProps) {
  const [copied, setCopied] = useState(false);
  const agent = getAgent(agentId);
  const Icon = AGENT_ICONS[agentId];
  const iconClass = `size-5 shrink-0 ${AGENT_ICON_COLOR[agentId]}`;

  if (agentId === "chatgpt" || agentId === "claude" || agentId === "claude-code") {
    const href = agentId === "chatgpt" ? buildChatGptUrl(prompt, references) : buildClaudeUrl(prompt);
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <Icon className={iconClass} />
        Try in {agent.label}
      </a>
    );
  }

  const handleCopy = async () => {
    if (await copyText(buildPromptText(prompt, references))) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {copied ? <CheckIcon className="size-5 shrink-0" /> : <Icon className={iconClass} />}
      {copied ? "Copied" : `Try in ${agent.label}`}
    </button>
  );
}
