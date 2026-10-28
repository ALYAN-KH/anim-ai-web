"use client";

import { useEffect, useState } from "react";

/** Animate empty-field examples without changing the user's input. */
export function useTypingPlaceholder(text: string, enabled = true) {
  const [visible, setVisible] = useState("");
  useEffect(() => {
    if (!enabled) { setVisible(""); return; }
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    let deleting = false;
    const tick = () => {
      if (motion.matches) { setVisible(text); return; }
      count += deleting ? -1 : 1;
      setVisible(text.slice(0, count));
      let delay = deleting ? 35 : 85;
      if (count === text.length) { deleting = true; delay = 1800; }
      if (count === 0) { deleting = false; delay = 500; }
      timer = setTimeout(tick, delay);
    };
    const start = () => {
      clearTimeout(timer);
      count = 0;
      deleting = false;
      if (motion.matches) setVisible(text);
      else { setVisible(""); timer = setTimeout(tick, 350); }
    };
    start();
    motion.addEventListener("change", start);
    return () => { clearTimeout(timer); motion.removeEventListener("change", start); };
  }, [text, enabled]);
  return visible;
}
