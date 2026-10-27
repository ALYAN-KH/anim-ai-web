import type { Metadata } from "next";
import { Suspense } from "react";
import { AudioStudio } from "@/components/audio";
import { Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "Higgsfield Audio - AI Voice Over",
  description:
    "Turn text into lifelike speech, swap voices in any video, and translate with lip-sync.",
};

export default function AudioPage() {
  return (
    <>
      <Header forceCompact />
      <Suspense fallback={null}>
        <AudioStudio />
      </Suspense>
    </>
  );
}
