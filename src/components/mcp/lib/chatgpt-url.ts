import { CHATGPT_PLUGIN_INSTALL_URL } from "../config/links";

/** Body of the prompt that is copied / sent to ChatGPT. Mirrors higgsfield.ai/mcp exactly. */
export function buildPromptText(prompt: string, references: string[] = []): string {
  const parts = ["@Higgsfield", prompt];
  if (references.length > 0) {
    parts.push(
      `Reference media:\n${references.map((url, i) => `- [Reference ${i + 1}](${url})`).join("\n")}`,
    );
  }
  parts.push(
    `If the Higgsfield plugin is not installed, ask me to [install the Higgsfield plugin](${CHATGPT_PLUGIN_INSTALL_URL}) before continuing.`,
  );
  return parts.join("\n\n");
}

/** `https://chatgpt.com/?q=...` — same encoding as the live "Try in ChatGPT" buttons. */
export function buildChatGptUrl(prompt: string, references: string[] = []): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(buildPromptText(prompt, references))}`;
}
