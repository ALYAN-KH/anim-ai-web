import { Check, Diamond } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AUTH_SLIDE_MS, AUTH_SLIDES, useMediaQuery } from "./auth";

export function AuthMediaCarousel() {
  const [index, setIndex] = useState(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const fills = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const active = AUTH_SLIDES[index];

  useEffect(() => {
    fills.current.forEach((fill, i) => {
      if (fill) fill.style.width = i < index ? "100%" : "0%";
    });

    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        if (!reduced) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [index, reduced]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed += Math.min(now - last, 100); // ignore long gaps (hidden tab)
      last = now;
      const video = active.type === "video" ? videos.current[index] : null;
      const duration =
        video && Number.isFinite(video.duration) && video.duration > 0
          ? video.duration * 1000
          : AUTH_SLIDE_MS;
      const p = Math.min(
        video && video.duration > 0
          ? video.currentTime / video.duration
          : elapsed / duration,
        1,
      );
      const el = fills.current[index];
      if (el) el.style.width = `${p * 100}%`;
      if (p >= 0.999) setIndex((i) => (i + 1) % AUTH_SLIDES.length);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active.type, index, reduced]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-black">
      {AUTH_SLIDES.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.type === "video" ? (
            <video
              ref={(el) => {
                videos.current[i] = el;
              }}
              src={s.src}
              poster={s.poster}
              muted
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              aria-label={s.title}
              className="block h-full w-full object-cover object-center"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.src}
              alt={s.title}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="block h-full w-full object-cover object-center"
            />
          )}
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-8 p-5">
        <div className="flex flex-col gap-3">
          {active.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1">
              {active.tags.map((t) => (
                <li
                  key={t.text}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold leading-[14px] text-white backdrop-blur-lg"
                >
                  {t.icon === "diamond" ? (
                    <Diamond
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Check
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  )}
                  {t.text}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col gap-1.5">
            <h2 className="font-grotesk text-[40px] font-bold uppercase leading-[48px] tracking-[-0.8px] text-white">
              {active.title}
            </h2>
            <p className="text-sm leading-5 text-white/50">
              {active.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            {AUTH_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show ${s.label}`}
                onClick={() => setIndex(i)}
                className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
              >
                <div
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  className="h-full rounded-full bg-white"
                  style={{ width: i < index ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {AUTH_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`min-w-0 flex-1 truncate text-left text-xs leading-[18px] transition-colors ${
                  i === index
                    ? "font-medium text-white"
                    : "font-normal text-white/40 hover:text-white/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


