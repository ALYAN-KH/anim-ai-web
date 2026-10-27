import data from "@/data/content";
import { Header, TopBar, Footer, Tags } from "@/components/layout";
import {
  Hero,
  Promo,
  Projects,
  Influencer,
  Festival,
  Mcp,
  Super,
  Wide,
  CanvasBanner,
} from "@/components/home";
import { Masonry, type Item } from "@/components/gallery";
import type { ReactNode } from "react";
import {
  marketingStudioCommunityVideos,
  seedance20CommunityVideos,
} from "@/data/marketingStudioVideos";

type ContentItem = {
  t?: string;
  title?: string;
  sub?: string;
  type?: string;
  by?: string;
  src?: string;
  video?: string;
  poster?: string;
  href?: string;
  recreate?: string;
  tag?: string;
  avatar?: string;
  likes?: number;
  aspectRatio?: string;
};

function toItems(items: ContentItem[]): Item[] {
  return items.map((item) => ({
    t: item.t || item.title,
    sub: item.sub || item.type || item.by,
    src: item.src || item.video || item.poster,
    video: item.video || (item.src?.endsWith(".mp4") ? item.src : undefined),
    poster: item.poster,
    href: item.href,
    recreate: item.recreate,
    tag: item.tag || item.type,
    avatar: item.avatar,
    likes: item.likes,
    aspectRatio: item.aspectRatio,
  }));
}

export default function ExplorePage() {
  const genjutsu = data.genjutsuSection;
  const seedance25 = data.seedance25Section;
  const gptImage = data.gptImage2Section;
  const studio = data.marketingStudioSection;
  const seedance20 = data.seedance20Section;
  const photodump = data.differentScenesSameStarSection;
  const soulCinema = data.soulCinemaSection;
  const soul = data.soul20Section;
  const sections: Record<string, ReactNode> = {
    promo: <Promo />,
    influencerSection: <Influencer />,
    festival: <Festival />,
    mcpSection: <Mcp />,
    effects: (
      <Masonry
        title={data.effectsMeta.title}
        desc={data.effectsMeta.sub}
        items={toItems(data.effects)}
        href={data.effectsMeta.href}
        cta={data.effectsMeta.cta}
        tryBtn="Try for free"
        tryHref="/effects/use"
      />
    ),
    genjutsuSection: (
      <Masonry
        title={genjutsu.title}
        desc={genjutsu.sub}
        eyebrow={genjutsu.badge}
        items={toItems(genjutsu.items)}
        href={genjutsu.viewAll.href}
        cta={genjutsu.viewAll.label}
        tryBtn={genjutsu.ctaPrimary.label}
        tryHref={genjutsu.ctaPrimary.href}
        secondaryBtn={genjutsu.ctaSecondary.label}
        secondaryHref={genjutsu.ctaSecondary.href}
      />
    ),
    seedance25Section: (
      <Masonry
        title={seedance25.title}
        desc={seedance25.sub}
        items={toItems(seedance25.items)}
        href={seedance25.href}
        cta={seedance25.cta}
      />
    ),
    projects: <Projects />,
    superSection: <Super />,
    gptImage2Section: (
      <Masonry
        title={gptImage.title}
        desc={gptImage.sub}
        items={toItems(gptImage.items)}
        href={gptImage.href}
        cta={gptImage.cta}
      />
    ),
    canvasSection: <CanvasBanner />,
    marketingStudioSection: (
      <Masonry
        title={studio.title}
        desc={studio.sub}
        items={marketingStudioCommunityVideos.map((video, index) => ({
          t: `Marketing Studio showcase ${index + 1}`,
          sub: "Marketing Studio",
          src: video,
          video,
          href: studio.href,
        }))}
        href={studio.href}
        cta={studio.cta}
      />
    ),
    seedance20Section: (
      <Masonry
        title={seedance20.title}
        desc={seedance20.sub}
        items={seedance20CommunityVideos.map((video, index) => ({
          t: `Seedance 2.0 community video ${index + 1}`,
          sub:
            index === 9 ? "crafting_capybara_live88" : "Higgsfield community",
          src: video,
          video,
          poster: video.replace(/_min\.mp4$/, "_thumbnail.webp"),
          href: seedance20.href,
        }))}
        href={seedance20.href}
        cta={seedance20.cta}
      />
    ),
    differentScenesSameStarSection: (
      <Wide
        tag={photodump.tag}
        title={photodump.title}
        text={photodump.sub}
        href={photodump.href}
        cta={photodump.cta}
        hue={photodump.hue}
      />
    ),
    soulCinemaSection: (
      <Masonry
        title="Higgsfield Soul Cinema"
        desc={soulCinema.sub}
        items={toItems(soulCinema.items)}
        href={soulCinema.href}
        cta={soulCinema.cta}
      />
    ),
    soul20Section: (
      <Masonry
        title={soul.title}
        desc={soul.sub}
        items={toItems(soul.items)}
        href={soul.href}
        cta={soul.cta}
      />
    ),
    tags: <Tags />,
  };

  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen overflow-x-clip bg-[#0d0f10] text-white">
        <div className="mx-auto w-full max-w-[1920px] pb-8">
          <Hero />
          {data.exploreOrder.map((section) => (
            <div key={section}>{sections[section]}</div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
