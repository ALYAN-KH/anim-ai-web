import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout";
import { BrandResearch } from "@/components/ads-studio/BrandResearch";

export const metadata: Metadata = {
  title: "Ads Studio",
  description: "Enter your website and Higgsfield Ads Studio will generate your Brand kit.",
};

export default function BrandResearchPage() {
  return (
    <>
      <Header />
      <Suspense>
        <BrandResearch />
      </Suspense>
    </>
  );
}
