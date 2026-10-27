"use client";
import { useEffect, useRef } from "react";

export function useViewportOffset<T extends HTMLElement>(cssVar = "--audio-top") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const apply = () => {
      const node = ref.current;
      if (!node) return;
      const top = node.getBoundingClientRect().top + window.scrollY;
      node.style.setProperty(cssVar, `${Math.max(top, 0)}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(document.body);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [cssVar]);

  return ref;
}
