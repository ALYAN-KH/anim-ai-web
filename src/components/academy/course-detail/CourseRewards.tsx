"use client";

import { useEffect, useRef } from "react";

/* Spring tilt from the reference reward-motion helper: values and physics are unchanged. */
const FEEL = { tiltX: 4, tiltY: 6, perspective: 960, k: 170, c: 16 };
const STEP = 1 / 240, MAX_FRAME = 0.064, REST = 5e-4;
type Spring = { value: number; velocity: number; target: number };
const spring = (): Spring => ({ value: 0, velocity: 0, target: 0 });
const clamp = (v: number) => Math.min(1, Math.max(-1, v));
const settled = (s: Spring) => Math.abs(s.value - s.target) < REST && Math.abs(s.velocity) < REST;

function attachTilt(card: HTMLElement) {
  const plane = card.querySelector<HTMLElement>("[data-tilt-plane]") ?? card;
  const foils = Array.from(card.querySelectorAll<HTMLElement>("[data-tilt-foil]"));
  const style = getComputedStyle(card);
  const feel = { ...FEEL };
  (Object.entries({ tiltX: "--ar-track-tilt-x", tiltY: "--ar-track-tilt-y", perspective: "--ar-track-tilt-perspective", k: "--ar-track-tilt-k", c: "--ar-track-tilt-c" }) as [keyof typeof FEEL, string][])
    .forEach(([key, prop]) => { const n = Number.parseFloat(style.getPropertyValue(prop)); if (Number.isFinite(n)) feel[key] = n; });
  const x = spring(), y = spring(), hover = spring();
  let frame = 0, last = 0, carry = 0, box: DOMRect | null = null, running = false;

  const tick = (now: number) => {
    carry += Math.min(MAX_FRAME, (now - last) / 1000); last = now;
    for (; carry >= STEP; carry -= STEP) for (const s of [x, y, hover]) {
      s.velocity += (-feel.k * (s.value - s.target) - feel.c * s.velocity) * STEP;
      s.value += s.velocity * STEP;
    }
    if (hover.target === 0 && [x, y, hover].every(settled)) {
      running = false;
      card.removeAttribute("data-tilting");
      plane.style.removeProperty("transform");
      foils.forEach(f => ["--mx", "--my", "--hv"].forEach(p => f.style.removeProperty(p)));
      return;
    }
    plane.style.transform = `perspective(${feel.perspective}px) rotateX(${(y.value * -feel.tiltX).toFixed(3)}deg) rotateY(${(x.value * feel.tiltY).toFixed(3)}deg)`;
    foils.forEach(f => { f.style.setProperty("--mx", x.value.toFixed(3)); f.style.setProperty("--my", y.value.toFixed(3)); f.style.setProperty("--hv", hover.value.toFixed(3)); });
    frame = requestAnimationFrame(tick);
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!running) { running = true; card.setAttribute("data-tilting", ""); last = performance.now(); frame = requestAnimationFrame(tick); }
    box ??= card.getBoundingClientRect();
    x.target = clamp((e.clientX - box.left) / box.width * 2 - 1);
    y.target = clamp((e.clientY - box.top) / box.height * 2 - 1);
    hover.target = 1;
  };
  const leave = () => { box = null; x.target = 0; y.target = 0; hover.target = 0; };
  card.addEventListener("pointerenter", move);
  card.addEventListener("pointermove", move);
  card.addEventListener("pointerleave", leave);
  return () => {
    cancelAnimationFrame(frame);
    card.removeEventListener("pointerenter", move);
    card.removeEventListener("pointermove", move);
    card.removeEventListener("pointerleave", leave);
  };
}

/** Original reward cards (certificate, achievement, creator drop). Their actions stay disabled: nothing here can unlock or claim a reward. */
export function CourseRewards({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cleanups = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-reward-kind]") ?? []).map(attachTilt);
    return () => cleanups.forEach(fn => fn());
  }, [html]);
  return <div ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
