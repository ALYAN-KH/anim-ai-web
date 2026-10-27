export const SITE = "https://higgsfield.ai";
export const MCP_SERVER_URL = "https://mcp.higgsfield.ai/mcp";
export const CHATGPT_PLUGIN_URL = "https://chatgpt.com/plugins/higgsfield?open_in_app=1";
export const CHATGPT_PLUGIN_INSTALL_URL = "https://chatgpt.com/plugins/higgsfield?open_in_app";
export const STATIC = "https://static.higgsfield.ai";
export const CLAUDE_ICON = `${STATIC}/mcp/v2/claude.svg`;
export const HERO_PHONE = `${STATIC}/mcp/mobile-connect-v1/hero-phone.webp`;

export const FOOTER_LINKS = [
  { label: "Help center", href: `${SITE}/creator-hub/help-center` },
  { label: "Cookie Notice", href: `${SITE}/cookie-notice` },
  { label: "Terms", href: `${SITE}/terms-of-use-agreement` },
  { label: "Privacy", href: `${SITE}/privacy-policy` },
  { label: "Report a vulnerability", href: "https://bugcrowd.com/engagements/higgsfield-ai-vdp-pro" },
] as const;
