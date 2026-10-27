"use client";
import { useState } from "react";
import { CLAUDE_ICON, HERO_PHONE } from "../config";
import { getAgent } from "../config";
import { ChatGptIcon } from "../ui/Icons";
import { ConnectDialog } from "./ConnectDialog";

/** Phone-only hero (hidden from md up, where AgentHero takes over). */
export function MobileHero() {
  const [dialog, setDialog] = useState<"claude" | "chatgpt" | null>(null);

  return (
    <section className="flex flex-col items-center px-5 pb-10 pt-10 text-center md:hidden">
      <h1 className="font-grotesk text-[34px] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-white">
        Generate <span className="text-[#d1fe17]">Images &amp; Videos</span>
        <br />
        in ChatGPT &amp; Claude
      </h1>
      <p className="mt-3 text-base font-medium text-white/55">With the Higgsfield plugin &amp; MCP</p>
      <button
        type="button"
        onClick={() => setDialog("chatgpt")}
        className="mt-4 inline-flex h-11 items-center rounded-xl bg-[#17181a] px-4 text-base font-semibold text-white"
      >
        How to connect?
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_PHONE} alt="Higgsfield inside a chat app on a phone" className="mt-6 w-full max-w-[360px]" />
      <div className="mt-6 flex w-full max-w-[360px] flex-col gap-3">
        <button
          type="button"
          onClick={() => setDialog("claude")}
          aria-haspopup="dialog"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d97757] text-base font-semibold text-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLAUDE_ICON} alt="" className="size-5 brightness-0 invert" />
          Connect to Claude
        </button>
        <button
          type="button"
          onClick={() => setDialog("chatgpt")}
          aria-haspopup="dialog"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-semibold text-black"
        >
          <ChatGptIcon className="size-5" />
          Connect to ChatGPT
        </button>
      </div>
      <ConnectDialog agent={getAgent(dialog ?? "chatgpt")} open={dialog !== null} onClose={() => setDialog(null)} />
    </section>
  );
}
