import { soulExamples } from "@/data/imageStudio";
import { useEffect, useState } from "react";
import {
  COLLAGE_GAP_MS,
  COLLAGE_IN_MS,
  COLLAGE_OUT_MS,
  COLLAGE_SHOW_MS,
  COLLAGE_STAGGER_MS,
  characterCollageFourth,
  moodboardCollageFallbacks,
  moodboardCollageSets
} from "../data";
import { SafeImage } from "./shared";

export const collagePositions = [
  {
    pos: "left-[-4px] top-[62px] z-[1] h-[124px] w-[116px] -rotate-[8deg]",
    round: "rounded-[14px]",
  },
  {
    pos: "left-[100px] top-[56px] z-[2] h-[124px] w-[116px] rotate-[2deg]",
    round: "rounded-[14px]",
  },
  {
    pos: "left-[212px] top-[58px] z-[3] h-[128px] w-[128px]",
    round: "rounded-full",
  },
  {
    pos: "left-[280px] top-[56px] z-[4] h-[124px] w-[116px] -rotate-[1deg]",
    round: "rounded-[14px]",
  },
];

export function MoodboardCollage() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(true);
  const [failed, setFailed] = useState<string[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      setShown(false); // 4 → out
      timer = setTimeout(() => {
        setIdx((i) => (i + 1) % moodboardCollageSets.length);
        setShown(true); // new 4 → in
        timer = setTimeout(next, COLLAGE_IN_MS + COLLAGE_SHOW_MS);
      }, COLLAGE_OUT_MS + COLLAGE_GAP_MS);
    };
    timer = setTimeout(next, COLLAGE_SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {collagePositions.map(({ pos, round }, k) => {
        const primary = moodboardCollageSets[idx][k];
        const fallback = moodboardCollageFallbacks[k][idx % 3];
        const src = failed.includes(primary) ? fallback : primary;
        const broken = failed.includes(src);
        return (
          <div key={k} className={`absolute ${pos}`}>
            <div
              className={`relative h-full w-full overflow-hidden bg-[#25282b] shadow-lg ${round}`}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown
                  ? "scale(1) translateY(0)"
                  : "scale(.88) translateY(10px)",
                transition: shown
                  ? `opacity ${COLLAGE_IN_MS}ms ease ${k * COLLAGE_STAGGER_MS}ms, transform ${COLLAGE_IN_MS}ms cubic-bezier(.2,.7,.2,1) ${k * COLLAGE_STAGGER_MS}ms`
                  : `opacity ${COLLAGE_OUT_MS}ms ease, transform ${COLLAGE_OUT_MS}ms ease`,
              }}
            >
              <img
                src={src}
                alt=""
                onError={() =>
                  setFailed((f) => (f.includes(src) ? f : [...f, src]))
                }
                className="h-full w-full object-cover"
                style={{ opacity: broken ? 0 : 1 }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export function CharacterCollage({
  className = "",
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (!animated) return;
    const timer = window.setInterval(
      () => setShown((value) => !value),
      COLLAGE_SHOW_MS,
    );
    return () => window.clearInterval(timer);
  }, [animated]);

  const images = [
    { src: soulExamples[0], className: "left-[28px] top-[62px] z-[1] h-[124px] w-[116px] -rotate-[9deg] rounded-[14px]" },
    { src: soulExamples[1], className: "left-[132px] top-[56px] z-[2] h-[124px] w-[116px] rotate-[2deg] rounded-[14px]" },
    { src: soulExamples[2], className: "left-[244px] top-[58px] z-[3] h-[128px] w-[128px] rounded-full" },
    { src: characterCollageFourth, fallbackSrc: soulExamples[3], className: "left-[308px] top-[56px] z-[4] h-[124px] w-[120px] rotate-[2deg] rounded-[16px]" },
  ];

  return (
    <div className={`pointer-events-none ${className}`}>
      {images.map((image) => (
        <SafeImage
          key={image.src}
          src={image.src}
          fallbackSrc={image.fallbackSrc}
          alt=""
          className={`absolute object-cover shadow-lg transition-all duration-500 ${image.className} ${animated ? (shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-90 opacity-0") : ""}`}
        />
      ))}
    </div>
  );
}
