"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./course-detail.module.css";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Same inner-viewport scrolling as the Academy catalogue: the page is locked and this pane scrolls under the shared header. */
export function AcademyPane({ children }: { children: ReactNode }) {
  const pane = useRef<HTMLElement>(null);
  useIsomorphicLayoutEffect(() => {
    const element = pane.current;
    if (!element) return;
    const html = document.documentElement, body = document.body;
    const previous = [html.style.overflow, body.style.overflow, html.style.height, body.style.height];
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    html.style.height = "100%"; body.style.height = "100dvh";
    const measure = () => element.style.setProperty("--academy-header-height", `${Math.max(0, element.getBoundingClientRect().top)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    const header = document.querySelector("body header");
    if (header) observer.observe(header);
    window.addEventListener("resize", measure);
    return () => {
      [html.style.overflow, body.style.overflow, html.style.height, body.style.height] = previous;
      observer.disconnect(); window.removeEventListener("resize", measure);
    };
  }, []);
  return <main ref={pane} className={styles.pane} data-academy-detail="" data-theme="default-dark" data-academy-scroll-container="true">{children}</main>;
}
