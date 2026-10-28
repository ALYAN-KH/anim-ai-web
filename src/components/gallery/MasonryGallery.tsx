import Link from "next/link";
import { Tile, Item } from "./Tile";
import { GalleryAction } from "./GalleryAction";
import { GenjutsuCard } from "./GenjutsuCard";
import { genjutsuExamples } from "@/data/genjutsuExamples";
import { HiggsSnake } from "@/components/ui/HiggsSnake";
import { SeedanceCard } from "./SeedanceCard";
import { seedanceExamples } from "@/data/seedanceExamples";
import { CommunityGalleryCard } from "./CommunityGalleryCard";

function higgsImage(url: string | undefined, width: number) {
  return url
    ? `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(url)}&w=${width}&q=85`
    : "";
}
type Props = {
  title: string;
  desc?: string;
  items: Item[];
  cta: string;
  href?: string;
  cols?: string;
  tryBtn?: string;
  tryHref?: string;
  secondaryBtn?: string;
  secondaryHref?: string;
  eyebrow?: string;
};
export function Masonry({
  title,
  desc,
  items,
  cta,
  href = "/",
  cols = "columns-2 md:columns-4 lg:columns-5",
  tryBtn,
  tryHref,
  secondaryBtn,
  secondaryHref,
  eyebrow,
}: Props) {
  const id = `section-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const isEffectsGallery = items.some((item) => Boolean(item.recreate));
  const isGenjutsuGallery = eyebrow === "New model";
  const isSeedanceGallery = title === "Seedance 2.5";
  const isGptImageGallery = title === "GPT Image 2";
  const isSeedance20Gallery = title === "Seedance 2.0";
  const isMarketingGallery = title === "Marketing Studio";
  const isSoulCinemaGallery = title === "Higgsfield Soul Cinema";
  const isSoul20Gallery = title === "Higgsfield Soul 2.0";
  const isCommunityGallery =
    isSeedance20Gallery ||
    isMarketingGallery ||
    isSoulCinemaGallery ||
    isSoul20Gallery;
  const genjutsuColumns = [
    items.slice(0, 3),
    items.slice(3, 6),
    items.slice(6, 9),
    items.slice(9, 12),
    items.slice(12, 15),
  ];
  return (
    <section
      className={`${isGptImageGallery || isSoulCinemaGallery || isSoul20Gallery ? "mx-auto w-[min(calc(100%_-_24px),1896px)]" : isSeedanceGallery || isGenjutsuGallery ? "mx-auto w-[min(calc(100%_-_24px),1572px)]" : isSeedance20Gallery ? "mx-auto !w-[min(calc(100%_-_32px),1568px)] max-[600px]:!w-[calc(100%_-_16px)]" : "mx-3"} my-10 md:my-12 ${isEffectsGallery ? "effects-gallery-section" : ""} ${isGenjutsuGallery ? "overflow-hidden rounded-3xl border border-white/20 bg-[#050505] p-5 max-[767px]:rounded-[18px] max-[767px]:p-[14px]" : ""} ${isMarketingGallery || isSeedance20Gallery ? "!mt-[clamp(42px,3vw,56px)] !mb-[clamp(42px,3vw,56px)]" : ""} ${isSoulCinemaGallery ? "!mt-[clamp(42px,3vw,58px)] !mb-[clamp(42px,3vw,58px)]" : ""} ${isCommunityGallery && !isSoulCinemaGallery ? "community-gallery-section" : ""}`}
      aria-labelledby={id}
    >
      <div
        className={`${isSeedanceGallery ? "mb-4" : isSoul20Gallery ? "!mb-5 px-4" : isSoulCinemaGallery ? "!mb-6" : isGenjutsuGallery ? "mb-[14px] min-h-[130px] max-[767px]:min-h-0 max-[767px]:flex-col max-[767px]:items-start" : "mb-5"} masonry-heading flex items-end justify-between gap-3`}
      >
        <div>
          {eyebrow && (
            <span
              className={`mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold ${isGenjutsuGallery ? "rounded-full border border-lime/35 bg-[linear-gradient(180deg,rgba(119,137,43,0.72),rgba(51,58,24,0.9))] px-[9px] py-[5px] text-lime [text-transform:none] shadow-[inset_0_1px_rgba(255,255,255,0.14)] [&_svg]:h-[14px] [&_svg]:w-[14px] [&_svg]:flex-none" : "model-badge rounded-md bg-lime px-2 py-1 text-black"}`}
            >
              {isGenjutsuGallery && <HiggsSnake />}
              {eyebrow}
            </span>
          )}
          <h2
            id={id}
            style={isSoulCinemaGallery ? { color: "#cfff00" } : undefined}
            className={`ttl ${isGenjutsuGallery ? "text-[clamp(26px,2vw,36px)] leading-none" : isSeedance20Gallery ? "!text-[#d1fe17] !text-2xl !leading-[1.1] uppercase" : isSoulCinemaGallery ? "!text-[clamp(30px,2.1vw,40px)] !leading-none uppercase" : isSoul20Gallery ? "text-[#cfff00] uppercase" : ""}`}
          >
            {title}
          </h2>
          {desc && (
            <p
              className={`mt-1 max-w-3xl text-xs text-zinc-400 md:text-sm ${isSoulCinemaGallery ? "!mt-2 md:!text-base" : ""}`}
            >
              {desc}
            </p>
          )}
        </div>
        {(tryBtn || secondaryBtn) && (
          <div
            className={`masonry-ctas flex shrink-0 items-center gap-2 ${isGenjutsuGallery ? "max-[767px]:w-full max-[767px]:flex-wrap" : ""}`}
          >
            {tryBtn && (
              <Link
                href={tryHref || href}
                className={`btn !font-semibold ${isGenjutsuGallery ? "!min-h-[41px] !rounded-[9px] !px-[15px] !py-0 !text-sm max-[767px]:flex-none max-[767px]:!min-h-[30px] max-[767px]:!px-2 max-[767px]:!text-[11px]" : "max-md:px-3 max-md:py-1.5 max-md:text-[13px]"}`}
              >
                {tryBtn}
              </Link>
            )}
            {secondaryBtn && (
              <Link
                href={secondaryHref || href}
                className={`btn !font-semibold ${isGenjutsuGallery ? "!min-h-[41px] !rounded-[9px] !border !border-[#d4d4d4] !bg-white !px-[15px] !py-0 !text-sm !text-[#111] !shadow-[0_3px_0_#aaa] hover:!bg-[#f3f3f3] max-[767px]:flex-none max-[767px]:!px-2 max-[767px]:!min-h-[30px] max-[767px]:!text-[11px]" : "masonry-secondary-btn max-md:px-3 max-md:py-1.5 max-md:text-[13px]"}`}
              >
                {secondaryBtn}
              </Link>
            )}
          </div>
        )}
      </div>
      <div
        className={`relative overflow-hidden ${
          isEffectsGallery
            ? "effects-gallery-viewport"
            : isGenjutsuGallery
              ? "h-[680px] after:absolute after:inset-x-0 after:bottom-0 after:z-[15] after:h-[155px] after:bg-[linear-gradient(transparent,#050505_82%)] after:content-[''] after:pointer-events-none max-[767px]:h-[570px]"
              : isSeedanceGallery
                ? "h-[896px] after:absolute after:inset-x-0 after:bottom-0 after:z-[15] after:h-[115px] after:bg-[linear-gradient(transparent,#0e0f10_90%)] after:content-[''] after:pointer-events-none"
                : isGptImageGallery
                  ? "h-[clamp(690px,49vw,920px)] after:absolute after:inset-x-0 after:bottom-0 after:z-[15] after:h-[26%] after:pointer-events-none after:content-[''] after:bg-[linear-gradient(to_bottom,transparent,#0d0f10_92%)] max-[767px]:h-[720px]"
                  : isSoulCinemaGallery
                    ? "!overflow-visible pb-[76px] max-[600px]:pb-[66px] max-md:!pb-0 after:absolute after:inset-x-0 after:bottom-0 after:z-[15] after:h-[132px] after:rounded-b-xl after:pointer-events-none after:content-[''] after:bg-[linear-gradient(transparent,#0d0f10_92%)]"
                    : isCommunityGallery
                      ? `community-gallery-viewport ${isSeedance20Gallery || isSoul20Gallery ? "!h-[896px]" : ""} ${isSoul20Gallery ? "after:!h-[208px] after:!bg-[linear-gradient(transparent,#0d0f10_100%)]" : ""}`
                      : "max-h-[590px] md:max-h-[680px]"
        }`}
      >
        {isEffectsGallery ? (
          <div className="effects-gallery-grid">
            {[0, 1, 2, 3, 4].map((columnIndex) => (
              <div className="effects-gallery-column" key={columnIndex}>
                {items
                  .slice(columnIndex * 3, columnIndex * 3 + 3)
                  .map((it, rowIndex) => (
                    <article
                      key={`${it.t || "effect"}-${rowIndex}`}
                      className="effect-card effects-gallery-card relative overflow-hidden rounded-2xl"
                      style={{ aspectRatio: it.aspectRatio || "9 / 16" }}
                    >
                      <Link
                        href={it.href || href}
                        aria-label={`View ${it.t || "effect"}`}
                        className="absolute inset-0 z-10 rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                      >
                        <Tile
                          it={it}
                          i={columnIndex * 3 + rowIndex}
                          r="rounded-2xl"
                          showInfo={false}
                          hoverEffects={false}
                          playOnHoverOnly
                        />
                      </Link>
                      <div className="effect-hover-overlay">
                        <div className="effect-hover-copy">
                          <h3>{it.t}</h3>
                          {it.recreate && (
                            <GalleryAction
                              href={it.recreate}
                              label="Recreate"
                              variant="recreate"
                              ariaLabel={`Recreate ${it.t || "effect"}`}
                            />
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            ))}
          </div>
        ) : isGenjutsuGallery ? (
          <div className="grid w-full grid-cols-5 gap-2 max-[1023px]:grid-cols-3 max-[767px]:grid-cols-2">
            {genjutsuColumns.map((column, columnIndex) => (
              <div className="flex min-w-0 flex-col gap-2" key={columnIndex}>
                {column.map((it, rowIndex) => {
                  const index = columnIndex * 3 + rowIndex;
                  return (
                    <GenjutsuCard
                      key={`${it.t || "genjutsu"}-${index}`}
                      example={genjutsuExamples[index]}
                      href={it.href || href}
                      title={it.t || "Genjutsu"}
                      className={`group/genjutsu-card relative block overflow-hidden rounded-xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-[-2px] ${
                        (columnIndex === 0 || columnIndex === 4) &&
                        rowIndex === 1
                          ? "h-[480px] max-[767px]:h-[320px]"
                          : (columnIndex === 2 || columnIndex === 3) &&
                              rowIndex === 0
                            ? "h-[537px] max-[767px]:h-[320px]"
                            : "h-[170px]"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ) : isSeedanceGallery ? (
          <div className="grid grid-cols-4 gap-[7px] max-[900px]:grid-cols-2">
            {[
              seedanceExamples.slice(0, 2),
              seedanceExamples.slice(2, 6),
              seedanceExamples.slice(6, 11),
              seedanceExamples.slice(11, 16),
            ].map((column, columnIndex) => (
              <div
                className="flex min-w-0 flex-col gap-[7px]"
                key={columnIndex}
              >
                {column.map((example, rowIndex) => (
                  <SeedanceCard
                    key={example.video}
                    example={example}
                    href={href}
                    className="!relative !block !h-auto !overflow-hidden !rounded-[10px] !bg-[#242424] max-[600px]:!rounded-[8px]"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : isGptImageGallery ? (
          <div className="grid grid-cols-4 gap-[10px] max-[767px]:grid-cols-2">
            {[0, 1, 2, 3].map((columnIndex) => (
              <div
                className="flex min-w-0 flex-col gap-[10px]"
                key={columnIndex}
              >
                {items
                  .map((item, index) => ({ item, index }))
                  .filter(({ index }) => index % 4 === columnIndex)
                  .map(({ item, index }) => (
                    <CommunityGalleryCard
                      key={`${item.src || item.poster || item.t || "gpt-image"}-${index}`}
                      className="group/gpt-image !relative !overflow-hidden !rounded-[12px] !bg-[#202020]"
                      href={item.href || href}
                      item={{
                        image: item.poster || item.src || "",
                        label: item.t || "GPT Image 2 showcase",
                        creator: item.sub || "GPT Image 2",
                        likes: 120 + ((index * 97) % 731),
                        aspectRatio: ["3 / 4", "16 / 9", "3 / 4", "16 / 9"][
                          index % 4
                        ],
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        ) : isCommunityGallery ? (
          <div
            className={
              isSoulCinemaGallery
                ? "grid grid-cols-4 gap-[10px] max-[900px]:grid-cols-2 max-[600px]:gap-[6px]"
                : `community-gallery-grid ${isMarketingGallery || isSoul20Gallery ? "community-gallery-masonry" : "community-gallery-landscape"} ${isMarketingGallery ? "!gap-2 max-[600px]:!gap-[5px]" : isSoul20Gallery ? "!gap-2 max-[900px]:!grid-cols-2" : ""}`
            }
          >
            {(isMarketingGallery
              ? [0, 1, 2, 3].map((columnIndex) =>
                  items.filter((_, itemIndex) => itemIndex % 4 === columnIndex),
                )
              : isSoulCinemaGallery
                ? items.slice(0, 16).map((item) => [item])
                : isSoul20Gallery
                  ? [
                      items.slice(0, 3),
                      items.slice(3, 6),
                      items.slice(6, 9),
                      items.slice(9, 12),
                    ]
                  : (() => {
                      const extendedItems = [...items, ...items.slice(0, 4)];
                      return [
                        extendedItems.slice(0, 4),
                        extendedItems.slice(4, 8),
                        extendedItems.slice(8, 12),
                        extendedItems.slice(12, 16),
                      ];
                    })()
            ).map((column, columnIndex) => (
              <div
                className={
                  isSoulCinemaGallery
                    ? "contents"
                    : `community-gallery-column ${isMarketingGallery || isSoul20Gallery ? "!gap-2" : ""}`
                }
                key={columnIndex}
              >
                {column.map((item, rowIndex) => {
                  const fallbackIndex = columnIndex * 3 + rowIndex;
                  const isTall =
                    (isMarketingGallery &&
                      ((columnIndex === 0 && rowIndex === 1) ||
                        (columnIndex === 1 && rowIndex === 0) ||
                        columnIndex === 2 ||
                        (columnIndex === 3 && rowIndex === 0))) ||
                    (isSoul20Gallery && (columnIndex !== 1 || rowIndex === 1));
                  return (
                    <CommunityGalleryCard
                      key={`${item.t || title}-${columnIndex}-${rowIndex}`}
                      href={item.href || href}
                      playOnHoverOnly={isSeedance20Gallery}
                      className={
                        isSoulCinemaGallery
                          ? "!aspect-video !rounded-[14px] max-[600px]:!rounded-[9px]"
                          : isSoul20Gallery
                            ? "!rounded-[12px]"
                            : ""
                      }
                      item={{
                        image: isSoul20Gallery
                          ? higgsImage(item.poster || item.src, 640)
                          : item.poster ||
                            (item.src?.endsWith(".mp4") ? "" : item.src) ||
                            "",
                        video: item.video,
                        label: item.t || `${title} showcase`,
                        creator:
                          item.sub ||
                          (isMarketingGallery
                            ? "Marketing Studio"
                            : "Higgsfield creator"),
                        avatar: isSoul20Gallery
                          ? higgsImage(item.avatar, 96)
                          : item.avatar,
                        likes:
                          item.likes ??
                          (isSeedance20Gallery &&
                          columnIndex === 2 &&
                          rowIndex === 1
                            ? 234
                            : 120 + ((fallbackIndex * 97) % 731)),
                        aspectRatio:
                          item.aspectRatio ||
                          (isMarketingGallery || isSoul20Gallery
                            ? isTall
                              ? "3 / 4"
                              : "16 / 9"
                            : "16 / 9"),
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`fade-mask ${cols} gap-3 [&>*]:mb-3 [&>*]:break-inside-avoid ${
              isEffectsGallery ? "effects-gallery-grid" : ""
            }`}
          >
            {items.map((it, i) => {
              const card = (
                <Tile
                  it={it}
                  i={i}
                  showInfo={!it.recreate}
                  hoverEffects={!it.recreate}
                  playOnHoverOnly={isGenjutsuGallery}
                />
              );
              return (
                <article
                  key={`${it.t || "item"}-${i}`}
                  className={`relative ${it.recreate ? "effect-card" : ""}`}
                  style={{ height: it.h || [300, 200, 260, 340, 220][i % 5] }}
                >
                  {it.href ? (
                    <Link
                      href={it.href}
                      aria-label={`Open ${it.t || title}`}
                      className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                    >
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                  {it.recreate && (
                    <div className="effect-hover-overlay">
                      <div className="effect-hover-copy">
                        <h3>{it.t}</h3>
                        <GalleryAction
                          href={it.recreate}
                          label="Recreate"
                          variant="recreate"
                          ariaLabel={`Recreate ${it.t || "effect"}`}
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* CTA: same centered button for every gallery section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-9 z-30 flex justify-center max-md:hidden">
          <GalleryAction
            href={href}
            label={cta}
            className="pointer-events-auto !min-h-[58px] !rounded-[14px] !px-5 !text-[20px] !font-semibold [&_svg]:!h-6 [&_svg]:!w-6 max-md:!min-h-[38px] max-md:!rounded-[10px] max-md:!px-3 max-md:!text-[13px] max-md:[&_svg]:!h-3.5 max-md:[&_svg]:!w-3.5"
          />
        </div>
      </div>
      {/* Mobile: CTA gets its own row below the grid instead of overlapping cards */}
      <div className="hidden justify-center pt-4 max-md:flex">
        <GalleryAction
          href={href}
          label={cta}
          className="!min-h-[44px] !rounded-[10px] !px-4 !text-[14px] !font-semibold [&_svg]:!h-3.5 [&_svg]:!w-3.5"
        />
      </div>
    </section>
  );
}




