import Link from "next/link";

type Preset = { title: string; image: string };

const COPIES = 4; // the set is repeated 4× and shifted by 25% so the loop never shows a gap

function Row({
  items,
  dir,
  seconds,
}: {
  items: Preset[];
  dir: "left" | "right";
  seconds: number;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`soul-marq flex w-max ${dir === "right" ? "soul-marq-right" : "soul-marq-left"}`}
        style={{ animationDuration: `${seconds}s` }}
      >
        {Array.from({ length: COPIES }).flatMap((_, c) =>
          items.map((item, i) => (
            <figure
              key={`${c}-${i}`}
              aria-hidden={c > 0}
              className="group relative mr-[12px] h-[clamp(190px,16.8vw,340px)] shrink-0 overflow-hidden rounded-[clamp(18px,1.5vw,30px)] bg-[#eee]"
            >
              <img
                src={item.image}
                alt={c === 0 ? item.title : ""}
                draggable={false}
                className="h-full w-auto max-w-none"
              />
              <figcaption className="absolute inset-0 flex items-center justify-center bg-black/55 px-4 text-center text-[clamp(17px,1.5vw,28px)] font-semibold leading-[1.1] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.title}
              </figcaption>
            </figure>
          )),
        )}
      </div>
    </div>
  );
}

export function SoulPresets({
  items,
  href,
}: {
  items: Preset[];
  href: string;
}) {
  const half = Math.ceil(items.length / 2);
  const top = items.slice(0, half); // library-1-x → moves left → right
  const bottom = items.slice(half); // library-2-x → moves right → left

  return (
    <section className="overflow-hidden bg-white pb-[64px] pt-[60px] text-black [container-type:inline-size]">
      <style>{`
        .soul-marq { animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
        @keyframes soulMarqLeft  { from { transform: translate3d(0,0,0); }    to { transform: translate3d(-25%,0,0); } }
        @keyframes soulMarqRight { from { transform: translate3d(-25%,0,0); } to { transform: translate3d(0,0,0); } }
        .soul-marq-left  { animation-name: soulMarqLeft; }
        .soul-marq-right { animation-name: soulMarqRight; }
        @media (prefers-reduced-motion: reduce) { .soul-marq { animation: none; } }
      `}</style>

      <div className="mx-auto flex w-[90cqw] flex-col items-start justify-between gap-6 md:w-[65cqw] md:flex-row md:items-end">
        <div>
          <h2 className="font-grotesk text-[clamp(30px,2.84cqw,64px)] font-bold uppercase leading-[.92] tracking-[-.045em] text-[#111]">
            Preset Library
          </h2>
          <p className="mt-[18px] max-w-[560px] text-[16px] leading-[26px] text-[#111] md:text-[19px]">
            Pick a vibe, skip the prompt engineering. Each preset is tuned to a
            specific aesthetic
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex h-[52px] shrink-0 items-center gap-[10px] rounded-[15px] bg-black px-[26px] text-[17px] font-semibold text-white transition hover:scale-[1.03]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 12h18M14 5l7 7-7 7" />
          </svg>
          Watch all Presets
        </Link>
      </div>

      <div className="mt-[41px] flex flex-col gap-2">
        <Row items={top} dir="right" seconds={70} />
        <Row items={bottom} dir="left" seconds={60} />
      </div>
    </section>
  );
}
