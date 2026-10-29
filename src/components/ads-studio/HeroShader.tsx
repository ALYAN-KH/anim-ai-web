"use client";

import { useEffect, useRef } from "react";
import { createReferenceShader } from "./reference-shader";

/** Slowly drifting dot grid behind the hero; static when reduced motion is requested. */
export function HeroShader({ reference = false }: { reference?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (reference && canvas) {
      try {
        const renderer = createReferenceShader(canvas, { background: { dark: "#000000" }, onError: () => { canvas.style.visibility = "hidden"; } });
        return () => renderer.destroy();
      } catch {
        canvas.style.visibility = "hidden";
        return;
      }
    }
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const draw = (t: number) => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const gap = 8;
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const fade = Math.max(0, 1 - Math.hypot((x - w / 2) / (w / 2), (y - h * 0.35) / (h * 0.75)));
          const wave = 0.5 + 0.5 * Math.sin(x * 0.02 + y * 0.03 + t / 1800);
          ctx.fillStyle = `rgba(255,255,255,${(0.05 + 0.16 * wave) * fade})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [reference]);
  if (reference) return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[400px] w-full opacity-[0.22] grayscale contrast-[0.88] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_70%,transparent),linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]" />;
  return <canvas ref={ref} width={1216} height={520} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-2rem] -z-10 h-[32.5rem] w-full max-w-[76rem] -translate-x-1/2 [mask-image:linear-gradient(black_60%,transparent)]" />;
}
