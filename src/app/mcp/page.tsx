import type { Metadata } from "next";
import { Suspense } from "react";
import { McpStudio } from "@/components/mcp";
import { Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "Higgsfield MCP | AI Image & Video Generation for Any Agent",
  description:
    "Add the Higgsfield MCP server to Claude, OpenClaw, Hermes Agent, NemoClaw, or any MCP-compatible client. 30+ models for image and video generation, no API key required.",
  openGraph: {
    title: "Higgsfield MCP | AI Image & Video Generation for Any Agent",
    description:
      "Add the Higgsfield MCP server to Claude, OpenClaw, Hermes Agent, NemoClaw, or any MCP-compatible client. 30+ models for image and video generation, no API key required.",
    images: ["https://static.higgsfield.ai/mcp/mcp-og-chatgpt-claude-20260925.webp"],
  },
};

export default function McpPage() {
  return (
    <>
      <Header forceCompact />
      <Suspense fallback={null}>
        <McpStudio />
      </Suspense>
    </>
  );
}
