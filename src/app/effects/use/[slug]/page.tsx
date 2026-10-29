import { Header } from "@/components/layout";
import { EffectsStudio } from "@/components/effects/EffectsStudio";

export { metadata } from "../page";

export default async function EffectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <Header forceCompact studioHeight />
      <EffectsStudio initialId={slug} />
    </>
  );
}
