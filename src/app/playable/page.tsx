import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { PlayableStudio } from "@/components/playable/PlayableStudio";

export const metadata: Metadata = {
  title: "Playable | Create games inside Claude with Higgsfield MCP",
};

export default function PlayablePage() {
  return (
    <>
      <Header forceCompact />
      <PlayableStudio />
    </>
  );
}
