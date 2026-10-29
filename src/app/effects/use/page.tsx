import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { EffectsStudio } from "@/components/effects/EffectsStudio";

export const metadata: Metadata = {
  title: "AI Visual Effects Generator | Higgsfield",
  description: "Create cinematic AI videos with Higgsfield Visual Effects. Choose an effect, add your media, and generate a polished, share-ready video in seconds.",
};

export default function EffectsUsePage() {
  return (
    <>
      <Header forceCompact studioHeight />
      <EffectsStudio />
    </>
  );
}
