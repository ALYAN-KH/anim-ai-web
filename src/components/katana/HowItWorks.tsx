"use client";

import { CONNECT_URL, TUTORIAL_POSTER, TUTORIAL_VIDEO } from "./data";
import { KatanaIcon } from "./icons";
import { KatanaVideo } from "./KatanaVideo";

/** The connection screen from the supplied How it works DOM and screenshot. */
export function HowItWorks({ onContinue }: { onContinue: () => void }) {
  return <section aria-label="Connect Higgsfield to Claude" className="flex min-h-full flex-col p-6">
    <div className="my-auto flex flex-none flex-col items-center gap-12 max-md:gap-8">
      <div className="flex h-[17.5rem] w-full flex-none items-center justify-center max-md:h-[min(17.5rem,48vw)]">
        <div className="relative aspect-[497/280] h-full max-h-full w-[31.0625rem] max-w-full overflow-hidden rounded-2xl">
          <KatanaVideo src={TUTORIAL_VIDEO} poster={TUTORIAL_POSTER} label="How to connect Higgsfield to Claude" controls className="size-full" />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase leading-[14px] text-lime">Higgsfield MCP</p>
          <div className="flex w-full max-w-[51.375rem] flex-col gap-2">
            <h2 className="font-grotesk text-[2rem] font-bold uppercase leading-9 tracking-[-0.08rem] [font-feature-settings:'ss04']">Connect Higgsfield to Claude</h2>
            <p className="whitespace-pre-line text-base font-normal leading-6 text-white/50">{"Add the Higgsfield MCP to start creating\nwith Katana presets in Claude"}</p>
          </div>
        </div>
        <div className="flex max-w-full flex-col items-center max-md:w-full">
          <div className="flex items-start justify-center gap-3 max-md:w-full max-md:flex-col max-md:items-center">
            <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-[14.875rem] max-w-full items-center justify-center gap-2 rounded-xl bg-[#d97757] px-4 text-base font-semibold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,.15)] outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white">
              <KatanaIcon name="claude" className="size-5" />Install Higgsfield MCP
            </a>
            <button type="button" onClick={onContinue} className="inline-flex h-12 w-[18.125rem] max-w-full items-center justify-center rounded-xl bg-white/5 px-4 text-base font-medium text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white">Continue, I have Higgsfield MCP</button>
          </div>
          <p className="mt-3 select-text py-3 text-sm font-medium text-white/30">https://mcp.higgsfield.ai/mcp</p>
        </div>
      </div>
    </div>
  </section>;
}
