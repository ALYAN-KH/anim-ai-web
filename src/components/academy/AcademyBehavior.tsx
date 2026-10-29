"use client";
import { useEffect } from "react";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const play = (v: HTMLVideoElement) => { v.muted = true; v.defaultMuted = true; v.setAttribute("playsinline", ""); v.play().catch(() => {}); };

/** Wires the static Academy markup: hero player, before/after previews, tabs and FAQ accordion. */
export function AcademyBehavior() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-academy-root]");
    if (!root) return;
    const cleanups: (() => void)[] = [];

    // Hero player
    const player = root.querySelector<HTMLElement>("[data-video-player]");
    const hero = player?.querySelector("video");
    if (player && hero) {
      play(hero);
      hero.addEventListener("canplay", () => { if (hero.paused && !hero.ended && !userPaused) play(hero); });
      let userPaused = false;
      const q = <T extends HTMLElement>(s: string) => player.querySelector<T>(s);
      const pauseBtn = q<HTMLButtonElement>("button[aria-label='Pause video'], button[aria-label='Play video']");
      const muteBtn = q<HTMLButtonElement>("button[aria-label='Unmute video'], button[aria-label='Mute video']");
      const fsBtn = q<HTMLButtonElement>("button[aria-label='Fullscreen video']");
      const seek = q<HTMLInputElement>("input[aria-label='Video progress']");
      const volume = q<HTMLInputElement>("input[aria-label='Video volume']");
      const time = q<HTMLElement>("time");
      const rail = player.querySelectorAll<HTMLElement>("span.absolute.top-0.h-full");
      const knob = player.querySelector<HTMLElement>("span.absolute.top-1\\/2.h-3.w-1");
      const sync = () => {
        const d = hero.duration || 122.25;
        const p = (hero.currentTime / d) * 100;
        if (seek) { seek.max = String(d); seek.value = String(hero.currentTime); }
        if (time) time.textContent = `${fmt(hero.currentTime)} / ${fmt(d)}`;
        if (rail[0]) rail[0].style.left = `min(100%, ${p}% + 0.375rem)`;
        if (rail[1]) { rail[1].style.left = `min(100%, ${p}% + 0.375rem)`; rail[1].style.width = "0px"; }
        if (rail[2]) rail[2].style.width = `max(0px, ${p}% - 0.375rem)`;
        if (knob) knob.style.left = `${p}%`;
      };
      const toggle = () => { userPaused = !hero.paused; if (userPaused) hero.dataset.up = "1"; else delete hero.dataset.up; if (hero.paused) hero.play().catch(() => {}); else hero.pause(); };
      const onState = () => pauseBtn?.setAttribute("aria-label", hero.paused ? "Play video" : "Pause video");
      hero.addEventListener("play", onState);
      hero.addEventListener("pause", onState);
      const onSeek = () => { if (seek) hero.currentTime = Number(seek.value); };
      const syncVolume = () => {
        const value = hero.muted ? 0 : hero.volume;
        if (volume) {
          volume.value = String(value);
          const rail = volume.parentElement?.querySelector<HTMLElement>("div > div");
          const thumb = volume.parentElement?.querySelector<HTMLElement>("span");
          if (rail) rail.style.width = `${value * 100}%`;
          if (thumb) thumb.style.left = `${value * 100}%`;
        }
        muteBtn?.setAttribute("aria-label", value === 0 ? "Unmute video" : "Mute video");
      };
      const onMute = () => { hero.muted = !hero.muted; if (!hero.muted && !hero.volume) hero.volume = 1; syncVolume(); };
      const onVolume = () => { hero.volume = Number(volume?.value ?? 1); hero.muted = hero.volume === 0; syncVolume(); };
      const onFs = () => {
        const request = document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen?.();
        request?.catch(() => {});
      };
      const onFullscreen = () => fsBtn?.setAttribute("aria-pressed", String(document.fullscreenElement === player));
      hero.addEventListener("timeupdate", sync);
      hero.addEventListener("click", toggle);
      pauseBtn?.addEventListener("click", toggle);
      muteBtn?.addEventListener("click", onMute);
      fsBtn?.addEventListener("click", onFs);
      seek?.addEventListener("input", onSeek);
      volume?.addEventListener("input", onVolume);
      hero.addEventListener("loadedmetadata", sync);
      document.addEventListener("fullscreenchange", onFullscreen);
      player.querySelector("[draggable]")?.removeAttribute("draggable");
      onState();
      sync();
      syncVolume();
      cleanups.push(() => {
        hero.removeEventListener("play", onState);
        hero.removeEventListener("pause", onState);
        hero.removeEventListener("timeupdate", sync);
        hero.removeEventListener("click", toggle);
        pauseBtn?.removeEventListener("click", toggle);
        muteBtn?.removeEventListener("click", onMute);
        fsBtn?.removeEventListener("click", onFs);
        seek?.removeEventListener("input", onSeek);
        volume?.removeEventListener("input", onVolume);
        hero.removeEventListener("loadedmetadata", sync);
        document.removeEventListener("fullscreenchange", onFullscreen);
      });
    }

    // Before / after previews
    const pair = root.querySelector<HTMLElement>(".q-tabs-panel .relative.grid");
    if (pair) {
      const vids = Array.from(pair.querySelectorAll("video"));
      let paused = false;
      let visible = false;
      const apply = () => vids.forEach((v) => {
        if (visible && !paused) { if (v.preload === "none") v.preload = "auto"; play(v); } else v.pause();
      });
      // The previews start unloaded, so a first play() can be dropped: retry once data arrives.
      const onReady = () => apply();
      vids.forEach((v) => v.addEventListener("canplay", onReady));
      // Browsers may refuse autoplay until the page has had a gesture; retry on the first one.
      const onGesture = () => { apply(); if (hero && hero.paused && !hero.ended && !hero.dataset.up) play(hero); };
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) => window.addEventListener(t, onGesture, { once: true, passive: true }));
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; apply(); }, { threshold: 0.05 });
      io.observe(pair);
      const btn = pair.querySelector<HTMLButtonElement>("button[aria-label$='previews']");
      const onClick = () => {
        paused = !paused;
        btn?.setAttribute("aria-label", paused ? "Play previews" : "Pause previews");
        apply();
      };
      btn?.addEventListener("click", onClick);
      cleanups.push(() => { io.disconnect(); btn?.removeEventListener("click", onClick); vids.forEach((v) => v.removeEventListener("canplay", onReady)); ["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) => window.removeEventListener(t, onGesture)); });
    }

    // Restore the reference panels and keep pointer and keyboard navigation in sync.
    const tabs = Array.from(root.querySelectorAll<HTMLElement>("[role=tab]"));
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[role=tabpanel]"));
    const ind = root.querySelector<HTMLElement>(".q-tabs-indicator");
    const selectTab = (t: HTMLElement) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        if (on) x.setAttribute("data-active", ""); else x.removeAttribute("data-active");
      });
      panels.forEach((panel, i) => {
        const active = tabs[i] === t;
        const changed = panel.hidden === active;
        panel.hidden = !active;
        panel.setAttribute("aria-labelledby", tabs[i].id);
        tabs[i].setAttribute("aria-controls", panel.id);
        panel.querySelectorAll("video").forEach((video) => {
          if (active && changed) play(video); else if (!active) video.pause();
        });
      });
      if (ind) {
        ind.hidden = false;
        ind.style.setProperty("--active-tab-left", `${t.offsetLeft}px`);
        ind.style.setProperty("--active-tab-right", `${t.parentElement!.scrollWidth - t.offsetLeft - t.offsetWidth}px`);
        ind.style.setProperty("--active-tab-width", `${t.offsetWidth}px`);
        ind.style.setProperty("--active-tab-top", `${t.offsetTop}px`);
        ind.style.setProperty("--active-tab-height", `${t.offsetHeight}px`);
      }
    };
    tabs.forEach((t, i) => {
      const h = () => selectTab(t);
      const key = (event: KeyboardEvent) => {
        const index = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (i + 1) % tabs.length : event.key === "ArrowLeft" ? (i + tabs.length - 1) % tabs.length : -1;
        if (index < 0) return;
        event.preventDefault();
        selectTab(tabs[index]);
        tabs[index].focus();
      };
      t.addEventListener("click", h);
      t.addEventListener("keydown", key);
      cleanups.push(() => { t.removeEventListener("click", h); t.removeEventListener("keydown", key); });
    });
    if (tabs[0]) selectTab(tabs[0]);
    const resize = new ResizeObserver(() => {
      const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
      if (active) selectTab(active);
    });
    if (tabs[0]?.parentElement) resize.observe(tabs[0].parentElement);
    cleanups.push(() => resize.disconnect());

    // FAQ accordion
    const items = Array.from(root.querySelectorAll<HTMLElement>(".q-accordion-item"));
    const setOpen = (item: HTMLElement, open: boolean) => {
      const btn = item.querySelector<HTMLButtonElement>("button");
      const panel = item.querySelector<HTMLElement>(".q-accordion-panel");
      const header = item.querySelector<HTMLElement>(".q-accordion-header");
      btn?.setAttribute("aria-expanded", String(open));
      [item, header, panel].forEach((el) => {
        if (!el) return;
        if (open) { el.setAttribute("data-open", ""); el.removeAttribute("data-closed"); }
        else { el.removeAttribute("data-open"); el.setAttribute("data-closed", ""); }
      });
      if (btn) { if (open) btn.setAttribute("data-panel-open", ""); else btn.removeAttribute("data-panel-open"); }
      if (panel) panel.hidden = !open;
    };
    items.forEach((item) => {
      const btn = item.querySelector("button");
      const h = () => {
        const willOpen = btn?.getAttribute("aria-expanded") !== "true";
        items.forEach((o) => setOpen(o, false));
        setOpen(item, willOpen);
      };
      btn?.addEventListener("click", h);
      cleanups.push(() => btn?.removeEventListener("click", h));
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
