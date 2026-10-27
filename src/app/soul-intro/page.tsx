import type { Metadata } from "next";
import { Header, Footer, Tags } from "@/components/layout";
import { SoulLanding } from "@/components/soul";
import { soulExploreFeatures } from "@/data/soul";

export const metadata: Metadata = {
  title: "Higgsfield Soul 2.0 — Creative Image Model",
  description: "Discover Soul 2.0, Higgsfield's fashion-aware, culture-native foundation image model.",
};

export default function SoulIntroPage() {
  return (
    <>
      <Header forceCompact />
      <SoulLanding />
      <div className="bg-[#080909]"><Tags items={soulExploreFeatures} /></div>
      <Footer />
    </>
  );
}
