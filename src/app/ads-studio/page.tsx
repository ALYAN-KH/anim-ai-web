import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { AdsStudio } from "@/components/ads-studio/AdsStudio";

export const metadata: Metadata = {
  title: "Ads Studio",
  description: "Everything you need to create ads that convert. Static ads and ad multiplier with Higgsfield Ads Studio.",
};

export default function AdsStudioPage() {
  return (
    <>
      <Header />
      <AdsStudio />
    </>
  );
}
