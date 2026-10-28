import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { AiInfluencerStudio } from "@/components/ai-influencer/AiInfluencerStudio";

export const metadata: Metadata = {
  title: "AI Influencer | Higgsfield",
  description: "Build your AI influencer with the face, body, and style you want. Choose a motion preset and watch them perform it in a video ready to share.",
};

export default function AiInfluencerStudioPage() {
  return (
    <>
      <Header forceCompact studioHeight />
      <AiInfluencerStudio />
    </>
  );
}
