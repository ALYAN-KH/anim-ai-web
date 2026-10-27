import Link from "next/link";
import {
  soulBentoImages,
  soulBlog,
  soulFaq,
  soulFeatureCards,
  soulHeroImages,
  soulHighlights,
  soulPresets,
  soulTestimonials,
  soulUseCases,
} from "@/data/soul";
import { SoulHero } from "./SoulHero";
import { SoulHighlights } from "./SoulHiglights";
import { SoulFeatures } from "./SoulFeatures";
import { SoulId } from "./SoulId";
import { SoulUseCases } from "./SoulUseCases";
import { SoulPresets } from "./SoulPresets";
import { SoulCommunity } from "./SoulCommunity";
import { SoulPricing } from "./SoulPricing";
import { SoulBlog } from "./SoulBlog";

const createHref = "/ai/image?model=soul_2_0";
const characterHref = "/character";

function SectionTitle({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <h2
      className={`font-grotesk text-[clamp(28px,3.2vw,58px)] font-bold uppercase leading-[.92] tracking-[-.055em] ${dark ? "text-white" : "text-[#111]"}`}
    >
      {children}
    </h2>
  );
}

function CTA({
  children = "Try now",
  light = false,
}: {
  children?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      href={createHref}
      className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-bold transition hover:scale-[1.03] ${light ? "bg-white text-black" : "bg-black text-white"}`}
    >
      ✦ {children}
    </Link>
  );
}

export function SoulLanding() {
  return (
    <main className="bg-[#080909] text-white">
      <SoulHero images={soulHeroImages} href={createHref} />
      <SoulHighlights items={soulHighlights} href={characterHref} />

      <section className="bg-white pb-28 pt-[100px] text-black">
        <div className="mx-auto w-[88vw] md:w-[73.9vw]">
          <SoulFeatures cards={soulFeatureCards} href={createHref} />

          <SoulId images={soulBentoImages} href={characterHref} />
        </div>
      </section>

      <SoulUseCases items={soulUseCases} />
      <SoulPresets items={soulPresets} href={createHref} />
      <SoulCommunity
        reviews={soulTestimonials}
        avatars={[1, 2, 3, 4].map(
          (n) => `https://static.higgsfield.ai/nano-banana-2/review-${n}.webp`,
        )}
      />

      <SoulPricing />

      <SoulBlog posts={soulBlog} />
      <section className="bg-[#080909] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionTitle dark>Still have questions?</SectionTitle>
          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {soulFaq.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
                  {question}
                  <span className="text-white/40 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-6 text-white/50">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
