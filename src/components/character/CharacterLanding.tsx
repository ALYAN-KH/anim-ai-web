"use client";

import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Collage: 2 image sets that appear -> hold -> disappear -> swap      */
/* ------------------------------------------------------------------ */

const img = (name: string) =>
  `https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=640,quality=85/https://static.higgsfield.ai/image/${name}.jpg`;

// set 1 = first time, set 2 = next time (all 4 photos differ between the sets)
const SETS = [
  [
    "character-panel-soul-1",
    "character-panel-soul-2",
    "character-panel-soul-3",
    "character-panel-soul-4",
  ],
  [
    "character-panel-cinematic-1",
    "character-panel-cinematic-2",
    "character-panel-cinematic-3",
    "character-panel-cinematic-4",
  ],
].map((set) => set.map(img));

// z-index / rotation / size / shape of each card (from Higgsfield's markup)
const cards = [
  {
    z: 4,
    cls: "h-20 w-20 md:h-[148px] md:w-[148px] rotate-[-10deg] translate-y-2 rounded-xl",
  },
  {
    z: 3,
    cls: "h-[88px] w-[88px] md:h-[160px] md:w-[160px] rotate-[4deg] rounded-xl",
  },
  { z: 2, cls: "h-24 w-24 md:h-[176px] md:w-[176px] rounded-full" },
  {
    z: 1,
    cls: "h-[88px] w-[88px] md:h-[160px] md:w-[160px] rotate-[-4deg] rounded-xl",
  },
];

const CYCLE = 10; // seconds for a full loop (set 1 shows 5s, set 2 shows 5s)

// Pure CSS loop: no JS state, so cards can never get stuck invisible.
// 0-6% appear, hold until 44%, 44-50% disappear, hidden for the rest.
const KEYFRAMES = `
@keyframes charCardLoop{
  0%{opacity:0;transform:translateX(-28px) scale(.9)}
  6%{opacity:1;transform:none}
  44%{opacity:1;transform:none}
  50%{opacity:0;transform:translateX(28px) scale(.9)}
  100%{opacity:0;transform:translateX(28px) scale(.9)}
}
@media (prefers-reduced-motion: reduce){
  .char-card-layer{animation:none!important}
  .char-card-layer[data-set="1"]{opacity:0!important}
}`;

export function CharacterCollage({
  animated = false,
  className = "",
}: {
  animated?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative h-24 w-[300px] md:h-[172px] md:w-[580px] ${className}`}
    >
      <style>{KEYFRAMES}</style>

      {/* each slot is w-full in a flex row -> shrinks to 1/4, which spreads the cards */}
      <div className="absolute inset-0 flex items-center justify-start">
        {cards.map((c, i) => (
          <div
            key={i}
            className="relative h-full w-full"
            style={{ zIndex: c.z }}
          >
            {SETS.map((set, s) => (
              <div
                key={s}
                data-set={s}
                className="char-card-layer absolute inset-0 will-change-transform"
                style={
                  animated
                    ? {
                        opacity: 0,
                        animation: `charCardLoop ${CYCLE}s ease-in-out ${
                          s * (CYCLE / 2) + i * 0.09
                        }s infinite both`,
                      }
                    : { opacity: s === 0 ? 1 : 0 }
                }
              >
                <img
                  src={set[i]}
                  alt="character example"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className={`absolute left-0 top-0 flex-none overflow-hidden object-cover outline outline-4 -outline-offset-4 outline-white/10 ${c.cls}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Landing (/character)                                                */
/* ------------------------------------------------------------------ */

export function CharacterLanding() {
  return (
    <main className="grid min-h-[calc(100dvh-52px)] justify-center bg-[#0f1113] px-6 pt-9 text-white">
      <div className="flex flex-col items-center justify-start gap-8">
        <CharacterCollage animated />

        <article className="grid auto-rows-min gap-6">
          <div className="grid justify-center gap-2 text-center">
            <h1 className="font-grotesk text-[22px] font-bold uppercase leading-[1.05] tracking-[-0.02em] md:text-[56px]">
              Make your own character
            </h1>
            <p className="text-[14px] font-medium leading-[1.45] text-[#a5a7aa] md:text-[16px]">
              Upload photos from multiple angles to train your character.
              <br />
              Then use the same consistent character across new images and
              videos.
            </p>
          </div>

          <Link
            href="/character/upload"
            className="inline-grid h-[52px] w-fit grid-flow-col items-center gap-2 justify-self-center whitespace-nowrap rounded-xl bg-lime px-5 text-[14px] font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,.43)] transition hover:opacity-80 active:opacity-60"
          >
            Create character
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path
                fill="currentColor"
                d="m11.852 4.217-.13-.978a.476.476 0 0 0-.943 0l-.13.978A6.41 6.41 0 0 1 5.14 9.724l-.978.13a.476.476 0 0 0 0 .943l.978.13a6.41 6.41 0 0 1 5.507 5.508l.13.978a.476.476 0 0 0 .944 0l.13-.978a6.41 6.41 0 0 1 5.508-5.507l.977-.13a.476.476 0 0 0 0-.944l-.977-.13a6.41 6.41 0 0 1-5.508-5.507Zm-7.2 10.54.169-.549a.188.188 0 0 1 .36 0l.168.549a2.222 2.222 0 0 0 1.47 1.47l.549.169a.188.188 0 0 1 0 .36l-.549.168a2.222 2.222 0 0 0-1.47 1.47l-.169.549a.188.188 0 0 1-.36 0l-.168-.548a2.222 2.222 0 0 0-1.47-1.47l-.549-.17a.188.188 0 0 1 0-.36l.548-.168a2.222 2.222 0 0 0 1.47-1.47Z"
              />
            </svg>
          </Link>
        </article>
      </div>
    </main>
  );
}
