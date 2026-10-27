import type { AgentDefinition, AgentId } from "../types";
import { CHATGPT_PLUGIN_URL, MCP_SERVER_URL } from "./links";

/**
 * Only the ChatGPT entry is verified against the live page.
 * Others: `guide.verified: false` — fill from data/extracted/<tab>.json.
 */
export const AGENTS: AgentDefinition[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    param: "chatgpt",
    headlineName: "ChatGPT",
    badgeClass: "bg-[#ececec] text-black",
    primaryCta: { label: "Add Higgsfield in ChatGPT", href: CHATGPT_PLUGIN_URL },
    guide: {
      title: "Add Higgsfield to ChatGPT",
      steps: [
        "Click “Add Higgsfield in ChatGPT” to open the plugin page.",
        "Install the plugin and sign in with your Higgsfield account.",
        "Start a chat and mention @Higgsfield to generate images and videos.",
      ],
      verified: false,
    },
  },
  {
    id: "claude",
    label: "Claude",
    param: "claude",
    headlineName: "Claude",
    badgeClass: "bg-[#d97757] text-white",
    primaryCta: {
      label: "Connect Higgsfield",
      href: `https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Higgsfield&connectorUrl=${encodeURIComponent(MCP_SERVER_URL)}`,
    },
    guide: {
      title: "Connect Higgsfield to Claude",
      steps: [
        "Open Claude → Settings → Connectors.",
        "Choose “Add custom connector” and paste the MCP server URL below.",
        "Sign in to Higgsfield when asked, then enable the connector in your chat.",
      ],
      code: MCP_SERVER_URL,
      verified: false,
    },
  },
  {
    id: "claude-code",
    label: "Claude Code",
    param: "claude-code",
    headlineName: "Claude Code",
    badgeClass: "bg-[#d97757] text-white",
    primaryCta: { label: "Copy install command", href: "#copy" },
    guide: {
      title: "Add Higgsfield to Claude Code",
      steps: [
        "Run the command below in your terminal.",
        "Run /mcp inside Claude Code and authenticate with Higgsfield.",
        "Ask Claude Code to generate an image or video.",
      ],
      code: `claude mcp add --transport http higgsfield ${MCP_SERVER_URL}`,
      verified: false,
    },
  },
  {
    id: "telegram",
    label: "Telegram",
    param: "telegram",
    headlineName: "Telegram",
    badgeClass: "bg-[#229ed9] text-white",
    primaryCta: { label: "Open in Telegram", href: "https://t.me/" },
    guide: {
      title: "Use Higgsfield in Telegram",
      steps: ["Replace with the steps extracted by scripts/extract-mcp.mjs."],
      verified: false,
    },
  },
  {
    id: "cli",
    label: "CLI",
    param: "cli",
    headlineName: "your CLI",
    badgeClass: "bg-[#2a2c2f] text-white",
    primaryCta: { label: "Copy MCP server URL", href: "#copy" },
    guide: {
      title: "Use Higgsfield from the CLI",
      steps: ["Replace with the steps extracted by scripts/extract-mcp.mjs."],
      code: MCP_SERVER_URL,
      verified: false,
    },
  },
  {
    id: "other",
    label: "Other",
    param: "other",
    headlineName: "any agent",
    badgeClass: "bg-[#2a2c2f] text-white",
    primaryCta: { label: "Copy MCP server URL", href: "#copy" },
    guide: {
      title: "Connect any MCP-compatible client",
      steps: [
        "Open your client’s MCP / connector settings.",
        "Add a remote MCP server with the URL below.",
        "Authenticate with Higgsfield — no API key required.",
      ],
      code: MCP_SERVER_URL,
      verified: false,
    },
  },
];

export const DEFAULT_AGENT: AgentId = "chatgpt";

export const agentFromParam = (param: string | null): AgentId =>
  AGENTS.find((agent) => agent.param === param)?.id ?? DEFAULT_AGENT;

export const getAgent = (id: AgentId): AgentDefinition =>
  AGENTS.find((agent) => agent.id === id) ?? AGENTS[0];
