import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { AdMultiplier } from "@/components/ads-studio/AdMultiplier";

export const metadata: Metadata = {
  title: "Ads Studio",
  description: "Recreate any ad with your characters, product and settings using Higgsfield Ad Multiplier.",
};

export default function AdMultiplierPage() {
  return (
    <>
      <Header />
      <AdMultiplier />
    </>
  );
}
