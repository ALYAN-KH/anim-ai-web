"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { agentFromParam, getAgent } from "./config";
import { AgentHero, AgentTabs, DemoShowcase, McpFooter, MobileHero, PresetsSection } from "./sections";
import { agentPanelId, agentTabId } from "./sections/AgentTabs";
import type { AgentId } from "./types";
import { Reveal } from "./ui/Reveal";

/**
 * Page body for /mcp. The global site header is NOT included — render this
 * under your existing layout/header. Tab state lives in `?tab=`.
 */
export function McpStudio() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const agentId = agentFromParam(searchParams.get("tab"));
  const agent = getAgent(agentId);

  const handleAgentChange = useCallback(
    (id: AgentId) => {
      router.replace(`${pathname}?tab=${getAgent(id).param}`, { scroll: false });
    },
    [pathname, router],
  );

  return (
    <div role="main" className="min-h-screen w-full bg-black text-white" data-theme="default-dark">
      <AgentTabs value={agentId} onChange={handleAgentChange} />
      <div id={agentPanelId} role="tabpanel" aria-labelledby={agentTabId(agentId)}>
        <Reveal key={agentId}>
          <MobileHero />
          <AgentHero agent={agent} />
        </Reveal>
        {/* Demo + preset content is ChatGPT-specific on the live site; other agents reuse the layout. */}
        <DemoShowcase key={`demo-${agentId}`} agentId={agentId} />
        <PresetsSection key={`presets-${agentId}`} agentParam={agent.param} />
      </div>
      <McpFooter />
    </div>
  );
}
